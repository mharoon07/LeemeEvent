'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import { messagesApi, supplierBookingsApi } from '@/lib/services/consumerApi';
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
  Tag,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  AlertCircle,
  Check,
  Smile,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Real Supplier Requests list for linking booking actions inside chat
  const [supplierRequests, setSupplierRequests] = useState<any[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

  // Cross-tab / Cross-window instant sync
  useEffect(() => {
    const handleStorageOrCustom = () => {
      if (activePartner) {
        loadThreadMessages(activePartner, false);
      }
      loadConversations(false);
    };

    window.addEventListener('storage', handleStorageOrCustom);
    window.addEventListener('leemevents:message_sent', handleStorageOrCustom);
    return () => {
      window.removeEventListener('storage', handleStorageOrCustom);
      window.removeEventListener('leemevents:message_sent', handleStorageOrCustom);
    };
  }, [activePartner]);

  // URL Query Param Support for direct navigation: ?hostId=...&hostEmail=...&hostName=...&bookingId=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hostId = params.get('hostId') || params.get('recipient_id') || params.get('id');
      const hostEmail = params.get('hostEmail') || params.get('recipient_email') || params.get('email');
      const hostName = params.get('hostName') || params.get('recipient_name') || params.get('name');
      const bookingId = params.get('bookingId');
      const serviceName = params.get('service_name') || params.get('serviceName');

      if (hostId || hostEmail) {
        const directThread: ConversationThread = {
          partner_id: hostId || hostEmail || '',
          partner_email: hostEmail || '',
          partner_name: hostName || hostEmail?.split('@')[0] || 'Valued Host',
          partner_role: 'consumer',
          last_message: serviceName ? `Consultation for ${serviceName}` : 'Direct host inquiry consultation',
          last_message_time: new Date().toISOString(),
          last_sender_role: 'supplier',
          booking_id: bookingId || undefined,
          service_name: serviceName || undefined,
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

  // 1. Load All Consumer Inquiries & Synthesize Booking Threads
  const loadConversations = async (autoSelectFirst = false) => {
    if (authLoading || !user?.email) return;
    try {
      const [serverConversations, requestsData] = await Promise.all([
        messagesApi.getConversations().catch(() => []),
        supplierBookingsApi.getMyRequests().catch(() => []),
      ]);

      setSupplierRequests(requestsData || []);

      // Synthesize rich conversation threads for every booking inquiry
      const bookingThreads: ConversationThread[] = (requestsData || []).map((req: any) => {
        const creator = req.event?.creator;
        const hostEmail =
          req.consumer_email ||
          req.consumer?.email ||
          creator?.email ||
          req.event?.user?.email ||
          req.user?.email ||
          '';
        const hostId =
          req.consumer_id ||
          req.consumer?.id ||
          creator?.id ||
          creator?.auth_user_id ||
          req.event?.user_id ||
          req.user?.id ||
          (hostEmail ? hostEmail : `host_${req.id}`);
        const hostName =
          req.consumer_name ||
          req.consumer?.full_name ||
          req.consumer?.name ||
          creator?.full_name ||
          creator?.name ||
          req.event?.title ||
          (hostEmail ? hostEmail.split('@')[0] : 'Event Host');

        return {
          partner_id: hostId,
          partner_email: hostEmail,
          partner_name: hostName,
          partner_role: 'consumer',
          last_message: req.requirements || `Inquiry for ${req.service?.name || 'Celebration Service'}`,
          last_message_time: req.created_at || new Date().toISOString(),
          last_sender_role: 'consumer',
          booking_id: req.id,
          service_name: req.service?.name,
          unread_count: 0,
        };
      });

      // Merge server conversations with booking threads
      const combined: ConversationThread[] = [...(serverConversations || [])];

      for (const bt of bookingThreads) {
        if (!combined.some((c) =>
          (c.partner_id && c.partner_id === bt.partner_id) ||
          (c.partner_email && bt.partner_email && c.partner_email.toLowerCase() === bt.partner_email.toLowerCase())
        )) {
          combined.push(bt);
        }
      }

      // Preserve activePartner if defined in URL or state
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

      // Auto-select first thread if nothing active is chosen
      setActivePartner((currentActive) => {
        if (!currentActive && combined.length > 0) {
          return combined[0];
        }
        return currentActive;
      });
    } catch (err) {
      console.error('Error loading supplier conversations:', err);
    } finally {
      setLoadingThreads(false);
    }
  };

  // Manual Refresh Handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        loadConversations(false),
        activePartner ? loadThreadMessages(activePartner, false) : Promise.resolve(),
      ]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // 2. Load Messages for Active Thread (Silent without screen reset)
  const loadThreadMessages = async (partner: ConversationThread, isInitial = false) => {
    if (!partner || (!partner.partner_id && !partner.partner_email)) return;
    try {
      if (isInitial) {
        // Fast local cache check to prevent loader flash
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

  // 3. Initial Load on Auth Change
  useEffect(() => {
    if (!authLoading && user?.email) {
      loadConversations(true);
    }
  }, [user?.id, user?.email, authLoading]);

  // 4. Fetch Messages when Active Partner Changes
  useEffect(() => {
    if (activePartner && (activePartner.partner_id || activePartner.partner_email)) {
      isUserScrolledUpRef.current = false;
      loadThreadMessages(activePartner, true);
    } else {
      setMessages([]);
      setLoadingMessages(false);
    }
  }, [activePartner?.partner_id, activePartner?.partner_email]);

  // 5. Silent Background Polling without page/component flickering
  useEffect(() => {
    if (!activePartner) return;
    const interval = setInterval(() => {
      loadThreadMessages(activePartner, false);
      loadConversations(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [activePartner?.partner_id, activePartner?.partner_email]);

  // Find linked booking request for the active host conversation
  const getActiveBooking = () => {
    if (!activePartner) return null;
    return supplierRequests.find((r) => {
      if (activePartner.booking_id && r.id === activePartner.booking_id) return true;
      const creatorId = r.event?.creator?.id || r.event?.creator?.auth_user_id || r.consumer_id;
      const creatorEmail = r.event?.creator?.email || r.consumer_email;
      return (
        (creatorId && creatorId === activePartner.partner_id) ||
        (creatorEmail && activePartner.partner_email && creatorEmail.toLowerCase() === activePartner.partner_email.toLowerCase())
      );
    });
  };

  const getNormalizedStatus = (st?: string) => {
    const s = (st || 'pending').toLowerCase();
    if (s === 'completed' || s === 'done') return 'completed';
    if (s === 'availability_confirmed' || s === 'accepted' || s === 'deposit_paid' || s === 'confirmed' || s === 'contract_sent' || s === 'active') return 'accepted';
    if (s === 'declined' || s === 'rejected' || s === 'cancelled') return 'rejected';
    return 'pending';
  };

  // Actions from inside chat
  const handleAcceptInquiryFromChat = async (bookingId: string) => {
    try {
      setActionLoadingId(bookingId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${bookingId}`, 'accepted');
      }
      await supplierBookingsApi.updateBookingStatus(
        bookingId,
        'accepted',
        'Booking confirmed by supplier via consultation chat.'
      );
      // Auto post confirmation message in chat
      await handleSend(undefined, '✓ Thank you! We have accepted your booking request and confirmed our availability for your celebration date.');
      await loadConversations(false);
    } catch (err: any) {
      alert(`Failed to accept request: ${err?.message || 'Server error'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkDoneFromChat = async (bookingId: string) => {
    try {
      setActionLoadingId(bookingId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${bookingId}`, 'completed');
      }
      await supplierBookingsApi.updateBookingStatus(
        bookingId,
        'completed',
        'Event services successfully delivered and completed with luxury standards.'
      );
      // Auto post event completion notice in chat
      await handleSend(undefined, '✨ Celebration services have been delivered & marked as Completed! Thank you for collaborating with us. You can now leave a verified review & rating.');
      await loadConversations(false);
    } catch (err: any) {
      alert(`Failed to mark event as done: ${err?.message || 'Server error'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeclineInquiryFromChat = async (bookingId: string) => {
    try {
      setActionLoadingId(bookingId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`LEEMEVENTS_BOOKING_STATUS_${bookingId}`, 'rejected');
      }
      await supplierBookingsApi.updateBookingStatus(
        bookingId,
        'rejected',
        'Declined due to scheduling constraints.'
      );
      await handleSend(undefined, 'Thank you for reaching out. Unfortunately, we are unable to accept this request due to scheduling constraints.');
      await loadConversations(false);
    } catch (err: any) {
      alert(`Failed to decline request: ${err?.message || 'Server error'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 6. INSTANT 0ms Optimistic Send Handler (No blocking, no lag)
  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activePartner) return;

    // Instant clear input and scroll
    setInputText('');

    const activeBooking = getActiveBooking();
    const myId = user?.id || 'supplier_user';
    const myEmail = user?.email || 'supplier@leemevents.com';
    const myName = user?.businessName || user?.name || 'Verified Supplier';

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      sender_id: myId,
      sender_name: myName,
      sender_email: myEmail,
      sender_role: 'supplier',
      recipient_id: activePartner.partner_id || activePartner.partner_email,
      recipient_name: activePartner.partner_name || 'Client Host',
      recipient_email: activePartner.partner_email || '',
      recipient_role: 'consumer',
      content: textToSend.trim(),
      booking_id: activePartner.booking_id || activeBooking?.id,
      service_name: activePartner.service_name || activeBooking?.service?.name,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // INSTANT UI UPDATE (0ms)
    isUserScrolledUpRef.current = false;
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 10);

    // Background Async Backend Delivery
    try {
      const serverMsg = await messagesApi.sendMessage({
        recipient_id: activePartner.partner_id || activePartner.partner_email,
        recipient_email: activePartner.partner_email || '',
        recipient_name: activePartner.partner_name || 'Client Host',
        content: textToSend.trim(),
        booking_id: activePartner.booking_id || activeBooking?.id,
        service_name: activePartner.service_name || activeBooking?.service?.name,
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

  const activeBooking = getActiveBooking();
  const normBookingStatus = activeBooking ? getNormalizedStatus(activeBooking.status) : null;

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
              Reply directly to celebration hosts, discuss arrangements, confirm availability, and mark completed events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors shadow-soft-sm flex items-center gap-1.5 text-xs font-semibold disabled:opacity-60 cursor-pointer"
              title="Refresh Messages"
            >
              <RefreshCw className={`w-4 h-4 transition-transform ${isRefreshing ? 'animate-spin text-taupe' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* MAIN CHAT INTERFACE: 2-COLUMN LUXURY STUDIO */}
        <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-soft-sm grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-220px)] min-h-[580px] max-h-[780px]">
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
                        When hosts inquire about your services, their conversations will appear here automatically.
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
          <div className="lg:col-span-8 flex flex-col justify-between p-4 sm:p-5 bg-white h-full overflow-hidden">
            {activePartner ? (
              <>
                {/* Chat Header */}
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between shrink-0 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-sand-200 text-taupe flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-charcoal tracking-tight flex items-center gap-2 truncate">
                        <span className="truncate">{activePartner.partner_name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-sand-200 text-taupe shrink-0">
                          Host
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5 truncate">
                        <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="font-medium truncate">{activePartner.partner_email || 'Direct Channel'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/dashboard/supplier/requests"
                      className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5 text-taupe" />
                      <span className="hidden sm:inline">All Requests</span>
                    </Link>
                  </div>
                </div>

                {/* ACTIVE INQUIRY / BOOKING CONTROL STRIP */}
                {activeBooking && (
                  <div className="mt-2.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 shadow-soft-sm animate-in fade-in duration-200">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-charcoal truncate">
                          {activeBooking.event?.title || activeBooking.event?.name || 'Celebration Event'}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {activeBooking.service?.name || 'Custom Package'}
                        </span>
                        {normBookingStatus === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {normBookingStatus === 'accepted' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Accepted & Confirmed</span>
                          </span>
                        )}
                        {normBookingStatus === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-600" />
                            <span>Event Completed ✓</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-taupe" />
                          {activeBooking.requested_date || activeBooking.event?.event_date || 'Date TBD'}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-charcoal font-mono">
                          €{Number(activeBooking.quote_amount || activeBooking.service?.base_price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actionable buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {normBookingStatus === 'pending' && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoadingId === activeBooking.id}
                            onClick={() => handleDeclineInquiryFromChat(activeBooking.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId === activeBooking.id}
                            onClick={() => handleAcceptInquiryFromChat(activeBooking.id)}
                            className="px-4 py-1.5 rounded-xl bg-charcoal hover:bg-taupe text-white text-xs font-bold transition-all shadow-soft-sm flex items-center gap-1.5"
                          >
                            {actionLoadingId === activeBooking.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            <span>Accept Request</span>
                          </button>
                        </>
                      )}

                      {normBookingStatus === 'accepted' && (
                        <button
                          type="button"
                          disabled={actionLoadingId === activeBooking.id}
                          onClick={() => handleMarkDoneFromChat(activeBooking.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 hover:scale-[1.02] ring-2 ring-emerald-400/30"
                          title="Click once event services are delivered. Unlocks host review & rating."
                        >
                          {actionLoadingId === activeBooking.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>✓ Mark as Done (Completed)</span>
                        </button>
                      )}

                      {normBookingStatus === 'completed' && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Host Review Unlocked</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

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
                          Start Consultation with {activePartner.partner_name}
                        </h4>
                        <p className="text-xs text-stone-500 max-w-md mx-auto">
                          Send a direct message below to discuss pricing, arrangements, or date confirmation. Click any quick greeting to start immediately:
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                        {QUICK_REPLIES.map((rep, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(undefined, rep)}
                            className="text-left px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-taupe hover:bg-stone-50 text-xs text-stone-700 transition-all shadow-xs"
                          >
                            {rep}
                          </button>
                        ))}
                      </div>
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
                    Quick Reply:
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
                  <h3 className="text-lg font-bold text-charcoal">Select or Open a Client Consultation</h3>
                  <p className="text-xs text-stone-500">
                    Select a client conversation from the left queue or choose one of your active booking inquiries below to chat directly:
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
                          <User className="w-4 h-4 text-taupe" />
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
    </SupplierLayout>
  );
}
