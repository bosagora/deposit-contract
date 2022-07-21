# Deposit Contract

## install
```shell
$ npm install
```

## build
```shell
$ npm run build
```

## copy .env
```shell
cp env/.env.sample env/.env
```

## deploy
The following command will print the address of the deployed smart contract.  
```shell
$ npx hardhat run scripts/deploy.ts --network devnet
deployed to: 0xeEdC2Ac65dF232AB6d229EBD4E3F564e194ffe7D
```

You should record the address of the smart contract in `.env`
Below is the file `.env`.
```shell
MAIN_NET_URL=https://mainnet.bosagora.org
TEST_NET_URL=https://testnet.bosagora.org
DEV_NET_URL=https://devnet.bosagora.info

ADMIN_KEY=0xd7912c64125d466be55d2ac220834571a39ff9abeb9ad6dfb6afe9a3a433ba7d

DEPOSIT_CONTRACT_ADDRESS=0xeEdC2Ac65dF232AB6d229EBD4E3F564e194ffe7D
```

## staking
```shell
$ npx hardhat run scripts/staking.ts --network devnet
No need to generate any newer typings.
pubkey: a16bd98b86ac9224e0bcca8e0a9180af4a542a6a6dd7451285cc8e49e68b3e2b541f60b3790b99041c0a5b96311cb37f
withdrawal_credentials: 00605c3e914386271a3986db849d3d635f3e3cff5a027ed431cc4c3df84cd04d
amount: 32000000000
signature: 9717466c37a143a9e4b763a7790f368f6b83a135818a90872d340cf697eec8ef9b828e2e1c0e911b39dfa46fd12cc5eb11e3f10b62d02d20614371be62d0fce359520f9fe328e5a3d0793acbc6d76613868e1f5463c74d52dfa7e86e1f8aff3c
deposit_data_root: bc6bf2e3aefcfe5b07d5206a5979f53189e965d61f3f99a320501b2d4e9889e0
```

## check balance of deposit contract
```shell
$ npx hardhat run scripts/balance.ts --network devnet
No need to generate any newer typings.
admin   : 99999999983280688000000000
deposit  : 32000000000000000000
```
