import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  switch (user.role) {
    case 'admin':
    case 'super_admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'manager':
      return <Navigate to="/business/dashboard" replace />;
    case 'client':
      return <Navigate to="/client/dashboard" replace />;
    case 'employee':
      return <Navigate to="/employee/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default Index;
