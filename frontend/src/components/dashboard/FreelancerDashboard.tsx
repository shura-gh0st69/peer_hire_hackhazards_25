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
  FileText,
  Send,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { GroqIcon, ScreenpipeIcon, BaseIcon } from '@/components/icons';
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
  const [activeTab, setActiveTab] = useState<'recommended' | 'active-projects' | 'proposals' | 'completed' | 'drafts'>('recommended');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommended':
        return <RecommendedJobs jobs={dashboardData.recommendedJobs} />;
      case 'active-projects':
        return <ActiveProjects />;
      case 'proposals':
        return <Proposals />;
      case 'completed':
        return <CompletedProjects />;
      case 'drafts':
        return <DraftProposals />;
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
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
                      Pending Proposals
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
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Verification Score
                    </p>
                    <h3 className="text-2xl font-bold mt-1">85%</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <BaseIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-4 mb-6">
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
            <Link to="/proposals">
              <CustomButton
                fullWidth
                variant="outline"
                className="h-14 border-primary"
                leftIcon={<Send className="w-4 h-4" />}
              >
                My Proposals
              </CustomButton>
            </Link>
            <Link to="/projects">
              <CustomButton
                fullWidth
                variant="outline"
                className="h-14 border-primary"
                leftIcon={<Briefcase className="w-4 h-4" />}
              >
                Active Projects
              </CustomButton>
            </Link>
            <CustomButton
              fullWidth
              variant="success"
              className="h-14"
              leftIcon={<ScreenpipeIcon className="w-4 h-4" />}
            >
              Share Work Session
            </CustomButton>
          </div>

          {/* Jobs Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <div className="flex flex-wrap">
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
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'active-projects'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('active-projects')}
                >
                  Active Projects
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'proposals'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('proposals')}
                >
                  My Proposals
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'completed'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed Projects
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium text-center ${activeTab === 'drafts'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  onClick={() => setActiveTab('drafts')}
                >
                  Draft Proposals
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
          <GroqIcon className="w-5 h-5 text-accent mr-2" />
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
                <GroqIcon className="w-3 h-3 mr-1" />
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

const ActiveProjects = () => {
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
            nextMilestone: "Product Listings Page",
            dueInDays: 3,
            messages: 3,
            status: "In Progress"
          },
          {
            title: "Mobile App Development",
            client: "StartupXYZ",
            deadline: "Nov 15, 2025",
            payment: "$4,800",
            progress: 30,
            nextMilestone: "User Authentication",
            dueInDays: 5,
            messages: 0,
            status: "In Progress"
          },
          {
            title: "React Developer for Dashboard UI",
            client: "Tech Innovations",
            deadline: "April 30, 2025",
            payment: "$2,800",
            progress: 92,
            nextMilestone: "Final UI Components",
            dueInDays: 0,
            messages: 2,
            status: "In Progress"
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
            
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-primary mr-2" />
                  <div>
                    <p className="text-xs text-gray-600">Next Milestone</p>
                    <p className="text-sm font-medium">{job.nextMilestone}</p>
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  job.dueInDays === 0 ? "bg-red-100 text-red-700 font-bold" : 
                  job.dueInDays <= 2 ? "bg-red-100 text-red-700" : 
                  job.dueInDays <= 5 ? "bg-yellow-100 text-yellow-700" : 
                  "bg-green-100 text-green-700"
                }`}>
                  {job.dueInDays === 0 ? "Due TODAY!" : 
                   job.dueInDays === 1 ? "Due Tomorrow!" : 
                   `Due in ${job.dueInDays} Days`}
                </div>
              </div>
            </div>

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
                <button className="text-success hover:text-success/80">
                  <ScreenpipeIcon className="w-4 h-4" />
                </button>
                <button className="text-primary hover:text-primary/80">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <Link to={`/projects/${index}/submit-work`}>
                <CustomButton variant="accent" size="sm">
                  Submit Work
                </CustomButton>
              </Link>
              <Link to={`/projects/${index}/details`}>
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

const Proposals = () => {
  return (
    <div>
      <div className="space-y-4">
        {[
          {
            title: "React Native Mobile App",
            client: "Digital Innovations LLC",
            bidAmount: "$3,200",
            proposalDate: "April 25, 2025",
            status: "Pending",
            viewed: true
          },
          {
            title: "Frontend Dashboard Development",
            client: "Finance Tech Corp",
            bidAmount: "$2,800",
            proposalDate: "April 20, 2025",
            status: "Pending",
            viewed: false
          },
          {
            title: "E-commerce Site Redesign",
            client: "Retail Solutions Inc.",
            bidAmount: "$4,500",
            proposalDate: "April 15, 2025",
            status: "Under Review",
            viewed: true
          }
        ].map((proposal, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                <p className="text-sm text-gray-600">Client: {proposal.client}</p>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${proposal.status === "Pending" && !proposal.viewed ? "bg-yellow-100 text-yellow-700" :
                  proposal.status === "Pending" && proposal.viewed ? "bg-blue-100 text-blue-700" :
                    proposal.status === "Under Review" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                }`}>
                {proposal.status}
                {proposal.status === "Pending" && proposal.viewed && " (Viewed)"}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="space-x-4">
                <span className="inline-flex items-center text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> Bid: {proposal.bidAmount}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Submitted: {proposal.proposalDate}
                </span>
              </div>
              <div className="flex space-x-2">
                <Link to={`/proposals/${index}/edit`}>
                  <CustomButton variant="outline" size="sm">
                    Edit Proposal
                  </CustomButton>
                </Link>
                <Link to={`/proposals/${index}/details`}>
                  <CustomButton variant="primary" size="sm">
                    View Details
                  </CustomButton>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompletedProjects = () => {
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
              <Link to={`/projects/${index}/details`} className="text-primary hover:text-primary/80 text-xs font-medium">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DraftProposals = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Edit className="w-5 h-5 text-primary mr-2" />
          <p className="text-sm text-gray-600">Save your proposal drafts and edit them before submitting</p>
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
        {[
          {
            title: "WordPress E-commerce Store Development",
            client: "BetterRetail Inc.",
            bidAmount: "$3,800",
            saved: "April 26, 2025",
            coverLetter: "I have extensive experience building WordPress e-commerce stores...",
            attachments: 2
          },
          {
            title: "Mobile App UX/UI Redesign",
            client: "HealthTech Solutions",
            bidAmount: "$2,500",
            saved: "April 24, 2025",
            coverLetter: "I'm a UI/UX designer with 5+ years of experience in mobile app design...",
            attachments: 1
          },
          {
            title: "SEO Optimization Project",
            client: "GrowthMarketing Ltd.",
            bidAmount: "$1,800",
            saved: "April 22, 2025",
            coverLetter: "As an SEO specialist with a proven track record...",
            attachments: 3
          }
        ].map((draft, index) => (
          <div key={index} className="border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">{draft.title}</h3>
                <p className="text-sm text-gray-600">Client: {draft.client}</p>
              </div>
              <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                Draft
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded border border-gray-100 mb-3">
              <p className="text-xs text-gray-500 mb-1">Cover Letter Preview:</p>
              <p className="text-sm text-gray-700 line-clamp-2">{draft.coverLetter}</p>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div className="space-x-4">
                <span className="inline-flex items-center text-gray-600">
                  <DollarSign className="w-3.5 h-3.5 mr-1" /> Bid Amount: {draft.bidAmount}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <Calendar className="w-3.5 h-3.5 mr-1" /> Saved: {draft.saved}
                </span>
                <span className="inline-flex items-center text-gray-600">
                  <FileText className="w-3.5 h-3.5 mr-1" /> {draft.attachments} {draft.attachments === 1 ? 'attachment' : 'attachments'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link to={`/proposals/drafts/${index}/edit`}>
                  <CustomButton variant="primary" size="sm">
                    Edit & Submit
                  </CustomButton>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
