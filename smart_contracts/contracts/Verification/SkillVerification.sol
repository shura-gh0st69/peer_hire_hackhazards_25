// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

/**
 * @title SkillVerification
 * @notice Manages verification of freelancer skills and credentials
 */
contract SkillVerification {
    /// @dev Verification levels
    enum VerificationLevel {
        Unverified,
        Basic,        // Self-declared
        Validated,    // Validated through the platform
        Expert        // Expert level, proven track record
    }
    
    /// @dev Skill information
    struct Skill {
        string name;
        VerificationLevel level;
        string evidence;       // IPFS hash to evidence
        uint256 verifiedAt;
        uint256 expiresAt;     // Optional expiration (0 means no expiration)
    }
    
    /// @dev Credential information
    struct Credential {
        string name;           // Name of the credential (e.g., "JavaScript Developer Certificate")
        string issuer;         // Who issued it (e.g., "Udemy")
        string evidence;       // IPFS hash to credential certificate
        bool isVerified;       // Whether it's been verified
        address verifier;      // Who verified it
        uint256 issuedAt;
        uint256 expiresAt;     // Optional expiration (0 means no expiration)
    }
    
    /// @notice Platform admin
    address public admin;
    
    /// @notice Approved verifiers who can validate skills and credentials
    mapping(address => bool) public approvedVerifiers;
    
    /// @notice Mapping of freelancer address to their skills
    mapping(address => Skill[]) public freelancerSkills;
    
    /// @notice Mapping of freelancer address to their credentials
    mapping(address => Credential[]) public freelancerCredentials;
    
    /// @notice Map freelancer address to skillId to endorser addresses
    mapping(address => mapping(uint256 => address[])) public skillEndorsements;
    
    /// @dev Events
    event SkillAdded(address indexed freelancer, string name, uint256 skillId);
    event SkillVerified(address indexed freelancer, uint256 indexed skillId, VerificationLevel level);
    event SkillEndorsed(address indexed freelancer, uint256 indexed skillId, address indexed endorser);
    event CredentialAdded(address indexed freelancer, string name, string issuer, uint256 credentialId);
    event CredentialVerified(address indexed freelancer, uint256 indexed credentialId, address verifier);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyVerifier() {
        require(approvedVerifiers[msg.sender] || msg.sender == admin, "Not an approved verifier");
        _;
    }
    
    constructor(address _admin) {
        require(_admin != address(0), "Invalid admin address");
        admin = _admin;
        approvedVerifiers[_admin] = true; // Admin is automatically a verifier
    }
    
    /**
     * @notice Add a new skill to freelancer's profile
     * @param skillName Name of the skill
     * @param evidence IPFS hash linking to evidence (optional)
     * @return skillId ID of the added skill
     */
    function addSkill(string calldata skillName, string calldata evidence) external returns (uint256 skillId) {
        require(bytes(skillName).length > 0, "Skill name required");
        
        Skill[] storage skills = freelancerSkills[msg.sender];
        skillId = skills.length;
        
        skills.push(
            Skill({
                name: skillName,
                level: VerificationLevel.Basic, // Start as self-declared
                evidence: evidence,
                verifiedAt: block.timestamp,
                expiresAt: 0 // No expiration by default
            })
        );
        
        emit SkillAdded(msg.sender, skillName, skillId);
        return skillId;
    }
    
    /**
     * @notice Verify a freelancer's skill
     * @param freelancer Address of the freelancer
     * @param skillId ID of the skill to verify
     * @param level New verification level
     * @param expiresAt Optional expiration timestamp
     */
    function verifySkill(
        address freelancer,
        uint256 skillId,
        VerificationLevel level,
        uint256 expiresAt
    ) external onlyVerifier {
        require(freelancer != address(0), "Invalid freelancer address");
        require(skillId < freelancerSkills[freelancer].length, "Invalid skill ID");
        require(level > VerificationLevel.Basic, "Must be higher than basic level");
        
        Skill storage skill = freelancerSkills[freelancer][skillId];
        skill.level = level;
        skill.verifiedAt = block.timestamp;
        
        if (expiresAt > block.timestamp) {
            skill.expiresAt = expiresAt;
        }
        
        emit SkillVerified(freelancer, skillId, level);
    }
    
    /**
     * @notice Endorse a skill (peer validation)
     * @param freelancer Address of the freelancer
     * @param skillId ID of the skill to endorse
     */
    function endorseSkill(address freelancer, uint256 skillId) external {
        require(freelancer != address(0), "Invalid freelancer address");
        require(msg.sender != freelancer, "Cannot endorse own skill");
        require(skillId < freelancerSkills[freelancer].length, "Invalid skill ID");
        
        address[] storage endorsers = skillEndorsements[freelancer][skillId];
        
        // Check if already endorsed
        for (uint256 i = 0; i < endorsers.length; i++) {
            require(endorsers[i] != msg.sender, "Already endorsed");
        }
        
        endorsers.push(msg.sender);
        emit SkillEndorsed(freelancer, skillId, msg.sender);
    }
    
    /**
     * @notice Add a credential to freelancer's profile
     * @param name Name of the credential
     * @param issuer Issuer of the credential
     * @param evidence IPFS hash linking to evidence
     * @param issuedAt When the credential was issued
     * @param expiresAt When the credential expires (0 for no expiration)
     * @return credentialId ID of the added credential
     */
    function addCredential(
        string calldata name,
        string calldata issuer,
        string calldata evidence,
        uint256 issuedAt,
        uint256 expiresAt
    ) external returns (uint256 credentialId) {
        require(bytes(name).length > 0, "Credential name required");
        require(bytes(issuer).length > 0, "Issuer required");
        require(bytes(evidence).length > 0, "Evidence required");
        require(issuedAt > 0 && issuedAt <= block.timestamp, "Invalid issuedAt timestamp");
        
        Credential[] storage credentials = freelancerCredentials[msg.sender];
        credentialId = credentials.length;
        
        credentials.push(
            Credential({
                name: name,
                issuer: issuer,
                evidence: evidence,
                isVerified: false,
                verifier: address(0),
                issuedAt: issuedAt,
                expiresAt: expiresAt
            })
        );
        
        emit CredentialAdded(msg.sender, name, issuer, credentialId);
        return credentialId;
    }
    
    /**
     * @notice Verify a freelancer's credential
     * @param freelancer Address of the freelancer
     * @param credentialId ID of the credential to verify
     */
    function verifyCredential(address freelancer, uint256 credentialId) external onlyVerifier {
        require(freelancer != address(0), "Invalid freelancer address");
        require(credentialId < freelancerCredentials[freelancer].length, "Invalid credential ID");
        
        Credential storage credential = freelancerCredentials[freelancer][credentialId];
        require(!credential.isVerified, "Already verified");
        
        credential.isVerified = true;
        credential.verifier = msg.sender;
        
        emit CredentialVerified(freelancer, credentialId, msg.sender);
    }
    
    /**
     * @notice Add an approved verifier
     * @param verifier Address of the verifier to add
     */
    function addVerifier(address verifier) external onlyAdmin {
        require(verifier != address(0), "Invalid verifier address");
        require(!approvedVerifiers[verifier], "Already a verifier");
        
        approvedVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }
    
    /**
     * @notice Remove an approved verifier
     * @param verifier Address of the verifier to remove
     */
    function removeVerifier(address verifier) external onlyAdmin {
        require(verifier != admin, "Cannot remove admin as verifier");
        require(approvedVerifiers[verifier], "Not a verifier");
        
        approvedVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }
    
    /**
     * @notice Get all skills for a freelancer
     * @param freelancer Address of the freelancer
     * @return Array of skills
     */
    function getFreelancerSkills(address freelancer) external view returns (Skill[] memory) {
        return freelancerSkills[freelancer];
    }
    
    /**
     * @notice Get all credentials for a freelancer
     * @param freelancer Address of the freelancer
     * @return Array of credentials
     */
    function getFreelancerCredentials(address freelancer) external view returns (Credential[] memory) {
        return freelancerCredentials[freelancer];
    }
    
    /**
     * @notice Get all endorsers for a specific skill
     * @param freelancer Address of the freelancer
     * @param skillId ID of the skill
     * @return Array of endorser addresses
     */
    function getSkillEndorsers(address freelancer, uint256 skillId) external view returns (address[] memory) {
        return skillEndorsements[freelancer][skillId];
    }
    
    /**
     * @notice Transfer admin rights
     * @param newAdmin Address of the new admin
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
        approvedVerifiers[newAdmin] = true; // New admin is automatically a verifier
    }
}