import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    Github,
    Globe,
    ArrowRight,
    CheckCircle,
    Calendar,
    Star,
    DollarSign,
    Briefcase,
    Filter,
    X,
    FileText
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon, ScreenpipeIcon, GroqIcon } from '@/components/icons';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PortfolioItemProps {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    projectUrl?: string;
    githubUrl?: string;
    technologies: string[];
    category: string;
    completionDate: string;
    verifiedByBase?: boolean;
    screenpipeRecordings?: number;
    hasTestimonial?: boolean;
    featured?: boolean;
    clientName?: string;
    clientRating?: number;
}

const mockPortfolioItems: PortfolioItemProps[] = [
    {
        id: '1',
        title: 'DeFi Exchange Dashboard',
        description: 'A comprehensive dashboard for a decentralized exchange with real-time data visualization, trading interface, and wallet integration.',
        thumbnailUrl: 'https://i.pravatar.cc/400?img=12',
        projectUrl: 'https://project-example.com',
        githubUrl: 'https://github.com/example/defi-dashboard',
        technologies: ['React', 'TypeScript', 'Web3.js', 'TailwindCSS', 'Chart.js'],
        category: 'Web Development',
        completionDate: 'March 2025',
        verifiedByBase: true,
        screenpipeRecordings: 3,
        hasTestimonial: true,
        featured: true,
        clientName: 'DeFi Protocol',
        clientRating: 5
    },
    {
        id: '2',
        title: 'NFT Marketplace UI',
        description: 'A modern, responsive user interface for an NFT marketplace with filtering, search, and bidding features.',
        thumbnailUrl: 'https://i.pravatar.cc/400?img=22',
        projectUrl: 'https://nft-marketplace-example.com',
        technologies: ['React', 'Next.js', 'Ethers.js', 'TailwindCSS'],
        category: 'UI/UX Design',
        completionDate: 'January 2025',
        verifiedByBase: true,
        hasTestimonial: false,
        featured: false,
        clientName: 'NFT Innovations',
        clientRating: 4.7
    },
    {
        id: '3',
        title: 'Smart Contract Security Audit',
        description: 'Comprehensive security audit of ERC-20 and ERC-721 token contracts, with vulnerability assessment and remediation recommendations.',
        thumbnailUrl: 'https://i.pravatar.cc/400?img=33',
        githubUrl: 'https://github.com/example/token-audit',
        technologies: ['Solidity', 'Hardhat', 'Slither', 'Mythril'],
        category: 'Smart Contract Development',
        completionDate: 'February 2025',
        verifiedByBase: true,
        screenpipeRecordings: 1,
        hasTestimonial: true,
        featured: true,
        clientName: 'Crypto Ventures',
        clientRating: 5
    },
    {
        id: '4',
        title: 'Crypto Wallet App',
        description: 'Mobile application for managing cryptocurrency assets with secure key storage, transaction history, and portfolio tracking.',
        thumbnailUrl: 'https://i.pravatar.cc/400?img=44',
        projectUrl: 'https://crypto-wallet-example.com',
        technologies: ['React Native', 'Redux', 'Ethers.js', 'Bitcore'],
        category: 'Mobile Development',
        completionDate: 'December 2024',
        screenpipeRecordings: 2,
        hasTestimonial: false,
        featured: false,
        clientName: 'Tech Solutions Inc.',
        clientRating: 4.9
    }
];

