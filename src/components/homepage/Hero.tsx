"use client";

import React from 'react';
import { HeroSection } from '@/components/hero-section';
import { useAuthStore } from '@/store/authStore';

export default function Hero() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="min-h-screen flex items-center">
      <HeroSection
        title="The only AI that Understands Your Emotion 😉"
        description="MindEase offers AI-assisted mental health support, professionally-guided therapy, and personalized resources to help you thrive."
        primaryButtonText={!isAuthenticated ? 'Get Started' : undefined}
        primaryButtonLink={!isAuthenticated ? '/signup' : undefined}
        secondaryButtonText="Find a Therapist"
        secondaryButtonLink="/therapists"
        image={
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full flex items-center justify-center mt-8 sm:mt-0">
            <div className="w-full h-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg glass rounded-2xl sm:rounded-3xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-kelly-green/30 to-citrine/30 dark:from-kelly-green/20 dark:to-citrine/20 rounded-2xl sm:rounded-3xl" />
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold relative z-10 text-center px-4">MindEase</div>
            </div>
          </div>
        }
      />
    </section>
  );
}
