import React, { useState } from 'react';
import { Category, galleryDatabase } from '../../services/galleryDatabase';
import { FolderTree, Plus, Edit, Trash2, Check, X, AlertCircle } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const categories = galleryDatabase.getCategories();
  const paintings = galleryDatabase.getPaintings();

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/hero-painting.jpg');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('/images/hero-painting.jpg');
    setStatus('ACTIVE');
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '/images/hero-painting.jpg');
    setStatus(cat.status);
    setError(null);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        galleryDatabase.updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          image,
          status,
        });
      } else {
        galleryDatabase.createCategory({
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          image,
          status,
        });
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save category.');
    }
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      galleryDatabase.deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Artwork Categories ({categories.length})
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Organize art catalog disciplines, genres, and collections.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = paintings.filter(
            (p) => (p.category || '').toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white border border-[#E5E5E8] rounded-lg p-5 flex flex-col justify-between space-y-3 hover:border-[#141416] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      cat.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {cat.status}
                  </span>
                  <span className="text-xs font-mono text-[#71717A]">
                    {count} Painting(s)
                  </span>
                </div>

                <h3 className="font-serif font-medium text-lg text-[#141416] mt-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#71717A] mt-1 line-clamp-2">
                  {cat.description || 'Curated artistic category in the gallery collection.'}
                </p>
                <div className="text-[10px] font-mono text-[#A1A1AA] mt-2">
                  slug: /{cat.slug}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F0F2] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="px-2.5 py-1 text-xs text-[#141416] bg-[#F4F4F6] hover:bg-[#EAEAEF] rounded flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-2.5 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-[#E5E5E8] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E8]">
              <h3 className="text-base font-serif font-medium text-[#141416]">
                {editingCategory ? 'Edit Category' : 'New Artwork Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="e.g. Calligraphy, Landscape"
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="calligraphy"
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
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
                  placeholder="Curatorial definition of this artwork style..."
                  className="w-full p-2.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] font-mono focus:outline-none focus:border-[#141416]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
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
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
