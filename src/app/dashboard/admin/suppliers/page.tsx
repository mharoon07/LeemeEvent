'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import adminApi from '@/lib/services/adminApi';
import { AdminSupplierItem } from '@/types/api';
import {
  Store,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  RefreshCw,
  MoreVertical,
  X,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<AdminSupplierItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal for Reject / Custom reason
  const [modalSupplier, setModalSupplier] = useState<AdminSupplierItem | null>(null);
  const [modalAction, setModalAction] = useState<'verify' | 'reject' | 'suspend' | null>(null);
  const [reasonInput, setReasonInput] = useState('');

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSuppliers({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
      });
      setSuppliers(data || []);
    } catch (err: any) {
      console.error('Failed to load suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadSuppliers();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleOpenActionModal = (
    supplier: AdminSupplierItem,
    action: 'verify' | 'reject' | 'suspend'
  ) => {
    setModalSupplier(supplier);
    setModalAction(action);
    setReasonInput('');
  };

  const handleDirectApprove = async (supplier: AdminSupplierItem) => {
    setActionLoadingId(supplier.id);
    setFeedback(null);
    try {
      await adminApi.verifySupplier(supplier.id, 'verified');

      const userId = supplier.user_id || supplier.user?.id || (supplier.profile as any)?.id;
      if (userId) {
        try {
          await adminApi.updateUserStatus(userId, true);
        } catch {}
      }

      setFeedback({
        text: `Supplier "${supplier.business_name}" is now Approved and Live in Directory!`,
        type: 'success',
      });

      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === supplier.id
            ? { ...s, verification_status: 'verified', verification_notes: '' }
            : s
        )
      );
    } catch (err: any) {
      setFeedback({
        text: err?.message || 'Failed to approve supplier.',
        type: 'error',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!modalSupplier || !modalAction) return;

    setActionLoadingId(modalSupplier.id);
    setFeedback(null);

    const targetStatus: 'verified' | 'rejected' | 'suspended' =
      modalAction === 'verify' ? 'verified' : modalAction === 'reject' ? 'rejected' : 'suspended';

    try {
      await adminApi.verifySupplier(modalSupplier.id, targetStatus, reasonInput || undefined);

      // Also synchronize user profile status if user id is present
      const userId = modalSupplier.user_id || modalSupplier.user?.id || (modalSupplier.profile as any)?.id;
      if (userId) {
        try {
          await adminApi.updateUserStatus(userId, targetStatus === 'verified');
        } catch {}
      }

      setFeedback({
        text: `Supplier "${modalSupplier.business_name}" status changed to "${targetStatus}".`,
        type: 'success',
      });

      // Update state locally
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === modalSupplier.id
            ? { ...s, verification_status: targetStatus, verification_notes: reasonInput }
            : s
        )
      );
      setModalSupplier(null);
      setModalAction(null);
    } catch (err: any) {
      setFeedback({
        text: err?.message || 'Failed to update supplier status.',
        type: 'error',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingCount = suppliers.filter((s) => s.verification_status === 'pending').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-taupe" />
              <h1 className="font-classico text-2xl font-bold uppercase tracking-tight text-charcoal">
                Suppliers & Approvals
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Review vendor applications, manage verified directories, and configure supplier credentials.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSuppliers}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-charcoal hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-2 shadow-soft-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-taupe' : ''}`} />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* FEEDBACK NOTIFICATION */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-stone-400 hover:text-stone-700 underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SEARCH & STATUS FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-soft-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by business name, city, owner email or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40 transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
            {(
              [
                { key: 'all', label: 'All Suppliers' },
                { key: 'pending', label: 'Pending Review' },
                { key: 'verified', label: 'Verified' },
                { key: 'rejected', label: 'Rejected' },
                { key: 'suspended', label: 'Suspended' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.key
                    ? 'bg-white text-charcoal shadow-soft-sm'
                    : 'text-stone-500 hover:text-charcoal hover:bg-stone-50/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SUPPLIERS TABLE */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">Business & Owner</th>
                  <th className="py-3.5 px-6">Category & City</th>
                  <th className="py-3.5 px-6">Pricing & Rating</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-taupe" />
                        <span>Loading suppliers list...</span>
                      </div>
                    </td>
                  </tr>
                ) : suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400">
                      No suppliers found matching your filters.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => {
                    const isProcessing = actionLoadingId === supplier.id;
                    const business = supplier.business_name || 'Unnamed Studio';
                    const ownerName = supplier.user?.full_name || supplier.full_name || supplier.profile?.full_name || 'Vendor Partner';
                    const ownerEmail = supplier.user?.email || supplier.email || supplier.profile?.email || 'N/A';
                    const ownerPhone = supplier.user?.phone || supplier.phone || supplier.profile?.phone;
                    const category = supplier.category_name || supplier.category?.name || 'General';
                    const city = supplier.city || 'Den Haag';
                    const rating = supplier.rating_avg || 5.0;
                    const status = supplier.verification_status || 'pending';

                    return (
                      <tr
                        key={supplier.id}
                        className="hover:bg-stone-50/70 transition-colors group"
                      >
                        {/* Business & Owner */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 text-charcoal font-bold flex items-center justify-center shrink-0 border border-stone-200">
                              {business.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-charcoal block truncate text-xs">
                                {business}
                              </span>
                              <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                                <span>{ownerName}</span>
                                <span>•</span>
                                <span className="text-stone-400">{ownerEmail}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category & City */}
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[11px] mb-1">
                            {category}
                          </span>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{city}</span>
                          </div>
                        </td>

                        {/* Pricing & Rating */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 font-bold text-charcoal">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{Number(rating).toFixed(1)}</span>
                            <span className="text-[10px] text-stone-400 font-normal">
                              ({supplier.review_count || 0})
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            From €{supplier.starting_price || 250}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : status === 'suspended'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800 animate-pulse'
                            }`}
                          >
                            {status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                            {status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {status === 'pending' && <Clock className="w-3 h-3" />}
                            <span>{status}</span>
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {status === 'verified' ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleOpenActionModal(supplier, 'reject')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm"
                                  title="Reject Supplier Application"
                                >
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  <span>Reject</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={isProcessing}
                                  onClick={() => handleOpenActionModal(supplier, 'suspend')}
                                  className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm"
                                  title="Suspend Supplier Account"
                                >
                                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                                  <span>Suspend</span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleDirectApprove(supplier)}
                                className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-800 disabled:opacity-50 transition-all flex items-center gap-1 shadow-sm"
                                title="Approve & Grant Full Studio Access"
                              >
                                {isProcessing ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3 h-3" />
                                )}
                                <span>{status === 'suspended' || status === 'rejected' ? 'Re-Approve' : 'Approve'}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DECISION / REASON MODAL */}
        {modalSupplier && modalAction && (
          <div
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setModalSupplier(null);
                setModalAction(null);
              }
            }}
          >
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 my-auto animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  {modalAction === 'verify' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  ) : modalAction === 'reject' ? (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <h3 className="font-bold text-charcoal text-base capitalize">
                    {modalAction === 'verify'
                      ? 'Approve Supplier'
                      : modalAction === 'reject'
                      ? 'Reject Supplier Application'
                      : 'Suspend Supplier'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalSupplier(null);
                    setModalAction(null);
                  }}
                  className="p-1 rounded-lg text-stone-400 hover:text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 mb-4">
                You are about to change the verification status of{' '}
                <strong className="text-charcoal">{modalSupplier.business_name}</strong> to{' '}
                <span className="font-bold uppercase">{modalAction === 'verify' ? 'verified' : modalAction}</span>.
              </p>

              <div className="mb-4">
                <label className="text-[11px] font-bold text-stone-600 block mb-1.5">
                  Optional Feedback or Internal Note:
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    modalAction === 'reject'
                      ? 'e.g., Portfolio photos do not meet quality standard or missing permits.'
                      : 'e.g., Verified business registry and liability insurance.'
                  }
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalSupplier(null);
                    setModalAction(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={actionLoadingId !== null}
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                    modalAction === 'verify'
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                >
                  {actionLoadingId ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : modalAction === 'verify' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span>Confirm Status Update</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
