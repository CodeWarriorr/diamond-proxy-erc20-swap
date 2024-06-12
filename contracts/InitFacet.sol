// SPDX-License-Identifier: MIT
pragma solidity =0.8.26;

import { IDiamondLoupe } from "hardhat-deploy/solc_0.8/diamond/interfaces/IDiamondLoupe.sol";
import { UsingDiamondOwner, IDiamondCut } from "hardhat-deploy/solc_0.8/diamond/UsingDiamondOwner.sol";
import { IERC165 } from "@solidstate/contracts/interfaces/IERC165.sol";
import { WithStorage } from "./libraries/LibStorage.sol";

contract InitFacet is UsingDiamondOwner, WithStorage {
    function init() external onlyOwner {
        if (a().isInitialized) return;

        ds().supportedInterfaces[type(IERC165).interfaceId] = true;
        ds().supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds().supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;

        // Any initialization of contract state should be done here

        a().isInitialized = true;
    }
}
