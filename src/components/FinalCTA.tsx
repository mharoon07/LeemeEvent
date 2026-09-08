'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FinalCTAProps {
  onStartClick: () => void;
}

export default function FinalCTA({ onStartClick }: FinalCTAProps) {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-sand border-t border-taupe/15 relative overflow-hidden text-center">
      {/* Background Arch Motif */}
      <div className="absolute inset-x-0 top-0 h-full max-w-5xl mx-auto opacity-40 pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[300px] border border-taupe/30 rounded-t-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-200 text-taupe text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.finalCTA.badge}</span>
          </span>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-charcoal tracking-tight text-balance leading-[1.15]">
            {t.finalCTA.titlePart1} <br className="hidden sm:inline" />
            <span className="text-taupe">{t.finalCTA.titlePart2}</span>
          </h2>

          <p className="text-base sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed text-balance">
            {t.finalCTA.subtext}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartClick}
              className="w-full sm:w-auto btn-primary px-8 py-4 text-base font-semibold flex items-center justify-center gap-3 group"
            >
              <Calendar className="w-5 h-5 text-sand" />
              <span>{t.finalCTA.button}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <p className="text-xs text-charcoal/60 pt-2">
            {t.finalCTA.guarantee}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
