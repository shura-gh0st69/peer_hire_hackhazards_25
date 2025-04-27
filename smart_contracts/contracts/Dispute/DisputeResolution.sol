// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Escrow} from "../Escrow/Escrow.sol";
import {Reputation} from "../Reputation/Reputation.sol";

/**
 * @title DisputeResolution
 * @notice Handles disputes between clients and freelancers
 */
contract DisputeResolution {
    /// @notice Possible outcomes of a dispute
    enum DisputeOutcome {
        None,
        ClientWins,
        FreelancerWins,
        Compromise
    }

    /// @dev Represents a dispute case
    struct Dispute {
        address escrow;
        address client;
        address freelancer;
        string clientEvidence;
        string freelancerEvidence;
        DisputeOutcome outcome;
        uint256 clientAward;
        uint256 freelancerAward;
        bool isResolved;
        uint256 createdAt;
        uint256 resolvedAt;
    }

    /// @notice Platform administrator with authority to resolve disputes
    address public admin;

    /// @notice Optional governance contract for decentralized dispute resolution
    address public governanceContract;

    /// @notice Updates reputation based on dispute outcomes
    Reputation public reputation;

    /// @notice All disputes handled by this contract
    Dispute[] public disputes;

    /// @notice Events for dispute lifecycle
    event DisputeCreated(
        uint256 indexed disputeId,
        address indexed escrow,
        address indexed initiator
    );
    event EvidenceSubmitted(
        uint256 indexed disputeId,
        address indexed submitter
    );
    event DisputeResolved(uint256 indexed disputeId, DisputeOutcome outcome);

    /// @dev Only the platform admin can call this function
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    /// @dev Only the governance contract can call this function (if set)
    modifier onlyGovernance() {
        require(
            msg.sender == governanceContract ||
                (governanceContract == address(0) && msg.sender == admin),
            "Not authorized"
        );
        _;
    }

    /// @dev Only parties involved in the dispute can call this function
    modifier onlyDisputeParty(uint256 disputeId) {
        require(disputeId < disputes.length, "Invalid dispute ID");
        require(
            msg.sender == disputes[disputeId].client ||
                msg.sender == disputes[disputeId].freelancer,
            "Not dispute party"
        );
        _;
    }

    constructor(address _admin, address _reputation) {
        require(_admin != address(0), "Invalid admin address");
        require(_reputation != address(0), "Invalid reputation address");

        admin = _admin;
        reputation = Reputation(_reputation);
    }

    /**
     * @notice Opens a new dispute
     * @param escrowContract Address of the escrow contract
     * @param client Address of the client
     * @param freelancer Address of the freelancer
     * @return disputeId ID of the created dispute
     */
    function openDispute(
        address escrowContract,
        address client,
        address freelancer
    ) external returns (uint256 disputeId) {
        // Either the escrow contract itself, the client, or the freelancer can open a dispute
        require(
            msg.sender == escrowContract ||
                msg.sender == client ||
                msg.sender == freelancer,
            "Unauthorized"
        );

        uint256 newDisputeId = disputes.length;

        disputes.push(
            Dispute({
                escrow: escrowContract,
                client: client,
                freelancer: freelancer,
                clientEvidence: "",
                freelancerEvidence: "",
                outcome: DisputeOutcome.None,
                clientAward: 0,
                freelancerAward: 0,
                isResolved: false,
                createdAt: block.timestamp,
                resolvedAt: 0
            })
        );

        emit DisputeCreated(newDisputeId, escrowContract, msg.sender);
        return newDisputeId;
    }

    /**
     * @notice Submits evidence for a dispute
     * @param disputeId ID of the dispute
     * @param evidence IPFS hash or other reference to submitted evidence
     */
    function submitEvidence(
        uint256 disputeId,
        string calldata evidence
    ) external onlyDisputeParty(disputeId) {
        require(!disputes[disputeId].isResolved, "Dispute already resolved");
        require(bytes(evidence).length > 0, "Evidence cannot be empty");

        if (msg.sender == disputes[disputeId].client) {
            disputes[disputeId].clientEvidence = evidence;
        } else {
            disputes[disputeId].freelancerEvidence = evidence;
        }

        emit EvidenceSubmitted(disputeId, msg.sender);
    }

    /**
     * @notice Resolves a dispute with a specified outcome
     * @param disputeId ID of the dispute
     * @param outcome The decided outcome
     * @param clientAward Amount awarded to the client (if any)
     * @param freelancerAward Amount awarded to the freelancer (if any)
     */
    function resolveDispute(
        uint256 disputeId,
        DisputeOutcome outcome,
        uint256 clientAward,
        uint256 freelancerAward
    ) external onlyGovernance {
        require(disputeId < disputes.length, "Invalid dispute ID");
        require(!disputes[disputeId].isResolved, "Already resolved");
        require(outcome != DisputeOutcome.None, "Invalid outcome");

        Dispute storage dispute = disputes[disputeId];

        dispute.outcome = outcome;
        dispute.clientAward = clientAward;
        dispute.freelancerAward = freelancerAward;
        dispute.isResolved = true;
        dispute.resolvedAt = block.timestamp;

        // Update reputation based on dispute outcome
        if (outcome == DisputeOutcome.ClientWins) {
            reputation.recordDisputeOutcome(dispute.client, dispute.freelancer);
        } else if (outcome == DisputeOutcome.FreelancerWins) {
            reputation.recordDisputeOutcome(dispute.freelancer, dispute.client);
        }

        emit DisputeResolved(disputeId, outcome);
    }

    /**
     * @notice Sets the governance contract for decentralized dispute resolution
     * @param _governanceContract Address of the governance contract
     */
    function setGovernanceContract(
        address _governanceContract
    ) external onlyAdmin {
        governanceContract = _governanceContract;
    }

    /**
     * @notice Changes the platform admin
     * @param newAdmin Address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }

    /**
     * @notice Gets a dispute by ID
     * @param disputeId The ID of the dispute to fetch
     * @return escrow The escrow contract address
     * @return client The client's address
     * @return freelancer The freelancer's address
     * @return clientEvidence The client's submitted evidence
     * @return freelancerEvidence The freelancer's submitted evidence
     * @return outcome The outcome of the dispute
     * @return clientAward Amount awarded to the client
     * @return freelancerAward Amount awarded to the freelancer
     * @return isResolved Whether the dispute is resolved
     * @return createdAt When the dispute was created
     * @return resolvedAt When the dispute was resolved
     */
    function getDispute(
        uint256 disputeId
    )
        external
        view
        returns (
            address escrow,
            address client,
            address freelancer,
            string memory clientEvidence,
            string memory freelancerEvidence,
            DisputeOutcome outcome,
            uint256 clientAward,
            uint256 freelancerAward,
            bool isResolved,
            uint256 createdAt,
            uint256 resolvedAt
        )
    {
        require(disputeId < disputes.length, "Invalid dispute ID");
        Dispute memory dispute = disputes[disputeId];

        return (
            dispute.escrow,
            dispute.client,
            dispute.freelancer,
            dispute.clientEvidence,
            dispute.freelancerEvidence,
            dispute.outcome,
            dispute.clientAward,
            dispute.freelancerAward,
            dispute.isResolved,
            dispute.createdAt,
            dispute.resolvedAt
        );
    }

    /**
     * @notice Gets the total number of disputes
     * @return Count of disputes
     */
    function getDisputeCount() external view returns (uint256) {
        return disputes.length;
    }
}
