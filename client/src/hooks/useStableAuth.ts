import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook optimisé pour éviter les re-rendus inutiles liés à l'authentification
 * Utilise useMemo pour stabiliser les références d'objets
 */
export const useStableAuth = () => {
  const authContext = useAuth();
  
  // Stabiliser la référence de l'objet user
  const stableUser = useMemo(() => {
    if (!authContext.user) return null;
    return {
      ...authContext.user,
      // S'assurer que toutes les propriétés sont stables
      id: authContext.user.id,
      email: authContext.user.email,
      role: authContext.user.role,
      firstName: authContext.user.firstName,
      lastName: authContext.user.lastName,
      isActive: authContext.user.isActive,
      createdAt: authContext.user.createdAt
    };
  }, [
    authContext.user?.id,
    authContext.user?.email,
    authContext.user?.role,
    authContext.user?.firstName,
    authContext.user?.lastName,
    authContext.user?.isActive,
    authContext.user?.createdAt
  ]);

  // Mémoriser les méthodes pour éviter de recréer les fonctions
  const stableSignIn = useMemo(() => authContext.signIn, []);
  const stableSignOut = useMemo(() => authContext.signOut, []);
  const stableSignUp = useMemo(() => authContext.signUp, []);

  return {
    user: stableUser,
    loading: authContext.loading,
    signIn: stableSignIn,
    signOut: stableSignOut,
    signUp: stableSignUp,
  };
};