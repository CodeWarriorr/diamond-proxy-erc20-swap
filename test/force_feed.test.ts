import { expect } from 'chai';
import { ethers, deployments } from 'hardhat';
import { SwapperFacet, Feeder } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { setupFixture } from './utils/fixture';
import { getSigners } from './utils/signers';

describe('ForceFeed', () => {
  let swapperFacet: SwapperFacet;
  let feeder: Feeder;
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture(['all']);

    ({ swapperFacet, feeder } = await setupFixture());

    ({ deployer } = await getSigners());
  });

  it('resques funds when diamond is fed with a feeder', async () => {
    await deployer.sendTransaction({
      to: await feeder.getAddress(),
      value: ethers.parseEther('1'),
    });

    expect(
      await ethers.provider.getBalance(await feeder.getAddress())
    ).to.be.equal(ethers.parseEther('1'));

    await feeder.forceFeed(await swapperFacet.getAddress());

    expect(
      await ethers.provider.getBalance(await feeder.getAddress())
    ).to.be.equal(0);

    expect(
      await ethers.provider.getBalance(await swapperFacet.getAddress())
    ).to.be.equal(ethers.parseEther('1'));

    const balanceBefore = await ethers.provider.getBalance(deployer.address);

    await swapperFacet.rescue();

    expect(
      await ethers.provider.getBalance(await swapperFacet.getAddress())
    ).to.be.equal(0);

    const balanceAfter = await ethers.provider.getBalance(deployer.address);
    expect(balanceAfter).to.be.gt(balanceBefore);
  });
});
