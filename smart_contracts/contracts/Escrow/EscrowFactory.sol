// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Escrow} from "./Escrow.sol";
import {DisputeResolution} from "../Dispute/DisputeResolution.sol";

/**
 * @title EscrowFactory
 * @notice Creates new Escrow contracts for jobs between clients and freelancers
 */
contract EscrowFactory {
    /// @notice Address of the platform's central dispute resolution contract
    DisputeResolution public immutable disputeHandler;
    
    /// @notice Platform treasury address that collects fees
    address public immutable treasury;
    
    /// @notice All escrow contracts created by this factory
    address[] public escrows;
    
    /// @notice Mapping from user address to their associated escrow contracts
    mapping(address => address[]) public userEscrows;
    
    /// @dev Emitted when a new escrow is created
    event EscrowCreated(
        address indexed escrowAddress, 
        address indexed client, 
        address indexed freelancer, 
        address paymentToken, 
        uint256 amount
    );
    
    /**
     * @dev Constructor sets the dispute resolution contract address and treasury
     * @param _disputeHandler Address of the central dispute resolution contract
     * @param _treasury Address of the platform treasury that collects fees
     */
    constructor(address _disputeHandler, address _treasury) {
        require(_disputeHandler != address(0), "Invalid dispute handler");
        require(_treasury != address(0), "Invalid treasury address");
        disputeHandler = DisputeResolution(_disputeHandler);
        treasury = _treasury;
    }
    
    /**
     * @notice Creates a new escrow contract for a job
     * @param freelancer Address of the freelancer who will complete the work
     * @param paymentToken Address of the ERC20 token used for payment
     * @param amount Total amount to be held in escrow
     * @return escrowAddress Address of the newly created Escrow contract
     */
    function createEscrow(
        address freelancer,
        address paymentToken,
        uint256 amount
    ) external returns (address escrowAddress) {
        Escrow escrow = new Escrow(
            msg.sender,        // client
            freelancer,
            paymentToken,
            amount,
            address(disputeHandler),
            treasury
        );
        
        escrowAddress = address(escrow);
        escrows.push(escrowAddress);
        
        // Add to user mappings for easy retrieval
        userEscrows[msg.sender].push(escrowAddress);
        userEscrows[freelancer].push(escrowAddress);
        
        emit EscrowCreated(escrowAddress, msg.sender, freelancer, paymentToken, amount);
        return escrowAddress;
    }
    
    /**
     * @notice Returns all escrows created by this factory
     * @return Array of escrow contract addresses
     */
    function getAllEscrows() external view returns (address[] memory) {
        return escrows;
    }
    
    /**
     * @notice Returns all escrows associated with a specific user
     * @param user Address of the client or freelancer
     * @return Array of escrow contract addresses
     */
    function getEscrowsByUser(address user) external view returns (address[] memory) {
        return userEscrows[user];
    }
    
    /**
     * @notice Returns the total number of escrows created
     * @return Total count of escrows
     */
    function getEscrowCount() external view returns (uint256) {
        return escrows.length;
    }
}
