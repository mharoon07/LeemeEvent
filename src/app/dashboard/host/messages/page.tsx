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
          <span className="text-xs font-semibold text-taupe block">
            Communication Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mt-1 tracking-tight">
            Supplier Messages
          </h1>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-soft-sm grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          
          {/* Thread List Column */}
          <div className="lg:col-span-4 border-r border-stone-200/80 bg-[#FAF8F5] p-4 space-y-3">
            <span className="text-xs font-semibold text-taupe uppercase tracking-wider block px-2">
              Active Conversations
            </span>

            {threads.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setActiveChat(chat.id)}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                  activeChat === chat.id
                    ? 'bg-white text-charcoal shadow-soft-sm border border-stone-200/90 font-semibold'
                    : 'hover:bg-white/60 text-stone-700'
                }`}
              >
                <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0 shadow-sm">
                  <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-charcoal truncate">
                      {chat.name}
                    </h4>
                    <span className="text-[10px] text-stone-400">{chat.time}</span>
                  </div>
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {chat.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat Window Column */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 bg-white">
            {/* Chat Header */}
            <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-charcoal tracking-tight">
                  Château de Bellevue Venue
                </h3>
                <span className="text-xs text-taupe font-medium">Assigned Account Representative</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
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
                    className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm space-y-1 ${
                      m.sender === 'host'
                        ? 'bg-charcoal text-white rounded-br-none shadow-soft-sm'
                        : 'bg-[#FAF8F5] border border-stone-200/80 text-charcoal rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span
                      className={`text-[10px] block text-right ${
                        m.sender === 'host' ? 'text-stone-300' : 'text-stone-400'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="pt-4 border-t border-stone-100 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message to Château de Bellevue..."
                className="flex-1 bg-[#FAF8F5] border border-stone-200/90 rounded-xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-taupe"
              />
              <button
                type="submit"
                className="btn-primary p-3 rounded-xl flex items-center justify-center shadow-soft-sm"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </HostLayout>
  );
}
