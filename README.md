# Uniswap Eth to Token Swap

## Values 
WETH and UniversalRouter addresses: https://github.com/Uniswap/universal-router/commit/e11132c8f1eabe5bdfc31f631881959a6ff8c06a

## Usage 

Steps respectively:
- Copy the .env.example file to .env and fill in the values
- Install dependencies
- Compile 
- Test the contract(s)

```
npm install -f
cp .env.example .env
npx hardhat compile
npx hardhat test
```

# Overview

## Optimisations 

Contract has been optimized for gas costs in the following ways:
- use of custom errors to reduce gas costs
- use of immutable variables
- use of viaIR (yul optimizer)
- use of optimizer runs (200 runs, more runs produce diminishing returns - deployment cost increases and execution gas savings are not significant)
- router commands have been packed without creating an array

Contract could be further optimized by:
- using a conditional check for WETH and Universal Router approvals (with larger pre-approvals and without approve every time)
- using checkPool before execution and remove the need for the factory getPool call and the require statement


## Upgradability

I've decided that I will use Diamond Proxy pattern for upgradability. Its obviously an overkill for this application, but I love it for modular approach and storage management. Diamonds make larger projects a breeze to maintain coparing to monolith contracts or interconnected contracts that are a nightmare to maintain.

Moreover diamond storage is REALY an awesome way to avoid storage collisions in ANY upgradable pattern! 

Last but not least, frequent upgrades of facets are possible without the need to redeploy the entire contract(s) and thus saving gas costs in the long run.

Deployment gas savings alternative proxy solutions: 
- UUPSProxy pattern
- Transparent Proxy pattern


