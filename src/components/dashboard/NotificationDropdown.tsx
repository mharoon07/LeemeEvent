'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  MessageSquare,
  PartyPopper,
  ShieldCheck,
  Star,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { NotificationItem, notificationsApi } from '@/lib/services/consumerApi';

interface NotificationDropdownProps {
  role: 'host' | 'supplier' | 'admin';
}

export default function NotificationDropdown({ role }: NotificationDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'bookings' | 'messages'>('all');
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  const fetchNotifications = async (isAutoSync = false) => {
    try {
      const items = await notificationsApi.getNotifications(role);
      const safeItems = items || [];

      // Check if new unread notification arrived
      if (!isInitialLoadRef.current && safeItems.length > 0) {
        const newUnread = safeItems.find((n) => !n.read && !knownIdsRef.current.has(n.id));
        if (newUnread) {
          setActiveToast(newUnread);
          setHasNewAlert(true);
          setTimeout(() => setActiveToast(null), 5500);
        }
      }

      // Update known IDs
      const currentIds = new Set(safeItems.map((n) => n.id));
      knownIdsRef.current = currentIds;
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }

      setNotifications(safeItems);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // 1. BroadcastChannel across all browser tabs / windows
    let bc: any = null;
    if (typeof (window as any).BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('leemevents_notifications_bus');
        bc.onmessage = (event: any) => {
          const { type, detail } = event.data || {};
          if (detail && (detail.role === role || detail.role === 'all')) {
            if (type === 'new' && detail.notification) {
              setActiveToast(detail.notification);
              setHasNewAlert(true);
              setTimeout(() => setActiveToast(null), 5500);
            }
            fetchNotifications(true);
          }
        };
      } catch {}
    }

    // 2. Custom Events on same window
    const handleNewNotification = (e: any) => {
      const detail = e.detail;
      if (detail && (detail.role === role || detail.role === 'all')) {
        if (detail.notification) {
          setActiveToast(detail.notification);
          setHasNewAlert(true);
          setTimeout(() => setActiveToast(null), 5500);
        }
        fetchNotifications(true);
      }
    };

    const handleNotificationsUpdated = (e: any) => {
      const detail = e.detail;
      if (detail && (detail.role === role || detail.role === 'all')) {
        fetchNotifications(true);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `LEEMEVENTS_NOTIFICATIONS_${role.toUpperCase()}` || e.key === 'LEEMEVENTS_NOTIFICATIONS_PING') {
        fetchNotifications(true);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('leemevents:new_notification', handleNewNotification);
      window.addEventListener('leemevents:notifications_updated', handleNotificationsUpdated);
      window.addEventListener('storage', handleStorageChange);
    }

    // 3. Fast Heartbeat Auto-Sync (Every 2 seconds - zero manual refresh needed)
    const syncInterval = setInterval(() => {
      fetchNotifications(true);
    }, 2000);

    return () => {
      clearInterval(syncInterval);
      if (bc) {
        try { bc.close(); } catch {}
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('leemevents:new_notification', handleNewNotification);
        window.removeEventListener('leemevents:notifications_updated', handleNotificationsUpdated);
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, [role]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await notificationsApi.markAsRead(id, role);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = async () => {
    await notificationsApi.markAllAsRead(role);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasNewAlert(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await notificationsApi.deleteNotification(id, role);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = async () => {
    await notificationsApi.clearAll(role);
    setNotifications([]);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_created':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'proposal_received':
      case 'proposal':
        return <PartyPopper className="w-4 h-4 text-purple-600" />;
      case 'booking_accepted':
      case 'booking_confirmed':
        return <Check className="w-4 h-4 text-emerald-600" />;
      case 'event_completed':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case 'review_received':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case 'new_message':
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'new_service':
        return <Sparkles className="w-4 h-4 text-rose-600" />;
      case 'security_login':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-600" />;
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const now = new Date().getTime();
      const time = new Date(dateStr).getTime();
      const diffMs = now - time;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'bookings') {
      return ['event_created', 'proposal_received', 'proposal', 'booking_accepted', 'booking_confirmed', 'event_completed'].includes(item.type);
    }
    if (filter === 'messages') {
      return item.type === 'message' || item.type === 'new_message';
    }
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNewAlert(false);
        }}
        className={`relative p-2.5 rounded-xl transition-all duration-200 border ${
          isOpen
            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-zinc-900/10'
            : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200/80 shadow-sm'
        }`}
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex items-center justify-center px-1.5 py-0.5 min-w-[20px] h-5 text-[11px] font-bold text-white bg-rose-600 rounded-full shadow-sm ring-2 ring-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Real-Time Floating Toast Alert (Cross-Window Trigger) */}
      {activeToast && (
        <div className="fixed top-5 right-5 z-[9999] max-w-sm w-full bg-zinc-900 text-white rounded-2xl p-4 shadow-2xl border border-zinc-700 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              {getNotificationIcon(activeToast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">New Notification</span>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white truncate mt-0.5">{activeToast.title}</h4>
              <p className="text-xs text-zinc-300 line-clamp-2 mt-0.5">{activeToast.description || activeToast.desc}</p>
              {activeToast.link && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveToast(null);
                    router.push(activeToast.link);
                  }}
                  className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[380px] sm:w-[420px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-zinc-200 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-zinc-900 text-base">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-zinc-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-100 bg-white overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'bookings', label: 'Bookings & Leads' },
              { id: 'messages', label: 'Messages' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-zinc-800">No notifications found</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {filter === 'unread'
                    ? 'You have caught up with all notifications!'
                    : 'Activity and alerts will appear here in real-time.'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`group relative p-3.5 transition-all cursor-pointer flex items-start gap-3 hover:bg-zinc-50 ${
                    !item.read ? 'bg-amber-50/40 font-medium' : 'bg-white'
                  }`}
                >
                  {/* Icon Indicator */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      !item.read
                        ? 'bg-white border-amber-200 shadow-sm'
                        : 'bg-zinc-100 border-zinc-200'
                    }`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-bold truncate ${!item.read ? 'text-zinc-900' : 'text-zinc-700'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.description || item.desc}
                    </p>

                    {item.link && (
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 group-hover:translate-x-0.5 transition-transform">
                        <span>Open Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Quick Actions (Hover) */}
                  <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(item.id, e)}
                        className="p-1 text-zinc-400 hover:text-emerald-600 rounded bg-white/90 shadow-sm border border-zinc-200"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 text-zinc-400 hover:text-rose-600 rounded bg-white/90 shadow-sm border border-zinc-200"
                      title="Delete"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Unread dot */}
                  {!item.read && (
                    <span className="absolute right-3 top-4 w-2 h-2 rounded-full bg-rose-500 group-hover:opacity-0 transition-opacity"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-zinc-100 bg-zinc-50/50 text-center">
            <Link
              href={role === 'host' ? '/dashboard/host/requests' : '/dashboard/supplier/leads'}
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 inline-flex items-center gap-1"
            >
              View Activity Hub <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
