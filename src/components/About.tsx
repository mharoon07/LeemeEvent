'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AboutProps {
  onLearnMoreClick: () => void;
}

export default function About({ onLearnMoreClick }: AboutProps) {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-28 bg-sand border-t border-taupe/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Wabi-Sabi Overlapping Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Large Editorial Image */}
              <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden border-2 border-sand-200 shadow-soft-lg">
                <Image
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop"
                  alt="Elegant Wabi-Sabi stone event table setting"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
              </div>

              {/* Overlapping Secondary Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-10 -right-4 sm:-right-8 w-3/5 h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border-4 border-sand shadow-soft-lg z-10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop"
                  alt="Bride holding organic floral bouquet"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </motion.div>

              {/* Decorative Warm Sand Backdrop Accent Badge */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-sand-200/60 -z-10 blur-xl pointer-events-none" />
              <div className="absolute top-1/2 -left-8 bg-sand-50/90 backdrop-blur-md border border-taupe/20 p-4 rounded-2xl shadow-soft-md z-20 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-taupe/15 flex items-center justify-center text-taupe">
                  <Heart className="w-5 h-5 fill-taupe" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-classico tracking-wider uppercase font-bold text-charcoal">
                    {t.about.wabiSabiTitle}
                  </span>
                  <span className="block text-[11px] text-charcoal/70">
                    {t.about.wabiSabiDesc}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Brand Narrative Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 space-y-6 pt-6 lg:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-taupe/10 text-taupe text-xs tracking-wider uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.about.tag}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight leading-[1.15] text-balance">
              {t.about.titlePart1}{' '}
              <span className="text-taupe">
                {t.about.titlePart2}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed">
              {t.about.p1}
            </p>

            <p className="text-sm sm:text-base text-charcoal/70 leading-relaxed">
              {t.about.p2} <strong>{t.about.highlight}</strong>
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-taupe shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/85">
                  <strong>{t.about.bullet1Title}</strong> {t.about.bullet1Desc}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-taupe shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/85">
                  <strong>{t.about.bullet2Title}</strong> {t.about.bullet2Desc}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-taupe shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal/85">
                  <strong>{t.about.bullet3Title}</strong> {t.about.bullet3Desc}
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onLearnMoreClick}
                className="btn-primary px-6 py-3 text-sm flex items-center gap-2 group"
              >
                <span>{t.about.ctaBtn}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
