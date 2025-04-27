// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {JobRegistry} from "../contracts/Jobs/JobRegistry.sol";

contract JobRegistryTest is BaseTest {
    function setUp() public override {
        super.setUp();
    }

    function test_CreateJob() public {
        uint256 jobId = createBasicJob();
        assertEq(jobRegistry.getJobCount(), 1);
        
        (
            address jobClient,
            string memory title,
            ,  // description
            ,  // skills
            uint256 budget,
            address paymentToken,
            JobRegistry.JobListingStatus status,
            address assignedFreelancer,
            ,  // escrowContract
            ,  // applicants
            ,  // createdAt
            // updatedAt
        ) = jobRegistry.jobListings(jobId);

        assertEq(jobClient, client);
        assertEq(title, "Test Job");
        assertEq(budget, 1000 * 10**6);
        assertEq(paymentToken, address(usdc));
        assertEq(uint(status), uint(JobRegistry.JobListingStatus.Open));
        assertEq(assignedFreelancer, address(0));
    }

    function test_ApplyForJob() public {
        uint256 jobId = createBasicJob();
        
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10**6  // Bid slightly lower than budget
        );

        (
            address applicant,
            uint256 appliedJobId,
            string memory proposal,
            uint256 bidAmount,
            bool isAccepted,
            // createdAt
        ) = jobRegistry.applications(applicationId);

        assertEq(applicant, freelancer);
        assertEq(appliedJobId, jobId);
        assertEq(proposal, "I can do this job");
        assertEq(bidAmount, 900 * 10**6);
        assertFalse(isAccepted);
    }

    function test_AcceptApplication() public {
        uint256 jobId = createBasicJob();
        
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10**6
        );

        vm.prank(client);
        address escrowAddress = jobRegistry.acceptApplication(applicationId);
        
        assertTrue(escrowAddress != address(0));
        
        // Verify job status updated
        (,,,,,, JobRegistry.JobListingStatus status, address assignedFreelancer,,,,) = 
            jobRegistry.jobListings(jobId);
        
        assertEq(uint(status), uint(JobRegistry.JobListingStatus.Assigned));
        assertEq(assignedFreelancer, freelancer);
    }

    function test_RevertWhen_NonClientCreatesJob() public {
        string[] memory skills = new string[](1);
        skills[0] = "Solidity";

        vm.prank(freelancer);
        vm.expectRevert("Not a client");
        jobRegistry.createJob(
            "Test Job",
            "Description",
            skills,
            1000 * 10**6,
            address(usdc)
        );
    }

    function test_RevertWhen_NonFreelancerApplies() public {
        uint256 jobId = createBasicJob();

        vm.prank(client);
        vm.expectRevert("Not a freelancer");
        jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10**6
        );
    }

    function test_RevertWhen_NonClientAcceptsApplication() public {
        uint256 jobId = createBasicJob();
        
        vm.prank(freelancer);
        uint256 applicationId = jobRegistry.applyForJob(
            jobId,
            "I can do this job",
            900 * 10**6
        );

        vm.prank(freelancer);
        vm.expectRevert("Only job client");
        jobRegistry.acceptApplication(applicationId);
    }

    function test_CancelJob() public {
        uint256 jobId = createBasicJob();

        vm.prank(client);
        jobRegistry.cancelJob(jobId);

        (,,,,,, JobRegistry.JobListingStatus status,,,,) = jobRegistry.jobListings(jobId);
        assertEq(uint(status), uint(JobRegistry.JobListingStatus.Cancelled));
    }

    function test_GetClientJobs() public {
        uint256 jobId1 = createBasicJob();
        uint256 jobId2 = createBasicJob();

        uint256[] memory clientJobs = jobRegistry.getClientJobs(client);
        assertEq(clientJobs.length, 2);
        assertEq(clientJobs[0], jobId1);
        assertEq(clientJobs[1], jobId2);
    }

    function test_GetFreelancerApplications() public {
        uint256 jobId = createBasicJob();
        
        vm.startPrank(freelancer);
        jobRegistry.applyForJob(jobId, "Application 1", 900 * 10**6);
        jobRegistry.applyForJob(jobId, "Application 2", 950 * 10**6);
        vm.stopPrank();

        uint256[] memory applications = jobRegistry.getFreelancerApplications(freelancer);
        assertEq(applications.length, 2);
        assertEq(applications[0], jobId);
        assertEq(applications[1], jobId);
    }
}