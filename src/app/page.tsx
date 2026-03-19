'use client';

import React from 'react';
import Hero from '@/components/homepage/Hero';
import Features from '@/components/homepage/Features';
import HowItWorks from '@/components/homepage/HowItWorks';
import Testimonials from '@/components/homepage/Testimonials';
import CTA from '@/components/homepage/CTA';
import { AuthAwareHeader } from '@/components/navigation/AuthAwareHeader';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <AuthAwareHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
