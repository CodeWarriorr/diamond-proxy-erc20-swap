// SPDX-License-Identifier: MIT
pragma solidity =0.8.24;

import { ERC20Swapper } from "./interfaces/ERC20Swapper.sol";
import { IUniswapV3Factory } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import { IUniversalRouter } from "@uniswap/universal-router/contracts/interfaces/IUniversalRouter.sol";
import { Commands } from "@uniswap/universal-router/contracts/libraries/Commands.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Swapper
 * @author codewarriorr@pm.me
 * @notice Simple contract to swap Ether to ERC-20 tokens using Uniswap V3 through Universal Router
 */
contract Swapper is ERC20Swapper {
    IUniswapV3Factory public constant uniswapFactory = IUniswapV3Factory(0x0227628f3F023bb0B980b67D528571c95c6DaC1c); // uniswap v3 factory (sepolia)
    IUniversalRouter public constant universalRouter = IUniversalRouter(0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD); // uniswap universal router (sepolia)
    address public constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14; // wrapped eth (sepolia)

    event Swapped(address indexed wallet, address indexed token, uint amount);

    error EthAmountIsZero();
    error TokenPoolIsMissing();

    function swapEtherToToken(address token, uint minAmount) public payable returns (uint) {
        if (msg.value == 0) {
            revert EthAmountIsZero();
        }

        uint256 deadline = block.timestamp + 15;
        uint24 fee = 3000;

        address pool = uniswapFactory.getPool(WETH, token, fee);
        if (pool == address(0)) {
            revert TokenPoolIsMissing();
        }

        uint balanceBefore = IERC20(token).balanceOf(msg.sender);

        IERC20(WETH).approve(address(universalRouter), msg.value);

        bytes memory commands = new bytes(2);
        commands[0] = bytes1(uint8(Commands.WRAP_ETH));
        commands[1] = bytes1(uint8(Commands.V3_SWAP_EXACT_IN));

        bytes[] memory inputs = new bytes[](2);
        inputs[0] = abi.encode(address(universalRouter), msg.value);
        inputs[1] = abi.encode(msg.sender, msg.value, minAmount, abi.encodePacked(WETH, fee, token), false);
        universalRouter.execute{ value: msg.value }(commands, inputs, deadline);

        uint balanceAfter = IERC20(token).balanceOf(msg.sender);
        uint swappedAmount = balanceAfter - balanceBefore;

        emit Swapped(msg.sender, token, swappedAmount);

        return swappedAmount;
    }
}
