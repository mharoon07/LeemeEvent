'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/dashboard/AdminLayout';
import adminApi from '@/lib/services/adminApi';
import { Category } from '@/types/api';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
  Edit2,
  Trash2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    id?: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    is_active: boolean;
  }>({
    name: '',
    slug: '',
    icon: 'Sparkles',
    description: '',
    is_active: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCategories();
      setCategories(data || []);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      icon: 'Sparkles',
      description: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setFormData({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || 'Sparkles',
      description: cat.description || '',
      is_active: cat.is_active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    setFeedback(null);

    const generatedSlug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    try {
      if (formData.id) {
        // Update existing category
        const updated = await adminApi.updateCategory(formData.id, {
          name: formData.name,
          slug: generatedSlug,
          icon: formData.icon,
          description: formData.description,
          is_active: formData.is_active,
        });
        setFeedback({
          text: `Category "${formData.name}" updated successfully.`,
          type: 'success',
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === formData.id ? { ...c, ...updated } : c))
        );
      } else {
        // Create new category
        const created = await adminApi.createCategory({
          name: formData.name,
          slug: generatedSlug,
          icon: formData.icon,
          description: formData.description,
          is_active: formData.is_active,
        });
        setFeedback({
          text: `Category "${formData.name}" created successfully.`,
          type: 'success',
        });
        setCategories((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({
        text: err?.message || 'Failed to save category.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    setActionLoadingId(cat.id);
    const newStatus = !(cat.is_active ?? true);
    try {
      await adminApi.updateCategory(cat.id, { is_active: newStatus });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: newStatus } : c))
      );
      setFeedback({
        text: `Category "${cat.name}" is now ${newStatus ? 'active' : 'inactive'}.`,
        type: 'success',
      });
    } catch (err: any) {
      setFeedback({
        text: err?.message || 'Failed to toggle category status.',
        type: 'error',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(term) ||
      (c.slug || '').toLowerCase().includes(term) ||
      (c.description || '').toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-taupe" />
              <h1 className="font-classico text-2xl font-bold uppercase tracking-tight text-charcoal">
                Event Categories & Services
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Configure event service types, category icons, URL slugs, and marketplace visibility.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={loadCategories}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-charcoal hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-2 shadow-soft-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-taupe' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-charcoal text-white hover:bg-taupe text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
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

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-soft-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories by name, slug or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40 transition-all"
            />
          </div>
        </div>

        {/* CATEGORIES GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-stone-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 text-stone-400 text-xs">
            No categories found. Click <strong>Add Category</strong> to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((cat) => {
              const isActive = cat.is_active ?? true;
              const isProcessing = actionLoadingId === cat.id;

              return (
                <div
                  key={cat.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isActive
                      ? 'border-stone-200/90 shadow-soft-sm hover:shadow-soft'
                      : 'border-stone-200 bg-stone-50/50 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-charcoal font-bold text-sm">
                          {cat.icon ? (
                            <span className="text-base">✨</span>
                          ) : (
                            cat.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-charcoal">{cat.name}</h3>
                          <span className="text-[11px] font-mono text-stone-400 block">
                            /{cat.slug}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-2 min-h-[32px]">
                      {cat.description || 'Standard marketplace category for event services and vendor bookings.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-4 text-xs">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleToggleStatus(cat)}
                      className="text-[11px] font-semibold text-stone-500 hover:text-charcoal flex items-center gap-1.5 transition-colors"
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-taupe" />
                      ) : isActive ? (
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-stone-400" />
                      )}
                      <span>{isActive ? 'Disable' : 'Enable'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(cat)}
                      className="text-[11px] font-bold text-taupe hover:text-charcoal flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ADD / EDIT CATEGORY MODAL */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 my-auto animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-taupe" />
                  <h3 className="font-bold text-charcoal text-base">
                    {formData.id ? 'Edit Category' : 'Create New Category'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitCategory} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fine Dining & Catering"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. catering (auto-generated if blank)"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of service type..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-taupe/40 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_active_toggle"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-taupe focus:ring-taupe"
                  />
                  <label htmlFor="is_active_toggle" className="text-xs text-charcoal font-semibold cursor-pointer">
                    Active & visible in marketplace search
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-taupe transition-all shadow-sm flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{formData.id ? 'Save Changes' : 'Create Category'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
