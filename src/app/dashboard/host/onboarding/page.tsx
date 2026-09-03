'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Compass,
} from 'lucide-react';

const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding', icon: '💍', desc: 'Ceremony, reception & bridal party' },
  { id: 'birthday', label: 'Birthday Celebration', icon: '🎉', desc: 'Milestone party & dinner' },
  { id: 'corporate', label: 'Corporate Gala / Event', icon: '🍸', desc: 'Company retreat or product launch' },
  { id: 'babyshower', label: 'Baby Shower / Gender Reveal', icon: '🧸', desc: 'Intimate family gathering' },
  { id: 'other', label: 'Other Special Celebration', icon: '✨', desc: 'Anniversary, engagement, or party' },
];

const SERVICES_CHECKLIST = [
  { id: 'venue', label: 'Venue & Location', icon: '🏰' },
  { id: 'catering', label: 'Catering & Food Trucks', icon: '🍽️' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'videography', label: 'Videography', icon: '🎥' },
  { id: 'decor', label: 'Floral & Decor Design', icon: '💐' },
  { id: 'dress', label: 'Bridal Gowns & Suits', icon: '👗' },
  { id: 'makeup', label: 'Hair & Makeup Styling', icon: '💄' },
  { id: 'dj', label: 'DJ, Music & Sound', icon: '🎧' },
  { id: 'planner', label: 'Wedding & Event Planner', icon: '📋' },
  { id: 'nanny', label: 'Kids Corner & Nanny Service', icon: '👶' },
  { id: 'rentals', label: 'Tables, Chairs & Furniture Rentals', icon: '🪑' },
  { id: 'cake', label: 'Wedding Cake & Dessert Spread', icon: '🎂' },
  { id: 'favors', label: 'Artisan Favors & Gifting', icon: '🎁' },
  { id: 'photoshoot', label: 'Photoshoot Location Hire', icon: '🏛️' },
];

