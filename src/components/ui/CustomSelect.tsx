'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  icon,
  align = 'left',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-sand-50/90 hover:bg-sand-50 border border-taupe/20 rounded-xl px-3 py-3 text-xs sm:text-sm text-charcoal font-medium shadow-soft-sm focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe transition-all flex items-center justify-between gap-1.5 cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {selectedOption?.icon && (
            <span className="text-taupe shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate text-charcoal font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-taupe shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-taupe-700' : 'group-hover:translate-y-0.5'
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute top-full mt-2 z-[100] bg-sand-50/95 backdrop-blur-xl border border-taupe/25 rounded-2xl p-1.5 shadow-soft-lg max-h-64 overflow-y-auto min-w-[240px] sm:min-w-[260px] w-max max-w-[320px] ${
              align === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'
            }`}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm transition-all ${
                    isSelected
                      ? 'bg-taupe/15 text-taupe font-semibold'
                      : 'text-charcoal/80 hover:bg-sand-200/50 hover:text-charcoal'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    {option.icon && (
                      <span className={`shrink-0 ${isSelected ? 'text-taupe' : 'text-charcoal/60'}`}>
                        {option.icon}
                      </span>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="truncate">{option.label}</span>
                      {option.subtitle && (
                        <span className="text-[10px] text-charcoal/50 font-normal">
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-taupe shrink-0 stroke-[2.5]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
