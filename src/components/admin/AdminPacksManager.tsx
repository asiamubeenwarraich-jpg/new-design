import React, { useState, useEffect } from 'react';
import { Pack, galleryDatabase } from '../../services/galleryDatabase';
import { Plus, Edit2, Trash2, Eye, Check, X, Package, AlertCircle, ArrowLeft } from 'lucide-react';

export interface AdminPacksManagerProps {
  initialMode?: 'list' | 'new';
  onViewPackPublic?: (slug: string) => void;
  onNavigateBack?: () => void;
}

export const AdminPacksManager: React.FC<AdminPacksManagerProps> = ({
  initialMode = 'list',
  onViewPackPublic,
  onNavigateBack,
}) => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [mode, setMode] = useState<'list' | 'new' | 'edit'>(initialMode);
  const [editingPackId, setEditingPackId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(5000);
  const [formImage, setFormImage] = useState('/images/hero-painting.jpg');
  const [formStatus, setFormStatus] = useState<'AVAILABLE' | 'SOLD_OUT' | 'DRAFT'>('AVAILABLE');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadPacks = () => {
    setPacks(galleryDatabase.getPacks());
  };

  useEffect(() => {
    loadPacks();
    const unsub = galleryDatabase.subscribe(() => {
      loadPacks();
    });
    return unsub;
  }, []);

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormPrice(5000);
    setFormImage('/images/hero-painting.jpg');
    setFormStatus('AVAILABLE');
    setEditingPackId(null);
  };

  const handleStartNew = () => {
    resetForm();
    setMode('new');
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin/packs/new') {
      window.history.pushState(null, '', '/admin/packs/new');
    }
  };

  const handleStartEdit = (pack: Pack) => {
    setEditingPackId(pack.id);
    setFormTitle(pack.title);
    setFormDescription(pack.description || '');
    setFormPrice(pack.price);
    setFormImage(pack.image || '/images/hero-painting.jpg');
    setFormStatus(pack.status);
    setMode('edit');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setStatusMessage('Pack Name is required.');
      return;
    }

    if (mode === 'new') {
      galleryDatabase.createPack({
        title: formTitle.trim(),
        description: formDescription.trim(),
        price: Number(formPrice),
        image: formImage.trim() || '/images/hero-painting.jpg',
        status: formStatus,
      });
      setStatusMessage(`New pack "${formTitle}" created successfully.`);
    } else if (mode === 'edit' && editingPackId) {
      galleryDatabase.updatePack(editingPackId, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        price: Number(formPrice),
        image: formImage.trim(),
        status: formStatus,
      });
      setStatusMessage(`Pack "${formTitle}" updated successfully.`);
    }

    resetForm();
    setMode('list');
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin/packs') {
      window.history.pushState(null, '', '/admin/packs');
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete pack "${title}"?`)) {
      galleryDatabase.deletePack(id);
      setStatusMessage(`Pack "${title}" deleted.`);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div id="admin-packs-manager" className="bg-white text-[#141416] p-4 sm:p-6 rounded-xs">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E8] mb-6">
        <div className="flex items-center gap-3">
          {onNavigateBack && (
            <button
              type="button"
              onClick={onNavigateBack}
              className="p-1.5 hover:bg-[#F0F0F2] text-[#707073] hover:text-[#141416] transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#8C6D3B]" />
              <h2 className="text-lg sm:text-xl font-semibold tracking-wider uppercase text-[#141416]">
                PACKS MANAGEMENT
              </h2>
            </div>
            <p className="text-xs text-[#707073] mt-0.5">
              Manage artwork bundles and gift packs for the <code className="bg-[#F0F0F2] px-1 py-0.5 text-black">/packs</code> public route.
            </p>
          </div>
        </div>

        {mode === 'list' ? (
          <button
            id="btn-add-new-pack"
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#141416] text-white hover:bg-black text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ ADD NEW PACK</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setMode('list');
              if (typeof window !== 'undefined' && window.location.pathname !== '/admin/packs') {
                window.history.pushState(null, '', '/admin/packs');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F0F2] hover:bg-[#E5E5E8] text-[#141416] text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Packs List</span>
          </button>
        )}
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
          <span>{statusMessage}</span>
          <button type="button" onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      )}

      {/* Form View (New / Edit) */}
      {(mode === 'new' || mode === 'edit') && (
        <div className="max-w-2xl bg-[#FBFBFC] border border-[#E5E5E8] p-6 sm:p-8 mb-8">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-[#141416] mb-4 pb-2 border-b border-[#E5E5E8]">
            {mode === 'new' ? 'CREATE NEW ART PACK (/admin/packs/new)' : 'EDIT ART PACK'}
          </h3>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[#4A4A4D] mb-1">
                Pack Name *
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Art Gift Pack (3 Mini Paintings)"
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D4] focus:border-[#141416] outline-none text-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[#4A4A4D] mb-1">
                Description
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
                placeholder="Details of what is enclosed in this bundle..."
                className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D4] focus:border-[#141416] outline-none text-[#141416]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#4A4A4D] mb-1">
                  Price (PKR) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D4] focus:border-[#141416] outline-none text-[#141416] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-[#4A4A4D] mb-1">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D4] focus:border-[#141416] outline-none text-[#141416]"
                >
                  <option value="AVAILABLE">AVAILABLE (Shown in /packs)</option>
                  <option value="SOLD_OUT">SOLD_OUT (Marked sold)</option>
                  <option value="DRAFT">DRAFT (Hidden from /packs)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-[#4A4A4D] mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                placeholder="/images/hero-painting.jpg or external https link"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D0D0D4] focus:border-[#141416] outline-none text-[#141416]"
              />
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={formImage || '/images/hero-painting.jpg'}
                  alt="Pack preview"
                  className="w-16 h-12 object-cover border border-[#D0D0D4] bg-[#EAEAEB]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/hero-painting.jpg';
                  }}
                />
                <span className="text-[11px] text-[#707073]">Thumbnail image preview</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              >
                {mode === 'new' ? 'SAVE NEW PACK' : 'UPDATE PACK'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setMode('list');
                }}
                className="px-4 py-2.5 bg-[#F0F0F2] hover:bg-[#E5E5E8] text-[#4A4A4D] text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table / List View as explicitly specified:
          IMAGE | PACK NAME | PRICE | STATUS | CREATED | ACTIONS
          Actions: EDIT | DELETE | VIEW
      */}
      <div className="overflow-x-auto border border-[#E5E5E8]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F7F7F8] border-b border-[#E5E5E8] text-[#4A4A4D] uppercase tracking-wider font-semibold">
              <th className="py-3 px-3 w-16">IMAGE</th>
              <th className="py-3 px-4">PACK NAME</th>
              <th className="py-3 px-4">PRICE</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 hidden md:table-cell">CREATED</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E8] text-[#141416]">
            {packs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#707073]">
                  No packs created yet. Click "+ ADD NEW PACK" above.
                </td>
              </tr>
            ) : (
              packs.map((pack) => {
                const createdDate = pack.createdAt ? new Date(pack.createdAt).toLocaleDateString() : 'N/A';
                return (
                  <tr key={pack.id} className="hover:bg-[#FAFAFB] transition-colors">
                    {/* IMAGE */}
                    <td className="py-3 px-3">
                      <img
                        src={pack.image || '/images/hero-painting.jpg'}
                        alt={pack.title}
                        className="w-12 h-10 object-cover border border-[#E5E5E8] bg-[#EAEAEB]"
                      />
                    </td>

                    {/* PACK NAME */}
                    <td className="py-3 px-4 font-medium text-[#141416]">
                      <div className="font-semibold">{pack.title}</div>
                      <div className="text-[11px] text-[#707073] line-clamp-1 mt-0.5">{pack.description}</div>
                    </td>

                    {/* PRICE */}
                    <td className="py-3 px-4 font-mono font-semibold whitespace-nowrap">
                      Rs. {pack.price.toLocaleString()}
                    </td>

                    {/* STATUS */}
                    <td className="py-3 px-4">
                      {pack.status === 'AVAILABLE' && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wider uppercase">
                          AVAILABLE
                        </span>
                      )}
                      {pack.status === 'SOLD_OUT' && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-800 tracking-wider uppercase">
                          SOLD_OUT
                        </span>
                      )}
                      {pack.status === 'DRAFT' && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-gray-200 text-gray-800 tracking-wider uppercase">
                          DRAFT
                        </span>
                      )}
                    </td>

                    {/* CREATED */}
                    <td className="py-3 px-4 text-[#707073] hidden md:table-cell whitespace-nowrap">
                      {createdDate}
                    </td>

                    {/* ACTIONS: EDIT | DELETE | VIEW */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(pack)}
                          className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-[#F0F0F2] hover:bg-[#141416] hover:text-white transition-colors cursor-pointer"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(pack.id, pack.title)}
                          className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-red-50 text-red-700 hover:bg-red-700 hover:text-white transition-colors cursor-pointer"
                        >
                          DELETE
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewPackPublic) {
                              onViewPackPublic(pack.slug);
                            } else {
                              window.location.href = '/packs';
                            }
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-[#F0F0F2] hover:bg-[#8C6D3B] hover:text-white transition-colors cursor-pointer"
                        >
                          VIEW
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
