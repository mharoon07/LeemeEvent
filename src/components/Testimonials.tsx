'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Testimonials() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  ];

  const testimonialsList = t.testimonials.items.map((item, idx) => ({
    id: idx + 1,
    ...item,
    avatar: avatars[idx] || avatars[0],
    rating: 5,
  }));

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsList.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsList.length) % testimonialsList.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-sand border-t border-taupe/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-taupe block mb-3">
            {t.testimonials.tag}
          </span>
          <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-charcoal tracking-tight text-balance">
            {t.testimonials.title}
          </h2>
          <p className="mt-4 text-base text-charcoal/70 text-balance">
            {t.testimonials.subtext}
          </p>
        </div>

        {/* Testimonials 3-Card Carousel Grid / Active Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsList.map((item, index) => {
            const isActive = index === currentIndex;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setCurrentIndex(index)}
                className={`cursor-pointer bg-sand-50/90 border rounded-3xl p-8 shadow-soft-sm transition-all duration-300 flex flex-col justify-between relative ${
                  isActive
                    ? 'border-taupe shadow-soft-lg scale-[1.02] bg-sand-100/90'
                    : 'border-taupe/20 opacity-80 hover:opacity-100 hover:border-taupe/40'
                }`}
              >
                <div>
                  {/* Quote Icon & Rating Stars */}
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="w-8 h-8 text-taupe/40 fill-taupe/10" />
                    <div className="flex text-taupe">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Text */}
                  <p className="text-sm sm:text-base text-charcoal/90 leading-relaxed font-serif italic mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Client Profile */}
                <div className="pt-6 border-t border-taupe/15 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-taupe/30 shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif-display text-base font-bold text-charcoal">
                      {item.name}
                    </h4>
                    <span className="block text-xs font-semibold text-taupe">
                      {item.event}
                    </span>
                    <span className="block text-[11px] text-charcoal/60">
                      {item.suppliersBooked}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel Navigation Controls */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full border border-taupe/30 flex items-center justify-center text-charcoal hover:bg-taupe hover:text-sand hover:border-taupe transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {testimonialsList.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? 'w-8 bg-taupe' : 'w-2 bg-taupe/30'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full border border-taupe/30 flex items-center justify-center text-charcoal hover:bg-taupe hover:text-sand hover:border-taupe transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
