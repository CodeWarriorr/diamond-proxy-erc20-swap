import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployment = await deploy('MyERC20', {
    from: deployer,
    args: [],
  });

  console.log('MyERC20 address', deployment.address);
};

export default func;
func.tags = ['me2', 'all'];
func.dependencies = [];
func.skip = async ({ network }) => {
  return network.name !== 'localhost' && network.name !== 'hardhat';
};
