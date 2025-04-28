import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import {
    User,
    Briefcase,
    MapPin,
    DollarSign,
    Star,
    Edit2,
    Calendar,
    Wallet,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { BaseIcon } from '@/components/icons';
import { CustomButton } from '@/components/ui/custom-button';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from 'sonner';

const Profile: React.FC = () => {
    const { user, fetchDashboardData } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                // Fetch dashboard data for stats
                await fetchDashboardData();

                // Fetch detailed profile data
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
                                                {profileData.walletAddress}
                                            </span>
                                            <a
                                                href={`https://basescan.org/address/${profileData.walletAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2 text-primary hover:text-primary/80"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        <div className="mt-2 flex items-center text-green-600 text-xs">
                                            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        <p>No wallet connected</p>
                                        <Link to="/profile/settings" className="text-primary hover:text-primary/80 text-sm mt-1 inline-block">
                                            Connect your wallet
                                        </Link>
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
