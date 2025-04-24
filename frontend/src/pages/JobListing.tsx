import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Search, Filter, Star, MapPin, List, LayoutGrid, Bookmark, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { GrokIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { jobs as mockJobs } from '@/mockData';

const JobListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-poppins">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Next Project</h1>
          <p className="text-gray-600">Browse job opportunities from verified clients</p>
        </div>
        <div className="mt-4 md:mt-0">
          <CustomButton
            leftIcon={<GrokIcon className="w-4 h-4" />}
            variant="accent"
          >
            Get AI Recommendations
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <span className="font-medium text-gray-900">Filters</span>
                <Filter className="h-4 w-4 text-gray-500" />
              </button>

              {filterOpen && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                    <div className="space-y-2">
                      {["Web Development", "Mobile Development", "UI/UX Design", "Blockchain", "Content Writing"].map((category, idx) => (
                        <div key={idx} className="flex items-center">
                          <input
                            id={`category-${idx}`}
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor={`category-${idx}`} className="ml-2 text-sm text-gray-600">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="price-min" className="sr-only">Minimum</label>
                        <input
                          type="number"
                          id="price-min"
                          placeholder="Min"
                          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="price-max" className="sr-only">Maximum</label>
                        <input
                          type="number"
                          id="price-max"
                          placeholder="Max"
                          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Project Duration</h3>
                    <div className="space-y-2">
                      {["Less than 1 week", "1 to 4 weeks", "1 to 3 months", "3 to 6 months", "More than 6 months"].map((duration, idx) => (
                        <div key={idx} className="flex items-center">
                          <input
                            id={`duration-${idx}`}
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor={`duration-${idx}`} className="ml-2 text-sm text-gray-600">
                            {duration}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
                    <div className="space-y-2">
                      {["React", "TypeScript", "Node.js", "Solidity", "UI/UX Design"].map((skill, idx) => (
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

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Job Type</h3>
              <div className="flex flex-wrap gap-2">
                <button className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full">
                  All Jobs
                </button>
                <button className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary">
                  Fixed Price
                </button>
                <button className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary">
                  Hourly
                </button>
                <button className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary">
                  Long-term
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6 p-4">
            <div className="flex items-start">
              <GrokIcon className="w-5 h-5 text-accent mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">AI Job Assistant</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Let Grok find the perfect jobs for your skills and experience.
                </p>
                <CustomButton
                  variant="accent"
                  size="sm"
                  className="mt-3"
                >
                  Get Personalized Jobs
                </CustomButton>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 mb-2 sm:mb-0"><span className="font-medium text-gray-900">{mockJobs.length}</span> jobs found</p>
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
                  <select
                    className="border border-gray-300 text-gray-700 text-sm rounded-md focus:outline-none focus:ring-primary focus:border-primary px-2 py-1"
                  >
                    <option>Relevance</option>
                    <option>Newest</option>
                    <option>Budget: High to Low</option>
                    <option>Budget: Low to High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            viewMode === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6'
          )}>
            {mockJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <Link to={`/jobs/${job.id}`} className="hover:text-primary flex-1 mr-4">
                        <h3 className="font-medium text-lg text-gray-900 line-clamp-2">{job.title}</h3>
                      </Link>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mb-2 whitespace-nowrap">
                          {job.budget} ETH
                        </div>
                        {job.skills && job.skills.includes("EVM") && (
                          <div className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full whitespace-nowrap">
                            EVM
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills && job.skills.map((skill, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-500">
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{job.client.rating}</span>
                          </div>
                          <span className="mx-2 text-gray-300">|</span>
                          <span>{job.client.projectsPosted} projects</span>
                          {job.client.rating >= 4.8 && (
                            <>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-primary">Verified</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          <span>Remote</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <span className="inline-flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" /> {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center">
                          <Users className="w-3.5 h-3.5 mr-1" /> {job.bids} bids
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Link to={`/jobs/${job.id}`} className="text-primary hover:text-primary/80 text-sm font-medium">
                        View Details
                      </Link>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        title={isSaved ? "Remove from saved" : "Save for later"}
                        className="text-gray-400 hover:text-primary p-1"
                      >
                        <Bookmark className={cn("w-4 h-4", isSaved && "fill-primary text-primary")} />
                      </button>
                    </div>
                    <Link to={`/jobs/${job.id}`}>
                      <CustomButton size="sm">
                        Apply Now
                      </CustomButton>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex justify-center">
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
  );
};

export default JobListing;
