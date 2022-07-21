// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { DepositContract } from "../typechain";
import { GasPriceManager } from "../utils/GasPriceManager";

import { BigNumber, utils, Wallet } from "ethers";
import { ethers } from "hardhat";

import { NonceManager } from "@ethersproject/experimental";
import { keccak256 } from "@ethersproject/keccak256";

import fs from "fs";

const pricePerValidator = BigNumber.from(32);
const TX_VALUE = pricePerValidator.mul(BigNumber.from(10).pow(18));

function prefix0X(key: string): string {
    return `0x${key}`;
}

async function main() {
    const ContractFactory = await ethers.getContractFactory("DepositContract");
    const contract = ContractFactory.attach(process.env.DEPOSIT_CONTRACT_ADDRESS || "") as DepositContract;
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const admin_signer = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const deposit_data = JSON.parse(fs.readFileSync("./validator_keys/deposit_data-1652070719.json", "utf-8"));

    for (const elem of deposit_data) {
        const new_bytes = utils.arrayify("0x" + elem.pubkey);
        const new_key = keccak256(new_bytes);
        const address = utils.getAddress(new_key.substring(26));
        console.log(`public key: ${elem.pubkey}; address: ${address}`);

        const res = await contract.connect(admin_signer).deposit(
            prefix0X(elem.pubkey),
            prefix0X(elem.withdrawal_credentials),
            prefix0X(elem.signature),
            prefix0X(elem.deposit_data_root),
            {from: admin.address, value: TX_VALUE}
        );

        const receipt = await res.wait();
        console.log(
            `    gasUsed: ${receipt.gasUsed}; blockNumber: ${receipt.blockNumber}; confirmations: ${receipt.confirmations} `
        );
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
