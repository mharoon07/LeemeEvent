'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ValueProps from '@/components/ValueProps';
import Footer from '@/components/Footer';
import CombinedRequestModal from '@/components/CombinedRequestModal';
import { motion } from 'framer-motion';
import { Sparkles, Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function WhyUsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

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
            <span>{t.valueProps.tag}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-classico text-4xl sm:text-6xl font-normal uppercase tracking-wide text-charcoal leading-tight"
          >
            {t.valueProps.titlePart1}{' '}
            <span className="font-serif-display lowercase italic font-normal text-taupe">
              {t.valueProps.titlePart2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
          >
            {t.valueProps.subtext}
          </motion.p>
        </div>
      </section>

      {/* Value Propositions Grid */}
      <ValueProps />

      {/* Comparison Table Section: Traditional vs LEEMEVENTS */}
      <section className="py-20 bg-sand-50/80 border-t border-taupe/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block mb-2 font-semibold">
              {t.valueProps.comparison.tag}
            </span>
            <h2 className="font-classico text-3xl sm:text-4xl uppercase font-normal text-charcoal tracking-wide">
              {t.valueProps.comparison.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Way */}
            <div className="bg-sand border border-taupe/20 rounded-3xl p-8 shadow-soft-sm relative">
              <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-classico tracking-wider uppercase font-semibold mb-6">
                {t.valueProps.comparison.traditionalTitle}
              </div>
              <ul className="space-y-4 text-sm text-charcoal/80">
                {t.valueProps.comparison.traditionalPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEEMEVENTS Way */}
            <div className="bg-sand-100 border-2 border-taupe rounded-3xl p-8 shadow-soft-lg relative">
              <div className="inline-block px-3 py-1 rounded-full bg-taupe/20 text-taupe text-xs font-classico tracking-wider uppercase font-semibold mb-6">
                {t.valueProps.comparison.leemeventsTitle}
              </div>
              <ul className="space-y-4 text-sm text-charcoal/90">
                {t.valueProps.comparison.leemeventsPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 font-medium">
                    <Check className="w-5 h-5 text-taupe shrink-0 mt-0.5 stroke-[3]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-8 py-3.5 text-base flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4 text-sand" />
              <span>{t.valueProps.comparison.ctaBtn}</span>
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
