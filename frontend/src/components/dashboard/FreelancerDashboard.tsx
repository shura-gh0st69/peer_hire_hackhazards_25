import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Briefcase,
  Clock,
  DollarSign,
  Star,
  Search,
  Filter,
  ArrowRight,
  MessageSquare,
  Check,
  Users,
  FileText
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { GrokIcon, ScreenpipeIcon, BaseIcon } from '@/components/icons';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FreelancerDashboardProps {
  dashboardData: {
    name?: string;
    ongoingProjects: number;
    activeApplications: number;
    totalEarnings: number;
    recentActivities: any[];
    recommendedJobs: any[];
  };
}

const FreelancerDashboard: React.FC<FreelancerDashboardProps> = ({ dashboardData }) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'active' | 'completed'>('recommended');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommended':
        return <RecommendedJobs jobs={dashboardData.recommendedJobs} />;
      case 'active':
        return <ActiveJobs />;
      case 'completed':
        return <CompletedJobs />;
      default:
        return <RecommendedJobs jobs={dashboardData.recommendedJobs} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {dashboardData.name || 'Freelancer'}</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ongoing Projects
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardData.ongoingProjects}</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Applications
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{dashboardData.activeApplications}</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Earnings
                    </p>
                    <h3 className="text-2xl font-bold mt-1 flex items-center">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {dashboardData.totalEarnings.toLocaleString()}
                    </h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Link to="/jobs">
              <CustomButton
                fullWidth
                variant="primary"
                className="h-14"
                leftIcon={<Search className="w-4 h-4" />}
              >
                Browse Jobs
              </CustomButton>
            </Link>
            <Link to="/jobs/new-bid">
              <CustomButton
                fullWidth
                variant="outline"
                className="h-14 border-primary"
                leftIcon={<Briefcase className="w-4 h-4" />}
              >
                Submit Bid
              </CustomButton>
            </Link>
            <CustomButton
              fullWidth
              variant="success"
              className="h-14"
              leftIcon={<ScreenpipeIcon className="w-4 h-4" />}
            >
              Share Screenshot
            </CustomButton>
          </div>

          {/* Jobs Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'recommended'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('recommended')}
                >
                  Recommended Jobs
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'active'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('active')}
                >
                  Active Bids
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
              </div>
            </div>

            <div className="p-4">
              {renderTabContent()}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${activity.type === 'job-application' ? 'bg-primary/10 text-primary' :
                      activity.type === 'bid-accepted' ? 'bg-green-100 text-green-600' :
                        activity.type === 'payment' ? 'bg-blue-100 text-blue-600' :
                          'bg-accent/10 text-accent'
                      }`}>
                      {activity.type === 'job-application' && <Briefcase className="w-4 h-4" />}
                      {activity.type === 'bid-accepted' && <Check className="w-4 h-4" />}
                      {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                      {activity.type === 'message' && <MessageSquare className="w-4 h-4" />}
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
      </div>
    </div>
  );
};

// Update RecommendedJobs to accept jobs as props
const RecommendedJobs = ({ jobs }: { jobs: any[] }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <GrokIcon className="w-5 h-5 text-accent mr-2" />
          <p className="text-sm text-gray-600">Jobs recommended by Grok based on your skills and work history</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">{job.title}</h3>
              <div className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full flex items-center">
                <GrokIcon className="w-3 h-3 mr-1" />
                {job.match}% Match
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {job.skills.map((skill: string, idx: number) => (
                <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="space-x-3">
                <span className="inline-flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> {job.budget}
                </span>
                <span className="inline-flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {job.posted}
                </span>
                <span className="inline-flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1" /> {job.bids} bids
                </span>
              </div>
              <Link to={`/jobs/${index}`} className="text-primary hover:text-primary/80 text-xs font-medium">
                Apply Now
              </Link>
            </div>
          </div>
        ))}
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
            title: "E-commerce Website Redesign",
            client: "Tech Solutions Inc.",
            deadline: "Oct 30, 2025",
            payment: "$3,500",
            progress: 65,
            messages: 3,
            status: "In Progress"
          },
          {
            title: "Mobile App Development",
            client: "StartupXYZ",
            deadline: "Nov 15, 2025",
            payment: "$4,800",
            progress: 30,
            messages: 0,
            status: "In Progress"
          },
          {
            title: "Portfolio Website Design",
            client: "John Smith",
            deadline: "Oct 20, 2025",
            payment: "$1,200",
            progress: 0,
            messages: 1,
            status: "Bid Accepted"
          }
        ].map((job, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">Client: {job.client}</p>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${job.status === "In Progress"
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent"
                }`}>
                {job.status}
              </div>
            </div>

            {job.progress > 0 && (
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{job.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${job.progress}%`,
                      background: 'linear-gradient(90deg, #0052FF, #2563EB)'
                    }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-xs">
              <div className="space-x-3">
                <span className="inline-flex items-center text-gray-600">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Due: {job.deadline}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> {job.payment}
                </span>
                {job.messages > 0 && (
                  <span className="inline-flex items-center text-accent font-medium">
                    <MessageSquare className="w-3.5 h-3.5 mr-1" /> {job.messages} new
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {job.status === "In Progress" && (
                  <button className="text-success hover:text-success/80">
                    <ScreenpipeIcon className="w-4 h-4" />
                  </button>
                )}
                <button className="text-primary hover:text-primary/80">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link to={`/jobs/${index}/details`}>
                <CustomButton variant="outline" size="sm">
                  View Details
                </CustomButton>
              </Link>
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
            title: "Portfolio Website Development",
            client: "John Smith",
            completed: "Aug 15, 2025",
            payment: "$2,200",
            rating: 5
          },
          {
            title: "Bug Fixes for React Application",
            client: "Tech Innovate LLC",
            completed: "July 28, 2025",
            payment: "$850",
            rating: 5
          }
        ].map((job, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600">Client: {job.client}</p>
              </div>
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Completed
              </div>
            </div>

            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < job.rating ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-xs text-gray-600">Client Rating</span>
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

export default FreelancerDashboard;
