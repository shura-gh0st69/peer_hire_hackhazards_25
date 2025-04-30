import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  UserIcon,
  HomeIcon,
  FileTextIcon,
  CreditCardIcon,
  Menu,
  X,
  PlusCircle,
  MessageSquare,
  UsersIcon,
  Wallet,
  LayoutDashboard,
  FileText,
  Info,
  HelpCircle,
  Phone
} from "lucide-react";
import { BaseIcon } from "../icons";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// Dummy notifications data
const exampleNotifications = [
  {
    id: 1,
    type: "bid",
    message: "New bid submitted on your job.",
    time: "1 min ago",
    unread: true,
    grok: false,
  },
  {
    id: 2,
    type: "message",
    message: "You've received a new message.",
    time: "5 min ago",
    unread: true,
    grok: false,
  },
  {
    id: 3,
    type: "grok",
    message: "🪐 Circuit anomaly detected! Grok Easter Egg unlocked.",
    time: "10 min ago",
    unread: false,
    grok: true,
  },
];

interface FloatingNavbarProps {
  userType?: 'client' | 'freelancer';
}

export default function FloatingNavbar({ userType }: FloatingNavbarProps) {
  const location = useLocation();
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signupDropdownOpen, setSignupDropdownOpen] = useState(false);
  const signupDropdownTimeout = useRef<NodeJS.Timeout>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const currentRole = userType || user?.role || 'client';

  // Navigation links for unauthenticated users
  const publicNavLinks = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/how-it-works", label: "How It Works", icon: FileTextIcon },
    { to: "/pricing", label: "Pricing", icon: CreditCardIcon },
    { to: "/about", label: "About", icon: Info },
    { to: "/blog", label: "Blog", icon: FileText },
    { to: "/contact", label: "Contact", icon: Phone }
  ];

  // Navigation links for authenticated clients
  const clientNavLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/post-job", label: "Post Job", icon: PlusCircle },
    { to: "/jobs", label: "Find Freelancers", icon: UsersIcon },
    { to: "/projects", label: "Projects", icon: BriefcaseIcon },
    { to: "/messages", label: "Messages", icon: MessageSquare },
    { to: "/payments", label: "Payments", icon: CreditCardIcon }
  ];

  // Navigation links for authenticated freelancers
  const freelancerNavLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/jobs", label: "Find Gigs", icon: BriefcaseIcon },
    { to: "/portfolio", label: "Portfolio", icon: FileTextIcon },
    { to: "/proposals", label: "Proposals", icon: FileText },
    { to: "/projects", label: "Projects", icon: BriefcaseIcon },
    { to: "/messages", label: "Messages", icon: MessageSquare }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSignupMouseEnter = () => {
    if (signupDropdownTimeout.current) {
      clearTimeout(signupDropdownTimeout.current);
    }
    setSignupDropdownOpen(true);
  };

  const handleSignupMouseLeave = () => {
    signupDropdownTimeout.current = setTimeout(() => {
      setSignupDropdownOpen(false);
    }, 100); // Increased to 400ms to allow for the animation
  };

  // Select the appropriate navigation links based on authentication status and role
  const navLinks = isLoggedIn
    ? currentRole === 'client'
      ? clientNavLinks
      : freelancerNavLinks
    : publicNavLinks;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest("#notification-dropdown") &&
        !(e.target as HTMLElement).closest("#bell-button")) {
        setDropdown(false);
      }
    }

    if (dropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdown]);

  return (
    <nav className="fixed top-4 left-0 md:left-1/2 z-[101] md:-translate-x-1/2 w-[calc(100%-2rem)] mx-4 md:w-auto px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-[#F3F4F6]/95 to-white/95 shadow-xl rounded-2xl border border-white/60 backdrop-blur-lg"
      style={{
        borderRadius: 16,
        minWidth: 320,
        maxWidth: 835,
        animation: "fade-in 350ms",
      }}
    >
      {/* Logo */}
      <div className="flex-1 md:flex-none flex items-center justify-center md:justify-start">
        <Link to="/" aria-label="Home" className="mr-3 flex items-center gap-2">
          <BaseIcon className="w-7 h-7 text-primary" />
          <span className="font-semibold text-lg">PeerHire</span>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="hidden md:flex items-center gap-2 overflow-x-auto hide-scrollbar">
        {navLinks.map((nav) => (
          <Link
            key={nav.to}
            to={nav.to}
            className={cn(
              "relative px-3 py-1.5 rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors flex items-center whitespace-nowrap",
              location.pathname === nav.to && "bg-primary/10 text-primary"
            )}
          >
            {nav.icon && <nav.icon className="w-4 h-4 mr-1.5" />}
            {nav.label}
          </Link>
        ))}
      </div>

      {/* User Actions */}
      {isLoggedIn ? (
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors flex items-center"
          >
            Logout
          </button>
          <Link to="/profile" className="p-2 rounded-full hover:bg-primary/10">
            <UserIcon className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-2">
          <Link to="/auth/login">
            <Button variant="ghost" size="sm" className="font-medium hover:text-white hover:bg-accent">
              Log in
            </Button>
          </Link>
          <div
            className="relative"
            onMouseEnter={handleSignupMouseEnter}
            onMouseLeave={handleSignupMouseLeave}
          >
            <Button variant="default" size="sm" className="font-medium hover:text-white hover:bg-accent">
              Sign up
            </Button>
            <div className={cn(
              "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2",
              "transition-all duration-300 ease-in-out transform",
              signupDropdownOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2 pointer-events-none"
            )}>
              <Link to="/auth/freelancer-signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                Join as Freelancer
              </Link>
              <Link to="/auth/client-signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                Join as Client
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <button
        className="md:hidden p-1 rounded-full hover:bg-primary/10 transition-transform duration-200 ease-in-out"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          transform: mobileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 right-0 w-full bg-white shadow-lg border-t border-gray-100 z-[100] animate-in slide-in-from-top">
          <div className="flex flex-col p-4 space-y-2 max-w-screen-md mx-auto">
            {navLinks.map((nav) => (
              <Link
                key={nav.to}
                to={nav.to}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors flex items-center",
                  location.pathname === nav.to && "bg-primary/10 text-primary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {nav.icon && <nav.icon className="w-5 h-5 mr-2" />}
                {nav.label}
              </Link>
            ))}

            {/* Mobile authentication links */}
            {!isLoggedIn ? (
              <div className="flex flex-col pt-2 gap-2 border-t border-gray-100 mt-2">
                <Link to="/auth/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center">Log in</Button>
                </Link>
                <Link to="/auth/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full justify-center">Sign up</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col pt-2 gap-2 border-t border-gray-100 mt-2">
                <Link to="/profile" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <UserIcon className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="default"
                  className="w-full justify-center"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
