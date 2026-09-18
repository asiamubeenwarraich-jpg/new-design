import React from 'react';
import { Painting, PaintingAvailability } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import { Sparkles, Plus, ExternalLink, Edit, CheckCircle } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

export interface AdminNewPaintingsProps {
  onSelectTab: (tab: AdminTab) => void;
  onEditProduct: (id: string) => void;
  onViewProductPublic: (painting: Painting) => void;
}

export const AdminNewPaintings: React.FC<AdminNewPaintingsProps> = ({
  onSelectTab,
  onEditProduct,
  onViewProductPublic,
}) => {
  const newPaintings = galleryDatabase.getNewPaintings();

  const handleStatusChange = (id: string, newStatus: PaintingAvailability) => {
    galleryDatabase.updatePaintingStatus(id, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
              New Paintings ({newPaintings.length})
            </h2>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded text-[10px] font-mono uppercase font-bold">
              Status = NEW
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-1">
            Artworks displayed live under <code className="bg-[#F4F4F6] px-1 py-0.5 rounded font-mono text-[11px]">/paintings/new</code>.
            When status is updated to AVAILABLE or SOLD_OUT, the item automatically updates across the public site.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('product-new')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add New Painting</span>
        </button>
      </div>

      {/* Grid of New Paintings */}
      {newPaintings.length === 0 ? (
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-12 text-center">
          <Sparkles className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
          <h3 className="text-sm font-medium text-[#141416]">No Paintings Marked as NEW</h3>
          <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
            To make an artwork appear here and on the public New Paintings page, set its status to "NEW" in the product catalog.
          </p>
          <button
            type="button"
            onClick={() => onSelectTab('products')}
            className="mt-4 px-3 py-1.5 text-xs font-mono uppercase bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] rounded border border-[#DCDCE0]"
          >
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newPaintings.map((painting) => (
            <div
              key={painting.id}
              className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden flex flex-col hover:border-[#141416] transition-colors"
            >
              <div className="relative aspect-4/3 bg-[#E5E5E8]">
                <img
                  src={painting.image || '/images/hero-painting.jpg'}
                  alt={painting.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-mono uppercase font-bold rounded shadow-xs">
                  NEW
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#141416]/80 text-white text-[10px] font-mono rounded backdrop-blur-xs">
                  {painting.dimensions}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-mono text-[#71717A] uppercase">
                    {painting.category || 'Calligraphy'}
                  </div>
                  <h3 className="font-serif font-medium text-base text-[#141416] mt-0.5">
                    {painting.title}
                  </h3>
                  <p className="text-xs text-[#71717A] mt-0.5 line-clamp-1">
                    {painting.medium}
                  </p>
                  <div className="text-base font-serif font-medium text-[#141416] mt-2">
                    {painting.formattedPrice}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0F0F2] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[#71717A]">Quick Status:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(painting.id, 'AVAILABLE')}
                        className="px-2 py-0.5 bg-[#F4F4F6] hover:bg-emerald-50 text-emerald-700 rounded text-[11px] font-mono transition-colors"
                        title="Move to standard Available catalog"
                      >
                        → Available
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(painting.id, 'SOLD_OUT')}
                        className="px-2 py-0.5 bg-[#F4F4F6] hover:bg-zinc-200 text-zinc-700 rounded text-[11px] font-mono transition-colors"
                        title="Mark as Sold Out"
                      >
                        → Sold Out
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onViewProductPublic(painting)}
                      className="text-xs text-[#71717A] hover:text-[#141416] flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Public</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditProduct(painting.id)}
                      className="px-3 py-1 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
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
