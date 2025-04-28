import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import FloatingNavbar from "./FloatingNavbar";
import { useAuth } from "../../context/AuthContext";

interface MainLayoutProps {
    children: React.ReactNode;
    isAuthenticated?: boolean;
    userType?: 'client' | 'freelancer';
}

export default function MainLayout({
    children,
    isAuthenticated = false,
    userType,
}: MainLayoutProps) {
    const auth = useAuth();

    // Use auth context if available, otherwise use props for backward compatibility
    const isUserAuthenticated = auth.isAuthenticated || isAuthenticated;

    // Use currentRole from context for consistent experience
    const currentUserType = userType || auth.currentRole;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Global floating navbar - always visible */}
            <FloatingNavbar userType={currentUserType} />

            {/* Main content area wrapper */}
            {/* pt-20 to offset the fixed navbar height */}
            <div className="flex flex-1 ">
                {/* Sidebar - visible for authenticated users */}
                {isUserAuthenticated && (
                    <DashboardSidebar />
                )}

                {/* Main content area */}
                <main className={`flex-1 overflow-y-auto ${isUserAuthenticated}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}