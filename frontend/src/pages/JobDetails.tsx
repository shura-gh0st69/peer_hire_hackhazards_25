import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Star, MapPin, ArrowLeft, Eye, MessageSquare, Shield } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon, GroqIcon, ScreenpipeIcon } from '@/components/icons';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/services/DataService';
import type { Job, Bid } from '@/types';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const [jobData, bidsData] = await Promise.all([
          dataService.getJobById(id),
          dataService.getBidsByJobId(id)
        ]);
        setJob(jobData);
        setBids(bidsData);
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    if (!job && id) {
      navigate('/jobs');
    }
  }, [job, id, navigate]);

  const similarJobs = job
    ? job.similarJobs.slice(0, 2)
    : [];

  if (!job || isLoading) {
    return null;
  }

  const clientReviewsCount = Math.floor(job.client.projectsPosted * 0.8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins">
      <div className="mb-6">
        <Link to="/jobs" className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Job Listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {job.budget} USDC
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-6">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> {job.duration || '2-4 weeks'}
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" /> {Math.floor(Math.random() * 200) + 50} views
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" /> {job.bids} proposals
                </span>
              </div>

              <div className="prose max-w-none mb-6">
                <h3>Description</h3>
                <p>{job.description}</p>

                <h4>Requirements</h4>
                <p>{job.requirements}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills && job.skills.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CustomButton
                  size="lg"
                  onClick={() => setShowBidForm(!showBidForm)}
                >
                  {showBidForm ? 'Cancel' : 'Submit a Proposal'}
                </CustomButton>

                <div className="flex items-center space-x-2">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-500 hover:text-primary hover:border-primary">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-500 hover:text-accent hover:border-accent">
                    <GroqIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {showBidForm && (
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Your Proposal</h3>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="bid-amount" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Bid Amount (USDC)
                      </label>
                      <input
                        type="number"
                        id="bid-amount"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter your bid amount"
                        step="0.01"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label htmlFor="delivery-time" className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Time
                      </label>
                      <select
                        id="delivery-time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select timeline</option>
                        <option value="1 week">1 week</option>
                        <option value="2 weeks">2 weeks</option>
                        <option value="3 weeks">3 weeks</option>
                        <option value="4 weeks">4 weeks</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      id="proposal"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Introduce yourself and explain why you're a good fit for this project..."
                    ></textarea>
                  </div>

                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 flex items-start">
                    <GroqIcon className="w-5 h-5 text-accent mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">AI Proposal Assistant</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Let Groq help you craft a winning proposal based on your skills and this project's requirements.
                      </p>
                      <CustomButton variant="accent" size="sm">
                        Generate Proposal Draft
                      </CustomButton>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <CustomButton size="lg">
                      Submit Proposal
                    </CustomButton>
                    <p className="text-sm text-gray-500">
                      Secured by <span className="text-primary font-medium">Base</span> smart contracts
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Similar Jobs</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {similarJobs.map((similarJob, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <Link to={`/jobs/${similarJob.id}`}>
                      <h3 className="font-medium text-gray-900 hover:text-primary">{similarJob.title}</h3>
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-wrap gap-1">
                        {similarJob.skills && similarJob.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <span className="text-primary text-sm font-medium">{similarJob.budget} USDC</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">About the Client</h2>
            </div>
            <div className="p-4">
              <div className="flex flex-col items-start mb-4">
                <h3 className="font-medium text-gray-900">{job.client.name}</h3>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">Remote</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(job.client.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600">
                    {job.client.rating} ({clientReviewsCount} reviews)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium">Jan 2023</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="text-sm font-medium">~{clientReviewsCount * parseFloat(job.budget)} USDC</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Projects Posted</p>
                  <p className="text-sm font-medium">{job.client.projectsPosted}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hire Rate</p>
                  <p className="text-sm font-medium">85%</p>
                </div>
              </div>

              {job.client.rating >= 4.7 && (
                <div className="flex items-center p-3 bg-primary/5 rounded-lg border border-primary/10 text-primary mb-4">
                  <Shield className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Verified Client</p>
                    <p className="text-xs">Payment method verified</p>
                  </div>
                </div>
              )}

              <div className="flex items-center p-3 bg-primary/5 rounded-lg border border-primary/10 text-gray-700">
                <BaseIcon className="w-5 h-5 text-primary mr-2" />
                <div>
                  <p className="text-sm font-medium">Base Integration</p>
                  <p className="text-xs">Secure smart contract payments</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-accent p-4 text-white">
              <div className="flex items-center">
                <GroqIcon className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-medium">Groq AI Assistant</h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Analyze this job with Groq AI to determine if it's a good match for your skills and experience.
              </p>
              <CustomButton fullWidth variant="accent" size="sm">
                Analyze Job Fit
              </CustomButton>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-success p-4 text-white">
              <div className="flex items-center">
                <ScreenpipeIcon className="w-6 h-6 mr-2" />
                <h2 className="text-lg font-medium">Project Protection</h2>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                This project is protected by Screenpipe work verification and Base escrow payment security.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>Work verification through AI-analyzed screenshots</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>Secure payment with smart contract escrow</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">✓</span>
                  <span>Dispute resolution with Groq AI verification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// These are icon components since they weren't imported at the top
const Users = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export default JobDetails;
