'use client';

import React, { useState, useEffect } from 'react';
import HostLayout from '@/components/dashboard/HostLayout';
import { contractsApi, normalizeCategory } from '@/lib/services/consumerApi';
import { ContractItem } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import {
  FileCode,
  Download,
  ShieldCheck,
  FileText,
  PenTool,
  Check,
  X,
  Loader2,
  CalendarDays,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function HostDocumentsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Signing Modal State
  const [signingContract, setSigningContract] = useState<ContractItem | null>(null);
  const [signatureName, setSignatureName] = useState(user?.name || user?.email || '');
  const [isAgreed, setIsAgreed] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  const fetchContracts = async () => {
    if (authLoading) return;
    if (!user?.id && !user?.email) {
      setContracts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await contractsApi.getContracts();
      setContracts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchContracts();
    }
    if (user?.name || user?.email) {
      setSignatureName(user.name || user.email || '');
    }
  }, [user?.id, user?.email, authLoading]);

  const handleSignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingContract || !isAgreed || !signatureName.trim()) return;

    setSigningLoading(true);
    try {
      await contractsApi.signContract(signingContract.booking_id, signatureName);
      setSignSuccess(true);
      setContracts((prev) =>
        prev.map((c) =>
          c.id === signingContract.id
            ? {
                ...c,
                status: 'signed',
                signed_at: new Date().toISOString(),
              }
            : c
        )
      );
      setTimeout(() => {
        setSignSuccess(false);
        setSigningContract(null);
        setIsAgreed(false);
      }, 1800);
    } catch (err) {
      console.error('Failed to sign contract', err);
    } finally {
      setSigningLoading(false);
    }
  };

  return (
    <HostLayout>
      <div className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
              <span>GET /api/contracts</span>
              <span>•</span>
              <span>Legal Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Documents & Digital Agreements
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Review and digitally execute vendor agreements backed by LEEMEVENTS verified Escrow terms.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 shadow-soft-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Escrow Protection</span>
          </div>
        </div>

        {/* Contracts List */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-taupe mx-auto mb-3" />
            <p className="text-xs text-stone-500">Loading digital contracts from backend...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((doc) => {
              const isSigned = doc.status === 'signed';

              return (
                <div
                  key={doc.id}
                  className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-soft-sm hover:border-taupe/40 hover:shadow-soft-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-1 ${
                        isSigned
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isSigned ? (
                        <ShieldCheck className="w-6 h-6" />
                      ) : (
                        <PenTool className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-taupe uppercase tracking-wider">
                          {normalizeCategory(doc.category)}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isSigned
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isSigned ? 'Digitally Signed & Valid' : 'Signature Required'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-charcoal">{doc.title}</h3>
                      <p className="text-xs text-stone-500">
                        Party: <strong className="text-charcoal font-semibold">{doc.supplier_name}</strong> • Total:{' '}
                        <strong className="text-charcoal font-semibold">€{doc.total_amount.toLocaleString()}</strong> (25% Deposit:{' '}
                        €{doc.deposit_amount.toLocaleString()})
                      </p>
                      {doc.terms_summary && (
                        <p className="text-[11px] text-stone-400 max-w-xl">{doc.terms_summary}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                    {!isSigned ? (
                      <button
                        type="button"
                        onClick={() => setSigningContract(doc)}
                        className="btn-primary px-4 py-2 text-xs flex items-center gap-2 shadow-soft-sm"
                      >
                        <PenTool className="w-3.5 h-3.5 text-sand" />
                        <span>Sign Contract</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Executed</span>
                        </span>
                        <button
                          type="button"
                          className="btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
                          onClick={() => alert(`Downloading verified PDF for: ${doc.title}`)}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DIGITAL SIGNATURE MODAL (POST /api/contracts/:bookingId/sign) */}
        {signingContract && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setSigningContract(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>POST /api/contracts/{signingContract.booking_id}/sign</span>
                </div>
                <h2 className="text-xl font-bold text-charcoal">Sign Digital Event Agreement</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Agreement between you and <strong className="text-charcoal">{signingContract.supplier_name}</strong>
                </p>
              </div>

              {signSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-800">Contract Signed Successfully!</h3>
                  <p className="text-xs text-emerald-700">
                    Timestamped digital signature registered. Ready for 25% Escrow lock.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSignSubmit} className="space-y-4">
                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Total Agreed Value:</span>
                      <strong className="text-charcoal">€{signingContract.total_amount.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>25% Escrow Deposit:</span>
                      <strong className="text-amber-700">€{signingContract.deposit_amount.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Event Execution Date:</span>
                      <strong className="text-charcoal">{signingContract.event_date}</strong>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Legal Name (Electronic Signature) *
                    </label>
                    <input
                      type="text"
                      required
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-classico tracking-wider focus:outline-none focus:ring-2 focus:ring-taupe bg-[#FAF8F5]"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      required
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-taupe focus:ring-taupe"
                    />
                    <span className="text-xs text-stone-600 leading-snug">
                      I agree to the terms of service and authorize placing the 25% deposit in LEEMEVENTS Escrow Protection.
                    </span>
                  </label>

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setSigningContract(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={signingLoading || !isAgreed}
                      className="btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                      {signingLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing Signature...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-sand" />
                          <span>Sign & Finalize Agreement</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </HostLayout>
  );
}
