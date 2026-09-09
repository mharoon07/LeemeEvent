'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import HostLayout from '@/components/dashboard/HostLayout';
import { useAuth } from '@/context/AuthContext';
import { messagesApi, bookingsApi } from '@/lib/services/consumerApi';
import {
  Send,
  Sparkles,
  MessageSquare,
  Search,
  CheckCheck,
  Building2,
  Mail,
  User,
  RefreshCw,
  Loader2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  SearchCheck,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';

interface ConversationThread {
  partner_id: string;
  partner_email: string;
  partner_name: string;
  partner_role: 'supplier' | 'consumer';
  last_message: string;
  last_message_time: string;
  last_sender_role: string;
  booking_id?: string;
  service_name?: string;
  unread_count: number;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  sender_role: 'consumer' | 'supplier' | 'admin';
  recipient_id: string;
  recipient_name: string;
  recipient_email: string;
  recipient_role: 'consumer' | 'supplier' | 'admin';
  content: string;
  booking_id?: string;
  service_name?: string;
  is_read: boolean;
  created_at: string;
}

export default function HostMessagesPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [threads, setThreads] = useState<ConversationThread[]>([]);
  const [activePartner, setActivePartner] = useState<ConversationThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUpRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleContainerScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      isUserScrolledUpRef.current = scrollHeight - scrollTop - clientHeight > 80;
    }
  };

  // 1. URL Query Param Support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const supplierId = params.get('supplierId');
      const supplierEmail = params.get('supplierEmail');
      const supplierName = params.get('supplierName');
      const bookingId = params.get('bookingId');

      if (supplierId || supplierEmail) {
        const directThread: ConversationThread = {
          partner_id: supplierId || supplierEmail || '',
          partner_email: supplierEmail || '',
          partner_name: supplierName || supplierEmail?.split('@')[0] || 'Specialist Partner',
          partner_role: 'supplier',
          last_message: 'Booking consultation inquiry',
          last_message_time: new Date().toISOString(),
          last_sender_role: 'consumer',
          booking_id: bookingId || undefined,
          unread_count: 0,
        };
        setActivePartner(directThread);
        setThreads((prev) => {
          const exists = prev.some(
            (t) =>
              (t.partner_id && t.partner_id === directThread.partner_id) ||
              (t.partner_email && directThread.partner_email && t.partner_email.toLowerCase() === directThread.partner_email.toLowerCase())
          );
          return exists ? prev : [directThread, ...prev];
        });
      }
    }
  }, []);

  // 2. Load Real Conversations & Synthesize Booking Threads
  const loadConversations = async (autoSelectFirst = false) => {
    if (authLoading || !user?.email) return;
    try {
      const [serverConversations, bookingsData] = await Promise.all([
        messagesApi.getConversations().catch(() => []),
        bookingsApi.getMyBookings().catch(() => []),
      ]);

      const bookingThreads: ConversationThread[] = (bookingsData || []).map((b: any) => {
        const supplier = b.supplier || b.service?.supplier;
        const suppId = supplier?.id || b.supplier_id || `supp_${b.id}`;
        const suppEmail = supplier?.email || supplier?.profile?.email || b.supplier_email || 'specialist@leemevents.com';
        const suppName = supplier?.business_name || supplier?.name || b.service?.name || 'Verified Specialist';
        return {
          partner_id: suppId,
          partner_email: suppEmail,
          partner_name: suppName,
          partner_role: 'supplier',
          last_message: b.supplier_response_notes || `Booking consultation for ${b.service?.name || 'Event Service'}`,
          last_message_time: b.created_at || new Date().toISOString(),
          last_sender_role: 'supplier',
          booking_id: b.id,
          service_name: b.service?.name,
          unread_count: 0,
        };
      });

      const combined: ConversationThread[] = [...(serverConversations || [])];

      for (const bt of bookingThreads) {
        if (!combined.some((c) =>
          (c.partner_id && c.partner_id === bt.partner_id) ||
          (c.partner_email && bt.partner_email && c.partner_email.toLowerCase() === bt.partner_email.toLowerCase())
        )) {
          combined.push(bt);
        }
      }

      if (activePartner && !combined.some((t) =>
        (t.partner_id && t.partner_id === activePartner.partner_id) ||
        (t.partner_email && activePartner.partner_email && t.partner_email.toLowerCase() === activePartner.partner_email.toLowerCase())
      )) {
        combined.unshift(activePartner);
      }

      setThreads((prev) => {
        const prevKey = prev.map((t) => `${t.partner_id}_${t.partner_email}_${t.last_message}`).join('|');
        const newKey = combined.map((t) => `${t.partner_id}_${t.partner_email}_${t.last_message}`).join('|');
        return prevKey === newKey ? prev : combined;
      });

      setActivePartner((currentActive) => {
        if (!currentActive && combined.length > 0) {
          return combined[0];
        }
        return currentActive;
      });
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoadingThreads(false);
    }
  };

  // 3. Load Thread Messages (Silent with instant cache fallback)
  const loadThreadMessages = async (partner: ConversationThread, isInitial = false) => {
    if (!partner || (!partner.partner_id && !partner.partner_email)) return;
    try {
      if (isInitial) {
        const myId = user?.id || '';
        const myEmail = user?.email || '';
        const storageKey = `LEEMEVENTS_CHAT_THREAD_${[(myEmail || myId).toLowerCase(), (partner.partner_email || partner.partner_id).toLowerCase()].sort().join('__')}`;
        if (typeof window !== 'undefined') {
          try {
            const cached = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (Array.isArray(cached) && cached.length > 0) {
              setMessages(cached);
              setLoadingMessages(false);
              setTimeout(scrollToBottom, 20);
            } else {
              setLoadingMessages(true);
            }
          } catch {
            setLoadingMessages(true);
          }
        }
      }

      const msgs = await messagesApi.getThread(partner.partner_id, partner.partner_email);
      setMessages((prev) => {
        const isSame = prev.length === msgs.length && prev.every((m, i) => m.id === msgs[i]?.id && m.content === msgs[i]?.content);
        if (isSame) return prev;
        if (!isUserScrolledUpRef.current) {
          setTimeout(scrollToBottom, 20);
        }
        return msgs || [];
      });
    } catch (err) {
      console.error('Error loading thread messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // 4. Initial Load
  useEffect(() => {
    if (!authLoading && user?.email) {
      loadConversations(true);
    }
  }, [user?.id, user?.email, authLoading]);

  // 5. Active Partner Changed
  useEffect(() => {
    if (activePartner && (activePartner.partner_id || activePartner.partner_email)) {
      isUserScrolledUpRef.current = false;
      loadThreadMessages(activePartner, true);
    } else {
      setMessages([]);
      setLoadingMessages(false);
    }
  }, [activePartner?.partner_id, activePartner?.partner_email]);

  // 6. Silent Background Polling
  useEffect(() => {
    if (!activePartner) return;
    const interval = setInterval(() => {
      loadThreadMessages(activePartner, false);
      loadConversations(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [activePartner?.partner_id, activePartner?.partner_email]);

  // 7. INSTANT 0ms Optimistic Send Message
  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activePartner) return;

    setInputText('');

    const myId = user?.id || 'host_user';
    const myEmail = user?.email || 'host@leemevents.com';
    const myName = user?.name || 'Valued Host';

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      sender_id: myId,
      sender_name: myName,
      sender_email: myEmail,
      sender_role: 'consumer',
      recipient_id: activePartner.partner_id || activePartner.partner_email,
      recipient_name: activePartner.partner_name || 'Specialist Partner',
      recipient_email: activePartner.partner_email || '',
      recipient_role: 'supplier',
      content: textToSend.trim(),
      booking_id: activePartner.booking_id,
      service_name: activePartner.service_name,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // INSTANT UI UPDATE (0ms)
    isUserScrolledUpRef.current = false;
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 10);

    // Background Async Delivery
    try {
      const serverMsg = await messagesApi.sendMessage({
        recipient_id: activePartner.partner_id || activePartner.partner_email,
        recipient_email: activePartner.partner_email || '',
        recipient_name: activePartner.partner_name || 'Specialist Partner',
        content: textToSend.trim(),
        booking_id: activePartner.booking_id,
        service_name: activePartner.service_name,
      });

      if (serverMsg && serverMsg.id) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...serverMsg, is_read: false } : m))
        );
      }
    } catch (err: any) {
      console.warn('Backend message sync fallback:', err);
    }
  };

  const filteredThreads = threads.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.partner_name.toLowerCase().includes(q) ||
      t.partner_email.toLowerCase().includes(q) ||
      t.last_message.toLowerCase().includes(q)
    );
  });

  const formatMessageTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <HostLayout>
      <div className="space-y-5 max-w-7xl mx-auto pb-8">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-soft-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                Host Communications
              </span>
              <span className="text-xs text-stone-500 font-medium">Verified Specialist Concierge</span>
            </div>
            <h1 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-charcoal mt-1">
              Direct Messages & Inquiries
            </h1>
            <p className="text-xs text-stone-500 max-w-xl mt-0.5">
              Communicate in real-time with your booked event artisans, caterers, venues, and floral specialists.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadConversations(false);
                if (activePartner) loadThreadMessages(activePartner, false);
              }}
              className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors shadow-soft-sm flex items-center gap-1.5 text-xs font-semibold"
              title="Refresh Messages"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* MAIN CHAT INTERFACE: 2-COLUMN LUXURY STUDIO */}
        <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-soft-sm grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-220px)] min-h-[580px] max-h-[780px]">
          {/* LEFT COLUMN: ACTIVE THREADS (4 COLS) */}
          <div className="lg:col-span-4 border-r border-stone-200/80 bg-stone-50/50 p-4 flex flex-col justify-between h-full overflow-hidden">
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              {/* Search Bar */}
              <div className="relative shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search specialists or brands..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-charcoal focus:outline-none focus:border-taupe"
                />
              </div>

              <div className="flex items-center justify-between px-1 pt-1 shrink-0">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Partner Chats ({filteredThreads.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Thread Cards List */}
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {loadingThreads ? (
                  <div className="py-12 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-taupe mx-auto" />
                    <p className="text-xs text-stone-400">Loading specialist channels...</p>
                  </div>
                ) : filteredThreads.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3 bg-white border border-dashed border-stone-200 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-charcoal">No messages yet</p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        When you book specialists or send inquiries, your conversations will appear here automatically.
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredThreads.map((thread) => {
                    const isSelected =
                      activePartner?.partner_id === thread.partner_id ||
                      (activePartner?.partner_email &&
                        activePartner.partner_email.toLowerCase() === thread.partner_email.toLowerCase());

                    return (
                      <button
                        key={thread.partner_id || thread.partner_email}
                        type="button"
                        onClick={() => {
                          isUserScrolledUpRef.current = false;
                          setActivePartner(thread);
                        }}
                        className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 border ${
                          isSelected
                            ? 'bg-white border-taupe shadow-soft-sm text-charcoal ring-2 ring-taupe/30'
                            : 'bg-white/80 border-stone-200/70 hover:bg-white hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-xl bg-sand-200 text-taupe flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                          <Building2 className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-charcoal truncate">
                              {thread.partner_name}
                            </h4>
                            <span className="text-[10px] text-stone-400">
                              {formatMessageTime(thread.last_message_time)}
                            </span>
                          </div>

                          <span className="text-[10px] text-taupe font-semibold block truncate">
                            {thread.partner_email || 'Specialist Partner'}
                          </span>

                          <p className="text-xs text-stone-500 truncate mt-0.5">
                            {thread.last_message}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Current Host Identity Badge */}
            <div className="pt-3 border-t border-stone-200/80 flex items-center gap-2.5 shrink-0 mt-2">
              <div className="w-8 h-8 rounded-full bg-taupe text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.charAt(0) || 'H'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Event Host:</span>
                <span className="text-xs font-bold text-charcoal truncate block">{user?.name || 'Valued Host'}</span>
                <span className="text-[10px] text-stone-500 truncate block">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIVE CONVERSATION CHAT WINDOW (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col justify-between p-4 sm:p-5 bg-white h-full overflow-hidden">
            {activePartner ? (
              <>
                {/* Chat Header */}
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between shrink-0 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-sand-200 text-taupe flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-charcoal tracking-tight flex items-center gap-2 truncate">
                        <span className="truncate">{activePartner.partner_name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 shrink-0">
                          Specialist
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 truncate">
                        <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="font-medium truncate">{activePartner.partner_email || 'Verified Partner'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/dashboard/host/requests"
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-taupe" />
                      <span className="hidden sm:inline">My Bookings</span>
                    </Link>
                  </div>
                </div>

                {/* Message Stream */}
                <div
                  ref={chatContainerRef}
                  onScroll={handleContainerScroll}
                  className="py-4 space-y-3 flex-1 overflow-y-auto px-2 min-h-0"
                >
                  {loadingMessages ? (
                    <div className="py-16 text-center space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-taupe mx-auto" />
                      <p className="text-xs text-stone-400">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-10 text-center space-y-3 bg-stone-50/70 border border-stone-200/80 rounded-2xl p-6">
                      <Sparkles className="w-8 h-8 text-taupe mx-auto" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-charcoal">
                          Direct Consultation with {activePartner.partner_name}
                        </h4>
                        <p className="text-xs text-stone-500 max-w-md mx-auto">
                          Send a message to discuss your event dates, guest count, and customized service details.
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleSend(undefined, `Hi ${activePartner.partner_name}, I would like to inquire about your availability and package pricing for our upcoming celebration.`)}
                          className="text-left px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-taupe hover:bg-stone-50 text-xs text-stone-700 transition-all shadow-xs"
                        >
                          👋 Inquire about availability & package options
                        </button>
                      </div>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_role === 'consumer' || m.sender_email.toLowerCase() === (user?.email || '').toLowerCase();

                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm space-y-1 shadow-soft-sm ${
                              isMe
                                ? 'bg-charcoal text-white rounded-br-none'
                                : 'bg-stone-50 border border-stone-200 text-charcoal rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 pb-1 border-b border-white/10 text-[10px]">
                              <span className={`font-bold ${isMe ? 'text-amber-200' : 'text-taupe'}`}>
                                {isMe ? `You (${user?.name || 'Host'})` : `${m.sender_name} (Specialist)`}
                              </span>
                              <span className={isMe ? 'text-stone-300' : 'text-stone-400'}>
                                {m.sender_email}
                              </span>
                            </div>

                            <p className="leading-relaxed whitespace-pre-wrap pt-0.5">{m.content}</p>

                            <div className="flex items-center justify-between text-[10px] pt-1">
                              <span className={isMe ? 'text-stone-300' : 'text-stone-400'}>
                                {formatMessageTime(m.created_at)}
                              </span>
                              {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSend} className="pt-2 border-t border-stone-100 flex items-center gap-3 shrink-0">
                  <input
                    type="text"
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activePartner.partner_name}...`}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-taupe shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-charcoal text-white text-xs sm:text-sm font-bold hover:bg-taupe transition-all shadow-soft-sm flex items-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin text-sand" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 p-8">
                <div className="w-16 h-16 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center shadow-soft-sm">
                  <MessageSquare className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h3 className="text-lg font-bold text-charcoal">Select a Specialist Consultation</h3>
                  <p className="text-xs text-stone-500">
                    Select a specialist conversation from the left or choose one of your active bookings below:
                  </p>
                </div>

                {threads.length > 0 && (
                  <div className="w-full max-w-sm space-y-2 pt-2">
                    {threads.slice(0, 3).map((t) => (
                      <button
                        key={t.partner_id || t.partner_email}
                        type="button"
                        onClick={() => setActivePartner(t)}
                        className="w-full p-3 rounded-2xl bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-left flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-taupe" />
                          <span className="text-xs font-bold text-charcoal">{t.partner_name}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </HostLayout>
  );
}
