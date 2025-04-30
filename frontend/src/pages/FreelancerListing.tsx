import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, List, LayoutGrid, Bookmark, ChevronLeft, ChevronRight, Users, Briefcase, DollarSign } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { GroqIcon, BaseIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

interface Freelancer {
    id: string;
    name: string;
    title: string;
    skills: string[];
    hourlyRate: number;
    rating: number;
    completedProjects: number;
    location: string;
    availability: string;
    lastActive: string;
    verifiedByBase?: boolean;
    totalEarned?: number;
}

const FreelancerListing = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [savedFreelancers, setSavedFreelancers] = useState<string[]>([]);

    // Mock data - replace with actual API call
    const freelancers: Freelancer[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            title: 'Senior Full Stack Developer',
            skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
            hourlyRate: 85,
            rating: 4.9,
            completedProjects: 32,
            location: 'Remote',
            availability: 'Full-time',
            lastActive: '2 hours ago',
            verifiedByBase: true,
            totalEarned: 45000
        },
        {
            id: '2',
            name: 'Michael Chen',
            title: 'Smart Contract Developer',
            skills: ['Solidity', 'Hardhat', 'EthersJS', 'React'],
            hourlyRate: 95,
            rating: 4.8,
            completedProjects: 28,
            location: 'Remote',
            availability: 'Part-time',
            lastActive: '1 day ago',
            verifiedByBase: true,
            totalEarned: 38000
        },
        {
            id: '3',
            name: 'Emily Rodriguez',
            title: 'UI/UX Designer & Developer',
            skills: ['Figma', 'React', 'TailwindCSS', 'Next.js'],
            hourlyRate: 75,
            rating: 4.7,
            completedProjects: 45,
            location: 'Remote',
            availability: 'Full-time',
            lastActive: '3 hours ago',
            verifiedByBase: true,
            totalEarned: 52000
        }
    ];

    const handleSaveFreelancer = (freelancerId: string) => {
        setSavedFreelancers(prev =>
            prev.includes(freelancerId)
                ? prev.filter(id => id !== freelancerId)
                : [...prev, freelancerId]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins">
            <div className="flex flex-col md:flex-row justify-between items-start pt-32 md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Talented Freelancers</h1>
                    <p className="text-gray-600">Browse verified professionals for your projects</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <CustomButton
                        leftIcon={<GroqIcon className="w-4 h-4" />}
                        variant="accent"
                    >
                        Get AI Recommendations
                    </CustomButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
                        <div className="p-4 border-b border-gray-200">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <span className="font-medium text-gray-900">Filters</span>
                                <Filter className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {filterOpen && (
                            <div className="p-4 space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Hourly Rate</h3>
                                    <div className="space-y-2">
                                        {['$0-$50', '$50-$100', '$100-$150', '$150+'].map((rate, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <input
                                                    id={`rate-${idx}`}
                                                    type="checkbox"
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <label htmlFor={`rate-${idx}`} className="ml-2 text-sm text-gray-600">
                                                    {rate}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                                    <div className="space-y-2">
                                        {['React', 'Solidity', 'Node.js', 'TypeScript', 'Smart Contracts'].map((skill, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <input
                                                    id={`skill-${idx}`}
                                                    type="checkbox"
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <label htmlFor={`skill-${idx}`} className="ml-2 text-sm text-gray-600">
                                                    {skill}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
                                    <div className="space-y-2">
                                        {['Full-time', 'Part-time', 'Hourly'].map((time, idx) => (
                                            <div key={idx} className="flex items-center">
                                                <input
                                                    id={`time-${idx}`}
                                                    type="checkbox"
                                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <label htmlFor={`time-${idx}`} className="ml-2 text-sm text-gray-600">
                                                    {time}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Verification</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                id="base-verified"
                                                type="checkbox"
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                            <label htmlFor="base-verified" className="ml-2 text-sm text-gray-600 flex items-center">
                                                <BaseIcon className="w-4 h-4 text-primary mr-1" />
                                                Base Verified
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <CustomButton
                                        variant="primary"
                                        size="sm"
                                        fullWidth
                                    >
                                        Apply Filters
                                    </CustomButton>
                                    <CustomButton
                                        variant="outline"
                                        size="sm"
                                    >
                                        Clear
                                    </CustomButton>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6 p-4">
                        <div className="flex items-start">
                            <GroqIcon className="w-5 h-5 text-accent mr-3 mt-0.5" />
                            <div>
                                <h3 className="font-medium text-gray-900">AI Talent Assistant</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    Let Groq find the perfect freelancers based on your project requirements.
                                </p>
                                <CustomButton
                                    variant="accent"
                                    size="sm"
                                    className="mt-3"
                                >
                                    Ask Groq AI
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search freelancers by name, skills, or expertise..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                        </div>

                        {/* View Controls */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                                    <span className="font-medium text-gray-900">{freelancers.length}</span> freelancers found
                                </p>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={cn(
                                                "p-1.5 rounded-l-md",
                                                viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'
                                            )}
                                        >
                                            <List className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={cn(
                                                "p-1.5 rounded-r-md border-l border-gray-300",
                                                viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'
                                            )}
                                        >
                                            <LayoutGrid className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                                        <select className="border border-gray-300 text-gray-700 text-sm rounded-md focus:outline-none focus:ring-primary focus:border-primary px-2 py-1">
                                            <option>Rating: High to Low</option>
                                            <option>Hourly Rate: Low to High</option>
                                            <option>Hourly Rate: High to Low</option>
                                            <option>Projects Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Freelancer List */}
                        <div className={cn(
                            viewMode === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6',
                            'p-6'
                        )}>
                            {freelancers.map((freelancer) => {
                                const isSaved = savedFreelancers.includes(freelancer.id);
                                return (
                                    <div
                                        key={freelancer.id}
                                        className="bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all overflow-hidden flex flex-col"
                                    >
                                        <div className="p-6 flex-grow">
                                            <div className="flex justify-between items-start mb-3">
                                                <Link to={`/freelancers/${freelancer.id}`} className="hover:text-primary flex-1 mr-4">
                                                    <h3 className="font-medium text-lg text-gray-900">{freelancer.name}</h3>
                                                    <p className="text-gray-600 text-sm mt-1">{freelancer.title}</p>
                                                </Link>
                                                <div className="flex flex-col items-end flex-shrink-0">
                                                    <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-2 whitespace-nowrap">
                                                        ${freelancer.hourlyRate}/hr
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {freelancer.skills.map((skill, idx) => (
                                                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                        <span className="ml-1">{freelancer.rating}</span>
                                                    </div>
                                                    <span className="flex items-center">
                                                        <Briefcase className="w-4 h-4 mr-1" />
                                                        {freelancer.completedProjects} projects
                                                    </span>
                                                    {freelancer.verifiedByBase && (
                                                        <span className="flex items-center text-primary">
                                                            <BaseIcon className="w-4 h-4 mr-1" />
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span>{freelancer.location}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="inline-flex items-center">
                                                    <DollarSign className="w-3.5 h-3.5 mr-1" />
                                                    ${freelancer.totalEarned?.toLocaleString()} earned
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <Link to={`/freelancers/${freelancer.id}`} className="text-primary hover:text-primary/80 text-sm font-medium">
                                                    View Profile
                                                </Link>
                                                <button
                                                    onClick={() => handleSaveFreelancer(freelancer.id)}
                                                    title={isSaved ? "Remove from saved" : "Save for later"}
                                                    className="text-gray-400 hover:text-primary p-1"
                                                >
                                                    <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary text-primary")} />
                                                </button>
                                            </div>
                                            <Link to={`/messages/new?freelancer=${freelancer.id}`}>
                                                <CustomButton size="sm">
                                                    Contact
                                                </CustomButton>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex justify-center p-4 border-t border-gray-200">
                            <nav className="flex items-center">
                                <button className="px-2 py-1 text-gray-500 hover:text-primary mr-2">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button className="px-3 py-1 text-white bg-primary rounded-md">1</button>
                                <button className="px-3 py-1 text-gray-500 hover:text-primary">2</button>
                                <button className="px-3 py-1 text-gray-500 hover:text-primary">3</button>
                                <button className="px-3 py-1 text-gray-500 hover:text-primary">4</button>
                                <button className="px-3 py-1 text-gray-500 hover:text-primary">5</button>
                                <button className="px-2 py-1 text-gray-500 hover:text-primary ml-2">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerListing;