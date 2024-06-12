import { expect } from 'chai';
import { ethers, deployments } from 'hardhat';
import { MyERC20, SwapperFacet, AdminFacet } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { setupFixture } from './utils/fixture';

const USDC_SEPOLIA = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8';

describe('SwapperDiamond', () => {
  let swapperFacet: SwapperFacet;
  let adminFacet: AdminFacet;

  beforeEach(async () => {
    await deployments.fixture(['all']);

    ({ swapperFacet, adminFacet } = await setupFixture());
  });

  it('deploys the facet independently for deployment gas cost report', async () => {
    const adminFacet = await ethers.getContractFactory('AdminFacet');
    await adminFacet.deploy();
  });

  it('reverts when contract is paused', async () => {
    await adminFacet.pause();
    await expect(
      swapperFacet.swapEtherToToken(USDC_SEPOLIA, 1, {
        value: ethers.parseEther('0.001'),
      })
    ).to.be.revertedWithCustomError(swapperFacet, 'ContractIsPaused');
  });

  it('successfully passes pause check after pausing and unpausing', async () => {
    await adminFacet.pause();
    await adminFacet.unpause();

    await expect(
      swapperFacet.swapEtherToToken(USDC_SEPOLIA, 1, {
        value: ethers.parseEther('0.001'),
      })
    ).to.not.be.reverted;
  });
});
