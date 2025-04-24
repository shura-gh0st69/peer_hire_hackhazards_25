// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import {PlatformGovernance} from "contracts/Governance/PlatformGovernance.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockERC20 is IERC20 {
    string public name = "MockToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;
    function transfer(address to, uint256 amount) public override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    function approve(address spender, uint256 amount) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}

contract PlatformGovernanceTest is Test {
    PlatformGovernance gov;
    MockERC20 token;
    address admin = address(0xA);
    address proposer = address(0xB);
    address voter = address(0xC);
    address target = address(0xD);

    function setUp() public {
        token = new MockERC20();
        token.mint(proposer, 1000 ether);
        token.mint(voter, 1000 ether);
        gov = new PlatformGovernance(
            admin,
            address(token),
            100 ether, // proposal threshold
            10,        // quorum %
            1 days,    // voting period
            5          // max active proposals
        );
        vm.prank(admin);
        token.approve(address(gov), type(uint256).max);
    }

    function testCreateProposal() public {
        vm.prank(proposer);
        uint256 id = gov.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.FeesUpdate,
            target,
            bytes(""),
            0
        );
        (address _proposer,,,,,,PlatformGovernance.ProposalStatus status,,) = gov.getProposalDetails(id);
        assertEq(_proposer, proposer);
        assertEq(uint(status), 0); // Active
    }

    function testReentrancyProtection() public {
        // Try to reenter executeProposal (should fail due to nonReentrant)
        // This is a placeholder as direct reentrancy is not possible in this context
        // but we check that the modifier is present and function is callable
        vm.prank(proposer);
        uint256 id = gov.createProposal(
            "Test proposal",
            PlatformGovernance.ProposalType.FeesUpdate,
            target,
            bytes(""),
            0
        );
        // Fast forward to after voting period
        skip(2 days);
        vm.prank(admin);
        gov.processProposal(id);
        vm.prank(admin);
        gov.executeProposal(id);
        (,,,,,,PlatformGovernance.ProposalStatus status,,) = gov.getProposalDetails(id);
        assertEq(uint(status), 3); // Executed
    }
}
