// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {DisputeResolution} from "../Dispute/DisputeResolution.sol";
import {MilestoneManager} from "../Milestones/MilestoneManager.sol";
import {EscrowLib} from "../libraries/EscrowLib.sol";

/**
 * @title Escrow
 * @notice Holds and manages job funds between clients and freelancers.
 * Allows secure funding, release, and potential refunds for individual jobs.
 */
contract Escrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Emitted when the job is funded
    event JobFunded(uint256 totalAmount);

    /// @notice Emitted when funds are released to the freelancer
    event FundsReleased(
        address indexed freelancer,
        uint256 amount,
        uint256 indexed milestoneId
    );

    /// @notice Emitted when a refund is issued to the client
    event Refunded(address indexed client, uint256 amount);

    /// @notice Emitted when a dispute is initiated
    event DisputeOpened(address indexed initiator, uint256 disputeId);

    /// @notice Emitted when a dispute is resolved
    event DisputeResolved(uint256 disputeId, bool freelancerWon);

    /// @notice Platform fee percentage (in basis points: 250 = 2.5%)
    uint256 public constant PLATFORM_FEE_BPS = 250;

    /// @notice Platform treasury address
    address public immutable treasury;

    /// @notice The client funding the job
    address public immutable client;

    /// @notice The freelancer receiving the payment
    address public immutable freelancer;

    /// @notice ERC20 token used for payment (can be WETH, stablecoin, etc.)
    IERC20 public immutable paymentToken;

    /// @notice Job funding amount
    uint256 public immutable totalAmount;

    /// @notice Current job status
    EscrowLib.JobStatus public status;

    /// @notice Central dispute resolution contract
    DisputeResolution public immutable disputeHandler;

    /// @notice Milestone manager for this job
    MilestoneManager public milestoneManager;

    /// @notice ID of the dispute related to this escrow
    uint256 public disputeId;

    /// @notice Amount already paid to the freelancer
    uint256 public paidAmount;

    modifier onlyClient() {
        require(msg.sender == client, "Only client");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer");
        _;
    }

    modifier inStatus(EscrowLib.JobStatus expected) {
        require(status == expected, "Invalid status");
        _;
    }

    modifier onlyDisputeHandler() {
        require(msg.sender == address(disputeHandler), "Only dispute handler");
        _;
    }

    /**
     * @dev Initializes the escrow for a job.
     * @param _client The client address funding the job.
     * @param _freelancer The freelancer assigned to the job.
     * @param _paymentToken ERC20 token address used for payment.
     * @param _totalAmount The full amount to be held in escrow.
     * @param _disputeHandler Address of the central dispute resolution contract.
     * @param _treasury Address of the platform treasury.
     */
    constructor(
        address _client,
        address _freelancer,
        address _paymentToken,
        uint256 _totalAmount,
        address _disputeHandler,
        address _treasury
    ) {
        require(_client != address(0), "Client address required");
        require(_freelancer != address(0), "Freelancer address required");
        require(_paymentToken != address(0), "Token address required");
        require(_totalAmount > 0, "Invalid escrow amount");
        require(_disputeHandler != address(0), "Dispute handler required");
        require(_treasury != address(0), "Treasury address required");

        client = _client;
        freelancer = _freelancer;
        paymentToken = IERC20(_paymentToken);
        totalAmount = _totalAmount;
        treasury = _treasury;
        status = EscrowLib.JobStatus.NotFunded;
        disputeHandler = DisputeResolution(_disputeHandler);
    }

    /**
     * @notice Creates and initializes the milestone manager
     */
    function setupMilestoneManager() external onlyClient {
        require(address(milestoneManager) == address(0), "Already set up");
        milestoneManager = new MilestoneManager(
            address(this),
            address(paymentToken),
            client,
            freelancer,
            address(disputeHandler)
        );
    }

    /**
     * @notice Client funds the escrow.
     * @dev Transfers totalAmount from the client to the contract.
     */
    function fundJob()
        external
        onlyClient
        nonReentrant
        inStatus(EscrowLib.JobStatus.NotFunded)
    {
        require(
            address(milestoneManager) != address(0),
            "Set up milestone manager first"
        );

        status = EscrowLib.JobStatus.Funded;
        paymentToken.safeTransferFrom(msg.sender, address(this), totalAmount);
        emit JobFunded(totalAmount);
    }

    /**
     * @notice Releases funds for a completed milestone.
     * @param milestoneId The ID of the milestone to release payment for.
     */
    function releaseMilestonePayment(
        uint256 milestoneId
    ) external onlyClient nonReentrant {
        require(
            address(milestoneManager) != address(0),
            "Milestone manager not set up"
        );
        require(
            status == EscrowLib.JobStatus.Funded ||
                status == EscrowLib.JobStatus.InProgress,
            "Invalid status"
        );

        // Get milestone information
        (, uint256 amount, bool isCompleted, bool isPaid) = milestoneManager
            .getMilestone(milestoneId);

        require(isCompleted, "Milestone not completed");
        require(!isPaid, "Already paid");

        // Calculate platform fee
        uint256 fee = EscrowLib.calculateFee(amount, PLATFORM_FEE_BPS);
        uint256 freelancerAmount = amount - fee;

        // Update accounting
        paidAmount += amount;

        // Process the milestone payment through the milestone manager
        milestoneManager.claimMilestonePayment(milestoneId);

        // Transfer funds
        paymentToken.safeTransfer(freelancer, freelancerAmount);
        if (fee > 0) {
            paymentToken.safeTransfer(treasury, fee);
        }

        // Update job status if it wasn't already in progress
        if (status == EscrowLib.JobStatus.Funded) {
            status = EscrowLib.JobStatus.InProgress;
        }

        emit FundsReleased(freelancer, freelancerAmount, milestoneId);
    }

    /**
     * @notice Opens a dispute for arbitration.
     * @dev Can be called by either party. Interacts with the DisputeResolution contract.
     * @return The ID of the created dispute
     */
    function openDispute() external nonReentrant returns (uint256) {
        require(
            msg.sender == client || msg.sender == freelancer,
            "Unauthorized"
        );
        require(status != EscrowLib.JobStatus.Disputed, "Already disputed");
        require(status != EscrowLib.JobStatus.Cancelled, "Job cancelled");
        require(status != EscrowLib.JobStatus.Completed, "Job completed");

        status = EscrowLib.JobStatus.Disputed;
        disputeId = disputeHandler.openDispute(
            address(this),
            client,
            freelancer
        );

        emit DisputeOpened(msg.sender, disputeId);
        return disputeId;
    }

    /**
     * @notice Opens a dispute for a specific milestone
     * @param milestoneId The ID of the milestone to dispute
     * @return The ID of the created dispute
     */
    function openMilestoneDispute(
        uint256 milestoneId
    ) external nonReentrant returns (uint256) {
        require(
            msg.sender == client || msg.sender == freelancer,
            "Unauthorized"
        );
        require(
            address(milestoneManager) != address(0),
            "Milestone manager not set up"
        );

        // Let the milestone manager handle the dispute creation
        uint256 newDisputeId = milestoneManager.createMilestoneDispute(
            milestoneId
        );

        // Update escrow status
        status = EscrowLib.JobStatus.Disputed;
        disputeId = newDisputeId;

        emit DisputeOpened(msg.sender, newDisputeId);
        return newDisputeId;
    }

    /**
     * @notice Handles the resolution of a dispute
     * @param _disputeId The ID of the dispute
     * @param freelancerWon Whether the freelancer won the dispute
     * @param milestoneId The ID of the disputed milestone (0 for general disputes)
     * @param clientAward Amount awarded to the client
     * @param freelancerAward Amount awarded to the freelancer
     */
    function handleDisputeResolution(
        uint256 _disputeId,
        bool freelancerWon,
        uint256 milestoneId,
        uint256 clientAward,
        uint256 freelancerAward
    ) external onlyDisputeHandler nonReentrant {
        require(_disputeId == disputeId, "Invalid dispute ID");
        require(status == EscrowLib.JobStatus.Disputed, "Not disputed");

        // If milestone specific dispute, let milestone manager handle it
        if (address(milestoneManager) != address(0)) {
            milestoneManager.handleDisputeResolution(
                milestoneId,
                freelancerWon
            );
        }

        // Process fund transfers according to dispute resolution
        uint256 availableBalance = paymentToken.balanceOf(address(this));

        // Ensure we don't exceed available balance
        require(
            clientAward + freelancerAward <= availableBalance,
            "Insufficient escrow balance"
        );

        // Transfer awards
        if (clientAward > 0) {
            paymentToken.safeTransfer(client, clientAward);
            emit Refunded(client, clientAward);
        }

        if (freelancerAward > 0) {
            // Calculate platform fee for freelancer award
            uint256 fee = EscrowLib.calculateFee(
                freelancerAward,
                PLATFORM_FEE_BPS
            );
            uint256 freelancerAmount = freelancerAward - fee;

            paymentToken.safeTransfer(freelancer, freelancerAmount);

            if (fee > 0) {
                paymentToken.safeTransfer(treasury, fee);
            }

            emit FundsReleased(freelancer, freelancerAmount, milestoneId);
        }

        // Reset dispute status
        status = EscrowLib.JobStatus.InProgress;

        emit DisputeResolved(disputeId, freelancerWon);
    }

    /**
     * @notice Refunds the client if agreed upon.
     * @dev Can only be called by client in funded state or by dispute handler.
     * @param amount Amount to refund.
     */
    function refundClient(uint256 amount) external nonReentrant {
        // Either client can request refund in funded state
        // Or dispute handler can issue refund after resolution
        require(
            (msg.sender == client && status == EscrowLib.JobStatus.Funded) ||
                (msg.sender == address(disputeHandler)),
            "Unauthorized"
        );

        require(
            amount <= paymentToken.balanceOf(address(this)),
            "Insufficient balance"
        );
        paymentToken.safeTransfer(client, amount);

        emit Refunded(client, amount);
    }

    /**
     * @notice Cancels the job and refunds remaining funds to client.
     * @dev Can only be called by client before work starts or in special cases.
     */
    function cancelJob() external onlyClient nonReentrant {
        // Can only cancel if not disputed and either not yet started or milestone manager allows it
        require(
            status != EscrowLib.JobStatus.Disputed,
            "Cannot cancel disputed job"
        );

        if (address(milestoneManager) != address(0)) {
            // If milestone manager exists, delegate cancellation check to it
            milestoneManager.cancelJob(); // This will revert if cancellation not allowed
        } else {
            // Without milestone manager, can only cancel if not in progress
            require(
                status == EscrowLib.JobStatus.Funded,
                "Job already in progress"
            );
        }

        // Refund remaining balance to client
        uint256 remainingBalance = paymentToken.balanceOf(address(this));
        if (remainingBalance > 0) {
            paymentToken.safeTransfer(client, remainingBalance);
            emit Refunded(client, remainingBalance);
        }

        status = EscrowLib.JobStatus.Cancelled;
    }

    /**
     * @notice Marks job as completed.
     * @dev Used after all milestones are paid or for manual completion.
     */
    function markCompleted() external {
        require(
            msg.sender == client ||
                (address(milestoneManager) != address(0) &&
                    milestoneManager.jobStatus() ==
                    EscrowLib.JobStatus.Completed),
            "Unauthorized"
        );

        status = EscrowLib.JobStatus.Completed;

        // Release any remaining funds to client
        uint256 remainingBalance = paymentToken.balanceOf(address(this));
        if (remainingBalance > 0) {
            paymentToken.safeTransfer(client, remainingBalance);
            emit Refunded(client, remainingBalance);
        }
    }

    /**
     * @notice Gets the remaining balance in the escrow
     * @return The remaining token balance
     */
    function getRemainingBalance() external view returns (uint256) {
        return paymentToken.balanceOf(address(this));
    }
}
