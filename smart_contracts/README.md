# Peer Hire Smart Contracts

A decentralized freelancing platform built on blockchain technology with escrow services, dispute resolution, and reputation management.

## Features

- **Escrow System**: Secure payment handling between clients and freelancers
- **Dispute Resolution**: Fair conflict resolution through governance
- **Job Registry**: On-chain job postings and applications
- **Milestones**: Track project progress with milestone-based payments
- **Reputation**: Build trust through on-chain ratings and reviews
- **Subscription Tiers**: Access different platform features based on subscription level
- **Skill Verification**: Verify and endorse freelancer skills
- **Platform Governance**: Community-driven decision making

## Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Solidity ^0.8.23

### Installation

1. Clone the repository
2. Install dependencies:

```bash
forge install
```

### Build

Compile the contracts:

```bash
forge build
```

### Test

Run tests:

```bash
forge test
```

## Contract Architecture

### Core Contracts

- **Escrow.sol**: Holds funds in escrow until job completion
- **EscrowFactory.sol**: Creates new escrow contracts for jobs
- **JobRegistry.sol**: Manages job listings and applications
- **DisputeResolution.sol**: Handles disputes between clients and freelancers
- **Reputation.sol**: Tracks user ratings and reviews
- **MilestoneManager.sol**: Manages project milestones and payments
- **UserRoles.sol**: Role-based access control for platform users

### Supporting Contracts

- **SubscriptionManager.sol**: Manages user subscription tiers
- **PaymentSplitter.sol**: Handles fee distribution
- **SkillVerification.sol**: Verifies freelancer skills and credentials
- **PlatformGovernance.sol**: Decentralized platform governance

## License

MIT