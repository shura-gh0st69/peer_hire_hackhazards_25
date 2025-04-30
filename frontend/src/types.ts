export type UserRole = 'client' | 'freelancer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  skills?: string[];
  bio?: string;
  hourlyRate?: number;
  location?: string;
  completedJobs?: number;
  rating?: number;
}

export interface Client extends User {
  role: 'client';
  companySize?: string;
  industry?: string;
  companyLocation?: string;
  projectsPosted: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  budget: string;
  currency?: string;
  deadline?: string;
  duration?: string;
  skills: string[];
  status: 'open' | 'in_progress' | 'completed';
  createdAt: string;
  client: {
    id: string;
    name: string;
    rating: number;
    projectsPosted: number;
  };
  bids: number;
  similarJobs: Job[];
}

export interface Bid {
  id: string;
  jobId: string;
  freelancer: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedJobs: number;
    skills: string[];
  };
  amount: string;
  currency: string;
  deliveryTime: string;
  proposal: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  submittedAt: string;
}

export interface Contract {
  id: string;
  jobId: string;
  jobTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  amount: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Disputed' | 'Pending' | 'Cancelled';
  milestones?: {
    id: string;
    title: string;
    amount: string;
    status: 'Pending' | 'Completed' | 'Released';
  }[];
}

export interface Payment {
  id: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  description: string;
  status: 'Pending' | 'Completed' | 'Failed';
  timestamp: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'self' | 'other';
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  user?: {
    id: string;
    name: string;
    avatar?: string;
    online?: boolean;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    unread: boolean;
  };
}

export interface Review {
  id: string;
  fromUser: string;
  toUser: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProjectVerification {
  id: string;
  milestoneId: string;
  verifier: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  timestamp: string;
  evidence?: string[];
}

export interface DashboardData {
  freelancer?: {
    ongoingProjects: number;
    activeApplications: number;
    totalEarnings: number;
    recentActivities: any[];
    recommendedJobs: any[];
  };
  client?: {
    activeJobs: number;
    totalSpent: number;
    escrowBalance: number;
    recentActivities: any[];
    pendingBids: any[];
  };
}