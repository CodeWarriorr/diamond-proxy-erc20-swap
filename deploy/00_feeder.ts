import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('Feeder', {
    from: deployer,
    args: [],
  });
};

export default func;
func.tags = ['feed', 'all'];
func.dependencies = [];
func.skip = async ({ network }) => {
  return network.name !== 'localhost' && network.name !== 'hardhat';
};
