'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Sparkles, Compass, ArrowRight } from 'lucide-react';
import SearchWidget, { SearchState } from './SearchWidget';

interface HeroProps {
  onSearchSubmit: (params: SearchState) => void;
}

export default function Hero({ onSearchSubmit }: HeroProps) {
  const pathname = usePathname();

  const heroNavLinks = [
    { num: '01', name: 'HOME', href: '/' },
    { num: '02', name: 'WHY LEEMEVENTS', href: '/why-us' },
    { num: '03', name: 'HOW IT WORKS', href: '/how-it-works' },
    { num: '04', name: 'SUPPLIERS', href: '/categories' },
    { num: '05', name: 'ABOUT US', href: '/about' },
  ];

  return (
    <section id="home" className="relative z-20 min-h-screen pt-12 sm:pt-16 lg:pt-20 pb-16 flex items-center bg-stone-linen">
      {/* Background Decorative Blur & Warm Earth Gradients */}
      <div className="absolute inset-0 bg-sand/60 z-0 overflow-hidden pointer-events-none" />

      {/* Background Subtle Organic Image Layer */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none mix-blend-multiply overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
          alt="Luxury Wabi-Sabi event table setting"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center lg:items-start justify-between">

        {/* LEFT VERTICAL NAVBAR PANEL (Flush to extreme left edge of screen) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex w-72 shrink-0 border-r border-taupe/25 pl-8 lg:pl-12 pr-8 flex-col justify-between space-y-8 pt-2 pb-6 self-stretch min-h-[580px]"
        >
          {/* Top Brand Emblem */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-taupe/10 text-taupe flex items-center justify-center shadow-soft-sm">
              <Compass className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <span className="font-classico text-2xl font-normal tracking-[0.2em] uppercase text-charcoal block">
                LEEMEVENTS
              </span>

            </div>
          </div>

          {/* Thin Decorative Line */}
          <div className="w-12 h-[1.5px] bg-taupe/30" />

          {/* Vertical Menu Links */}
          <nav className="flex flex-col space-y-4">
            {heroNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group font-classico text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-between py-2 border-b border-taupe/10 ${isActive
                      ? 'text-taupe font-semibold pl-2 border-l-2 border-taupe border-b-taupe/30'
                      : 'text-charcoal/75 hover:text-taupe hover:pl-1 font-normal'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-taupe/60 font-mono">{link.num}.</span>
                    <span>{link.name}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-taupe" />
                </Link>
              );
            })}
          </nav>

          {/* Circular Wabi-Sabi Rotating Stamp Accent */}
          <div className="pt-2 flex items-center gap-3">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full animate-spin-slow text-taupe fill-current" viewBox="0 0 100 100">
                <path
                  id="circlePathHero"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[10px] font-classico tracking-[0.25em] uppercase font-bold text-taupe">
                  <textPath href="#circlePathHero" startOffset="0%">
                    • WABI SABI • EST 2026 •
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="text-[10px] font-classico tracking-[0.18em] uppercase text-charcoal/60 leading-tight">
              Curated Earth & Stone Events
            </div>
          </div>
        </motion.div>

        {/* RIGHT HERO CONTENT & SEARCH WIDGET CONTAINER */}
        <div className="flex-1 w-full px-4 sm:px-8 lg:px-12 text-center lg:text-left space-y-6 pt-2 max-w-6xl mx-auto lg:mx-0">
          {/* Editorial Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-100/90 border border-taupe/20 text-taupe text-xs font-classico tracking-[0.2em] uppercase mb-2 shadow-soft-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Two-Sided Event Marketplace Platform</span>
          </motion.div>

          {/* Main Headline in Classico & Cormorant Garamond */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-classico text-4xl sm:text-6xl lg:text-7xl font-normal tracking-wide text-charcoal max-w-4xl leading-[1.15] uppercase text-balance"
          >
            Every event, <span className="font-serif-display lowercase italic font-normal text-taupe">planned in one place.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-charcoal/80 max-w-2xl leading-relaxed text-balance"
          >
            Discover, compare, and book all your event suppliers — venue, catering, photography, videography, decor, hair & makeup, DJ, and cake — on one platform. Submit <strong>1 combined request</strong> and manage everything together.
          </motion.p>

          {/* Search Widget Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-2 relative z-30"
          >
            <SearchWidget onSearchSubmit={onSearchSubmit} />
          </motion.div>

          {/* Trust Checklist & Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 text-xs sm:text-sm text-charcoal/80"
          >
            <div className="flex items-center gap-2 font-classico tracking-wider uppercase">
              <CheckCircle2 className="w-4 h-4 text-taupe shrink-0" />
              <span>Verified suppliers</span>
            </div>

            <div className="flex items-center gap-2 font-classico tracking-wider uppercase">
              <CheckCircle2 className="w-4 h-4 text-taupe shrink-0" />
              <span>Real-time availability</span>
            </div>

            <div className="flex items-center gap-2 font-classico tracking-wider uppercase">
              <CheckCircle2 className="w-4 h-4 text-taupe shrink-0" />
              <span>Combined planning & contract</span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-taupe/20">
              <div className="flex text-taupe">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-charcoal">4.9/5</span>
              <span className="text-charcoal/60">(480+ events)</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
