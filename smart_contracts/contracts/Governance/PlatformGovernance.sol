// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PlatformGovernance
 * @notice Handles governance proposals and voting for the platform
 */
contract PlatformGovernance  {
    /// @dev Status of proposals
    enum ProposalStatus {
        Active,
        Passed,
        Rejected,
        Executed,
        Canceled
    }
    
    /// @dev Types of governance proposals
    enum ProposalType {
        FeesUpdate,         // Update platform fees
        DisputeResolution,  // Dispute resolution change
        ContractUpgrade,    // Contract upgrade
        ParameterChange,    // Any parameter change
        FundsMovement,      // Move treasury funds
        Other               // Other proposal type
    }
    
    /// @dev Structure for governance proposals
    struct Proposal {
        address proposer;           // Who proposed it
        string description;         // Description of the proposal
        ProposalType proposalType;  // Type of proposal
        bytes callData;             // Call data to execute if passed
        address targetContract;     // Contract to call if executed
        uint256 value;              // ETH value to send with call
        uint256 votesFor;           // Total votes in favor
        uint256 votesAgainst;       // Total votes against
        ProposalStatus status;      // Current status
        uint256 startTime;          // When voting begins
        uint256 endTime;            // When voting ends
        mapping(address => bool) hasVoted; // Track who has voted
    }
    
    /// @notice Governance token used for voting
    IERC20 public governanceToken;
    
    /// @notice Admin address
    address public admin;
    
    /// @notice Minimum tokens required to create a proposal (e.g., 1% of supply)
    uint256 public proposalThreshold;
    
    /// @notice Minimum percentage of token supply needed to pass a proposal (e.g., 10%)
    uint256 public quorumPercentage;
    
    /// @notice Duration of voting period in seconds
    uint256 public votingPeriod;
    
    /// @notice Maximum number of active proposals at once
    uint256 public maxActiveProposals;
    
    /// @notice Count of active proposals
    uint256 public activeProposalCount;
    
    /// @notice Total proposals created
    uint256 public proposalCount;
    
    /// @notice Mapping of proposal ID to proposal
    mapping(uint256 => Proposal) public proposals;
    
    /// @dev Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string description,
        uint256 startTime,
        uint256 endTime
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event ProposalStatusChanged(uint256 indexed proposalId, ProposalStatus status);
    event GovernanceParameterChanged(string paramName, uint256 oldValue, uint256 newValue);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    constructor(
        address _admin,
        address _governanceToken,
        uint256 _proposalThreshold,
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        uint256 _maxActiveProposals
    ) {
        require(_admin != address(0), "Invalid admin address");
        require(_governanceToken != address(0), "Invalid token address");
        require(_quorumPercentage <= 100, "Quorum percentage too high");
        require(_votingPeriod > 0, "Invalid voting period");
        
        admin = _admin;
        governanceToken = IERC20(_governanceToken);
        proposalThreshold = _proposalThreshold;
        quorumPercentage = _quorumPercentage;
        votingPeriod = _votingPeriod;
        maxActiveProposals = _maxActiveProposals;
    }
    
    /**
     * @notice Creates a new governance proposal
     * @param description Description of the proposal
     * @param proposalType Type of the proposal
     * @param targetContract Contract to call if executed
     * @param callData Call data to execute if passed
     * @param value ETH value to send with call
     * @return proposalId ID of the created proposal
     */
    function createProposal(
        string calldata description,
        ProposalType proposalType,
        address targetContract,
        bytes calldata callData,
        uint256 value
    ) external returns (uint256 proposalId) {
        require(bytes(description).length > 0, "Description required");
        require(targetContract != address(0), "Invalid target contract");
        require(activeProposalCount < maxActiveProposals, "Too many active proposals");
        
        // Check proposer has enough tokens
        uint256 proposerBalance = governanceToken.balanceOf(msg.sender);
        require(proposerBalance >= proposalThreshold, "Below proposal threshold");
        
        proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.proposalType = proposalType;
        proposal.callData = callData;
        proposal.targetContract = targetContract;
        proposal.value = value;
        proposal.status = ProposalStatus.Active;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        
        activeProposalCount++;
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            proposalType,
            description,
            proposal.startTime,
            proposal.endTime
        );
        
        return proposalId;
    }
    
    /**
     * @notice Casts a vote on a proposal
     * @param proposalId ID of the proposal
     * @param support Whether the vote is in support
     */
    function castVote(uint256 proposalId, bool support) external {
        require(proposalId < proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        // Get voter's balance
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        // Record vote
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }
    
    /**
     * @notice Processes a proposal after voting ends
     * @param proposalId ID of the proposal to process
     */
    function processProposal(uint256 proposalId) external {
        require(proposalId < proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Active, "Not active proposal");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        uint256 totalSupply = governanceToken.totalSupply();
        
        // Check quorum
        uint256 quorumRequired = (totalSupply * quorumPercentage) / 100;
        bool quorumReached = totalVotes >= quorumRequired;
        
        if (!quorumReached) {
            proposal.status = ProposalStatus.Rejected;
            activeProposalCount--;
            emit ProposalStatusChanged(proposalId, ProposalStatus.Rejected);
            return;
        }
        
        // Check if proposal passed
        if (proposal.votesFor > proposal.votesAgainst) {
            proposal.status = ProposalStatus.Passed;
            emit ProposalStatusChanged(proposalId, ProposalStatus.Passed);
        } else {
            proposal.status = ProposalStatus.Rejected;
            activeProposalCount--;
            emit ProposalStatusChanged(proposalId, ProposalStatus.Rejected);
        }
    }
    
    /**
     * @notice Executes a passed proposal
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) external {
        require(proposalId < proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Passed, "Not passed");
        
        proposal.status = ProposalStatus.Executed;
        activeProposalCount--;
        
        // Execute the call
        (bool success,) = proposal.targetContract.call{value: proposal.value}(proposal.callData);
        require(success, "Proposal execution failed");
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @notice Cancels a proposal (only proposer or admin)
     * @param proposalId ID of the proposal to cancel
     */
    function cancelProposal(uint256 proposalId) external {
        require(proposalId < proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == admin,
            "Not authorized"
        );
        require(proposal.status == ProposalStatus.Active, "Not active");
        
        proposal.status = ProposalStatus.Canceled;
        activeProposalCount--;
        
        emit ProposalCanceled(proposalId);
    }
    
    /**
     * @notice Updates governance parameters
     * @param _proposalThreshold New proposal threshold
     * @param _quorumPercentage New quorum percentage
     * @param _votingPeriod New voting period
     * @param _maxActiveProposals New maximum active proposals
     */
    function updateGovernanceParameters(
        uint256 _proposalThreshold,
        uint256 _quorumPercentage,
        uint256 _votingPeriod,
        uint256 _maxActiveProposals
    ) external onlyAdmin {
        require(_quorumPercentage <= 100, "Quorum percentage too high");
        require(_votingPeriod > 0, "Invalid voting period");
        
        emit GovernanceParameterChanged("proposalThreshold", proposalThreshold, _proposalThreshold);
        emit GovernanceParameterChanged("quorumPercentage", quorumPercentage, _quorumPercentage);
        emit GovernanceParameterChanged("votingPeriod", votingPeriod, _votingPeriod);
        emit GovernanceParameterChanged("maxActiveProposals", maxActiveProposals, _maxActiveProposals);
        
        proposalThreshold = _proposalThreshold;
        quorumPercentage = _quorumPercentage;
        votingPeriod = _votingPeriod;
        maxActiveProposals = _maxActiveProposals;
    }
    
    /**
     * @notice Gets detailed information about a proposal
     * @param proposalId ID of the proposal
     * @return proposer Address of proposer
     * @return description Description of the proposal
     * @return proposalType Type of the proposal
     * @return targetContract Target contract address
     * @return votesFor Total votes in favor
     * @return votesAgainst Total votes against
     * @return status Current status
     * @return startTime Start timestamp
     * @return endTime End timestamp
     */
    function getProposalDetails(uint256 proposalId)
        external
        view
        returns (
            address proposer,
            string memory description,
            ProposalType proposalType,
            address targetContract,
            uint256 votesFor,
            uint256 votesAgainst,
            ProposalStatus status,
            uint256 startTime,
            uint256 endTime
        )
    {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.proposer,
            proposal.description,
            proposal.proposalType,
            proposal.targetContract,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.status,
            proposal.startTime,
            proposal.endTime
        );
    }
    
    /**
     * @notice Checks if a user has voted on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     * @return Whether the user has voted
     */
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        return proposals[proposalId].hasVoted[voter];
    }
    
    /**
     * @notice Updates the admin address
     * @param newAdmin New admin address
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
    
    /**
     * @dev Allows the contract to receive ETH
     */
    receive() external payable {}
}