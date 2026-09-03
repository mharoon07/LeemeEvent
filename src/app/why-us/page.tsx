'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ValueProps from '@/components/ValueProps';
import Footer from '@/components/Footer';
import CombinedRequestModal from '@/components/CombinedRequestModal';
import { motion } from 'framer-motion';
import { Sparkles, Check, X } from 'lucide-react';

export default function WhyUsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-sand text-charcoal font-sans selection:bg-taupe selection:text-sand">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      {/* Page Hero Header */}
      <section className="pt-32 pb-16 bg-sand border-b border-taupe/15 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-200/80 border border-taupe/20 text-taupe text-xs font-classico tracking-[0.2em] uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why Choose LEEMEVENT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-classico text-4xl sm:text-6xl font-normal uppercase tracking-wide text-charcoal leading-tight"
          >
            Event planning, <span className="font-serif-display lowercase italic font-normal text-taupe">without the chaos.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
          >
            Planning a celebration should bring joy, not overwhelm. Discover how LEEMEVENT transforms multi-vendor event coordination into one seamless, elegant experience.
          </motion.p>
        </div>
      </section>

      {/* Value Propositions Grid */}
      <ValueProps />

      {/* Comparison Table Section: Traditional vs LEEMEVENT */}
      <section className="py-20 bg-sand-50/80 border-t border-taupe/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block mb-2 font-semibold">
              The Difference
            </span>
            <h2 className="font-classico text-3xl sm:text-4xl uppercase font-normal text-charcoal tracking-wide">
              Traditional Planning vs. The LEEMEVENT Way
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Way */}
            <div className="bg-sand border border-taupe/20 rounded-3xl p-8 shadow-soft-sm relative">
              <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-classico tracking-wider uppercase font-semibold mb-6">
                Traditional Event Planning
              </div>
              <ul className="space-y-4 text-sm text-charcoal/80">
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Emailing 15+ individual vendor websites separately</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Juggling disconnected contracts, invoices & payment schedules</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Uncertain supplier quality and unverified online reviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>No central coordinator to align timelines between caterers, venue & DJ</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>Constant back-and-forth calendar checking for date availability</span>
                </li>
              </ul>
            </div>

            {/* LEEMEVENT Way */}
            <div className="bg-sand-100 border-2 border-taupe rounded-3xl p-8 shadow-soft-lg relative">
              <div className="inline-block px-3 py-1 rounded-full bg-taupe/20 text-taupe text-xs font-classico tracking-wider uppercase font-semibold mb-6">
                The LEEMEVENT Solution
              </div>
              <ul className="space-y-4 text-sm text-charcoal/90">
                <li className="flex items-start gap-3 font-medium">
                  <Check className="w-5 h-5 text-taupe shrink-0 mt-0.5 stroke-[3]" />
                  <span>1 single combined request for venue, catering, photo, DJ & decor</span>
                </li>
                <li className="flex items-start gap-3 font-medium">
                  <Check className="w-5 h-5 text-taupe shrink-0 mt-0.5 stroke-[3]" />
                  <span>1 consolidated proposal, 1 agreement, and 1 clear deposit payment</span>
                </li>
                <li className="flex items-start gap-3 font-medium">
                  <Check className="w-5 h-5 text-taupe shrink-0 mt-0.5 stroke-[3]" />
                  <span>100% vetted & verified luxury suppliers with real client ratings</span>
                </li>
                <li className="flex items-start gap-3 font-medium">
                  <Check className="w-5 h-5 text-taupe shrink-0 mt-0.5 stroke-[3]" />
                  <span>Dedicated event matchmaker supervising logistics and day-of execution</span>
                </li>
                <li className="flex items-start gap-3 font-medium">
                  <Check className="w-5 h-5 text-taupe shrink-0 mt-0.5 stroke-[3]" />
                  <span>Real-time live calendar synchronization across all selected partners</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-8 py-3.5 text-base flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4 text-sand" />
              <span>Start Your Combined Request</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <CombinedRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
