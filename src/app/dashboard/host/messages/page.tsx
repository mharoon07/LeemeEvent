'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HostLayout from '@/components/dashboard/HostLayout';
import { Send, Image as ImageIcon, Paperclip, CheckCheck } from 'lucide-react';

export default function HostMessagesPage() {
  const [activeChat, setActiveChat] = useState('chat_1');
  const [inputText, setInputText] = useState('');

  const threads = [
    {
      id: 'chat_1',
      name: 'Château de Bellevue Venue',
      role: 'Venue Partner',
      unread: 1,
      lastMessage: 'We have reserved the Courtyard for your evening reception!',
      time: '10:42 AM',
      avatar: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'chat_2',
      name: 'Lumière Wedding Photography',
      role: 'Lead Photographer',
      unread: 0,
      lastMessage: 'Looking forward to capturing your sunset portraits!',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=400&auto=format&fit=crop',
    },
  ];

  const messages = [
    { id: 'm1', sender: 'supplier', text: 'Hello Eleanor! We are excited to host your wedding at Château de Bellevue on Sept 18, 2026.', time: '10:30 AM' },
    { id: 'm2', sender: 'host', text: 'Hi! Could we arrange a tasting for 4 guests next month?', time: '10:35 AM' },
    { id: 'm3', sender: 'supplier', text: 'We have reserved the Courtyard for your evening reception!', time: '10:42 AM' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setInputText('');
  };

  return (
    <HostLayout>
      <div className="space-y-6">
        <div>
          <span className="text-xs font-classico tracking-[0.25em] uppercase text-taupe block font-semibold">
            Communication Hub
          </span>
          <h1 className="font-classico text-3xl font-normal uppercase tracking-wide text-charcoal mt-1">
            Supplier Messages
          </h1>
        </div>

        <div className="bg-sand-50 border border-taupe/20 rounded-3xl overflow-hidden shadow-soft-sm grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          
          {/* Thread List Column */}
          <div className="lg:col-span-4 border-r border-taupe/15 bg-sand-100/50 p-4 space-y-3">
            <span className="text-xs font-classico tracking-wider uppercase text-taupe font-semibold block px-2">
              Active Conversations
            </span>

            {threads.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setActiveChat(chat.id)}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                  activeChat === chat.id
                    ? 'bg-sand text-charcoal shadow-soft-sm border border-taupe/30'
                    : 'hover:bg-taupe/10 text-charcoal/80'
                }`}
              >
                <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0">
                  <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-classico text-sm uppercase font-semibold text-charcoal truncate">
                      {chat.name}
                    </h4>
                    <span className="text-[10px] text-charcoal/50">{chat.time}</span>
                  </div>
                  <p className="text-xs text-charcoal/70 truncate mt-0.5 font-sans">
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat Window Column */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 bg-sand-50">
            {/* Chat Header */}
            <div className="pb-4 border-b border-taupe/15 flex items-center justify-between">
              <div>
                <h3 className="font-classico text-lg uppercase font-semibold text-charcoal">
                  Château de Bellevue Venue
                </h3>
                <span className="text-xs text-taupe font-semibold">Assigned Account Representative</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 font-bold">
                Online
              </span>
            </div>

            {/* Message History */}
            <div className="py-6 space-y-4 flex-1 overflow-y-auto max-h-[360px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'host' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm font-sans space-y-1 ${
                      m.sender === 'host'
                        ? 'bg-taupe text-sand rounded-br-none'
                        : 'bg-sand border border-taupe/20 text-charcoal rounded-bl-none shadow-soft-sm'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span
                      className={`text-[10px] block text-right ${
                        m.sender === 'host' ? 'text-sand/70' : 'text-charcoal/50'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="pt-4 border-t border-taupe/15 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message to vendor..."
                className="flex-1 bg-sand border border-taupe/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
              <button type="submit" className="btn-primary p-3 rounded-2xl shrink-0">
                <Send className="w-4 h-4 text-sand" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </HostLayout>
  );
}
