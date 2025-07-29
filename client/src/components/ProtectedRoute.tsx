import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Current path:', location.pathname);
  console.log('ProtectedRoute - User:', user?.email || 'No user');
  console.log('ProtectedRoute - Loading:', loading);
  console.log('ProtectedRoute - User role:', user?.role || 'No role');

  if (loading) {
    console.log('ProtectedRoute - Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user.role || !allowedRoles.includes(user.role)) {
      console.log('ProtectedRoute - Access denied, redirecting based on user role');
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case 'admin':
        case 'super_admin':
          return <Navigate to="/admin/dashboard" replace />;
        case 'manager':
          return <Navigate to="/manager/dashboard" replace />;
        case 'client':
          return <Navigate to="/client/dashboard" replace />;
        case 'employee':
          return <Navigate to="/employee/dashboard" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    }
  }

  console.log('ProtectedRoute - User authenticated and authorized, rendering children');
  return <>{children}</>;
};