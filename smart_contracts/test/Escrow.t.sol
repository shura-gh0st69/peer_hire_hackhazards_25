// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {Escrow} from "../contracts/Escrow/Escrow.sol";
import {MilestoneManager} from "../contracts/Milestones/MilestoneManager.sol";
import {EscrowLib} from "../contracts/libraries/EscrowLib.sol";

contract EscrowTest is BaseTest {
    Escrow public escrow;
    MilestoneManager public milestoneManager;
    uint256 public constant JOB_AMOUNT = 1000 * 10 ** 6; // 1000 USDC

    function setUp() public override {
        super.setUp();

        vm.prank(client);
        escrow = Escrow(
            escrowFactory.createEscrow(freelancer, address(usdc), JOB_AMOUNT)
        );
    }

    function test_Setup() public {
        assertEq(address(escrow.client()), client);
        assertEq(address(escrow.freelancer()), freelancer);
        assertEq(address(escrow.paymentToken()), address(usdc));
        assertEq(escrow.totalAmount(), JOB_AMOUNT);
        assertEq(uint(escrow.status()), uint(EscrowLib.JobStatus.NotFunded));
    }

    function test_SetupMilestoneManager() public {
        vm.prank(client);
        escrow.setupMilestoneManager();

        address milestoneManagerAddr = address(escrow.milestoneManager());
        assertTrue(milestoneManagerAddr != address(0));

        milestoneManager = MilestoneManager(milestoneManagerAddr);
        assertEq(milestoneManager.client(), client);
        assertEq(milestoneManager.freelancer(), freelancer);
    }

    function test_FundJob() public {
        // Setup milestone manager first
        vm.prank(client);
        escrow.setupMilestoneManager();

        // Approve USDC spending
        vm.prank(client);
        usdc.approve(address(escrow), JOB_AMOUNT);

        // Fund the job
        vm.prank(client);
        escrow.fundJob();

        assertEq(usdc.balanceOf(address(escrow)), JOB_AMOUNT);
        assertEq(uint(escrow.status()), uint(EscrowLib.JobStatus.Funded));
    }

    function test_ReleaseMilestonePayment() public {
        // Setup and fund the job
        vm.startPrank(client);
        escrow.setupMilestoneManager();
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();
        vm.stopPrank();

        milestoneManager = MilestoneManager(address(escrow.milestoneManager()));

        // Create milestones
        string[] memory descriptions = new string[](2);
        descriptions[0] = "Milestone 1";
        descriptions[1] = "Milestone 2";

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = JOB_AMOUNT / 2;
        amounts[1] = JOB_AMOUNT / 2;

        vm.prank(client);
        milestoneManager.createMilestones(descriptions, amounts);

        // Complete first milestone
        vm.prank(freelancer);
        milestoneManager.completeMilestone(0);

        // Approve and release payment
        vm.startPrank(client);
        milestoneManager.approveMilestone(0);
        escrow.releaseMilestonePayment(0);
        vm.stopPrank();

        // Calculate expected amount after fee
        uint256 fee = ((JOB_AMOUNT / 2) * 250) / 10000; // 2.5% fee
        uint256 expectedPayment = (JOB_AMOUNT / 2) - fee;

        assertEq(
            usdc.balanceOf(freelancer),
            100000 * 10 ** 6 + expectedPayment
        );
        assertEq(usdc.balanceOf(treasury), fee);
    }

    function test_DisputeResolution() public {
        // Setup and fund the job
        vm.startPrank(client);
        escrow.setupMilestoneManager();
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();
        vm.stopPrank();

        // Create dispute
        vm.prank(client);
        uint256 disputeId = escrow.openDispute();

        assertEq(uint(escrow.status()), uint(EscrowLib.JobStatus.Disputed));

        // Resolve dispute with split payment
        uint256 clientAward = JOB_AMOUNT / 2;
        uint256 freelancerAward = JOB_AMOUNT / 2;

        vm.prank(admin);
        disputeResolution.resolveDispute(
            disputeId,
            DisputeResolution.DisputeOutcome.Compromise,
            clientAward,
            freelancerAward
        );

        // Calculate expected amount after fee
        uint256 fee = (freelancerAward * 250) / 10000; // 2.5% fee
        uint256 expectedPayment = freelancerAward - fee;

        assertEq(usdc.balanceOf(client), 100000 * 10 ** 6 + clientAward);
        assertEq(
            usdc.balanceOf(freelancer),
            100000 * 10 ** 6 + expectedPayment
        );
        assertEq(usdc.balanceOf(treasury), fee);
    }

    function test_RevertWhen_UnauthorizedFundRelease() public {
        vm.startPrank(client);
        escrow.setupMilestoneManager();
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();
        vm.stopPrank();

        milestoneManager = MilestoneManager(address(escrow.milestoneManager()));

        string[] memory descriptions = new string[](1);
        descriptions[0] = "Milestone 1";

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = JOB_AMOUNT;

        vm.prank(client);
        milestoneManager.createMilestones(descriptions, amounts);

        vm.prank(freelancer);
        milestoneManager.completeMilestone(0);

        // Try to release payment without client approval
        vm.prank(freelancer);
        vm.expectRevert("Only client");
        escrow.releaseMilestonePayment(0);
    }

    function test_CancelJob() public {
        // Setup and fund the job
        vm.startPrank(client);
        escrow.setupMilestoneManager();
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();
        vm.stopPrank();

        // Cancel job before any milestones are paid
        vm.prank(client);
        escrow.cancelJob();

        assertEq(uint(escrow.status()), uint(EscrowLib.JobStatus.Cancelled));
        assertEq(usdc.balanceOf(client), 100000 * 10 ** 6 + JOB_AMOUNT); // Full refund
    }

    function test_RevertWhen_CancelAfterPayment() public {
        // Setup and fund the job with milestones
        vm.startPrank(client);
        escrow.setupMilestoneManager();
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();

        milestoneManager = MilestoneManager(address(escrow.milestoneManager()));

        string[] memory descriptions = new string[](2);
        descriptions[0] = "Milestone 1";
        descriptions[1] = "Milestone 2";

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = JOB_AMOUNT / 2;
        amounts[1] = JOB_AMOUNT / 2;

        milestoneManager.createMilestones(descriptions, amounts);
        vm.stopPrank();

        // Complete and pay first milestone
        vm.prank(freelancer);
        milestoneManager.completeMilestone(0);

        vm.startPrank(client);
        milestoneManager.approveMilestone(0);
        escrow.releaseMilestonePayment(0);

        // Try to cancel after payment
        vm.expectRevert("Cannot cancel - payments made");
        escrow.cancelJob();
    }
}
