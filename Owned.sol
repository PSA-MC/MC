pragma solidity ^0.6.0;
// SPDX-License-Identifier: UNLICENSED
// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() public{
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only allowed by owner");
        _;
    }

    function transferOwnership(address payable _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid account address");
        owner = _newOwner;
        emit OwnershipTransferred(msg.sender, _newOwner);
    }
}