// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Base.t.sol";
import {SkillVerification} from "../contracts/Verification/SkillVerification.sol";

contract SkillVerificationTest is BaseTest {
    SkillVerification public skillVerification;
    address public verifier;

    function setUp() public override {
        super.setUp();
        
        verifier = makeAddr("verifier");
        
        vm.startPrank(admin);
        skillVerification = new SkillVerification(admin);
        skillVerification.addVerifier(verifier);
        vm.stopPrank();
    }

    function test_AddSkill() public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        (
            string memory name,
            SkillVerification.VerificationLevel level,
            string memory evidence,
            uint256 verifiedAt,
            uint256 expiresAt
        ) = skillVerification.freelancerSkills(freelancer, skillId);

        assertEq(name, "Solidity");
        assertEq(uint(level), uint(SkillVerification.VerificationLevel.Basic));
        assertEq(evidence, "ipfs://evidence-hash");
        assertTrue(verifiedAt > 0);
        assertEq(expiresAt, 0);
    }

    function test_VerifySkill() public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        uint256 expiryTime = block.timestamp + 365 days;
        
        vm.prank(verifier);
        skillVerification.verifySkill(
            freelancer,
            skillId,
            SkillVerification.VerificationLevel.Expert,
            expiryTime
        );

        (
            ,
            SkillVerification.VerificationLevel level,
            ,
            ,
            uint256 expiresAt
        ) = skillVerification.freelancerSkills(freelancer, skillId);

        assertEq(uint(level), uint(SkillVerification.VerificationLevel.Expert));
        assertEq(expiresAt, expiryTime);
    }

    function test_EndorseSkill() public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        address endorser = makeAddr("endorser");
        vm.prank(endorser);
        skillVerification.endorseSkill(freelancer, skillId);

        address[] memory endorsers = skillVerification.getSkillEndorsers(freelancer, skillId);
        assertEq(endorsers.length, 1);
        assertEq(endorsers[0], endorser);
    }

    function test_AddCredential() public {
        uint256 issuedAt = block.timestamp - 30 days;
        uint256 expiresAt = block.timestamp + 365 days;

        vm.prank(freelancer);
        uint256 credentialId = skillVerification.addCredential(
            "Solidity Developer Certificate",
            "Ethereum Foundation",
            "ipfs://credential-hash",
            issuedAt,
            expiresAt
        );

        (
            string memory name,
            string memory issuer,
            string memory evidence,
            bool isVerified,
            address verifier,
            uint256 credIssuedAt,
            uint256 credExpiresAt
        ) = skillVerification.freelancerCredentials(freelancer, credentialId);

        assertEq(name, "Solidity Developer Certificate");
        assertEq(issuer, "Ethereum Foundation");
        assertEq(evidence, "ipfs://credential-hash");
        assertFalse(isVerified);
        assertEq(verifier, address(0));
        assertEq(credIssuedAt, issuedAt);
        assertEq(credExpiresAt, expiresAt);
    }

    function test_VerifyCredential() public {
        vm.prank(freelancer);
        uint256 credentialId = skillVerification.addCredential(
            "Solidity Developer Certificate",
            "Ethereum Foundation",
            "ipfs://credential-hash",
            block.timestamp - 30 days,
            block.timestamp + 365 days
        );

        vm.prank(verifier);
        skillVerification.verifyCredential(freelancer, credentialId);

        (,,, bool isVerified, address credVerifier,,) = 
            skillVerification.freelancerCredentials(freelancer, credentialId);

        assertTrue(isVerified);
        assertEq(credVerifier, verifier);
    }

    function test_GetFreelancerSkills() public {
        vm.startPrank(freelancer);
        skillVerification.addSkill("Solidity", "ipfs://hash1");
        skillVerification.addSkill("Smart Contracts", "ipfs://hash2");
        vm.stopPrank();

        SkillVerification.Skill[] memory skills = skillVerification.getFreelancerSkills(freelancer);
        assertEq(skills.length, 2);
        assertEq(skills[0].name, "Solidity");
        assertEq(skills[1].name, "Smart Contracts");
    }

    function test_RevertWhen_NonVerifierVerifiesSkill() public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        address nonVerifier = makeAddr("nonVerifier");
        vm.prank(nonVerifier);
        vm.expectRevert("Not an approved verifier");
        skillVerification.verifySkill(
            freelancer,
            skillId,
            SkillVerification.VerificationLevel.Expert,
            0
        );
    }

    function test_RevertWhen_SelfEndorsement() public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        vm.prank(freelancer);
        vm.expectRevert("Cannot endorse own skill");
        skillVerification.endorseSkill(freelancer, skillId);
    }

    function test_RevertWhen_DuplicateEndorsement() public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        address endorser = makeAddr("endorser");
        
        vm.startPrank(endorser);
        skillVerification.endorseSkill(freelancer, skillId);
        
        vm.expectRevert("Already endorsed");
        skillVerification.endorseSkill(freelancer, skillId);
        vm.stopPrank();
    }
}