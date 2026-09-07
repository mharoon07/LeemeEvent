'use client';

import React, { useState, useEffect } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import {
  supplierPortalApi,
  mediaApi,
  encodeServiceDescription,
  decodeServiceDescription
} from '@/lib/services/consumerApi';
import { SupplierService } from '@/types/api';
import {
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Sparkles,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  Search,
  Eye,
  EyeOff,
  Star,
  MapPin,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Loader2,
  Check,
  Package,
  SlidersHorizontal,
  CloudUpload
} from 'lucide-react';

const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  mixology: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop',
  decor: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
  catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
  photography: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000&auto=format&fit=crop',
  music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop',
};

export default function SupplierServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<SupplierService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<SupplierService | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Simplified Form State (Clean: Name, Image, Price, Duration, Description)
  const [formData, setFormData] = useState<{
    name: string;
    image_url: string;
    description: string;
    base_price: string;
    duration_minutes: string;
    is_active: boolean;
  }>({
    name: '',
    image_url: '',
    description: '',
    base_price: '',
    duration_minutes: '120',
    is_active: true,
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await supplierPortalApi.getServices();
      setServices(data || []);
    } catch (err) {
      console.error('Failed to load supplier services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      image_url: DEFAULT_SERVICE_IMAGES.mixology,
      description: '',
      base_price: '',
      duration_minutes: '120',
      is_active: true,
    });
    setUploadSuccess(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: SupplierService) => {
    const { text: cleanDesc, image_url: currentImg } = decodeServiceDescription(service.description);
    setEditingService(service);
    setFormData({
      name: service.name,
      image_url: currentImg || service.image || DEFAULT_SERVICE_IMAGES.mixology,
      description: cleanDesc || '',
      base_price: String(service.base_price || 0),
      duration_minutes: String(service.duration_minutes || 120),
      is_active: service.is_active !== false,
    });
    setUploadSuccess(false);
    setIsModalOpen(true);
  };

  // Image Upload to Cloudinary Handler with Client-Side Smart Compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadSuccess(false);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawDataUrl = reader.result as string;

        // Compress image using HTML5 Canvas to keep payload ultra lightweight (<50KB) and blazing fast
        const img = new (window as any).Image();
        img.onload = async () => {
          const maxDim = 900;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.78);
            try {
              const uploadedUrl = await mediaApi.uploadImage(optimizedBase64);
              setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
            } catch {
              setFormData((prev) => ({ ...prev, image_url: optimizedBase64 }));
            }
          } else {
            const uploadedUrl = await mediaApi.uploadImage(rawDataUrl);
            setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
          }
          setUploadingImage(false);
          setUploadSuccess(true);
        };
        img.onerror = async () => {
          const uploadedUrl = await mediaApi.uploadImage(rawDataUrl);
          setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
          setUploadingImage(false);
          setUploadSuccess(true);
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error processing image:', err);
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.base_price) return;

    try {
      setSaving(true);
      const encodedDescription = encodeServiceDescription(formData.description, formData.image_url);

      const payload = {
        name: formData.name.trim(),
        description: encodedDescription,
        pricing_type: 'fixed',
        base_price: Number(formData.base_price),
        deposit_percentage: 20,
        duration_minutes: Number(formData.duration_minutes) || 120,
        capacity_min: 1,
        capacity_max: 100,
        is_active: formData.is_active,
      };

      if (editingService) {
        await supplierPortalApi.updateService(editingService.id, payload);
      } else {
        await supplierPortalApi.createService(payload);
      }

      setIsModalOpen(false);
      await loadServices();
    } catch (err: any) {
      alert(`Error saving service: ${err?.message || 'Please check input'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service "${name}"? This will permanently remove it from Supabase.`)) {
      return;
    }

    try {
      await supplierPortalApi.deleteService(id);
      setServices(services.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(`Failed to delete service: ${err?.message || 'Server error'}`);
    }
  };

  const handleToggleStatus = async (service: SupplierService) => {
    try {
      const newStatus = !service.is_active;
      await supplierPortalApi.updateService(service.id, { is_active: newStatus });
      setServices(services.map((s) => (s.id === service.id ? { ...s, is_active: newStatus } : s)));
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
    }
  };

  const filteredServices = services.filter((s) => {
    const { text } = decodeServiceDescription(s.description);
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      text.toLowerCase().includes(query)
    );
  });

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header with Stats & Add Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-taupe/15 text-taupe">
                Marketplace Catalog
              </span>
              <span className="text-xs text-stone-500 font-medium">Synced with Supabase & Cloudinary</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              Services & Pricing Packages
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
              Create, configure, and manage your bespoke offerings. Newly added services appear instantly in the live consumer marketplace with their dedicated photos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadServices}
              className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
              title="Refresh Catalog"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-charcoal text-white text-xs sm:text-sm font-semibold hover:bg-taupe transition-all shadow-soft-sm hover:shadow-soft-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-stone-200/80 rounded-2xl p-3 shadow-soft-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services by title or description..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
            />
          </div>

          <div className="text-xs font-semibold text-stone-500">
            Total Active Services: <span className="font-bold text-charcoal">{filteredServices.length}</span>
          </div>
        </div>

        {/* Services Cards Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-taupe border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Syncing services from Supabase...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white border border-dashed border-stone-300 rounded-3xl p-12 text-center space-y-4 shadow-soft-sm">
            <div className="w-14 h-14 rounded-2xl bg-sand-100 text-taupe flex items-center justify-center mx-auto shadow-inner">
              <Layers className="w-7 h-7 stroke-[1.5]" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-bold text-charcoal text-base">No services found in your catalog</h3>
              <p className="text-xs text-stone-500">
                {searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'Start showcasing your offerings by adding your first service package with a photo, price, and description.'}
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe transition-colors shadow-soft-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Service</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const { text: cleanDesc, image_url: cardImage } = decodeServiceDescription(service.description);
              const displayImage = cardImage || service.image || DEFAULT_SERVICE_IMAGES.mixology;
              const isActive = service.is_active !== false;

              return (
                <div
                  key={service.id}
                  className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:shadow-soft-md ${
                    isActive ? 'border-stone-200/90' : 'border-stone-200/60 opacity-80'
                  }`}
                >
                  {/* Top Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                    <img
                      src={displayImage}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all ${
                          isActive
                            ? 'bg-emerald-500/90 text-white shadow-sm'
                            : 'bg-stone-800/80 text-stone-300'
                        }`}
                        title="Click to toggle active status"
                      >
                        {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isActive ? 'Active in Market' : 'Paused / Hidden'}</span>
                      </button>
                    </div>

                    {/* Bottom overlay title info */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-amber-200 transition-colors">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2 text-stone-200 text-xs mt-0.5">
                        <span className="flex items-center gap-1 text-amber-300">
                          <Star className="w-3 h-3 fill-amber-300" />
                          <span className="font-semibold">5.0</span>
                        </span>
                        <span>•</span>
                        <span>{service.duration_minutes ? `${service.duration_minutes} mins` : 'Flexible duration'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Prominent Description Display */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-taupe block">Description & Inclusions:</span>
                      <p className="text-xs text-stone-700 leading-relaxed line-clamp-4 bg-stone-50/80 p-3 rounded-2xl border border-stone-100">
                        {cleanDesc || 'Bespoke event package crafted with attention to detail and luxury standards.'}
                      </p>
                    </div>

                    {/* Price & Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">Rate</span>
                        <span className="text-xl font-bold text-charcoal tracking-tight font-sans">
                          €{Number(service.base_price).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(service)}
                          className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id, service.name)}
                          className="p-2.5 rounded-xl border border-stone-200 text-stone-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WIDE RECTANGULAR STUDIO MODAL (MAX-W-4XL) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Top Header Bar */}
              <div className="px-7 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/90">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-charcoal text-white flex items-center justify-center shadow-soft-sm">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-charcoal">
                      {editingService ? 'Edit Service Offering' : 'Create Bespoke Service Offering'}
                    </h2>
                    <span className="text-xs text-stone-500">
                      High-resolution visual showcase & direct Supabase database storage
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-charcoal hover:bg-stone-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body: WIDE 2-COLUMN RECTANGULAR LAYOUT */}
              <form onSubmit={handleSubmit}>
                <div className="p-7 grid grid-cols-1 md:grid-cols-12 gap-7">
                  {/* LEFT COLUMN: WIDE RECTANGULAR IMAGE HERO & CLOUDINARY UPLOAD (5 COLS) */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                        Service Showcase Photo *
                      </label>
                      <span className="text-[10px] text-taupe font-semibold bg-sand-100 px-2 py-0.5 rounded-md">
                        Cloudinary CDN
                      </span>
                    </div>

                    {/* Wide 16:9 Landscape Aspect Ratio Image Preview */}
                    <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-inner group">
                      {formData.image_url ? (
                        <img
                          src={formData.image_url}
                          alt="Service Photo Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 space-y-1">
                          <ImageIcon className="w-8 h-8 stroke-[1.5]" />
                          <span className="text-xs">No image selected</span>
                        </div>
                      )}

                      {/* Top Overlay Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-amber-300" />
                        <span>Landscape Hero View</span>
                      </div>

                      {/* Loading Spinner during upload */}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
                          <Loader2 className="w-7 h-7 animate-spin text-taupe" />
                          <span className="text-xs font-semibold">Uploading to Cloudinary...</span>
                        </div>
                      )}
                    </div>

                    {/* Upload Buttons & File Dropzone */}
                    <div className="space-y-2">
                      <label className="cursor-pointer w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-charcoal text-xs font-bold transition-all hover:border-taupe shadow-soft-sm">
                        <CloudUpload className="w-4 h-4 text-taupe" />
                        <span>{uploadingImage ? 'Uploading Image...' : uploadSuccess ? '✓ Image Uploaded! Choose Another' : 'Upload Photo from Device'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>

                      <div className="relative">
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="Or paste direct image URL..."
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-charcoal focus:outline-none focus:border-taupe bg-stone-50/80"
                        />
                      </div>
                    </div>

                    {/* Curated Luxury Photo Presets (Clean Wrap without scrollbar) */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                        Quick Luxury Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(DEFAULT_SERVICE_IMAGES).map(([key, url]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, image_url: url }));
                              setUploadSuccess(false);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                              formData.image_url === url
                                ? 'bg-charcoal text-white shadow-sm'
                                : 'bg-sand-100/90 text-charcoal hover:bg-sand-200'
                            }`}
                          >
                            {key}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: SERVICE ESSENTIAL INFORMATION (7 COLS) */}
                  <div className="md:col-span-7 space-y-4">
                    {/* 1. Service Title */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Masterclass Mixology & Bespoke Cocktail Lounge"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-charcoal focus:outline-none focus:border-taupe bg-stone-50/50 shadow-soft-sm"
                      />
                    </div>

                    {/* 2. Price (€) & Duration (mins) Side-by-Side */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                          Total Rate (€) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">€</span>
                          <input
                            type="number"
                            min="1"
                            required
                            value={formData.base_price}
                            onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                            placeholder="1850"
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-charcoal focus:outline-none focus:border-taupe bg-white shadow-soft-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                          Duration (Minutes)
                        </label>
                        <div className="relative">
                          <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="number"
                            min="15"
                            step="15"
                            value={formData.duration_minutes}
                            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                            placeholder="120"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-charcoal focus:outline-none focus:border-taupe bg-white shadow-soft-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Full Description & Included Inclusions */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-charcoal uppercase tracking-wider">
                          Description & Inclusions *
                        </label>
                        <span className="text-[10px] text-stone-400">Visible to all Event Hosts</span>
                      </div>
                      <textarea
                        rows={5}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detail everything included in this service: certified staff, specialized equipment, setup time, ingredients, presentation style, and luxury standards..."
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs text-charcoal leading-relaxed focus:outline-none focus:border-taupe bg-stone-50/50 shadow-soft-sm resize-none"
                      />
                    </div>

                    {/* 4. Live Marketplace Visibility Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="is_active_checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded border-stone-300 text-taupe focus:ring-taupe cursor-pointer"
                      />
                      <label htmlFor="is_active_checkbox" className="text-xs font-semibold text-stone-700 cursor-pointer select-none">
                        Publish immediately to live consumer marketplace feed
                      </label>
                    </div>
                  </div>
                </div>

                {/* MODAL BOTTOM ACTION BAR */}
                <div className="px-7 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
                  <div className="text-xs text-stone-500 font-medium hidden sm:block">
                    Changes save instantly to live database
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-200/60 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || uploadingImage}
                      className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-charcoal text-white text-xs font-bold hover:bg-taupe transition-all shadow-soft-sm hover:shadow-soft-md disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving to Supabase...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>{editingService ? 'Update Service Package' : 'Publish Service Package'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
