import React from 'react';
import { Section, SectionHeading } from '@/components/ui/section';
import { TestimonialCard } from '@/components/ui/testimonial-card';

export default function Testimonials() {
  return (
    <section className="min-h-screen flex items-center py-12 sm:py-16 md:py-20">
      <Section className="bg-muted/30 w-full">
        <SectionHeading>What Our Users Say</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
          <TestimonialCard
            name="Alex T."
            text="The AI chat feature was there for me at 2 AM when I was having a panic attack. It guided me through breathing exercises and helped me calm down."
            glass
          />

          <TestimonialCard
            name="Jamie R."
            text="Finding a therapist through MindEase was so easy. The matching process was spot-on, and I've been seeing my therapist for 6 months now with great progress."
            glass
          />

          <TestimonialCard
            name="Morgan L."
            text="The resources section has taught me so much about managing my anxiety. The guided meditations have become part of my daily routine."
            glass
          />
        </div>
      </Section>
    </section>
  );
}
