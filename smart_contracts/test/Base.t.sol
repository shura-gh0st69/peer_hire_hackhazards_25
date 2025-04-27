// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {UserRoles} from "../contracts/UserRoles.sol";
import {DisputeResolution} from "../contracts/Dispute/DisputeResolution.sol";
import {EscrowFactory} from "../contracts/Escrow/EscrowFactory.sol";
import {Reputation} from "../contracts/Reputation/Reputation.sol";
import {JobRegistry} from "../contracts/Jobs/JobRegistry.sol";

// Mock ERC20 token for testing
contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract BaseTest is Test {
    // Core contracts
    UserRoles public userRoles;
    DisputeResolution public disputeResolution;
    EscrowFactory public escrowFactory;
    Reputation public reputation;
    JobRegistry public jobRegistry;

    // Mock token
    MockUSDC public usdc;

    // Test addresses
    address public admin = makeAddr("admin");
    address public client = makeAddr("client");
    address public freelancer = makeAddr("freelancer");
    address public treasury = makeAddr("treasury");

    function setUp() public virtual {
        vm.startPrank(admin);

        // Deploy mock USDC
        usdc = new MockUSDC();

        // Deploy core contracts
        userRoles = new UserRoles(admin);
        reputation = new Reputation(admin, address(0)); // Update factory later
        disputeResolution = new DisputeResolution(admin, address(reputation));
        escrowFactory = new EscrowFactory(address(disputeResolution), treasury);

        // Update reputation with factory
        reputation = new Reputation(admin, address(escrowFactory));

        // Deploy job registry
        jobRegistry = new JobRegistry(
            admin,
            address(escrowFactory),
            address(userRoles),
            address(reputation),
            address(0) // No subscription manager for tests
        );

        // Set up roles
        userRoles.assignRole(client, UserRoles.Role.Client);
        userRoles.assignRole(freelancer, UserRoles.Role.Freelancer);

        // Fund test accounts
        usdc.transfer(client, 100000 * 10 ** 6);
        usdc.transfer(freelancer, 100000 * 10 ** 6);

        vm.stopPrank();
    }

    // Helper to create a basic job listing
    function createBasicJob() internal returns (uint256 jobId) {
        string[] memory skills = new string[](2);
        skills[0] = "Solidity";
        skills[1] = "Smart Contracts";

        vm.prank(client);
        jobId = jobRegistry.createJob(
            "Test Job",
            "Test job description",
            skills,
            1000 * 10 ** 6, // 1000 USDC
            address(usdc)
        );
    }
}
