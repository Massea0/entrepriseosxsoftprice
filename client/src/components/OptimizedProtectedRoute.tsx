import React, { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizedProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export const OptimizedProtectedRoute = memo(({ children, requiredRole }: OptimizedProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Utiliser un seul log conditionnel pour debug
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.01) {
    console.log('[Auth Debug]', {
      path: location.pathname,
      user: user?.email,
      role: user?.role,
      loading
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user.role || !allowedRoles.includes(user.role)) {
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

  return <>{children}</>;
}, (prevProps, nextProps) => {
  // Mémorisation personnalisée : ne re-render que si les props changent vraiment
  return (
    prevProps.children === nextProps.children &&
    JSON.stringify(prevProps.requiredRole) === JSON.stringify(nextProps.requiredRole)
  );
});

OptimizedProtectedRoute.displayName = 'OptimizedProtectedRoute';