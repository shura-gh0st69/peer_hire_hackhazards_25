
import React, { useState } from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { GrokIcon } from '@/components/icons';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    skills: '',
    projectType: 'fixed'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job data submitted:', jobData);
    
    // In a real app, this would send data to the backend
    toast.success('Job posted successfully! You will start receiving bids soon.');
    
    // Reset form or redirect to jobs page
  };
  
  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-primary/5 p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
            <p className="text-gray-600 mt-1">
              Fill out the details below to post your job and start receiving bids from talented freelancers.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., React Developer for E-commerce Website"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={jobData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-development">Mobile Development</option>
                  <option value="design">Design</option>
                  <option value="writing">Writing & Translation</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={jobData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your project in detail. Include specific requirements, goals, and any relevant background information."
                  required
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/2">
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={jobData.projectType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="milestone">Milestone-based</option>
                  </select>
                </div>
                
                <div className="w-full sm:w-1/2">
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (USD)
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={jobData.budget}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={jobData.skills}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., React, TypeScript, Node.js"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={jobData.deadline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 mt-6">
              <div className="flex items-start">
                <GrokIcon className="w-5 h-5 text-accent mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Grok AI Suggestion</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Adding more specific requirements and clear expectations can attract 70% more qualified bids. Consider including examples of similar projects you admire.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <CustomButton 
                type="submit"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Post Job
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
