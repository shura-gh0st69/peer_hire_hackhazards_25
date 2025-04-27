// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {JobRegistry} from "../contracts/Jobs/JobRegistry.sol";

contract JobRegistryTest is BaseTest {
    function setUp() public override {
        super.setUp();
    }

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

    function test_RevertWhen_NonFreelancerApplies() public {
        uint256 jobId = createBasicJob();
        vm.prank(client);
        vm.expectRevert("Not a freelancer");
        jobRegistry.applyForJob(jobId, "I can do this job", 900 * 10 ** 6);
    }

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

    function test_CancelJob() public {
        uint256 jobId = createBasicJob();
        vm.prank(client);
        jobRegistry.cancelJob(jobId);
        
        JobRegistry.JobListing memory job = jobRegistry.getJob(jobId);
        assertEq(uint(job.status), uint(JobRegistry.JobListingStatus.Cancelled));
    }
}
