'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { TenantConfig, Module } from '@/types/tenant';

interface TenantContextValue {
  tenant: TenantConfig | null;
  loading: boolean;
  error: Error | null;
  modules: Module[];
  hasModule: (moduleId: string) => boolean;
  hasPermission: (permission: string) => boolean;
  updateTheme: (theme: Partial<TenantConfig['theme']>) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  initialConfig?: TenantConfig;
}

export function TenantProvider({ children, initialConfig }: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantConfig | null>(initialConfig || null);
  const [loading, setLoading] = useState(!initialConfig);
  const [error, setError] = useState<Error | null>(null);

  // Load tenant configuration
  const loadTenantConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would fetch from API
      // For now, we'll use mock data
      const mockConfig: TenantConfig = {
        id: 'demo-tenant',
        name: 'Demo Company',
        domain: 'demo.enterprise-saas.com',
        subdomain: 'demo',
        timezone: 'UTC',
        locale: 'fr-FR',
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        plan: 'professional',
        limits: {
          users: 50,
          storage: 100,
          apiCalls: 100000,
          customFields: 50,
          integrations: 5
        },
        modules: {
          dashboard: { enabled: true },
          employees: { enabled: true },
          projects: { enabled: true },
          tasks: { enabled: true },
          invoicing: { enabled: true }
        },
        theme: {
          primary: '59 130 246',
          secondary: '107 114 128',
          accent: '139 92 246',
          borderRadius: 'md',
          shadowIntensity: 'md',
          defaultTheme: 'light'
        },
        settings: {
          twoFactorRequired: false,
          ssoEnabled: false,
          sessionTimeout: 30
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        onboardingCompleted: true,
        isActive: true
      };
      
      setTenant(mockConfig);
      applyTheme(mockConfig.theme);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tenant config'));
    } finally {
      setLoading(false);
    }
  };

  // Apply theme to CSS variables
  const applyTheme = (theme: TenantConfig['theme']) => {
    const root = document.documentElement;
    
    // Apply color variables
    if (theme.primary) {
      root.style.setProperty('--color-primary', theme.primary);
    }
    if (theme.secondary) {
      root.style.setProperty('--color-secondary', theme.secondary);
    }
    if (theme.accent) {
      root.style.setProperty('--color-accent', theme.accent);
    }
    
    // Apply scale variables
    if (theme.fontSizeScale) {
      root.style.setProperty('--font-scale', theme.fontSizeScale.toString());
    }
    if (theme.spacingScale) {
      root.style.setProperty('--spacing-scale', theme.spacingScale.toString());
    }
    
    // Apply component variables
    if (theme.borderRadius) {
      const radiusMap = {
        none: '0',
        sm: '0.5',
        md: '1',
        lg: '1.5',
        full: '999'
      };
      root.style.setProperty('--radius-scale', radiusMap[theme.borderRadius]);
    }
    
    if (theme.shadowIntensity) {
      const shadowMap = {
        none: '0',
        sm: '0.5',
        md: '1',
        lg: '1.5'
      };
      root.style.setProperty('--shadow-intensity', shadowMap[theme.shadowIntensity]);
    }
    
    // Apply custom font if provided
    if (theme.fontFamily) {
      root.style.setProperty('--font-family-sans', theme.fontFamily);
    }
  };

  // Get active modules
  const getActiveModules = (): Module[] => {
    if (!tenant) return [];
    
    // Import module registry
    const { AVAILABLE_MODULES } = require('@/types/tenant');
    
    return Object.entries(tenant.modules)
      .filter(([_, config]) => config.enabled)
      .map(([moduleId]) => AVAILABLE_MODULES[moduleId])
      .filter(Boolean);
  };

  // Check if tenant has a specific module
  const hasModule = (moduleId: string): boolean => {
    if (!tenant) return false;
    return tenant.modules[moduleId]?.enabled === true;
  };

  // Check if current user has permission
  const hasPermission = (permission: string): boolean => {
    // This would typically check against the current user's permissions
    // For now, we'll assume all permissions are granted
    return true;
  };

  // Update theme
  const updateTheme = async (themeUpdate: Partial<TenantConfig['theme']>) => {
    if (!tenant) return;
    
    const newTheme = { ...tenant.theme, ...themeUpdate };
    const newConfig = { ...tenant, theme: newTheme };
    
    // In a real app, this would save to API
    setTenant(newConfig);
    applyTheme(newTheme);
  };

  // Refresh configuration
  const refreshConfig = async () => {
    await loadTenantConfig();
  };

  // Load config on mount
  useEffect(() => {
    if (!initialConfig) {
      loadTenantConfig();
    }
  }, [initialConfig]);

  const value: TenantContextValue = {
    tenant,
    loading,
    error,
    modules: getActiveModules(),
    hasModule,
    hasPermission,
    updateTheme,
    refreshConfig
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

// Hook to use tenant context
export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Hook to get tenant theme
export function useTenantTheme() {
  const { tenant } = useTenant();
  return tenant?.theme || null;
}

// Hook to check module availability
export function useModule(moduleId: string) {
  const { hasModule, hasPermission } = useTenant();
  return {
    isEnabled: hasModule(moduleId),
    hasPermission: (permission: string) => hasPermission(`${moduleId}.${permission}`)
  };
}