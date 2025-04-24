// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../contracts/Escrow/Escrow.sol";
import "../contracts/Escrow/EscrowFactory.sol";
import "../contracts/Governance/PlatformGovernance.sol";
import "../contracts/Jobs/JobRegistry.sol";
import "../contracts/Milestones/MilestoneManager.sol";
import "../contracts/Verification/SkillVerification.sol";
import "../contracts/UserRoles.sol";
import "../contracts/Dispute/DisputeResolution.sol";

contract DeployAll is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy contracts
        UserRoles userRoles = new UserRoles();
        EscrowFactory escrowFactory = new EscrowFactory();
        Escrow escrow = new Escrow(address(escrowFactory));
        PlatformGovernance governance = new PlatformGovernance();
        JobRegistry jobRegistry = new JobRegistry();
        MilestoneManager milestoneManager = new MilestoneManager();
        SkillVerification skillVerification = new SkillVerification();
        DisputeResolution disputeResolution = new DisputeResolution();

        // Log deployed contract addresses
        console.log("UserRoles deployed at:", address(userRoles));
        console.log("EscrowFactory deployed at:", address(escrowFactory));
        console.log("Escrow deployed at:", address(escrow));
        console.log("PlatformGovernance deployed at:", address(governance));
        console.log("JobRegistry deployed at:", address(jobRegistry));
        console.log("MilestoneManager deployed at:", address(milestoneManager));
        console.log("SkillVerification deployed at:", address(skillVerification));
        console.log("DisputeResolution deployed at:", address(disputeResolution));

        vm.stopBroadcast();
    }
}