import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Briefcase,
    MapPin,
    DollarSign,
    Plus,
    Star,
    Trash,
    Wallet,
    BadgeCheck
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user, updateProfile } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        headline: '',
        email: '',
        bio: '',
        walletAddress: '',
        hourlyRate: '',
        location: '',
        skills: [] as string[],
        company: '',
        industry: '',
        companySize: '',
        companyLocation: ''
    });

    const [newSkill, setNewSkill] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize form data from user context
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.name || '',
                headline: user.profile?.headline ? String(user.profile.headline) : '',
                email: user.email || '',
                bio: user.profile?.bio || '',
                walletAddress: user.walletAddress || '',
                hourlyRate: user.profile?.hourlyRate?.toString() || '',
                location: user.profile?.location || '',
                skills: user.profile?.skills || [],
                company: user.profile?.company || '',
                industry: user.profile?.industry || '',
                companySize: user.profile?.companySize || '',
                companyLocation: user.profile?.companyLocation || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const connectWallet = async () => {
        try {
            // In a real implementation, this would connect to wallet like Coinbase Wallet
            // For demo, we'll simulate connecting a wallet
            const walletAddress = '0x1234567890abcdef1234567890abcdef12345678'; // Simulated wallet address
        } catch (error) {
            console.error('Wallet connection error:', error);
            toast.error('An error occurred while connecting your wallet.');
        }
    };

    const addSkill = () => {
        if (!newSkill.trim()) return;

        // Check if skill already exists
        if (formData.skills.includes(newSkill.trim())) {
            toast.error('This skill is already in your list');
            return;
        }

        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, newSkill.trim()]
        }));
        setNewSkill('');
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Basic validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Wallet address validation - basic format check for Ethereum/Base address
        if (formData.walletAddress && !/^(0x)?[0-9a-fA-F]{40}$/.test(formData.walletAddress)) {
            newErrors.walletAddress = 'Please enter a valid wallet address (0x followed by 40 characters)';
        }

        // Role-specific validation
        if (user?.role === 'freelancer') {
            if (!formData.headline?.trim()) {
                newErrors.headline = 'Professional headline is required';
            }

            if (!formData.bio?.trim()) {
                newErrors.bio = 'Bio is required';
            } else if (formData.bio.length < 50) {
                newErrors.bio = 'Bio should be at least 50 characters';
            }

            if (formData.hourlyRate && (isNaN(parseFloat(formData.hourlyRate)) || parseFloat(formData.hourlyRate) <= 0)) {
                newErrors.hourlyRate = 'Please enter a valid hourly rate';
            }

            if (formData.skills.length === 0) {
                newErrors.skills = 'Please add at least one skill';
            }
        } else {
            // Client-specific validation
            if (!formData.company?.trim()) {
                newErrors.company = 'Company name is required';
            }

            if (!formData.industry?.trim()) {
                newErrors.industry = 'Industry is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        setIsSubmitting(true);

        try {
            // Format profile data based on user role
            const profileData = user?.role === 'freelancer'
                ? {
                    headline: formData.headline,
                    bio: formData.bio,
                    hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
                    location: formData.location,
                    skills: formData.skills,
                    company: '',
                    industry: '',
                    companySize: '',
                    companyLocation: ''
                }
                : {
                    // Provide defaults for required freelancer fields to satisfy type requirements
                    headline: '',
                    bio: '',
                    hourlyRate: 0,
                    location: '',
                    skills: [],
                    company: formData.company,
                    industry: formData.industry,
                    companySize: formData.companySize,
                    companyLocation: formData.companyLocation
                };

            // Update profile using auth context
            await updateProfile({
                name: formData.fullName,
                email: formData.email,
                walletAddress: formData.walletAddress,
                profile: profileData
            });

            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-8">
                    <div className="p-6 sm:p-8 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                        <p className="mt-1 text-gray-600">Update your profile information and settings</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Wallet */}
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-primary" />
                                Wallet Address
                            </h2>

                            <div>
                                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                    Base Wallet Address
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        id="walletAddress"
                                        name="walletAddress"
                                        value={formData.walletAddress}
                                        onChange={handleChange}
                                        placeholder="0x..."
                                        className={`flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.walletAddress ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={connectWallet}
                                        className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90 flex-shrink-0"
                                    >
                                        Connect
                                    </button>
                                </div>
                                {formData.walletAddress && !errors.walletAddress && (
                                    <div className="flex items-center mt-2 text-green-600 text-sm">
                                        <BadgeCheck className="h-4 w-4 mr-1" />
                                        Wallet address connected
                                    </div>
                                )}
                                {errors.walletAddress && (
                                    <p className="mt-1 text-sm text-red-600">{errors.walletAddress}</p>
                                )}
                                <p className="mt-2 text-xs text-gray-500">
                                    Your wallet address is used for secure payments on the Base network
                                </p>
                            </div>
                        </div>

                        {/* Role-specific sections */}
                        {user?.role === 'freelancer' ? (
                            <div className="space-y-6">
                                {/* Freelancer Profile */}
                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        Professional Information
                                    </h2>

                                    <div>
                                        <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
                                            Professional Headline
                                        </label>
                                        <input
                                            type="text"
                                            id="headline"
                                            name="headline"
                                            value={formData.headline}
                                            onChange={handleChange}
                                            placeholder="e.g., Senior Full Stack Developer"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.headline ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.headline && (
                                            <p className="mt-1 text-sm text-red-600">{errors.headline}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Professional Bio
                                        </label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Describe your experience, expertise, and what you can offer to clients"
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.bio ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.bio && (
                                            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            {formData.bio ? `${formData.bio.length}/500 characters` : '0/500 characters'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                                                Hourly Rate (ETH)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="hourlyRate"
                                                    name="hourlyRate"
                                                    value={formData.hourlyRate}
                                                    onChange={handleChange}
                                                    placeholder="0.05"
                                                    className={`w-full pl-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                />
                                                {errors.hourlyRate && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                                Location
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <MapPin className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    placeholder="City, Country"
                                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Star className="h-5 w-5 text-primary" />
                                        Skills
                                    </h2>

                                    <div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                placeholder="Add a skill"
                                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                            <button
                                                type="button"
                                                onClick={addSkill}
                                                className="flex-shrink-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add
                                            </button>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {formData.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary/80 hover:text-primary"
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                        <Trash className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        {errors.skills && (
                                            <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Client Profile */
                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Company Information
                                </h2>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.company ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.company && (
                                            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                                            Industry
                                        </label>
                                        <select
                                            id="industry"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.industry ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        >
                                            <option value="">Select industry</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                            <option value="E-commerce">E-commerce</option>
                                            <option value="Blockchain">Blockchain</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.industry && (
                                            <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Size
                                        </label>
                                        <select
                                            id="companySize"
                                            name="companySize"
                                            value={formData.companySize}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        >
                                            <option value="">Select company size</option>
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201-500">201-500 employees</option>
                                            <option value="500+">500+ employees</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Location
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="companyLocation"
                                                name="companyLocation"
                                                value={formData.companyLocation}
                                                onChange={handleChange}
                                                placeholder="City, Country"
                                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row-reverse gap-3">
                            <CustomButton
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </CustomButton>
                            <CustomButton
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => navigate('/profile')}
                            >
                                Cancel
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;