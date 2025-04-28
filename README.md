![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# 🚀 PeerHire: Decentralized Freelance Marketplace

> Connecting freelancers and clients securely through blockchain and AI.

---

## 📌 Problem Statement

**Problem Statement 4 – Craft the Future of Onchain Consumer Experiences with Base**

---

## 🎯 Objective

PeerHire solves the problem of trust and transparency in freelance marketplaces by leveraging blockchain for secure transactions and AI for intelligent job matching and task verification.

---

## 🧠 Team & Approach

### Team Name

`Team Undefined`

### Team Members

- Jaykumar Patel (Fullstack Dev | The Blockchain Guy | Groq Guy)
- V Meghashreee (Frontend Lead | Screenpipe Integration)
- Tejaswini S (Backend Dev)
- Priyanshi Bhardwaj (AI Specialist)

### Your Approach

- Key challenges included integrating blockchain payments and AI verification.
- A breakthrough was using Screenpipe's AI for task verification, ensuring trust.

---

## 🛠️ Tech Stack

### Core Technologies Used

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Hono (Node.js)
- Database: MongoDB
- APIs: Groq API, Screenpipe API, Coinbase API
- Blockchain: Base (Layer 2)
- Authentication: Wallet-based (Smart-Wallet, Coinbase)
- Hosting: Render (Frontend), Render (Backend)

### Sponsor Technologies Used

- [✅] **Groq:** Used for AI job recommendations and chatbot.
- [✅] **Base:** Implemented OnchainKit for wallet connections.
- [✅] **Screenpipe:** Integrated for screen recording and AI verification.

---

## ✨ Key Features

- ✅ Wallet-based authentication
- ✅ AI-powered job recommendations
- ✅ Blockchain-secured payments
- ✅ AI-driven task verification

---

## 📽️ Demo & Deliverables

- **Demo Video Link:** [YouTube Link]
- **Pitch Deck / PPT Link:** [Google Slides Link]

---

## 🧪 Project Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Bun (JavaScript runtime and package manager)
- Foundry (for smart contract development)
- API Keys:
  - Groq API
  - Screenpipe API
  - Coinbase Platform API

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
bun install

# Create .env file with the following variables
touch .env
```

Required environment variables for backend:

```
# Required
MONGODB_URI=mongodb://localhost:27017/peerhire
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# API Keys
GROQ_API_KEY=your_groq_api_key
SCREENPIPE_API_KEY=your_screenpipe_api_key

# Optional for demo mode
DEMO_MODE=true
DEMO_CLIENT_EMAIL=demo.client@example.com
DEMO_CLIENT_PASSWORD=demoClient123
DEMO_FREELANCER_EMAIL=demo.freelancer@example.com
DEMO_FREELANCER_PASSWORD=demoFreelancer123
```

```bash
# Start the backend server
bun run dev
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
bun install

# Create .env file
touch .env
```

Required environment variables for frontend:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_COINBASE_APP_ID=your_coinbase_app_id
VITE_BASE_CHAIN_ID=84532
```

```bash
# Start the frontend application
bun run dev
```

### 3. Smart Contracts Setup

```bash
# Navigate to the smart_contracts directory
cd smart_contracts

# Install Foundry dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test

# Deploy contracts (to local development environment)
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key <your_private_key>
```

For Base Sepolia Testnet deployment:

```bash
# Setup .env file
touch .env
```

Required environment variables for smart contracts:

```
PRIVATE_KEY=your_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
ETHERSCAN_API_KEY=your_etherscan_api_key
```

```bash
# Deploy to Base Sepolia Testnet
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

### 4. Running the Entire Application

```bash
# From the root directory
# Install all dependencies
bun install

# Start all services concurrently
bun run dev
```

---

## 📡 API Integration Details

### Groq AI Integration

The backend utilizes Groq's LLM API for:

- Job matching and recommendations
- Skills assessment and verification
- Intelligent chatbot assistance

### Coinbase OnchainKit Integration

The frontend integrates with Coinbase's OnchainKit for:

- Wallet authentication
- Transaction signing
- Payment processing on Base network
- Smart contract interaction

### Screenpipe Integration

Used for:

- Work verification through screen recording
- AI analysis of work patterns
- Proof of work validation

---

## 🧬 Future Scope

- 📈 Integration with more blockchains
- 🛡️ Enhanced security with zero-knowledge proofs
- 🌐 Support for multiple languages

---

## 📎 Resources / Credits

- APIs: Groq, Screenpipe
- Libraries: Ethers.js, React Query, OnchainKit
- Acknowledgements: Thanks to the hackathon organizers and sponsors!

---

## 🏁 Final Words

Our journey was filled with late-night coding sessions and breakthrough moments. We learned a lot about decentralized technologies and are excited to see PeerHire grow!
