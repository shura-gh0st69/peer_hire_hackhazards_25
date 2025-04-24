// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title Constants
 * @notice Library containing platform-wide constants
 */
library Constants {
    
    // Time constants
    uint256 constant MIN_JOB_DURATION = 1 days;
    uint256 constant MAX_JOB_DURATION = 365 days;
    uint256 constant DISPUTE_VOTING_PERIOD = 7 days;
    
    // Governance constants
    uint256 constant DEFAULT_VOTING_PERIOD = 3 days;
    uint256 constant DEFAULT_QUORUM_PERCENTAGE = 10; // 10%
    
    // Subscription constants
    uint256 constant BASIC_SUBSCRIPTION_MONTHLY = 9 ether; // $9 equivalent
    uint256 constant PRO_SUBSCRIPTION_MONTHLY = 29 ether;  // $29 equivalent
    uint256 constant ENTERPRISE_SUBSCRIPTION_MONTHLY = 99 ether; // $99 equivalent
    
    // Platform limits
    uint256 constant MAX_SKILLS_PER_USER = 50;
    uint256 constant MAX_CREDENTIALS_PER_USER = 20;
    uint256 constant MAX_TEAM_MEMBERS = 10;
    
    // Version tracking
    string constant PLATFORM_VERSION = "1.0.0";
    
    // Contract role identifiers
    bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    bytes32 constant DISPUTE_RESOLVER_ROLE = keccak256("DISPUTE_RESOLVER_ROLE");
    bytes32 constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
}