import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Edit2,
    MapPin,
    User,
    Calendar,
    Briefcase,
    DollarSign,
    ExternalLink,
    Wallet,
    Copy,

    BadgeCheck
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useWallet } from '@/hooks/use-wallet';
import { BaseIcon } from '@/components/icons';

// Helper function to truncate wallet address
const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();
    const { connect, disconnect, isConnecting } = useWallet();
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);
    const [isWalletConnecting, setIsWalletConnecting] = useState(false);
    const [walletError, setWalletError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id) return;

            try {
                const response = await api.get(`/auth/profile/${user.id}`);
                setProfileData(response.data.profile);
            } catch (error: any) {
                toast.error(error.message || 'Failed to load profile data');
                console.error('Profile fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [user?.id]);

    const handleConnectWallet = async () => {
        setIsWalletConnecting(true);
        setWalletError(null);

        try {
            const data = await connect();
            if (data) {
                try {
                    // Use dedicated wallet endpoint instead of general profile update
                    await api.post('/users/wallet', {
                        address: data.address,
                        signature: data.signature,
                        message: data.message
                    });

                    // Update local profile data
                    setProfileData(prev => ({
                        ...prev,
                        walletAddress: data.address
                    }));

                    toast.success('Wallet connected successfully!');
                } catch (error: any) {
                    console.error('Wallet connection error:', error);
                    setWalletError(error.message || 'Failed to link wallet to account');
                    toast.error(error.message || 'Failed to link wallet to account');

                    // If wallet update fails, disconnect wallet to keep UI state consistent
                    disconnect();
                }
            }
        } catch (error: any) {
            console.error('Wallet connection error:', error);
            setWalletError(error.message || 'Failed to connect wallet');
            toast.error(error.message || 'Failed to connect wallet');
        } finally {
            setIsWalletConnecting(false);
        }
    };

    const handleDisconnectWallet = async () => {
        try {
            // Use dedicated wallet disconnect endpoint
            await api.delete('/users/wallet');

            // Update local state
            setProfileData(prev => ({
                ...prev,
                walletAddress: ''
            }));

            // Disconnect wallet
            disconnect();

            toast.success('Wallet disconnected successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to disconnect wallet');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Address copied to clipboard!');
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-medium text-gray-900">Please sign in to view your profile</h2>
                    <Link to="/auth/login" className="mt-4 inline-block">
                        <CustomButton>Sign In</CustomButton>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading || !profileData) {
        return <LoadingScreen />;
    }

    const isFreelancer = user.role === 'freelancer';
    const hasWallet = Boolean(profileData.walletAddress);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <Link to="/profile/settings">
                        <CustomButton
                            variant="outline"
                            leftIcon={<Edit2 className="w-4 h-4" />}
                        >
                            Edit Profile
                        </CustomButton>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Overview */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="p-6 text-center border-b border-gray-200">
                                <div className="w-20 h-20 rounded-full mx-auto bg-primary text-white flex items-center justify-center text-xl mb-4">
                                    {profileData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                                {isFreelancer && (
                                    <p className="text-sm text-gray-600 mt-1">{profileData.headline}</p>
                                )}
                            </div>

                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center mb-3">
                                    <User className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-600">{profileData.email}</span>
                                </div>

                                {isFreelancer ? (
                                    <div className="flex items-center mb-3">
                                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">{profileData.location || 'Location not set'}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center mb-3">
                                        <Briefcase className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-sm text-gray-600">{profileData.company || 'Company not set'}</span>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-sm text-gray-600">
                                        Member since {new Date(profileData.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Wallet Address</h3>
                                {hasWallet ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center">
                                            <BaseIcon className="w-4 h-4 text-primary mr-2" />
                                            <span className="text-sm font-medium text-gray-700">Base</span>
                                        </div>
                                        <div className="mt-1 flex items-center">
                                            <Wallet className="w-4 h-4 text-gray-500 mr-2" />
                                            <span className="text-xs text-gray-600 truncate">
                                                {truncateAddress(profileData.walletAddress)}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(profileData.walletAddress)}
                                                className="ml-1 text-gray-400 hover:text-gray-600"
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                            <a
                                                href={`https://basescan.org/address/${profileData.walletAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-primary hover:text-primary/80"
                                                title="View on BaseScan"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        <div className="mt-2 flex items-center text-green-600 text-xs">
                                            <BadgeCheck className="w-3 h-3 mr-1" />
                                            Verified
                                        </div>
                                        <div className="mt-2">
                                            <CustomButton
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDisconnectWallet}
                                            >
                                                Disconnect Wallet
                                            </CustomButton>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        <p>No wallet connected</p>
                                        <div className="mt-2">
                                            <CustomButton
                                                variant="outline"
                                                size="sm"
                                                onClick={handleConnectWallet}
                                                disabled={isWalletConnecting}
                                                leftIcon={<BaseIcon className="w-3 h-3" />}
                                            >
                                                {isWalletConnecting ? 'Connecting...' : 'Connect Wallet'}
                                            </CustomButton>
                                        </div>
                                        {walletError && (
                                            <p className="text-xs text-red-500 mt-2">{walletError}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    {isFreelancer ? 'Professional Information' : 'Company Information'}
                                </h2>

                                {isFreelancer ? (
                                    <div>
                                        <div className="mb-4">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Hourly Rate</h3>
                                            <div className="flex items-center">
                                                <DollarSign className="w-5 h-5 text-primary mr-1" />
                                                <span className="text-xl font-bold text-gray-900">
                                                    {profileData.hourlyRate || '0'} ETH
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">per hour</span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.skills?.length > 0 ? (
                                                    profileData.skills.map((skill: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">No skills added yet</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="grid grid-cols-2 gap-6 mb-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700 mb-1">Industry</h3>
                                                <p className="text-gray-900">{profileData.industry || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700 mb-1">Company Size</h3>
                                                <p className="text-gray-900">{profileData.companySize || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-700 mb-1">Company Location</h3>
                                                <p className="text-gray-900">{profileData.companyLocation || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    {isFreelancer ? 'Professional Bio' : 'Company Description'}
                                </h3>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {profileData.bio || 'No description provided.'}
                                </p>
                            </div>
                        </div>

                        {/* Portfolio/Jobs Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">
                                    {isFreelancer ? 'Portfolio' : 'Posted Jobs'}
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-500 text-center py-8">
                                    {isFreelancer
                                        ? 'Your portfolio items will appear here. Add your first portfolio item.'
                                        : 'Your posted jobs will appear here. Post your first job.'}
                                </p>
                                <div className="flex justify-center">
                                    <Link to={isFreelancer ? '/portfolio/add' : '/post-job'}>
                                        <CustomButton>
                                            {isFreelancer ? 'Add Portfolio Item' : 'Post a Job'}
                                        </CustomButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
