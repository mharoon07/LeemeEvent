'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Sparkles,
  Heart,
  ArrowRight,
  ShieldCheck,
  Building2,
  Utensils,
  Camera,
  Video,
  Flower2,
  Sparkle,
  Music,
  Cake,
  Shirt,
  ClipboardCheck,
} from 'lucide-react';
import { SearchState } from './SearchWidget';
import CustomSelect from './ui/CustomSelect';
import { useLanguage } from '@/context/LanguageContext';

interface CombinedRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchState?: SearchState | null;
}

export default function CombinedRequestModal({
  isOpen,
  onClose,
  initialSearchState,
}: CombinedRequestModalProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'venue',
    'catering',
    'photo',
    'decor',
    'dj_music',
  ]);

  const supplierCategories = [
    { id: 'venue', label: t.categories.list.venue.label, icon: Building2 },
    { id: 'catering', label: t.categories.list.catering.label, icon: Utensils },
    { id: 'photo', label: t.categories.list.photography.label, icon: Camera },
    { id: 'video', label: t.categories.list.videography.label, icon: Video },
    { id: 'decor', label: t.categories.list.decor.label, icon: Flower2 },
    { id: 'hair_makeup', label: t.categories.list.hair_makeup.label, icon: Sparkle },
    { id: 'dj_music', label: 'DJ & Live Music', icon: Music },
    { id: 'cake', label: t.categories.list.cake.label, icon: Cake },
    { id: 'dress_suit', label: t.categories.list.dress.label, icon: Shirt },
    { id: 'planner', label: t.categories.list.planner.label, icon: ClipboardCheck },
  ];

  const [formData, setFormData] = useState({
    eventType: initialSearchState?.eventType || 'Wedding',
    date: initialSearchState?.date || '',
    location: initialSearchState?.location || 'Amsterdam & Surrounding',
    guests: initialSearchState?.guests || '50 - 100 guests',
    budget: '€7.500 - €15.000',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const toggleCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== catId));
      }
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[999999] w-screen h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          minHeight: '100vh',
          margin: 0,
          zIndex: 999999,
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-charcoal/90 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-sand border border-taupe/30 rounded-3xl p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full text-charcoal/60 hover:text-charcoal hover:bg-taupe/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              {/* Header */}
              <div className="mb-6 pr-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taupe/10 text-taupe text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.modal.stepIndicator} {step} / 2: {t.modal.title}</span>
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-charcoal">
                  {step === 1 ? t.modal.step1Title : t.modal.step2Title}
                </h3>
                <p className="text-sm text-charcoal/70 mt-1">
                  {step === 1 ? t.modal.step1Desc : t.modal.step2Desc}
                </p>
              </div>

              {step === 1 ? (
                /* Step 1: Category selection */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {supplierCategories.map((cat) => {
                      const isChecked = selectedCategories.includes(cat.id);
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => toggleCategory(cat.id)}
                          className={`cursor-pointer flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                            isChecked
                              ? 'bg-sand-50 border-taupe shadow-soft-sm'
                              : 'bg-transparent border-taupe/20 opacity-70 hover:opacity-100 hover:border-taupe/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-taupe text-sand' : 'bg-taupe/10 text-taupe'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-charcoal">
                              {cat.label}
                            </span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? 'bg-taupe border-taupe text-sand'
                                : 'border-taupe/40 bg-transparent'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-sand-100/80 rounded-2xl p-4 border border-taupe/15 flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-charcoal/80 font-medium">
                      {t.modal.selectedCount}:{' '}
                      <strong className="text-taupe">{selectedCategories.length}</strong>
                    </span>
                    <button
                      onClick={() => setStep(2)}
                      disabled={selectedCategories.length === 0}
                      className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>{t.modal.nextStep}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Contact form & event summary */
                <form onSubmit={handleComplete} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                        {t.modal.fullName} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Eleanor Vance"
                        className="w-full bg-sand-50 border border-taupe/20 rounded-xl px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                        {t.modal.email} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="eleanor@example.com"
                        className="w-full bg-sand-50 border border-taupe/20 rounded-xl px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                        {t.modal.phone}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+31 6 12345678"
                        className="w-full bg-sand-50 border border-taupe/20 rounded-xl px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                        {t.modal.estimatedBudget}
                      </label>
                      <CustomSelect
                        value={formData.budget || '€7.500 - €15.000'}
                        onChange={(b) => setFormData({ ...formData, budget: b })}
                        options={[
                          { value: '€3.000 - €7.500', label: '€3.000 - €7.500', subtitle: 'Standard budget' },
                          { value: '€7.500 - €15.000', label: '€7.500 - €15.000', subtitle: 'Premium selection' },
                          { value: '€15.000 - €30.000', label: '€15.000 - €30.000', subtitle: 'Luxury experience' },
                          { value: '€30.000+', label: '€30.000+', subtitle: 'Bespoke VIP planning' },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                      {t.modal.specialNotes}
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={t.modal.specialNotesPlaceholder}
                      className="w-full bg-sand-50 border border-taupe/20 rounded-xl px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-taupe resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary px-4 py-2.5 text-sm"
                    >
                      {t.modal.backStep}
                    </button>
                    <button type="submit" className="btn-primary flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-sand" />
                      <span>{t.modal.submitCombinedRequest}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-charcoal/60 pt-2">
                    <ShieldCheck className="w-4 h-4 text-taupe" />
                    <span>No obligation • Free service • Response within 24 hours</span>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Success Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-taupe/15 text-taupe mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8 fill-taupe text-taupe" />
              </div>
              <h3 className="font-serif-display text-3xl font-bold text-charcoal">
                {t.modal.successTitle}
              </h3>
              <p className="text-sm text-charcoal/80 max-w-md mx-auto">
                {t.modal.successMessage} ({selectedCategories.length} {t.modal.selectedCount})
              </p>
              <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5 text-charcoal/70">
                <p>{t.modal.successSummary}</p>
              </div>
              <div className="pt-4">
                <button onClick={resetAndClose} className="btn-primary px-6 py-2.5 text-sm">
                  {t.modal.closeBtn}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
