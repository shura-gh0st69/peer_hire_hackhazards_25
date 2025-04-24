import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "../lib/api";

type UserRole = "client" | "freelancer";

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    walletAddress?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    currentRole: UserRole; // Added for app-wide role state
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: UserRole, name: string) => Promise<void>;
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
    
    // Initialize currentRole from localStorage or user role or default to client
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
                    // If user role differs from current app role, keep the app role
                    // This allows toggling views regardless of user's actual role
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

    // Add effect to update localStorage when currentRole changes
    useEffect(() => {
        localStorage.setItem("preferredRole", currentRole);
    }, [currentRole]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Check for demo users first
            const demoClient = demoUsers.client;
            const demoFreelancer = demoUsers.freelancer;
            
            if ((email === demoClient.email && password === demoClient.password) ||
                (email === demoFreelancer.email && password === demoFreelancer.password)) {
                
                const demoUser = email === demoClient.email ? demoClient : demoFreelancer;
                
                // Simulate API response for demo users
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

            // Normal login flow for non-demo users
            const response = await api.post("/auth/login", { email, password });
            const { user: userData, token } = response.data;
            localStorage.setItem("authToken", token);
            setUser(userData);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string, role: UserRole, name: string) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/register", {
                email,
                password,
                role,
                name,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            });
            const { user: userData, token } = response.data;
            localStorage.setItem("authToken", token);
            setUser(userData);
            
            // For sign up, set currentRole to match the role they signed up with
            setCurrentRole(role);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Registration failed");
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
            // Keep the currentRole after logout
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
        // Always update the app-wide role state
        setCurrentRole(role);
        
        // If user is authenticated, also update their account role
        if (user) {
            try {
                const response = await api.patch("/users/role", { role });
                setUser(response.data.user);
            } catch (error: any) {
                console.error("Failed to update user role:", error);
                // Even if API fails, keep the local role state updated
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