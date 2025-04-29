import { useState, useCallback, useEffect } from 'react';
import {  createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';
import { useToast } from './use-toast';

interface WalletData {
  address: string;
  signature: string;
  message: string;
}

const WALLET_CACHE_KEY = 'peerhire:wallet';
const RPC_URL = import.meta.env.VITE_BASE_RPC_URL || 'https://goerli.base.org';
const APP_NAME = 'PeerHire';
const APP_LOGO_URL = '/logo.svg';

export const useWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const { toast } = useToast();

  // Initialize SDK with proper SDK configs from environment
  const coinbaseWallet = createCoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL
  });

  // Initialize ethers provider with proper RPC URL
  const ethereum = coinbaseWallet.getProvider();
  const provider = new ethers.BrowserProvider(ethereum);

  // Load cached wallet data
  useEffect(() => {
    const cached = localStorage.getItem(WALLET_CACHE_KEY);
    if (cached) {
      try {
        setWalletData(JSON.parse(cached));
      } catch (error) {
        console.error('Failed to parse cached wallet data:', error);
        localStorage.removeItem(WALLET_CACHE_KEY);
      }
    }
  }, []);

  const connect = useCallback(async (): Promise<WalletData | null> => {
    try {
      setIsConnecting(true);

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      // Get signer
      const signer = await provider.getSigner();
      
      // Create signature message
      const message = `Sign this message to authenticate with PeerHire\nNonce: ${Date.now()}`;
      
      // Sign message
      const signature = await signer.signMessage(message);

      const data: WalletData = { address, signature, message };
      
      // Cache wallet data
      localStorage.setItem(WALLET_CACHE_KEY, JSON.stringify(data));
      setWalletData(data);
      
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to Coinbase Wallet',
      });

      return data;
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [ethereum, provider, toast]);

  const disconnect = useCallback(() => {
    localStorage.removeItem(WALLET_CACHE_KEY);
    setWalletData(null);
    toast({
      title: 'Wallet Disconnected',
      description: 'Successfully disconnected from Coinbase Wallet',
    });
  }, [coinbaseWallet, toast]);

  return {
    connect,
    disconnect,
    isConnecting,
    walletData,
  };
};