// 🚀 PHASE 4 - COMPOSANTS DE CHARGEMENT OPTIMISÉS
import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ===============================
// LOADING SKELETONS SPÉCIALISÉS
// ===============================

interface LoadingSkeletonProps {
  className?: string;
}

export function PageLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      {/* Content skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Table header */}
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-28" />
      </div>
      
      {/* Table rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
      ))}
    </div>
  );
}

export function DashboardLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-lg border p-4 space-y-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

export function FormLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// ===============================
// LOADING WRAPPER AVEC TRANSITIONS
// ===============================

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<LoadingSkeletonProps>;
  className?: string;
}

export function LazyLoadWrapper({ 
  children, 
  fallback: Fallback = PageLoadingSkeleton,
  className 
}: LazyLoadWrapperProps) {
  return (
    <div className={cn("animate-fade-in", className)}>
      <React.Suspense fallback={<Fallback />}>
        {children}
      </React.Suspense>
    </div>
  );
}

// ===============================
// HOC POUR LAZY LOADING
// ===============================

export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  LoadingSkeleton: React.ComponentType<LoadingSkeletonProps> = PageLoadingSkeleton
) {
  return function LazyComponent(props: P) {
    return (
      <LazyLoadWrapper fallback={LoadingSkeleton}>
        <Component {...props} />
      </LazyLoadWrapper>
    );
  };
}