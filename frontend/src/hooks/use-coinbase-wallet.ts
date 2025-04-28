import { useEffect, useState } from 'react';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { providers } from 'ethers';

// Import from environment variables
const RPC_URL = import.meta.env.VITE_BASE_TESTNET_RPC_URL || 'https://goerli.base.org';
const APP_NAME = 'PeerHire';
const APP_LOGO_URL = '/logo.svg';

export interface WalletData {
  address: string;
  signature?: string;
  message?: string;
  provider?: providers.Web3Provider;
}

export function useCoinbaseWallet() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet on mount
  useEffect(() => {
    // Check local storage for cached wallet data
    const cachedWalletData = localStorage.getItem('walletData');
    if (cachedWalletData) {
      setWalletData(JSON.parse(cachedWalletData));
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Initialize Coinbase Wallet SDK
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        darkMode: false
      });

      // Create a provider
      const ethereum = coinbaseWallet.makeWeb3Provider(RPC_URL, 8453); // 8453 is Base chain ID
      const provider = new providers.Web3Provider(ethereum);

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      // Create signature
      const message = `Sign this message to verify your ownership of ${address} on ${APP_NAME}`;
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });

      const data = { address, signature, message, provider };
      
      // Cache wallet data
      localStorage.setItem('walletData', JSON.stringify(data));
      setWalletData(data);
      
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('walletData');
    setWalletData(null);
  };

  return {
    walletData,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet
  };
}