import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsStrip from '../components/home/StatsStrip';
import WhyChooseMercury from '../components/home/WhyChooseMercury';
import ServicesOverview from '../components/home/ServicesOverview';
import BeforeAfterSlider from '../components/home/BeforeAfterSlider';
import QuickPriceEstimator from '../components/home/QuickPriceEstimator';
import HowItWorks from '../components/home/HowItWorks';
import PromotionalBanner from '../components/home/PromotionalBanner';
import TestimonialsCarousel from '../components/home/TestimonialsCarousel';
import FaqAccordion from '../components/home/FaqAccordion';

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsStrip />
      <WhyChooseMercury />
      <ServicesOverview />
      <BeforeAfterSlider />
      <QuickPriceEstimator />
      <HowItWorks />
      <PromotionalBanner />
      <TestimonialsCarousel />
      <FaqAccordion />
    </div>
  );
}
