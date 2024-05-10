import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ethers, getNamedAccounts } from 'hardhat';

interface IGetSigners {
  deployer: SignerWithAddress;
}

export const getSigners = async (): Promise<IGetSigners> => {
  const { deployer } = await getNamedAccounts();

  return {
    deployer: await ethers.getSigner(deployer),
  };
};
