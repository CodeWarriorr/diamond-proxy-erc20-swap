import { deployments } from 'hardhat';
import { AdminFacet, MyERC20, SwapperFacet } from '../../typechain-types';

export const setupFixture = deployments.createFixture(
  async ({ deployments, getNamedAccounts, ethers }, options) => {
    const { deployer: deployerAddress } = await getNamedAccounts();
    await deployments.fixture();

    const deployer = await ethers.getSigner(deployerAddress);

    const swapperDiamondDeployment = await deployments.get('SwapperDiamond');
    const swapperDiamondAddress = swapperDiamondDeployment.address;

    const swapperFacet = (await ethers.getContractAtWithSignerAddress(
      'SwapperFacet',
      swapperDiamondAddress,
      deployerAddress
    )) as SwapperFacet;

    const adminFacet = (await ethers.getContractAtWithSignerAddress(
      'AdminFacet',
      swapperDiamondAddress,
      deployerAddress
    )) as AdminFacet;

    const myERC20 = (await ethers.getContract('MyERC20')) as MyERC20;

    return {
      deployer,
      swapperFacet,
      adminFacet,
      myERC20,
    };
  }
);
