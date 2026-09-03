'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { SearchState } from '@/components/SearchWidget';
import ValueProps from '@/components/ValueProps';
import HowItWorks from '@/components/HowItWorks';
import Categories from '@/components/Categories';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import SupplierBanner from '@/components/SupplierBanner';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();

  const handleOpenStartEvent = () => {
    router.push('/login');
  };

  const handleSearchSubmit = (searchParams: SearchState) => {
    router.push('/login');
  };

  const handleCategorySelect = (categoryId: string) => {
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-sand text-charcoal font-sans selection:bg-taupe selection:text-sand overflow-x-hidden">
      {/* Top Global Navigation Bar */}
      <Navbar onOpenModal={handleOpenStartEvent} />

      {/* Hero Section with Left Vertical Navigation Bar embedded */}
      <Hero onSearchSubmit={handleSearchSubmit} />

      {/* "Why LEEMEVENTS" Value Proposition Section */}
      <ValueProps />

      {/* "How It Works" 7-Step Process Timeline */}
      <HowItWorks onStartClick={handleOpenStartEvent} />

      {/* Categories / Services Grid (13 Categories) */}
      <Categories onCategorySelect={handleCategorySelect} />

      {/* About Split Section (Wabi-Sabi Overlapping Photos & Brand Story) */}
      <About onLearnMoreClick={handleOpenStartEvent} />

      {/* Testimonials 3-Card Carousel */}
      <Testimonials />

      {/* Supplier CTA Partner Acquisition Banner */}
      <SupplierBanner onSupplierClick={handleOpenStartEvent} />

      {/* Final Warm-Toned Call-to-Action Section */}
      <FinalCTA onStartClick={handleOpenStartEvent} />

      {/* Comprehensive Footer */}
      <Footer />
    </main>
  );
}
