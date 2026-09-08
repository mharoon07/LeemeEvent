'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Categories from '@/components/Categories';
import Footer from '@/components/Footer';
import CombinedRequestModal from '@/components/CombinedRequestModal';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

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
            <span>{t.categories.tag}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-charcoal leading-tight"
          >
            {t.categories.titlePart1}{' '}
            <span className="text-taupe">
              {t.categories.titlePart2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
          >
            {t.categories.subtext}
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
            <span>{t.categories.vetting.tag}</span>
          </div>

          <h2 className="font-classico text-3xl sm:text-4xl uppercase font-normal text-charcoal tracking-wide mb-4">
            {t.categories.vetting.title}
          </h2>

          <p className="text-sm sm:text-base text-charcoal/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.categories.vetting.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="bg-sand border border-taupe/20 rounded-2xl p-6">
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal mb-2">
                {t.categories.vetting.point1Title}
              </h3>
              <p className="text-xs text-charcoal/75">
                {t.categories.vetting.point1Desc}
              </p>
            </div>
            <div className="bg-sand border border-taupe/20 rounded-2xl p-6">
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal mb-2">
                {t.categories.vetting.point2Title}
              </h3>
              <p className="text-xs text-charcoal/75">
                {t.categories.vetting.point2Desc}
              </p>
            </div>
            <div className="bg-sand border border-taupe/20 rounded-2xl p-6">
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal mb-2">
                {t.categories.vetting.point3Title}
              </h3>
              <p className="text-xs text-charcoal/75">
                {t.categories.vetting.point3Desc}
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sand" />
              <span>{t.categories.vetting.ctaBtn}</span>
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
