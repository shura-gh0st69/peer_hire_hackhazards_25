import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Calendar,
    Clock,
    DollarSign,
    MessageSquare,
    FileText,
    ArrowRight,
    AlertTriangle,
    Check,
    ChevronDown,
    BarChart2,
    Star,
    List,
    CheckCircle,
    Briefcase,
    ExternalLink,
    Upload,
    Bell
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { GroqIcon, BaseIcon, ScreenpipeIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MilestoneProps {
    id: string;
    title: string;
    description: string;
    amount: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'under-review' | 'completed' | 'rejected';
    feedback?: string;
    submissionDate?: string;
}

interface ActiveJobProps {
    id: string;
    title: string;
    clientName: string;
    clientId: string;
    clientRating: number;
    startDate: string;
    completionDate: string;
    totalAmount: string;
    amountPaid: string;
    currency: string;
    status: 'in-progress' | 'review' | 'dispute' | 'hold';
    progress: number;
    milestones: MilestoneProps[];
    isBaseVerified: boolean;
    hasScreenpipeRecordings: boolean;
    unreadMessages: number;
    description: string;
    timeElapsed?: string;
    remainingTime?: string;
}

// Mock data for active jobs
const mockActiveJobs: ActiveJobProps[] = [
    {
        id: 'j1',
        title: 'DeFi Dashboard Development',
        clientName: 'TechStart Inc.',
        clientId: 'c1',
        clientRating: 4.8,
        startDate: '2025-04-15',
        completionDate: '2025-05-15',
        totalAmount: '3,500',
        amountPaid: '1,400',
        currency: 'USDC',
        status: 'in-progress',
        progress: 40,
        isBaseVerified: true,
        hasScreenpipeRecordings: true,
        unreadMessages: 2,
        description: 'Development of a responsive DeFi dashboard with real-time price charts, wallet integration, and transaction history.',
        timeElapsed: '15 days',
        remainingTime: '15 days',
        milestones: [
            {
                id: 'm1',
                title: 'UI Design and Wireframes',
                description: 'Create wireframes and design mockups for all dashboard screens and components.',
                amount: '700',
                dueDate: '2025-04-22',
                status: 'completed',
                submissionDate: '2025-04-21'
            },
            {
                id: 'm2',
                title: 'Frontend Implementation',
                description: 'Implement the UI components, charts, and responsive layout.',
                amount: '1,050',
                dueDate: '2025-04-30',
                status: 'in-progress'
            },
            {
                id: 'm3',
                title: 'Web3 Integration',
                description: 'Connect to blockchain and implement wallet connection and transaction functionality.',
                amount: '1,050',
                dueDate: '2025-05-10',
                status: 'pending'
            },
            {
                id: 'm4',
                title: 'Testing and Deployment',
                description: 'Test all features and deploy to production environment.',
                amount: '700',
                dueDate: '2025-05-15',
                status: 'pending'
            }
        ]
    },
    {
        id: 'j2',
        title: 'Smart Contract Audit for NFT Marketplace',
        clientName: 'NFT Innovations',
        clientId: 'c2',
        clientRating: 4.9,
        startDate: '2025-04-20',
        completionDate: '2025-05-05',
        totalAmount: '2,800',
        amountPaid: '1,400',
        currency: 'USDC',
        status: 'review',
        progress: 75,
        isBaseVerified: true,
        hasScreenpipeRecordings: true,
        unreadMessages: 0,
        description: 'Comprehensive security audit of ERC-721 smart contracts including marketplace functionality, bidding, and royalty systems.',
        timeElapsed: '10 days',
        remainingTime: '5 days',
        milestones: [
            {
                id: 'm1',
                title: 'Initial Code Review',
                description: 'Preliminary analysis of smart contracts and identification of potential issues.',
                amount: '700',
                dueDate: '2025-04-23',
                status: 'completed',
                submissionDate: '2025-04-23'
            },
            {
                id: 'm2',
                title: 'Vulnerability Assessment',
                description: 'Deep analysis using automated tools and manual review to find security vulnerabilities.',
                amount: '1,400',
                dueDate: '2025-04-30',
                status: 'completed',
                submissionDate: '2025-04-29'
            },
            {
                id: 'm3',
                title: 'Final Report and Recommendations',
                description: 'Comprehensive report with all findings and recommended fixes.',
                amount: '700',
                dueDate: '2025-05-05',
                status: 'under-review',
                submissionDate: '2025-04-30'
            }
        ]
    },
    {
        id: 'j3',
        title: 'Mobile Wallet App Development',
        clientName: 'Crypto Ventures',
        clientId: 'c3',
        clientRating: 4.7,
        startDate: '2025-03-25',
        completionDate: '2025-05-25',
        totalAmount: '6,500',
        amountPaid: '3,250',
        currency: 'USDC',
        status: 'dispute',
        progress: 50,
        isBaseVerified: true,
        hasScreenpipeRecordings: false,
        unreadMessages: 4,
        description: 'Development of a cryptocurrency mobile wallet with support for multiple chains, portfolio tracking, and DApp browser.',
        timeElapsed: '35 days',
        remainingTime: '25 days',
        milestones: [
            {
                id: 'm1',
                title: 'UI Design',
                description: 'Design UI/UX for all app screens and user flows.',
                amount: '1,300',
                dueDate: '2025-04-10',
                status: 'completed',
                submissionDate: '2025-04-08'
            },
            {
                id: 'm2',
                title: 'Core Wallet Functionality',
                description: 'Implement secure key storage, transaction signing, and balance displays.',
                amount: '1,950',
                dueDate: '2025-04-30',
                status: 'in-progress'
            },
            {
                id: 'm3',
                title: 'Multi-chain Support',
                description: 'Add support for Ethereum, Base, and other EVM chains.',
                amount: '1,950',
                dueDate: '2025-05-15',
                status: 'pending'
            },
            {
                id: 'm4',
                title: 'Testing and Release',
                description: 'Final testing and app store deployment.',
                amount: '1,300',
                dueDate: '2025-05-25',
                status: 'pending'
            }
        ]
    }
];

const ActiveJobs = () => {
    const [activeJobs, setActiveJobs] = useState<ActiveJobProps[]>(mockActiveJobs);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [expandedJob, setExpandedJob] = useState<string | null>(null);

    // Filter jobs based on search term and status filter
    const filteredJobs = activeJobs.filter(job => {
        const matchesSearch =
            searchTerm === '' ||
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'in-progress' && job.status === 'in-progress') ||
            (statusFilter === 'review' && job.status === 'review') ||
            (statusFilter === 'issues' && (job.status === 'dispute' || job.status === 'hold'));

        return matchesSearch && matchesStatus;
    });

    const handleExpandJob = (id: string) => {
        setExpandedJob(expandedJob === id ? null : id);
    };

    const handleStartScreenRecording = (jobId: string) => {
        toast.success('Screen recording started');
        // Would integrate with Screenpipe API in a real implementation
    };

    const handleSubmitMilestone = (jobId: string, milestoneId: string) => {
        toast.success('Milestone submission prepared. Ready to upload deliverables.');
        // Would open a milestone submission form in a real implementation
    };

    const handleRequestExtension = (jobId: string, milestoneId: string) => {
        toast.success('Extension request prepared. Please specify new deadline.');
        // Would open a deadline extension form in a real implementation
    };

    const getMilestoneStatusInfo = (status: MilestoneProps['status']) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Not Started',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-600'
                };
            case 'in-progress':
                return {
                    label: 'In Progress',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700'
                };
            case 'under-review':
                return {
                    label: 'Under Review',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-700'
                };
            case 'completed':
                return {
                    label: 'Completed',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700'
                };
            case 'rejected':
                return {
                    label: 'Revision Needed',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-600'
                };
        }
    };

    const getJobStatusInfo = (status: ActiveJobProps['status']) => {
        switch (status) {
            case 'in-progress':
                return {
                    label: 'In Progress',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    icon: <Clock className="w-3.5 h-3.5 mr-1" />
                };
            case 'review':
                return {
                    label: 'Under Review',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-700',
                    icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                };
            case 'dispute':
                return {
                    label: 'Dispute Open',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-600',
                    icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                };
            case 'hold':
                return {
                    label: 'On Hold',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-600',
                    icon: <Clock className="w-3.5 h-3.5 mr-1" />
                };
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Active Jobs</h1>
                        <p className="text-gray-600">Manage your ongoing projects and deliverables</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link to="/jobs">
                            <CustomButton
                                leftIcon={<Search className="w-4 h-4" />}
                            >
                                Find More Jobs
                            </CustomButton>
                        </Link>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    statusFilter === 'all'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setStatusFilter('all')}
                            >
                                All Jobs
                            </button>
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    statusFilter === 'in-progress'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setStatusFilter('in-progress')}
                            >
                                In Progress
                            </button>
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    statusFilter === 'review'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setStatusFilter('review')}
                            >
                                Under Review
                            </button>
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    statusFilter === 'issues'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setStatusFilter('issues')}
                            >
                                Issues
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="w-full sm:max-w-md relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search active jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Productivity Assistant */}
                <div className="bg-accent/5 border border-accent/10 rounded-lg p-4 mb-6 flex items-start">
                    <GroqIcon className="w-6 h-6 text-accent mt-1 mr-3" />
                    <div>
                        <h3 className="font-medium text-gray-900">Work Management Assistant</h3>
                        <p className="text-sm text-gray-600 mt-1 mb-4">
                            Based on your current workload, you should prioritize the DeFi Dashboard project as it has an upcoming milestone due in 3 days.
                            The Smart Contract Audit is awaiting client review - you can start preparing for the Mobile Wallet App's multi-chain support meanwhile.
                        </p>
                        <CustomButton variant="accent" size="sm">
                            Get AI Work Recommendations
                        </CustomButton>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="space-y-6">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map(job => {
                            const jobStatusInfo = getJobStatusInfo(job.status);
                            const isExpanded = expandedJob === job.id;
                            const nextMilestone = job.milestones.find(m => m.status === 'in-progress' || m.status === 'pending');

                            return (
                                <div
                                    key={job.id}
                                    className={cn(
                                        "bg-white rounded-lg border shadow-sm overflow-hidden transition-all",
                                        job.status === 'dispute' ? "border-red-300" : "border-gray-200",
                                        isExpanded ? "shadow-md" : ""
                                    )}
                                >
                                    {/* Job Header */}
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() => handleExpandJob(job.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="mr-4">
                                                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                                    <Link to={`/clients/${job.clientId}`} className="hover:text-primary">
                                                        {job.clientName}
                                                    </Link>
                                                    <div className="flex items-center ml-2">
                                                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                                        <span className="ml-0.5">{job.clientRating}</span>
                                                    </div>
                                                    {job.isBaseVerified && (
                                                        <div className="flex items-center ml-2 text-primary">
                                                            <BaseIcon className="w-3.5 h-3.5 mr-0.5" />
                                                            <span>Verified</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`flex items-center ${jobStatusInfo.bgColor} ${jobStatusInfo.textColor} text-xs px-2 py-1 rounded-full`}>
                                                {jobStatusInfo.icon}
                                                {jobStatusInfo.label}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center">
                                                <div className="flex-1">
                                                    <div className="h-2 bg-gray-200 rounded-full">
                                                        <div
                                                            className={cn(
                                                                "h-2 rounded-full",
                                                                job.progress >= 70 ? "bg-green-500" :
                                                                    job.progress >= 40 ? "bg-blue-500" : "bg-yellow-500"
                                                            )}
                                                            style={{ width: `${job.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="ml-2 text-sm font-medium text-gray-700">{job.progress}%</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap md:items-center gap-x-6 gap-y-2 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                {job.amountPaid} / {job.totalAmount} {job.currency}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                Due: {job.completionDate.split('-').reverse().join('/')}
                                            </div>

                                            {nextMilestone && (
                                                <div className="flex items-center text-blue-600 font-medium">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Next: {nextMilestone.title}
                                                </div>
                                            )}

                                            {job.unreadMessages > 0 && (
                                                <div className="flex items-center text-accent font-medium">
                                                    <MessageSquare className="w-4 h-4 mr-1" />
                                                    {job.unreadMessages} new messages
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {job.hasScreenpipeRecordings && (
                                                    <div className="flex items-center text-sm text-success">
                                                        <ScreenpipeIcon className="w-4 h-4 mr-1" />
                                                        <span>Work verification active</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-200">
                                            <div className="p-5">
                                                {/* Project Description */}
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Project Description</h4>
                                                <p className="text-sm text-gray-600 mb-6">
                                                    {job.description}
                                                </p>

                                                {/* Timeline */}
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Project Timeline</h4>
                                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                        <span>Started: {job.startDate.split('-').reverse().join('/')}</span>
                                                        <span>Due: {job.completionDate.split('-').reverse().join('/')}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full mb-2">
                                                        <div
                                                            className={cn(
                                                                "h-2 rounded-full",
                                                                job.progress >= 70 ? "bg-green-500" :
                                                                    job.progress >= 40 ? "bg-blue-500" : "bg-yellow-500"
                                                            )}
                                                            style={{ width: `${job.progress}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span>Time elapsed: {job.timeElapsed}</span>
                                                        <span>Time remaining: {job.remainingTime}</span>
                                                    </div>
                                                </div>

                                                {/* Milestones */}
                                                <div className="mb-6">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-3">Project Milestones</h4>
                                                    <div className="space-y-4">
                                                        {job.milestones.map(milestone => {
                                                            const statusInfo = getMilestoneStatusInfo(milestone.status);
                                                            return (
                                                                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <div>
                                                                            <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                                                                            <p className="text-sm text-gray-600 mt-1">
                                                                                {milestone.description}
                                                                            </p>
                                                                        </div>
                                                                        <div className={`${statusInfo.bgColor} ${statusInfo.textColor} text-xs px-2 py-1 rounded-full`}>
                                                                            {statusInfo.label}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex flex-wrap items-center justify-between text-sm">
                                                                        <div className="space-x-4">
                                                                            <span className="inline-flex items-center text-gray-600">
                                                                                <DollarSign className="w-3.5 h-3.5 mr-1" />
                                                                                {milestone.amount} {job.currency}
                                                                            </span>
                                                                            <span className="inline-flex items-center text-gray-600">
                                                                                <Calendar className="w-3.5 h-3.5 mr-1" />
                                                                                Due: {milestone.dueDate.split('-').reverse().join('/')}
                                                                            </span>
                                                                        </div>

                                                                        {milestone.status === 'in-progress' && (
                                                                            <div className="flex mt-3 sm:mt-0 space-x-3">
                                                                                <button
                                                                                    onClick={() => handleSubmitMilestone(job.id, milestone.id)}
                                                                                    className="inline-flex items-center px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90"
                                                                                >
                                                                                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                                                                                    Submit Work
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleRequestExtension(job.id, milestone.id)}
                                                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50"
                                                                                >
                                                                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                                                    Request Extension
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                        {milestone.status === 'completed' && (
                                                                            <div className="inline-flex items-center text-green-600">
                                                                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                                                                Completed on {milestone.submissionDate?.split('-').reverse().join('/')}
                                                                            </div>
                                                                        )}

                                                                        {milestone.status === 'under-review' && (
                                                                            <div className="inline-flex items-center text-yellow-600">
                                                                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                                                Under client review
                                                                            </div>
                                                                        )}

                                                                        {milestone.status === 'rejected' && milestone.feedback && (
                                                                            <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded-md">
                                                                                <strong>Feedback:</strong> {milestone.feedback}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-3 mt-6">
                                                    <Link to={`/messages/job/${job.id}`}>
                                                        <CustomButton variant={job.unreadMessages > 0 ? "accent" : "outline"} size="sm">
                                                            <MessageSquare className="w-4 h-4 mr-2" />
                                                            {job.unreadMessages > 0 ? `Messages (${job.unreadMessages})` : 'Messages'}
                                                        </CustomButton>
                                                    </Link>

                                                    <CustomButton
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStartScreenRecording(job.id)}
                                                    >
                                                        <ScreenpipeIcon className="w-4 h-4 mr-2" /> Record Work Session
                                                    </CustomButton>

                                                    <Link to={`/projects/${job.id}/deliverables`}>
                                                        <CustomButton variant="outline" size="sm">
                                                            <FileText className="w-4 h-4 mr-2" /> View Deliverables
                                                        </CustomButton>
                                                    </Link>

                                                    <Link to={`/projects/${job.id}/details`}>
                                                        <CustomButton variant="outline" size="sm">
                                                            <ExternalLink className="w-4 h-4 mr-2" /> View Project Details
                                                        </CustomButton>
                                                    </Link>

                                                    {job.status === 'dispute' && (
                                                        <Link to={`/projects/${job.id}/dispute`}>
                                                            <CustomButton variant="destructive" size="sm">
                                                                <AlertTriangle className="w-4 h-4 mr-2" /> Resolve Dispute
                                                            </CustomButton>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No active jobs found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm
                                    ? "No jobs match your search criteria"
                                    : statusFilter === 'all'
                                        ? "You don't have any active jobs at the moment"
                                        : statusFilter === 'in-progress'
                                            ? "You don't have any jobs in progress"
                                            : statusFilter === 'review'
                                                ? "You don't have any jobs under review"
                                                : "You don't have any jobs with issues"}
                            </p>
                            <Link to="/jobs">
                                <CustomButton>Find New Jobs</CustomButton>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Productivity Tips */}
                <div className="mt-8 bg-primary/5 rounded-lg border border-primary/20 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-1">Improve Your Workflow</h2>
                            <p className="text-gray-600 text-sm mb-4 md:mb-0">
                                Connect your productivity tools and get AI-powered insights
                            </p>
                        </div>
                        <Link to="/integrations">
                            <CustomButton variant="outline">
                                Connect Tools <ArrowRight className="w-4 h-4 ml-2" />
                            </CustomButton>
                        </Link>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <ScreenpipeIcon className="w-4 h-4 text-success mr-2" />
                                Work Verification
                            </h3>
                            <p className="text-xs text-gray-600">
                                Record your work sessions to build trust and verify your progress.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <BaseIcon className="w-4 h-4 text-primary mr-2" />
                                Smart Milestone Payments
                            </h3>
                            <p className="text-xs text-gray-600">
                                Automatically receive funds when milestones are approved.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <Bell className="w-4 h-4 text-accent mr-2" />
                                Deadline Reminders
                            </h3>
                            <p className="text-xs text-gray-600">
                                Get notifications before milestone deadlines to stay on track.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActiveJobs;