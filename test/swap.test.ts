import { expect } from 'chai';
import { ethers, deployments } from 'hardhat';
import { Swapper, MyERC20 } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { getSigners } from './utils/signers';

const USDC_SEPOLIA = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8';

describe('Swapper', () => {
  let swapper: Swapper;
  let myERC20: MyERC20;
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture(['all']);
    swapper = await ethers.getContract('Swapper');
    myERC20 = await ethers.getContract('MyERC20');

    ({ deployer } = await getSigners());
  });

  it('reverts when msg.value is zero', async () => {
    await expect(
      swapper.swapEtherToToken(USDC_SEPOLIA, 1, {
        value: 0,
      })
    ).to.be.revertedWithCustomError(swapper, 'EthAmountIsZero');
  });

  it('reverts when token pool is missing', async () => {
    await expect(
      swapper.swapEtherToToken(await myERC20.getAddress(), 1, {
        value: ethers.parseEther('0.001'),
      })
    ).to.be.revertedWithCustomError(swapper, 'TokenPoolIsMissing');
  });

  it('successfully exchanges ETH to USDC', async () => {
    const nonZero = (amount: number) => amount > 0;

    await expect(
      swapper.swapEtherToToken(USDC_SEPOLIA, 1, {
        value: ethers.parseEther('0.001'),
      })
    )
      .to.emit(swapper, 'Swapped')
      .withArgs(deployer.address, USDC_SEPOLIA, nonZero);
  });
});
