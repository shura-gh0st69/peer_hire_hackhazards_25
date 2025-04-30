import type { DashboardData } from '@/types';

export const mockClientDashboard: DashboardData['client'] = {
  activeJobs: 3,
  totalSpent: 12500,
  escrowBalance: 2500,
  recentActivities: [
    // Add mock activities here if needed
  ],
  pendingBids: [
    // Add mock bids here if needed
  ]
};

export const mockFreelancerDashboard: DashboardData['freelancer'] = {
  ongoingProjects: 2,
  activeApplications: 5,
  totalEarnings: 15000,
  recentActivities: [
    // Add mock activities here if needed
  ],
  recommendedJobs: [
    // Add mock jobs here if needed
  ]
};