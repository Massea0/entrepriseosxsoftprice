// 🚀 PHASE 5 - COMPOSANT DE NAVIGATION SÉCURISÉ
import React, { startTransition } from "react";
import { useNavigate } from "react-router-dom";

interface SecureNavigationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SecureNavigation({ children, fallback }: SecureNavigationProps) {
  const navigate = useNavigate();

  // Wrapper pour navigation sécurisée avec startTransition
  const handleSecureNavigation = (to: string) => {
    startTransition(() => {
      navigate(to);
    });
  };

  // Cloner les enfants et injecter la navigation sécurisée
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        secureNavigate: handleSecureNavigation,
      });
    }
    return child;
  });

  return (
    <React.Suspense 
      fallback={
        fallback || (
          <div className="flex items-center justify-center h-64">
            <div className=" rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Chargement sécurisé...</span>
          </div>
        )
      }
    >
      {enhancedChildren}
    </React.Suspense>
  );
}