'use client';

import React, { useState } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { Plus, Trash2, Edit, DollarSign, Sparkles } from 'lucide-react';

export default function SupplierServicesPage() {
  const [services, setServices] = useState([
    { id: '1', name: 'Full Luxury Floral & Backdrop Styling', desc: 'Custom ceremony arch, aisle florals & centerpieces', price: '2200', unit: 'per event' },
    { id: '2', name: 'Bridal Bouquet & Party Flowers', desc: 'Bridal bouquet, 4 bridesmaid bouquets & boutonnieres', price: '650', unit: 'per event' },
    { id: '3', name: 'Intimate Tablescape Styling', desc: 'Table runners, taper candles & seasonal floral bud vases', price: '450', unit: 'per table' },
  ]);

  const [newItem, setNewItem] = useState({ name: '', desc: '', price: '', unit: 'per event' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    setServices([...services, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ name: '', desc: '', price: '', unit: 'per event' });
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Service Catalog
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Services & Package Pricing
          </h1>
        </div>

        {/* Existing Line Items */}
        <div className="space-y-4">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-soft-sm"
            >
              <div>
                <h3 className="font-classico text-lg uppercase font-bold text-charcoal">{item.name}</h3>
                <p className="text-xs text-charcoal/70 mt-0.5">{item.desc}</p>
                <span className="font-mono text-sm font-bold text-taupe block mt-2">
                  ${item.price} <span className="text-xs font-normal text-charcoal/60 font-sans">({item.unit})</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-2 text-charcoal/40 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Form to Add New Service */}
        <form onSubmit={handleAdd} className="bg-sand-100 border border-taupe/20 rounded-3xl p-6 space-y-4">
          <h3 className="font-classico text-lg uppercase font-bold text-charcoal flex items-center gap-2">
            <Plus className="w-4 h-4 text-taupe" />
            <span>Add New Package Line Item</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Package Name *</label>
              <input
                type="text"
                required
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Cocktail Hour Flower Bar"
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Price ($) *</label>
              <input
                type="number"
                required
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                placeholder="850"
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-charcoal/80 mb-1 block">Description</label>
              <input
                type="text"
                value={newItem.desc}
                onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                placeholder="Details of what is included in this service package"
                className="w-full bg-sand border border-taupe/20 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-classico tracking-wider uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sand" />
            <span>Add Package to Directory</span>
          </button>
        </form>
      </div>
    </SupplierLayout>
  );
}
