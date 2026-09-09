'use client';

import React, { useState, useEffect } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import { supplierPortalApi } from '@/lib/services/consumerApi';
import { api } from '@/lib/api';
import {
  Save,
  ShieldCheck,
  Lock,
  Store,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

export default function SupplierProfilePage() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Business profile form
  const [brand, setBrand] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Spain');
  const [radiusKm, setRadiusKm] = useState('50');
  const [yearsInBusiness, setYearsInBusiness] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('LEEMEVENTS_SUPPLIER_YEARS_IN_BUSINESS') || '';
    }
    return '';
  });
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Password reset form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getStorageKeys = () => {
    const uid = user?.id || 'current';
    return {
      userYears: `LEEMEVENTS_SUPPLIER_YEARS_IN_BUSINESS_${uid}`,
      globalYears: 'LEEMEVENTS_SUPPLIER_YEARS_IN_BUSINESS',
    };
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const keys = getStorageKeys();
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(keys.userYears) || localStorage.getItem(keys.globalYears);
        if (cached) setYearsInBusiness(cached);
      }

      const data = await supplierPortalApi.getProfile();
      if (data) {
        setBrand(data.business_name || user?.businessName || '');
        setCity(data.city || user?.city || 'Madrid');
        setCountry(data.country || 'Spain');
        setRadiusKm(String(data.service_radius_km || 50));
        setPhone(data.profile?.phone || user?.phone || '');
        setBio(data.bio || '');

        const backendYears =
          data.years_in_business !== undefined && data.years_in_business !== null && String(data.years_in_business).trim() !== ''
            ? String(data.years_in_business)
            : data.yearsInBusiness !== undefined && data.yearsInBusiness !== null && String(data.yearsInBusiness).trim() !== ''
            ? String(data.yearsInBusiness)
            : data.experience_years !== undefined && data.experience_years !== null
            ? String(data.experience_years)
            : data.experience !== undefined && data.experience !== null
            ? String(data.experience)
            : null;

        if (backendYears) {
          setYearsInBusiness(backendYears);
          if (typeof window !== 'undefined') {
            localStorage.setItem(keys.userYears, backendYears);
            localStorage.setItem(keys.globalYears, backendYears);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load supplier profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const yVal = yearsInBusiness.trim();
      const keys = getStorageKeys();

      if (typeof window !== 'undefined') {
        localStorage.setItem(keys.userYears, yVal);
        localStorage.setItem(keys.globalYears, yVal);
      }

      const payload = {
        business_name: brand.trim(),
        city: city.trim(),
        country: country.trim(),
        service_radius_km: Number(radiusKm),
        years_in_business: yVal,
        yearsInBusiness: yVal,
        experience_years: parseInt(yVal, 10) || 0,
        experience: yVal,
        bio: bio.trim(),
      };

      await supplierPortalApi.updateProfile(payload);
      await updateProfile({
        businessName: brand.trim(),
        city: city.trim(),
      });

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3500);
    } catch (err: any) {
      alert(`Error updating profile: ${err?.message || 'Server error'}`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.post('/auth/change-password', {
        email: user?.email,
        newPassword,
      });

      setPasswordMessage({
        type: 'success',
        text: 'Password successfully updated and synced in Supabase Auth!',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMessage({
        type: 'error',
        text: err?.message || 'Failed to update password. Please try again.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
              Partner Settings
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              Account & Public Profile
            </h1>
            <p className="text-xs text-stone-500">
              Manage your brand identity, service coverage, and Supabase credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Partner</span>
            </span>
          </div>
        </div>

        {/* Business Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal">Business Profile</h2>
              <span className="text-[11px] text-stone-500">Visible to event hosts across the marketplace</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-charcoal mb-1 block">Brand / Business Name *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Grand Palace Gastronomy & Catering"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">City / Base Location *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Madrid"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Spain"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">Service Radius (km)</label>
              <input
                type="number"
                min="5"
                max="500"
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">Years in Business (Experience)</label>
              <input
                type="text"
                value={yearsInBusiness}
                onChange={(e) => {
                  setYearsInBusiness(e.target.value);
                  const keys = getStorageKeys();
                  if (typeof window !== 'undefined') {
                    localStorage.setItem(keys.userYears, e.target.value);
                    localStorage.setItem(keys.globalYears, e.target.value);
                  }
                }}
                placeholder="e.g. 8"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">Contact Email (Account)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-charcoal mb-1 block">Editorial Biography & Presentation</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your culinary style, visual aesthetic, accolades, and bespoke event packages..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-taupe resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            {profileSaved ? (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated & saved to Supabase!</span>
              </span>
            ) : <div />}

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe transition-colors flex items-center gap-2 disabled:opacity-50 shadow-soft-sm"
            >
              {savingProfile ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security & Password Reset Form */}
        <form onSubmit={handleUpdatePassword} className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-sm">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
            <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal">Security & Password</h2>
              <span className="text-[11px] text-stone-500">Live Supabase Auth synchronization</span>
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                passwordMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {passwordMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">New Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">Confirm New Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-2.5 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe transition-colors flex items-center gap-2 disabled:opacity-50 shadow-soft-sm"
            >
              {savingPassword ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating in Supabase Auth...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </SupplierLayout>
  );
}
