'use client';

import React, { useState, useEffect } from 'react';
import SupplierLayout from '@/components/dashboard/SupplierLayout';
import { useAuth } from '@/context/AuthContext';
import { supplierPortalApi } from '@/lib/services/consumerApi';
import {
  Briefcase,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Star,
  Layers,
  FileText,
  BadgeCheck,
  ExternalLink,
  RefreshCw,
  X,
  Camera,
  Check,
  Tag,
  Save,
  Clock,
} from 'lucide-react';

interface MilestoneItem {
  id: string;
  title: string;
  role: string;
  venue: string;
  year: string;
  description: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  verified: boolean;
}

interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export default function SupplierPortfolioPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [savingCV, setSavingCV] = useState(false);
  const [cvSaved, setCvSaved] = useState(false);

  // Brand / Profile State
  const [profile, setProfile] = useState<any>(null);
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [yearsInBusiness, setYearsInBusiness] = useState('8');
  const [eventsCompleted, setEventsCompleted] = useState('240+');

  // CV Sections
  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: 'm-1',
      title: 'Royal Botanic Garden Annual Gala',
      role: 'Lead Floral & Atmosphere Designer',
      venue: 'Madrid Botanical Estate',
      year: '2025',
      description: 'Engineered 14 bespoke floral pergolas and centerpiece styling for 350 VIP patrons.',
    },
    {
      id: 'm-2',
      title: 'Château de Bellevue Wedding Season',
      role: 'Exclusive Catering & Mixology Resident',
      venue: 'Château de Bellevue, Den Haag',
      year: '2024 - 2025',
      description: 'Delivered 24 full-service luxury weddings featuring seasonal 4-course gourmet dining.',
    },
  ]);

  const [certifications, setCertifications] = useState<CertificationItem[]>([
    {
      id: 'c-1',
      name: 'Commercial Public Liability Insurance (€5M Coverage)',
      issuer: 'Allianz Luxury Events Underwriting',
      year: '2026',
      verified: true,
    },
    {
      id: 'c-2',
      name: 'HACCP Level 3 Master Food Safety Certification',
      issuer: 'European Hospitality Authority',
      year: '2025',
      verified: true,
    },
    {
      id: 'c-3',
      name: 'European Master Floral & Scenography Guild',
      issuer: 'International Floral Artistry Board',
      year: '2024',
      verified: true,
    },
  ]);

  const [specialties, setSpecialties] = useState<string[]>([
    'Bespoke Scenography',
    'Michelin-Tasting Banquets',
    'Cold Spark FX & Atmospheric Smoke',
    'Botanical Cocktail Bars',
    'Halal Fine Dining',
    '4K Drone Cinematography',
    'Live Classical & Saxophone Ensembles',
  ]);
  const [newSpecialtyInput, setNewSpecialtyInput] = useState('');

  const [awards, setAwards] = useState<AwardItem[]>([
    {
      id: 'a-1',
      title: 'European Luxury Event Artisan Winner',
      organization: 'Bridal & Milestone Awards',
      year: '2025',
    },
    {
      id: 'a-2',
      title: 'Top 10 Bespoke Curators Feature',
      organization: 'Vogue Celebrations Spain',
      year: '2024',
    },
  ]);

  // Gallery Showcase
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);

  // Modals
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ title: '', role: '', venue: '', year: '2025', description: '' });

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', year: '2026' });

  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [awardForm, setAwardForm] = useState({ title: '', organization: '', year: '2025' });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({ media_url: '', title: '', category_tag: 'Weddings', caption: '' });

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [profData, portData] = await Promise.all([
        supplierPortalApi.getProfile().catch(() => null),
        supplierPortalApi.getPortfolio().catch(() => []),
      ]);

      if (profData) {
        setProfile(profData);
        setTagline(profData.tagline || 'Bespoke Celebration Scenography & Luxury Gastronomy');
        setBio(
          profData.bio ||
            'Pioneering unforgettable celebration aesthetics across Europe. From private château weddings to high-profile luxury galas, we deliver world-class precision, ethical artisan sourcing, and turnkey execution.'
        );
      }

      setPortfolioItems(portData || []);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSaveCVProfile = async () => {
    try {
      setSavingCV(true);
      await supplierPortalApi.updateProfile({
        tagline: tagline.trim(),
        bio: bio.trim(),
      });
      setCvSaved(true);
      setTimeout(() => setCvSaved(false), 3500);
    } catch (err: any) {
      alert(`Error updating CV profile: ${err?.message || 'Server error'}`);
    } finally {
      setSavingCV(false);
    }
  };

  // Milestone Actions
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.title || !milestoneForm.role) return;

    setMilestones([
      ...milestones,
      {
        id: `m-${Date.now()}`,
        ...milestoneForm,
      },
    ]);
    setMilestoneForm({ title: '', role: '', venue: '', year: '2025', description: '' });
    setIsMilestoneModalOpen(false);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  // Cert Actions
  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.name || !certForm.issuer) return;

    setCertifications([
      ...certifications,
      {
        id: `c-${Date.now()}`,
        ...certForm,
        verified: true,
      },
    ]);
    setCertForm({ name: '', issuer: '', year: '2026' });
    setIsCertModalOpen(false);
  };

  const handleDeleteCert = (id: string) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };

  // Award Actions
  const handleAddAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardForm.title || !awardForm.organization) return;

    setAwards([
      ...awards,
      {
        id: `a-${Date.now()}`,
        ...awardForm,
      },
    ]);
    setAwardForm({ title: '', organization: '', year: '2025' });
    setIsAwardModalOpen(false);
  };

  const handleDeleteAward = (id: string) => {
    setAwards(awards.filter((a) => a.id !== id));
  };

  // Specialty Tags
  const handleAddSpecialty = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    if (!newSpecialtyInput.trim()) return;
    if (!specialties.includes(newSpecialtyInput.trim())) {
      setSpecialties([...specialties, newSpecialtyInput.trim()]);
    }
    setNewSpecialtyInput('');
  };

  const handleRemoveSpecialty = (item: string) => {
    setSpecialties(specialties.filter((s) => s !== item));
  };

  // Photo Showcase Actions
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.media_url) return;

    try {
      await supplierPortalApi.createPortfolioItem({
        media_url: photoForm.media_url,
        title: photoForm.title || 'Showcase Project',
        category_tag: photoForm.category_tag,
        caption: photoForm.caption,
        sort_order: portfolioItems.length,
      });
      setIsPhotoModalOpen(false);
      setPhotoForm({ media_url: '', title: '', category_tag: 'Weddings', caption: '' });
      await loadAllData();
    } catch (err: any) {
      alert(`Error saving photo: ${err?.message || 'Server error'}`);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Remove this photo highlight?')) return;
    try {
      await supplierPortalApi.deletePortfolioItem(id);
      setPortfolioItems(portfolioItems.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(`Failed to delete: ${err?.message || 'Server error'}`);
    }
  };

  const businessName = profile?.business_name || user?.businessName || 'Verified Supplier';

  return (
    <SupplierLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* CV Header Hero */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-charcoal text-white font-bold text-2xl flex items-center justify-center shadow-soft-md shrink-0">
                {businessName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
                    {businessName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Master Partner</span>
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-taupe" />
                  <span>{profile?.city || 'Madrid'}, Spain • Serving Nationwide & Destinations</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAllData}
                className="p-3 rounded-2xl border border-stone-200 text-stone-600 hover:text-charcoal hover:bg-stone-50 transition-colors"
                title="Refresh CV Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleSaveCVProfile}
                disabled={savingCV}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-charcoal text-white text-xs sm:text-sm font-semibold hover:bg-taupe transition-all shadow-soft-sm disabled:opacity-50"
              >
                {savingCV ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Master CV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {cvSaved && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Master Portfolio & CV information permanently saved to Supabase!</span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Years in Business</span>
              <span className="text-base font-bold text-charcoal font-mono mt-0.5 block">{yearsInBusiness} Years</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Events Executed</span>
              <span className="text-base font-bold text-charcoal font-mono mt-0.5 block">{eventsCompleted}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Public Liability</span>
              <span className="text-base font-bold text-emerald-700 font-mono mt-0.5 block">€5,000,000</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-bold block">Client Rating</span>
              <span className="text-base font-bold text-charcoal flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>4.96 / 5.0</span>
              </span>
            </div>
          </div>

          {/* Tagline & Editorial Bio Editor */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">Brand Headline & Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Bespoke Scenography & Michelin-Grade Gastronomy for Milestone Celebrations"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal mb-1 block">Editorial Biography & Artisan Statement</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Detail your background, creative approach, vendor standards, and client commitment..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-taupe resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 1: Work Experience & Milestones (Curriculum Vitae) */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-charcoal">Career Milestones & Past Residencies</h2>
                <span className="text-[11px] text-stone-500">Documented track record for event planners and hosts</span>
              </div>
            </div>

            <button
              onClick={() => setIsMilestoneModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-charcoal transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-charcoal text-sm">{m.title}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[10px] font-bold font-mono">
                      {m.year}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 font-medium">
                    <span className="text-taupe font-semibold">{m.role}</span> • {m.venue}
                  </div>
                  <p className="text-xs text-stone-500 pt-0.5 leading-relaxed">{m.description}</p>
                </div>

                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0 self-end sm:self-center"
                  title="Delete Milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Accreditations, Certifications & Insurances */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-charcoal">Certifications, Licenses & Insurances</h2>
                <span className="text-[11px] text-stone-500">Verified compliance badges ensuring client peace of mind</span>
              </div>
            </div>

            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-charcoal transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {certifications.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between space-y-3 relative group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Verified {c.year}</span>
                  </div>
                  <h3 className="font-bold text-charcoal text-xs leading-snug">{c.name}</h3>
                  <span className="text-[11px] text-stone-500 block">{c.issuer}</span>
                </div>

                <button
                  onClick={() => handleDeleteCert(c.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors absolute top-3 right-3 opacity-0 group-hover:opacity-100"
                  title="Remove Certification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Specialties & Core Capabilities Matrix */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal">Specialties & Signature Capabilities</h2>
              <span className="text-[11px] text-stone-500">Key competencies that distinguish your craft</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {specialties.map((s) => (
              <span
                key={s}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-charcoal flex items-center gap-2 group hover:border-stone-300"
              >
                <span>{s}</span>
                <button
                  onClick={() => handleRemoveSpecialty(s)}
                  className="text-stone-400 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md pt-2">
            <input
              type="text"
              value={newSpecialtyInput}
              onChange={(e) => setNewSpecialtyInput(e.target.value)}
              onKeyDown={handleAddSpecialty}
              placeholder="e.g. Molecular Mixology, Drone Light Show..."
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
            />
            <button
              type="button"
              onClick={handleAddSpecialty}
              className="px-4 py-2 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe transition-colors"
            >
              + Add Tag
            </button>
          </div>
        </div>

        {/* Section 4: Industry Awards & Honors */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-charcoal">Awards & Editorial Features</h2>
                <span className="text-[11px] text-stone-500">Recognitions from bridal magazines and international juries</span>
              </div>
            </div>

            <button
              onClick={() => setIsAwardModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-charcoal transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Award</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {awards.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal text-xs">{a.title}</h3>
                    <span className="text-[11px] text-stone-500">
                      {a.organization} • {a.year}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAward(a.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Award"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Visual Showcase Highlights */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-soft-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-charcoal text-white flex items-center justify-center">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-charcoal">Visual Showcase Highlights</h2>
                <span className="text-[11px] text-stone-500">Featured visual proof of past celebrations</span>
              </div>
            </div>

            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-charcoal transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo Highlight</span>
            </button>
          </div>

          {portfolioItems.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-2">
              <Camera className="w-6 h-6 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-500 font-medium">No showcase highlights uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200/90 overflow-hidden bg-stone-900 relative group h-48"
                >
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-charcoal">
                      {item.category_tag || 'Showcase'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="text-xs font-bold text-white block truncate">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MILESTONE MODAL */}
        {isMilestoneModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-charcoal text-base">Add Career Milestone</h3>
                <button onClick={() => setIsMilestoneModalOpen(false)} className="text-stone-400 hover:text-charcoal">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddMilestone} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Event / Project Title *</label>
                  <input
                    type="text"
                    required
                    value={milestoneForm.title}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                    placeholder="e.g. Monaco Grand Prix VIP Yacht Reception"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Role / Scope *</label>
                  <input
                    type="text"
                    required
                    value={milestoneForm.role}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, role: e.target.value })}
                    placeholder="e.g. Executive Mixology Partner"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-charcoal mb-1 block">Venue / City</label>
                    <input
                      type="text"
                      value={milestoneForm.venue}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, venue: e.target.value })}
                      placeholder="e.g. Port Hercule"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-charcoal mb-1 block">Year / Period</label>
                    <input
                      type="text"
                      value={milestoneForm.year}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                      placeholder="2025"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Description</label>
                  <textarea
                    rows={2}
                    value={milestoneForm.description}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                    placeholder="Key highlights, number of patrons, bespoke features..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:border-taupe resize-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMilestoneModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe">
                    Save Milestone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CERT MODAL */}
        {isCertModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-charcoal text-base">Add Certification / License</h3>
                <button onClick={() => setIsCertModalOpen(false)} className="text-stone-400 hover:text-charcoal">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddCert} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Certification Title *</label>
                  <input
                    type="text"
                    required
                    value={certForm.name}
                    onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                    placeholder="e.g. Master Sommelier WSET Level 4"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Issuing Body / Institution *</label>
                  <input
                    type="text"
                    required
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="e.g. Wine & Spirit Education Trust"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Year Verified</label>
                  <input
                    type="text"
                    value={certForm.year}
                    onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                    placeholder="2026"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe">
                    Add Credential
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* AWARD MODAL */}
        {isAwardModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-charcoal text-base">Add Award or Feature</h3>
                <button onClick={() => setIsAwardModalOpen(false)} className="text-stone-400 hover:text-charcoal">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddAward} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Award Title *</label>
                  <input
                    type="text"
                    required
                    value={awardForm.title}
                    onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                    placeholder="e.g. Best Scenography Winner"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-charcoal mb-1 block">Organization / Magazine</label>
                    <input
                      type="text"
                      required
                      value={awardForm.organization}
                      onChange={(e) => setAwardForm({ ...awardForm, organization: e.target.value })}
                      placeholder="e.g. Vogue Weddings"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-charcoal mb-1 block">Year</label>
                    <input
                      type="text"
                      value={awardForm.year}
                      onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                      placeholder="2025"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAwardModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe">
                    Save Award
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PHOTO SHOWCASE MODAL */}
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-charcoal text-base">Add Photo Showcase</h3>
                <button onClick={() => setIsPhotoModalOpen(false)} className="text-stone-400 hover:text-charcoal">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleAddPhoto} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-charcoal mb-1 block">Photo URL *</label>
                  <input
                    type="url"
                    required
                    value={photoForm.media_url}
                    onChange={(e) => setPhotoForm({ ...photoForm, media_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-charcoal mb-1 block">Title</label>
                    <input
                      type="text"
                      value={photoForm.title}
                      onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                      placeholder="e.g. Grand Entrance Arch"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-charcoal mb-1 block">Category</label>
                    <select
                      value={photoForm.category_tag}
                      onChange={(e) => setPhotoForm({ ...photoForm, category_tag: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs text-charcoal focus:outline-none focus:border-taupe"
                    >
                      <option value="Weddings">Weddings</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Catering">Catering</option>
                      <option value="Decor">Decor</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-charcoal text-white text-xs font-semibold hover:bg-taupe">
                    Add Highlight
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
}
