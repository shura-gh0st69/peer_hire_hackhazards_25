import React, { useEffect, useState } from 'react';
import FreelancerDashboard from '@/components/dashboard/FreelancerDashboard';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from 'sonner';

interface FreelancerDashboardData {
  name?: string;
  ongoingProjects: number;
  activeApplications: number;
  totalEarnings: number;
  recentActivities: Array<{
    type: string;
    title: string;
    time: string;
  }>;
  recommendedJobs: Array<{
    title: string;
    description: string;
    budget: string;
    skills: string[];
    posted: string;
    bids: number;
    match: number;
  }>;
}

interface ClientDashboardData {
  name?: string;
  activeJobs: number;
  totalSpent: number;
  escrowBalance: number;
  recentActivities: Array<{
    type: string;
    title: string;
    time: string;
  }>;
  pendingBids: Array<{
    jobTitle: string;
    freelancer: string;
    bid: string;
    rating: number;
    delivery: string;
  }>;
}

const Dashboard = () => {
  const { user, dashboardData, fetchDashboardData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        await fetchDashboardData();
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error('Dashboard initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      initializeDashboard();
    }
  }, [user?.role]); // Re-fetch when user role changes

  if (isLoading || !dashboardData) {
    return <LoadingScreen />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">
      <main className="flex transition-all duration-300 ease-in-out">
        {user?.role === 'freelancer' ? (
          <FreelancerDashboard dashboardData={dashboardData.freelancer} />
        ) : (
          <ClientDashboard dashboardData={dashboardData.client} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
