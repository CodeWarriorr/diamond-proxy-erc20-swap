// SPDX-License-Identifier: MIT
pragma solidity =0.8.26;

import { WithStorage, WithModifiers } from "../libraries/LibStorage.sol";
import { ERC20Swapper } from "../interfaces/ERC20Swapper.sol";
import { IUniswapV3Factory } from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import { IUniversalRouter } from "@uniswap/universal-router/contracts/interfaces/IUniversalRouter.sol";
import { Commands } from "@uniswap/universal-router/contracts/libraries/Commands.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ReentrancyGuard } from "@solidstate/contracts/security/reentrancy_guard/ReentrancyGuard.sol";
import { CommonErrors } from "../interfaces/CommonErrors.sol";

/**
 * @title SwapperFacet
 * @author codewarriorr@pm.me
 * @notice Swap Ether to ERC-20 tokens using Uniswap V3 through Universal Router
 */
contract SwapperFacet is WithStorage, WithModifiers, CommonErrors, ReentrancyGuard, ERC20Swapper {
    IUniswapV3Factory private constant uniswapFactory = IUniswapV3Factory(0x0227628f3F023bb0B980b67D528571c95c6DaC1c); // uniswap v3 factory (sepolia)
    IUniversalRouter private constant universalRouter = IUniversalRouter(0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD); // uniswap universal router (sepolia)
    address private constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14; // wrapped eth (sepolia)

    uint24 private constant fee = 3000;

    event Swapped(address indexed wallet, address indexed token, uint amount);

    error EthAmountIsZero();
    error TokenPoolIsMissing();

    /**
     * @notice Check if a pool exists for the given token
     * @param token address of the token to check pool for
     */
    function checkPool(address token) public view returns (address) {
        return uniswapFactory.getPool(WETH, token, fee);
    }

    /**
     * @notice Swap Ether to ERC-20 token through Uniswap V3 using Universal Router
     * 
     * @param token token to swap to
     * @param minAmount minimum amount of tokens to receive
     */
    function swapEtherToToken(address token, uint minAmount) public payable isNotPaused nonReentrant returns (uint) {
        require(msg.value > 0, EthAmountIsZero());

        uint256 deadline = block.timestamp + 15;

        address pool = uniswapFactory.getPool(WETH, token, fee);
        require(pool != address(0), TokenPoolIsMissing());

        uint balanceBefore = IERC20(token).balanceOf(msg.sender);

        IERC20(WETH).approve(address(universalRouter), msg.value);

        bytes memory commands = abi.encodePacked(bytes1(uint8(Commands.WRAP_ETH)), bytes1(uint8(Commands.V3_SWAP_EXACT_IN)));

        bytes[] memory inputs = new bytes[](2);
        inputs[0] = abi.encode(address(universalRouter), msg.value);
        inputs[1] = abi.encode(msg.sender, msg.value, minAmount, abi.encodePacked(WETH, fee, token), false);
        universalRouter.execute{ value: msg.value }(commands, inputs, deadline);

        uint balanceAfter = IERC20(token).balanceOf(msg.sender);
        uint swappedAmount = balanceAfter - balanceBefore;

        emit Swapped(msg.sender, token, swappedAmount);

        return swappedAmount;
    }

    /**
     * @notice Function allows owner to withdraw ETH from the contract in unexpected event like force feeding.
     */
    function rescue() external isOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
