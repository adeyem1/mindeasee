'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  requireAuth = false, 
  redirectTo 
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If route requires authentication but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/signin');
      return;
    }

    // If user is authenticated but tries to access auth pages
    if (!requireAuth && isAuthenticated && 
        (pathname === '/signin' || pathname === '/signup' || pathname === '/forgot-password')) {
      router.push('/chat');
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, pathname, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If route requires authentication but user is not authenticated, show loading
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated but tries to access auth pages, show loading
  if (!requireAuth && isAuthenticated && 
      (pathname === '/signin' || pathname === '/signup' || pathname === '/forgot-password')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}