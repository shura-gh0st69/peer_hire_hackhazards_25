import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    DollarSign,
    Users,
    Edit,
    Trash2,
    Eye,
    MessageSquare,
    Filter,
    Search,
    AlertTriangle
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { cn } from '@/lib/utils';

// Mock data - replace with actual API call
const postedJobs = [
    {
        id: '1',
        title: 'React Developer for Dashboard UI',
        status: 'active',
        applications: 12,
        budget: '3,500',
        posted: '2025-04-15',
        deadline: '2025-05-15',
        views: 245,
        description: 'Looking for an experienced React developer to build a modern dashboard interface...'
    },
    {
        id: '2',
        title: 'Smart Contract Developer',
        status: 'draft',
        applications: 0,
        budget: '4,200',
        posted: '2025-04-20',
        deadline: '2025-05-20',
        views: 0,
        description: 'Need a Solidity developer to create and audit smart contracts for our platform...'
    }
];

const PostedJobs = () => {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = postedJobs.filter(job => {
        if (filter !== 'all' && job.status !== filter) return false;
        if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="pt-28 flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Posted Jobs</h1>
                <Link to="/post-job">
                    <CustomButton>Post a New Job</CustomButton>
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium",
                                    filter === 'all'
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                All Jobs
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium",
                                    filter === 'active'
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter('completed')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium",
                                    filter === 'completed'
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Completed
                            </button>
                            <button
                                onClick={() => setFilter('draft')}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium",
                                    filter === 'draft'
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Drafts
                            </button>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="divide-y divide-gray-200">
                    {filteredJobs.map((job) => (
                        <div key={job.id} className="p-6 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="text-lg font-medium text-gray-900 hover:text-primary"
                                        >
                                            {job.title}
                                        </Link>
                                        <span className={cn(
                                            "text-xs px-2 py-1 rounded-full",
                                            job.status === 'active' ? "bg-green-100 text-green-700" :
                                                job.status === 'draft' ? "bg-gray-100 text-gray-700" :
                                                    "bg-blue-100 text-blue-700"
                                        )}>
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Link to={`/jobs/${job.id}/edit`}>
                                        <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </Link>
                                    {job.status === 'draft' && (
                                        <button className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Posted: {new Date(job.posted).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    Budget: ${job.budget}
                                </span>
                                <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {job.applications} applications
                                </span>
                                <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {job.views} views
                                </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Link to={`/jobs/${job.id}/applications`}>
                                    <CustomButton variant="outline" size="sm">
                                        View Applications
                                    </CustomButton>
                                </Link>
                                <Link to={`/jobs/${job.id}/messages`}>
                                    <CustomButton variant="outline" size="sm">
                                        Messages
                                    </CustomButton>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostedJobs;