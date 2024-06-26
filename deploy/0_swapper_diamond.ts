import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { diamond } = deployments;
  const { deployer } = await getNamedAccounts();

  await diamond.deploy('SwapperDiamond', {
    from: deployer,
    autoMine: true,
    log: true,
    waitConfirmations: 1,
    facets: ['SwapperFacet', 'AdminFacet'],
    execute: {
      contract: 'InitFacet',
      methodName: 'init',
      args: [],
    },
  });
};

export default func;
func.tags = ['swapper', 'all'];
func.dependencies = [];
