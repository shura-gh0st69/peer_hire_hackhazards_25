// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {JobRegistry} from "../contracts/Jobs/JobRegistry.sol";

/**
 * @title JobRegistryTest
 * @notice Test suite for the JobRegistry contract functionality
 * @dev Tests the job creation, application, assignment, and completion flow
 */
contract JobRegistryTest is BaseTest {
    function setUp() public override {
        super.setUp();
    }

    /**
     * @notice Test case: Create a new job listing
     * @dev This test demonstrates:
     * 1. Client creating a basic job with title, description, required skills, budget
     * 2. Verification of all job details after creation
     * 3. Proper job status (Open) after creation
     * 4. Job creation timestamps and default values
     */
    function test_CreateJob() public {
        vm.startPrank(client);
        uint256 jobId = createBasicJob();

        JobRegistry.JobListing memory job = jobRegistry.getJob(jobId);

        assertEq(job.client, client);
        assertEq(job.title, "Test Job");
        assertEq(job.description, "Test job description");
        assertEq(job.requiredSkills[0], "Solidity");
        assertEq(job.requiredSkills[1], "Smart Contracts");
        assertEq(job.budget, 1000 * 10 ** 6);
        assertEq(job.paymentToken, address(usdc));
        assertEq(uint(job.status), uint(JobRegistry.JobListingStatus.Open));
        assertTrue(job.createdAt > 0);
        assertEq(job.assignedFreelancer, address(0));
    }

    /**
     * @notice Test case: Assign a job to a freelancer
     * @dev This test demonstrates:
     * 1. Client creating a job listing
     * 2. Freelancer applying with proposal and bid amount
     * 3. Client accepting the freelancer's application
     * 4. Job being assigned to the freelancer
     * 5. Escrow contract creation for the job
     * 6. Verification of assignment details
     */
    function test_AssignJob() public {
        vm.startPrank(client);
        uint256 jobId = createBasicJob();
        vm.stopPrank();
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10 ** 6
        );
        vm.prank(client);
        address escrowAddress = jobRegistry.acceptApplication(applicationId);
        vm.prank(client);
        JobRegistry.JobListing memory job = jobRegistry.getJob(jobId);
        assertEq(job.assignedFreelancer, freelancer);
        assertEq(job.escrowContract, escrowAddress);
    }

    /**
     * @notice Test case: Mark a job as completed
     * @dev This test demonstrates:
     * 1. Complete job creation and assignment flow
     * 2. Client marking the job as completed
     * 3. Status update to reflect completion
     * 4. Job completion lifecycle
     */
    function test_CompleteJob() public {
        // Create and assign a job
        vm.startPrank(client);
        uint256 jobId = createBasicJob();
        vm.stopPrank();
        
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10 ** 6
        );
        
        vm.prank(client);
        jobRegistry.acceptApplication(applicationId);
        
        // Mark the job as completed
        vm.prank(client);
        jobRegistry.markJobCompleted(jobId);
        
        // Check status
        JobRegistry.JobListing memory job = jobRegistry.getJob(jobId);
        assertEq(uint(job.status), uint(JobRegistry.JobListingStatus.Completed));
    }

    /**
     * @notice Test case: Freelancer applies for a job
     * @dev This test demonstrates:
     * 1. Client creating a job listing
     * 2. Freelancer submitting an application with proposal and bid
     * 3. Verification of application details
     * 4. Initial application status (not yet accepted)
     * 5. Application tracking and retrieval
     */
    function test_ApplyForJob() public {
        uint256 jobId = createBasicJob();
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10 ** 6 // Bid slightly lower than budget
        );
        JobRegistry.JobApplication memory application = jobRegistry.getApplication(applicationId);

        assertEq(application.freelancer, freelancer);
        assertEq(application.jobId, jobId);
        assertEq(application.proposal, "I can do this job");
        assertEq(application.bidAmount, 900 * 10 ** 6);
        assertFalse(application.isAccepted);
        assertTrue(application.createdAt > 0);
    }

    /**
     * @notice Test case: Client accepts a job application
     * @dev This test demonstrates:
     * 1. Complete application submission flow
     * 2. Client accepting a specific application
     * 3. Escrow contract creation as part of acceptance
     * 4. Job status and details update after acceptance
     * 5. Linking of job, freelancer, and escrow contract
     */
    function test_AcceptApplication() public {
        uint256 jobId = createBasicJob();
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10 ** 6
        );
        vm.prank(client);
        address escrowAddress = jobRegistry.acceptApplication(applicationId);
        assertTrue(escrowAddress != address(0));
        vm.prank(client);
        JobRegistry.JobListing memory job = jobRegistry.getJob(jobId);
        assertEq(job.assignedFreelancer, freelancer);
        assertEq(job.escrowContract, escrowAddress);
    }

    /**
     * @notice Test case: Non-freelancer cannot apply for jobs
     * @dev This test demonstrates:
     * 1. Client attempting to apply for a job (invalid role)
     * 2. Transaction reverting with "Not a freelancer" error
     * 3. Role-based access control for applications
     * 4. Protection against unauthorized applications
     */
    function test_RevertWhen_NonFreelancerApplies() public {
        uint256 jobId = createBasicJob();
        vm.prank(client);
        vm.expectRevert("Not a freelancer");
        jobRegistry.applyForJob(jobId, "I can do this job", 900 * 10 ** 6);
    }

    /**
     * @notice Test case: Only job client can accept applications
     * @dev This test demonstrates:
     * 1. Complete job creation and application flow
     * 2. Freelancer attempting to accept their own application (invalid)
     * 3. Transaction reverting with "Only job client" error
     * 4. Access control for application acceptance
     * 5. Protection against unauthorized acceptance
     */
    function test_RevertWhen_NonClientAcceptsApplication() public {
        uint256 jobId = createBasicJob();
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10 ** 6
        );

        vm.prank(freelancer);
        vm.expectRevert("Only job client");
        jobRegistry.acceptApplication(applicationId);
    }

    /**
     * @notice Test case: Client can cancel a job
     * @dev This test demonstrates:
     * 1. Job creation by client
     * 2. Client cancelling the job
     * 3. Status update to Cancelled
     * 4. Job cancellation workflow
     */
    function test_CancelJob() public {
        uint256 jobId = createBasicJob();
        vm.prank(client);
        jobRegistry.cancelJob(jobId);
        
        JobRegistry.JobListing memory job = jobRegistry.getJob(jobId);
        assertEq(uint(job.status), uint(JobRegistry.JobListingStatus.Cancelled));
    }
}
