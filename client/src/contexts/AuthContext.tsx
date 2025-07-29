import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Cache localStorage pour éviter les race conditions
const ROLE_CACHE_KEY = 'user_role_cache';
const ROLE_CACHE_EXPIRY_KEY = 'user_role_cache_expiry';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedRole = (userId: string): string | null => {
  try {
    const cached = localStorage.getItem(ROLE_CACHE_KEY);
    const expiry = localStorage.getItem(ROLE_CACHE_EXPIRY_KEY);
    
    if (cached && expiry) {
      const cacheData = JSON.parse(cached);
      const expiryTime = parseInt(expiry);
      
      if (cacheData.userId === userId && Date.now() < expiryTime) {
        return cacheData.role;
      }
    }
  } catch (error) {
    console.warn('Error reading role cache:', error);
  }
  return null;
};

const setCachedRole = (userId: string, role: string) => {
  try {
    localStorage.setItem(ROLE_CACHE_KEY, JSON.stringify({ userId, role }));
    localStorage.setItem(ROLE_CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
  } catch (error) {
    console.warn('Error setting role cache:', error);
  }
};

const clearRoleCache = () => {
  try {
    localStorage.removeItem(ROLE_CACHE_KEY);
    localStorage.removeItem(ROLE_CACHE_EXPIRY_KEY);
  } catch (error) {
    console.warn('Error clearing role cache:', error);
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Check for existing user session from localStorage
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('auth_user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('Restored user session:', parsedUser.email);
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      if (mounted) {
        setLoading(false);
      }
    };

    checkAuthState();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Login failed' } };
      }

      // Store user and token
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      localStorage.setItem('auth_token', 'authenticated'); // Simple token for now
      setUser(data.user);
      
      console.log('Login successful:', data.user.email);
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: { message: 'Network error during login' } };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: string = 'client') => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          role 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Registration failed' } };
      }

      console.log('Registration successful:', data.user.email);
      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: { message: 'Network error during registration' } };
    }
  };

  const signOut = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      clearRoleCache();
      
      // Clear state
      setUser(null);
      
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};