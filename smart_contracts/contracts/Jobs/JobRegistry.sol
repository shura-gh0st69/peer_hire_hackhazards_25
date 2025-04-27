// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {EscrowFactory} from "../Escrow/EscrowFactory.sol";
import {UserRoles} from "../UserRoles.sol";
import {Reputation} from "../Reputation/Reputation.sol";

/**
 * @title JobRegistry
 * @notice Manages job listings, applications, and assignments
 */
contract JobRegistry {
    /// @dev Current status of a job listing
    enum JobListingStatus {
        Open,
        Assigned,
        Completed,
        Cancelled
    }
    
    /// @dev Information about a job listing
    struct JobListing {
        address client;                // Who posted the job
        string title;                  // Job title
        string description;            // Job description or IPFS hash containing details
        string[] requiredSkills;       // Required skills for this job
        uint256 budget;                // Budget amount
        address paymentToken;          // Token used for payment
        JobListingStatus status;       // Current status of the job
        address assignedFreelancer;    // Assigned freelancer (if any)
        address escrowContract;        // Associated escrow contract (after assignment)
        address[] applicants;          // People who applied for the job
        uint256 createdAt;             // When the job was created
        uint256 updatedAt;             // When the job was last updated
    }
    
    /// @dev Information about a job application
    struct JobApplication {
        address freelancer;            // Who applied for the job
        uint256 jobId;                 // ID of the job applied for
        string proposal;               // Proposal text or IPFS hash
        uint256 bidAmount;             // Amount the freelancer is bidding
        bool isAccepted;               // Whether the application is accepted
        uint256 createdAt;             // When the application was created
    }
    
    /// @notice Admin of the platform
    address public admin;
    
    /// @notice Factory that creates escrow contracts
    EscrowFactory public escrowFactory;

    /// @notice UserRoles contract for role-based access
    UserRoles public userRoles;

    /// @notice Reference to the Reputation contract
    Reputation public reputation;

    
    /// @notice All jobs listed on the platform
    JobListing[] public jobListings;
    
    /// @notice All applications submitted
    JobApplication[] public applications;
    
    /// @notice Mapping from job ID to application IDs
    mapping(uint256 => uint256[]) public jobToApplications;
    
    /// @notice Mapping from address to job IDs posted by that address
    mapping(address => uint256[]) public clientJobs;
    
    /// @notice Mapping from address to job IDs applied for by that address
    mapping(address => uint256[]) public freelancerApplications;
    
    /// @dev Events
    event JobCreated(uint256 indexed jobId, address indexed client, string title, uint256 budget);
    event JobUpdated(uint256 indexed jobId, JobListingStatus status);
    event JobAssigned(uint256 indexed jobId, address indexed client, address indexed freelancer, address escrow);
    event JobApplicationSubmitted(uint256 indexed applicationId, uint256 indexed jobId, address indexed freelancer);
    event JobApplicationAccepted(uint256 indexed applicationId, uint256 indexed jobId, address indexed freelancer);
    
    /// @dev Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyClient(uint256 jobId) {
        require(jobListings[jobId].client == msg.sender, "Only job client");
        _;
    }
    
    constructor(
        address _admin,
        address _escrowFactory,
        address _userRoles,
        address _reputation,
        address _subscriptionManager
    ) {
        require(_admin != address(0), "Invalid admin address");
        require(_escrowFactory != address(0), "Invalid factory address");
        require(_userRoles != address(0), "Invalid userRoles address");
        require(_reputation != address(0), "Invalid reputation address");
        require(_subscriptionManager != address(0), "Invalid subscription manager address");

        admin = _admin;
        escrowFactory = EscrowFactory(_escrowFactory);
        userRoles = UserRoles(_userRoles);
        reputation = Reputation(_reputation);
    }
    
    /**
     * @notice Creates a new job listing
     * @param title Job title
     * @param description Job description or IPFS hash
     * @param requiredSkills Required skills for the job
     * @param budget Budget amount
     * @param paymentToken Token to be used for payment
     * @return jobId ID of the created job
     */
    function createJob(
        string calldata title,
        string calldata description,
        string[] calldata requiredSkills,
        uint256 budget,
        address paymentToken
    ) external returns (uint256 jobId) {
        require(userRoles.hasRole(msg.sender, UserRoles.Role.Client), "Not a client");
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        require(budget > 0, "Budget must be greater than 0");
        require(paymentToken != address(0), "Invalid payment token");
        
        jobId = jobListings.length;
        
        // Create empty array for applicants
        address[] memory emptyApplicants = new address[](0);
        
        jobListings.push(
            JobListing({
                client: msg.sender,
                title: title,
                description: description,
                requiredSkills: requiredSkills,
                budget: budget,
                paymentToken: paymentToken,
                status: JobListingStatus.Open,
                assignedFreelancer: address(0),
                escrowContract: address(0),
                applicants: emptyApplicants,
                createdAt: block.timestamp,
                updatedAt: block.timestamp
            })
        );
        
        // Add to client's jobs
        clientJobs[msg.sender].push(jobId);
        
        emit JobCreated(jobId, msg.sender, title, budget);
        
        return jobId;
    }
    
    /**
     * @notice Updates a job listing
     * @param jobId ID of the job to update
     * @param title Updated job title
     * @param description Updated job description
     * @param requiredSkills Updated required skills
     * @param budget Updated budget
     */
    function updateJob(
        uint256 jobId,
        string calldata title,
        string calldata description,
        string[] calldata requiredSkills,
        uint256 budget
    ) external onlyClient(jobId) {
        require(jobId < jobListings.length, "Invalid job ID");
        require(jobListings[jobId].status == JobListingStatus.Open, "Job not open");
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        require(budget > 0, "Budget must be greater than 0");
        
        JobListing storage job = jobListings[jobId];
        job.title = title;
        job.description = description;
        job.requiredSkills = requiredSkills;
        job.budget = budget;
        job.updatedAt = block.timestamp;
        
        emit JobUpdated(jobId, job.status);
    }
    
    /**
     * @notice Cancels a job listing
     * @param jobId ID of the job to cancel
     */
    function cancelJob(uint256 jobId) external onlyClient(jobId) {
        require(jobId < jobListings.length, "Invalid job ID");
        require(jobListings[jobId].status == JobListingStatus.Open, "Job not open");
        
        JobListing storage job = jobListings[jobId];
        job.status = JobListingStatus.Cancelled;
        job.updatedAt = block.timestamp;
        
        emit JobUpdated(jobId, job.status);
    }
    
    /**
     * @notice Apply for a job
     * @param jobId ID of the job to apply for
     * @param proposal Proposal text or IPFS hash
     * @param bidAmount Amount the freelancer is bidding
     * @return applicationId ID of the created application
     */
    function applyForJob(
        uint256 jobId,
        string calldata proposal,
        uint256 bidAmount
    ) external returns (uint256 applicationId) {
        require(userRoles.hasRole(msg.sender, UserRoles.Role.Freelancer), "Not a freelancer");
        require(jobId < jobListings.length, "Invalid job ID");
        require(jobListings[jobId].status == JobListingStatus.Open, "Job not open");
        require(jobListings[jobId].client != msg.sender, "Cannot apply to own job");
        require(bytes(proposal).length > 0, "Proposal required");
        require(bidAmount > 0, "Bid amount must be greater than 0");
        
        applicationId = applications.length;
        
        applications.push(
            JobApplication({
                freelancer: msg.sender,
                jobId: jobId,
                proposal: proposal,
                bidAmount: bidAmount,
                isAccepted: false,
                createdAt: block.timestamp
            })
        );
        
        // Add to job's applications
        jobToApplications[jobId].push(applicationId);
        
        // Add to freelancer's applications
        freelancerApplications[msg.sender].push(jobId);
        
        // Add to job's applicants
        jobListings[jobId].applicants.push(msg.sender);
        
        emit JobApplicationSubmitted(applicationId, jobId, msg.sender);
        
        return applicationId;
    }
    
    /**
     * @notice Accept a job application and assign the job
     * @param applicationId ID of the application to accept
     * @return escrowAddress Address of the created escrow contract
     */
    function acceptApplication(uint256 applicationId) external returns (address escrowAddress) {
        require(applicationId < applications.length, "Invalid application ID");
        require(!applications[applicationId].isAccepted, "Already accepted");
        
        JobApplication storage application = applications[applicationId];
        uint256 jobId = application.jobId;
        
        require(jobId < jobListings.length, "Invalid job ID");
        require(jobListings[jobId].client == msg.sender, "Only job client");
        require(jobListings[jobId].status == JobListingStatus.Open, "Job not open");
        
        // Accept the application
        application.isAccepted = true;
        
        // Update job status
        JobListing storage job = jobListings[jobId];
        job.status = JobListingStatus.Assigned;
        job.assignedFreelancer = application.freelancer;
        job.updatedAt = block.timestamp;
        
        // Create escrow contract for the job
        escrowAddress = escrowFactory.createEscrow(
            application.freelancer,
            job.paymentToken,
            application.bidAmount
        );
        
        job.escrowContract = escrowAddress;
        
        emit JobApplicationAccepted(applicationId, jobId, application.freelancer);
        emit JobAssigned(jobId, msg.sender, application.freelancer, escrowAddress);
        emit JobUpdated(jobId, job.status);
        
        return escrowAddress;
    }
    
    /**
     * @notice Updates reputation and subscription checks when a job is completed
     * @param jobId ID of the job to mark as completed
     */
    function markJobCompleted(uint256 jobId) external onlyClient(jobId) {
        require(jobId < jobListings.length, "Invalid job ID");
        require(jobListings[jobId].status == JobListingStatus.Assigned, "Job not assigned");

        JobListing storage job = jobListings[jobId];
        job.status = JobListingStatus.Completed;
        job.updatedAt = block.timestamp;

        // Update reputation for the freelancer
        reputation.incrementJobsCompleted(job.assignedFreelancer);

        emit JobUpdated(jobId, job.status);
    }
    
    /**
     * @notice Get all jobs created by a client
     * @param client Address of the client
     * @return Array of job IDs
     */
    function getClientJobs(address client) external view returns (uint256[] memory) {
        return clientJobs[client];
    }
    
    /**
     * @notice Get all jobs a freelancer has applied for
     * @param freelancer Address of the freelancer
     * @return Array of job IDs
     */
    function getFreelancerApplications(address freelancer) external view returns (uint256[] memory) {
        return freelancerApplications[freelancer];
    }
    
    /**
     * @notice Get all applications for a job
     * @param jobId ID of the job
     * @return Array of application IDs
     */
    function getJobApplications(uint256 jobId) external view returns (uint256[] memory) {
        return jobToApplications[jobId];
    }
    
    /**
     * @notice Get the total number of jobs
     * @return Total job count
     */
    function getJobCount() external view returns (uint256) {
        return jobListings.length;
    }
    
    /**
     * @notice Get the total number of applications
     * @return Total application count
     */
    function getApplicationCount() external view returns (uint256) {
        return applications.length;
    }
    
    /**
     * @notice Get detailed information about a job
     * @param jobId ID of the job
     * @return job The job listing details
     */
    function getJob(uint256 jobId) external view returns (JobListing memory) {
        require(jobId < jobListings.length, "Invalid job ID");
        return jobListings[jobId];
    }
    
    /**
     * @notice Get detailed information about an application
     * @param applicationId ID of the application
     * @return application The application details
     */
    function getApplication(uint256 applicationId) external view returns (JobApplication memory application) {
        require(applicationId < applications.length, "Invalid application ID");
        return applications[applicationId];
    }
    
    /**
     * @notice Updates the admin address
     * @param newAdmin New admin address
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
    }
}