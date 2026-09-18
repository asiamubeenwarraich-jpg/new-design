import React, { useState } from 'react';
import { Painting } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import { Gift, ExternalLink, Check, Plus, Search } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminGiftsProps {
  onSelectTab: (tab: AdminTab) => void;
  onViewProductPublic: (painting: Painting) => void;
  onNavigatePublicGifts: () => void;
}

export const AdminGifts: React.FC<AdminGiftsProps> = ({
  onSelectTab,
  onViewProductPublic,
  onNavigatePublicGifts,
}) => {
  const [search, setSearch] = useState('');
  const allPaintings = galleryDatabase.getPaintings();

  const handleToggleGift = (id: string, currentVal: boolean | undefined) => {
    galleryDatabase.updatePainting(id, { isGift: !currentVal });
  };

  const giftPaintings = allPaintings.filter((p) => p.isGift);
  const otherPaintings = allPaintings.filter(
    (p) =>
      !p.isGift &&
      (search.trim()
        ? p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase())
        : true)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
              Curated Gifts Collection ({giftPaintings.length})
            </h2>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-[10px] font-mono uppercase font-bold">
              Gifts
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-1">
            Artworks designated for corporate and executive gifting under{' '}
            <code className="bg-[#F4F4F6] px-1 py-0.5 rounded font-mono text-[11px]">/paintings/gift</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigatePublicGifts}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] text-xs font-mono uppercase tracking-wider rounded border border-[#DCDCE0] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>View Public Gifts Page</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
        </button>
      </div>

      {/* Currently Active Gifts Grid */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-serif font-medium text-[#141416] pb-2 border-b border-[#E5E5E8]">
          Active Curated Gift Artworks ({giftPaintings.length})
        </h3>

        {giftPaintings.length === 0 ? (
          <p className="text-xs text-[#71717A] py-6 text-center">
            No paintings currently flagged as gifts. Use the catalog below to add artworks to the gifts showcase.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {giftPaintings.map((painting) => (
              <div
                key={painting.id}
                className="p-3 border border-[#E5E5E8] rounded-lg flex items-center justify-between gap-3 hover:border-[#141416] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={painting.image || '/images/hero-painting.jpg'}
                    alt={painting.title}
                    className="w-12 h-12 object-cover rounded bg-[#E5E5E8] shrink-0 border border-[#E5E5E8]"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#141416] truncate">
                      {painting.title}
                    </div>
                    <div className="text-[11px] text-[#71717A] font-serif">
                      {painting.formattedPrice}
                    </div>
                    <div className="text-[10px] text-purple-700 font-mono">
                      Gift Active
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleGift(painting.id, painting.isGift)}
                  className="px-2 py-1 text-[11px] font-mono bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors shrink-0"
                  title="Remove from Gifts"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add More Artworks to Gifts Section */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E5E8]">
          <h3 className="text-sm font-serif font-medium text-[#141416]">
            Add Artworks to Curated Gifts
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search catalog to add..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {otherPaintings.slice(0, 9).map((painting) => (
            <div
              key={painting.id}
              className="p-3 border border-[#E5E5E8] rounded-lg flex items-center justify-between gap-3 hover:bg-[#F9F9FB] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={painting.image || '/images/hero-painting.jpg'}
                  alt={painting.title}
                  className="w-10 h-10 object-cover rounded bg-[#E5E5E8] shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-[#141416] truncate">
                    {painting.title}
                  </div>
                  <div className="text-[11px] text-[#71717A]">
                    {painting.formattedPrice}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggleGift(painting.id, painting.isGift)}
                className="px-2.5 py-1 text-xs font-mono bg-[#141416] hover:bg-black text-white rounded flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
