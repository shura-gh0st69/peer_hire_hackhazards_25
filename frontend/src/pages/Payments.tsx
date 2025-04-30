import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/services/DataService';
import type { Payment } from '@/types';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon } from '@/components/icons';
import { CreditCard, DollarSign, ArrowDownCircle, ArrowUpCircle, FileTextIcon } from 'lucide-react';
import { toast } from 'sonner';

export const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'escrow' | 'payments'>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const paymentsData = await dataService.getPaymentsByUserId(user.id);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [user?.id]);

  // Filter transactions based on the active tab
  const filteredTransactions = activeTab === 'all'
    ? payments
    : payments.filter(tx => {
      if (activeTab === 'escrow') {
        return tx.from.includes('Ltd') || tx.from.includes('Inc') || tx.to.includes('Escrow');
      } else {
        return tx.to.includes('Johnson') || tx.to.includes('Chen');
      }
    });

  // Calculate total escrow balance
  const escrowBalance = payments
    .filter(tx => tx.to.includes('Escrow') && tx.status === 'Pending')
    .reduce((total, tx) => total + parseFloat(tx.amount), 0);

  // In a real app, this would come from auth context
  const userType = 'client';

  const handleReleasePayment = (id: string) => {
    // In a real app, API call to release payment
    toast.success('Payment released successfully!');
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-primary/5 p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userType === 'client' ? 'Payments' : 'Earnings'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {userType === 'client'
                    ? 'Manage your payments and escrow funds'
                    : 'Track your earnings and withdraw funds'}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BaseIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-gray-600">Escrow Balance</div>
                      <div className="font-bold text-primary text-xl">{escrowBalance.toFixed(1)} USDC</div>
                    </div>
                  </div>
                </div>

                {userType === 'client' ? (
                  <CustomButton
                    leftIcon={<CreditCard className="w-4 h-4" />}
                  >
                    Add Funds
                  </CustomButton>
                ) : (
                  <CustomButton
                    leftIcon={<ArrowDownCircle className="w-4 h-4" />}
                  >
                    Withdraw
                  </CustomButton>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-2 p-4">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'all'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab('all')}
              >
                All Transactions
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'escrow'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab('escrow')}
              >
                Escrow
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'payments'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setActiveTab('payments')}
              >
                {userType === 'client' ? 'Payments' : 'Earnings'}
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="p-6">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'all' && "You don't have any transactions yet."}
                  {activeTab === 'escrow' && "You don't have any escrow transactions."}
                  {activeTab === 'payments' && `You don't have any ${userType === 'client' ? 'payment' : 'earning'} transactions.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${transaction.to.includes('Escrow')
                          ? 'bg-primary/10 text-primary'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {transaction.to.includes('Escrow')
                            ? <ArrowUpCircle className="h-5 w-5" />
                            : <ArrowDownCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-3">{new Date(transaction.timestamp).toLocaleDateString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className={`font-bold ${transaction.to.includes('Escrow')
                            ? 'text-primary'
                            : 'text-green-600'
                            }`}>
                            {transaction.to.includes('Escrow') ? '-' : '+'} {transaction.amount} {transaction.currency}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.to.includes('Escrow') ? 'Funds in escrow' : 'Payment processed'}
                          </div>
                        </div>

                        {transaction.to.includes('Escrow') && transaction.status === 'Pending' && userType === 'client' && (
                          <CustomButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleReleasePayment(transaction.id)}
                          >
                            Release
                          </CustomButton>
                        )}
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

export default Payments;
