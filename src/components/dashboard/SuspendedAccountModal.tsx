'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  ShieldCheck,
  LogOut,
  Mail,
  Home,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface SuspendedAccountModalProps {
  isOpen: boolean;
  mode?: 'suspended' | 'pending' | 'rejected';
  role?: 'host' | 'supplier' | 'admin';
  reason?: string;
}

export default function SuspendedAccountModal({
  isOpen,
  mode = 'suspended',
  role = 'host',
  reason,
}: SuspendedAccountModalProps) {
  const router = useRouter();
  const { logout, user, checkSuspension } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReturnHome = async () => {
    try {
      await logout();
    } catch {
      // Ignore
    }
    router.push('/');
  };

  const handleCheckApproval = async () => {
    setIsChecking(true);
    setSyncFeedback(null);
    try {
      if (checkSuspension) {
        const latestProfile = await checkSuspension();
        const isNowApproved =
          latestProfile?.verification_status === 'verified' ||
          latestProfile?.supplierApproved === true;

        if (isNowApproved) {
          setSyncFeedback('✅ Approved by Admin! Opening your Studio Dashboard...');
          setTimeout(() => {
            window.location.reload();
          }, 350);
          return;
        } else if (latestProfile?.verification_status === 'rejected') {
          setSyncFeedback('❌ Application was declined by Admin. Contact support for details.');
        } else {
          setSyncFeedback('⏳ Application is still pending Admin review (24-48h). Please check back shortly!');
        }
      }
    } catch {
      setSyncFeedback('Could not sync status. Please check your connection.');
    } finally {
      setIsChecking(false);
    }
  };

  const isSupplier = role === 'supplier' || user?.role === 'supplier';

  // Determine actual display state
  const isPendingMode = mode === 'pending';
  const isRejectedMode = mode === 'rejected';
  const isSuspendedMode = mode === 'suspended';

  return (
    <div className="fixed inset-0 z-[9999] bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200/80 relative overflow-hidden text-center animate-in zoom-in-95 duration-200">
        
        {/* Top Accent Bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            isPendingMode
              ? 'bg-gradient-to-r from-amber-400 via-taupe to-amber-600'
              : isRejectedMode
              ? 'bg-gradient-to-r from-rose-500 to-rose-700'
              : 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-700'
          }`}
        />

        {/* Icon */}
        <div
          className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-soft-sm border ${
            isPendingMode
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : isRejectedMode
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-rose-50 text-rose-600 border-rose-200'
          }`}
        >
          {isPendingMode ? (
            <Clock className="w-8 h-8 stroke-[1.75] animate-pulse" />
          ) : isRejectedMode ? (
            <XCircle className="w-8 h-8 stroke-[1.75]" />
          ) : (
            <ShieldAlert className="w-8 h-8 stroke-[1.75]" />
          )}
        </div>

        {/* Status Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3 border ${
            isPendingMode
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : isRejectedMode
              ? 'bg-rose-100 text-rose-900 border-rose-300'
              : 'bg-rose-100 text-rose-900 border-rose-300'
          }`}
        >
          {isPendingMode ? (
            <>
              <Clock className="w-3 h-3" />
              <span>Awaiting Admin Approval (24–48h)</span>
            </>
          ) : isRejectedMode ? (
            <>
              <XCircle className="w-3 h-3" />
              <span>Application Declined</span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3" />
              <span>Access Restricted by Admin</span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight font-classico">
          {isPendingMode
            ? 'Studio Application Under Review'
            : isRejectedMode
            ? 'Application Declined'
            : isSupplier
            ? 'Supplier Account Suspended'
            : 'Host Account Suspended'}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
          {isPendingMode
            ? 'Your supplier studio registration has been submitted and is currently locked pending review by the LeemeEvent Concierge & Trust team. Estimated review time: 24 to 48 hours. Once verified by the Admin, you will receive full access.'
            : isRejectedMode
            ? 'Your supplier studio application was not approved by the admin team. All services and marketplace access are currently locked.'
            : isSupplier
            ? 'Your supplier studio access has been suspended by the platform administration. Services are unlisted and requests are disabled.'
            : 'Your host account has been suspended by the platform administration. All event planning actions and bookings are locked.'}
        </p>

        {/* Reason notice if available */}
        {reason && (
          <div className="mt-4 p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-left text-xs text-stone-700">
            <span className="font-bold text-charcoal block mb-0.5">Notice from Admin:</span>
            <span>{reason}</span>
          </div>
        )}

        {/* Vetting Steps if Pending */}
        {isPendingMode && (
          <div className="mt-5 p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>1. Registration & Details Submitted</span>
            </div>
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Clock className="w-4 h-4 text-amber-700 animate-spin shrink-0" />
              <span>2. Admin Quality & Identity Review (In Progress)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <Lock className="w-4 h-4 text-stone-300 shrink-0" />
              <span>3. Dashboard & Marketplace Activation (Pending)</span>
            </div>
          </div>
        )}

        {/* Feedback text on sync */}
        {syncFeedback && (
          <p className="text-xs font-semibold text-taupe mt-3 animate-in fade-in">
            {syncFeedback}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {isPendingMode ? (
            <>
              <button
                type="button"
                disabled={isChecking}
                onClick={handleCheckApproval}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-charcoal text-white hover:bg-taupe text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-taupe-200' : ''}`} />
                <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
              </button>

              <button
                type="button"
                onClick={handleReturnHome}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-charcoal transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5 text-stone-500" />
                <span>Back to Home</span>
              </button>
            </>
          ) : (
            <>
              <a
                href="mailto:support@leemevent.com?subject=Account%20Review%20Inquiry"
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-charcoal transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>Contact Support</span>
              </a>

              <button
                type="button"
                onClick={handleReturnHome}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-charcoal text-white hover:bg-taupe text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5 text-sand" />
                <span>Back to Home</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-5 text-[10px] text-stone-400">
          Account Email: <span className="font-mono">{user?.email || 'N/A'}</span>
        </p>
      </div>
    </div>
  );
}
