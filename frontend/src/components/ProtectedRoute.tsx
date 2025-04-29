import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

// Define client-only and freelancer-only routes
const CLIENT_ONLY_ROUTES = ['/freelancers', '/post-job', '/jobs/posted'];
const FREELANCER_ONLY_ROUTES = ['/portfolio', '/work-verification', '/jobs/available'];

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, user, currentRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  const isClientRoute = CLIENT_ONLY_ROUTES.some(route => location.pathname.startsWith(route));
  const isFreelancerRoute = FREELANCER_ONLY_ROUTES.some(route => location.pathname.startsWith(route));

  // If it's a client-only route and user is not a client, redirect to dashboard
  if (isClientRoute && user?.role !== 'client') {
    return <Navigate to="/dashboard" replace />;
  }

  // If it's a freelancer-only route and user is not a freelancer, redirect to dashboard
  if (isFreelancerRoute && user?.role !== 'freelancer') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};