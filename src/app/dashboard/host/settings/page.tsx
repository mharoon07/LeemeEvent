'use client';

import React, { useState } from 'react';
import HostLayout from '@/components/dashboard/HostLayout';
import { useAuth } from '@/context/AuthContext';
import { User, Bell, Shield, Save } from 'lucide-react';

export default function HostSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(user?.name || 'Eleanor Vance');
  const [email, setEmail] = useState(user?.email || 'eleanor@example.com');
  const [phone, setPhone] = useState('+44 7911 123456');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <HostLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Account Preferences
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Profile & Settings
          </h1>
        </div>

        <form onSubmit={handleSave} className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
          <div className="space-y-4">
            <h3 className="font-classico text-xl uppercase font-semibold text-charcoal border-b border-taupe/15 pb-3">
              Personal Information
            </h3>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-taupe/15 flex items-center justify-between">
            {saved && (
              <span className="text-xs text-emerald-700 font-semibold font-classico tracking-wider uppercase">
                ✓ Changes Saved Successfully
              </span>
            )}
            <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-classico tracking-wider uppercase flex items-center gap-2 ml-auto">
              <Save className="w-4 h-4 text-sand" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </HostLayout>
  );
}
