// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title EscrowLib
 * @notice Library with common utilities for escrow operations
 */
library EscrowLib {
    using SafeERC20 for IERC20;

    /// @dev Status codes for jobs to maintain consistent enumeration across contracts
    enum JobStatus {
        NotFunded,
        Funded,
        InProgress,
        Completed,
        Disputed,
        Cancelled
    }
    
    /// @dev Represents a milestone in a job
    struct Milestone {
        string description;
        uint256 amount;
        bool isCompleted;
        bool isPaid;
    }

    /// @dev Security levels for escrow contracts
    enum SecurityLevel {
        Basic,
        Enhanced,
        Premium
    }
    
    /// @notice Safely transfers tokens with additional validations
    /// @param token The ERC20 token to transfer
    /// @param recipient The address receiving the tokens
    /// @param amount The amount of tokens to transfer
    function safeTokenTransfer(
        IERC20 token,
        address recipient,
        uint256 amount
    ) internal {
        require(address(token) != address(0), "Invalid token");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        // Verify contract has sufficient balance
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient balance");
        
        token.safeTransfer(recipient, amount);
    }
    
    /// @notice Calculates the platform fee for a given amount
    /// @param amount The amount to calculate the fee on
    /// @param feePercentage The percentage of the fee (in basis points, e.g. 250 = 2.5%)
    /// @return fee The calculated fee amount
    function calculateFee(uint256 amount, uint256 feePercentage) internal pure returns (uint256 fee) {
        require(feePercentage <= 10000, "Fee percentage exceeds 100%"); // 10000 basis points = 100%
        return (amount * feePercentage) / 10000;
    }
    
    /// @notice Gets a human-readable status string
    /// @param status The JobStatus enum value
    /// @return statusString The string representation of the status
    function getStatusString(JobStatus status) internal pure returns (string memory statusString) {
        if (status == JobStatus.NotFunded) return "Not Funded";
        if (status == JobStatus.Funded) return "Funded";
        if (status == JobStatus.InProgress) return "In Progress";
        if (status == JobStatus.Completed) return "Completed";
        if (status == JobStatus.Disputed) return "Disputed";
        if (status == JobStatus.Cancelled) return "Cancelled";
        return "Unknown";
    }
    
    /// @notice Validates an address is not zero
    /// @param addr The address to validate
    /// @param message The error message if validation fails
    function validateAddress(address addr, string memory message) internal pure {
        require(addr != address(0), message);
    }
}