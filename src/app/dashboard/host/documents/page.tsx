'use client';

import React from 'react';
import HostLayout from '@/components/dashboard/HostLayout';
import { FileCode, Download, ShieldCheck, FileText } from 'lucide-react';

export default function HostDocumentsPage() {
  const docs = [
    {
      name: 'Unified Event Agreement - Château de Bellevue & Catering.pdf',
      type: 'Contract',
      size: '2.4 MB',
      date: 'Aug 29, 2026',
    },
    {
      name: 'Deposit Receipt - $4,500 Venue Payment.pdf',
      type: 'Receipt',
      size: '840 KB',
      date: 'Aug 30, 2026',
    },
    {
      name: 'Lumière Photography Timeline & Shot List.pdf',
      type: 'Timeline Brief',
      size: '1.2 MB',
      date: 'Sep 01, 2026',
    },
  ];

  return (
    <HostLayout>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-semibold text-taupe block">
            Unified Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-1 tracking-tight">
            Documents & Contracts
          </h1>
        </div>

        <div className="space-y-4">
          {docs.map((doc, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200/90 rounded-2xl p-5 flex items-center justify-between shadow-soft-sm hover:border-taupe/40 hover:shadow-soft-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-charcoal">
                    {doc.name}
                  </h4>
                  <span className="text-xs text-charcoal/60 font-sans block mt-0.5">
                    {doc.type} • {doc.size} • Uploaded {doc.date}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-secondary px-4 py-2 text-xs flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </HostLayout>
  );
}
