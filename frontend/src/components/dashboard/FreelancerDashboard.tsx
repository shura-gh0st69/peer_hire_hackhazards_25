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

const ongoingProjectsCount = 2;
const activeApplicationsCount = 5;
const totalEarnings = 5850;

const FreelancerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'active' | 'completed'>('recommended');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'recommended':
        return <RecommendedJobs />;
      case 'active':
        return <ActiveJobs />;
      case 'completed':
        return <CompletedJobs />;
      default:
        return <RecommendedJobs />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, Jane Doe</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ongoing Projects
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{ongoingProjectsCount}</h3>
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
                    <h3 className="text-2xl font-bold mt-1">{activeApplicationsCount}</h3>
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
                      {totalEarnings.toLocaleString()}
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

          {/* Project Tracking Card */}
          <Card className="mb-6 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center">
                <GrokIcon className="w-5 h-5 text-accent mr-2" />
                Grok-Assisted Project Tracking
              </CardTitle>
              <CardDescription>AI insights on your current projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/10 mb-4">
                <p className="text-sm text-gray-700 flex items-start">
                  <span className="bg-accent/10 p-1 rounded-full mr-2 mt-0.5">
                    <GrokIcon className="w-3.5 h-3.5 text-accent" />
                  </span>
                  You're <span className="font-semibold text-accent">75%</span> through Milestone 1 of the "E-commerce Website Redesign" project. Based on your current pace, you're likely to complete ahead of schedule. The client has viewed your latest screenshots.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "E-commerce Website Redesign",
                    client: "Tech Solutions Inc.",
                    deadline: "Oct 30, 2025",
                    milestones: [
                      { name: "UI Design", progress: 75, deadline: "Oct 15, 2025" },
                      { name: "Frontend Implementation", progress: 0, deadline: "Oct 25, 2025" },
                      { name: "Testing & Deployment", progress: 0, deadline: "Oct 30, 2025" }
                    ]
                  },
                  {
                    title: "Mobile App Development",
                    client: "StartupXYZ",
                    deadline: "Nov 15, 2025",
                    milestones: [
                      { name: "Wireframes", progress: 100, deadline: "Oct 10, 2025" },
                      { name: "Core Functionality", progress: 30, deadline: "Oct 30, 2025" },
                      { name: "Polish & Submission", progress: 0, deadline: "Nov 15, 2025" }
                    ]
                  }
                ].map((project, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">Client: {project.client}</p>
                      </div>
                      <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due: {project.deadline}
                      </span>
                    </div>

                    <div className="mt-3 space-y-3">
                      {project.milestones.map((milestone, midx) => (
                        <div key={midx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 flex items-center">
                              {milestone.progress === 100 && (
                                <span className="bg-green-100 p-0.5 rounded-full mr-1.5">
                                  <Check className="w-3 h-3 text-green-600" />
                                </span>
                              )}
                              {milestone.name}
                            </span>
                            <span className="font-medium text-gray-900">{milestone.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${milestone.progress}%`,
                                background: 'linear-gradient(90deg, #0052FF, #2563EB)'
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-end mt-1">
                            <span className="text-xs text-gray-500">
                              Due: {milestone.deadline}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-4">
                      <CustomButton
                        variant="outline"
                        size="sm"
                        leftIcon={<ScreenpipeIcon className="w-3.5 h-3.5" />}
                        className="hover:text-success text-success border-success hover:bg-success/10"
                      >
                        Share Progress
                      </CustomButton>
                      <Link to={`/projects/${idx}`}>
                        <CustomButton variant="primary" size="sm">
                          View Project
                        </CustomButton>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[
                  {
                    type: 'job-application',
                    title: 'You applied for "React Developer" job',
                    time: '2 hours ago'
                  },
                  {
                    type: 'bid-accepted',
                    title: 'Your bid was accepted for "UI Design"',
                    time: 'Yesterday'
                  },
                  {
                    type: 'payment',
                    title: 'You received payment for "Mobile App"',
                    time: '3 days ago'
                  },
                  {
                    type: 'message',
                    title: 'New message from Alex Johnson',
                    time: '1 week ago'
                  }
                ].map((activity, index) => (
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

        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">My Profile</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl mr-4">
                  JD
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Jane Doe</h3>
                  <p className="text-sm text-gray-600">Senior Full Stack Developer</p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-2">5.0 (24 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <Link to="/profile">
                <CustomButton fullWidth variant="outline" size="sm">
                  Complete Profile
                </CustomButton>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Earnings</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Available</p>
                  <p className="text-lg font-semibold text-gray-900">$2,450</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">In Escrow</p>
                  <p className="text-lg font-semibold text-gray-900">$1,200</p>
                </div>
              </div>

              <Link to="/payments">
                <CustomButton fullWidth variant="outline" size="sm">
                  View Earnings
                </CustomButton>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-accent/10 p-4 text-accent">
              <div className="flex items-center">
                <GrokIcon className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-medium">Grok AI Assistant</h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Grok can help improve your bids, analyze contracts, and suggest optimizations for your profile.
              </p>
              <CustomButton fullWidth variant="accent" size="sm">
                Ask Grok AI
              </CustomButton>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-success/10 p-4 text-success">
              <div className="flex items-center">
                <ScreenpipeIcon className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-medium">Screenpipe</h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Share screenshots of your work progress to build trust with clients and verify your progress.
              </p>
              <CustomButton fullWidth variant="success" size="sm">
                Capture Work Session
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendedJobs = () => {
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
        {[
          {
            title: "React Developer for Financial Dashboard",
            description: "We need an experienced React developer to build a responsive dashboard with data visualization components.",
            budget: "$3,000-$5,000",
            skills: ["React", "TypeScript", "D3.js"],
            posted: "2 days ago",
            bids: 8,
            match: 95
          },
          {
            title: "Full Stack Developer for E-commerce Site",
            description: "Looking for a developer to build a modern e-commerce platform with React, Node.js, and PostgreSQL.",
            budget: "$4,000-$7,000",
            skills: ["React", "Node.js", "PostgreSQL"],
            posted: "1 week ago",
            bids: 12,
            match: 87
          },
          {
            title: "React Native Developer for Fitness App",
            description: "Need a mobile developer to create a fitness tracking app with user authentication and social features.",
            budget: "$5,000-$8,000",
            skills: ["React Native", "Firebase", "Redux"],
            posted: "3 days ago",
            bids: 5,
            match: 82
          }
        ].map((job, index) => (
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
              {job.skills.map((skill, idx) => (
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
