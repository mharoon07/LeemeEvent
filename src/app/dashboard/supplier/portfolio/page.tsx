'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { Upload, Trash2, Plus } from 'lucide-react';

export default function SupplierPortfolioPage() {
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop',
  ]);

  const removeImg = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
              Media Gallery
            </span>
            <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
              Portfolio Manager
            </h1>
          </div>

          <button className="btn-primary px-5 py-2.5 text-xs flex items-center gap-2">
            <Upload className="w-4 h-4 text-sand" />
            <span>Upload Photos</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative h-44 rounded-2xl overflow-hidden border border-taupe/20 group">
              <Image src={img} alt={`Portfolio item ${i + 1}`} fill className="object-cover" />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => removeImg(i)}
                  className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SupplierLayout>
  );
}
