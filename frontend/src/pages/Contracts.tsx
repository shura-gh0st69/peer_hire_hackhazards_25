import React, { useState } from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { FileTextIcon, UserIcon, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { contracts as mockContracts, Contract } from '@/mockData';

const Contracts = () => {
  const [contracts, setContracts] = useState(mockContracts);
  const [activeTab, setActiveTab] = useState<'Active' | 'Pending' | 'Completed'>('Active');

  // Filter contracts based on the active tab
  const filteredContracts = contracts.filter(contract =>
    contract.status === activeTab ||
    // Handle the "Pending" case separately since our Contract type doesn't have a "Pending" status
    (activeTab === 'Pending' && (contract.status === 'Disputed' || false))
  );

  // In a real app, this would come from auth context
  const userType = 'client';

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-primary/5 p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
                <p className="text-gray-600 mt-1">
                  {userType === 'client'
                    ? 'Manage your contracts with freelancers'
                    : 'Manage your contracts with clients'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-2 p-4">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Active'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab('Active')}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Pending'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab('Pending')}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'Completed'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab('Completed')}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Contract List */}
          <div className="p-6">
            {filteredContracts.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'Active' && "You don't have any active contracts."}
                  {activeTab === 'Pending' && "You don't have any pending contracts."}
                  {activeTab === 'Completed' && "You don't have any completed contracts."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredContracts.map(contract => (
                  <div key={contract.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">{contract.jobTitle}</h2>
                          <p className="text-sm text-gray-600">
                            {userType === 'client' ? `Freelancer: ${contract.freelancerName}` : `Client: ${contract.clientName}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {contract.status === 'Active' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        )}
                        {contract.status === 'Pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                        {contract.status === 'Completed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </span>
                        )}

                        <CustomButton
                          variant="outline"
                          size="sm"
                        >
                          View Contract
                        </CustomButton>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Progress</span>
                          <span className="text-gray-600">
                            {contract.milestones ?
                              Math.floor((contract.milestones.filter(m => m.status === "Completed" || m.status === "Released").length / contract.milestones.length) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full"
                            style={{
                              width: `${contract.milestones ?
                                Math.floor((contract.milestones.filter(m => m.status === "Completed" || m.status === "Released").length / contract.milestones.length) * 100)
                                : 0}%`
                            }}
                          />
                        </div>
                      </div>

                      {contract.milestones && (
                        <>
                          <h3 className="font-medium text-gray-900 mb-2">Milestones</h3>
                          <div className="space-y-2">
                            {contract.milestones.map((milestone, index) => (
                              <div key={milestone.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center">
                                  <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs mr-3 ${milestone.status === "Completed" || milestone.status === "Released"
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {index + 1}
                                  </span>
                                  <span className={milestone.status === "Completed" || milestone.status === "Released" ? 'text-gray-900' : 'text-gray-600'}>
                                    {milestone.title}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium">{milestone.amount} ETH</span>
                                  {(milestone.status === "Completed" || milestone.status === "Released") && (
                                    <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                        <div>
                          <span className="text-gray-600">Start date:</span>
                          <span className="ml-2 font-medium">{new Date(contract.startDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">End date:</span>
                          <span className="ml-2 font-medium">{new Date(contract.endDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total amount:</span>
                          <span className="ml-2 font-medium">{contract.amount} ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
