'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const parsedDate = value ? new Date(value) : null;
  const initialYear = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getFullYear() : today.getFullYear();
  const initialMonth = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.getMonth() : today.getMonth();

  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handleSelectDay = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const formatDisplayDate = (val: string) => {
    if (!val) return '';
    const parts = val.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    }
    return val;
  };

  const setPresetDate = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(today.getDate() + daysFromNow);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-sand-50/90 hover:bg-sand-50 border border-taupe/20 rounded-xl px-3 py-3 text-xs sm:text-sm text-charcoal font-medium shadow-soft-sm focus-within:border-taupe focus-within:ring-1 focus-within:ring-taupe transition-all flex items-center justify-between gap-1.5 cursor-pointer group"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-taupe shrink-0" />
          <span className={`truncate font-medium ${value ? 'text-charcoal' : 'text-charcoal/50'}`}>
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>
        {value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="p-1 text-charcoal/40 hover:text-charcoal hover:bg-taupe/10 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <CalendarIcon className="w-3.5 h-3.5 text-taupe/60 shrink-0 group-hover:text-taupe transition-colors" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 z-[100] w-[300px] bg-sand-50/95 backdrop-blur-xl border border-taupe/25 rounded-2xl p-4 shadow-soft-lg"
          >
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-taupe/15 text-[11px]">
              <button
                type="button"
                onClick={() => setPresetDate(3)}
                className="px-2.5 py-1 rounded-lg bg-taupe/10 hover:bg-taupe/20 text-taupe font-medium transition-colors"
              >
                This Weekend
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(30)}
                className="px-2.5 py-1 rounded-lg bg-taupe/10 hover:bg-taupe/20 text-taupe font-medium transition-colors"
              >
                Next Month
              </button>
              <button
                type="button"
                onClick={() => setPresetDate(90)}
                className="px-2.5 py-1 rounded-lg bg-taupe/10 hover:bg-taupe/20 text-taupe font-medium transition-colors"
              >
                In 3 Months
              </button>
            </div>

            {/* Header / Month Nav */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="font-serif-display font-bold text-base text-charcoal">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg text-taupe hover:bg-taupe/15 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg text-taupe hover:bg-taupe/15 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-taupe uppercase mb-1">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const monthStr = String(currentMonth + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const fullStr = `${currentYear}-${monthStr}-${dayStr}`;
                const isSelected = value === fullStr;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-8 w-8 rounded-xl text-xs font-medium flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-taupe text-sand font-bold shadow-soft-sm'
                        : 'text-charcoal hover:bg-taupe/15'
                    }`}
                  >
                    {dayNum}
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
