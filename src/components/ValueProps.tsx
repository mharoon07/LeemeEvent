'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ShieldCheck, HeartHandshake, Zap, CalendarCheck } from 'lucide-react';

const VALUE_PROPS = [
  {
    icon: Layers,
    title: 'Single Combined Request',
    description:
      'No more emailing 15 individual vendors separately. Pick your date and preferences, and submit 1 grouped inquiry.',
    tag: 'Save Time',
  },
  {
    icon: ShieldCheck,
    title: 'Verified & Reviewed Partners',
    description:
      'Every venue, photographer, caterer, and DJ is rigorously vetted for quality, reliability, and authentic client reviews.',
    tag: 'Quality Stamp',
  },
  {
    icon: HeartHandshake,
    title: 'Personal Event Concierge',
    description:
      'Our dedicated event matchmakers supervise your schedule and ensure all your selected suppliers work together seamlessly.',
    tag: 'Dedicated Support',
  },
  {
    icon: Zap,
    title: 'Instant Coordinated Quotes',
    description:
      'All your selected vendors receive your event brief simultaneously, giving you 1 clear consolidated proposal.',
    tag: 'Clarity',
  },
  {
    icon: CalendarCheck,
    title: 'Up-To-Date Live Calendars',
    description:
      'Prevent booking conflicts. Our system synchronizes supplier calendars live so you see available dates instantly.',
    tag: 'Live Sync',
  },
];

export default function ValueProps() {
  return (
    <section id="why-us" className="py-28 bg-sand border-t border-taupe/15 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block mb-3 font-semibold">
            Why choose LEEMEVENT
          </span>
          <h2 className="font-classico text-3xl sm:text-5xl uppercase font-normal text-charcoal tracking-wide text-balance">
            Event planning, <span className="font-serif-display lowercase italic font-normal text-taupe">without the chaos</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-charcoal/70 leading-relaxed text-balance">
            Planning a wedding or celebration should be magical, not stressful. We curate the best suppliers into one harmonious stone & earth ecosystem.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VALUE_PROPS.map((item, index) => {
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
                  <span>Explore benefits &rarr;</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
