import React from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroSection } from '../components/landing/HeroSection';
import { BasinTrustRibbon } from '../components/landing/BasinTrustRibbon';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { FieldTestimonial } from '../components/landing/FieldTestimonial';
import { DarkIntegrationSection } from '../components/landing/DarkIntegrationSection';
import { FaqSection } from '../components/landing/FaqSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090b0f] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Blueprint Navigation Bar */}
      <LandingNav />

      {/* Hero Section with Interactive Application Mockup */}
      <main className="flex-1">
        <HeroSection />
        
        {/* Basin & PSU Trust Bar */}
        <BasinTrustRibbon />
        
        {/* Key Architectural Pillars (Auditable from start to finish, dual scoring, decay index) */}
        <FeaturesSection />

        {/* Chief Drilling Superintendent Testimonial */}
        <FieldTestimonial />

        {/* Atmospheric Dark Integration & PSU Data Sovereignty Section */}
        <DarkIntegrationSection />

        {/* Technical & Regulatory Validation FAQ */}
        <FaqSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
