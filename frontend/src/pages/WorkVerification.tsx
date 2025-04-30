import React, { useState } from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { GroqIcon } from '@/components/icons';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, ArrowLeft, FileEdit, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const WorkVerification = () => {
  const navigate = useNavigate();
  const [isRequestingChanges, setIsRequestingChanges] = useState(false);
  const [changeRequest, setChangeRequest] = useState('');

  // In a real app, this would come from route params
  const milestoneId = '1';

  // Mock milestone data
  const milestone = {
    projectId: '123', // Added projectId
    freelancer: 'John Doe',
    title: 'Project Milestone 1',
    description: 'This is a description of the milestone work.',
    deliverables: [
      {
        id: 1,
        type: 'repository',
        title: 'GitHub Repository',
        link: 'https://github.com/example/project'
      },
      {
        id: 2,
        type: 'demo',
        title: 'Live Demo',
        link: 'https://example.com/demo'
      },
      {
        id: 3,
        type: 'document',
        title: 'Documentation',
        link: 'https://example.com/docs'
      },
      {
        id: 4,
        type: 'screenshot',
        title: 'Product Listing Screenshot',
        image: 'https://placehold.co/600x400?text=Product+Listing'
      },
      {
        id: 5,
        type: 'screenshot',
        title: 'Shopping Cart Screenshot',
        image: 'https://placehold.co/600x400?text=Shopping+Cart'
      }
    ],
    submittedOn: '2023-04-28',
    baseVerified: true,
    message: "I've completed all the core features as requested. The product listing page includes filtering by category, price range, and search functionality. The shopping cart has add/remove items and quantity adjustment features. Let me know if you need any adjustments!",
    amount: 1500
  };

  // Mock Groq verification data
  const groqVerification = {
    score: 95,
    issues: [],
    positives: [
      'All features implemented as specified',
      'Code quality is excellent with proper documentation',
      'UI matches the design requirements'
    ],
    timestamp: '2023-04-29T10:15:00Z'
  };

  const handleApproveWork = () => {
    // In a real app, API call to approve work and release payment
    toast.success('Work approved! Payment will be released to the freelancer.');
    navigate(`/projects/${milestone.projectId}`);
  };

  const handleDisputeWork = () => {
    // In a real app, API call to initiate dispute
    toast.info('Dispute has been initiated. Our team will review the case.');
    navigate(`/projects/${milestone.projectId}`);
  };

  const handleRequestChanges = () => {
    if (!changeRequest.trim()) {
      toast.error('Please provide details about the requested changes.');
      return;
    }

    // In a real app, API call to request changes
    toast.success('Change request has been sent to the freelancer.');
    navigate(`/projects/${milestone.projectId}`);
  };

  // Calculate verification progress
  const verificationSteps = [
    { step: 'Submission', completed: true },
    { step: 'Base Verification', completed: milestone.baseVerified },
    { step: 'Groq Analysis', completed: true },
    { step: 'Client Review', completed: false },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-6">
          <Link
            to={`/projects/${milestone.projectId}`}
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Project
          </Link>
        </div>

        {/* Verification Progress */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Verification Progress</h3>
            <div className="mt-3">
              <div className="flex justify-between items-center w-full">
                {verificationSteps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-success text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <span className="text-xs mt-1 text-center">{step.step}</span>
                    </div>
                    {index < verificationSteps.length - 1 && (
                      <div className={`flex-1 h-1 mx-2 ${step.completed && verificationSteps[index + 1].completed
                        ? 'bg-success'
                        : 'bg-gray-200'
                        }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-primary/5 p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Verify Work Submission</h1>
                <p className="text-gray-600 mt-1">
                  Review the work submitted by {milestone.freelancer} for milestone: {milestone.title}
                </p>
              </div>
              {milestone.baseVerified && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
                  <Shield className="w-4 h-4 mr-1" />
                  Base Verified
                </div>
              )}
            </div>
          </div>

          {/* Milestone Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{milestone.title}</h2>
                <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">${milestone.amount}</div>
                <div className="text-sm text-gray-500">
                  Submitted on {new Date(milestone.submittedOn).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Freelancer Message */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-2">Message from Freelancer</h3>
            <p className="text-gray-700">{milestone.message}</p>
          </div>

          {/* Deliverables */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Deliverables</h3>

            <div className="space-y-4">
              {milestone.deliverables.map(deliverable => (
                <div key={deliverable.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">{deliverable.title}</h4>
                    {deliverable.link && (
                      <a
                        href={deliverable.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 flex items-center text-sm"
                      >
                        View <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>

                  <div className="p-3">
                    {deliverable.type === 'screenshot' && deliverable.image && (
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img src={deliverable.image} alt={deliverable.title} className="w-full h-auto" />
                      </div>
                    )}

                    {deliverable.type === 'repository' && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-mono break-all">
                          {deliverable.link}
                        </span>
                      </div>
                    )}

                    {(deliverable.type === 'demo' || deliverable.type === 'document') && (
                      <div className="flex items-center text-sm text-gray-600">
                        Link: <a
                          href={deliverable.link}
                          className="text-primary ml-1 hover:underline break-all"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {deliverable.link}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Groq Verification */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start">
              <GroqIcon className="w-6 h-6 text-accent mr-3 mt-1" />
              <div className="w-full">
                <h3 className="font-medium text-gray-900 flex items-center justify-between flex-wrap gap-2">
                  <span>Groq AI Verification Report</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {groqVerification.score}% Match
                  </span>
                </h3>

                <div className="mt-3 space-y-2">
                  {groqVerification.positives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Positives:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {groqVerification.positives.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {groqVerification.issues.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Issues:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                        {groqVerification.issues.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Generated on {new Date(groqVerification.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Request Changes Form */}
          {isRequestingChanges && (
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Request Changes</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="changes" className="block text-sm font-medium text-gray-700 mb-1">
                    Describe the changes needed:
                  </label>
                  <textarea
                    id="changes"
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                    placeholder="Please explain what changes are needed to approve this milestone..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <CustomButton
                    variant="outline"
                    onClick={() => setIsRequestingChanges(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton
                    onClick={handleRequestChanges}
                  >
                    Send Request
                  </CustomButton>
                </div>
              </div>
            </div>
          )}

          {/* Decision */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Make a Decision</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Approve to release payment or request changes if needed.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <CustomButton
                  variant="outline"
                  size="lg"
                  onClick={handleDisputeWork}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Dispute Work
                </CustomButton>

                <CustomButton
                  variant="outline"
                  size="lg"
                  onClick={() => setIsRequestingChanges(true)}
                  leftIcon={<FileEdit className="w-4 h-4" />}
                  disabled={isRequestingChanges}
                >
                  Request Changes
                </CustomButton>

                <CustomButton
                  size="lg"
                  onClick={handleApproveWork}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Approve & Pay
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkVerification;
