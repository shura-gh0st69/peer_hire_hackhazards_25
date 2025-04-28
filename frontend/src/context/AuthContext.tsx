import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/api";

type UserRole = "client" | "freelancer";

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    walletAddress?: string;
    profile?: {
        skills?: string[];
        bio?: string;
        hourlyRate?: number;
        location?: string;
        companySize?: string;
        industry?: string;
        companyLocation?: string;
    };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    currentRole: UserRole;
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: UserRole, name: string, profile?: any) => Promise<void>;
    logout: () => void;
    connectWallet: (address: string) => void;
    updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUsers = {
    client: {
        email: import.meta.env.VITE_DEMO_CLIENT_EMAIL ,
        password: import.meta.env.VITE_DEMO_CLIENT_PASSWORD ,
        name: import.meta.env.VITE_DEMO_CLIENT_NAME ,
        role: "client" as UserRole,
    },
    freelancer: {
        email: import.meta.env.VITE_DEMO_FREELANCER_EMAIL ,
        password: import.meta.env.VITE_DEMO_FREELANCER_PASSWORD ,
        name: import.meta.env.VITE_DEMO_FREELANCER_NAME ,
        role: "freelancer" as UserRole,
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const [currentRole, setCurrentRole] = useState<UserRole>(() => {
        const savedRole = localStorage.getItem("preferredRole") as UserRole;
        if (savedRole && (savedRole === "client" || savedRole === "freelancer")) {
            return savedRole;
        }
        if (user?.role) {
            return user.role;
        }
        return "client";
    });

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                try {
                    const response = await api.get("/auth/me");
                    setUser(response.data.user);
                } catch (error) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem("preferredRole", currentRole);
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
                localStorage.setItem("authToken", mockToken);
                setUser({
                    id: "demo_" + demoUser.role,
                    email: demoUser.email,
                    name: demoUser.name,
                    role: demoUser.role,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoUser.email}`
                });
                setCurrentRole(demoUser.role);
                return;
            }

            const response = await api.post("/auth/login", { email, password });
            const { token, user: userData } = response.data;
            localStorage.setItem("authToken", token);
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
            localStorage.setItem("authToken", token);
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
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    const connectWallet = async (address: string) => {
        if (user) {
            try {
                const response = await api.post("/users/wallet", { walletAddress: address });
                setUser(response.data.user);
            } catch (error: any) {
                throw new Error(error.response?.data?.message || "Failed to connect wallet");
            }
        }
    };

    const updateUserRole = async (role: UserRole) => {
        setCurrentRole(role);
        
        if (user) {
            try {
                const response = await api.patch("/users/role", { role });
                setUser(response.data.user);
            } catch (error: any) {
                console.error("Failed to update user role:", error);
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                currentRole,
                login,
                signUp,
                logout,
                connectWallet,
                updateUserRole
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