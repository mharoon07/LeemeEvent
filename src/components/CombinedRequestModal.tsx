'use client';

import React, { useState } from 'react';
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

interface CombinedRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearchState?: SearchState | null;
}

const SUPPLIER_CATEGORIES = [
  { id: 'venue', label: 'Venue & Location', icon: Building2, defaultChecked: true },
  { id: 'catering', label: 'Catering & Food Trucks', icon: Utensils, defaultChecked: true },
  { id: 'photo', label: 'Photography', icon: Camera, defaultChecked: true },
  { id: 'video', label: 'Videography', icon: Video, defaultChecked: false },
  { id: 'decor', label: 'Floral & Styling Decor', icon: Flower2, defaultChecked: true },
  { id: 'hair_makeup', label: 'Hair & Makeup', icon: Sparkle, defaultChecked: false },
  { id: 'dj_music', label: 'DJ & Live Music', icon: Music, defaultChecked: true },
  { id: 'cake', label: 'Cake & Sweet Table', icon: Cake, defaultChecked: false },
  { id: 'dress_suit', label: 'Bridal & Styling', icon: Shirt, defaultChecked: false },
  { id: 'planner', label: 'Event & Wedding Planner', icon: ClipboardCheck, defaultChecked: false },
];

export default function CombinedRequestModal({
  isOpen,
  onClose,
  initialSearchState,
}: CombinedRequestModalProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'venue',
    'catering',
    'photo',
    'decor',
    'dj_music',
  ]);

  const [formData, setFormData] = useState({
    eventType: initialSearchState?.eventType || 'Wedding',
    date: initialSearchState?.date || '',
    location: initialSearchState?.location || 'New York & Surrounding',
    guests: initialSearchState?.guests || '50 - 100 guests',
    budget: '$7,500 - $15,000',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-sand border border-taupe/30 rounded-3xl p-6 sm:p-8 shadow-soft-lg z-10 overflow-hidden"
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
                  <span>Step {step} of 2: Combined Request</span>
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-charcoal">
                  {step === 1
                    ? 'Which suppliers would you like to combine?'
                    : 'Final Step: Receive Your Combined Proposal'}
                </h3>
                <p className="text-sm text-charcoal/70 mt-1">
                  {step === 1
                    ? 'Select all the elements for your celebration. We notify all your chosen suppliers at once.'
                    : 'Enter your contact info. Our matched suppliers will sync availability and pricing for your date.'}
                </p>
              </div>

              {step === 1 ? (
                /* Step 1: Category selection */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {SUPPLIER_CATEGORIES.map((cat) => {
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
                      Selected:{' '}
                      <strong className="text-taupe">{selectedCategories.length} supplier categories</strong>
                    </span>
                    <button
                      onClick={() => setStep(2)}
                      disabled={selectedCategories.length === 0}
                      className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>Next Step</span>
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
                        Your Full Name *
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
                        Email Address *
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
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-sand-50 border border-taupe/20 rounded-xl px-3.5 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                        Estimated Budget
                      </label>
                      <CustomSelect
                        value={formData.budget || '$7,500 - $15,000'}
                        onChange={(b) => setFormData({ ...formData, budget: b })}
                        options={[
                          { value: '$3,000 - $7,500', label: '$3,000 - $7,500', subtitle: 'Standard budget' },
                          { value: '$7,500 - $15,000', label: '$7,500 - $15,000', subtitle: 'Premium selection' },
                          { value: '$15,000 - $30,000', label: '$15,000 - $30,000', subtitle: 'Luxury experience' },
                          { value: '$30,000+', label: '$30,000+', subtitle: 'Bespoke VIP planning' },
                        ]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                      Special Requests or Vision Notes
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. We love a rustic-chic aesthetic with organic florals and acoustic live music..."
                      className="w-full bg-sand-50 border border-taupe/20 rounded-xl px-3.5 py-2 text-sm text-charcoal focus:outline-none focus:border-taupe resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary px-4 py-2.5 text-sm"
                    >
                      Back
                    </button>
                    <button type="submit" className="btn-primary flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-sand" />
                      <span>Submit Combined Request</span>
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
                Request Successfully Received!
              </h3>
              <p className="text-sm text-charcoal/80 max-w-md mx-auto">
                Thank you <strong className="text-taupe">{formData.name || 'Event Planner'}</strong>! We have received your combined request for {selectedCategories.length} supplier categories. Our LEEMEVENT concierge team is matching your date right now.
              </p>
              <div className="bg-sand-50 border border-taupe/20 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5 text-charcoal/70">
                <p className="font-semibold text-charcoal">✔ Coordinated matching started</p>
                <p>✔ Suppliers receive a joint event summary</p>
                <p>✔ You receive 1 centralized combined proposal within 24h</p>
              </div>
              <div className="pt-4">
                <button onClick={resetAndClose} className="btn-primary px-6 py-2.5 text-sm">
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
