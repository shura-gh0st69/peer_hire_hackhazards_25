import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    MessageSquare,
    Bell,
    CreditCard,
    Settings,
    Menu,
    X,
    Monitor,
    ChevronRight,
    User,
    PlusCircle,
    FileText,
    UploadCloud
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CustomButton } from "../ui/custom-button";
import { useAuth } from "../../context/AuthContext";

export function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, updateUserRole } = useAuth();

    // Close sidebar by default on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Common menu items for both roles
    const commonMenuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: MessageSquare, label: "Messages", path: "/messages" },
        { icon: Bell, label: "Notifications", path: "/notifications" },
        { icon: CreditCard, label: "Payments", path: "/payments" },
        { icon: Monitor, label: "Screen Recording", path: "/screen-recording" },
        { icon: Settings, label: "Settings", path: "/settings" },
    ];

    // Role-specific menu items
    const clientMenuItems = [
        { icon: PlusCircle, label: "Post Job", path: "/post-job" },
        { icon: FileText, label: "Posted Jobs", path: "/jobs?filter=posted" },
        { icon: Briefcase, label: "Pending Bids", path: "/jobs?filter=pending-bids" },
    ];

    const freelancerMenuItems = [
        { icon: Briefcase, label: "Browse Jobs", path: "/jobs" },
        { icon: UploadCloud, label: "Submit Deliverables", path: "/job-submission" },
    ];

    // Combine the appropriate menu items based on user role
    const menuItems = [
        ...commonMenuItems,
        ...(user?.role === "client" ? clientMenuItems : freelancerMenuItems)
    ];

    // Handle overlay click to close sidebar on mobile
    const handleOverlayClick = () => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    // Toggle between freelancer and client modes
    const toggleUserRole = () => {
        const newRole = user?.role === "client" ? "freelancer" : "client";
        updateUserRole(newRole);
        
        // Redirect to appropriate dashboard when role changes
        navigate("/dashboard");
    };

    if (!user) return null;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 bg-black/50 z-20"
                    onClick={handleOverlayClick}
                ></div>
            )}

            {/* Toggle button */}
            <button
                className="fixed top-20 left-4 z-50 p-2 bg-white shadow-md hover:bg-gray-100 text-gray-700 rounded-full md:hidden transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </button>

            {/* Sidebar */}
            <aside className={cn(
                "bg-white border-r border-gray-200 shadow-sm",
                "fixed md:sticky top-[5rem] bottom-0 left-0",
                "w-[280px] md:w-64 md:min-h-[calc(100vh-5rem)]",
                "transition-transform duration-300 ease-in-out z-30",
                "hidden md:block", // Hide on mobile, show on desktop
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            PeerHire Workspace
                        </h2>
                        <div className="flex items-center mt-2 gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600">
                                {user.role === "client" ? "Client" : "Freelancer"} Account
                            </span>
                        </div>
                    </div>

                    {/* User role toggle */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Switch to {user.role === "client" ? "Freelancer" : "Client"} Mode</span>
                            <CustomButton
                                variant="outline"
                                size="sm"
                                onClick={toggleUserRole}
                            >
                                Switch
                            </CustomButton>
                        </div>
                    </div>

                    {/* Menu items */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center justify-between py-2.5 px-4 rounded-lg transition-colors",
                                        "hover:bg-gray-100 group",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-gray-700"
                                    )}
                                    onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5",
                                                isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700"
                                            )}
                                        />
                                        <span>{item.label}</span>
                                    </div>

                                    {isActive && (
                                        <ChevronRight className="h-4 w-4 text-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar footer */}
                    <div className="p-4 border-t border-gray-200">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            className="w-full justify-center"
                        >
                            Need Help?
                        </CustomButton>
                    </div>
                </div>
            </aside>
        </>
    );
}