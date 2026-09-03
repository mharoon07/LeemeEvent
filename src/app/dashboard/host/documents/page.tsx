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
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Unified Vault
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Documents & Contracts
          </h1>
        </div>

        <div className="space-y-4">
          {docs.map((doc, i) => (
            <div
              key={i}
              className="bg-sand-50 border border-taupe/20 rounded-2xl p-5 flex items-center justify-between shadow-soft-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-taupe/10 text-taupe flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-classico text-sm uppercase font-semibold text-charcoal">
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
