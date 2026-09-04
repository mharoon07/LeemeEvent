'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/locales/translations';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'navbar' | 'mobile' | 'minimal';
}

const LANGUAGES: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', flag: '🇬🇧' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands (NL)', flag: '🇳🇱' },
];

export default function LanguageSwitcher({
  className = '',
  variant = 'navbar',
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Mobile segmented toggle variant
  if (variant === 'mobile') {
    return (
      <div className={`w-full bg-sand-200/80 p-1.5 rounded-2xl border border-taupe/25 flex items-center justify-between gap-1 shadow-inner ${className}`}>
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-charcoal text-sand shadow-md'
                  : 'text-charcoal/70 hover:text-charcoal hover:bg-sand/60'
              }`}
            >
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.name}</span>
              {isActive && <Check className="w-3.5 h-3.5 text-taupe-200" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Desktop / Header Dropdown Button
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-sand/80 hover:bg-sand border border-taupe/20 hover:border-taupe/40 text-charcoal text-xs font-semibold shadow-soft-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-taupe"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="tracking-wide uppercase font-classico text-xs">{currentLang.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-taupe transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-sand-50/95 backdrop-blur-xl border border-taupe/25 shadow-soft-lg p-1.5 z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 mb-1 border-b border-taupe/15">
              <span className="text-[10px] font-classico uppercase tracking-wider text-taupe font-bold flex items-center gap-1.5">
                <Globe className="w-3 h-3" />
                <span>Select Language</span>
              </span>
            </div>

            <div className="space-y-1">
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      isSelected
                        ? 'bg-charcoal text-sand font-semibold shadow-sm'
                        : 'text-charcoal hover:bg-taupe/10 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div className="text-left">
                        <span className="block">{lang.name}</span>
                        <span
                          className={`text-[10px] block ${
                            isSelected ? 'text-taupe-200' : 'text-charcoal/60'
                          }`}
                        >
                          {lang.nativeName}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-taupe-200 stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
