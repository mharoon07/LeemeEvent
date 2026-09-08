'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, CheckSquare, Send, Users, FileCheck, PartyPopper } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HowItWorksProps {
  onStartClick: () => void;
}

export default function HowItWorks({ onStartClick }: HowItWorksProps) {
  const { t } = useLanguage();

  const stepsData = [
    {
      step: '01',
      title: t.howItWorks.steps.step1.title,
      description: t.howItWorks.steps.step1.description,
      icon: Sparkles,
    },
    {
      step: '02',
      title: t.howItWorks.steps.step2.title,
      description: t.howItWorks.steps.step2.description,
      icon: Calendar,
    },
    {
      step: '03',
      title: t.howItWorks.steps.step3.title,
      description: t.howItWorks.steps.step3.description,
      icon: CheckSquare,
    },
    {
      step: '04',
      title: t.howItWorks.steps.step4.title,
      description: t.howItWorks.steps.step4.description,
      icon: Send,
    },
    {
      step: '05',
      title: t.howItWorks.steps.step5.title,
      description: t.howItWorks.steps.step5.description,
      icon: Users,
    },
    {
      step: '06',
      title: t.howItWorks.steps.step6.title,
      description: t.howItWorks.steps.step6.description,
      icon: FileCheck,
    },
    {
      step: '07',
      title: t.howItWorks.steps.step7.title,
      description: t.howItWorks.steps.step7.description,
      icon: PartyPopper,
    },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-sand border-t border-taupe/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs tracking-wider uppercase text-taupe block mb-3 font-bold">
            {t.howItWorks.tag}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-charcoal tracking-tight text-balance">
            {t.howItWorks.titlePart1}{' '}
            <span className="text-taupe">
              {t.howItWorks.titlePart2}
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-charcoal/70 leading-relaxed text-balance">
            {t.howItWorks.subtext}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {stepsData.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === stepsData.length - 1;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative bg-sand-50/80 border border-taupe/20 rounded-3xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between ${
                  isLast ? 'md:col-span-2 lg:col-span-2 bg-sand-200/60 border-taupe/40' : ''
                }`}
              >
                <div>
                  {/* Step Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-classico text-2xl font-bold text-taupe/60 tracking-wider">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center">
                      <Icon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-classico text-lg uppercase tracking-wider font-semibold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {isLast && (
                  <div className="mt-6 pt-4 border-t border-taupe/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xs font-classico tracking-wider uppercase font-semibold text-charcoal">
                      {t.howItWorks.readyPrompt}
                    </span>
                    <button
                      onClick={onStartClick}
                      className="btn-primary px-5 py-2.5 text-xs tracking-widest font-semibold"
                    >
                      {t.howItWorks.startMyEvent}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
