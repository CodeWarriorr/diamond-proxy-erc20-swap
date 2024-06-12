// SPDX-License-Identifier: MIT
pragma solidity =0.8.26;

import { WithModifiers } from "../libraries/LibStorage.sol";
import { Pausable } from "@solidstate/contracts/security/pausable/Pausable.sol";

/**
 * @title AdminFacet
 * @author codewarriorr@pm.me
 * @notice Admin contract management functions
 */
contract AdminFacet is WithModifiers, Pausable {
    /**
     * @notice Pause the contract and prevent critical functions from being called
     */
    function pause() external isOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external isOwner {
        _unpause();
    }
}
