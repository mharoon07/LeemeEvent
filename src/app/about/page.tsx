'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Footer from '@/components/Footer';
import CombinedRequestModal from '@/components/CombinedRequestModal';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Shield, Award, Users2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
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
            <span>{t.about.pageHeroTag}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-classico text-4xl sm:text-6xl font-normal uppercase tracking-wide text-charcoal leading-tight"
          >
            {t.about.pageHeroTitlePart1}{' '}
            <span className="font-serif-display lowercase italic font-normal text-taupe">
              {t.about.pageHeroTitlePart2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
          >
            {t.about.pageHeroSubtext}
          </motion.p>
        </div>
      </section>

      {/* Wabi-Sabi About Story Component */}
      <About onLearnMoreClick={() => setIsModalOpen(true)} />

      {/* Core Principles Section */}
      <section className="py-20 bg-sand-50/80 border-t border-taupe/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block mb-2 font-semibold">
              {t.about.principlesTag}
            </span>
            <h2 className="font-classico text-3xl sm:text-4xl uppercase font-normal text-charcoal tracking-wide">
              {t.about.principlesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-sand border border-taupe/20 rounded-3xl p-6 text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center">
                <Heart className="w-6 h-6 fill-taupe" />
              </div>
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal">
                {t.about.principles.warmthTitle}
              </h3>
              <p className="text-xs text-charcoal/75 leading-relaxed">
                {t.about.principles.warmthDesc}
              </p>
            </div>

            <div className="bg-sand border border-taupe/20 rounded-3xl p-6 text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal">
                {t.about.principles.excellenceTitle}
              </h3>
              <p className="text-xs text-charcoal/75 leading-relaxed">
                {t.about.principles.excellenceDesc}
              </p>
            </div>

            <div className="bg-sand border border-taupe/20 rounded-3xl p-6 text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal">
                {t.about.principles.agreementTitle}
              </h3>
              <p className="text-xs text-charcoal/75 leading-relaxed">
                {t.about.principles.agreementDesc}
              </p>
            </div>

            <div className="bg-sand border border-taupe/20 rounded-3xl p-6 text-left space-y-3">
              <div className="w-12 h-12 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal">
                {t.about.principles.conciergeTitle}
              </h3>
              <p className="text-xs text-charcoal/75 leading-relaxed">
                {t.about.principles.conciergeDesc}
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sand" />
              <span>{t.about.planWithUs}</span>
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
