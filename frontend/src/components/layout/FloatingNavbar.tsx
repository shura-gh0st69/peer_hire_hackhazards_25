import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseIcon, UserIcon, HomeIcon, FileTextIcon, CreditCardIcon, Menu, X, PlusCircle } from "lucide-react";
import { BaseIcon } from "../icons";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/button";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const isLoggedIn = !!user;
  const currentRole = userType || user?.role || 'client';

  // Primary nav links for non-logged in users
  const publicNavLinks = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/jobs", label: "Browse Jobs", icon: BriefcaseIcon },
    { to: "/how-it-works", label: "How it Works", icon: FileTextIcon },
  ];

  // Role-specific nav links for authenticated users
  const authenticatedNavLinks = currentRole === 'client'
    ? [
      { to: "/dashboard", label: "Dashboard", icon: BriefcaseIcon },
      { to: "/post-job", label: "Post Job", icon: PlusCircle },
      { to: "/contracts", label: "Contracts", icon: FileTextIcon },
    ]
    : [
      { to: "/dashboard", label: "Dashboard", icon: BriefcaseIcon },
      { to: "/jobs", label: "Find Jobs", icon: BriefcaseIcon },
      { to: "/contracts", label: "Contracts", icon: FileTextIcon },
      { to: "/portfolio", label: "Portfolio", icon: FileTextIcon },
    ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation links to display
  const navLinks = isLoggedIn ? authenticatedNavLinks : publicNavLinks;

  // Close dropdown when clicking outside
  React.useEffect(() => {
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
        maxWidth: 800,
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
      <div className="hidden md:flex  items-center gap-2 overflow-x-auto hide-scrollbar">
        {navLinks.map((nav) => (
          <Link
            key={nav.to}
            to={nav.to}
            className={`relative px-3 py-1.5 rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors flex items-center whitespace-nowrap ${
              location.pathname === nav.to ? "bg-primary/10 text-primary" : ""
            }`}
          >
            {nav.icon && <nav.icon className="w-4 h-4 mr-1" />}
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
          <Link to="/auth/freelancer-signup">
            <Button variant="default" size="sm" className="font-medium hover:text-white hover:bg-accent">
              Sign up
            </Button>
          </Link>
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
            {[...navLinks].map((nav) => (
              <Link
                key={nav.to}
                to={nav.to}
                className={`px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors flex items-center ${
                  location.pathname === nav.to ? "bg-primary/10 text-primary" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {nav.icon && <nav.icon className="w-5 h-5 mr-2" />}
                {nav.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="flex flex-col pt-2 gap-2 border-t border-gray-100 mt-2">
                <Link to="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full justify-center">Log in</Button>
                </Link>
                <Link to="/auth/freelancer-signup" className="w-full">
                  <Button variant="default" className="w-full justify-center">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
