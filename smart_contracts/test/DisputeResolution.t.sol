// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {Escrow} from "../contracts/Escrow/Escrow.sol";
import {DisputeResolution} from "../contracts/Dispute/DisputeResolution.sol";
import {EscrowLib} from "../contracts/libraries/EscrowLib.sol";

/**
 * @title DisputeResolutionTest
 * @notice Test suite for the DisputeResolution contract functionality
 * @dev Tests the dispute creation, evidence submission, and resolution flows
 */
contract DisputeResolutionTest is BaseTest {
    Escrow public escrow;
    uint256 public constant JOB_AMOUNT = 1000 * 10 ** 6; // 1000 USDC
    uint256 public disputeId;

    function setUp() public override {
        super.setUp();

        // Create and fund an escrow for testing disputes
        vm.startPrank(client);
        escrow = Escrow(
            escrowFactory.createEscrow(freelancer, address(usdc), JOB_AMOUNT)
        );
        
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();
        vm.stopPrank();
    }

    /**
     * @notice Test case: Client creates a dispute on an escrow
     * @dev This test demonstrates:
     * 1. How a client can open a dispute with evidence
     * 2. How to check that the dispute was properly registered
     * 3. Verification of the dispute data structure
     * 4. Confirmation that the escrow status is updated to "Disputed"
     */
    function test_CreateDispute() public {
        // Client creates a dispute
        vm.prank(client);
        string memory initialEvidence = "Client complaint: work is incomplete";
        disputeId = escrow.openDispute(); // Call without arguments
        disputeResolution.submitEvidence(disputeId, initialEvidence); // Submit evidence separately

        // Check dispute was registered
        (
            address escrowAddr,
            address clientAddr,
            address freelancerAddr,
            string memory clientEvidence,
            , // freelancerEvidence
            , // outcome
            , // clientAward
            , // freelancerAward
            bool isResolved,
            , // createdAt
            // resolvedAt - removed as it's not needed here and causes stack too deep if included with all others
        ) = disputeResolution.getDispute(disputeId); // Use getDispute for clarity

        assertEq(escrowAddr, address(escrow));
        assertEq(clientAddr, client);
        assertEq(freelancerAddr, freelancer);
        assertEq(clientEvidence, initialEvidence); // Check submitted evidence
        assertFalse(isResolved);
        
        // Check escrow status
        assertEq(uint(escrow.status()), uint(EscrowLib.JobStatus.Disputed));
    }
    
    /**
     * @notice Test case: Freelancer submits evidence to an existing dispute
     * @dev This test demonstrates:
     * 1. Client first creates a dispute
     * 2. Freelancer responds by submitting their side of the story
     * 3. How to check that the evidence was properly recorded
     */
    function test_SubmitFreelancerEvidence() public {
        // Create a dispute first
        vm.prank(client);
        string memory clientEvidenceStr = "Client complaint: work is incomplete";
        disputeId = escrow.openDispute(); // Call without arguments
        disputeResolution.submitEvidence(disputeId, clientEvidenceStr); // Submit client evidence
        
        // Freelancer submits evidence
        vm.prank(freelancer);
        string memory freelancerEvidenceStr = "Freelancer defense: all work was delivered";
        disputeResolution.submitEvidence(disputeId, freelancerEvidenceStr);
        
        // Check evidence was submitted
        (
            , // escrowAddr
            , // clientAddr
            , // freelancerAddr
            , // clientEvidence
            string memory freelancerEvidence,
            , // outcome
            , // clientAward
            , // freelancerAward
            , // isResolved
            , // createdAt
            // resolvedAt - removed
        ) = disputeResolution.getDispute(disputeId); // Use getDispute
        
        assertEq(freelancerEvidence, freelancerEvidenceStr); // Check freelancer evidence
    }
    
    /**
     * @notice Test case: Admin resolves a dispute in favor of the client
     * @dev This test demonstrates:
     * 1. Creating a dispute from client
     * 2. Admin intervening and resolving the dispute
     * 3. Client getting the full refund (JOB_AMOUNT)
     * 4. Freelancer receiving nothing
     * 5. Dispute being marked as resolved with ClientWins outcome
     */
    function test_AdminResolvesDisputeForClient() public {
        // Create a dispute
        vm.prank(client);
        string memory evidence = "Client complaint: work is incomplete";
        disputeId = escrow.openDispute(); // Call without arguments
        disputeResolution.submitEvidence(disputeId, evidence); // Submit evidence
        
        // Admin resolves in client's favor
        vm.prank(admin);
        disputeResolution.resolveDispute(
            disputeId, 
            DisputeResolution.DisputeOutcome.ClientWins,
            JOB_AMOUNT, // Full refund to client
            0           // Nothing to freelancer
        );
        
        // Check dispute outcome
        (
            , // escrowAddr
            , // clientAddr
            , // freelancerAddr
            , // clientEvidence
            , // freelancerEvidence
            DisputeResolution.DisputeOutcome outcome,
            uint256 clientAward,
            uint256 freelancerAward,
            bool isResolved,
            , // createdAt
            uint256 resolvedAt
        ) = disputeResolution.getDispute(disputeId); // Use getDispute
        
        assertEq(uint(outcome), uint(DisputeResolution.DisputeOutcome.ClientWins));
        assertEq(clientAward, JOB_AMOUNT);
        assertEq(freelancerAward, 0);
        assertTrue(isResolved);
        assertTrue(resolvedAt > 0);
    }
    
    /**
     * @notice Test case: Admin resolves a dispute in favor of the freelancer
     * @dev This test demonstrates:
     * 1. Creating a dispute from client
     * 2. Admin intervening and resolving the dispute
     * 3. Client getting nothing
     * 4. Freelancer receiving the full amount (JOB_AMOUNT)
     * 5. Dispute being marked as resolved with FreelancerWins outcome
     */
    function test_AdminResolvesDisputeForFreelancer() public {
        // Create a dispute
        vm.prank(client);
        string memory evidence = "Client complaint: work is incomplete";
        disputeId = escrow.openDispute(); // Call without arguments
        disputeResolution.submitEvidence(disputeId, evidence); // Submit evidence
        
        // Admin resolves in freelancer's favor
        vm.prank(admin);
        disputeResolution.resolveDispute(
            disputeId, 
            DisputeResolution.DisputeOutcome.FreelancerWins,
            0,            // Nothing to client
            JOB_AMOUNT    // Full payment to freelancer
        );
        
        // Check dispute outcome
        (
            , // escrowAddr
            , // clientAddr
            , // freelancerAddr
            , // clientEvidence
            , // freelancerEvidence
            DisputeResolution.DisputeOutcome outcome,
            uint256 clientAward,
            uint256 freelancerAward,
            bool isResolved,
            , // createdAt
            // resolvedAt - removed
        ) = disputeResolution.getDispute(disputeId); // Use getDispute
        
        assertEq(uint(outcome), uint(DisputeResolution.DisputeOutcome.FreelancerWins));
        assertEq(clientAward, 0);
        assertEq(freelancerAward, JOB_AMOUNT);
        assertTrue(isResolved);
    }
    
    /**
     * @notice Test case: Admin resolves a dispute with a compromise solution
     * @dev This test demonstrates:
     * 1. Creating a dispute from client
     * 2. Admin resolving with a compromise (50/50 split)
     * 3. Client getting half the amount (JOB_AMOUNT/2)
     * 4. Freelancer receiving half the amount (JOB_AMOUNT/2)
     * 5. Dispute being marked as resolved with Compromise outcome
     */
    function test_AdminResolvesWithCompromise() public {
        // Create a dispute
        vm.prank(client);
        string memory evidence = "Client complaint: work is incomplete";
        disputeId = escrow.openDispute(); // Call without arguments
        disputeResolution.submitEvidence(disputeId, evidence); // Submit evidence
        
        // Admin resolves with compromise
        vm.prank(admin);
        disputeResolution.resolveDispute(
            disputeId, 
            DisputeResolution.DisputeOutcome.Compromise,
            JOB_AMOUNT / 2,  // Half to client
            JOB_AMOUNT / 2   // Half to freelancer
        );
        
        // Check dispute outcome
        (
            , // escrowAddr
            , // clientAddr
            , // freelancerAddr
            , // clientEvidence
            , // freelancerEvidence
            DisputeResolution.DisputeOutcome outcome,
            uint256 clientAward,
            uint256 freelancerAward,
            bool isResolved,
            , // createdAt
            // resolvedAt - removed
        ) = disputeResolution.getDispute(disputeId); // Use getDispute
        
        assertEq(uint(outcome), uint(DisputeResolution.DisputeOutcome.Compromise));
        assertEq(clientAward, JOB_AMOUNT / 2);
        assertEq(freelancerAward, JOB_AMOUNT / 2);
        assertTrue(isResolved);
    }
    
    /**
     * @notice Test case: Non-admin user cannot resolve disputes
     * @dev This test demonstrates:
     * 1. Creating a dispute from client
     * 2. A user without admin privileges attempting to resolve the dispute
     * 3. The transaction failing with an "Not authorized" message
     * 4. The importance of access control in dispute resolution
     */
    function test_RevertWhen_NonAdminResolvesDispute() public {
        // Create a dispute
        vm.prank(client);
        string memory evidence = "Client complaint: work is incomplete";
        disputeId = escrow.openDispute(); // Call without arguments
        disputeResolution.submitEvidence(disputeId, evidence); // Submit evidence
        
        // Non-admin tries to resolve dispute
        address nonAdmin = makeAddr("nonAdmin");
        vm.prank(nonAdmin);
        vm.expectRevert("Not authorized");
        disputeResolution.resolveDispute(
            disputeId, 
            DisputeResolution.DisputeOutcome.Compromise,
            JOB_AMOUNT / 2,
            JOB_AMOUNT / 2
        );
    }
    
    /**
     * @notice Test case: Only dispute parties can submit evidence
     * @dev This test demonstrates:
     * 1. Creating a dispute from client
     * 2. An unrelated third party attempting to submit evidence
     * 3. The transaction failing since only client or freelancer can submit
     * 4. The importance of party verification in dispute processes
     */
    function test_RevertWhen_NonPartySubmitsEvidence() public {
        // Create a dispute
        vm.prank(client);
        string memory evidence = "Client complaint: work is incomplete";
        disputeId = escrow.openDispute(); // Call without arguments
        disputeResolution.submitEvidence(disputeId, evidence); // Submit evidence
        
        // Random user tries to submit evidence
        address randomUser = makeAddr("randomUser");
        vm.prank(randomUser);
        // Expect revert from onlyDisputeParty modifier in DisputeResolution.sol
        vm.expectRevert("Not dispute party"); 
        disputeResolution.submitEvidence(disputeId, "Random user evidence");
    }
}