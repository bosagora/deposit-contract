import {NonceManager} from "@ethersproject/experimental";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import chai, {expect} from "chai";
import {solidity} from "ethereum-waffle";
import fs from "fs";
import {ethers} from "hardhat";
import {AgoraDepositContract} from "../typechain-types";
import {BOACoin} from "../utils/Amount";
import {GasPriceManager} from "../utils/GasPriceManager";

chai.use(solidity);

const pricePerValidator = 40000;
const TX_VALUE = BOACoin.make(pricePerValidator).value;

function prefix0X(key: string): string {
  return `0x${key}`;
}

function delay(interval: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, interval);
  });
}

describe("doposit_contract", () => {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployFixture() {
    const ContractFactory = await ethers.getContractFactory("AgoraDepositContract");

    const provider = ethers.provider;
    const [admin, otherAccount] = await ethers.getSigners();
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const contract = (await ContractFactory.connect(adminSigner).deploy()) as AgoraDepositContract;
    await contract.deployed();
    return { contract, admin, otherAccount };
  }
  describe("deposit_with_voter", () => {
    it("Deposit with voter", async () => {
      const { contract, admin} = await loadFixture(deployFixture);
      const deposit_data = JSON.parse(fs.readFileSync("./validator_keys/deposit_data.json", "utf-8"));
      for (const elem of deposit_data) {
        const voter_info = { voter: prefix0X(elem.voter.substring(24)), signature: prefix0X(elem.voter_signature), data_root: prefix0X(elem.voter_data_root) };
        const tx = await contract
            .connect(admin)
            .deposit_with_voter(
                prefix0X(elem.pubkey),
                prefix0X(elem.withdrawal_credentials),
                prefix0X(elem.signature),
                prefix0X(elem.deposit_data_root),
                voter_info,
                { from: admin.address, value: TX_VALUE }
            );
        await tx.wait();
        const voter = await contract.voterOf(prefix0X(elem.pubkey));
        expect(voter.toLowerCase()).to.equal(voter_info.voter);
      }
    });
  });
  describe("deposit_with_voter", () => {
    it("Should be Unable to change voting address", async () => {
      const { contract, admin} = await loadFixture(deployFixture);
      const deposit_data = JSON.parse(fs.readFileSync("./validator_keys/deposit_data.json", "utf-8"));
      for (const elem of deposit_data) {
        const voter_info = { voter: prefix0X(elem.voter.substring(24)), signature: prefix0X(elem.voter_signature), data_root: prefix0X(elem.voter_data_root) };
        const tx = await contract
            .connect(admin)
            .deposit_with_voter(
                prefix0X(elem.pubkey),
                prefix0X(elem.withdrawal_credentials),
                prefix0X(elem.signature),
                prefix0X(elem.deposit_data_root),
                voter_info,
                { from: admin.address, value: TX_VALUE }
            );
        await tx.wait();
        const voter = await contract.voterOf(prefix0X(elem.pubkey));
        expect(voter.toLowerCase()).to.equal(voter_info.voter);
      }
      for (const elem of deposit_data) {
        const voter_info = { voter: prefix0X("7c629Fa2AEe7b054a0Eb576Dd632aF8674c952A6"), signature: prefix0X(elem.voter_signature), data_root: prefix0X(elem.voter_data_root) };
        await expect(contract
            .connect(admin)
            .deposit_with_voter(
                prefix0X(elem.pubkey),
                prefix0X(elem.withdrawal_credentials),
                prefix0X(elem.signature),
                prefix0X(elem.deposit_data_root),
                voter_info,
                { from: admin.address, value: TX_VALUE }
            )).to.be.revertedWith(
            "DepositContract: Unable to change voting address"
        );
      }
    });
  });
  describe("deposit_with_voter", () => {
    it("Should revert fot not matching supplied voter_data_root", async () => {
      const { contract, admin} = await loadFixture(deployFixture);
      const deposit_data = JSON.parse(fs.readFileSync("./validator_keys/deposit_data.json", "utf-8"));
      for (const elem of deposit_data) {
        const voter_info = { voter: prefix0X("7c629Fa2AEe7b054a0Eb576Dd632aF8674c952A6"), signature: prefix0X(elem.voter_signature), data_root: prefix0X(elem.voter_data_root) };
        await expect(contract
            .connect(admin)
            .deposit_with_voter(
                prefix0X(elem.pubkey),
                prefix0X(elem.withdrawal_credentials),
                prefix0X(elem.signature),
                prefix0X(elem.deposit_data_root),
                voter_info,
                { from: admin.address, value: TX_VALUE }
            )).to.be.revertedWith(
            "DepositContract: reconstructed VoterData does not match supplied voter_data_root"
        );
      }
    });
  });
  describe("deposit", () => {
    it("Should revert on deposit", async () => {
      const { contract, admin} = await loadFixture(deployFixture);
      const deposit_data = JSON.parse(fs.readFileSync("./validator_keys/deposit_data.json", "utf-8"));
      for (const elem of deposit_data) {
        await expect(contract
            .connect(admin)
            .deposit(
                prefix0X(elem.pubkey),
                prefix0X(elem.withdrawal_credentials),
                prefix0X(elem.signature),
                prefix0X(elem.deposit_data_root),
                { from: admin.address, value: TX_VALUE }
            )).to.be.revertedWith(
            "This feature is not supported on the Agora network. Please use the 'deposit_with_voter'."
        );
        await delay(1000);
      }
    });
  });
});
