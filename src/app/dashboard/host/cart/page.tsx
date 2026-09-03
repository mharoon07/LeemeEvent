'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import { ShoppingBag, Trash2, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HostCartPage() {
  const [items, setItems] = useState([
    {
      id: 'cart_1',
      name: 'Château de Bellevue',
      category: 'Venue & Location',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'cart_2',
      name: 'Maison Gourmet Catering (120 guests)',
      category: 'Catering & Food',
      price: 3800,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'cart_3',
      name: 'Lumière Wedding Photography',
      category: 'Photography',
      price: 2900,
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
    },
  ]);

  const [sent, setSent] = useState(false);

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const totalAmount = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <HostLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-taupe block">
            Combined Proposal Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-1 tracking-tight">
            My Selected Supplier Package
          </h1>
        </div>

        {!sent ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Selected Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-stone-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft-sm hover:border-taupe/40 transition-all"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative h-20 w-24 rounded-xl overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="text-xs text-taupe font-semibold uppercase tracking-wider block">
                          {item.category}
                        </span>
                        <h4 className="text-base font-bold text-charcoal">
                          {item.name}
                        </h4>
                        <span className="font-mono text-sm font-bold text-taupe">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors self-end sm:self-center"
                      title="Remove from request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-stone-200/90 rounded-3xl p-12 text-center space-y-4 shadow-soft-sm">
                  <div className="w-14 h-14 rounded-2xl bg-taupe/10 text-taupe flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal">Your Selection is Empty</h3>
                  <p className="text-sm text-stone-500">Browse our directory to add suppliers to your combined proposal.</p>
                  <Link href="/dashboard/host/browse" className="btn-primary inline-flex px-6 py-2.5 text-sm font-semibold">
                    Browse Suppliers Directory
                  </Link>
                </div>
              )}
            </div>

            {/* Price Summary & Checkout Panel */}
            <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-3xl p-6 space-y-6 shadow-soft-sm">
              <h3 className="text-lg font-bold text-charcoal border-b border-stone-100 pb-4">
                Request Summary
              </h3>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Selected Suppliers ({items.length})</span>
                  <span className="font-mono font-bold text-charcoal">${totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>LEEMEVENTS Concierge Match</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>1 Consolidated Agreement</span>
                  <span className="text-emerald-700 font-bold">Included</span>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-1">
                <div className="flex justify-between text-sm font-bold text-charcoal">
                  <span>Estimated Package Total</span>
                  <span className="font-mono text-lg font-bold text-taupe">${totalAmount.toLocaleString()}</span>
                </div>
                <span className="text-xs text-stone-500 block">Includes date hold & partner availability sync</span>
              </div>

              <button
                type="button"
                disabled={items.length === 0}
                onClick={() => setSent(true)}
                className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 shadow-soft-sm hover:shadow-soft-md transition-all"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Send Combined Request</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-charcoal/60 pt-2">
                <ShieldCheck className="w-4 h-4 text-taupe shrink-0" />
                <span>Zero payment due until suppliers accept your date</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-soft-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[3]" />
            </div>
            <h2 className="text-2xl font-bold text-charcoal">
              Combined Request Sent!
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
              Your request for <strong>{items.length} suppliers</strong> (${totalAmount.toLocaleString()} total package) has been transmitted. Your assigned matchmaker will monitor responses.
            </p>
            <div className="pt-4">
              <Link href="/dashboard/host/requests" className="btn-primary px-8 py-3 text-sm font-medium inline-flex items-center gap-2">
                <span>Track Booking Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </HostLayout>
  );
}
