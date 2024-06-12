// SPDX-License-Identifier: MIT
pragma solidity =0.8.26;

import { LibDiamond } from "hardhat-deploy/solc_0.8/diamond/libraries/LibDiamond.sol";
import { IERC20 } from "@solidstate/contracts/interfaces/IERC20.sol";
import { PausableStorage } from "@solidstate/contracts/security/pausable/PausableStorage.sol";
import { CommonErrors } from "../interfaces/CommonErrors.sol";

struct AppStorage {
    bool isInitialized;
}

contract WithModifiers {
    modifier isOwner() {
        require(LibDiamond.contractOwner() == msg.sender, "Must be contract owner");
        _;
    }

    modifier isNotPaused() {
        if (PausableStorage.layout().paused) {
            revert CommonErrors.ContractIsPaused();
        }
        _;
    }
}

contract WithStorage {
    bytes32 private constant APP_STORAGE_SLOT = keccak256("storage.slot.app");

    function a() internal pure returns (AppStorage storage appStorage) {
        bytes32 slot = APP_STORAGE_SLOT;
        assembly {
            appStorage.slot := slot
        }
    }

    function ds() internal pure returns (LibDiamond.DiamondStorage storage) {
        return LibDiamond.diamondStorage();
    }
}
