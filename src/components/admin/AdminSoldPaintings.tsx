import React from 'react';
import { Painting } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import { CheckCircle2, RotateCcw, ExternalLink, Edit } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminSoldPaintingsProps {
  onSelectTab: (tab: AdminTab) => void;
  onEditProduct: (id: string) => void;
  onViewProductPublic: (painting: Painting) => void;
  onNavigatePublicSold: () => void;
}

export const AdminSoldPaintings: React.FC<AdminSoldPaintingsProps> = ({
  onSelectTab,
  onEditProduct,
  onViewProductPublic,
  onNavigatePublicSold,
}) => {
  const soldPaintings = galleryDatabase.getSoldPaintings();

  const handleReactivate = (id: string) => {
    galleryDatabase.updatePaintingStock(id, 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
              Sold Paintings Archive ({soldPaintings.length})
            </h2>
            <span className="px-2 py-0.5 bg-zinc-200 text-zinc-800 rounded text-[10px] font-mono uppercase font-bold">
              Archived
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-1">
            Pieces where status is SOLD_OUT or inventory stock is 0. These are archived and exhibited under{' '}
            <code className="bg-[#F4F4F6] px-1 py-0.5 rounded font-mono text-[11px]">/paintings/sold</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigatePublicSold}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] text-xs font-mono uppercase tracking-wider rounded border border-[#DCDCE0] transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>View Public Archive</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
        </button>
      </div>

      {/* Grid of Sold Paintings */}
      {soldPaintings.length === 0 ? (
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-12 text-center">
          <CheckCircle2 className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
          <h3 className="text-sm font-medium text-[#141416]">No Artworks Currently Sold Out</h3>
          <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
            When original artworks are acquired through checkout or marked as SOLD_OUT in the admin catalog, they appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {soldPaintings.map((painting) => (
            <div
              key={painting.id}
              className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden flex flex-col grayscale-25 hover:grayscale-0 transition-all"
            >
              <div className="relative aspect-4/3 bg-[#E5E5E8]">
                <img
                  src={painting.image || '/images/hero-painting.jpg'}
                  alt={painting.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 bg-[#141416] text-white text-[10px] font-mono uppercase tracking-wider font-bold rounded shadow-xs">
                  SOLD OUT
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-mono rounded backdrop-blur-xs">
                  {painting.dimensions}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-mono text-[#71717A] uppercase">
                    {painting.category || 'Fine Art'}
                  </div>
                  <h3 className="font-serif font-medium text-base text-[#141416] mt-0.5">
                    {painting.title}
                  </h3>
                  <p className="text-xs text-[#71717A] mt-0.5 line-clamp-1">
                    {painting.medium}
                  </p>
                  <div className="text-sm font-serif font-medium text-[#71717A] mt-2 line-through">
                    {painting.formattedPrice}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F0F2] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleReactivate(painting.id)}
                    className="px-2.5 py-1.5 bg-[#F4F4F6] hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 border border-[#DCDCE0] rounded text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Restock 1 unit and mark Available"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Restock Piece</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewProductPublic(painting)}
                      className="p-1.5 text-[#71717A] hover:text-[#141416] rounded"
                      title="View public page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditProduct(painting.id)}
                      className="p-1.5 text-[#71717A] hover:text-[#141416] rounded"
                      title="Edit painting"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
