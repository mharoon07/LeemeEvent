'use client';

import React, { useState } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import { Save, ShieldCheck } from 'lucide-react';

export default function SupplierProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [brand, setBrand] = useState(user?.businessName || 'Aura Floral & Styling');
  const [category, setCategory] = useState('Floral & Decor');
  const [location, setLocation] = useState('London & Home Counties, UK');
  const [desc, setDesc] = useState('Curated luxury floral design and stone aesthetic event styling for milestone weddings and celebrations.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Directory Listing
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Account & Public Profile
          </h1>
        </div>

        <form onSubmit={handleSave} className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full w-max">
              <ShieldCheck className="w-4 h-4" />
              <span>Status: Verified Active Partner</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Brand / Business Name</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Primary Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Service Region</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Public Description</label>
              <textarea
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-taupe/15 flex items-center justify-between">
            {saved && (
              <span className="text-xs text-emerald-700 font-semibold font-classico uppercase">
                ✓ Directory Profile Saved
              </span>
            )}
            <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-classico uppercase flex items-center gap-2 ml-auto">
              <Save className="w-4 h-4 text-sand" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </SupplierLayout>
  );
}
