'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  MapPin,
  Upload,
  DollarSign,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  Compass,
  Plus,
  Trash2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const SUPPLIER_CATEGORIES = [
  'Venue & Location',
  'Catering & Food Trucks',
  'Photography',
  'Videography',
  'Floral & Decor',
  'Bridal & Suits',
  'Hair & Makeup',
  'DJ & Music',
  'Wedding Planner',
  'Nanny & Kids Corner',
  'Tables & Rentals',
  'Wedding Cake & Sweets',
  'Favors & Gifting',
  'Photoshoot Location',
  'Other Event Service',
];

export default function SupplierOnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, user, approveSupplier } = useAuth();
  const [step, setStep] = useState(1);

  const [onboardingData, setOnboardingData] = useState({
    businessName: 'Aura Floral & Botanical Styling',
    category: 'Floral & Decor',
    location: 'London & Home Counties, UK',
    logo: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&auto=format&fit=crop',
    portfolio: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    ],
    services: [
      { name: 'Full Luxury Floral & Backdrop Styling', desc: 'Custom ceremony arch, aisle florals & centerpieces', price: '2200', unit: 'per event' },
      { name: 'Bridal Bouquet & Party Flowers', desc: 'Bridal bouquet, 4 bridesmaid bouquets & boutonnieres', price: '650', unit: 'per event' },
    ],
    workingDays: ['Friday', 'Saturday', 'Sunday'],
    blackoutDates: ['2026-12-25', '2026-12-31'],
  });

  const [newService, setNewService] = useState({ name: '', desc: '', price: '', unit: 'per event' });

  const addServiceItem = () => {
    if (!newService.name || !newService.price) return;
    setOnboardingData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    setNewService({ name: '', desc: '', price: '', unit: 'per event' });
  };

  const removeServiceItem = (index: number) => {
    setOnboardingData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const handleFinishSubmit = () => {
    completeOnboarding({
      businessName: onboardingData.businessName,
      category: onboardingData.category,
    });
    setStep(6); // Step 6: Pending Admin Approval status screen
  };

  const handleBypassApprovalForDemo = () => {
    approveSupplier();
    router.push('/dashboard/supplier');
  };

  return (
    <main className="min-h-screen bg-sand text-charcoal font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-10 selection:bg-taupe selection:text-sand">
      {/* Header Logo */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-taupe stroke-[1.5]" />
          <span className="font-classico text-xl font-normal tracking-[0.2em] uppercase text-charcoal">
            LEEMEVENT Partner Onboarding
          </span>
        </div>
        <div className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold">
          {step < 6 ? `Step ${step} of 5` : 'Verification Review'}
        </div>
      </header>

      {/* Progress Bar */}
      {step < 6 && (
        <div className="max-w-4xl mx-auto w-full mb-8">
          <div className="w-full h-1.5 bg-taupe/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-charcoal transition-all duration-500 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content Box */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 sm:p-10 shadow-soft-lg relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: BUSINESS NAME & CATEGORY */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-classico tracking-[0.2em] uppercase text-taupe block font-semibold mb-1">
                    Step 1 of 5
                  </span>
                  <h1 className="font-classico text-2xl sm:text-4xl font-normal uppercase tracking-wide text-charcoal">
                    Business Profile & Service Category
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Enter your registered brand name and primary event service category.
                  </p>
                </div>

                <div className="space-y-4 pt-2 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-2 block">
                      Business Name / Brand Name *
                    </label>
                    <input
                      type="text"
                      value={onboardingData.businessName}
                      onChange={(e) => setOnboardingData({ ...onboardingData, businessName: e.target.value })}
                      placeholder="e.g. Aura Floral & Styling"
                      className="w-full bg-sand border border-taupe/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-2 block">
                      Primary Service Category *
                    </label>
                    <select
                      value={onboardingData.category}
                      onChange={(e) => setOnboardingData({ ...onboardingData, category: e.target.value })}
                      className="w-full bg-sand border border-taupe/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                    >
                      {SUPPLIER_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: LOCATION & SERVICE AREA */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-classico tracking-[0.2em] uppercase text-taupe block font-semibold mb-1">
                    Step 2 of 5
                  </span>
                  <h1 className="font-classico text-2xl sm:text-4xl font-normal uppercase tracking-wide text-charcoal">
                    Location & Service Region
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Where is your business based, and which areas do you travel to serve?
                  </p>
                </div>

                <div className="space-y-4 pt-2 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-2 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-taupe" />
                      <span>Primary Service Location / Area</span>
                    </label>
                    <input
                      type="text"
                      value={onboardingData.location}
                      onChange={(e) => setOnboardingData({ ...onboardingData, location: e.target.value })}
                      placeholder="e.g. London & Home Counties, UK"
                      className="w-full bg-sand border border-taupe/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PORTFOLIO & LOGO */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-classico tracking-[0.2em] uppercase text-taupe block font-semibold mb-1">
                    Step 3 of 5
                  </span>
                  <h1 className="font-classico text-2xl sm:text-4xl font-normal uppercase tracking-wide text-charcoal">
                    Portfolio & Logo Showcase
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    High-resolution imagery builds client confidence (min 5 portfolio photos required).
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-charcoal/80">
                    <Upload className="w-4 h-4 text-taupe" />
                    <span>Uploaded Portfolio Photos ({onboardingData.portfolio.length} of 5 min)</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {onboardingData.portfolio.map((img, i) => (
                      <div key={i} className="relative h-24 rounded-xl overflow-hidden border border-taupe/20">
                        <Image src={img} alt={`Portfolio ${i + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-taupe/30 hover:border-taupe rounded-2xl p-6 text-center space-y-2 bg-sand hover:bg-sand-100 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-taupe mx-auto" />
                    <span className="text-xs font-classico tracking-wider uppercase font-semibold text-charcoal block">
                      + Add More High-Resolution Photos
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SERVICES & PRICING */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-classico tracking-[0.2em] uppercase text-taupe block font-semibold mb-1">
                    Step 4 of 5
                  </span>
                  <h1 className="font-classico text-2xl sm:text-4xl font-normal uppercase tracking-wide text-charcoal">
                    Services & Package Pricing
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Add line-item packages and pricing units (per guest / per event / per hour).
                  </p>
                </div>

                {/* Line Items List */}
                <div className="space-y-3 pt-2">
                  {onboardingData.services.map((item, index) => (
                    <div key={index} className="bg-sand border border-taupe/20 p-4 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-classico text-sm uppercase font-bold text-charcoal">{item.name}</h4>
                        <p className="text-xs text-charcoal/70">{item.desc}</p>
                        <span className="font-mono text-xs font-bold text-taupe block mt-1">
                          ${item.price} ({item.unit})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeServiceItem(index)}
                        className="text-charcoal/40 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add New Line Item Box */}
                  <div className="bg-sand-100 border border-taupe/20 p-4 rounded-2xl space-y-3">
                    <span className="text-xs font-classico tracking-wider uppercase font-semibold text-taupe block">
                      + Add New Service Item
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Service Name (e.g. Full Day Photo)"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        className="bg-sand border border-taupe/20 rounded-xl px-3 py-2 text-xs text-charcoal"
                      />
                      <input
                        type="text"
                        placeholder="Short Description"
                        value={newService.desc}
                        onChange={(e) => setNewService({ ...newService, desc: e.target.value })}
                        className="bg-sand border border-taupe/20 rounded-xl px-3 py-2 text-xs text-charcoal"
                      />
                      <input
                        type="number"
                        placeholder="Price ($)"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        className="bg-sand border border-taupe/20 rounded-xl px-3 py-2 text-xs text-charcoal"
                      />
                      <select
                        value={newService.unit}
                        onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
                        className="bg-sand border border-taupe/20 rounded-xl px-3 py-2 text-xs text-charcoal"
                      >
                        <option value="per event">per event</option>
                        <option value="per guest">per guest</option>
                        <option value="per hour">per hour</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={addServiceItem}
                      className="btn-secondary px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Service Item</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: AVAILABILITY SETUP */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-classico tracking-[0.2em] uppercase text-taupe block font-semibold mb-1">
                    Step 5 of 5
                  </span>
                  <h1 className="font-classico text-2xl sm:text-4xl font-normal uppercase tracking-wide text-charcoal">
                    Availability & Calendar Blackouts
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Keeping your calendar updated prevents unfulfilled inquiries and raises your ranking.
                  </p>
                </div>

                <div className="space-y-4 pt-2 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-2 block flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-taupe" />
                      <span>Standard Working Days</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const isWorking = onboardingData.workingDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setOnboardingData((prev) => ({
                                ...prev,
                                workingDays: isWorking
                                  ? prev.workingDays.filter((d) => d !== day)
                                  : [...prev.workingDays, day],
                              }));
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-classico tracking-wider uppercase font-semibold transition-all ${
                              isWorking
                                ? 'bg-charcoal text-sand shadow-soft-sm'
                                : 'bg-sand border border-taupe/20 text-charcoal/60'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: PENDING ADMIN APPROVAL (APPROVAL-GATED STATUS SCREEN) */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-6 max-w-xl mx-auto"
              >
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-soft-sm">
                  <Clock className="w-10 h-10 stroke-[2] animate-pulse" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-classico tracking-[0.2em] uppercase font-bold bg-amber-100 text-amber-800 inline-block mb-3">
                    Status: Pending Admin Approval
                  </span>
                  <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal">
                    Application Submitted for Vetting
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-3 leading-relaxed font-sans">
                    Thank you for applying to join LEEMEVENT as a verified partner! Our concierge team is reviewing <strong>{onboardingData.businessName}</strong> ({onboardingData.category}). Approval typically takes under 24 hours.
                  </p>
                </div>

                {/* Vetting Checklist Card */}
                <div className="bg-sand border border-taupe/20 rounded-2xl p-5 text-left space-y-3 text-xs text-charcoal/80">
                  <div className="flex items-center gap-2.5 font-semibold text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Business Profile & Category Submitted</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-semibold text-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Portfolio Images ({onboardingData.portfolio.length} photos) Received</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-amber-800">
                    <Clock className="w-4 h-4" />
                    <span>Public Liability & Quality Vetting in Progress</span>
                  </div>
                </div>

                {/* Demo Instant Approval Bypass Button */}
                <div className="pt-4 border-t border-taupe/15 space-y-3">
                  <button
                    type="button"
                    onClick={handleBypassApprovalForDemo}
                    className="btn-primary px-8 py-3.5 text-xs font-classico tracking-[0.2em] uppercase font-semibold inline-flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-sand" />
                    <span>Simulate Admin Approval & Access Dashboard</span>
                  </button>
                  <p className="text-[10px] text-charcoal/50 italic">
                    (Clicking above simulates instant LEEMEVENT admin verification for demonstration)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Navigation Controls */}
          {step < 6 && (
            <div className="pt-8 mt-6 border-t border-taupe/15 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary px-5 py-2.5 text-xs flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="btn-primary px-6 py-2.5 text-xs flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishSubmit}
                  className="btn-primary px-8 py-3 text-xs font-classico tracking-[0.2em] uppercase flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-sand" />
                  <span>Submit for Admin Approval</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      <footer className="text-center py-4 text-xs font-classico tracking-widest text-charcoal/50 uppercase">
        © 2026 LEEMEVENT Partner Program
      </footer>
    </main>
  );
}
