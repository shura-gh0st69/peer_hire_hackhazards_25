import React, { useState } from 'react';
import { CustomButton } from './custom-button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface WalletConnectProps {
    onConnect: (walletData: { address: string; signature: string; message: string }) => void;
    loading?: boolean;
    buttonText?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
    onConnect,
    loading = false,
    buttonText = 'Connect Wallet'
}) => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'signing' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        setStatus('connecting');
        setError(null);

        try {
            // Check if Coinbase Wallet is available
            if (!(window as any).coinbaseWalletSDK) {
                setError('Coinbase Wallet extension not found. Please install it from the Chrome Web Store.');
                setStatus('error');
                return;
            }

            // Connect to Coinbase Wallet
            const coinbaseWallet = (window as any).coinbaseWalletSDK;

            // Request account access
            const accounts = await coinbaseWallet.request({
                method: 'eth_requestAccounts'
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const address = accounts[0];

            // Create a message to sign
            const message = `Sign this message to verify ownership of the wallet address: ${address}\n\nTimestamp: ${Date.now()}`;

            setStatus('signing');

            // Request signature
            const signature = await coinbaseWallet.request({
                method: 'personal_sign',
                params: [message, address]
            });

            setStatus('success');

            // Pass wallet data back to parent component
            onConnect({
                address,
                signature,
                message
            });
        } catch (err: any) {
            console.error('Error connecting to wallet:', err);
            setError(err.message || 'Failed to connect wallet');
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col items-center">
            {status === 'idle' && (
                <CustomButton
                    fullWidth
                    onClick={connectWallet}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 text-white"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                        </>
                    ) : buttonText}
                </CustomButton>
            )}

            {status === 'connecting' && (
                <div className="text-center py-4">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3 text-primary" />
                    <p className="text-gray-700">Connecting to Coinbase Wallet...</p>
                    <p className="text-xs text-gray-500 mt-2">Please check your wallet extension</p>
                </div>
            )}

            {status === 'signing' && (
                <div className="text-center py-4">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto mb-3 text-primary" />
                    <p className="text-gray-700">Waiting for signature...</p>
                    <p className="text-xs text-gray-500 mt-2">Please confirm the signature request in your wallet</p>
                </div>
            )}

            {status === 'success' && (
                <div className="text-center py-4">
                    <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500" />
                    <p className="text-gray-700">Wallet connected successfully!</p>
                </div>
            )}

            {status === 'error' && (
                <div className="text-center py-4">
                    <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-500" />
                    <p className="text-gray-700">Failed to connect wallet</p>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    <CustomButton
                        variant="outline"
                        onClick={() => setStatus('idle')}
                        className="mt-4"
                    >
                        Try Again
                    </CustomButton>
                </div>
            )}

            <div className="mt-4 text-center text-xs text-gray-500">
                {status === 'idle' && (
                    <>
                        <p>You'll be asked to sign a message to verify ownership of your wallet.</p>
                        <p className="mt-1">This doesn't require any gas fees.</p>
                    </>
                )}
            </div>
        </div>
    );
};