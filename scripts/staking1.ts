// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { DepositContract } from "../typechain";
import { BOACoin } from "../utils/Amount";
import { GasPriceManager } from "../utils/GasPriceManager";

import { utils, Wallet } from "ethers";
import { ethers } from "hardhat";

import { NonceManager } from "@ethersproject/experimental";

import fs from "fs";

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

async function main() {
    const ContractFactory = await ethers.getContractFactory("DepositContract");
    const contract = ContractFactory.attach(process.env.DEPOSIT_CONTRACT_ADDRESS || "") as DepositContract;
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const admin_signer = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const deposit_data = JSON.parse(fs.readFileSync("./validator_keys1/deposit_data-1658734467.json", "utf-8"));

    for (const elem of deposit_data) {
        console.log(`public key: ${elem.pubkey}`);

        await contract
            .connect(admin_signer)
            .deposit(
                prefix0X(elem.pubkey),
                prefix0X(elem.withdrawal_credentials),
                prefix0X(elem.signature),
                prefix0X(elem.deposit_data_root),
                { from: admin.address, value: TX_VALUE }
            );

        await delay(1000);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
