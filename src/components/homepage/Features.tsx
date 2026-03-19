import React from 'react';
import { Section, SectionHeading } from '@/components/ui/section';
import { FeatureCard } from '@/components/ui/feature-card';
import { FiMessageSquare, FiCalendar, FiBookOpen } from 'react-icons/fi';

export default function Features() {
  return (
    <section className="min-h-screen flex items-center py-12 sm:py-16 md:py-20">
      <Section className="w-full">
        <SectionHeading>How MindEase Supports You</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
          <FeatureCard
            title="AI Chat Support"
            description="24/7 AI-powered chat assistant to provide immediate emotional support and coping strategies."
            icon={<FiMessageSquare className="h-8 w-8" />}
            link="/chat"
            linkText="Try It Now"
            glass
          />

          <FeatureCard
            title="Therapy Sessions"
            description="Connect with licensed therapists for video or in-person sessions tailored to your needs."
            icon={<FiCalendar className="h-8 w-8" />}
            link="/therapists"
            linkText="Book a Session"
            glass
          />

          <FeatureCard
            title="Wellness Resources"
            description="Access a library of articles, videos, and exercises curated by mental health professionals."
            icon={<FiBookOpen className="h-8 w-8" />}
            link="/resources"
            linkText="Explore Resources"
            glass
          />
        </div>
      </Section>
    </section>
  );
}
