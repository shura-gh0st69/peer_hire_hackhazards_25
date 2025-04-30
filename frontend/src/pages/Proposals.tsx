import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Calendar,
    Clock,
    DollarSign,
    ArrowRight,
    MessageSquare,
    FileText,
    ExternalLink,
    Copy,
    Edit,
    Trash2,
    ChevronDown,
    Star
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { GroqIcon, BaseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Define interfaces
interface ProposalProps {
    id: string;
    jobId: string;
    jobTitle: string;
    clientName: string;
    clientId: string;
    clientRating?: number;
    bidAmount: string;
    deliveryTime: string;
    coverLetter: string;
    attachments?: string[];
    status: 'pending' | 'viewed' | 'shortlisted' | 'accepted' | 'rejected' | 'draft';
    submittedAt?: string;
    updatedAt?: string;
    baseVerified?: boolean;
    aiScore?: number;
    messages?: number;
    isBaseVerified?: boolean;
    timeSubmitted?: string;
}

// Mock data
const mockProposals: ProposalProps[] = [
    {
        id: 'p1',
        jobId: 'j1',
        jobTitle: 'React Frontend Developer for DeFi Dashboard',
        clientName: 'TechStart Inc.',
        clientId: 'c1',
        clientRating: 4.7,
        bidAmount: '$750',
        deliveryTime: '10 days',
        coverLetter: "I have extensive experience building DeFi dashboards with React and have integrated with protocols like Uniswap, Aave, and Compound. I can deliver a high-performance, responsive interface with real-time data visualization.",
        status: 'pending',
        submittedAt: '2025-04-28T10:30:00',
        baseVerified: true,
        aiScore: 92,
        isBaseVerified: true,
        timeSubmitted: '2 days ago'
    },
    {
        id: 'p2',
        jobId: 'j2',
        jobTitle: 'Smart Contract Developer for NFT Marketplace',
        clientName: 'NFT Innovations',
        clientId: 'c2',
        clientRating: 4.9,
        bidAmount: '$1,100',
        deliveryTime: '15 days',
        coverLetter: "As a smart contract developer with 5+ years of experience, I've developed multiple NFT marketplaces on Ethereum and Layer 2 solutions. I can ensure your contracts are secure, gas-efficient, and implement all the features you need for a successful marketplace.",
        status: 'viewed',
        submittedAt: '2025-04-26T14:15:00',
        baseVerified: true,
        messages: 2,
        isBaseVerified: true,
        timeSubmitted: '4 days ago'
    },
    {
        id: 'p3',
        jobId: 'j3',
        jobTitle: 'Backend Developer for Blockchain API',
        clientName: 'BlockFin Ltd.',
        clientId: 'c3',
        clientRating: 4.9,
        bidAmount: '$850',
        deliveryTime: '25 days',
        coverLetter: "I've built several high-performance APIs that interface with Ethereum, Binance Smart Chain, and Polygon. I can create a scalable solution that handles multiple blockchain networks efficiently.",
        status: 'shortlisted',
        submittedAt: '2025-04-29T09:45:00',
        aiScore: 85,
        isBaseVerified: false,
        timeSubmitted: '1 day ago'
    },
    {
        id: 'p4',
        jobId: 'j4',
        jobTitle: 'UI/UX Designer for Mobile Wallet App',
        clientName: 'Web3 Ventures',
        clientId: 'c4',
        clientRating: 4.6,
        bidAmount: '$680',
        deliveryTime: '14 days',
        coverLetter: "I specialize in crypto and fintech app UI/UX design and have worked on multiple wallet applications. I can create an interface that balances security features with ease of use.",
        status: 'accepted',
        submittedAt: '2025-04-20T11:00:00',
        updatedAt: '2025-04-22T13:20:00',
        baseVerified: true,
        isBaseVerified: true,
        timeSubmitted: '10 days ago'
    },
    {
        id: 'p5',
        jobId: 'j5',
        jobTitle: 'Full Stack Developer for DAO Platform',
        clientName: 'BlockFin Ltd.',
        clientId: 'c3',
        bidAmount: '$1,300',
        deliveryTime: '21 days',
        coverLetter: "Draft proposal for the DAO platform. Need to highlight my experience with React, Node.js, and smart contract integration.",
        status: 'draft',
        attachments: ['portfolio_dao.pdf', 'timeline_proposal.xlsx'],
        isBaseVerified: false
    },
    {
        id: 'p6',
        jobId: 'j6',
        jobTitle: 'Smart Contract Audit for Token',
        clientName: 'TechStart Inc.',
        clientId: 'c1',
        bidAmount: '$950',
        deliveryTime: '7 days',
        coverLetter: "I have performed over 20 token contract audits in the last year, finding critical vulnerabilities in 80% of them. My reports include detailed explanations and fix recommendations.",
        status: 'rejected',
        submittedAt: '2025-04-15T16:30:00',
        updatedAt: '2025-04-18T10:10:00',
        isBaseVerified: false,
        timeSubmitted: '15 days ago'
    }
];

const Proposals = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'drafts'>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('newest');
    const [expandedProposal, setExpandedProposal] = useState<string | null>(null);

    // Filter proposals based on active tab and search term
    const filteredProposals = mockProposals.filter(proposal => {
        const matchesTab =
            activeTab === 'all' ||
            (activeTab === 'pending' && (proposal.status === 'pending' || proposal.status === 'viewed' || proposal.status === 'shortlisted')) ||
            (activeTab === 'accepted' && proposal.status === 'accepted') ||
            (activeTab === 'rejected' && proposal.status === 'rejected') ||
            (activeTab === 'drafts' && proposal.status === 'draft');

        const matchesSearch =
            searchTerm === '' ||
            proposal.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proposal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proposal.coverLetter.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // Sort proposals
    const sortedProposals = [...filteredProposals].sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return new Date(b.submittedAt || '').getTime() - new Date(a.submittedAt || '').getTime();
            case 'oldest':
                return new Date(a.submittedAt || '').getTime() - new Date(b.submittedAt || '').getTime();
            case 'amount-high':
                return parseInt(b.bidAmount.replace(/[^0-9]/g, '')) - parseInt(a.bidAmount.replace(/[^0-9]/g, ''));
            case 'amount-low':
                return parseInt(a.bidAmount.replace(/[^0-9]/g, '')) - parseInt(b.bidAmount.replace(/[^0-9]/g, ''));
            default:
                return 0;
        }
    });

    const handleExpandProposal = (id: string) => {
        setExpandedProposal(expandedProposal === id ? null : id);
    };

    const handleDeleteProposal = (id: string) => {
        toast.success('Proposal deleted successfully');
        // Would delete the proposal in a real implementation
    };

    const handleWithdrawProposal = (id: string) => {
        toast.success('Proposal withdrawn successfully');
        // Would withdraw the proposal in a real implementation
    };

    const handleDuplicateProposal = (id: string) => {
        toast.success('Proposal duplicated as draft');
        // Would duplicate the proposal in a real implementation
    };

    const getStatusInfo = (status: ProposalProps['status']) => {
        switch (status) {
            case 'pending':
                return {
                    label: 'Pending Review',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-700'
                };
            case 'viewed':
                return {
                    label: 'Viewed by Client',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700'
                };
            case 'shortlisted':
                return {
                    label: 'Shortlisted',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700'
                };
            case 'accepted':
                return {
                    label: 'Accepted',
                    bgColor: 'bg-success/10',
                    textColor: 'text-success'
                };
            case 'rejected':
                return {
                    label: 'Not Selected',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-600'
                };
            case 'draft':
                return {
                    label: 'Draft',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-700'
                };
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Proposals</h1>
                        <p className="text-gray-600">Track and manage your job proposals</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link to="/jobs">
                            <CustomButton
                                leftIcon={<Search className="w-4 h-4" />}
                            >
                                Browse Jobs
                            </CustomButton>
                        </Link>
                    </div>
                </div>

                {/* Filters and Tabs */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    activeTab === 'all'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setActiveTab('all')}
                            >
                                All Proposals
                            </button>
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    activeTab === 'pending'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setActiveTab('pending')}
                            >
                                Active Proposals
                            </button>
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    activeTab === 'accepted'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setActiveTab('accepted')}
                            >
                                Accepted
                            </button>
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    activeTab === 'rejected'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setActiveTab('rejected')}
                            >
                                Not Selected
                            </button>
                            <button
                                className={cn(
                                    "py-3 px-4 text-sm font-medium whitespace-nowrap",
                                    activeTab === 'drafts'
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                                onClick={() => setActiveTab('drafts')}
                            >
                                Drafts
                            </button>
                        </div>
                    </div>

                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="w-full sm:max-w-md relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search proposals..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div className="flex items-center self-end sm:self-auto">
                                <span className="text-sm text-gray-700 mr-2 whitespace-nowrap">Sort by:</span>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="amount-high">Amount: High to Low</option>
                                    <option value="amount-low">Amount: Low to High</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Proposal Tips */}
                {activeTab !== 'drafts' && (
                    <div className="bg-accent/5 border border-accent/10 rounded-lg p-4 mb-6 flex items-start">
                        <GroqIcon className="w-6 h-6 text-accent mt-1 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Improving Your Proposal Success</h3>
                            <p className="text-sm text-gray-600 mt-1 mb-4">
                                Based on your proposal history, clients respond better to proposals that highlight specific experience with similar projects.
                                Consider including 1-2 relevant portfolio links in your next proposal.
                            </p>
                            <Link to="/proposals/ai-tips">
                                <CustomButton variant="accent" size="sm">
                                    Get AI Proposal Tips
                                </CustomButton>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Proposal List */}
                <div className="space-y-4">
                    {sortedProposals.length > 0 ? (
                        sortedProposals.map((proposal) => {
                            const statusInfo = getStatusInfo(proposal.status);
                            const isExpanded = expandedProposal === proposal.id;

                            return (
                                <div
                                    key={proposal.id}
                                    className={cn(
                                        "bg-white rounded-lg border shadow-sm overflow-hidden transition-all",
                                        proposal.status === 'accepted' ? "border-success/30" : "border-gray-200",
                                        isExpanded ? "shadow-md" : ""
                                    )}
                                >
                                    {/* Proposal Header */}
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() => handleExpandProposal(proposal.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="mr-4">
                                                <Link to={`/jobs/${proposal.jobId}`} className="hover:text-primary">
                                                    <h3 className="text-lg font-medium text-gray-900">{proposal.jobTitle}</h3>
                                                </Link>
                                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                                    <Link to={`/clients/${proposal.clientId}`} className="hover:text-primary">
                                                        {proposal.clientName}
                                                    </Link>
                                                    {proposal.clientRating && (
                                                        <div className="flex items-center ml-2">
                                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                                            <span className="ml-0.5">{proposal.clientRating}</span>
                                                        </div>
                                                    )}
                                                    {proposal.isBaseVerified && (
                                                        <div className="flex items-center ml-2 text-primary">
                                                            <BaseIcon className="w-3.5 h-3.5 mr-0.5" />
                                                            <span>Verified</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`${statusInfo.bgColor} ${statusInfo.textColor} text-xs px-2 py-1 rounded-full`}>
                                                {statusInfo.label}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap md:items-center gap-x-6 gap-y-2 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                Bid: {proposal.bidAmount}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="w-4 h-4 mr-1" />
                                                Delivery: {proposal.deliveryTime}
                                            </div>
                                            {proposal.submittedAt && (
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    Submitted: {proposal.timeSubmitted}
                                                </div>
                                            )}
                                            {proposal.messages && (
                                                <div className="flex items-center text-accent font-medium">
                                                    <MessageSquare className="w-4 h-4 mr-1" />
                                                    {proposal.messages} new messages
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center">
                                                {proposal.aiScore && (
                                                    <div className="flex items-center mr-4 text-sm">
                                                        <GroqIcon className="w-4 h-4 text-accent mr-1" />
                                                        <span className="font-medium">{proposal.aiScore}% Match</span>
                                                    </div>
                                                )}
                                                {proposal.attachments && (
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <FileText className="w-4 h-4 mr-1" />
                                                        {proposal.attachments.length} attachment{proposal.attachments.length !== 1 && 's'}
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
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                                                <p className="text-sm text-gray-600 whitespace-pre-line mb-4">
                                                    {proposal.coverLetter}
                                                </p>

                                                {proposal.attachments && proposal.attachments.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {proposal.attachments.map((attachment, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center bg-gray-100 text-sm text-gray-700 px-3 py-1.5 rounded-full"
                                                                >
                                                                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                                                                    {attachment}
                                                                    <button className="ml-2 text-gray-500 hover:text-gray-700">
                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-3 mt-6">
                                                    {proposal.status === 'draft' ? (
                                                        <>
                                                            <Link to={`/proposals/${proposal.id}/edit`}>
                                                                <CustomButton>Edit & Submit</CustomButton>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteProposal(proposal.id)}
                                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                                                            >
                                                                Delete Draft
                                                            </button>
                                                        </>
                                                    ) : proposal.status === 'accepted' ? (
                                                        <Link to={`/projects/${proposal.jobId}`}>
                                                            <CustomButton>View Project</CustomButton>
                                                        </Link>
                                                    ) : (proposal.status === 'pending' || proposal.status === 'viewed' || proposal.status === 'shortlisted') && (
                                                        <>
                                                            <Link to={`/proposals/${proposal.id}/edit`}>
                                                                <CustomButton variant="outline" size="sm">
                                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                                </CustomButton>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleWithdrawProposal(proposal.id)}
                                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                                                            >
                                                                Withdraw Proposal
                                                            </button>
                                                        </>
                                                    )}

                                                    {proposal.status !== 'draft' && (
                                                        <Link to={`/messages/job/${proposal.jobId}`}>
                                                            <CustomButton variant={proposal.messages ? "accent" : "outline"} size="sm">
                                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                                {proposal.messages ? `Messages (${proposal.messages})` : 'Send Message'}
                                                            </CustomButton>
                                                        </Link>
                                                    )}

                                                    <button
                                                        onClick={() => handleDuplicateProposal(proposal.id)}
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center"
                                                    >
                                                        <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                    </button>

                                                    <Link to={`/jobs/${proposal.jobId}`}>
                                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center">
                                                            <ExternalLink className="w-4 h-4 mr-2" /> View Job
                                                        </button>
                                                    </Link>
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
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm
                                    ? "No proposals match your search criteria"
                                    : activeTab === 'all'
                                        ? "You haven't submitted any proposals yet"
                                        : activeTab === 'pending'
                                            ? "You don't have any active proposals"
                                            : activeTab === 'accepted'
                                                ? "None of your proposals have been accepted yet"
                                                : activeTab === 'rejected'
                                                    ? "None of your proposals have been rejected"
                                                    : "You don't have any draft proposals"}
                            </p>
                            <Link to="/jobs">
                                <CustomButton>Browse Jobs</CustomButton>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Proposals;
