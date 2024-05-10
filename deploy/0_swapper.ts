import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const deployment = await deploy('Swapper', {
    from: deployer,
    args: [],
  });

  console.log('Swapper address', deployment.address);
};

export default func;
func.tags = ['swapper', 'all'];
func.dependencies = [];
