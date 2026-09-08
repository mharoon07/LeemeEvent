'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, HeartHandshake, Zap, CalendarCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ValueProps() {
  const { t } = useLanguage();

  const valuePropsData = [
    {
      icon: Layers,
      title: t.valueProps.items.singleRequest.title,
      description: t.valueProps.items.singleRequest.description,
      tag: t.valueProps.items.singleRequest.tag,
    },
    {
      icon: ShieldCheck,
      title: t.valueProps.items.verifiedPartners.title,
      description: t.valueProps.items.verifiedPartners.description,
      tag: t.valueProps.items.verifiedPartners.tag,
    },
    {
      icon: HeartHandshake,
      title: t.valueProps.items.concierge.title,
      description: t.valueProps.items.concierge.description,
      tag: t.valueProps.items.concierge.tag,
    },
    {
      icon: Zap,
      title: t.valueProps.items.instantQuotes.title,
      description: t.valueProps.items.instantQuotes.description,
      tag: t.valueProps.items.instantQuotes.tag,
    },
    {
      icon: CalendarCheck,
      title: t.valueProps.items.liveCalendar.title,
      description: t.valueProps.items.liveCalendar.description,
      tag: t.valueProps.items.liveCalendar.tag,
    },
  ];

  return (
    <section id="why-us" className="py-28 bg-sand border-t border-taupe/15 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs tracking-wider uppercase text-taupe block mb-3 font-bold">
            {t.valueProps.tag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight text-balance">
            {t.valueProps.titlePart1}{' '}
            <span className="text-taupe">
              {t.valueProps.titlePart2}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-charcoal/70 leading-relaxed text-balance">
            {t.valueProps.subtext}
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valuePropsData.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-sand-50/90 border border-taupe/20 rounded-3xl p-8 shadow-soft-sm hover:shadow-soft-lg hover:border-taupe/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-taupe/10 text-taupe flex items-center justify-center group-hover:bg-taupe group-hover:text-sand transition-all duration-300">
                      <Icon className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <span className="text-[10px] font-classico tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-sand-200 text-taupe font-semibold">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-classico text-xl uppercase tracking-wider font-semibold text-charcoal mb-3 group-hover:text-taupe transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-charcoal/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-taupe/10 flex items-center text-xs font-classico tracking-wider uppercase font-semibold text-taupe group-hover:translate-x-1 transition-transform">
                  <span>{t.valueProps.exploreBenefits}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
