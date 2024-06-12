import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.26',
    settings: {
      viaIR: true, // Gas optimization, yul optimizer
      optimizer: {
        enabled: true, // Gas optimization
        runs: 200,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: process.env.SEPOLIA_RPC_URL ?? '',
        blockNumber: 5867256,
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC_SEPOLIA,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY ?? '',
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    trackGasDeltas: true,
  },
};

export default config;
