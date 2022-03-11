// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

interface IGame {
    function getLifetimeScore(address player) external view returns (uint256);

    function getPlayers() external view returns (address[] memory);
}