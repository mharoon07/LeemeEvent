'use client';

import React, { useState, useEffect, useRef } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import { messagesApi } from '@/lib/services/consumerApi';
import {
  Send,
  MessageSquare,
  Search,
  CheckCheck,
  User,
  Mail,
  RefreshCw,
  Loader2,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Tag
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

const QUICK_REPLIES = [
  'Hello! Thank you for your inquiry. We are available on your date and thrilled to work with you.',
  'We have reviewed your requirements and our bespoke team is preparing a customized package proposal.',
  'Could you share more details regarding guest count, schedule, and preferred style?'
];

export default function SupplierMessagesPage() {
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

  // URL Query Param Support for direct navigation: ?hostId=...&hostEmail=...&hostName=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hostId = params.get('hostId');
      const hostEmail = params.get('hostEmail');
      const hostName = params.get('hostName');

      if (hostId || hostEmail) {
        const directThread: ConversationThread = {
          partner_id: hostId || hostEmail || '',
          partner_email: hostEmail || '',
          partner_name: hostName || hostEmail?.split('@')[0] || 'Valued Host',
          partner_role: 'consumer',
          last_message: 'Direct host inquiry consultation',
          last_message_time: new Date().toISOString(),
          last_sender_role: 'supplier',
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

  // 1. Load All Consumer Inquiries / Conversations
  const loadConversations = async (autoSelectFirst = false) => {
    if (authLoading || !user?.email) return;
    try {
      const list = await messagesApi.getConversations();
      
      setThreads((prev) => {
        const currentList = list || [];
        if (activePartner && !currentList.some((t: ConversationThread) =>
          (t.partner_id && t.partner_id === activePartner.partner_id) ||
          (t.partner_email && activePartner.partner_email && t.partner_email.toLowerCase() === activePartner.partner_email.toLowerCase())
        )) {
          return [activePartner, ...currentList];
        }
        return currentList;
      });

      if (list && list.length > 0 && autoSelectFirst && !activePartner) {
        setActivePartner(list[0]);
      } else if ((!list || list.length === 0) && !activePartner) {
        setActivePartner(null);
      }
    } catch (err) {
      console.error('Error loading supplier conversations:', err);
    } finally {
      setLoadingThreads(false);
    }
  };

  // 2. Load Messages for Active Thread
  const loadThreadMessages = async (partner: ConversationThread, forceScroll = false) => {
    if (!partner || (!partner.partner_id && !partner.partner_email)) return;
    try {
      const msgs = await messagesApi.getThread(partner.partner_id, partner.partner_email);
      setMessages(msgs || []);
      if (forceScroll || !isUserScrolledUpRef.current) {
        setTimeout(scrollToBottom, 30);
      }
    } catch (err) {
      console.error('Error loading thread messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // 3. Initial Load on Auth Change
  useEffect(() => {
    if (!authLoading && user?.email) {
      setLoadingThreads(true);
      loadConversations(true);
    }
  }, [user?.id, user?.email, authLoading]);

  // 4. Fetch Messages when Active Partner Changes
  useEffect(() => {
    if (activePartner && (activePartner.partner_id || activePartner.partner_email)) {
      setLoadingMessages(true);
      isUserScrolledUpRef.current = false;
      loadThreadMessages(activePartner, true);
    } else {
      setMessages([]);
    }
  }, [activePartner?.partner_id, activePartner?.partner_email]);

  // 5. Silent Background Polling (Every 4 seconds - NEVER jumps or scrolls window)
  useEffect(() => {
    if (!activePartner) return;
    const interval = setInterval(() => {
      loadThreadMessages(activePartner, false);
      loadConversations(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [activePartner?.partner_id, activePartner?.partner_email]);

  // 6. Send Message Handler
  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activePartner || sending) return;

    setInputText('');
    setSending(true);

    try {
      const newMsg = await messagesApi.sendMessage({
        recipient_id: activePartner.partner_id || activePartner.partner_email,
        recipient_email: activePartner.partner_email || '',
        recipient_name: activePartner.partner_name || 'Client Host',
        content: textToSend.trim(),
        booking_id: activePartner.booking_id,
        service_name: activePartner.service_name,
      });

      if (newMsg) {
        isUserScrolledUpRef.current = false;
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 30);
        await loadConversations(false);
      }
    } catch (err: any) {
      console.error('Failed to send supplier message:', err);
      alert(`Could not send message: ${err?.message || 'Please check backend connection.'}`);
      setInputText(textToSend);
    } finally {
      setSending(false);
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
    <SupplierLayout>
      <div className="space-y-5 max-w-7xl mx-auto pb-8">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-soft-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                Supplier Hub
              </span>
              <span className="text-xs text-stone-500 font-medium">Real-Time Client Inquiries</span>
            </div>
            <h1 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-charcoal mt-1">
              Host Messages & Consultation
            </h1>
            <p className="text-xs text-stone-500 max-w-xl mt-0.5">
              Reply to celebration hosts, discuss requirements, confirm booking dates, and provide direct concierge responses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadConversations(false);
                if (activePartner) loadThreadMessages(activePartner, false);
              }}
              className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors shadow-soft-sm"
              title="Refresh Messages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN CHAT INTERFACE: 2-COLUMN LUXURY STUDIO */}
        <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-soft-sm grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-220px)] min-h-[560px] max-h-[750px]">
          {/* LEFT COLUMN: ACTIVE CONSUMER INQUIRIES (4 COLS) */}
          <div className="lg:col-span-4 border-r border-stone-200/80 bg-stone-50/50 p-4 flex flex-col justify-between h-full overflow-hidden">
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              {/* Search Bar */}
              <div className="relative shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search host name or email..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-charcoal focus:outline-none focus:border-taupe"
                />
              </div>

              <div className="flex items-center justify-between px-1 pt-1 shrink-0">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Client Inquiries ({filteredThreads.length})
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
                    <p className="text-xs text-stone-400">Loading client messages...</p>
                  </div>
                ) : filteredThreads.length === 0 ? (
                  <div className="py-12 px-4 text-center space-y-3 bg-white border border-dashed border-stone-200 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-charcoal">No host messages yet</p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        When hosts inquire about your services, their conversations will appear here in real time.
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
                            ? 'bg-white border-taupe shadow-soft-sm text-charcoal ring-1 ring-taupe/30'
                            : 'bg-white/80 border-stone-200/70 hover:bg-white hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        {/* Host Avatar Icon */}
                        <div className="w-9 h-9 rounded-xl bg-sand-200 text-taupe flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                          <User className="w-4 h-4" />
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
                            {thread.partner_email || 'Event Host'}
                          </span>

                          <p className="text-xs text-stone-500 truncate mt-0.5">
                            {thread.last_message}
                          </p>

                          {thread.unread_count > 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white shadow-sm">
                              {thread.unread_count} new
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Current Supplier Identity Badge */}
            <div className="pt-3 border-t border-stone-200/80 flex items-center gap-2.5 shrink-0 mt-2">
              <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.businessName?.charAt(0) || user?.name?.charAt(0) || 'S'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-stone-400 font-bold uppercase block">Supplier Profile:</span>
                <span className="text-xs font-bold text-charcoal truncate block">{user?.businessName || user?.name || 'Verified Supplier'}</span>
                <span className="text-[10px] text-stone-500 truncate block">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIVE CONVERSATION CHAT WINDOW (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col justify-between p-4 sm:p-6 bg-white h-full overflow-hidden">
            {activePartner ? (
              <>
                {/* Chat Header */}
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-sand-200 text-taupe flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-charcoal tracking-tight flex items-center gap-2">
                        <span>{activePartner.partner_name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-sand-200 text-taupe">
                          Host
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span className="font-medium">{activePartner.partner_email || 'Direct Channel'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Host Channel</span>
                    </span>
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
                    <div className="py-12 text-center space-y-2 bg-stone-50/50 border border-stone-100 rounded-2xl p-6">
                      <Sparkles className="w-6 h-6 text-taupe mx-auto" />
                      <p className="text-xs font-bold text-charcoal">
                        Direct conversation with {activePartner.partner_name}
                      </p>
                      <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                        Reply directly to the client below to discuss setup options, date availability, and bespoke arrangements.
                      </p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender_role === 'supplier' || m.sender_email.toLowerCase() === (user?.email || '').toLowerCase();

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
                                {isMe ? `You (${user?.businessName || 'Supplier'})` : `${m.sender_name} (Host)`}
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

                {/* Quick Reply Presets */}
                <div className="pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto shrink-0">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                    Quick Templates:
                  </span>
                  {QUICK_REPLIES.map((rep, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(undefined, rep)}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-taupe hover:text-white text-[11px] text-stone-600 transition-colors whitespace-nowrap shrink-0 border border-stone-200/60"
                    >
                      {idx === 0 ? '✓ Confirm Availability' : idx === 1 ? '📋 Proposal Ready' : '❓ Request Details'}
                    </button>
                  ))}
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSend} className="pt-2 border-t border-stone-100 flex items-center gap-3 shrink-0">
                  <input
                    type="text"
                    required
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Reply to ${activePartner.partner_name}...`}
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
                        <span>Reply</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8">
                <div className="w-16 h-16 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center shadow-soft-sm">
                  <MessageSquare className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-charcoal">Select an Inquiry to Respond</h3>
                  <p className="text-xs text-stone-500 max-w-sm">
                    Select any client consultation thread from the list on the left, or click &quot;Chat with Host&quot; from incoming booking requests.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
