import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    Star,
    Paperclip,
    Save,
    Send,
    AlertTriangle,
    Plus,
    Info,
    X,
    Trash2
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { GroqIcon, BaseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import dataService from '@/services/DataService';

// Define a type for our draft proposals that matches the structure we're using
interface DraftProposal {
    id: string;
    jobId: string;
    jobTitle: string;
    client: string;
    clientRating: number;
    bidAmount: string;
    currency: string;
    deliveryTime: string;
    proposalText: string;
    status: string;
    lastEdited: string;
}

// Mock draft data for testing
const mockDrafts: DraftProposal[] = [
    {
        id: "draft1",
        jobId: "job7",
        jobTitle: "Frontend Developer for DeFi Project",
        client: "Blockchain Solutions",
        clientRating: 4.5,
        bidAmount: "2800",
        currency: "USDC",
        deliveryTime: "14 days",
        proposalText: "I have extensive experience developing frontend applications for DeFi projects...",
        status: "Draft",
        lastEdited: "April 29, 2025"
    },
    {
        id: "draft2",
        jobId: "job8",
        jobTitle: "Smart Contract Audit",
        client: "DeFi Protocol",
        clientRating: 4.9,
        bidAmount: "3500",
        currency: "USDC",
        deliveryTime: "10 days",
        proposalText: "As a security professional with 5+ years experience in smart contract audits...",
        status: "Draft",
        lastEdited: "April 28, 2025"
    }
];

const ProposalEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isNewProposal = id === 'new';
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // If new proposal, get job details from URL parameters
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (isNewProposal) {
                    // For a new proposal, get job ID from URL query parameters
                    const params = new URLSearchParams(window.location.search);
                    const jobId = params.get('jobId');

                    if (jobId) {
                        // Fetch job details using DataService
                        const job = await dataService.getJobById(jobId);
                        if (job) {
                            setJobDetails({
                                id: job.id,
                                title: job.title,
                                client: job.client.name,
                                clientRating: job.client.rating,
                                budget: job.budget,
                                currency: job.currency || 'USDC',
                                deadline: job.deadline?.split('T')[0], // Format the date
                                skills: job.skills || []
                            });
                        }
                    }
                } else if (id) {
                    // Editing an existing proposal
                    // Check if it's a bid or a draft
                    const existingBid = await dataService.getBidById(id);

                    if (existingBid) {
                        // It's an existing bid
                        const job = await dataService.getJobById(existingBid.jobId);
                        if (job) {
                            setJobDetails({
                                id: job.id,
                                title: job.title,
                                client: job.client.name,
                                clientRating: job.client.rating,
                                budget: job.budget,
                                currency: job.currency || 'USDC',
                                deadline: job.deadline?.split('T')[0],
                                skills: job.skills || []
                            });
                        }
                    } else {
                        // Check if it's a draft
                        const draft = mockDrafts.find(draft => draft.id === id);
                        if (draft) {
                            setJobDetails({
                                id: draft.jobId,
                                title: draft.jobTitle,
                                client: draft.client,
                                clientRating: draft.clientRating,
                                budget: '2000-3000', // Placeholder
                                currency: draft.currency,
                                deadline: 'May 30, 2025', // Placeholder
                                skills: ['React', 'TypeScript', 'Web3', 'Solidity', 'Security'] // Placeholder
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching proposal data:', error);
                toast.error('Failed to load proposal data');

                // Fallback for demo purposes
                setJobDetails({
                    id: 'job9',
                    title: isNewProposal ? 'Frontend Developer for DeFi Dashboard' : 'Smart Contract Audit',
                    client: isNewProposal ? 'Crypto Finance Inc.' : 'DeFi Protocol',
                    clientRating: 4.7,
                    budget: '2000-3000',
                    currency: 'USDC',
                    deadline: 'May 30, 2025',
                    skills: ['React', 'TypeScript', 'Web3', 'Solidity', 'Security']
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, isNewProposal]);

    // Form state, handle both Bid type and DraftProposal type
    const [formData, setFormData] = useState({
        bidAmount: '',
        deliveryTime: '14',
        coverLetter: '',
        milestones: [
            { title: 'Research and Analysis', amount: '', dueDate: '' },
            { title: 'Development Phase', amount: '', dueDate: '' }
        ],
        attachments: [] as File[]
    });

    // Load existing proposal data when available
    useEffect(() => {
        const loadExistingProposal = async () => {
            if (!id || id === 'new') return;

            const existingBid = await dataService.getBidById(id);
            if (existingBid) {
                setFormData(prev => ({
                    ...prev,
                    bidAmount: existingBid.amount,
                    deliveryTime: existingBid.deliveryTime.split(' ')[0] || '14',
                    coverLetter: existingBid.proposal
                }));
            } else {
                // Check if it's a draft
                const draft = mockDrafts.find(d => d.id === id);
                if (draft) {
                    setFormData(prev => ({
                        ...prev,
                        bidAmount: draft.bidAmount,
                        deliveryTime: draft.deliveryTime.split(' ')[0] || '14',
                        coverLetter: draft.proposalText
                    }));
                }
            }
        };

        loadExistingProposal();
    }, [id]);

    const [showAiTip, setShowAiTip] = useState(true);
    const [errors, setErrors] = useState({
        bidAmount: '',
        deliveryTime: '',
        coverLetter: ''
    });

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (name in errors) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle milestone changes
    const handleMilestoneChange = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const updatedMilestones = [...prev.milestones];
            updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
            return { ...prev, milestones: updatedMilestones };
        });
    };

    // Add new milestone
    const addMilestone = () => {
        setFormData(prev => ({
            ...prev,
            milestones: [
                ...prev.milestones,
                { title: 'New Milestone', amount: '', dueDate: '' }
            ]
        }));
    };

    // Remove a milestone
    const removeMilestone = (index: number) => {
        if (formData.milestones.length <= 1) return; // Keep at least one milestone
        setFormData(prev => ({
            ...prev,
            milestones: prev.milestones.filter((_, i) => i !== index)
        }));
    };

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, ...newFiles]
            }));
        }
    };

    // Remove attachment
    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    // Generate AI suggested cover letter
    const generateAICoverLetter = () => {
        // In a real app, this would call the Groq API
        toast.success('Generating personalized proposal text...');
        setTimeout(() => {
            const aiSuggestedText = `As a seasoned developer with over 5 years of experience in DeFi projects, I'm particularly interested in this opportunity with ${jobDetails?.client}. 

I've successfully delivered similar projects by:
1. Building responsive dashboards with React and TypeScript
2. Integrating with multiple blockchain protocols through Web3.js
3. Implementing secure wallet connections and transactions

I can deliver this project in ${formData.deliveryTime} days, with a focus on performance optimization and security best practices. My approach includes daily updates and a phased delivery to ensure we stay on track.

Looking forward to discussing how my skills align with your project needs.`;

            setFormData(prev => ({ ...prev, coverLetter: aiSuggestedText }));
        }, 1500);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {
            bidAmount: '',
            deliveryTime: '',
            coverLetter: ''
        };

        if (!formData.bidAmount || Number(formData.bidAmount) <= 0) {
            newErrors.bidAmount = 'Please enter a valid bid amount';
        }

        if (!formData.deliveryTime) {
            newErrors.deliveryTime = 'Please select a delivery time';
        }

        if (!formData.coverLetter.trim()) {
            newErrors.coverLetter = 'Please provide a cover letter';
        } else if (formData.coverLetter.trim().length < 100) {
            newErrors.coverLetter = 'Your cover letter should be at least 100 characters';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    // Save as draft
    const handleSaveAsDraft = async () => {
        if (!formData.coverLetter.trim()) {
            setErrors(prev => ({ ...prev, coverLetter: 'Please enter some text for your proposal' }));
            return;
        }

        if (!user) {
            toast.error('Please log in to save a draft');
            return;
        }

        // Use the DataService to save the draft
        try {
            const draft = {
                jobId: jobDetails?.id || 'job1',
                jobTitle: jobDetails?.title || 'Job Title',
                freelancerId: user.id,
                freelancerName: user.name,
                freelancerAvatar: user.avatar || '',
                bidAmount: formData.bidAmount,
                currency: jobDetails?.currency || 'USDC',
                deliveryTime: `${formData.deliveryTime} days`,
                coverLetter: formData.coverLetter,
                milestones: formData.milestones,
            };

            const result = await dataService.saveDraftProposal(draft);
            if (result.success) {
                toast.success('Proposal saved as draft');
                navigate('/proposals?filter=drafts');
            } else {
                toast.error('Failed to save draft');
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            toast.error('An error occurred while saving your draft');
        }
    };

    // Submit proposal
    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (!user) {
            toast.error('Please log in to submit a proposal');
            return;
        }

        try {
            // Use the DataService to submit the proposal
            const proposal = {
                jobId: jobDetails?.id || 'job1',
                freelancerId: user.id,
                freelancerName: user.name,
                freelancerAvatar: user.avatar || '',
                freelancerRating: 4.5, // Mock rating
                freelancerCompletedJobs: 0,
                freelancerSkills: user.profile?.skills || [],
                bidAmount: formData.bidAmount,
                currency: jobDetails?.currency || 'USDC',
                deliveryTime: formData.deliveryTime,
                coverLetter: formData.coverLetter,
                milestones: formData.milestones,
            };

            const result = await dataService.submitProposal(proposal);
            if (result.success) {
                toast.success(isNewProposal || id === 'new' ? 'Proposal submitted successfully!' : 'Proposal updated successfully!');
                navigate('/proposals');
            } else {
                toast.error('Failed to submit proposal');
            }
        } catch (error) {
            console.error('Error submitting proposal:', error);
            toast.error('An error occurred while submitting your proposal');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-16 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/proposals" className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Proposals
                    </Link>
                </div>

                {/* Page Header */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
                    <div className="bg-primary/5 p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isNewProposal || id === 'new' ? 'Create New Proposal' : 'Edit Proposal'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {isNewProposal || id === 'new'
                                ? 'Submit a strong proposal to stand out from other freelancers'
                                : 'Update your proposal details'}
                        </p>
                    </div>

                    {/* Job Details Section */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900">{jobDetails?.title}</h3>
                            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <DollarSign className="w-3.5 h-3.5 mr-1" />
                                    Budget: {jobDetails?.budget} {jobDetails?.currency}
                                </span>
                                <span className="flex items-center">
                                    <Calendar className="w-3.5 h-3.5 mr-1" />
                                    Due: {jobDetails?.deadline}
                                </span>
                                <span className="flex items-center">
                                    <Star className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-current" />
                                    Client Rating: {jobDetails?.clientRating}
                                </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {jobDetails?.skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Proposal Form */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Bid Amount and Delivery Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Bid Amount ({jobDetails?.currency})
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            id="bidAmount"
                                            name="bidAmount"
                                            className={cn(
                                                "pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm",
                                                errors.bidAmount ? "border-red-500" : "border-gray-300"
                                            )}
                                            placeholder="Enter your bid amount"
                                            min="1"
                                            value={formData.bidAmount}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    {errors.bidAmount && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bidAmount}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        Service fee: {(Number(formData.bidAmount || 0) * 0.08).toFixed(2)} {jobDetails?.currency} (8%)
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
                                        Delivery Time
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            id="deliveryTime"
                                            name="deliveryTime"
                                            className={cn(
                                                "block w-24 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm",
                                                errors.deliveryTime ? "border-red-500" : "border-gray-300"
                                            )}
                                            min="1"
                                            value={formData.deliveryTime}
                                            onChange={handleChange}
                                        />
                                        <select
                                            className="ml-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                            defaultValue="days"
                                        >
                                            <option value="days">Days</option>
                                            <option value="weeks">Weeks</option>
                                            <option value="months">Months</option>
                                        </select>
                                    </div>
                                    {errors.deliveryTime && (
                                        <p className="mt-1 text-sm text-red-600">{errors.deliveryTime}</p>
                                    )}
                                </div>
                            </div>

                            {/* AI Tip */}
                            {showAiTip && (
                                <div className="bg-accent/5 rounded-lg border border-accent/20 p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex">
                                            <GroqIcon className="w-5 h-5 text-accent mt-1 mr-3" />
                                            <div>
                                                <h3 className="font-medium text-gray-900 text-sm mb-1">Proposal Tip</h3>
                                                <p className="text-xs text-gray-600">
                                                    Proposals with detailed milestones and specific timelines are 78% more likely to be accepted.
                                                    Your bid ($
                                                    {formData.bidAmount || '0'}) is {
                                                        Number(formData.bidAmount || 0) < Number((jobDetails?.budget || '0-0').split('-')[0])
                                                            ? 'below'
                                                            : Number(formData.bidAmount || 0) > Number((jobDetails?.budget || '0-0').split('-')[1])
                                                                ? 'above'
                                                                : 'within'
                                                    } the client's budget range.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowAiTip(false)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Cover Letter */}
                            <div>
                                <div className="flex justify-between items-end mb-1">
                                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                                        Cover Letter
                                    </label>
                                    <button
                                        onClick={generateAICoverLetter}
                                        type="button"
                                        className="text-accent text-xs flex items-center hover:text-accent/80"
                                    >
                                        <GroqIcon className="w-3 h-3 mr-1" />
                                        Generate with AI
                                    </button>
                                </div>
                                <textarea
                                    id="coverLetter"
                                    name="coverLetter"
                                    rows={8}
                                    className={cn(
                                        "block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm",
                                        errors.coverLetter ? "border-red-500" : "border-gray-300"
                                    )}
                                    placeholder="Introduce yourself and explain why you're a good fit for this project. Be specific about your experience and approach."
                                    value={formData.coverLetter}
                                    onChange={handleChange}
                                />
                                {errors.coverLetter && (
                                    <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500 flex items-center">
                                    <Info className="w-3 h-3 mr-1" />
                                    Include relevant experience, approach, and timeline
                                </p>
                            </div>

                            {/* Milestones Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-medium text-gray-700">Project Milestones</h3>
                                    <button
                                        type="button"
                                        onClick={addMilestone}
                                        className="text-primary text-sm flex items-center hover:text-primary/80"
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Add Milestone
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.milestones.map((milestone, idx) => (
                                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-medium text-gray-900 text-sm">Milestone {idx + 1}</h4>
                                                {formData.milestones.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMilestone(idx)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="md:col-span-1">
                                                    <label htmlFor={`milestone-${idx}-title`} className="block text-xs font-medium text-gray-700 mb-1">
                                                        Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id={`milestone-${idx}-title`}
                                                        value={milestone.title}
                                                        onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`milestone-${idx}-amount`} className="block text-xs font-medium text-gray-700 mb-1">
                                                        Amount ({jobDetails?.currency})
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id={`milestone-${idx}-amount`}
                                                        value={milestone.amount}
                                                        onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`milestone-${idx}-dueDate`} className="block text-xs font-medium text-gray-700 mb-1">
                                                        Due Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id={`milestone-${idx}-dueDate`}
                                                        value={milestone.dueDate}
                                                        onChange={(e) => handleMilestoneChange(idx, 'dueDate', e.target.value)}
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attachments */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
                                <div className="flex items-center mb-4">
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-white border border-gray-300 rounded-md font-medium text-primary hover:text-primary/80 px-4 py-2 flex items-center"
                                    >
                                        <Paperclip className="mr-2 h-4 w-4" />
                                        <span>Add Files</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="ml-3 text-xs text-gray-500">
                                        Max 5 files, 25MB each
                                    </p>
                                </div>

                                {/* File List */}
                                {formData.attachments.length > 0 && (
                                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                        {formData.attachments.map((file, idx) => (
                                            <li
                                                key={idx}
                                                className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                            >
                                                <div className="w-0 flex-1 flex items-center">
                                                    <Paperclip className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                                    <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <button
                                                        type="button"
                                                        className="font-medium text-red-600 hover:text-red-500"
                                                        onClick={() => removeAttachment(idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Secure Payment Note */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start">
                                <BaseIcon className="w-5 h-5 text-primary mt-0.5 mr-3" />
                                <div>
                                    <h3 className="font-medium text-gray-900 text-sm mb-1">Secure Payments with Base</h3>
                                    <p className="text-xs text-gray-600">
                                        Your payment is secured through Base smart contracts. You'll receive payment as each milestone is approved.
                                    </p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <CustomButton
                                    variant="outline"
                                    onClick={handleSaveAsDraft}
                                    leftIcon={<Save className="w-4 h-4" />}
                                >
                                    Save as Draft
                                </CustomButton>
                                <CustomButton
                                    onClick={handleSubmit}
                                    leftIcon={<Send className="w-4 h-4" />}
                                >
                                    {isNewProposal || id === 'new' ? 'Submit Proposal' : 'Update Proposal'}
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalEdit;