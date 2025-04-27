// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {EscrowFactory} from "../Escrow/EscrowFactory.sol";
import {Escrow} from "../Escrow/Escrow.sol";
import {EscrowLib} from "../libraries/EscrowLib.sol";

/**
 * @title Reputation
 * @notice Manages reputation scores and reviews for freelancers and clients
 */
contract Reputation {
    /// @dev Represents a user review
    struct Review {
        address reviewer;      // Address of the person leaving the review
        address reviewee;      // Address of the person being reviewed
        uint8 rating;          // Rating from 1-5
        string comment;        // Review text/comment (or IPFS hash for longer reviews)
        address escrow;        // Associated escrow contract
        uint256 timestamp;     // When the review was created
    }
    
    /// @dev Review statistics for a user
    struct UserStats {
        uint256 totalRatings;      // Total number of ratings received
        uint256 cumulativeScore;   // Sum of all ratings (used to calculate average)
        uint256 jobsCompleted;     // Number of jobs completed
        uint256 disputesWon;       // Number of disputes won
        uint256 disputesLost;      // Number of disputes lost
    }
    
    /// @notice Platform admin address
    address public admin;
    
    /// @notice Factory that creates escrow contracts (used to verify completed jobs)
    EscrowFactory public escrowFactory;
    
    /// @notice Mapping of user address to their stats
    mapping(address => UserStats) public userStats;
    
    /// @notice All reviews made on the platform
    Review[] public reviews;
    
    /// @notice Mapping from user address to reviews they've received
    mapping(address => uint256[]) public userReviews;
    
    /// @notice Mapping tracking if a reviewer has reviewed a specific escrow
    mapping(address => mapping(address => bool)) public hasReviewed;
    
    /// @dev Events
    event ReviewSubmitted(uint256 indexed reviewId, address indexed reviewer, address indexed reviewee);
    event UserStatsUpdated(address indexed user, uint256 newRating);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    constructor(address _admin, address _escrowFactory) {
        require(_admin != address(0), "Invalid admin address");
        require(_escrowFactory != address(0), "Invalid factory address");
        
        admin = _admin;
        escrowFactory = EscrowFactory(_escrowFactory);
    }
    
    /**
     * @notice Submit a review for another user
     * @param reviewee Address of the user being reviewed
     * @param escrowAddress Address of the related escrow contract
     * @param rating Rating from 1-5
     * @param comment Review text or IPFS hash
     */
    function submitReview(
        address reviewee,
        address escrowAddress,
        uint8 rating,
        string calldata comment
    ) external {
        require(reviewee != address(0), "Invalid reviewee address");
        require(escrowAddress != address(0), "Invalid escrow address");
        require(rating >= 1 && rating <= 5, "Rating must be between 1-5");
        require(!hasReviewed[msg.sender][escrowAddress], "Already reviewed this escrow");
        
        // Verify the escrow contract and its completion status
        Escrow escrow = Escrow(escrowAddress);
        require(
            escrow.client() == msg.sender && escrow.freelancer() == reviewee ||
            escrow.client() == reviewee && escrow.freelancer() == msg.sender, 
            "Not involved in this escrow"
        );
        
        // Check that the job is completed
        require(escrow.status() == EscrowLib.JobStatus.Completed, "Job not completed");
        
        // Record the review
        uint256 reviewId = reviews.length;
        
        reviews.push(
            Review({
                reviewer: msg.sender,
                reviewee: reviewee,
                rating: rating,
                comment: comment,
                escrow: escrowAddress,
                timestamp: block.timestamp
            })
        );
        
        // Update user stats
        UserStats storage stats = userStats[reviewee];
        stats.totalRatings++;
        stats.cumulativeScore += rating;
        
        // Update the mapping so this reviewer can't review this escrow again
        hasReviewed[msg.sender][escrowAddress] = true;
        
        // Add to user's reviews
        userReviews[reviewee].push(reviewId);
        
        emit ReviewSubmitted(reviewId, msg.sender, reviewee);
        emit UserStatsUpdated(reviewee, calculateAverageRating(reviewee));
    }
    
    /**
     * @notice Updates the jobs completed counter for a user
     * @param user Address of the user
     */
    function incrementJobsCompleted(address user) external {
        require(msg.sender == admin, "Only admin can update job stats");
        userStats[user].jobsCompleted++;
        emit UserStatsUpdated(user, calculateAverageRating(user));
    }
    
    /**
     * @notice Updates the dispute counters after resolution
     * @param winner Address of the dispute winner
     * @param loser Address of the dispute loser
     */
    function recordDisputeOutcome(address winner, address loser) external {
        require(msg.sender == admin, "Only admin can update dispute stats");
        userStats[winner].disputesWon++;
        userStats[loser].disputesLost++;
        
        emit UserStatsUpdated(winner, calculateAverageRating(winner));
        emit UserStatsUpdated(loser, calculateAverageRating(loser));
    }
    
    /**
     * @notice Calculates the average rating for a user
     * @param user Address of the user
     * @return Average rating (0-500, where 500 = 5.0)
     */
    function calculateAverageRating(address user) public view returns (uint256) {
        UserStats storage stats = userStats[user];
        if (stats.totalRatings == 0) {
            return 0;
        }
        
        return (stats.cumulativeScore * 100) / stats.totalRatings;
    }
    
    /**
     * @notice Gets all review IDs for a specific user
     * @param user Address of the user
     * @return Array of review IDs
     */
    function getReviewsForUser(address user) external view returns (uint256[] memory) {
        return userReviews[user];
    }
    
    /**
     * @notice Gets a specific review by ID
     * @param reviewId ID of the review to fetch
     * @return reviewer Address of the reviewer
     * @return reviewee Address being reviewed
     * @return rating Rating given (1-5)
     * @return comment Review comment/text
     * @return escrow Associated escrow contract
     * @return timestamp When the review was created
     */
    function getReview(uint256 reviewId) 
        external 
        view 
        returns (
            address reviewer,
            address reviewee,
            uint8 rating,
            string memory comment,
            address escrow,
            uint256 timestamp
        ) 
    {
        require(reviewId < reviews.length, "Invalid review ID");
        Review memory review = reviews[reviewId];
        
        return (
            review.reviewer,
            review.reviewee,
            review.rating,
            review.comment,
            review.escrow,
            review.timestamp
        );
    }
    
    /**
     * @notice Gets a user's full statistics
     * @param user Address of the user
     * @return totalRatings Number of ratings received
     * @return averageRating Average rating (0-500)
     * @return jobsCompleted Number of jobs completed
     * @return disputesWon Number of disputes won
     * @return disputesLost Number of disputes lost
     */
    function getUserStats(address user) 
        external 
        view 
        returns (
            uint256 totalRatings,
            uint256 averageRating,
            uint256 jobsCompleted,
            uint256 disputesWon,
            uint256 disputesLost
        ) 
    {
        UserStats memory stats = userStats[user];
        
        return (
            stats.totalRatings,
            calculateAverageRating(user),
            stats.jobsCompleted,
            stats.disputesWon,
            stats.disputesLost
        );
    }
    
    /**
     * @notice Sets a new admin
     * @param newAdmin Address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
}