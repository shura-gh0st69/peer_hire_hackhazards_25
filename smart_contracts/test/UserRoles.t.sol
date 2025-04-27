// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {UserRoles} from "../contracts/UserRoles.sol";

/**
 * @title UserRolesTest
 * @notice Test suite for the UserRoles contract functionality
 * @dev Tests role assignment, verification, and revocation for platform users
 */
contract UserRolesTest is BaseTest {
    // This test file will inherit the BaseTest setup

    function setUp() public override {
        super.setUp(); // Call the base setup that already creates the UserRoles contract
    }

    /**
     * @notice Test case: Assign Client role to a user
     * @dev This test demonstrates:
     * 1. Admin assigning Client role to a test user
     * 2. Verification that the role was correctly assigned
     * 3. Role tracking and querying functionality
     */
    function test_AssignClientRole() public {
        address testUser = makeAddr("testClient");
        
        vm.startPrank(admin);
        userRoles.assignRole(testUser, UserRoles.Role.Client);
        vm.stopPrank();
        
        bool hasRole = userRoles.hasRole(testUser, UserRoles.Role.Client);
        assertTrue(hasRole, "User should have Client role");
    }
    
    /**
     * @notice Test case: Assign Freelancer role to a user
     * @dev This test demonstrates:
     * 1. Admin assigning Freelancer role to a test user
     * 2. Verification that the role was correctly assigned
     * 3. Role verification for freelancer-specific functionality
     */
    function test_AssignFreelancerRole() public {
        address testUser = makeAddr("testFreelancer");
        
        vm.startPrank(admin);
        userRoles.assignRole(testUser, UserRoles.Role.Freelancer);
        vm.stopPrank();
        
        bool hasRole = userRoles.hasRole(testUser, UserRoles.Role.Freelancer);
        assertTrue(hasRole, "User should have Freelancer role");
    }
    
    /**
     * @notice Test case: Revoke a previously assigned role
     * @dev This test demonstrates:
     * 1. Admin assigning a role to a user
     * 2. Verification that the role was assigned
     * 3. Admin revoking the user's role
     * 4. Verification that the role was correctly removed
     * 5. Complete role lifecycle management
     */
    function test_RevokeRole() public {
        address testUser = makeAddr("tempUser");
        
        vm.startPrank(admin);
        userRoles.assignRole(testUser, UserRoles.Role.Client);
        
        // Verify role is assigned
        bool hasRoleBeforeRevoke = userRoles.hasRole(testUser, UserRoles.Role.Client);
        assertTrue(hasRoleBeforeRevoke, "User should have role before revocation");
        
        // Revoke role
        userRoles.revokeRole(testUser);
        vm.stopPrank();
        
        // Verify role is revoked
        bool hasRoleAfterRevoke = userRoles.hasRole(testUser, UserRoles.Role.Client);
        assertFalse(hasRoleAfterRevoke, "User should not have role after revocation");
    }
    
    /**
     * @notice Test case: Non-owner cannot assign roles
     * @dev This test demonstrates:
     * 1. A non-admin user attempting to assign a role
     * 2. The transaction failing with "Only owner" error
     * 3. Access control protection for role management
     * 4. Platform security against unauthorized role assignments
     */
    function test_RevertWhen_NonOwnerAssignsRole() public {
        address testUser = makeAddr("randomUser");
        address nonOwner = makeAddr("nonOwner");
        
        vm.startPrank(nonOwner);
        vm.expectRevert("Only owner");
        userRoles.assignRole(testUser, UserRoles.Role.Client);
        vm.stopPrank();
    }
    
    /**
     * @notice Test case: Non-owner cannot revoke roles
     * @dev This test demonstrates:
     * 1. Admin properly assigning a role to a user
     * 2. A non-admin user attempting to revoke that role
     * 3. The transaction failing with "Only owner" error
     * 4. Protection against malicious role revocation
     */
    function test_RevertWhen_NonOwnerRevokesRole() public {
        address testUser = makeAddr("victimUser");
        address nonOwner = makeAddr("attacker");
        
        // First assign a role
        vm.startPrank(admin);
        userRoles.assignRole(testUser, UserRoles.Role.Client);
        vm.stopPrank();
        
        // Try to revoke as non-owner
        vm.startPrank(nonOwner);
        vm.expectRevert("Only owner");
        userRoles.revokeRole(testUser);
        vm.stopPrank();
    }
    
    /**
     * @notice Test case: Cannot assign Role.None
     * @dev This test demonstrates:
     * 1. Admin attempting to assign Role.None to a user
     * 2. The transaction failing with "Cannot assign None" error
     * 3. Protection against invalid role assignments
     * 4. Role.None is reserved for users with no roles
     */
    function test_RevertWhen_AssigningRoleNone() public {
        address testUser = makeAddr("testUser");
        
        vm.startPrank(admin);
        vm.expectRevert("Cannot assign None");
        userRoles.assignRole(testUser, UserRoles.Role.None);
        vm.stopPrank();
    }
}