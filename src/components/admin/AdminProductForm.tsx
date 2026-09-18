import React, { useState, useEffect } from 'react';
import { Painting, PaintingAvailability } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import {
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  Upload,
  Trash2,
  Image as ImageIcon,
  Plus,
  MoveUp,
  MoveDown,
  Sparkles,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminProductFormProps {
  productId?: string | null;
  onBack: () => void;
  onViewProductPublic: (painting: Painting) => void;
  onSelectTab: (tab: AdminTab) => void;
}

const PRESET_GALLERY_IMAGES = [
  { label: 'Hero Calligraphy & Gold Leaf', url: '/images/hero-painting.jpg' },
  { label: 'White Blossoms & Botanical', url: '/images/paintings/white-blossoms.jpg' },
  { label: 'Coastal Serenity Ocean Study', url: '/images/paintings/coastal-serenity-1.jpg' },
  { label: 'Coastal Serenity Twilight Horizon', url: '/images/paintings/coastal-serenity-2.jpg' },
  { label: 'Inner Thoughts Abstract Impasto', url: '/images/paintings/inner-thoughts.jpg' },
  { label: 'Mountain Lake Highland Study', url: '/images/paintings/mountain-lake.jpg' },
];

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  productId,
  onBack,
  onViewProductPublic,
  onSelectTab,
}) => {
  const isEditing = Boolean(productId);
  const categories = galleryDatabase.getCategories();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [artist, setArtist] = useState('calligraphy__by_ulain8261');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [category, setCategory] = useState('Calligraphy');
  const [subcategory, setSubcategory] = useState('');
  const [status, setStatus] = useState<PaintingAvailability>('NEW');
  const [artworkType, setArtworkType] = useState<'ORIGINAL' | 'LIMITED_EDITION' | 'PRINT' | 'MINIATURE' | 'OTHER'>('ORIGINAL');
  const [stockQuantity, setStockQuantity] = useState<number>(1);
  const [medium, setMedium] = useState('Oil & 24k Gold Leaf on Archival Belgian Linen');
  const [style, setStyle] = useState('Contemporary Calligraphy & Abstract');
  const [dimensions, setDimensions] = useState('36 × 48 in (91 × 122 cm)');
  const [year, setYear] = useState<string | number>(2026);
  const [frame, setFrame] = useState('Bespoke Solid Oak Museum Frame');
  const [description, setDescription] = useState(
    'An extraordinary original masterpiece exploring sacred proportion, natural mineral pigments, and archival linen texture. Hand-signed by the artist and accompanied by a sealed Certificate of Authenticity.'
  );
  const [images, setImages] = useState<string[]>(['/images/hero-painting.jpg']);
  const [isGift, setIsGift] = useState(false);
  const [featured, setFeatured] = useState(true);

  // Status feedback
  const [error, setError] = useState<string | null>(null);
  const [successPainting, setSuccessPainting] = useState<Painting | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data if editing
  useEffect(() => {
    if (productId) {
      const existing = galleryDatabase.getPaintingById(productId);
      if (existing) {
        setTitle(existing.title);
        setSlug(existing.slug);
        setArtist(existing.artist || 'calligraphy__by_ulain8261');
        setPrice(existing.price);
        setOriginalPrice(existing.originalPrice || '');
        setSalePrice(existing.salePrice || '');
        setCategory(existing.category || 'Calligraphy');
        setSubcategory(existing.subcategory || '');
        setStatus(existing.status || 'NEW');
        setArtworkType(existing.artworkType || (existing.isOriginal !== false ? 'ORIGINAL' : 'LIMITED_EDITION'));
        setStockQuantity(existing.stockQuantity ?? (existing.status === 'sold_out' || existing.status === 'SOLD_OUT' ? 0 : 1));
        setMedium(existing.medium || '');
        setStyle(existing.style || '');
        setDimensions(existing.dimensions || '');
        setYear(existing.year || 2026);
        setFrame(existing.frame || '');
        setDescription(existing.description || '');
        const imgs = existing.images && existing.images.length > 0 ? existing.images : [existing.image || '/images/hero-painting.jpg'];
        setImages(imgs);
        setIsGift(Boolean(existing.isGift));
        setFeatured(Boolean(existing.featured));
      }
    }
  }, [productId]);

  // Title auto-slug generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  // Image Upload handler (supports JPG, PNG, WEBP, validates size)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
        setError('Only JPG, JPEG, PNG, or WEBP images are supported.');
        return;
      }
      // Validate file size (< 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image exceeds maximum file size (10MB).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const resultUrl = loadEvent.target?.result as string;
        if (resultUrl) {
          setImages((prev) => [...prev, resultUrl]);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      setError('At least one primary product image is required.');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const copy = [...images];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      setImages(copy);
    } else if (direction === 'down' && index < images.length - 1) {
      const copy = [...images];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      setImages(copy);
    }
  };

  const handleSelectPresetImage = (url: string) => {
    setImages((prev) => {
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Painting Title is required.');
      return;
    }
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      setError('A valid positive price is required.');
      return;
    }
    if (images.length === 0) {
      setError('At least one artwork image is required.');
      return;
    }

    setIsSaving(true);

    try {
      const primaryImage = images[0];
      const payload: Partial<Painting> & { title: string; price: number } = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        artist: artist.trim() || 'calligraphy__by_ulain8261',
        price: Number(price),
        originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
        salePrice: salePrice !== '' ? Number(salePrice) : undefined,
        category,
        subcategory,
        status,
        artworkType,
        stockQuantity: Number(stockQuantity),
        medium,
        style,
        dimensions,
        year,
        frame,
        description,
        image: primaryImage,
        images,
        isGift,
        featured,
        isOriginal: artworkType === 'ORIGINAL',
      };

      let savedPainting: Painting;

      if (isEditing && productId) {
        galleryDatabase.updatePainting(productId, payload);
        savedPainting = galleryDatabase.getPaintingById(productId)!;
      } else {
        savedPainting = galleryDatabase.createPainting(payload);
      }

      setSuccessPainting(savedPainting);
    } catch (err: any) {
      setError(err.message || 'Failed to save artwork. Please verify input fields.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#71717A] hover:text-[#141416] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>

        {isEditing && productId && (
          <button
            type="button"
            onClick={() => {
              const p = galleryDatabase.getPaintingById(productId);
              if (p) onViewProductPublic(p);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#141416] hover:underline cursor-pointer"
          >
            <span>Preview in Public Store</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Success Banner */}
      {successPainting && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Check className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-emerald-950 font-serif">
                Artwork Successfully {isEditing ? 'Updated' : 'Published'}!
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                "{successPainting.title}" is saved in the gallery database with status <strong className="font-mono">{successPainting.status}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onViewProductPublic(successPainting)}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono uppercase tracking-wider rounded transition-colors"
            >
              View on Storefront
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-1.5 bg-white text-emerald-900 border border-emerald-300 text-xs font-mono uppercase tracking-wider rounded hover:bg-emerald-50 transition-colors"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Artwork Information */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-serif font-medium text-[#141416] pb-2 border-b border-[#E5E5E8]">
            1. Artwork Identification & Titles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Painting Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Atmosphere No. VII"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416] focus:bg-white transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Artist / Studio Signature *
              </label>
              <input
                type="text"
                required
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="calligraphy__by_ulain8261"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416] focus:bg-white transition-all font-sans"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                URL Slug (Perm-Link)
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-[#F0F0F3] border border-r-0 border-[#DCDCE0] rounded-l text-[11px] font-mono text-[#71717A]">
                  /paintings/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="atmosphere-no-vii"
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded-r text-xs text-[#141416] focus:outline-none focus:border-[#141416] focus:bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing, Inventory & Status */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-serif font-medium text-[#141416] pb-2 border-b border-[#E5E5E8]">
            2. Pricing, Inventory & Display Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Price (PKR) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="45000"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Original Price (Compare-at)
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="55000"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Sale Price (Optional)
              </label>
              <input
                type="number"
                min={0}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Optional promo price"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PaintingAvailability)}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
              >
                <option value="NEW">NEW (Appears on New Paintings page)</option>
                <option value="AVAILABLE">AVAILABLE (In stock catalog)</option>
                <option value="SOLD_OUT">SOLD OUT (Archived & Sold)</option>
                <option value="DRAFT">DRAFT (Hidden from public)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Artwork Type
              </label>
              <select
                value={artworkType}
                onChange={(e) => {
                  const type = e.target.value as any;
                  setArtworkType(type);
                  if (type === 'ORIGINAL') {
                    setStockQuantity(1);
                  }
                }}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
              >
                <option value="ORIGINAL">1-of-1 Original Artwork (Stock = 1)</option>
                <option value="LIMITED_EDITION">Limited Edition Print Suite</option>
                <option value="MINIATURE">Miniature Canvas Gift Panel</option>
                <option value="PRINT">Museum Archival Giclée Print</option>
                <option value="OTHER">Other Studio Artifact</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min={0}
                value={stockQuantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStockQuantity(val);
                  if (val <= 0) {
                    setStatus('SOLD_OUT');
                  } else if (status === 'SOLD_OUT' && val > 0) {
                    setStatus('AVAILABLE');
                  }
                }}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 bg-[#F9F9FB] border border-[#DCDCE0] rounded cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#141416] rounded border-[#DCDCE0] focus:ring-0"
              />
              <div>
                <span className="text-xs font-medium text-[#141416] block">
                  Featured on Homepage
                </span>
                <span className="text-[11px] text-[#71717A]">
                  Include this painting in the curated home editorial showcase.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-[#F9F9FB] border border-[#DCDCE0] rounded cursor-pointer">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-4 h-4 text-[#141416] rounded border-[#DCDCE0] focus:ring-0"
              />
              <div>
                <span className="text-xs font-medium text-[#141416] block">
                  Curated Gift Eligible
                </span>
                <span className="text-[11px] text-[#71717A]">
                  Display in the Gifts collection (/paintings/gift).
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Physical Specifications & Medium */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-serif font-medium text-[#141416] pb-2 border-b border-[#E5E5E8]">
            3. Specifications, Medium & Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Subcategory / Theme
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Gold Leaf Script, Horizon, Floral"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Creation Year
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2026"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Artwork Dimensions
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="36 × 48 in (91 × 122 cm)"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Medium & Materials
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="Oil & 24k Gold Leaf on Belgian Linen"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Frame Specification
              </label>
              <input
                type="text"
                value={frame}
                onChange={(e) => setFrame(e.target.value)}
                placeholder="Bespoke Solid Oak Frame"
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#555555] mb-1">
                Curator Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed curatorial narrative of the painting, artistic philosophy, and collector authenticity..."
                className="w-full p-3 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Product Image Management */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E8]">
            <h3 className="text-sm font-serif font-medium text-[#141416]">
              4. Product Images (Main & Gallery)
            </h3>
            <span className="text-[10px] font-mono text-[#71717A]">
              First image is primary thumbnail
            </span>
          </div>

          {/* Current Images List with Reordering & Deletion */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((imgUrl, index) => (
              <div
                key={index}
                className="relative group bg-[#F4F4F6] border border-[#E5E5E8] rounded-lg overflow-hidden flex flex-col"
              >
                <div className="relative aspect-4/3 bg-[#EAEAEF]">
                  <img
                    src={imgUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#141416] text-white text-[9px] font-mono uppercase tracking-wider rounded">
                      Primary
                    </span>
                  )}
                </div>

                <div className="p-2 flex items-center justify-between bg-white border-t border-[#E5E5E8] text-xs">
                  <span className="text-[10px] font-mono text-[#71717A]">
                    #{index + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, 'up')}
                        className="p-1 text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F6] rounded"
                        title="Move Earlier"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveImage(index, 'down')}
                        className="p-1 text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F6] rounded"
                        title="Move Later"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Upload New Box */}
            <label className="aspect-4/3 border-2 border-dashed border-[#DCDCE0] hover:border-[#141416] rounded-lg flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors bg-[#FAFAFC] hover:bg-white">
              <Upload className="w-5 h-5 text-[#71717A] mb-1" />
              <span className="text-xs font-medium text-[#141416]">Upload Image</span>
              <span className="text-[10px] text-[#71717A] mt-0.5">JPG, PNG, WEBP (Max 10MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick-Pick Presets from High-Res Museum Library */}
          <div className="pt-3 border-t border-[#F0F0F2]">
            <span className="text-[11px] font-mono uppercase text-[#71717A] block mb-2">
              Quick Pick from Studio High-Res Scans:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_GALLERY_IMAGES.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPresetImage(preset.url)}
                  className="px-2.5 py-1 text-xs bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] rounded border border-[#DCDCE0] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-[#71717A]" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 text-xs font-mono uppercase text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F6] rounded transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-widest rounded transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : isEditing ? 'Update Artwork' : 'Publish Artwork'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
