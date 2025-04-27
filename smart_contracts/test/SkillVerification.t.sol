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

    /**
     * @notice Test case: Freelancer adds a new skill
     * @dev This test demonstrates:
     * 1. Freelancer calling addSkill with name and evidence URI
     * 2. Verification that the skill is stored with correct details
     * 3. Initial skill level is Basic and expiry is 0
     */
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

    /**
     * @notice Test case: Approved verifier verifies a freelancer's skill
     * @dev This test demonstrates:
     * 1. Freelancer adding a skill
     * 2. An approved verifier calling verifySkill with a level and expiry time
     * 3. Verification that the skill's level and expiry time are updated
     */
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

    /**
     * @notice Test case: Approved verifier verifies a freelancer's skill (duplicate/alternative signature)
     * @dev This test demonstrates:
     * 1. Freelancer adding a skill
     * 2. An approved verifier (passed as parameter) calling verifySkill
     * 3. Verification that the skill's level and expiry time are updated
     * Note: This seems like a potential fuzz test or alternative setup.
     */
    function testVerifySkill(address testVerifier) public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        uint256 expiryTime = block.timestamp + 365 days;

        vm.prank(testVerifier);
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

    /**
     * @notice Test case: Another user endorses a freelancer's skill
     * @dev This test demonstrates:
     * 1. Freelancer adding a skill
     * 2. Another user calling endorseSkill for that freelancer and skill
     * 3. Verification that the endorser's address is recorded
     */
    function test_EndorseSkill() public {
        vm.prank(freelancer);
        uint256 skillId = skillVerification.addSkill(
            "Solidity",
            "ipfs://evidence-hash"
        );

        address endorser = makeAddr("endorser");
        vm.prank(endorser);
        skillVerification.endorseSkill(freelancer, skillId);

        address[] memory endorsers = skillVerification.getSkillEndorsers(
            freelancer,
            skillId
        );
        assertEq(endorsers.length, 1);
        assertEq(endorsers[0], endorser);
    }

    /**
     * @notice Test case: Freelancer adds a new credential
     * @dev This test demonstrates:
     * 1. Freelancer calling addCredential with details (name, issuer, evidence, dates)
     * 2. Verification that the credential is stored correctly
     * 3. Initial state is unverified
     */
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
            address credVerifier,
            uint256 credIssuedAt,
            uint256 credExpiresAt
        ) = skillVerification.freelancerCredentials(freelancer, credentialId);

        assertEq(name, "Solidity Developer Certificate");
        assertEq(issuer, "Ethereum Foundation");
        assertEq(evidence, "ipfs://credential-hash");
        assertFalse(isVerified);
        assertEq(credVerifier, address(0));
        assertEq(credIssuedAt, issuedAt);
        assertEq(credExpiresAt, expiresAt);
    }

    /**
     * @notice Test case: Approved verifier verifies a freelancer's credential
     * @dev This test demonstrates:
     * 1. Freelancer adding a credential
     * 2. An approved verifier calling verifyCredential
     * 3. Verification that the credential's isVerified status becomes true
     * 4. Verification that the verifier's address is recorded
     */
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

        (, , , bool isVerified, address credVerifierAddr, , ) = skillVerification
            .freelancerCredentials(freelancer, credentialId);

        assertTrue(isVerified);
        assertEq(credVerifierAddr, verifier);
    }

    /**
     * @notice Test case: Retrieve all skills for a freelancer
     * @dev This test demonstrates:
     * 1. Freelancer adding multiple skills
     * 2. Calling getFreelancerSkills to retrieve the list of skills
     * 3. Verification that the returned array contains the correct skill details
     */
    function test_GetFreelancerSkills() public {
        vm.startPrank(freelancer);
        skillVerification.addSkill("Solidity", "ipfs://hash1");
        skillVerification.addSkill("Smart Contracts", "ipfs://hash2");
        vm.stopPrank();

        SkillVerification.Skill[] memory skills = skillVerification
            .getFreelancerSkills(freelancer);
        assertEq(skills.length, 2);
        assertEq(skills[0].name, "Solidity");
        assertEq(skills[1].name, "Smart Contracts");
    }

    /**
     * @notice Test case: Revert when a non-approved verifier tries to verify a skill
     * @dev This test demonstrates:
     * 1. Freelancer adding a skill
     * 2. A non-approved verifier calling verifySkill
     * 3. Expect revert with "Not an approved verifier"
     */
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

    /**
     * @notice Test case: Revert when a freelancer tries to endorse their own skill
     * @dev This test demonstrates:
     * 1. Freelancer adding a skill
     * 2. Freelancer calling endorseSkill for their own skill
     * 3. Expect revert with "Cannot endorse own skill"
     */
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

    /**
     * @notice Test case: Revert when a user tries to endorse the same skill twice
     * @dev This test demonstrates:
     * 1. Freelancer adding a skill
     * 2. Another user calling endorseSkill for that skill
     * 3. The same user calling endorseSkill again
     * 4. Expect revert with "Already endorsed"
     */
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

    /**
     * @notice Test case: Admin adds a new verifier
     * @dev This test demonstrates:
     * 1. Admin calling addVerifier with a new address
     * 2. Implicitly tests the setup and verifier addition functionality
     * Note: This test seems incomplete as it doesn't verify the addition.
     */
    function test_Verify() public {
        vm.startPrank(admin);

        // Create test verifiers
        string[] memory skills = new string[](2);
        skills[0] = "Solidity";
        skills[1] = "Smart Contracts";

        address testVerifierAddr = makeAddr("testVerifier");
        skillVerification.addVerifier(testVerifierAddr);

        vm.stopPrank();
    }
}
