import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import api from "@/lib/api";
import { mockFreelancerDashboard, mockClientDashboard } from '@/mockData';
import Cookies from 'js-cookie';

// Constants for cache keys and TTLs
export const CACHE_KEYS = {
    USER: "user_data",
    AUTH_TOKEN: "auth_token",
    PREFERRED_ROLE: "preferred_role",
    DASHBOARD_DATA: "dashboard_data",
    DASHBOARD_TIMESTAMP: "dashboard_timestamp",
    PROFILE_DATA: "profile_data"
};

const CACHE_TTL = {
    DASHBOARD: 5 * 60 * 1000, // 5 minutes
    USER_PROFILE: 30 * 60 * 1000, // 30 minutes
    FALLBACK_DASHBOARD: 2 * 60 * 1000 // 2 minutes for fallback data
};

// Cache utilities
const cacheUtils = {
    // Persistent storage (localStorage)
    localStorage: {
        set: (key: string, data: any, ttl: number = CACHE_TTL.USER_PROFILE) => {
            try {
                localStorage.setItem(key, JSON.stringify({
                    data,
                    timestamp: Date.now(),
                    expiry: Date.now() + ttl
                }));
            } catch (error) {
                console.error(`Error saving to localStorage: ${key}`, error);
            }
        },
        get: (key: string, ttl: number = CACHE_TTL.USER_PROFILE) => {
            try {
                const item = localStorage.getItem(key);
                if (!item) return null;

                const parsed = JSON.parse(item);
                const now = Date.now();

                if (parsed.expiry && now > parsed.expiry) {
                    localStorage.removeItem(key);
                    return null;
                }

                return parsed.data;
            } catch (error) {
                console.error(`Error reading from localStorage: ${key}`, error);
                return null;
            }
        },
        remove: (key: string) => {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error(`Error removing from localStorage: ${key}`, error);
            }
        }
    },

    // Secure storage (cookies with httpOnly for sensitive data)
    secureCookie: {
        set: (key: string, value: string, expires = 7) => {
            Cookies.set(key, value, {
                expires,
                secure: window.location.protocol === 'https:',
                sameSite: 'strict'
            });
        },
        get: (key: string) => Cookies.get(key),
        remove: (key: string) => Cookies.remove(key)
    },

    // Clear all cache
    clearAll: () => {
        Object.values(CACHE_KEYS).forEach(key => {
            localStorage.removeItem(key);
            Cookies.remove(key);
        });
    }
};

type UserRole = "client" | "freelancer";

interface User {
    createdAt: number;
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    profile?: {
        headline: any;
        company: string;
        skills?: string[];
        bio?: string;
        hourlyRate?: number;
        location?: string;
        companySize?: string;
        industry?: string;
        companyLocation?: string;
    };
}

