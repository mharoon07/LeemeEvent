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
  Link as LinkIcon,
  Sparkles,
  Upload,
  RefreshCw,
} from 'lucide-react';

// Curated high-res luxury host avatars
const PRESET_AVATARS = [
  {
    id: 'p1',
    name: 'Executive Host (Eleanor)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'p2',
    name: 'Creative Director (Marcus)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'p3',
    name: 'Milestone Producer (Sophie)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'p4',
    name: 'Gala Curator (Alexander)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'p5',
    name: 'Bespoke Host (Clara)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'p6',
    name: 'Luxury Host (Julian)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
  },
];

/**
 * Client-side canvas compression & square center-crop utility
 * Compresses images of any megapixel size down to a featherlight ~25-35KB Base64 JPEG.
 */
function compressImageFile(file: File, maxDimension = 400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (readerEvent) => {
      const img = document.createElement('img');
      img.onerror = () => reject(new Error('Failed to parse image'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Square center crop calculation
          const minSide = Math.min(width, height);
          const startX = (width - minSide) / 2;
          const startY = (height - minSide) / 2;

          canvas.width = Math.min(minSide, maxDimension);
          canvas.height = Math.min(minSide, maxDimension);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(
            img,
            startX,
            startY,
            minSide,
            minSide,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          resolve(readerEvent.target?.result as string);
        }
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function HostSettingsPage() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStorageKey = () => {
    const uid = user?.id || 'current';
    return `LEEMEVENTS_USER_AVATAR_${uid}`;
  };

  // Get initial cached avatar if exists
  const getInitialAvatar = () => {
    if (typeof window !== 'undefined') {
      const uid = user?.id || 'current';
      const cached = localStorage.getItem(`LEEMEVENTS_USER_AVATAR_${uid}`) || localStorage.getItem('LEEMEVENTS_USER_AVATAR_current');
      if (cached) return cached;
    }
    return user?.avatar || '';
  };

  const [name, setName] = useState(user?.name || 'Eleanor Vance');
  const [email, setEmail] = useState(user?.email || 'eleanor@example.com');
  const [phone, setPhone] = useState(user?.phone || '+31 6 12345678');
  const [city, setCity] = useState(user?.city || 'Den Haag, Netherlands');
  const [avatar, setAvatar] = useState<string>(getInitialAvatar());

  // URL modal / toggle
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

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

      const cached = typeof window !== 'undefined'
        ? (localStorage.getItem(`LEEMEVENTS_USER_AVATAR_${user.id}`) || localStorage.getItem('LEEMEVENTS_USER_AVATAR_current'))
        : null;

      setAvatar(user.avatar || cached || '');
    }
  }, [user]);

  // Handle Photo Upload with HTML5 Canvas auto-compression
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    try {
      setIsProcessingImage(true);
      setImageError(null);

      // Compress and center-crop to 400x400 JPEG (~30KB)
      const compressedDataUrl = await compressImageFile(file, 400, 0.85);
      setAvatar(compressedDataUrl);

      // Cache locally immediately so user sees it right away
      if (typeof window !== 'undefined') {
        const key = getStorageKey();
        try {
          localStorage.setItem(key, compressedDataUrl);
          localStorage.setItem('LEEMEVENTS_USER_AVATAR_current', compressedDataUrl);
        } catch {}
      }

      // Also auto-sync to context so navbar updates immediately
      if (user) {
        updateProfile({ avatar: compressedDataUrl }).catch(() => {});
      }
    } catch (err) {
      console.error('Image processing failed:', err);
      setImageError('Failed to process image. Please try another photo.');
    } finally {
      setIsProcessingImage(false);
      // Reset input value so re-selecting same file triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setAvatar(presetUrl);
    setImageError(null);
    if (typeof window !== 'undefined') {
      const key = getStorageKey();
      try {
        localStorage.setItem(key, presetUrl);
        localStorage.setItem('LEEMEVENTS_USER_AVATAR_current', presetUrl);
      } catch {}
    }
    if (user) {
      updateProfile({ avatar: presetUrl }).catch(() => {});
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const url = customUrlInput.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setImageError('Please enter a valid URL starting with https://');
      return;
    }

    setAvatar(url);
    setImageError(null);
    setCustomUrlInput('');
    setShowUrlInput(false);

    if (typeof window !== 'undefined') {
      const key = getStorageKey();
      try {
        localStorage.setItem(key, url);
        localStorage.setItem('LEEMEVENTS_USER_AVATAR_current', url);
      } catch {}
    }
    if (user) {
      updateProfile({ avatar: url }).catch(() => {});
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    setImageError(null);
    if (typeof window !== 'undefined') {
      const key = getStorageKey();
      try {
        localStorage.removeItem(key);
        localStorage.removeItem('LEEMEVENTS_USER_AVATAR_current');
      } catch {}
    }
    if (user) {
      updateProfile({ avatar: '' }).catch(() => {});
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updatedAvatar = avatar || undefined;

      // Ensure local storage is up to date
      if (typeof window !== 'undefined') {
        const key = getStorageKey();
        if (updatedAvatar) {
          try {
            localStorage.setItem(key, updatedAvatar);
            localStorage.setItem('LEEMEVENTS_USER_AVATAR_current', updatedAvatar);
          } catch {}
        } else {
          localStorage.removeItem(key);
          localStorage.removeItem('LEEMEVENTS_USER_AVATAR_current');
        }
      }

      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        avatar: updatedAvatar,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
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
      <div className="space-y-8 max-w-4xl mx-auto pb-16 w-full">
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

          <div className="flex items-center gap-2 bg-white border border-stone-200/90 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 shadow-soft-sm self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Event Host</span>
          </div>
        </div>

        {/* PROFILE EDIT FORM */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar / Photo Card */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-charcoal">
                  Profile Picture
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Your photo is visible to suppliers and collaborators across the platform.
                </p>
              </div>

              {avatar && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Photo Active</span>
                </span>
              )}
            </div>

            {imageError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Preview */}
              <div className="relative shrink-0">
                {avatar ? (
                  <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-soft-md ring-4 ring-taupe/20 bg-stone-100">
                    <Image
                      src={avatar}
                      alt={name}
                      fill
                      className="object-cover"
                      unoptimized={Boolean(avatar && (avatar.startsWith('data:') || avatar.startsWith('http')))}
                    />
                    {isProcessingImage && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-charcoal to-taupe text-white text-4xl font-bold flex items-center justify-center shadow-soft-md ring-4 ring-taupe/20">
                    {displayInitial}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-charcoal hover:bg-taupe text-white flex items-center justify-center shadow-md transition-all hover:scale-105"
                  title="Upload photo from computer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif, image/heic"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* Upload & Action Controls */}
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingImage}
                    className="btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 shadow-soft-sm"
                  >
                    {isProcessingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload New Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="px-3.5 py-2 rounded-xl border border-stone-200/90 bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-taupe" />
                    <span>Paste Image Link</span>
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-red-50 text-stone-600 hover:text-red-600 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-stone-500">
                  Supported formats: JPG, PNG, WebP, GIF. High-resolution photos are auto-optimized for crystal clarity and instant loading.
                </p>

                {/* Direct Image URL Bar */}
                {showUrlInput && (
                  <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-stone-200/90 space-y-2 animate-in fade-in duration-150">
                    <label className="text-xs font-semibold text-charcoal block">
                      Direct Photo URL (HTTPS)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        className="btn-primary px-4 py-2 text-xs font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* Curated Luxury Preset Avatars */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1 mb-2">
                    <Sparkles className="w-3 h-3 text-taupe" />
                    <span>Or choose a curated profile portrait:</span>
                  </span>

                  <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                    {PRESET_AVATARS.map((p) => {
                      const isSelected = avatar === p.url;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectPreset(p.url)}
                          className={`relative w-10 h-10 rounded-full overflow-hidden transition-all hover:scale-110 ${
                            isSelected
                              ? 'ring-3 ring-charcoal ring-offset-2 shadow-soft-sm'
                              : 'opacity-70 hover:opacity-100 ring-1 ring-stone-200'
                          }`}
                          title={`Select ${p.name}`}
                        >
                          <Image
                            src={p.url}
                            alt={p.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
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

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {saveSuccess ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Profile & Picture Changes Saved Permanently</span>
                </span>
              ) : (
                <span className="text-xs text-stone-400">All updates sync across your host portal in real-time.</span>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-soft-sm hover:shadow-soft-md transition-all self-end sm:self-auto"
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
