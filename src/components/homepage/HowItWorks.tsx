import React from 'react';
import { Section, SectionHeading } from '@/components/ui/section';
import { Step } from '@/components/ui/step';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function HowItWorks() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex flex-col justify-center py-12 sm:py-16 md:py-20">
      <Section>
        <SectionHeading>Your Wellness Journey</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-6 sm:mt-8">
          <Step number={1} title="Sign Up" description="Create your secure account and complete a brief wellness assessment." />
          <Step number={2} title="Track Mood" description="Log your emotions daily to identify patterns and triggers." />
          <Step number={3} title="Connect" description="Chat with our AI assistant or schedule sessions with therapists." />
          <Step number={4} title="Grow" description="Build skills with personalized resources and track your progress." />
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Button onClick={() => router.push('/signup')} size="xl" className="w-full sm:w-auto">Start Your Journey</Button>
        </div>
      </Section>
    </section>
  );
}
