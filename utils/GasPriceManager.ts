"use strict";

import "@nomiclabs/hardhat-web3";
import { BigNumber, ethers } from "ethers";
import * as hre from "hardhat";

export class GasPriceManager extends ethers.Signer {
    readonly signer: ethers.Signer;

    constructor(signer: ethers.Signer) {
        super();
        this.signer = signer;
        ethers.utils.defineReadOnly(this, "signer", signer);
        // @ts-ignore
        ethers.utils.defineReadOnly(this, "provider", signer.provider || null);
    }

    connect(provider: ethers.providers.Provider): GasPriceManager {
        return new GasPriceManager(this.signer.connect(provider));
    }

    getAddress(): Promise<string> {
        return this.signer.getAddress();
    }

    getTransactionCount(blockTag?: ethers.providers.BlockTag): Promise<number> {
        return this.signer.getTransactionCount(blockTag);
    }

    signMessage(message: ethers.Bytes | string): Promise<string> {
        return this.signer.signMessage(message);
    }

    signTransaction(transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>): Promise<string> {
        return this.signer.signTransaction(transaction);
    }

    sendTransaction(
        transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
    ): Promise<ethers.providers.TransactionResponse> {
        return hre.web3.eth.getGasPrice().then((gas_price: string) => {
            const received_gas_price = BigNumber.from(gas_price);
            transaction.gasPrice = received_gas_price.add(received_gas_price.div(10).mul(5));
            return this.signer.sendTransaction(transaction).then((tx) => {
                return tx;
            });
        });
    }
}
