'use client';

import React, { useState, useEffect } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import { reviewsApi } from '@/lib/services/consumerApi';
import {
  Star,
  Sparkles,
  RefreshCw,
  Award,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ThumbsUp,
  Heart,
  User
} from 'lucide-react';

export default function SupplierReviewsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadReviews = async () => {
    if (authLoading || !user?.id) return;
    try {
      setLoading(true);
      const data = await reviewsApi.getReviews(user.id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [user?.id, authLoading]);

  // Aggregate Calculations
  const totalCount = reviews.length;
  const avgOverall =
    totalCount > 0
      ? reviews.reduce((acc, r) => acc + Number(r.overall_rating || r.rating_overall || 5), 0) / totalCount
      : 5.0;

  const avgPunctuality =
    totalCount > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating_punctuality || 5), 0) / totalCount
      : 5.0;

  const avgQuality =
    totalCount > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating_quality || 5), 0) / totalCount
      : 5.0;

  const avgCommunication =
    totalCount > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating_communication || 5), 0) / totalCount
      : 5.0;

  const avgValue =
    totalCount > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating_value || 5), 0) / totalCount
      : 5.0;

  const fiveStarCount = reviews.filter((r) => Math.round(Number(r.overall_rating || r.rating_overall || 5)) === 5).length;
  const fourStarCount = reviews.filter((r) => Math.round(Number(r.overall_rating || r.rating_overall || 5)) === 4).length;
  const threeStarCount = reviews.filter((r) => Math.round(Number(r.overall_rating || r.rating_overall || 5)) === 3).length;

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Top Header Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-taupe" />
                <span>Verified Reputation Ledger</span>
              </span>
              <span className="text-xs text-stone-500 font-medium">Live Supabase Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              Client Reviews & Star Ratings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Authentic, verified reviews from event hosts submitted upon successful service completion. High ratings boost your visibility in marketplace search rankings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadReviews}
              className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
              title="Refresh Reviews"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{avgOverall.toFixed(2)} Overall ({totalCount} Reviews)</span>
            </div>
          </div>
        </div>

        {/* Rating Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Score Card */}
          <div className="md:col-span-4 bg-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-soft-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-taupe/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-sand/70">
                  Overall Rating
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Top Tier</span>
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold text-sand font-mono">
                  {avgOverall.toFixed(2)}
                </span>
                <span className="text-sand/60 text-lg font-bold">/ 5.0</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-5 h-5 ${
                      s <= Math.round(avgOverall)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-600'
                    }`}
                  />
                ))}
                <span className="text-xs text-sand/80 font-medium ml-2">
                  Based on {totalCount} verified host experiences
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 relative z-10 flex items-center justify-between text-xs text-sand/80">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-taupe-200" />
                <span>100% Verified Bookings</span>
              </div>
              <span className="font-bold text-sand">LEEMEVENTS Guaranteed</span>
            </div>
          </div>

          {/* Criteria Breakdown Grid */}
          <div className="md:col-span-8 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm grid grid-cols-2 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">Punctuality</span>
                <span className="text-xs font-bold text-charcoal font-mono bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                  {avgPunctuality.toFixed(1)} ★
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(avgPunctuality / 5) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-400 block">Timeliness of arrival and schedule</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">Quality of Service</span>
                <span className="text-xs font-bold text-charcoal font-mono bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                  {avgQuality.toFixed(1)} ★
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(avgQuality / 5) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-400 block">Execution, setup, and aesthetic presentation</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">Communication</span>
                <span className="text-xs font-bold text-charcoal font-mono bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                  {avgCommunication.toFixed(1)} ★
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(avgCommunication / 5) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-400 block">Response speed and clear consultation</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-600">Value for Money</span>
                <span className="text-xs font-bold text-charcoal font-mono bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                  {avgValue.toFixed(1)} ★
                </span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(avgValue / 5) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-stone-400 block">Pricing fairness for premium bespoke delivery</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/80">
            <h2 className="text-lg font-bold text-charcoal flex items-center gap-2">
              <span>Client Testimonials & Feedback</span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
                {totalCount}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">Syncing verified reviews from database...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center space-y-4 shadow-soft-sm">
              <div className="w-14 h-14 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center mx-auto">
                <Star className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-charcoal text-base">No client reviews yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                When event hosts complete their bookings and mark events done, their feedback and star ratings will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const reviewerName =
                  rev.consumer_name ||
                  rev.consumer?.full_name ||
                  rev.consumer?.name ||
                  rev.reviewer_name ||
                  rev.consumer_email?.split('@')[0] ||
                  'Verified Host';

                const score = Number(rev.overall_rating || rev.rating_overall || 5);
                const reviewDate = rev.created_at
                  ? new Date(rev.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Recent Event';

                return (
                  <div
                    key={rev.id}
                    className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-charcoal text-white font-bold flex items-center justify-center text-xs shadow-soft-sm">
                          {reviewerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-charcoal text-sm">{reviewerName}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Event</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-medium">Reviewed on {reviewDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= Math.round(score)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-900 font-mono ml-1">
                          {score.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Review Criteria Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                        Punctuality: {rev.rating_punctuality || 5}★
                      </span>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                        Quality: {rev.rating_quality || 5}★
                      </span>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                        Communication: {rev.rating_communication || 5}★
                      </span>
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
                        Value: {rev.rating_value || 5}★
                      </span>
                    </div>

                    {/* Review Comment */}
                    <p className="text-xs text-stone-700 leading-relaxed bg-sand-50/60 p-4 rounded-2xl border border-stone-200/60">
                      &ldquo;{rev.comment || 'Outstanding bespoke service delivered with utmost care and attention to detail.'}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SupplierLayout>
  );
}
