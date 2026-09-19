import React from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroSection } from '../components/landing/HeroSection';
import { BasinTrustRibbon } from '../components/landing/BasinTrustRibbon';
import { DemoModulesGrid } from '../components/landing/DemoModulesGrid';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090b0f] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Demo Navigation Bar */}
      <LandingNav />

      {/* Hero Section with 1-Click Launch & Interactive Rig Mockup */}
      <main className="flex-1">
        <HeroSection />
        
        {/* Basin & PSU Trust Bar */}
        <BasinTrustRibbon />
        
        {/* 4 Core SIH26121 Interactive Evaluation Modules */}
        <DemoModulesGrid />
      </main>

      {/* Sleek Compact Evaluation Footer */}
      <LandingFooter />
    </div>
  );
}
