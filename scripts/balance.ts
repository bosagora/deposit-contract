// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { Wallet } from "ethers";
import {ethers} from "hardhat";

async function main() {
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const user = new Wallet(process.env.USER_KEY || "");

    const provider = ethers.provider;

    console.log("admin   : " + (await provider.getBalance(admin.address)).toString());
    console.log("user    : " + (await provider.getBalance(user.address)).toString());
    console.log(
        "deposit  : " + (await provider.getBalance(process.env.DEPOSIT_CONTRACT_ADDRESS || "")).toString()
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
