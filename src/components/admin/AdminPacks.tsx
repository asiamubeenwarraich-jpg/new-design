import React, { useState } from 'react';
import { Pack, galleryDatabase } from '../../services/galleryDatabase';
import { Package, Plus, Edit, Trash2, ExternalLink, X, Check } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminPacksProps {
  onSelectTab: (tab: AdminTab) => void;
  onNavigatePublicPacks: () => void;
}

export const AdminPacks: React.FC<AdminPacksProps> = ({
  onSelectTab,
  onNavigatePublicPacks,
}) => {
  const packs = galleryDatabase.getPacks();

  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<Pack | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/hero-painting.jpg');
  const [status, setStatus] = useState<'AVAILABLE' | 'SOLD_OUT' | 'DRAFT'>('AVAILABLE');
  const [featured, setFeatured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingPack(null);
    setTitle('');
    setSlug('');
    setPrice('');
    setDescription('');
    setImage('/images/hero-painting.jpg');
    setStatus('AVAILABLE');
    setFeatured(true);
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (p: Pack) => {
    setEditingPack(p);
    setTitle(p.title);
    setSlug(p.slug);
    setPrice(p.price);
    setDescription(p.description || '');
    setImage(p.image || '/images/hero-painting.jpg');
    setStatus(p.status);
    setFeatured(p.featured ?? true);
    setError(null);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Pack Title is required.');
      return;
    }
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      setError('A valid positive price is required.');
      return;
    }

    try {
      if (editingPack) {
        galleryDatabase.updatePack(editingPack.id, {
          title: title.trim(),
          slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: Number(price),
          description,
          image,
          status,
          featured,
        });
      } else {
        galleryDatabase.createPack({
          title: title.trim(),
          slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: Number(price),
          description,
          image,
          status,
          featured,
        });
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save pack.');
    }
  };

  const handleDelete = (id: string, packTitle: string) => {
    if (confirm(`Are you sure you want to delete pack "${packTitle}"?`)) {
      galleryDatabase.deletePack(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
              Artwork Packs & Suites ({packs.length})
            </h2>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-mono uppercase font-bold">
              Packs
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-1">
            Curated suites and miniature collection boxes displayed under{' '}
            <code className="bg-[#F4F4F6] px-1 py-0.5 rounded font-mono text-[11px]">/packs</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onNavigatePublicPacks}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] text-xs font-mono uppercase tracking-wider rounded border border-[#DCDCE0] transition-colors cursor-pointer"
          >
            <span>View Public Packs</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Create Pack</span>
          </button>
        </div>
      </div>

      {/* Grid of Packs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#141416] transition-colors"
          >
            <div className="relative aspect-4/3 bg-[#E5E5E8]">
              <img
                src={pack.image || '/images/hero-painting.jpg'}
                alt={pack.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded shadow-xs ${
                  pack.status === 'AVAILABLE'
                    ? 'bg-emerald-600 text-white'
                    : pack.status === 'SOLD_OUT'
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-200 text-zinc-800'
                }`}
              >
                {pack.status}
              </span>
              {pack.featured && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-mono uppercase rounded">
                  Featured
                </span>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif font-medium text-base text-[#141416]">
                  {pack.title}
                </h3>
                <p className="text-xs text-[#71717A] mt-1 line-clamp-2">
                  {pack.description}
                </p>
                <div className="text-base font-serif font-medium text-[#141416] mt-3">
                  Rs. {pack.price.toLocaleString()}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F0F2] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#71717A]">
                  slug: /{pack.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(pack)}
                    className="px-2.5 py-1 text-xs text-[#141416] bg-[#F4F4F6] hover:bg-[#EAEAEF] rounded flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(pack.id, pack.title)}
                    className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-[#E5E5E8] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E8]">
              <h3 className="text-base font-serif font-medium text-[#141416]">
                {editingPack ? 'Edit Pack Suite' : 'Create New Artwork Pack'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#71717A] hover:text-[#141416]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Pack Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingPack) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Miniature Canvas Art Pack"
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="9000"
                    className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416] focus:outline-none focus:border-[#141416]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416] focus:outline-none focus:border-[#141416]"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="SOLD_OUT">SOLD_OUT</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="miniature-canvas-pack"
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details regarding the pack contents, frames, and packaging..."
                  className="w-full p-2.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#141416] rounded"
                  />
                  <span className="text-xs text-[#141416]">
                    Feature on Homepage Suites section
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F0F2]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-[#71717A] hover:bg-[#F4F4F6] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded"
                >
                  {editingPack ? 'Update' : 'Create'} Pack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
