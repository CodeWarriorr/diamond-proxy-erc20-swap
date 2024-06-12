import { expect } from 'chai';
import { ethers, deployments } from 'hardhat';
import { MyERC20, SwapperFacet } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { setupFixture } from './utils/fixture';

const USDC_SEPOLIA = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8';

describe('SwapperDiamond', () => {
  let swapperFacet: SwapperFacet;
  let myERC20: MyERC20;
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture(['all']);

    ({ deployer, swapperFacet, myERC20 } = await setupFixture());
  });

  it('deploys the facet independently for deployment gas cost report', async () => {
    const swapperFacet = await ethers.getContractFactory('SwapperFacet');
    await swapperFacet.deploy();
  });

  it('reverts when msg.value is zero', async () => {
    await expect(
      swapperFacet.swapEtherToToken(USDC_SEPOLIA, 1, {
        value: 0,
      })
    ).to.be.revertedWithCustomError(swapperFacet, 'EthAmountIsZero');
  });

  it('reverts when token pool is missing', async () => {
    await expect(
      swapperFacet.swapEtherToToken(await myERC20.getAddress(), 1, {
        value: ethers.parseEther('0.001'),
      })
    ).to.be.revertedWithCustomError(swapperFacet, 'TokenPoolIsMissing');
  });

  it('successfully exchanges ETH to USDC', async () => {
    const nonZero = (amount: number) => amount > 0;

    await expect(
      swapperFacet.swapEtherToToken(USDC_SEPOLIA, 1, {
        value: ethers.parseEther('0.001'),
      })
    )
      .to.emit(swapperFacet, 'Swapped')
      .withArgs(deployer.address, USDC_SEPOLIA, nonZero);
  });
});
