'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import CombinedRequestModal from '@/components/CombinedRequestModal';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does a combined event request work?',
    a: 'Instead of contacting vendors individually, you select the supplier categories you need (e.g. Venue, Catering, Photography, DJ), pick your event date, and submit 1 form. Our platform broadcasts your request to matched available partners simultaneously.',
  },
  {
    q: 'Are the prices standard or customized?',
    a: 'You receive customized proposals tailored to your guest count, location, and date. Because vendors receive coordinated briefs, we often secure bundle packages and streamlined rates.',
  },
  {
    q: 'Can I add or remove suppliers after submitting?',
    a: 'Yes! Your dedicated LEEMEVENTS matchmaker works with you to refine your selections until your final proposal matches your vision 100%.',
  },
  {
    q: 'Is using LEEMEVENTS free for event organizers?',
    a: 'Submitting requests and receiving combined proposals is 100% free with no obligation to book. We handle all coordination at zero added markup.',
  },
];

export default function HowItWorksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
            <span>The 7-Step Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-classico text-4xl sm:text-6xl font-normal uppercase tracking-wide text-charcoal leading-tight"
          >
            How <span className="font-serif-display lowercase italic font-normal text-taupe">LEEMEVENTS works.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-charcoal/80 max-w-2xl mx-auto leading-relaxed"
          >
            From selecting your date to celebrating on the big day, see how our 7-step process simplifies multi-vendor event planning.
          </motion.p>
        </div>
      </section>

      {/* 7 Steps Component */}
      <HowItWorks onStartClick={() => setIsModalOpen(true)} />

      {/* FAQ Section */}
      <section className="py-20 bg-sand-50/80 border-t border-taupe/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block mb-2 font-semibold">
              Got Questions?
            </span>
            <h2 className="font-classico text-3xl uppercase font-normal text-charcoal tracking-wide">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="bg-sand border border-taupe/20 rounded-2xl p-5 cursor-pointer transition-all hover:border-taupe/40"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between font-classico text-base uppercase tracking-wider font-semibold text-charcoal">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-taupe shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-taupe transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                  {isOpen && (
                    <p className="mt-3 text-sm text-charcoal/75 leading-relaxed pt-2 border-t border-taupe/10">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary px-8 py-3.5 text-base flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4 text-sand" />
              <span>Start My Event Now</span>
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
