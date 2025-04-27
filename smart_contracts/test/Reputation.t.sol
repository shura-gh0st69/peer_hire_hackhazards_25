// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {Reputation} from "../contracts/Reputation/Reputation.sol";
import {Escrow} from "../contracts/Escrow/Escrow.sol";

/**
 * @title ReputationTest
 * @notice Test suite for the Reputation contract functionality
 * @dev Tests user reviews, ratings calculation, and reputation tracking
 */
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

    /**
     * @notice Test case: Submit a review for a freelancer
     * @dev This test demonstrates:
     * 1. Client submitting a 5-star review for a completed job
     * 2. Verification that review details are correctly stored
     * 3. Confirmation that the freelancer's stats are updated
     * 4. Review linking to the specific escrow contract
     */
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

    /**
     * @notice Test case: Track dispute outcomes in reputation
     * @dev This test demonstrates:
     * 1. Admin recording a dispute outcome (freelancer wins)
     * 2. Verification that freelancer's disputesWon count increases
     * 3. Verification that client's disputesLost count increases
     * 4. Impact of dispute outcomes on user reputation stats
     */
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

    /**
     * @notice Test case: Track completed jobs in reputation
     * @dev This test demonstrates:
     * 1. Admin incrementing a freelancer's completed jobs count
     * 2. Verification that jobsCompleted metric increases
     * 3. Job completion tracking for reputation building
     */
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

    /**
     * @notice Test case: Calculate average rating across multiple reviews
     * @dev This test demonstrates:
     * 1. Client submitting multiple reviews for different jobs
     * 2. Proper calculation of average rating across all reviews
     * 3. Storage and retrieval of multiple reviews
     * 4. Rating precision using integers (450 = 4.5 stars)
     */
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

    /**
     * @notice Test case: Prevent duplicate reviews for the same escrow
     * @dev This test demonstrates:
     * 1. Client submitting an initial review
     * 2. Client attempting to submit a second review for the same escrow
     * 3. Transaction reverting with "Already reviewed this escrow" error
     * 4. Protection against review spam and manipulation
     */
    function test_RevertWhen_DuplicateReview() public {
        vm.prank(client);
        reputation.submitReview(freelancer, address(escrow), 5, "Great!");

        vm.prank(client);
        vm.expectRevert("Already reviewed this escrow");
        reputation.submitReview(freelancer, address(escrow), 4, "Good!");
    }

    /**
     * @notice Test case: Only escrow participants can submit reviews
     * @dev This test demonstrates:
     * 1. Random user attempting to review a freelancer for an escrow
     * 2. Transaction reverting with "Not involved in this escrow" error
     * 3. Access control for review submission
     * 4. Protection against fake or unauthorized reviews
     */
    function test_RevertWhen_UnauthorizedReview() public {
        address randomUser = makeAddr("random");

        vm.prank(randomUser);
        vm.expectRevert("Not involved in this escrow");
        reputation.submitReview(freelancer, address(escrow), 5, "Great!");
    }

    /**
     * @notice Test case: Rating must be between 1-5
     * @dev This test demonstrates:
     * 1. Client attempting to submit a review with rating > 5
     * 2. Transaction reverting with "Rating must be between 1-5" error
     * 3. Input validation for rating values
     * 4. Standardized rating scale enforcement
     */
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

    /**
     * @notice Test case: Retrieve all reviews for a specific user
     * @dev This test demonstrates:
     * 1. Client submitting a review for a freelancer
     * 2. Retrieving all review IDs associated with that freelancer
     * 3. Verification that the correct review ID is returned
     * 4. Review history tracking by user
     */
    function test_GetReviewsForUser() public {
        vm.prank(client);
        reputation.submitReview(freelancer, address(escrow), 5, "Excellent!");

        uint256[] memory reviews = reputation.getReviewsForUser(freelancer);
        assertEq(reviews.length, 1);
        assertEq(reviews[0], 0); // First review ID
    }

    /**
     * @notice Test case: Get user reputation stats
     * @dev This test demonstrates:
     * 1. Retrieval of a user's complete reputation data
     * 2. Structure of reputation stats (ratings, jobs, disputes)
     * 3. Default values for a user with no reputation history
     */
    function test_GetReputation() public {
        // Test getting reputation stats
        (
            uint256 totalRatings,
            uint256 averageRating,
            uint256 jobsCompleted,
            uint256 disputesWon,
            uint256 disputesLost
        ) = reputation.getUserStats(freelancer);

        // Initial stats should be zero
        assertEq(totalRatings, 0);
        assertEq(averageRating, 0);
        assertEq(jobsCompleted, 0);
        assertEq(disputesWon, 0);
        assertEq(disputesLost, 0);
    }
}
