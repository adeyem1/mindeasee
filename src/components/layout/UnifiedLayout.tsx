'use client';

import React from 'react';
import { AuthAwareHeader } from '@/components/navigation/AuthAwareHeader';
import { Footer } from '@/components/footer';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function UnifiedLayout({ 
  children, 
  showFooter = true, 
  className = '' 
}: UnifiedLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthAwareHeader />
      
      <main className={`flex-1 pt-16 ${className}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}