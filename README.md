# Listing Dapp

This is a web application that serves as the frontend for the ListingV3 smart contracts. By now it is only deployed to goerli test network.

## Tech Stack

* NextJs
* ReactJs
* TypeScript
* graphQL

## Getting Started

### First, add environment variables:

The application makes use of 2 environment variables, 
* NEXT_PUBLIC_CONTRACT_ADDRESS (Listing Proxy address)
* NEXT_PUBLIC_SUBGRAPH_URL (subgraph query url)

```bash
cp .env.local.exmaple .env.local
```

### Then, install the dependencies and run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Links

To learn more about the project, take a look at the following resources:

- https://listing-dapp.vercel.app - frontend
- https://goerli.etherscan.io/address/0xA3d8CD32d1C45f452682421B7d89bD523Af347b6 - smart contract on explorer
- https://github.com/llopez/listing-smart-contracts - smart contracts

