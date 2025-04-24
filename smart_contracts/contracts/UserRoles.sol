// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title UserRoles
 * @notice Manages registration and role-based access for platform users
 */
contract UserRoles {
    enum Role { None, Client, Freelancer, Admin }

    mapping(address => Role) public userRoles;
    address public owner;

    event RoleAssigned(address indexed user, Role role);
    event RoleRevoked(address indexed user, Role role);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _owner) {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
        userRoles[_owner] = Role.Admin;
    }

    function assignRole(address user, Role role) external onlyOwner {
        require(user != address(0), "Invalid user");
        require(role != Role.None, "Cannot assign None");
        userRoles[user] = role;
        emit RoleAssigned(user, role);
    }

    function revokeRole(address user) external onlyOwner {
        require(user != address(0), "Invalid user");
        Role prev = userRoles[user];
        userRoles[user] = Role.None;
        emit RoleRevoked(user, prev);
    }

    function hasRole(address user, Role role) external view returns (bool) {
        return userRoles[user] == role;
    }
}
