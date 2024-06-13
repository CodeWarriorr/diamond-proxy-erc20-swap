// SPDX-License-Identifier: MIT
pragma solidity =0.8.26;

contract Feeder {
  receive() external payable {}
  function forceFeed(address receiver) external {
    selfdestruct(payable(receiver));
  }
}
