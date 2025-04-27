// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {UserRoles} from "../contracts/UserRoles.sol";
import {DisputeResolution} from "../contracts/Dispute/DisputeResolution.sol";
import {EscrowFactory} from "../contracts/Escrow/EscrowFactory.sol";
import {Reputation} from "../contracts/Reputation/Reputation.sol";
import {JobRegistry} from "../contracts/Jobs/JobRegistry.sol";

contract DeployToBase is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        address admin = vm.envAddress("ADMIN_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy core contracts
        UserRoles userRoles = new UserRoles(admin);
        Reputation reputation = new Reputation(admin, address(0)); // Update factory later
        DisputeResolution disputeResolution = new DisputeResolution(admin, address(reputation));
        EscrowFactory escrowFactory = new EscrowFactory(address(disputeResolution), treasury);

        // Update reputation with factory
        reputation = new Reputation(admin, address(escrowFactory));

        // Deploy job registry
        JobRegistry jobRegistry = new JobRegistry(
            admin,
            address(escrowFactory),
            address(userRoles),
            address(reputation),
            address(0) // No subscription manager
        );

        vm.stopBroadcast();

        console2.log("Deployed UserRoles at:", address(userRoles));
        console2.log("Deployed Reputation at:", address(reputation));
        console2.log("Deployed DisputeResolution at:", address(disputeResolution));
        console2.log("Deployed EscrowFactory at:", address(escrowFactory));
        console2.log("Deployed JobRegistry at:", address(jobRegistry));
    }
}