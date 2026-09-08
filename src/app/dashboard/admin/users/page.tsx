'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import adminApi from '@/lib/services/adminApi';
import { AdminUserItem } from '@/types/api';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  RefreshCw,
  Mail,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'consumer' | 'supplier' | 'admin'>('consumer');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers({
        role: roleFilter === 'all' ? undefined : roleFilter,
        search: searchTerm || undefined,
      });
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to load users list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleToggleStatus = async (user: AdminUserItem) => {
    const currentActive = user.is_active ?? user.isActive ?? true;
    const newActive = !currentActive;

    setActionLoadingId(user.id);
    setFeedback(null);

    try {
      await adminApi.updateUserStatus(user.id, newActive);
      setFeedback({
        text: `User "${user.full_name || user.email}" is now ${newActive ? 'Active' : 'Suspended/Blocked'}.`,
        type: 'success',
      });

      // Update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_active: newActive, isActive: newActive } : u
        )
      );
    } catch (err: any) {
      setFeedback({
        text: err?.message || 'Failed to update user status.',
        type: 'error',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (d?: string) => {
    if (!d) return 'Member';
    try {
      return new Date(d).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-taupe" />
              <h1 className="font-classico text-2xl font-bold uppercase tracking-tight text-charcoal">
                Hosts & Platform Users
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Manage consumer accounts, view event booking history, and control user platform access.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-charcoal hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-2 shadow-soft-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-taupe' : ''}`} />
            <span>Refresh Table</span>
          </button>
        </div>

        {/* FEEDBACK TOAST */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-stone-400 hover:text-stone-700 underline text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SEARCH & ROLE FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-soft-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by full name, email address or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40 transition-all"
            />
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto">
            {(
              [
                { key: 'consumer', label: 'Hosts (Consumers)' },
                { key: 'supplier', label: 'Suppliers' },
                { key: 'admin', label: 'Admins' },
                { key: 'all', label: 'All Users' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRoleFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  roleFilter === tab.key
                    ? 'bg-white text-charcoal shadow-soft-sm'
                    : 'text-stone-500 hover:text-charcoal hover:bg-stone-50/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-6">User / Account</th>
                  <th className="py-3.5 px-6">Role & City</th>
                  <th className="py-3.5 px-6">Events Created</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      <div className="inline-flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-taupe" />
                        <span>Loading user accounts...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      No user accounts found matching your search.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => {
                    const isProcessing = actionLoadingId === item.id;
                    const name = item.full_name || item.email.split('@')[0];
                    const email = item.email;
                    const role = item.role || 'consumer';
                    const city = item.city || 'Den Haag';
                    const isActive = item.is_active ?? item.isActive ?? true;
                    const eventsCount = item.total_events_count ?? 0;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-stone-50/70 transition-colors group"
                      >
                        {/* User / Account */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-charcoal text-white font-bold flex items-center justify-center shrink-0">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-charcoal block truncate text-xs">
                                {name}
                              </span>
                              <span className="text-[11px] text-stone-400 block truncate">
                                {email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role & City */}
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold text-[11px] mb-1 capitalize">
                            {role === 'consumer' ? 'Host' : role}
                          </span>
                          <div className="text-[11px] text-stone-500">
                            📍 {city}
                          </div>
                        </td>

                        {/* Events Count */}
                        <td className="py-4 px-6">
                          <span className="font-bold text-charcoal">
                            {eventsCount}
                          </span>
                          <span className="text-[11px] text-stone-500 ml-1">
                            {eventsCount === 1 ? 'event' : 'events'}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-6 text-stone-500 text-[11px]">
                          {formatDate(item.created_at)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isActive ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3 h-3 text-rose-600" />
                            )}
                            <span>{isActive ? 'Active' : 'Suspended'}</span>
                          </span>
                        </td>

                        {/* Access Control */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            disabled={isProcessing || role === 'admin'}
                            onClick={() => handleToggleStatus(item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 ml-auto shadow-sm ${
                              isActive
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-700 text-white hover:bg-emerald-800'
                            }`}
                          >
                            {isProcessing ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : isActive ? (
                              <UserX className="w-3 h-3" />
                            ) : (
                              <UserCheck className="w-3 h-3" />
                            )}
                            <span>{isActive ? 'Suspend' : 'Reactivate'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
