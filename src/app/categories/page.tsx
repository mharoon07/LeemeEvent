'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';
import CombinedRequestModal from '@/components/CombinedRequestModal';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-sand text-charcoal font-sans selection:bg-taupe selection:text-sand">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      {/* Page Hero Banner */}
      <section className="pt-32 pb-16 bg-sand border-b border-taupe/15 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-200/80 border border-taupe/20 text-taupe text-xs font-classico tracking-[0.2em] uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Supplier Directory</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-classico text-4xl sm:text-6xl font-normal uppercase tracking-wide text-charcoal leading-tight"
          >
            All event specialists, <span className="font-serif-display lowercase italic font-normal text-taupe">in one directory.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
          >
            Explore 13 curated supplier categories featuring 800+ vetted event partners. Select any category to include in your combined proposal.
          </motion.p>
        </div>
      </section>

      {/* Main Categories Component */}
      <Categories onCategorySelect={() => setIsModalOpen(true)} />

      {/* Quality Vetting Showcase Section */}
      <section className="py-20 bg-sand-50/80 border-t border-taupe/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taupe/10 text-taupe text-xs font-classico tracking-[0.2em] uppercase mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Our Quality Promise</span>
          </div>

          <h2 className="font-classico text-3xl sm:text-4xl uppercase font-normal text-charcoal tracking-wide mb-4">
            Rigorous Partner Verification Standard
          </h2>

          <p className="text-sm sm:text-base text-charcoal/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every vendor in our directory passes strict evaluation for licensing, liability insurance, portfolio quality, and verified client testimonials.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-sand border border-taupe/20 rounded-2xl p-6">
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal mb-2">1. Vetted Portfolios</h3>
              <p className="text-xs text-charcoal/75">We review past event galleries, food hygiene ratings, and sound equipment standards.</p>
            </div>
            <div className="bg-sand border border-taupe/20 rounded-2xl p-6">
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal mb-2">2. Authentic Reviews</h3>
              <p className="text-xs text-charcoal/75">Reviews on LEEMEVENT come exclusively from verified clients who completed bookings.</p>
            </div>
            <div className="bg-sand border border-taupe/20 rounded-2xl p-6">
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal mb-2">3. Calendar Sync</h3>
              <p className="text-xs text-charcoal/75">Suppliers maintain active live calendars so you never inquire about booked dates.</p>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sand" />
              <span>Combine My Suppliers Now</span>
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
