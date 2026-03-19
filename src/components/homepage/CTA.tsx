"use client";

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CTA() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="min-h-screen flex items-center py-12 sm:py-16 md:py-20">
      <Section className="bg-primary text-white w-full">
        <div className="text-center py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">Ready to Start Your Mental Wellness Journey?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">Join thousands of users who have improved their mental health with MindEase&apos;s integrated approach.</p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center max-w-md sm:max-w-none mx-auto">
            {!isAuthenticated && (
              <Button onClick={() => router.push('/signup')} variant="glass" size="xl" className="bg-citrine text-primary hover:bg-citrine/80 w-full sm:w-auto">Create Account</Button>
            )}
            <Button onClick={() => router.push('/chat')} variant="outline" size="xl" className="bg-transparent border-citrine text-white hover:bg-white/20 w-full sm:w-auto">Try AI Chat Now</Button>
          </div>
        </div>
      </Section>
    </section>
  );
}