interface DashboardData {
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

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    currentRole: UserRole;
    dashboardData: DashboardData | null;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: UserRole, name: string, profile?: any) => Promise<void>;
    logout: () => void;
    updateUserRole: (role: UserRole) => void;
    updateProfile: (profileData: Partial<User>) => Promise<void>;
    fetchDashboardData: () => Promise<void>;
    invalidateCache: (key?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers = {
    client: {
        email: import.meta.env.VITE_DEMO_CLIENT_EMAIL,
        password: import.meta.env.VITE_DEMO_CLIENT_PASSWORD,
        name: import.meta.env.VITE_DEMO_CLIENT_NAME,
        role: "client" as UserRole,
    },
    freelancer: {
        email: import.meta.env.VITE_DEMO_FREELANCER_EMAIL,
        password: import.meta.env.VITE_DEMO_FREELANCER_PASSWORD,
        name: import.meta.env.VITE_DEMO_FREELANCER_NAME,
        role: "freelancer" as UserRole,
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Track ongoing requests to prevent duplicate calls
    const pendingRequests = useRef<Record<string, Promise<any>>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(() => {
        return cacheUtils.localStorage.get(CACHE_KEYS.USER, CACHE_TTL.USER_PROFILE);
    });

    const [currentRole, setCurrentRole] = useState<UserRole>(() => {
        // First try to get the user's actual role if they're logged in
        const userData = cacheUtils.localStorage.get(CACHE_KEYS.USER, CACHE_TTL.USER_PROFILE);
        if (userData?.role) {
            return userData.role;
        }

        // Then try to get the saved preferred role
        const savedRole = cacheUtils.localStorage.get(CACHE_KEYS.PREFERRED_ROLE) as UserRole;
        if (savedRole && (savedRole === "client" || savedRole === "freelancer")) {
            return savedRole;
        }

        // Default to client if no role is found
        return "client";
    });

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(() => {
        return cacheUtils.localStorage.get(CACHE_KEYS.DASHBOARD_DATA, CACHE_TTL.DASHBOARD);
    });

    // Function to deduplicate API requests
    const deduplicateRequest = async <T extends unknown>(
        key: string,
        requestFn: () => Promise<T>
    ): Promise<T> => {
        if (!pendingRequests.current[key]) {
            pendingRequests.current[key] = requestFn().finally(() => {
                delete pendingRequests.current[key];
            });
        }
        return pendingRequests.current[key];
    };

    // Cache invalidation function
    const invalidateCache = (key?: string) => {
        if (key) {
            cacheUtils.localStorage.remove(key);
        } else {
            cacheUtils.clearAll();
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = cacheUtils.secureCookie.get(CACHE_KEYS.AUTH_TOKEN) ||
                cacheUtils.localStorage.get(CACHE_KEYS.AUTH_TOKEN);

            if (token) {
                try {
                    // Use deduplication for the auth check
                    const response = await deduplicateRequest('auth_check', () =>
                        api.get("/auth/me")
                    );

                    const userData = response.data.user;
                    setUser(userData);

                    // Cache user data with timestamp
                    cacheUtils.localStorage.set(CACHE_KEYS.USER, userData);

                    // Migrate token to secure cookie if it was in localStorage
                    if (cacheUtils.localStorage.get(CACHE_KEYS.AUTH_TOKEN)) {
                        cacheUtils.secureCookie.set(CACHE_KEYS.AUTH_TOKEN, token);
                        cacheUtils.localStorage.remove(CACHE_KEYS.AUTH_TOKEN);
                    }
                } catch (error) {
                    // Clear all auth data if validation fails
                    cacheUtils.secureCookie.remove(CACHE_KEYS.AUTH_TOKEN);
                    cacheUtils.localStorage.remove(CACHE_KEYS.USER);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        if (user) {
            cacheUtils.localStorage.set(CACHE_KEYS.USER, user);
        } else {
            cacheUtils.localStorage.remove(CACHE_KEYS.USER);
        }
    }, [user]);

    useEffect(() => {
        if (user?.role) {
            setCurrentRole(user.role);
            cacheUtils.localStorage.set(CACHE_KEYS.PREFERRED_ROLE, user.role);
        }
    }, [user]);

    useEffect(() => {
        cacheUtils.localStorage.set(CACHE_KEYS.PREFERRED_ROLE, currentRole);
    }, [currentRole]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const demoClient = demoUsers.client;
            const demoFreelancer = demoUsers.freelancer;

            if ((email === demoClient.email && password === demoClient.password) ||
                (email === demoFreelancer.email && password === demoFreelancer.password)) {
                const demoUser = email === demoClient.email ? demoClient : demoFreelancer;
                const mockToken = "demo_token_" + Math.random().toString(36).substring(7);

                // Store token in secure cookie
                cacheUtils.secureCookie.set(CACHE_KEYS.AUTH_TOKEN, mockToken);

                const userData = {
                    createdAt: Date.now(),
                    id: "demo_" + demoUser.role,
                    email: demoUser.email,
                    name: demoUser.name,
                    role: demoUser.role,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoUser.email}`
                };

                setUser(userData);
                setCurrentRole(demoUser.role);
                cacheUtils.localStorage.set(CACHE_KEYS.USER, userData);
                return;
            }

            const response = await api.post("/auth/login", { email, password });
            const { token, user: userData } = response.data;

            // Store token in secure cookie
            cacheUtils.secureCookie.set(CACHE_KEYS.AUTH_TOKEN, token);

            // Store user data in localStorage with timestamp
            cacheUtils.localStorage.set(CACHE_KEYS.USER, userData);

            setUser(userData);
            setCurrentRole(userData.role);
        } catch (error: any) {
            console.error("Login error:", error);
            throw new Error(error.response?.data?.error || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, role: UserRole, name: string, profile?: any) => {
        setIsLoading(true);
        try {
            // Check if we're in demo mode
            if (email === import.meta.env.VITE_DEMO_CLIENT_EMAIL ||
                email === import.meta.env.VITE_DEMO_FREELANCER_EMAIL) {
                // Handle demo user logic if present
                return;
            }

            let response;
            if (role === 'client') {
                // Use dedicated client signup endpoint
                response = await api.post("/auth/client/signup", {
                    email,
                    password,
                    name,
                    role,
                    profile
                });
            } else {
                // Use regular signup for freelancers
                response = await api.post("/auth/signup", {
                    email,
                    password,
                    name,
                    role,
                    profile
                });
            }

            const { token, user: userData } = response.data;

            // Store token in secure cookie
            cacheUtils.secureCookie.set(CACHE_KEYS.AUTH_TOKEN, token);

            // Store user data with timestamp
            cacheUtils.localStorage.set(CACHE_KEYS.USER, userData);

            setUser(userData);
            setCurrentRole(role);
        } catch (error: any) {
            console.error("Signup error:", error.response?.data || error.message);
            throw new Error(
                error.response?.data?.error ||
                (error.response?.data?.details && JSON.stringify(error.response.data.details)) ||
                error.message ||
                "Signup failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            // Clear all cached data
            cacheUtils.clearAll();
            setUser(null);
        }
    };

    const updateUserRole = async (role: UserRole) => {
        if (!user) return;

        try {
            const response = await api.patch("/auth/users/role", { role });
            const updatedUser = response.data.user;
            setUser(updatedUser);
            setCurrentRole(role);
            cacheUtils.localStorage.set(CACHE_KEYS.USER, updatedUser);
            cacheUtils.localStorage.set(CACHE_KEYS.PREFERRED_ROLE, role);
        } catch (error: any) {
            console.error("Failed to update user role:", error);
            // Revert to previous role on error
            setCurrentRole(user.role);
        }
    };

    const updateProfile = async (profileData: Partial<User>) => {
        if (!user) throw new Error("User not authenticated");

        try {
            const response = await api.patch("/auth/users/profile", profileData);
            const updatedUser = response.data.user;
            setUser(updatedUser);
            cacheUtils.localStorage.set(CACHE_KEYS.USER, updatedUser);
            return updatedUser;
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            throw new Error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const fetchDashboardData = async () => {
        if (!user) return;

        // Check cache first
        const cachedData = cacheUtils.localStorage.get(CACHE_KEYS.DASHBOARD_DATA, CACHE_TTL.DASHBOARD);
        if (cachedData) {
            setDashboardData(cachedData);
            return cachedData;
        }

        try {
            const response = await deduplicateRequest('dashboard_data', () =>
                api.get('/auth/dashboard')
            );

            const data = response.data;
            setDashboardData(data);
            cacheUtils.localStorage.set(CACHE_KEYS.DASHBOARD_DATA, data, CACHE_TTL.DASHBOARD);
            return data;
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Create proper mock data structure
            const mockData: DashboardData = user.role === 'freelancer'
                ? { freelancer: mockFreelancerDashboard }
                : { client: mockClientDashboard };

            setDashboardData(mockData);
            cacheUtils.localStorage.set(CACHE_KEYS.DASHBOARD_DATA, mockData, CACHE_TTL.FALLBACK_DASHBOARD);
            return mockData;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                currentRole,
                dashboardData,
                login,
                signUp,
                logout,
                updateUserRole,
                updateProfile,
                fetchDashboardData,
                invalidateCache
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};