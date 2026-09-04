'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Store, TrendingUp, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SupplierBannerProps {
  onSupplierClick: () => void;
}

export default function SupplierBanner({ onSupplierClick }: SupplierBannerProps) {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-sand border-t border-taupe/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-sand-200/70 border border-taupe/30 rounded-3xl p-8 sm:p-12 shadow-soft-lg overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Subtle Background Graphic */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-taupe/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text */}
          <div className="max-w-2xl text-left space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-taupe/15 text-taupe text-xs font-semibold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>{t.supplierBanner.tag}</span>
            </div>

            <h3 className="font-serif-display text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
              {t.supplierBanner.titlePart1} <br className="hidden sm:inline" />
              <span className="italic text-taupe font-normal">{t.supplierBanner.titlePart2}</span>
            </h3>

            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed">
              {t.supplierBanner.subtext}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-medium text-charcoal/90">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-taupe shrink-0" />
                <span>{t.supplierBanner.perk1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-taupe shrink-0" />
                <span>{t.supplierBanner.perk2}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-taupe shrink-0" />
                <span>{t.supplierBanner.perk3}</span>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 relative z-10 w-full sm:w-auto">
            <button
              onClick={onSupplierClick}
              className="w-full sm:w-auto btn-primary px-8 py-4 text-base font-semibold flex items-center justify-center gap-3 group"
            >
              <span>{t.supplierBanner.ctaBtn}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
