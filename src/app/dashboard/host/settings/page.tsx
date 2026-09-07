'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import HostLayout from '@/components/dashboard/HostLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  User,
  Camera,
  Save,
  Check,
  Lock,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function HostSettingsPage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || 'Eleanor Vance');
  const [email, setEmail] = useState(user?.email || 'eleanor@example.com');
  const [phone, setPhone] = useState(user?.phone || '+31 6 12345678');
  const [city, setCity] = useState(user?.city || 'Den Haag, Netherlands');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '+31 6 12345678');
      setCity(user.city || 'Den Haag, Netherlands');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  // Handle Photo Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Please upload an image smaller than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setAvatar(base64Url);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        avatar: avatar || undefined,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    try {
      await api.post('/auth/change-password', {
        password: newPassword,
        email: user?.email,
      });
      setPasswordMsg({ type: 'success', text: 'Security credentials updated in Supabase Auth successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password. Please try again.' });
    }
  };

  const displayInitial = name ? name.charAt(0).toUpperCase() : 'H';

  return (
    <HostLayout>
      <div className="space-y-8 max-w-4xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
              <span>Account Hub</span>
              <span>•</span>
              <span>Host Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Profile & Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage your personal information, profile photo, and security preferences.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-stone-200/90 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 shadow-soft-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Event Host</span>
          </div>
        </div>

        {/* PROFILE EDIT FORM */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar / Photo Card */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-6">
            <h2 className="text-base font-bold text-charcoal border-b border-stone-100 pb-3">
              Profile Picture
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                {avatar ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-soft-md ring-4 ring-taupe/20">
                    <Image
                      src={avatar}
                      alt={name}
                      fill
                      className="object-cover"
                      unoptimized={Boolean(avatar && (avatar.startsWith('data:') || avatar.startsWith('http')))}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-taupe text-white text-3xl font-bold flex items-center justify-center shadow-soft-md ring-4 ring-taupe/20">
                    {displayInitial}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-charcoal hover:bg-taupe text-white flex items-center justify-center shadow-md transition-colors"
                  title="Upload photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary px-4 py-2 text-xs font-semibold"
                  >
                    Upload New Photo
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-red-50 text-stone-600 hover:text-red-600 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-stone-400">
                  Allowed JPG, PNG, WebP or GIF. Max size 3MB. Picture stays permanently saved.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-5">
            <h2 className="text-base font-bold text-charcoal border-b border-stone-100 pb-3">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-taupe" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-taupe" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-taupe" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-taupe" />
                  <span>City / Location</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Den Haag, Netherlands"
                  className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Profile Changes Saved Permanently</span>
                </span>
              ) : (
                <span className="text-xs text-stone-400">All updates sync across your host portal.</span>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* SECURITY & PASSWORD UPDATE CARD */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-5">
          <h2 className="text-base font-bold text-charcoal border-b border-stone-100 pb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-taupe" />
            <span>Security & Password</span>
          </h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-xl">
            {passwordMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal/80 mb-1 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-taupe"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-secondary px-5 py-2.5 text-xs font-bold"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </HostLayout>
  );
}
