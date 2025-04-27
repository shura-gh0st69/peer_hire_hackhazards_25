// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {Reputation} from "../contracts/Reputation/Reputation.sol";
import {Escrow} from "../contracts/Escrow/Escrow.sol";

contract ReputationTest is BaseTest {
    Escrow public escrow;
    uint256 public constant JOB_AMOUNT = 1000 * 10 ** 6; // 1000 USDC

    function setUp() public override {
        super.setUp();

        // Create and complete a job for testing reviews
        vm.startPrank(client);
        escrow = Escrow(
            escrowFactory.createEscrow(freelancer, address(usdc), JOB_AMOUNT)
        );

        escrow.setupMilestoneManager();
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();
        vm.stopPrank();

        // Complete the job
        vm.prank(client);
        escrow.markCompleted();
    }

    function test_SubmitReview() public {
        vm.prank(client);
        reputation.submitReview(
            freelancer,
            address(escrow),
            5, // 5-star rating
            "Excellent work!"
        );

        // Check review was recorded
        (
            address reviewer,
            address reviewee,
            uint8 rating,
            string memory comment,
            address reviewEscrow,
            uint256 reviewTimestamp
        ) = reputation.getReview(0);

        assertEq(reviewer, client);
        assertEq(reviewee, freelancer);
        assertEq(rating, 5);
        assertEq(comment, "Excellent work!");
        assertEq(reviewEscrow, address(escrow));

        // Check user stats were updated
        (
            uint256 totalRatings,
            uint256 averageRating,
            uint256 jobsCompleted,
            uint256 disputesWon,
            uint256 disputesLost
        ) = reputation.getUserStats(freelancer);

        assertEq(totalRatings, 1);
        assertEq(averageRating, 500); // 5.0 stars = 500
        assertEq(jobsCompleted, 0); // Not incremented yet
        assertEq(disputesWon, 0);
        assertEq(disputesLost, 0);
    }

    function test_DisputeOutcomeTracking() public {
        vm.prank(admin);
        reputation.recordDisputeOutcome(freelancer, client); // Freelancer wins

        (
            uint256 totalRatings,
            uint256 averageRating,
            uint256 jobsCompleted,
            uint256 disputesWon,
            uint256 disputesLost
        ) = reputation.getUserStats(freelancer);

        assertEq(disputesWon, 1);
        assertEq(disputesLost, 0);

        // Check client's stats
        (
            ,
            ,
            ,
            uint256 clientDisputesWon,
            uint256 clientDisputesLost
        ) = reputation.getUserStats(client);

        assertEq(clientDisputesWon, 0);
        assertEq(clientDisputesLost, 1);
    }

    function test_JobCompletionTracking() public {
        vm.prank(admin);
        reputation.incrementJobsCompleted(freelancer);

        (
            uint256 totalRatings,
            uint256 averageRating,
            uint256 jobsCompleted,
            uint256 disputesWon,
            uint256 disputesLost
        ) = reputation.getUserStats(freelancer);

        assertEq(jobsCompleted, 1);
    }

    function test_AverageRatingCalculation() public {
        // Submit multiple reviews with different ratings
        vm.startPrank(client);
        reputation.submitReview(freelancer, address(escrow), 5, "Excellent!");

        // Create another job and complete it for second review
        Escrow escrow2 = Escrow(
            escrowFactory.createEscrow(freelancer, address(usdc), JOB_AMOUNT)
        );
        escrow2.setupMilestoneManager();
        usdc.approve(address(escrow2), JOB_AMOUNT);
        escrow2.fundJob();
        escrow2.markCompleted();

        reputation.submitReview(freelancer, address(escrow2), 4, "Good work");
        vm.stopPrank();

        // Check average rating
        (uint256 totalRatings, uint256 averageRating, , , ) = reputation
            .getUserStats(freelancer);

        assertEq(totalRatings, 2);
        assertEq(averageRating, 450); // (5 + 4) / 2 * 100 = 450
    }

    function test_RevertWhen_DuplicateReview() public {
        vm.prank(client);
        reputation.submitReview(freelancer, address(escrow), 5, "Great!");

        vm.prank(client);
        vm.expectRevert("Already reviewed this escrow");
        reputation.submitReview(freelancer, address(escrow), 4, "Good!");
    }

    function test_RevertWhen_UnauthorizedReview() public {
        address randomUser = makeAddr("random");

        vm.prank(randomUser);
        vm.expectRevert("Not involved in this escrow");
        reputation.submitReview(freelancer, address(escrow), 5, "Great!");
    }

    function test_RevertWhen_InvalidRating() public {
        vm.prank(client);
        vm.expectRevert("Rating must be between 1-5");
        reputation.submitReview(
            freelancer,
            address(escrow),
            6,
            "Invalid rating"
        );
    }

    function test_GetReviewsForUser() public {
        vm.prank(client);
        reputation.submitReview(freelancer, address(escrow), 5, "Excellent!");

        uint256[] memory reviews = reputation.getReviewsForUser(freelancer);
        assertEq(reviews.length, 1);
        assertEq(reviews[0], 0); // First review ID
    }

    function test_GetReputation() public {
        // Test getting reputation stats
        (
            uint256 totalRatings,
            uint256 averageRating,
            uint256 jobsCompleted,
            uint256 disputesWon,
            uint256 disputesLost
        ) = reputation.getUserStats(freelancer);

        // Add assertions or logic to test the retrieved reputation data
    }
}
