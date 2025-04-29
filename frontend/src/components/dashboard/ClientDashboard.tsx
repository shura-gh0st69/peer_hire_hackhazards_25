import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Edit,
  Plus,
  ArrowRight,
  MessageSquare,
  Users,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon, GroqIcon, ScreenpipeIcon } from '@/components/icons';
import { Progress } from '@/components/ui/progress';

interface ClientDashboardProps {
  dashboardData: {
    name?: string;
    activeJobs: number;
    totalSpent: number;
    escrowBalance: number;
    recentActivities: any[];
    pendingBids: any[];
  };
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ dashboardData }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'drafts' | 'bids'>('active');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return <ActiveJobs />;
      case 'completed':
        return <CompletedJobs />;
      case 'drafts':
        return <DraftJobs />;
      case 'bids':
        return <PendingBids bids={dashboardData.pendingBids} />;
      default:
        return <ActiveJobs />;
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 font-montserrat">Welcome, {dashboardData.name || 'Client'}</h1>
            <Link to="/post-job">
              <CustomButton
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Post a Job
              </CustomButton>
            </Link>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap">
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'active'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('active')}
                >
                  Active Jobs
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'bids'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('bids')}
                >
                  Pending Bids
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'completed'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed Jobs
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'drafts'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('drafts')}
                >
                  Drafts
                </button>
              </div>
            </div>

            <div className="p-4">
              {renderTabContent()}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 font-montserrat">Recent Activity</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activity.type === 'job-posted' ? 'bg-primary/10 text-primary' :
                      activity.type === 'bid-new' ? 'bg-primary/10 text-accent' :
                        activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                          activity.type === 'milestone' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                      }`}>
                      {activity.type === 'job-posted' && <Briefcase className="w-4 h-4" />}
                      {activity.type === 'bid-new' && <Users className="w-4 h-4" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4" />}
                      {activity.type === 'milestone' && <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <button className="text-primary hover:text-primary/80">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 font-montserrat">My Profile</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-xl mr-4">
                  AC
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Alex Chen</h3>
                  <p className="text-sm text-gray-600">TechInnovate LLC</p>
                  <div className="flex items-center mt-1">
                    <BaseIcon className="w-4 h-4 text-primary mr-1" />
                    <span className="text-xs text-gray-600">Verified Client</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-gray-900">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>

              <Link to="/profile">
                <CustomButton fullWidth variant="outline" size="sm">
                  Edit Profile
                </CustomButton>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 font-montserrat">Escrow Balance</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">In Escrow</p>
                  <p className="text-lg font-semibold text-gray-900">${dashboardData.escrowBalance}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Spent</p>
                  <p className="text-lg font-semibold text-gray-900">${dashboardData.totalSpent}</p>
                </div>
              </div>

              <Link to="/payments">
                <CustomButton fullWidth variant="outline" size="sm">
                  Manage Payments
                </CustomButton>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-accent/10 p-4 text-accent">
              <div className="flex items-center">
                <GroqIcon className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-medium">Groq AI Assistant</h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Groq can help write better job descriptions, evaluate proposals, and verify work quality.
              </p>
              <CustomButton fullWidth variant="accent" size="sm">
                Ask Groq AI
              </CustomButton>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-success/10 p-4 text-white">
              <div className="flex items-center">
                <ScreenpipeIcon className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-medium font-montserrat">Screenpipe</h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                View freelancer's work progress with Screenpipe screenshots and AI analysis.
              </p>
              <CustomButton fullWidth variant="success" size="sm">
                View Work Sessions
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveJobs = () => {
  return (
    <div>
      <div className="space-y-4">
        {[
          {
            title: "React Developer for Dashboard UI",
            posted: "1 week ago",
            applications: 12,
            hired: "Jane Doe",
            progress: 65,
            budget: "$3,500",
            deadline: "Oct 30, 2025"
          },
          {
            title: "Backend API Development",
            posted: "2 weeks ago",
            applications: 8,
            hired: "John Smith",
            progress: 40,
            budget: "$4,200",
            deadline: "Nov 15, 2025"
          }
        ].map((job, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900 font-montserrat">{job.title}</h3>
                <p className="text-sm text-gray-600">Freelancer: {job.hired}</p>
              </div>
              <div className="flex space-x-2">
                <Link to={`/jobs/${index}/details`}>
                  <CustomButton variant="outline" size="sm">
                    View Details
                  </CustomButton>
                </Link>
                <Link to={`/projects/${index}/milestones`}>
                  <CustomButton variant="primary" size="sm">
                    Track Progress
                  </CustomButton>
                </Link>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-2 bg-gradient-to-r from-[#0052FF] to-[#2563EB]" />
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="space-x-3">
                <span className="inline-flex items-center text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> {job.budget}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Due: {job.deadline}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <Users className="w-3.5 h-3.5 mr-1" /> {job.applications} applications
                </span>
              </div>
              <div className="flex space-x-2">
                <Link to={`/projects/${index}/screenshots`} className="text-success hover:text-success/80">
                  <ScreenpipeIcon className="w-4 h-4" />
                </Link>
                <Link to={`/messages/${index}`} className="text-primary hover:text-primary/80">
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PendingBids = ({ bids }: { bids: any[] }) => {
  return (
    <div>
      <div className="space-y-4">
        {bids.map((bid, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 font-montserrat">{bid.jobTitle}</h3>
                  <p className="text-sm text-gray-600">{bid.freelancer}</p>
                </div>
                <Link to={`/jobs/${index}/details`}>
                  <CustomButton variant="outline" size="sm">
                    View Job
                  </CustomButton>
                </Link>
              </div>

              <div className="flex justify-between items-start mt-4">
                <div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold">{bid.bid}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(bid.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">Delivery: {bid.delivery}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <CustomButton variant="outline" size="sm">
                    Message
                  </CustomButton>
                  <CustomButton variant="primary" size="sm">
                    Accept Bid
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompletedJobs = () => {
  return (
    <div>
      <div className="space-y-4">
        {[
          {
            title: "Logo Design for Startup",
            completed: "Aug 5, 2025",
            freelancer: "Sarah Johnson",
            payment: "$800",
            rating: 5
          },
          {
            title: "WordPress Website Development",
            completed: "July 20, 2025",
            freelancer: "Michael Brown",
            payment: "$2,200",
            rating: 4
          }
        ].map((job, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">Freelancer: {job.freelancer}</p>
              </div>
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Completed
              </div>
            </div>

            <div className="flex items-center mb-3">
              <p className="text-xs text-gray-600 mr-2">Your Rating:</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < job.rating ? 'fill-current' : ''}`} />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="space-x-3">
                <span className="inline-flex items-center text-gray-600">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Completed: {job.completed}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> {job.payment}
                </span>
              </div>
              <Link to={`/jobs/${index}/details`} className="text-primary hover:text-primary/80 text-xs font-medium">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DraftJobs = () => {
  return (
    <div>
      <div className="space-y-4">
        {[
          {
            title: "Social Media Manager",
            created: "Sept 15, 2025",
            budget: "$1,500-$2,500",
            category: "Marketing"
          },
          {
            title: "Mobile App UI Design",
            created: "Sept 10, 2025",
            budget: "$2,000-$3,000",
            category: "Design"
          }
        ].map((job, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">Category: {job.category}</p>
              </div>
              <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                Draft
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="space-x-3">
                <span className="inline-flex items-center text-gray-600">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Created: {job.created}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> {job.budget}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link to={`/edit-job/${index}`} className="text-primary hover:text-primary/80">
                  <Edit className="w-4 h-4" />
                </Link>
                <Link to={`/publish-job/${index}`} className="text-accent hover:text-accent/80">
                  <Upload className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
