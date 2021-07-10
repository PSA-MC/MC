pragma solidity ^0.6.0;
// SPDX-License-Identifier: UNLICENSED

import './SafeMath.sol';

import './IERC20.sol';

import './Pool.sol';

import './Owned.sol';

contract PoolFactory is Owned {
    using SafeMath for uint256;
    struct PoolInfo{
        uint256 poolId;
        string poolName;
        address poolAddress;
    }
    mapping(uint256 => PoolInfo) public pools; // public, list, get a child address at row #
    uint public totalPools;
    event PoolCreated(address child, uint poolId); // maybe listen for events

    function CreatePool (string memory _contractName, uint256 _hardCap, uint256 _softCap,
        uint256 _maxInvestment, uint256 _minInvestment, address _managementAddress,
        address _destinationAddress, address _tokenAddress, uint256 _ownerBonus,
        uint256 _startDate, uint256 _endDate, address[5] memory _whitelisted, 
        uint256 _token
    ) external onlyOwner{
        totalPools = totalPools.add(1);
        Pool child = new Pool(_contractName, _hardCap, _softCap, _maxInvestment, 
        _minInvestment, _managementAddress, _destinationAddress,_tokenAddress, 
        _ownerBonus, _startDate, _endDate, _whitelisted, _token);
        
        pools[totalPools].poolId = totalPools;
        pools[totalPools].poolName = _contractName;
        pools[totalPools].poolAddress = address(child);
        
        emit PoolCreated(address(child), totalPools); // emit an event - another way to monitor this
    }
}