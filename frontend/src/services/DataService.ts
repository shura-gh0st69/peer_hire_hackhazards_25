import { mockFreelancerDashboard, mockClientDashboard } from './mockFallbacks';
import {
  type User,
  type Client,
  type Job,
  type Bid,
  type Conversation,
  type Message,
  type Contract,
  type Payment,
  type Review,
  type ProjectVerification,
  type DashboardData
} from '@/types';
import api from '@/lib/api';

// Cache configuration
const CACHE_TTL = {
  JOBS: 5 * 60 * 1000, // 5 minutes
  BIDS: 3 * 60 * 1000, // 3 minutes
  USER_PROFILE: 30 * 60 * 1000, // 30 minutes
  CONTRACTS: 5 * 60 * 1000, // 5 minutes
  PAYMENTS: 2 * 60 * 1000, // 2 minutes
  CONVERSATIONS: 1 * 60 * 1000, // 1 minute
  MESSAGES: 30 * 1000, // 30 seconds
  DASHBOARD: 5 * 60 * 1000, // 5 minutes
};

type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiry: number;
};

class DataService {
  private cache: Map<string, CacheItem<any>> = new Map();

  private getCachedData<T>(key: string, fetchFn: () => T, ttl: number): T {
    const now = Date.now();
    const cachedItem = this.cache.get(key);

    if (cachedItem && now < cachedItem.expiry) {
      return cachedItem.data;
    }

    const data = fetchFn();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiry: now + ttl,
    });

    return data;
  }

  private async fetchWithMockFallback<T>(endpoint: string, mockData: T, ttl: number): Promise<T> {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.warn(`API call failed, using mock data for ${endpoint}`, error);
      return this.getCachedData(`mock_${endpoint}`, () => mockData, ttl);
    }
  }

  // User related methods
  async getUserProfile(userId: string): Promise<User | Client | null> {
    return this.fetchWithMockFallback(
      `/auth/profile/${userId}`,
      null,
      CACHE_TTL.USER_PROFILE
    );
  }

  // Job related methods
  async getJobs(): Promise<Job[]> {
    return this.fetchWithMockFallback('/jobs', [], CACHE_TTL.JOBS);
  }

  async getJobById(jobId: string): Promise<Job | null> {
    return this.fetchWithMockFallback(
      `/jobs/${jobId}`,
      null,
      CACHE_TTL.JOBS
    );
  }

  // Bid related methods
  async getBidsByJobId(jobId: string): Promise<Bid[]> {
    return this.fetchWithMockFallback(
      `/bids/job/${jobId}`,
      [],
      CACHE_TTL.BIDS
    );
  }

  async getBidsByFreelancerId(freelancerId: string): Promise<Bid[]> {
    return this.fetchWithMockFallback(
      `/bids/freelancer/${freelancerId}`,
      [],
      CACHE_TTL.BIDS
    );
  }

  async getBidById(bidId: string): Promise<Bid | null> {
    return this.fetchWithMockFallback(
      `/bids/${bidId}`,
      null,
      CACHE_TTL.BIDS
    );
  }

  async saveDraftProposal(proposal: Partial<Bid>): Promise<{success: boolean}> {
    try {
      // In a real app, this would make an API call
      // For now just return success
      return { success: true };
    } catch (error) {
      console.error('Error saving draft proposal:', error);
      return { success: false };
    }
  }

  async submitProposal(proposal: Partial<Bid>): Promise<{success: boolean}> {
    try {
      // In a real app, this would make an API call
      // For now just return success
      return { success: true };
    } catch (error) {
      console.error('Error submitting proposal:', error);
      return { success: false };
    }
  }

  // Contract related methods
  async getContractsByUserId(userId: string, role: 'client' | 'freelancer'): Promise<Contract[]> {
    return this.fetchWithMockFallback(
      `/contracts/${userId}?role=${role}`,
      [],
      CACHE_TTL.CONTRACTS
    );
  }

  async getContractById(contractId: string): Promise<Contract | null> {
    return this.fetchWithMockFallback(
      `/contracts/${contractId}`,
      null,
      CACHE_TTL.CONTRACTS
    );
  }

  // Message and conversation methods
  async getConversations(userId: string): Promise<Conversation[]> {
    return this.fetchWithMockFallback(
      `/conversations/${userId}`,
      [],
      CACHE_TTL.CONVERSATIONS
    );
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.fetchWithMockFallback(
      `/messages/${conversationId}`,
      [],
      CACHE_TTL.MESSAGES
    );
  }

  // Payment related methods
  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return this.fetchWithMockFallback(
      `/payments/${userId}`,
      [],
      CACHE_TTL.PAYMENTS
    );
  }

  // Review related methods
  async getReviewsByUserId(userId: string): Promise<Review[]> {
    return this.fetchWithMockFallback(
      `/reviews/${userId}`,
      [],
      CACHE_TTL.USER_PROFILE
    );
  }

  // Project verification methods
  async getVerificationsByMilestoneId(milestoneId: string): Promise<ProjectVerification[]> {
    return this.fetchWithMockFallback(
      `/verifications/${milestoneId}`,
      [],
      CACHE_TTL.CONTRACTS
    );
  }

  // Dashboard data
  async getDashboardData(role: 'client' | 'freelancer'): Promise<DashboardData> {
    return this.fetchWithMockFallback(
      '/auth/dashboard',
      role === 'client' ? { client: mockClientDashboard } : { freelancer: mockFreelancerDashboard },
      CACHE_TTL.DASHBOARD
    );
  }

  // Cache management
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  invalidateCache(pattern: string): void {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

// Export a singleton instance
export const dataService = new DataService();
export default dataService;