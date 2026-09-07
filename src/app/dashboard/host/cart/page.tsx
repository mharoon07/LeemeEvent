'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import {
  bookingsApi,
  paymentsApi,
  decodeServiceDescription,
  normalizeCategory
} from '@/lib/services/consumerApi';
import { PaymentItem } from '@/types/api';
import {
  ShoppingBag,
  Trash2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Lock,
  CreditCard,
  Loader2,
  Check,
  History,
  RefreshCw,
  Building2,
  Package
} from 'lucide-react';

export default function HostCartPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<PaymentItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('ideal_card');
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState<any>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookData, payData] = await Promise.all([
        bookingsApi.getMyBookings(),
        paymentsApi.getPayments(),
      ]);

      setBookings(bookData || []);
      setPaymentHistory(payData || []);
    } catch (err) {
      console.error('Failed to load cart and payment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter items that are in inquiry, accepted, or ready for checkout
  const activeBookings = bookings.filter((b) => {
    const st = (b.status || 'pending').toLowerCase();
    return st !== 'cancelled';
  });

  const totalAmount = activeBookings.reduce((acc, item) => {
    return acc + Number(item.quote_amount || item.service?.base_price || 0);
  }, 0);

  const deposit20Amount = Math.round(totalAmount * 0.20);
  const remaining80Amount = totalAmount - deposit20Amount;

  const handlePayEscrowDeposit = async () => {
    if (activeBookings.length === 0) return;
    setPaying(true);
    try {
      const firstBooking = activeBookings[0];
      const result = await paymentsApi.payDeposit({
        booking_id: firstBooking.id,
        amount: deposit20Amount,
        payment_method: paymentMethod,
      });
      setPaySuccess(result);
      const updatedLedger = await paymentsApi.getPayments();
      setPaymentHistory(updatedLedger);
    } catch (err) {
      console.error('Payment error', err);
    } finally {
      setPaying(false);
    }
  };

  return (
    <HostLayout>
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-taupe uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Escrow Protected Checkout • Synced with Database</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
              Booked Services & 20% Escrow Checkout
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Lock in your requested specialist services in 1 single unified Escrow transaction. Funds are safely held until post-event delivery.
            </p>
          </div>

          <button
            onClick={loadData}
            className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors self-start md:self-auto"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Success Banner */}
        {paySuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-soft-sm">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-lg">20% Escrow Deposit Secured!</h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Ref: <span className="font-mono font-bold">{paySuccess.transaction_ref}</span> • Funds are locked under LEEMEVENT Escrow protection.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/host/requests"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors shadow-soft-sm text-center"
            >
              View Inquiries & Status
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Booked Services */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-charcoal tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-taupe" />
                <span>Selected Specialist Services ({activeBookings.length})</span>
              </h2>
              <Link
                href="/dashboard/host/browse"
                className="text-xs font-bold text-taupe hover:underline flex items-center gap-1"
              >
                <span>+ Add More Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200 p-6">
                <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-stone-500 font-medium">Loading booked services...</p>
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-10 text-center space-y-3 shadow-soft-sm">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <h3 className="font-bold text-charcoal text-base">No services booked yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Browse verified specialist services and click &quot;Book / Inquire&quot; to add packages to your reservation list.
                </p>
                <Link
                  href="/dashboard/host/browse"
                  className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 text-xs font-bold shadow-soft-sm"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeBookings.map((b) => {
                  const srv = b.service;
                  const { text: cleanDesc, image_url: srvImg } = decodeServiceDescription(srv?.description);
                  const sup = b.supplier || srv?.supplier;
                  const supName = sup?.business_name || sup?.name || 'Verified Supplier';
                  const price = Number(b.quote_amount || srv?.base_price || 1500);
                  const st = (b.status || 'pending').toLowerCase();
                  const isAccepted = st === 'accepted' || st === 'availability_confirmed';

                  const image =
                    srvImg ||
                    srv?.image ||
                    sup?.avatar_url ||
                    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop';

                  return (
                    <div
                      key={b.id}
                      className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-soft-sm hover:border-taupe/40 transition-all"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative h-16 w-20 rounded-2xl overflow-hidden shrink-0 bg-stone-100 shadow-sm">
                          <Image src={image} alt={srv?.name || supName} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-taupe uppercase tracking-wider block">
                            {normalizeCategory(sup?.category || 'Specialist')}
                          </span>
                          <h4 className="font-bold text-charcoal text-sm truncate">
                            {srv?.name || 'Custom Celebration Package'}
                          </h4>
                          <span className="text-xs text-stone-500 truncate block mt-0.5">
                            by <strong>{supName}</strong> • {b.requested_date || 'Date TBD'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-charcoal font-mono">
                          €{price.toLocaleString()}
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {isAccepted ? 'Accepted' : 'Inquiry Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Checkout Summary Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-soft-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-charcoal text-base">Escrow Payment Summary</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Escrow Guarantee
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Total Agreed Services Value</span>
                  <span className="font-bold text-charcoal font-mono text-sm">€{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Required Advance Lock (20%)</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">€{deposit20Amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>Post-Event Release Balance (80%)</span>
                  <span className="font-bold text-charcoal font-mono text-sm">€{remaining80Amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-sand-50 rounded-2xl border border-stone-200/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal block">
                  Select Protected Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ideal_card')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'ideal_card'
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit / Debit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_escrow')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'bank_escrow'
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>iDEAL / Bank</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayEscrowDeposit}
                disabled={activeBookings.length === 0 || paying}
                className="w-full btn-primary py-3.5 text-xs font-bold flex items-center justify-center gap-2 rounded-2xl shadow-soft-sm hover:scale-[1.01] transition-transform disabled:opacity-50"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Securing Deposit in Escrow...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-sand" />
                    <span>Pay 20% Deposit (€{deposit20Amount.toLocaleString()}) via Escrow</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-stone-500 text-center leading-snug">
                🔒 Protected by <strong>LEEMEVENT Digital Escrow</strong>. Suppliers receive payment only after satisfactory delivery.
              </div>
            </div>
          </div>
        </div>
      </div>
    </HostLayout>
  );
}
