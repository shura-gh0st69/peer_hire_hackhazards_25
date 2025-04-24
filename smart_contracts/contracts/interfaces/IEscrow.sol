// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MilestoneManager} from "../Milestones/MilestoneManager.sol"; // Assuming MilestoneManager interface/contract is accessible
import {DisputeResolution} from "../Dispute/DisputeResolution.sol"; // Assuming DisputeResolution interface/contract is accessible
import {EscrowLib} from "../libraries/EscrowLib.sol";
/**
 * @title IEscrow
 * @notice Interface for the Escrow contract, defining its external functions and events.
 */
interface IEscrow {
    /**
     * @notice Represents the possible states of a job escrow.
     */
    enum JobStatus {
        NotFunded,
        Funded,
        InProgress, // Consider if this status is managed explicitly or implicitly
        Completed,
        Disputed,
        Cancelled // Consider adding cancel logic if needed
    }

    // --- Events ---

    event JobFunded(uint256 totalAmount);
    event FundsReleased(address indexed freelancer, uint256 amount);
    event Refunded(address indexed client, uint256 amount);
    event DisputeOpened(address indexed initiator);
    // Add other events if Escrow.sol emits more

    // --- State Variables (Getters) ---

    function client() external view returns (address);
    function freelancer() external view returns (address);
    function paymentToken() external view returns (IERC20);
    function totalAmount() external view returns (uint256);
    function status() external view returns (JobStatus);
    function milestoneManager() external view returns (MilestoneManager); // Or address if interacting by address
    function disputeHandler() external view returns (DisputeResolution); // Or address
    function disputeId() external view returns (uint256);

    // --- Functions ---

    /**
     * @notice Client funds the escrow.
     */
    function fundJob() external;

    /**
     * @notice Releases a specific amount of funds to the freelancer.
     * @dev Primarily for direct release, milestone payments use claimMilestone.
     * @param amount The amount to release.
     */
    function releaseFunds(uint256 amount) external;

    /**
     * @notice Allows the freelancer to claim payment for an approved milestone
     *         by interacting with the associated MilestoneManager.
     * @param milestoneId The ID of the milestone to claim.
     */
    function claimMilestone(uint256 milestoneId) external;

    /**
     * @notice Initiates the dispute process for this escrow.
     */
    function openDispute() external;

    /**
     * @notice Refunds a specific amount to the client.
     * @dev Typically called after dispute resolution or mutual agreement.
     * @param amount The amount to refund.
     */
    function refundClient(uint256 amount) external;

    /**
     * @notice Marks the job as completed (e.g., after all milestones paid or final sign-off).
     */
    function markCompleted() external;

    // Add any other external functions from Escrow.sol here
}