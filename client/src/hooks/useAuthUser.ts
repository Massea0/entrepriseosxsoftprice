import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  // From user_metadata
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  preferred_language?: string;
  theme?: string;
  // From app_metadata
  role?: string;
  is_active?: boolean;
  department?: string;
  company_id?: string;
  mfa_enabled?: boolean;
  permissions?: string[];
  locked_until?: string;
  password_change_required?: boolean;
  // Computed
  full_name?: string;
  initials?: string;
}

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUserMetadata = async (updates: Partial<AuthUser>) => {
    const userMetadata: any = {};
    const appMetadata: any = {};

    // Sort updates into correct metadata buckets
    if (updates.first_name !== undefined) userMetadata.first_name = updates.first_name;
    if (updates.last_name !== undefined) userMetadata.last_name = updates.last_name;
    if (updates.phone !== undefined) userMetadata.phone = updates.phone;
    if (updates.avatar_url !== undefined) userMetadata.avatar_url = updates.avatar_url;
    if (updates.preferred_language !== undefined) userMetadata.preferred_language = updates.preferred_language;
    if (updates.theme !== undefined) userMetadata.theme = updates.theme;

    // App metadata requires admin API - these would be updated via admin console
    if (updates.role || updates.is_active !== undefined || updates.department || updates.company_id) {
      console.warn('Role, is_active, department, and company_id must be updated via admin API');
    }

    // Update user metadata
    if (Object.keys(userMetadata).length > 0) {
      const { data, error } = await supabase.auth.updateUser({
        data: userMetadata
      });

      if (!error && data.user) {
        setUser(mapSupabaseUser(data.user));
        return { success: true };
      }

      return { success: false, error };
    }

    return { success: true };
  };

  const hasRole = (role: string | string[]) => {
    if (!user?.role) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string) => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  const isAdmin = () => hasRole(['admin', 'super_admin']);
  const isManager = () => hasRole(['manager', 'hr_manager']) || isAdmin();

  return {
    user,
    loading,
    updateUserMetadata,
    hasRole,
    hasPermission,
    isAdmin,
    isManager
  };
}

// Helper function to map Supabase user to our AuthUser interface
function mapSupabaseUser(supabaseUser: User): AuthUser {
  const { id, email, user_metadata, app_metadata } = supabaseUser;
  
  const first_name = user_metadata?.first_name || '';
  const last_name = user_metadata?.last_name || '';
  
  return {
    id,
    email: email || '',
    // User metadata
    first_name,
    last_name,
    phone: user_metadata?.phone,
    avatar_url: user_metadata?.avatar_url,
    preferred_language: user_metadata?.preferred_language,
    theme: user_metadata?.theme,
    // App metadata
    role: app_metadata?.role || 'client',
    is_active: app_metadata?.is_active ?? true,
    department: app_metadata?.department,
    company_id: app_metadata?.company_id,
    mfa_enabled: app_metadata?.mfa_enabled || false,
    permissions: app_metadata?.permissions || [],
    locked_until: app_metadata?.locked_until,
    password_change_required: app_metadata?.password_change_required || false,
    // Computed
    full_name: [first_name, last_name].filter(Boolean).join(' '),
    initials: (first_name?.[0] || '') + (last_name?.[0] || '')
  };
}