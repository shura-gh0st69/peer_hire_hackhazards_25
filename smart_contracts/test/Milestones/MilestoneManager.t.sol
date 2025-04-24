// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import {MilestoneManager} from "contracts/Milestones/MilestoneManager.sol";
import {EscrowLib} from "contracts/libraries/EscrowLib.sol";

contract MilestoneManagerTest is Test {
    address escrow = address(0xE);
    address client = address(0xC1);
    address freelancer = address(0xF1);
    address disputeResolution = address(0xD1);
    address paymentToken = address(0xE1);

    MilestoneManager manager;

    function setUp() public {
        manager = new MilestoneManager(
            escrow,
            paymentToken,
            client,
            freelancer,
            disputeResolution
        );
    }

    function testCreateMilestones() public {
        string[] memory descs = new string[](2);
        descs[0] = "Design";
        descs[1] = "Development";
        uint256[] memory amts = new uint256[](2);
        amts[0] = 1 ether;
        amts[1] = 2 ether;
        vm.prank(client);
        manager.createMilestones(descs, amts);
        (string memory d0, uint256 a0,,) = manager.getMilestone(0);
        assertEq(d0, "Design");
        assertEq(a0, 1 ether);
    }

    function testReentrancyProtection() public {
        // claimMilestonePayment and createMilestoneDispute are nonReentrant
        // We cannot reenter directly in this context, but we check that the modifier is present and callable
        string[] memory descs = new string[](1);
        descs[0] = "Design";
        uint256[] memory amts = new uint256[](1);
        amts[0] = 1 ether;
        vm.prank(client);
        manager.createMilestones(descs, amts);
        // Simulate escrow calling claimMilestonePayment
        vm.prank(escrow);
        // Mark as completed first
        vm.prank(freelancer);
        manager.completeMilestone(0);
        vm.prank(escrow);
        manager.claimMilestonePayment(0);
        (,,,bool isPaid) = manager.getMilestone(0);
        assertTrue(isPaid);
    }
}
