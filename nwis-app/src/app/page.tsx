import React from 'react';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroSection } from '../components/landing/HeroSection';
import { BasinTrustRibbon } from '../components/landing/BasinTrustRibbon';
import { DemoModulesGrid } from '../components/landing/DemoModulesGrid';
import { WorkflowComparisonSection } from '../components/landing/WorkflowComparisonSection';
import { GovernanceFrameworkSection } from '../components/landing/GovernanceFrameworkSection';
import { DarkIntegrationSection } from '../components/landing/DarkIntegrationSection';
import { FaqSection } from '../components/landing/FaqSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#090b0f] text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Demo Navigation Bar */}
      <LandingNav />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* Interactive Hero Section with Live Terminal Simulation & Executive Metrics */}
        <HeroSection />
        
        {/* Basin & PSU Trust Bar */}
        <BasinTrustRibbon />
        
        {/* 6 Balanced Operational Modules */}
        <DemoModulesGrid />

        {/* Operational Workflow: Conventional Reactive vs NWIS Real-Time Companion */}
        <WorkflowComparisonSection />

        {/* PSU Governance & Safety Boundary Framework */}
        <GovernanceFrameworkSection />

        {/* Data Architecture & Zero Boundary Creep */}
        <DarkIntegrationSection />

        {/* Technical Validation FAQ */}
        <FaqSection />
      </main>

      {/* Sleek Compact Evaluation Footer */}
      <LandingFooter />
    </div>
  );
}
