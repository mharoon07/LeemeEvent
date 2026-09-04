'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  onOpenModal: () => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.whyUs, href: '/why-us' },
    { name: t.nav.howItWorks, href: '/how-it-works' },
    { name: t.nav.suppliers, href: '/categories' },
    { name: t.nav.aboutUs, href: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-sand/95 backdrop-blur-md border-b border-taupe/15 py-3 shadow-soft-sm opacity-100 pointer-events-auto'
            : isHome
            ? 'opacity-0 pointer-events-none'
            : 'bg-transparent py-5 opacity-100 pointer-events-auto'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-normal text-charcoal group-hover:text-taupe transition-colors">
                LEEMEVENTS
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-taupe group-hover:scale-125 transition-transform" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm transition-colors relative font-medium after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[1.5px] after:bg-taupe after:transition-all after:duration-300 ${
                      isActive
                        ? 'text-taupe font-semibold after:w-full'
                        : 'text-charcoal/80 hover:text-taupe after:w-0 hover:after:w-full'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Language Switcher + CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Switcher next to CTA button */}
              <LanguageSwitcher variant="navbar" />

              <Link
                href="/login"
                className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 group shadow-soft-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-sand transition-transform group-hover:rotate-12" />
                <span>{t.nav.startEvent}</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher variant="navbar" />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-charcoal hover:bg-taupe/10 transition-colors pointer-events-auto"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-[60px] left-0 right-0 z-40 bg-sand/95 backdrop-blur-xl border-b border-taupe/20 md:hidden shadow-soft-lg overflow-hidden"
          >
            <div className="px-6 pt-6 pb-8 space-y-4">
              {/* Mobile Language Switcher */}
              <div className="pb-2">
                <span className="text-[10px] font-classico uppercase tracking-widest text-taupe font-bold block mb-2">
                  {t.nav.language}
                </span>
                <LanguageSwitcher variant="mobile" />
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-base transition-colors border-b border-taupe/10 pb-2 ${
                      isActive ? 'text-taupe font-bold' : 'text-charcoal hover:text-taupe font-medium'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-sand" />
                  <span>{t.nav.startEvent}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
