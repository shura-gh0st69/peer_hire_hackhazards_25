import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { GroqIcon } from '@/components/icons';
import { UserIcon, CheckCircle, Calendar, AlertTriangle, FileTextIcon, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectDetails = () => {
  // In a real app, this would come from context/auth and route params
  const userType = 'client';
  const projectId = '1';

  // Mock project data
  const project = {
    id: projectId,
    title: 'React Frontend Development',
    freelancer: 'Jane Smith',
    status: 'in-progress',
    progress: 65,
    startDate: '2023-04-01',
    endDate: '2023-05-15',
    totalAmount: 1000,
    description: 'Building a responsive React frontend for our e-commerce platform. The project includes implementing user authentication, product listings, cart functionality, and checkout process.',
    milestones: [
      {
        id: 1,
        title: 'Initial Setup',
        description: 'Project setup, component architecture, and basic routing',
        completed: true,
        amount: 250,
        deadline: '2023-04-15',
        deliverables: ['Github repository', 'Component structure documentation'],
        verified: true
      },
      {
        id: 2,
        title: 'Core Features',
        description: 'Product listings, filtering, cart functionality',
        completed: true,
        amount: 500,
        deadline: '2023-04-30',
        deliverables: ['Working product page', 'Cart implementation'],
        verified: true
      },
      {
        id: 3,
        title: 'Final Delivery',
        description: 'Checkout, user profiles, and final polish',
        completed: false,
        amount: 250,
        deadline: '2023-05-15',
        deliverables: ['Complete application', 'Documentation'],
        verified: false
      }
    ]
  };

  // Find the next milestone that's not completed
  const nextMilestone = project.milestones.find(m => !m.completed);

  // Calculate days remaining until the next milestone deadline
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const differenceInTime = deadlineDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const daysRemaining = nextMilestone ? getDaysRemaining(nextMilestone.deadline) : 0;

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-primary/5 p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <div className="flex items-center mt-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-600">
                    {userType === 'client' ? 'Freelancer: ' : 'Client: '}
                    <span className="font-medium text-gray-900">{project.freelancer}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CustomButton
                  variant="outline"
                  size="sm"
                  leftIcon={<MessageSquare className="w-4 h-4" />}
                >
                  Message
                </CustomButton>
                <CustomButton
                  leftIcon={<FileTextIcon className="w-4 h-4" />}
                >
                  View Contract
                </CustomButton>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Project Overview</h2>
                <p className="text-gray-700 mb-4">{project.description}</p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Overall Progress</span>
                    <span className="text-gray-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {nextMilestone && (
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      Next Milestone: {nextMilestone.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{nextMilestone.description}</p>

                    <div className="mt-3 flex items-center">
                      <span className="text-sm font-medium">Deadline: </span>
                      <span className="text-sm ml-1">
                        {new Date(nextMilestone.deadline).toLocaleDateString()}
                      </span>

                      {daysRemaining <= 5 && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {daysRemaining === 0 ? 'Due today' : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Project Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date</span>
                      <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-medium">${project.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium capitalize">{project.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-accent/5 p-4 rounded-lg border border-accent/10">
                  <div className="flex items-start">
                    <GroqIcon className="w-5 h-5 text-accent mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Groq AI Insight</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        This project is on track. The freelancer has consistently delivered high-quality work ahead of deadlines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Milestones</h2>

            <div className="space-y-6">
              {project.milestones.map((milestone, index) => (
                <div key={milestone.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs mr-3 ${milestone.completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                      {milestone.completed && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${milestone.amount}</div>
                      <div className="text-xs text-gray-500">
                        Due: {new Date(milestone.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-700 text-sm mb-3">{milestone.description}</p>

                    <h4 className="text-sm font-medium text-gray-900 mb-2">Deliverables:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
                      {milestone.deliverables.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    {milestone.completed ? (
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          {milestone.verified ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Verified and paid
                            </span>
                          ) : (
                            <span className="text-yellow-600">Awaiting verification</span>
                          )}
                        </div>
                        {!milestone.verified && userType === 'client' && (
                          <Link to={`/work-verification/${milestone.id}`}>
                            <CustomButton size="sm">
                              Verify Work
                            </CustomButton>
                          </Link>
                        )}
                      </div>
                    ) : (
                      (
                        <div className="flex justify-end">
                          <CustomButton size="sm">
                            Submit Deliverables
                          </CustomButton>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