const Portfolio = () => {
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItemProps[]>(mockPortfolioItems);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isAnalyzeOpen, setIsAnalyzeOpen] = useState<boolean>(true);

    const categories = ['all', ...Array.from(new Set(portfolioItems.map(item => item.category)))];

    // Filter portfolio items based on selected category and search query
    const filteredItems = portfolioItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesVerification = !showVerifiedOnly || item.verifiedByBase;
        const matchesSearch = searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesVerification && matchesSearch;
    });

    const handleDeleteItem = (id: string) => {
        if (window.confirm('Are you sure you want to delete this portfolio item?')) {
            setPortfolioItems(prev => prev.filter(item => item.id !== id));
            toast.success('Portfolio item deleted');
        }
    };

    const handleToggleFeatured = (id: string) => {
        setPortfolioItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, featured: !item.featured }
                    : item
            )
        );
        toast.success('Featured status updated');
    };

    const closeAnalysis = () => {
        setIsAnalyzeOpen(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-16 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Portfolio</h1>
                        <p className="text-gray-600">Showcase your best work to attract potential clients</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <CustomButton
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Add New Project
                        </CustomButton>
                    </div>
                </div>

                {/* AI Portfolio Analysis Panel */}
                {isAnalyzeOpen && (
                    <div className="bg-accent/5 rounded-lg border border-accent/20 p-4 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex">
                                <GroqIcon className="w-6 h-6 text-accent mt-1 mr-3" />
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-1">Portfolio Analysis</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Based on current market trends, your portfolio is strong in Web Development but lacks Mobile Development examples.
                                        Consider adding 1-2 mobile app projects to attract 40% more mobile development jobs.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <div className="bg-white px-2 py-1 rounded-full text-xs border border-gray-200 flex items-center">
                                            <span className="font-medium mr-1">Web Development:</span> Strong
                                            <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                                        </div>
                                        <div className="bg-white px-2 py-1 rounded-full text-xs border border-gray-200 flex items-center">
                                            <span className="font-medium mr-1">Smart Contracts:</span> Sufficient
                                            <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                                        </div>
                                        <div className="bg-white px-2 py-1 rounded-full text-xs border border-gray-200 flex items-center">
                                            <span className="font-medium mr-1">Mobile Development:</span> Needs more
                                            <X className="w-3 h-3 text-red-500 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeAnalysis}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={cn(
                                                "px-3 py-1 rounded-lg text-sm font-medium",
                                                selectedCategory === category
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            )}
                                        >
                                            {category === 'all' ? 'All Projects' : category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input
                                        id="verified-only"
                                        type="checkbox"
                                        checked={showVerifiedOnly}
                                        onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <label htmlFor="verified-only" className="ml-2 text-sm text-gray-700 flex items-center">
                                        <BaseIcon className="w-4 h-4 text-primary mr-1" />
                                        Base Verified Only
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Filter className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Portfolio Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "bg-white rounded-lg border shadow-sm overflow-hidden transform transition-all hover:shadow-md",
                                    item.featured ? "border-primary/50 ring-1 ring-primary/20" : "border-gray-200"
                                )}
                            >
                                {/* Project Image */}
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {item.featured && (
                                        <div className="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                                            Featured
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/70 to-transparent p-3">
                                        <h3 className="font-medium text-white">{item.title}</h3>
                                        <p className="text-white/80 text-sm">{item.category}</p>
                                    </div>
                                </div>

                                {/* Project Details */}
                                <div className="p-4 border-b border-gray-100">
                                    <p className="text-sm text-gray-600 line-clamp-2 h-10">{item.description}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {item.technologies.slice(0, 4).map((tech, idx) => (
                                            <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-700">
                                                {tech}
                                            </span>
                                        ))}
                                        {item.technologies.length > 4 && (
                                            <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-700">
                                                +{item.technologies.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Project Metadata */}
                                <div className="p-4 bg-gray-50 text-xs text-gray-600">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <Calendar className="w-3.5 h-3.5 mr-1" />
                                            <span>Completed {item.completionDate}</span>
                                        </div>
                                        {item.verifiedByBase && (
                                            <div className="flex items-center text-primary">
                                                <BaseIcon className="w-3.5 h-3.5 mr-1" />
                                                <span>Verified</span>
                                            </div>
                                        )}
                                    </div>

                                    {item.clientName && (
                                        <div className="flex items-center">
                                            <Briefcase className="w-3.5 h-3.5 mr-1" />
                                            <span className="mr-2">Client: {item.clientName}</span>
                                            {item.clientRating && (
                                                <div className="flex items-center">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span className="ml-1">{item.clientRating}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {item.screenpipeRecordings && (
                                        <div className="flex items-center mt-1">
                                            <ScreenpipeIcon className="w-3.5 h-3.5 mr-1 text-success" />
                                            <span>{item.screenpipeRecordings} work recordings available</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="p-3 border-t border-gray-200 flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        {item.projectUrl && (
                                            <a
                                                href={item.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded"
                                            >
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}
                                        {item.githubUrl && (
                                            <a
                                                href={item.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded"
                                            >
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleToggleFeatured(item.id)}
                                            className={`p-1.5 hover:bg-gray-100 rounded ${item.featured ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
                                        >
                                            <Star className={`w-4 h-4 ${item.featured ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link to={`/portfolio/edit/${item.id}`}>
                                            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 rounded">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Empty state
                    <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery
                                ? "No items match your search criteria"
                                : selectedCategory !== 'all'
                                    ? `No items in the "${selectedCategory}" category`
                                    : showVerifiedOnly
                                        ? "No verified items found"
                                        : "Add your first portfolio item to showcase your skills"}
                        </p>
                        <CustomButton
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setShowVerifiedOnly(false);
                            }}
                        >
                            Clear Filters
                        </CustomButton>
                    </div>
                )}

                {/* Profile Completion Tips */}
                <div className="mt-8 bg-primary/5 rounded-lg border border-primary/20 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-1">Complete Your Profile</h2>
                            <p className="text-gray-600 text-sm mb-4 md:mb-0">
                                Profiles with verified portfolios receive 3.5x more client invitations
                            </p>
                        </div>
                        <Link to="/profile">
                            <CustomButton variant="outline">
                                Edit Profile <ArrowRight className="w-4 h-4 ml-2" />
                            </CustomButton>
                        </Link>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <BaseIcon className="w-4 h-4 text-primary mr-2" />
                                Verify Your Work
                            </h3>
                            <p className="text-xs text-gray-600">
                                Connect with Base wallet to verify project ownership and earn client trust.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <ScreenpipeIcon className="w-4 h-4 text-success mr-2" />
                                Add Work Recordings
                            </h3>
                            <p className="text-xs text-gray-600">
                                Share Screenpipe recordings to demonstrate your work process and expertise.
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                <GroqIcon className="w-4 h-4 text-accent mr-2" />
                                Optimize with AI
                            </h3>
                            <p className="text-xs text-gray-600">
                                Get project description recommendations to attract your ideal clients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* For actual implementation, this would be a proper modal component */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add New Portfolio Item</h2>
                        <p className="text-gray-600 mb-4">This would be a form to add a new portfolio item</p>
                        <div className="flex justify-end space-x-3">
                            <CustomButton
                                variant="outline"
                                onClick={() => setIsAddModalOpen(false)}
                            >
                                Cancel
                            </CustomButton>
                            <CustomButton onClick={() => {
                                setIsAddModalOpen(false);
                                toast.success('Portfolio item added');
                                // Would add the new item to the list in a real implementation
                            }}>
                                Add Item
                            </CustomButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
