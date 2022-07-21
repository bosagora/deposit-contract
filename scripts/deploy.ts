// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { DepositContract } from "../typechain";
import { GasPriceManager } from "../utils/GasPriceManager";

import { Wallet } from "ethers";
import { ethers } from "hardhat";

import { NonceManager } from "@ethersproject/experimental";

async function main() {
    const ContractFactory = await ethers.getContractFactory("DepositContract");

    const provider = ethers.provider;
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const contract = (await ContractFactory.connect(adminSigner).deploy()) as DepositContract;
    await contract.deployed();

    const receipt = await contract.deployTransaction.wait();

    console.log("deployed to (address) :", contract.address);
    console.log("deployed at (blockNumber) :", receipt.blockNumber);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
