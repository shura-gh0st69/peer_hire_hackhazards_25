# Smart Contract Deployment Guide for Base

This guide walks through deploying the Peer Hire smart contracts to Base blockchain using the Coinbase API.

## Prerequisites

1. **Coinbase API Key**: Obtain an API key from [Coinbase Developer Portal](https://www.coinbase.com/cloud/products/developer-platform)
2. **Deployment Wallet**: A wallet with BASE or ETH for gas fees (Base Goerli ETH for testnet)
3. **Foundry**: Ensure Foundry is installed and updated

## Setup Environment

1. **Create `.env` File**: Copy `.env.example` to `.env` and fill in:

   - `COINBASE_API_KEY`: Your Coinbase API key
   - `PRIVATE_KEY`: Deployment wallet's private key (without 0x prefix)
   - `TREASURY_ADDRESS`: Treasury wallet address for collecting fees
   - `ADMIN_ADDRESS`: Admin wallet address for contract management
   - `ETHERSCAN_API_KEY`: (Optional) For contract verification

2. **Check Base Network Parameters**:
   - Mainnet Chain ID: 8453
   - Testnet (Goerli) Chain ID: 84531

## Deployment Steps

### 1. Test Locally (Optional)

```bash
forge test
```

### 2. Deploy to Testnet

Deploy to Base Goerli first to ensure everything works correctly:

```bash
./script/deploy-base.sh --testnet
```

### 3. Verify Testnet Deployment

1. Check contract addresses in the deployment output
2. Test contract interactions on Base Goerli testnet
3. If you added the `--verify` flag and provided an Etherscan API key, contracts will be verified automatically

### 4. Deploy to Mainnet

After successful testnet deployment and verification:

```bash
./script/deploy-base.sh --mainnet --verify
```

### 5. Post-Deployment Tasks

1. **Record Contract Addresses**: Save the addresses from the deployment output
2. **Transfer Ownership**: If needed, transfer ownership of contracts to multi-sig wallets
3. **Initialize Contracts**: Call any initialization functions if required

## Contract Dependencies

The deployment script handles contract dependencies in the following order:

1. `UserRoles`
2. Temporary `Reputation` (placeholder)
3. `DisputeResolution`
4. `EscrowFactory`
5. Final `Reputation` (with correct factory address)
6. `JobRegistry`

## Troubleshooting

- **API Key Issues**: Ensure your Coinbase API key has permissions for Base
- **Gas Errors**: Try manually setting `GAS_PRICE` and `GAS_LIMIT` in the `.env` file
- **RPC Errors**: Check network connectivity and API endpoint availability
- **Verification Failures**: You can manually verify contracts using:
  ```bash
  forge verify-contract --chain-id 8453 --rpc-url $BASE_RPC_URL <CONTRACT_ADDRESS> <CONTRACT_NAME> --etherscan-api-key $ETHERSCAN_API_KEY
  ```

## Using the Coinbase API

The Coinbase API endpoint (`https://api.developer.coinbase.com/rpc/v1/base/api-key-from-env`) reads the API key from the `COINBASE_API_KEY` environment variable. Our deployment script is configured to handle this automatically.

For more information on Base deployment, visit the [Base documentation](https://docs.base.org/)
