'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation } from 'lucide-react';

interface CustomLocationInputProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  className?: string;
}

const POPULAR_CITIES = [
  'London, UK',
  'New York, NY',
  'Amsterdam, Netherlands',
  'Paris, France',
  'Los Angeles, CA',
  'Dubai, UAE',
  'Barcelona, Spain',
  'Rome, Italy',
  'Berlin, Germany',
  'Sydney, Australia',
];

export default function CustomLocationInput({
  value,
  onChange,
  placeholder = 'e.g. London, New York, Amsterdam...',
  className = '',
}: CustomLocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = POPULAR_CITIES.filter((city) =>
    city.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-taupe">
          <MapPin className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-sand-50/90 hover:bg-sand-50 border border-taupe/20 rounded-xl pl-9 pr-8 py-3 text-xs sm:text-sm text-charcoal font-medium placeholder:text-charcoal/40 shadow-soft-sm focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all truncate"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-charcoal/40 hover:text-charcoal transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-2 z-[100] bg-sand-50/95 backdrop-blur-xl border border-taupe/25 rounded-2xl p-2 shadow-soft-lg max-h-56 overflow-y-auto min-w-[220px]"
          >
            <div className="px-2 py-1.5 text-[10px] font-semibold text-taupe uppercase tracking-wider">
              Popular Event Cities
            </div>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    onChange(city);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs sm:text-sm text-charcoal/80 hover:bg-sand-200/50 hover:text-charcoal transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-taupe shrink-0" />
                  <span>{city}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-charcoal/60">
                Press search with &quot;{value}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
