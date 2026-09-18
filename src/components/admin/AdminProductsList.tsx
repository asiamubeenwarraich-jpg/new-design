import React, { useState, useMemo } from 'react';
import { Painting, PaintingAvailability } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Gift,
  Boxes,
  Palette,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminProductsListProps {
  onSelectTab: (tab: AdminTab) => void;
  onEditProduct: (id: string) => void;
  onViewProductPublic: (painting: Painting) => void;
}

export const AdminProductsList: React.FC<AdminProductsListProps> = ({
  onSelectTab,
  onEditProduct,
  onViewProductPublic,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Deletion modal state
  const [deleteModalPainting, setDeleteModalPainting] = useState<Painting | null>(null);

  // CSV Import Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');
  const [importResult, setImportResult] = useState<{ importedCount: number; errors: string[] } | null>(null);

  // Inline editing state for quick price changes
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Retrieve current database paintings & categories
  const allPaintings = galleryDatabase.getPaintings();
  const categories = galleryDatabase.getCategories();

  // Filtered & Sorted paintings list
  const filteredPaintings = useMemo(() => {
    let list = [...allPaintings];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.artist || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.medium || '').toLowerCase().includes(q) ||
          (p.slug || '').toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      list = list.filter((p) => {
        const st = (p.status || '').toUpperCase();
        if (statusFilter === 'SOLD_OUT') {
          return st === 'SOLD_OUT' || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
        }
        return st === statusFilter;
      });
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      list = list.filter((p) => (p.category || '').toLowerCase() === categoryFilter.toLowerCase());
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return list;
  }, [allPaintings, searchQuery, statusFilter, categoryFilter, sortBy]);

  // Handlers
  const handleQuickStatusChange = (id: string, newStatus: PaintingAvailability) => {
    galleryDatabase.updatePaintingStatus(id, newStatus);
  };

  const handleDuplicate = (id: string) => {
    const copy = galleryDatabase.duplicatePainting(id);
    if (copy) {
      onEditProduct(copy.id);
    }
  };

  const confirmDelete = () => {
    if (deleteModalPainting) {
      galleryDatabase.deletePainting(deleteModalPainting.id, true);
      setDeleteModalPainting(null);
    }
  };

  const handleExportCsv = () => {
    const csvContent = galleryDatabase.exportPaintingsToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `art-gallery-paintings-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCsv = () => {
    if (!importCsvText.trim()) return;
    const res = galleryDatabase.importPaintingsFromCsv(importCsvText);
    setImportResult(res);
    if (res.importedCount > 0 && res.errors.length === 0) {
      setTimeout(() => {
        setShowImportModal(false);
        setImportCsvText('');
        setImportResult(null);
      }, 1500);
    }
  };

  const startEditPrice = (p: Painting) => {
    setEditingPriceId(p.id);
    setTempPrice(p.price);
  };

  const saveEditPrice = (id: string) => {
    if (tempPrice >= 0) {
      galleryDatabase.updatePaintingPrice(id, tempPrice);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Artworks Catalog ({filteredPaintings.length})
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Full control over gallery paintings, inventory stock, pricing, and display status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4F4F6] text-[#141416] text-xs font-mono uppercase tracking-wider rounded border border-[#DCDCE0] transition-colors cursor-pointer"
            title="Download CSV Catalog"
          >
            <Download className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F4F4F6] text-[#141416] text-xs font-mono uppercase tracking-wider rounded border border-[#DCDCE0] transition-colors cursor-pointer"
            title="Import Paintings via CSV"
          >
            <Upload className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Import CSV</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('product-new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Painting</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by painting title, artist, category, slug..."
              className="w-full pl-9 pr-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] placeholder-[#999999] focus:outline-none focus:border-[#141416] focus:bg-white transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#141416]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416] font-sans cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              <option value="NEW">Status: NEW</option>
              <option value="AVAILABLE">Status: AVAILABLE</option>
              <option value="SOLD_OUT">Status: SOLD OUT</option>
              <option value="DRAFT">Status: DRAFT</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-44">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416] font-sans cursor-pointer"
            >
              <option value="ALL">Category: All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full md:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416] font-sans cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table (Desktop) / Cards (Mobile) */}
      {filteredPaintings.length === 0 ? (
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-12 text-center">
          <Palette className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
          <h3 className="text-sm font-medium text-[#141416]">No Artworks Found</h3>
          <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
            No paintings match the current search or filter criteria. Try clearing filters or adding a new painting.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setCategoryFilter('ALL');
            }}
            className="mt-4 px-3 py-1.5 text-xs font-mono uppercase bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] rounded border border-[#DCDCE0]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden shadow-2xs">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9F9FB] border-b border-[#E5E5E8] text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
                <tr>
                  <th className="py-3 px-4">Artwork</th>
                  <th className="py-3 px-4">Category / Style</th>
                  <th className="py-3 px-4">Price (PKR)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E8]">
                {filteredPaintings.map((painting) => {
                  const isSold =
                    painting.status === 'sold_out' ||
                    painting.status === 'SOLD_OUT' ||
                    (painting.stockQuantity !== undefined && painting.stockQuantity <= 0);

                  return (
                    <tr key={painting.id} className="hover:bg-[#FDFDFE] transition-colors">
                      {/* Artwork Thumbnail & Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={painting.image || '/images/hero-painting.jpg'}
                            alt={painting.title}
                            className="w-12 h-12 object-cover rounded bg-[#E5E5E8] shrink-0 border border-[#E5E5E8]"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-[#141416] truncate max-w-xs flex items-center gap-1.5">
                              <span className="truncate">{painting.title}</span>
                              {painting.isGift && (
                                <span
                                  className="text-[9px] px-1 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 rounded font-mono"
                                  title="Designated as Curated Gift"
                                >
                                  GIFT
                                </span>
                              )}
                              {painting.featured && (
                                <span
                                  className="text-[9px] px-1 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded font-mono"
                                  title="Featured on Homepage"
                                >
                                  FEAT
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#71717A] truncate max-w-xs mt-0.5">
                              {painting.artist} • {painting.dimensions}
                            </div>
                            <div className="text-[10px] font-mono text-[#A1A1AA] truncate max-w-xs">
                              slug: /{painting.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Medium */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-[#F4F4F6] text-[#141416] rounded font-medium text-[11px]">
                          {painting.category || 'Calligraphy'}
                        </span>
                        <div className="text-[10px] text-[#71717A] mt-1 truncate max-w-[160px]">
                          {painting.medium}
                        </div>
                      </td>

                      {/* Price (with quick edit) */}
                      <td className="py-3 px-4 font-mono">
                        {editingPriceId === painting.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-24 px-2 py-1 bg-white border border-[#141416] rounded text-xs font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => saveEditPrice(painting.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditPrice(painting)}
                            className="cursor-pointer group flex items-center gap-1.5"
                            title="Click to quickly edit price"
                          >
                            <span className="text-sm font-medium text-[#141416] group-hover:underline">
                              {painting.formattedPrice}
                            </span>
                            <Edit className="w-3 h-3 text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        {painting.originalPrice && painting.originalPrice > painting.price && (
                          <span className="text-[10px] text-[#A1A1AA] line-through block">
                            Rs. {painting.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3 px-4 font-mono text-xs">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold ${
                            (painting.stockQuantity ?? 1) <= 0
                              ? 'bg-red-50 text-red-700'
                              : (painting.stockQuantity ?? 1) === 1
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {painting.stockQuantity ?? (isSold ? 0 : 1)} in stock
                        </span>
                        <div className="text-[10px] text-[#71717A] mt-0.5">
                          {painting.artworkType || 'ORIGINAL'}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4">
                        <select
                          value={isSold ? 'SOLD_OUT' : painting.status}
                          onChange={(e) =>
                            handleQuickStatusChange(painting.id, e.target.value as PaintingAvailability)
                          }
                          className={`px-2 py-1 text-[11px] font-mono rounded border uppercase cursor-pointer ${
                            isSold
                              ? 'bg-zinc-100 text-zinc-700 border-zinc-300'
                              : painting.status === 'NEW'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                              : painting.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="SOLD_OUT">SOLD OUT</option>
                          <option value="DRAFT">DRAFT</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onViewProductPublic(painting)}
                            className="p-1.5 text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F6] rounded transition-colors"
                            title="View on Public Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditProduct(painting.id)}
                            className="p-1.5 text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F6] rounded transition-colors"
                            title="Edit Painting"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(painting.id)}
                            className="p-1.5 text-[#71717A] hover:text-[#141416] hover:bg-[#F4F4F6] rounded transition-colors"
                            title="Duplicate Painting"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteModalPainting(painting)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete Painting"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (Below lg breakpoint) */}
          <div className="lg:hidden divide-y divide-[#E5E5E8]">
            {filteredPaintings.map((painting) => {
              const isSold =
                painting.status === 'sold_out' ||
                painting.status === 'SOLD_OUT' ||
                (painting.stockQuantity !== undefined && painting.stockQuantity <= 0);

              return (
                <div key={painting.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={painting.image || '/images/hero-painting.jpg'}
                      alt={painting.title}
                      className="w-16 h-16 object-cover rounded bg-[#E5E5E8] shrink-0 border border-[#E5E5E8]"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-[#141416] truncate">
                        {painting.title}
                      </div>
                      <div className="text-xs text-[#71717A]">
                        {painting.artist} • {painting.dimensions}
                      </div>
                      <div className="text-sm font-serif font-medium text-[#141416] mt-1">
                        {painting.formattedPrice}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#F4F4F6] text-[#141416] rounded text-[11px]">
                        {painting.category || 'Calligraphy'}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                          isSold
                            ? 'bg-zinc-100 text-zinc-700'
                            : painting.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isSold ? 'SOLD' : painting.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#71717A]">
                      Stock: {painting.stockQuantity ?? (isSold ? 0 : 1)}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0F0F2]">
                    <button
                      type="button"
                      onClick={() => onViewProductPublic(painting)}
                      className="px-2.5 py-1 text-xs text-[#555555] hover:text-[#141416] bg-[#F4F4F6] rounded flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProduct(painting.id)}
                      className="px-2.5 py-1 text-xs text-[#141416] bg-[#F4F4F6] hover:bg-[#EAEAEF] rounded flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(painting.id)}
                      className="px-2.5 py-1 text-xs text-[#555555] bg-[#F4F4F6] rounded"
                      title="Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModalPainting(painting)}
                      className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalPainting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-[#E5E5E8] shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-serif font-medium text-[#141416]">
                Confirm Artwork Deletion
              </h3>
            </div>

            <p className="text-xs text-[#555555] leading-relaxed">
              Are you sure you want to delete <strong className="text-[#141416]">"{deleteModalPainting.title}"</strong>?
              This piece will be archived and removed from public discovery. Historical customer order snapshots and invoices will remain intact.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalPainting(null)}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#555555] hover:bg-[#F4F4F6] rounded border border-[#DCDCE0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 border border-[#E5E5E8] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-medium text-[#141416]">
                Import Artworks from CSV
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportResult(null);
                }}
                className="text-[#71717A] hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#555555]">
              Paste CSV text containing: <code className="bg-[#F4F4F6] px-1 py-0.5 rounded text-[10px]">id,title,artist,price,status,stockQuantity,category,medium,dimensions,year,isGift,featured</code>
            </p>

            <textarea
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              rows={6}
              placeholder="Paste raw CSV lines here..."
              className="w-full p-2.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416] focus:outline-none focus:border-[#141416]"
            />

            {importResult && (
              <div
                className={`p-3 rounded text-xs ${
                  importResult.errors.length > 0 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                }`}
              >
                <div>Imported {importResult.importedCount} artwork(s) successfully.</div>
                {importResult.errors.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-[11px] text-red-700">
                    {importResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs font-mono uppercase text-[#555555] hover:bg-[#F4F4F6] rounded border border-[#DCDCE0]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                disabled={!importCsvText.trim()}
                className="px-4 py-2 text-xs font-mono uppercase bg-[#141416] hover:bg-black text-white rounded disabled:opacity-50"
              >
                Process CSV Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
