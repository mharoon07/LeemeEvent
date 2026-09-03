'use client';

import React, { useState } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { Send } from 'lucide-react';

export default function SupplierMessagesPage() {
  const [inputText, setInputText] = useState('');

  const messages = [
    { id: 'm1', sender: 'host', text: 'Hi Aura Floral! We would love to discuss ceremony arch floral options for Sept 18th.', time: '09:15 AM' },
    { id: 'm2', sender: 'supplier', text: 'Hello Eleanor! We would be delighted. We have reserved custom garden roses and stone urn styling for your date.', time: '09:30 AM' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setInputText('');
  };

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Messages & Inquiries
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Host Communication Threads
          </h1>
        </div>

        <div className="bg-sand-50 border border-taupe/20 rounded-3xl p-6 shadow-soft-sm space-y-6 min-h-[480px] flex flex-col justify-between">
          <div className="pb-4 border-b border-taupe/15 flex items-center justify-between">
            <div>
              <h3 className="font-classico text-lg uppercase font-semibold text-charcoal">Eleanor & Liam (Wedding)</h3>
              <span className="text-xs text-taupe font-semibold">Sept 18, 2026 • Cotswolds, UK</span>
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'supplier' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm ${m.sender === 'supplier' ? 'bg-charcoal text-sand' : 'bg-sand border border-taupe/20 text-charcoal'}`}>
                  <p>{m.text}</p>
                  <span className={`text-[10px] block text-right mt-1 ${m.sender === 'supplier' ? 'text-sand/70' : 'text-charcoal/50'}`}>{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="pt-4 border-t border-taupe/15 flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Write a message to host..."
              className="flex-1 bg-sand border border-taupe/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
            />
            <button type="submit" className="btn-primary p-3 rounded-2xl">
              <Send className="w-4 h-4 text-sand" />
            </button>
          </form>
        </div>
      </div>
    </SupplierLayout>
  );
}