export default function HostOnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, user } = useAuth();
  const [step, setStep] = useState(1);

  const [onboardingData, setOnboardingData] = useState({
    eventType: 'wedding',
    eventDate: '2026-09-18',
    noDateYet: false,
    location: 'London, UK',
    guestCount: 120,
    selectedServices: ['venue', 'catering', 'photography', 'dj', 'decor'],
  });

  const toggleService = (id: string) => {
    setOnboardingData((prev) => {
      const exists = prev.selectedServices.includes(id);
      return {
        ...prev,
        selectedServices: exists
          ? prev.selectedServices.filter((s) => s !== id)
          : [...prev.selectedServices, id],
      };
    });
  };

  const handleFinish = () => {
    completeOnboarding(onboardingData);
    router.push('/dashboard/host');
  };

  return (
    <main className="min-h-screen bg-sand text-charcoal font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-10 selection:bg-taupe selection:text-sand">
      {/* Header Logo */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-taupe stroke-[1.5]" />
          <span className="font-classico text-xl font-normal tracking-[0.2em] uppercase text-charcoal">
            LEEMEVENT
          </span>
        </div>
        <div className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold">
          Host Onboarding — Step {step} of 5
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="w-full h-1.5 bg-taupe/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-taupe transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 sm:p-10 shadow-soft-lg relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: EVENT TYPE */}
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
                    What are you organizing?
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Select the type of event you are planning on LEEMEVENT.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {EVENT_TYPES.map((type) => {
                    const isSelected = onboardingData.eventType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setOnboardingData({ ...onboardingData, eventType: type.id })}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-taupe bg-taupe/15 text-charcoal shadow-soft-sm font-semibold'
                            : 'border-taupe/20 bg-sand text-charcoal/80 hover:border-taupe/40'
                        }`}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <span className="font-classico text-sm uppercase tracking-wider block font-bold text-charcoal">
                            {type.label}
                          </span>
                          <span className="text-xs text-charcoal/60 font-sans block mt-0.5">
                            {type.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE */}
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
                    When is the event?
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Pick your event date to check live availability across all suppliers.
                  </p>
                </div>

                <div className="space-y-4 pt-2 max-w-md">
                  <div>
                    <label className="text-xs font-semibold text-charcoal/80 mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-taupe" />
                      <span>Target Event Date</span>
                    </label>
                    <input
                      type="date"
                      disabled={onboardingData.noDateYet}
                      value={onboardingData.eventDate}
                      onChange={(e) => setOnboardingData({ ...onboardingData, eventDate: e.target.value })}
                      className="w-full bg-sand border border-taupe/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-taupe disabled:opacity-50"
                    />
                  </div>

                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-taupe/20 bg-sand cursor-pointer hover:border-taupe/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={onboardingData.noDateYet}
                      onChange={(e) => setOnboardingData({ ...onboardingData, noDateYet: e.target.checked })}
                      className="rounded accent-taupe w-4 h-4"
                    />
                    <span className="text-xs font-classico tracking-wider uppercase font-semibold text-charcoal">
                      I don&apos;t have a firm date yet (Flexible Timeline)
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LOCATION */}
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
                    Where is your celebration located?
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Enter the city or area where you plan to hold your event.
                  </p>
                </div>

                <div className="pt-2 max-w-md">
                  <label className="text-xs font-semibold text-charcoal/80 mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-taupe" />
                    <span>Location / City</span>
                  </label>
                  <input
                    type="text"
                    value={onboardingData.location}
                    onChange={(e) => setOnboardingData({ ...onboardingData, location: e.target.value })}
                    placeholder="e.g. London, Amsterdam, Paris, New York..."
                    className="w-full bg-sand border border-taupe/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['London', 'Amsterdam', 'Paris', 'New York', 'Dubai'].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setOnboardingData({ ...onboardingData, location: city })}
                        className="px-3 py-1 rounded-full border border-taupe/20 text-xs text-charcoal/80 hover:bg-taupe/10 hover:text-taupe transition-colors"
                      >
                        + {city}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: GUEST COUNT */}
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
                    Estimated Guest Count
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    How many guests are you expecting? (Used for catering & venue quotes)
                  </p>
                </div>

                <div className="space-y-6 pt-4 max-w-md">
                  <div className="flex items-center justify-between bg-sand border border-taupe/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-taupe" />
                      <span className="text-xs font-classico tracking-wider uppercase font-semibold text-charcoal">Guests</span>
                    </div>
                    <span className="font-classico text-3xl font-bold text-taupe">
                      {onboardingData.guestCount}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={onboardingData.guestCount}
                    onChange={(e) => setOnboardingData({ ...onboardingData, guestCount: Number(e.target.value) })}
                    className="w-full accent-taupe cursor-pointer"
                  />

                  <div className="flex justify-between text-xs text-charcoal/60 font-mono">
                    <span>10 Intimate</span>
                    <span>100 Standard</span>
                    <span>500+ Grand</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REQUIRED SERVICES */}
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
                    Which services do you need?
                  </h1>
                  <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
                    Select all categories you wish to include in your combined proposal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 max-h-[360px] overflow-y-auto pr-1">
                  {SERVICES_CHECKLIST.map((service) => {
                    const isSelected = onboardingData.selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-taupe bg-taupe/15 text-taupe font-semibold shadow-soft-sm'
                            : 'border-taupe/20 bg-sand text-charcoal/80 hover:border-taupe/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{service.icon}</span>
                          <span className="font-classico text-xs tracking-wider uppercase font-bold text-charcoal truncate">
                            {service.label}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-taupe shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
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
                onClick={handleFinish}
                className="btn-primary px-8 py-3 text-xs font-classico tracking-[0.2em] uppercase flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sand" />
                <span>Create Event & Enter Dashboard</span>
              </button>
            )}
          </div>

        </div>
      </div>

      <footer className="text-center py-4 text-xs font-classico tracking-widest text-charcoal/50 uppercase">
        © 2026 LEEMEVENT • All Rights Reserved
      </footer>
    </main>
  );
}
