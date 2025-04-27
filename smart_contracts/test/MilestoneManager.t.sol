// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {Escrow} from "../contracts/Escrow/Escrow.sol";
import {MilestoneManager} from "../contracts/Milestones/MilestoneManager.sol";
import {EscrowLib} from "../contracts/libraries/EscrowLib.sol";

/**
 * @title MilestoneManagerTest
 * @notice Test suite for the MilestoneManager contract functionality
 * @dev Tests milestone creation, completion, and approval workflows
 */
contract MilestoneManagerTest is BaseTest {
    Escrow public escrow;
    MilestoneManager public milestoneManager;
    uint256 public constant JOB_AMOUNT = 1000 * 10 ** 6; // 1000 USDC

    function setUp() public override {
        super.setUp();

        // Create an escrow contract for testing milestones
        vm.prank(client);
        escrow = Escrow(
            escrowFactory.createEscrow(freelancer, address(usdc), JOB_AMOUNT)
        );

        // Setup milestone manager
        vm.prank(client);
        escrow.setupMilestoneManager();
        milestoneManager = MilestoneManager(address(escrow.milestoneManager()));
        
        // Fund the escrow for milestone testing
        vm.startPrank(client);
        usdc.approve(address(escrow), JOB_AMOUNT);
        escrow.fundJob();
        vm.stopPrank();
    }

    /**
     * @notice Test case: Create milestones for a project
     * @dev This test demonstrates:
     * 1. Client creating multiple milestones with descriptions and payment amounts
     * 2. Verification that milestone details are correctly stored
     * 3. Initial state of milestones (not completed, not approved)
     * 4. Distribution of total job amount across milestones
     */
    function test_CreateMilestones() public {
        string[] memory descriptions = new string[](2);
        descriptions[0] = "Initial design phase";
        descriptions[1] = "Final implementation";

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = JOB_AMOUNT / 2; // 500 USDC
        amounts[1] = JOB_AMOUNT / 2; // 500 USDC

        vm.prank(client);
        milestoneManager.createMilestones(descriptions, amounts);

        // Check milestone 0
        (string memory desc0, uint256 amount0, bool completed0, bool approved0) = 
            milestoneManager.milestones(0);
            
        assertEq(desc0, "Initial design phase");
        assertEq(amount0, JOB_AMOUNT / 2);
        assertFalse(completed0);
        assertFalse(approved0);
        
        // Check milestone 1
        (string memory desc1, uint256 amount1, bool completed1, bool approved1) = 
            milestoneManager.milestones(1);
            
        assertEq(desc1, "Final implementation");
        assertEq(amount1, JOB_AMOUNT / 2);
        assertFalse(completed1);
        assertFalse(approved1);
    }
    
    /**
     * @notice Test case: Freelancer marks a milestone as completed
     * @dev This test demonstrates:
     * 1. Setting up a milestone for the project
     * 2. Freelancer marking the milestone as completed
     * 3. Verification of the milestone's status change
     * 4. First step in the milestone payment workflow
     */
    function test_CompleteMilestone() public {
        // Create milestones
        string[] memory descriptions = new string[](1);
        descriptions[0] = "Complete project";
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = JOB_AMOUNT;
        
        vm.prank(client);
        milestoneManager.createMilestones(descriptions, amounts);
        
        // Freelancer marks milestone as completed
        vm.prank(freelancer);
        milestoneManager.completeMilestone(0);
        
        (, , bool completed, ) = milestoneManager.milestones(0);
        assertTrue(completed, "Milestone should be marked as completed");
    }
    
    /**
     * @notice Test case: Client approves a completed milestone
     * @dev This test demonstrates:
     * 1. Complete milestone creation and completion flow
     * 2. Client approving the freelancer's work
     * 3. Verification of both completed and approved states
     * 4. Preparation for milestone payment release
     */
    function test_ApproveMilestone() public {
        // Create milestones
        string[] memory descriptions = new string[](1);
        descriptions[0] = "Complete project";
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = JOB_AMOUNT;
        
        vm.prank(client);
        milestoneManager.createMilestones(descriptions, amounts);
        
        // Freelancer completes milestone
        vm.prank(freelancer);
        milestoneManager.completeMilestone(0);
        
        // Client approves milestone
        vm.prank(client);
        milestoneManager.approveMilestone(0);
        
        (, , bool completed, bool approved) = milestoneManager.milestones(0);
        assertTrue(completed, "Milestone should be marked as completed");
        assertTrue(approved, "Milestone should be approved");
    }
    
    /**
     * @notice Test case: Freelancer cannot create milestones
     * @dev This test demonstrates:
     * 1. Freelancer attempting to create milestones (unauthorized)
     * 2. Transaction reverting with "Only client" error
     * 3. Access control for milestone creation
     * 4. Enforcing the client's role in project planning
     */
    function test_RevertWhen_FreelancerCreatesMilestones() public {
        string[] memory descriptions = new string[](1);
        descriptions[0] = "Test milestone";
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = JOB_AMOUNT;
        
        vm.prank(freelancer);
        vm.expectRevert("Only client");
        milestoneManager.createMilestones(descriptions, amounts);
    }
    
    /**
     * @notice Test case: Client cannot mark milestones as completed
     * @dev This test demonstrates:
     * 1. Client attempting to mark their own milestone as completed
     * 2. Transaction reverting with "Only freelancer" error
     * 3. Access control for milestone completion
     * 4. Enforcing the freelancer's role in work delivery
     */
    function test_RevertWhen_ClientCompletesMilestone() public {
        // Create milestones
        string[] memory descriptions = new string[](1);
        descriptions[0] = "Complete project";
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = JOB_AMOUNT;
        
        vm.prank(client);
        milestoneManager.createMilestones(descriptions, amounts);
        
        // Client tries to complete milestone
        vm.prank(client);
        vm.expectRevert("Only freelancer");
        milestoneManager.completeMilestone(0);
    }
    
    /**
     * @notice Test case: Freelancer cannot approve milestones
     * @dev This test demonstrates:
     * 1. Complete milestone creation and completion flow
     * 2. Freelancer attempting to approve their own work
     * 3. Transaction reverting with "Only client" error
     * 4. Access control for milestone approval
     * 5. Enforcing the client's role in quality assurance
     */
    function test_RevertWhen_FreelancerApprovesMilestone() public {
        // Create milestones
        string[] memory descriptions = new string[](1);
        descriptions[0] = "Complete project";
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = JOB_AMOUNT;
        
        vm.startPrank(client);
        milestoneManager.createMilestones(descriptions, amounts);
        vm.stopPrank();
        
        // Freelancer completes milestone
        vm.prank(freelancer);
        milestoneManager.completeMilestone(0);
        
        // Freelancer tries to approve milestone
        vm.prank(freelancer);
        vm.expectRevert("Only client");
        milestoneManager.approveMilestone(0);
    }
    
    /**
     * @notice Test case: Cannot approve uncompleted milestones
     * @dev This test demonstrates:
     * 1. Creating a milestone in the project
     * 2. Client attempting to approve a milestone that hasn't been marked as completed
     * 3. Transaction reverting with "Milestone not completed" error
     * 4. Ensuring proper workflow sequence (complete then approve)
     */
    function test_RevertWhen_ApprovingUncompleted() public {
        // Create milestones
        string[] memory descriptions = new string[](1);
        descriptions[0] = "Complete project";
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = JOB_AMOUNT;
        
        vm.prank(client);
        milestoneManager.createMilestones(descriptions, amounts);
        
        // Client tries to approve uncompleted milestone
        vm.prank(client);
        vm.expectRevert("Milestone not completed");
        milestoneManager.approveMilestone(0);
    }
}