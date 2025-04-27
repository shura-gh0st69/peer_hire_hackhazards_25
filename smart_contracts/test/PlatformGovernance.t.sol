// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {PlatformGovernance} from "../contracts/Governance/PlatformGovernance.sol";

contract MockGovernanceToken is ERC20 {
    constructor() ERC20("Governance Token", "GOV") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}

contract MockTarget {
    uint256 public value;
    
    function setValue(uint256 _value) external {
        value = _value;
    }
}

contract PlatformGovernanceTest is BaseTest {
    PlatformGovernance public governance;
    MockGovernanceToken public govToken;
    MockTarget public target;
    
    uint256 public constant PROPOSAL_THRESHOLD = 100000 * 10**18; // 100k tokens
    uint256 public constant QUORUM_PERCENTAGE = 10; // 10%
    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public constant MAX_ACTIVE_PROPOSALS = 10;

    function setUp() public override {
        super.setUp();

        // Deploy governance token and target contract
        govToken = new MockGovernanceToken();
        target = new MockTarget();
        
        vm.startPrank(admin);
        governance = new PlatformGovernance(
            admin,
            address(govToken),
            PROPOSAL_THRESHOLD,
            QUORUM_PERCENTAGE,
            VOTING_PERIOD,
            MAX_ACTIVE_PROPOSALS
        );
        
        // Distribute governance tokens
        govToken.transfer(client, 200000 * 10**18);
        govToken.transfer(freelancer, 200000 * 10**18);
        vm.stopPrank();
    }

    function test_CreateProposal() public {
        bytes memory callData = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        
        vm.startPrank(client);
        uint256 proposalId = governance.createProposal(
            "Update target value",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            callData,
            0 // No ETH value
        );
        vm.stopPrank();

        (
            address proposer,
            string memory description,
            PlatformGovernance.ProposalType proposalType,
            address targetContract,
            uint256 votesFor,
            uint256 votesAgainst,
            PlatformGovernance.ProposalStatus status,
            uint256 startTime,
            uint256 endTime
        ) = governance.getProposalDetails(proposalId);

        assertEq(proposer, client);
        assertEq(description, "Update target value");
        assertEq(uint(proposalType), uint(PlatformGovernance.ProposalType.ParameterChange));
        assertEq(targetContract, address(target));
        assertEq(votesFor, 0);
        assertEq(votesAgainst, 0);
        assertEq(uint(status), uint(PlatformGovernance.ProposalStatus.Active));
        assertEq(endTime, startTime + VOTING_PERIOD);
    }

    function test_VotingProcess() public {
        // Create proposal
        vm.prank(client);
        uint256 proposalId = governance.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            "",
            0
        );

        // Cast votes
        vm.prank(client);
        governance.castVote(proposalId, true); // Vote in favor

        vm.prank(freelancer);
        governance.castVote(proposalId, false); // Vote against

        (
            ,,,, 
            uint256 votesFor,
            uint256 votesAgainst,
            ,,,
        ) = governance.getProposalDetails(proposalId);

        assertEq(votesFor, 200000 * 10**18); // Client's full balance
        assertEq(votesAgainst, 200000 * 10**18); // Freelancer's full balance
    }

    function test_ProposalExecution() public {
        bytes memory callData = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        
        // Create and vote on proposal
        vm.prank(client);
        uint256 proposalId = governance.createProposal(
            "Set target value",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            callData,
            0
        );

        // Cast enough votes to pass
        vm.prank(client);
        governance.castVote(proposalId, true);
        
        // Advance time past voting period
        vm.warp(block.timestamp + VOTING_PERIOD + 1);
        
        // Process proposal
        governance.processProposal(proposalId);
        
        // Execute proposal
        governance.executeProposal(proposalId);
        
        // Verify execution
        assertEq(target.value(), 42);
    }

    function test_ProposalCancellation() public {
        vm.prank(client);
        uint256 proposalId = governance.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            "",
            0
        );

        vm.prank(client);
        governance.cancelProposal(proposalId);

        (,,,,,, PlatformGovernance.ProposalStatus status,,) = 
            governance.getProposalDetails(proposalId);
        
        assertEq(uint(status), uint(PlatformGovernance.ProposalStatus.Canceled));
    }

    function test_RevertWhen_InsufficientProposalThreshold() public {
        address poorUser = makeAddr("poor");
        vm.prank(admin);
        govToken.transfer(poorUser, PROPOSAL_THRESHOLD - 1);

        bytes memory callData = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        
        vm.prank(poorUser);
        vm.expectRevert("Below proposal threshold");
        governance.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            callData,
            0
        );
    }

    function test_RevertWhen_DoubleVoting() public {
        vm.prank(client);
        uint256 proposalId = governance.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            "",
            0
        );

        vm.startPrank(client);
        governance.castVote(proposalId, true);
        
        vm.expectRevert("Already voted");
        governance.castVote(proposalId, true);
        vm.stopPrank();
    }

    function test_RevertWhen_ExecutingUnpassedProposal() public {
        vm.prank(client);
        uint256 proposalId = governance.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            "",
            0
        );

        vm.expectRevert("Not passed");
        governance.executeProposal(proposalId);
    }

    function test_QuorumRequirement() public {
        bytes memory callData = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        
        vm.prank(client);
        uint256 proposalId = governance.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.ParameterChange,
            address(target),
            callData,
            0
        );

        // Cast vote below quorum threshold
        address smallVoter = makeAddr("smallVoter");
        vm.prank(admin);
        govToken.transfer(smallVoter, 10000 * 10**18); // Small amount
        
        vm.prank(smallVoter);
        governance.castVote(proposalId, true);
        
        // Advance time
        vm.warp(block.timestamp + VOTING_PERIOD + 1);
        
        // Process proposal
        governance.processProposal(proposalId);
        
        (,,,,,, PlatformGovernance.ProposalStatus status,,) = 
            governance.getProposalDetails(proposalId);
        
        assertEq(uint(status), uint(PlatformGovernance.ProposalStatus.Rejected));
    }
}