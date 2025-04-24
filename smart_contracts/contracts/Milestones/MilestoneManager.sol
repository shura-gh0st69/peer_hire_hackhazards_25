// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {EscrowLib} from "../libraries/EscrowLib.sol";
import {DisputeResolution} from "../Dispute/DisputeResolution.sol";
/**
 * @title MilestoneManager
 * @notice Manages milestones for freelance jobs, allowing for staged payments
 */
contract MilestoneManager  {
    using SafeERC20 for IERC20;

    /// @notice Linked escrow contract that handles the funds
    address public immutable escrow;
    
    /// @notice Token used for payments
    IERC20 public immutable paymentToken;
    
    /// @notice Client who approved the milestones
    address public immutable client;
    
    /// @notice Freelancer who receives funds on completion
    address public immutable freelancer;
    
    /// @notice Dispute resolution contract
    DisputeResolution public disputeResolution;
    
    /// @notice All milestones for the job
    EscrowLib.Milestone[] public milestones;
    
    /// @notice Total amount allocated to all milestones
    uint256 public totalMilestoneAmount;
    
    /// @notice Overall job status
    EscrowLib.JobStatus public jobStatus = EscrowLib.JobStatus.NotFunded;
    
    /// @notice Mapping from milestone ID to dispute ID
    mapping(uint256 => uint256) public milestoneDisputes;
    
    /// @notice Flag for each milestone to indicate if it's disputed
    mapping(uint256 => bool) public isMilestoneDisputed;
    
    /// @dev Emitted when a new milestone is created
    event MilestoneCreated(uint256 indexed milestoneId, string description, uint256 amount);
    
    /// @dev Emitted when a milestone is completed by the freelancer
    event MilestoneCompleted(uint256 indexed milestoneId);
    
    /// @dev Emitted when a milestone is approved by the client
    event MilestoneApproved(uint256 indexed milestoneId);
    
    /// @dev Emitted when a milestone payment is claimed by the freelancer
    event MilestonePaid(uint256 indexed milestoneId, uint256 amount);
    
    /// @dev Emitted when a milestone is disputed
    event MilestoneDisputed(uint256 indexed milestoneId, uint256 indexed disputeId);
    
    /// @dev Emitted when a dispute is resolved
    event DisputeResolved(uint256 indexed milestoneId, uint256 indexed disputeId, bool freelancerWon);
    
    /// @dev Only the client can call this function
    modifier onlyClient() {
        require(msg.sender == client, "Only client");
        _;
    }
    
    /// @dev Only the freelancer can call this function
    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer");
        _;
    }
    
    /// @dev Only the escrow contract can call this function
    modifier onlyEscrow() {
        require(msg.sender == escrow, "Only escrow");
        _;
    }
    
    /// @dev Only when job is not disputed or canceled
    modifier whenActive() {
        require(
            jobStatus != EscrowLib.JobStatus.Disputed && 
            jobStatus != EscrowLib.JobStatus.Cancelled,
            "Job not active"
        );
        _;
    }
    
    /// @dev Only when milestone is not disputed
    modifier whenMilestoneNotDisputed(uint256 milestoneId) {
        require(!isMilestoneDisputed[milestoneId], "Milestone disputed");
        _;
    }
    
    /// @dev Only the dispute resolution contract can call this function
    modifier onlyDisputeResolution() {
        require(msg.sender == address(disputeResolution), "Only dispute resolution");
        _;
    }
    
    /**
     * @notice Constructor initializes the milestone manager
     * @param _escrow Address of the escrow contract
     * @param _paymentToken Address of the ERC20 token used for payment
     * @param _client Address of the client
     * @param _freelancer Address of the freelancer
     * @param _disputeResolution Address of the dispute resolution contract
     */
    constructor(
        address _escrow,
        address _paymentToken,
        address _client,
        address _freelancer,
        address _disputeResolution
    ) {
        require(_escrow != address(0), "Invalid escrow");
        require(_paymentToken != address(0), "Invalid payment token");
        require(_client != address(0), "Invalid client");
        require(_freelancer != address(0), "Invalid freelancer");
        require(_disputeResolution != address(0), "Invalid dispute resolution");
        
        escrow = _escrow;
        paymentToken = IERC20(_paymentToken);
        client = _client;
        freelancer = _freelancer;
        disputeResolution = DisputeResolution(_disputeResolution);
        
        jobStatus = EscrowLib.JobStatus.Funded;
    }
    
    /**
     * @notice Creates new milestones for the job
     * @param descriptions Array of milestone descriptions
     * @param amounts Array of amounts allocated to each milestone
     */
    function createMilestones(
        string[] calldata descriptions,
        uint256[] calldata amounts
    ) external onlyClient whenActive {
        require(descriptions.length > 0, "No milestones provided");
        require(descriptions.length == amounts.length, "Arrays length mismatch");
        
        uint256 total = 0;
        for (uint256 i = 0; i < descriptions.length; i++) {
            require(amounts[i] > 0, "Invalid milestone amount");
            total += amounts[i];
            
            milestones.push(
                EscrowLib.Milestone({
                    description: descriptions[i],
                    amount: amounts[i],
                    isCompleted: false,
                    isPaid: false
                })
            );
            
            emit MilestoneCreated(milestones.length - 1, descriptions[i], amounts[i]);
        }
        
        totalMilestoneAmount += total;
        
        if (jobStatus == EscrowLib.JobStatus.Funded) {
            jobStatus = EscrowLib.JobStatus.InProgress;
        }
    }
    
    /**
     * @notice Marks a milestone as completed by the freelancer
     * @param milestoneId ID of the milestone to mark as completed
     */
    function completeMilestone(uint256 milestoneId) 
        external 
        onlyFreelancer 
        whenActive
        whenMilestoneNotDisputed(milestoneId)
    {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(!milestones[milestoneId].isCompleted, "Already completed");
        
        milestones[milestoneId].isCompleted = true;
        emit MilestoneCompleted(milestoneId);
    }
    
    /**
     * @notice Approves a completed milestone, allowing the freelancer to claim payment
     * @param milestoneId ID of the milestone to approve
     */
    function approveMilestone(uint256 milestoneId) 
        external 
        onlyClient 
        whenActive
        whenMilestoneNotDisputed(milestoneId)
    {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(milestones[milestoneId].isCompleted, "Not completed");
        require(!milestones[milestoneId].isPaid, "Already paid");
        
        // The approval is implicit by calling this function
        // We could add an explicit approval flag if needed
        
        emit MilestoneApproved(milestoneId);
    }
    
    /**
     * @notice Claims payment for an approved milestone
     * @param milestoneId ID of the milestone to claim payment for
     */
    function claimMilestonePayment(uint256 milestoneId) 
        external 
        whenActive
        whenMilestoneNotDisputed(milestoneId)
    {
        require(msg.sender == escrow, "Only escrow can trigger payment");
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(milestones[milestoneId].isCompleted, "Not completed");
        require(!milestones[milestoneId].isPaid, "Already paid");
        
        uint256 amount = milestones[milestoneId].amount;
        milestones[milestoneId].isPaid = true;
        
        // The actual payment is handled by the escrow contract
        emit MilestonePaid(milestoneId, amount);
        
        // Check if all milestones are completed and paid
        bool allCompleted = true;
        for (uint256 i = 0; i < milestones.length; i++) {
            if (!milestones[i].isPaid) {
                allCompleted = false;
                break;
            }
        }
        
        // If all milestones are completed and paid, mark the job as completed
        if (allCompleted) {
            jobStatus = EscrowLib.JobStatus.Completed;
        }
    }
    
    /**
     * @notice Creates a dispute for a milestone
     * @param milestoneId ID of the milestone to dispute
     * @return disputeId ID of the created dispute
     */
    function createMilestoneDispute(uint256 milestoneId) 
        external 
        whenActive 
        returns (uint256 disputeId)
    {
        require(msg.sender == client || msg.sender == freelancer, "Not authorized");
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(!isMilestoneDisputed[milestoneId], "Already disputed");
        
        // Mark milestone and job as disputed
        isMilestoneDisputed[milestoneId] = true;
        jobStatus = EscrowLib.JobStatus.Disputed;
        
        // Create dispute in the dispute resolution contract
        disputeId = disputeResolution.openDispute(escrow, client, freelancer);
        milestoneDisputes[milestoneId] = disputeId;
        
        emit MilestoneDisputed(milestoneId, disputeId);
        return disputeId;
    }
    
    /**
     * @notice Handles the resolution of a milestone dispute
     * @param milestoneId ID of the disputed milestone
     * @param freelancerWon Whether the freelancer won the dispute
     */
    function handleDisputeResolution(uint256 milestoneId, bool freelancerWon) 
        external 
        onlyDisputeResolution
    {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(isMilestoneDisputed[milestoneId], "Not disputed");
        
        uint256 disputeId = milestoneDisputes[milestoneId];
        
        // Clear dispute flag
        isMilestoneDisputed[milestoneId] = false;
        
        if (freelancerWon) {
            // If freelancer wins, mark milestone as completed
            milestones[milestoneId].isCompleted = true;
        } else {
            // If client wins, reset milestone completion
            milestones[milestoneId].isCompleted = false;
        }
        
        // Reset job status to InProgress
        jobStatus = EscrowLib.JobStatus.InProgress;
        
        emit DisputeResolved(milestoneId, disputeId, freelancerWon);
    }
    
    /**
     * @notice Allows client to cancel the job if no milestones have been paid
     */
    function cancelJob() external onlyClient {
        // Ensure no milestone has been paid yet
        for (uint256 i = 0; i < milestones.length; i++) {
            require(!milestones[i].isPaid, "Cannot cancel - payments made");
        }
        
        jobStatus = EscrowLib.JobStatus.Cancelled;
    }
    
    /**
     * @notice Returns all milestones for the job
     * @return Array of all milestones
     */
    function getAllMilestones() external view returns (EscrowLib.Milestone[] memory) {
        return milestones;
    }
    
    /**
     * @notice Gets the details of a specific milestone
     * @param milestoneId ID of the milestone
     * @return description Milestone description
     * @return amount Amount allocated to the milestone
     * @return isCompleted Whether the milestone is completed by the freelancer
     * @return isPaid Whether the milestone is paid
     */
    function getMilestone(uint256 milestoneId) 
        external 
        view 
        returns (
            string memory description,
            uint256 amount,
            bool isCompleted,
            bool isPaid
        ) 
    {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        EscrowLib.Milestone memory milestone = milestones[milestoneId];
        return (
            milestone.description,
            milestone.amount,
            milestone.isCompleted,
            milestone.isPaid
        );
    }
    
    /**
     * @notice Gets the count of milestones
     * @return Number of milestones for the job
     */
    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }
    
    /**
     * @notice Gets the current job status as a string
     * @return Status string
     */
    function getJobStatusString() external view returns (string memory) {
        return EscrowLib.getStatusString(jobStatus);
    }
}
