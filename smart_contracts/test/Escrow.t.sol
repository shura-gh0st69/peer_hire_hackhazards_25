// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../contracts/Escrow/Escrow.sol";
import "../contracts/Escrow/EscrowFactory.sol";
import "../contracts/Dispute/DisputeResolution.sol";
import "../contracts/Reputation/Reputation.sol";
import "../contracts/Jobs/JobRegistry.sol";
import "../contracts/UserRoles.sol";

contract EscrowTest is Test {
    EscrowFactory escrowFactory;
    DisputeResolution disputeResolution;
    Reputation reputation;
    JobRegistry jobRegistry;
    UserRoles userRoles;

    address admin = address(0x1);
    address client = address(0x2);
    address freelancer = address(0x3);
    address treasury = address(0x4);
    address paymentToken = address(0x5);

    function setUp() public {
        vm.startPrank(admin);

        // Deploy contracts
        userRoles = new UserRoles(admin);
        reputation = new Reputation(admin, address(0));
        disputeResolution = new DisputeResolution(admin, address(reputation));
        escrowFactory = new EscrowFactory(address(disputeResolution));
        jobRegistry = new JobRegistry(admin, address(escrowFactory), address(userRoles), address(reputation));

        vm.stopPrank();
    }

    function testCreateJobAndApply() public {
        vm.startPrank(client);
        userRoles.assignRole(client, UserRoles.Role.Client);

        // Create a job
        string[] memory skills = new string[](1);
        skills[0] = "Solidity";
        uint256 jobId = jobRegistry.createJob("Test Job", "Test Description", skills, 100 ether, paymentToken);

        vm.stopPrank();

        vm.startPrank(freelancer);
        userRoles.assignRole(freelancer, UserRoles.Role.Freelancer);

        // Apply for the job
        jobRegistry.applyForJob(jobId, "Test Proposal", 90 ether);

        vm.stopPrank();
    }

    function testAcceptApplicationAndCreateEscrow() public {
        testCreateJobAndApply();

        vm.startPrank(client);

        // Accept application
        uint256 applicationId = 0; // Assuming the first application
        address escrowAddress = jobRegistry.acceptApplication(applicationId);

        // Verify escrow creation
        Escrow escrow = Escrow(escrowAddress);
        assertEq(escrow.client(), client);
        assertEq(escrow.freelancer(), freelancer);

        vm.stopPrank();
    }
}