'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, CheckSquare, Send, Users, FileCheck, PartyPopper } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Select your event type',
    description: 'Choose your celebration — from a dream wedding to an intimate birthday dinner or corporate gala.',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'Select suppliers & date',
    description: 'Pick desired categories (venue, catering, photography, DJ) and enter your preferred event date.',
    icon: Calendar,
  },
  {
    step: '03',
    title: 'Check availability',
    description: 'Our platform verifies real-time date availability across all your selected premium suppliers.',
    icon: CheckSquare,
  },
  {
    step: '04',
    title: 'Submit 1 combined request',
    description: 'Send one single combined inquiry with a click. No more juggling 10 separate email threads.',
    icon: Send,
  },
  {
    step: '05',
    title: 'Team & matchmaker takes over',
    description: 'Our event specialists coordinate timing, requirements, and logistics with every partner.',
    icon: Users,
  },
  {
    step: '06',
    title: '1 Contract & deposit',
    description: 'Receive 1 clear overall proposal, 1 straightforward agreement, and 1 secure deposit payment.',
    icon: FileCheck,
  },
  {
    step: '07',
    title: 'Party time!',
    description: 'Relax and enjoy. All your suppliers arrive perfectly synchronized on your special day.',
    icon: PartyPopper,
  },
];

interface HowItWorksProps {
  onStartClick: () => void;
}

export default function HowItWorks({ onStartClick }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="py-28 bg-sand border-t border-taupe/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block mb-3 font-semibold">
            In 7 Simple Steps
          </span>
          <h2 className="font-classico text-3xl sm:text-5xl uppercase font-normal text-charcoal tracking-wide text-balance">
            From initial idea <span className="font-serif-display lowercase italic font-normal text-taupe">to a flawless event</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-charcoal/70 leading-relaxed text-balance">
            LEEMEVENT makes booking multiple suppliers as effortless as booking a luxury boutique stay.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === STEPS.length - 1;
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
                      Ready to design your event?
                    </span>
                    <button
                      onClick={onStartClick}
                      className="btn-primary px-5 py-2.5 text-xs tracking-widest font-semibold"
                    >
                      Start my event &rarr;
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
