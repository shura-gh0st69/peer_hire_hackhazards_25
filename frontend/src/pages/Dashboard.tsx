import React from 'react';
import FreelancerDashboard from '@/components/dashboard/FreelancerDashboard';
import ClientDashboard from '@/components/dashboard/ClientDashboard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-12">
      
        
        {/* Main content area with proper margin to accommodate sidebar */}
        <main className="flex  transition-all duration-300 ease-in-out">
          {user?.role === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />}
        </main>
    </div>
  );
};

export default Dashboard;
