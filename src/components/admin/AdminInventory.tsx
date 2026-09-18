import React, { useState } from 'react';
import { Painting } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import { Boxes, AlertTriangle, Check, Search, Plus, Minus } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'LOW' | 'OUT' | 'IN'>('ALL');
  const paintings = galleryDatabase.getPaintings();
  const settings = galleryDatabase.getStoreSettings();
  const threshold = settings.lowStockThreshold ?? 1;

  const handleStockChange = (id: string, newStock: number) => {
    if (newStock < 0) return;
    galleryDatabase.updatePaintingStock(id, newStock);
  };

  const filtered = paintings.filter((p) => {
    const stock = p.stockQuantity ?? (p.status === 'sold_out' || p.status === 'SOLD_OUT' ? 0 : 1);
    const matchSearch =
      !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.artist.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (filter === 'OUT') return stock <= 0;
    if (filter === 'LOW') return stock > 0 && stock <= threshold;
    if (filter === 'IN') return stock > threshold;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
              Inventory & Physical Stock ({paintings.length})
            </h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-mono uppercase font-bold">
              Real-time
            </span>
          </div>
          <p className="text-xs text-[#71717A] mt-1">
            Setting stock to 0 automatically marks an artwork as SOLD_OUT. Increasing stock above 0 reactivates it to AVAILABLE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white border border-[#E5E5E8] rounded text-xs font-mono text-[#71717A]">
            Low Stock Threshold: <strong className="text-[#141416]">≤ {threshold} unit</strong>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by title, artist, or style..."
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3 py-2 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-[#141416] text-white'
                : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#141416]'
            }`}
          >
            All ({paintings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('LOW')}
            className={`px-3 py-2 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'LOW'
                ? 'bg-amber-600 text-white'
                : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#141416]'
            }`}
          >
            Low Stock
          </button>
          <button
            type="button"
            onClick={() => setFilter('OUT')}
            className={`px-3 py-2 rounded text-xs font-mono uppercase transition-colors cursor-pointer ${
              filter === 'OUT'
                ? 'bg-red-600 text-white'
                : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#141416]'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-[#E5E5E8] rounded-lg overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9F9FB] border-b border-[#E5E5E8] text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
              <tr>
                <th className="py-3 px-4">Artwork</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Stock Quantity</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E8]">
              {filtered.map((painting) => {
                const stock = painting.stockQuantity ?? (painting.status === 'sold_out' || painting.status === 'SOLD_OUT' ? 0 : 1);
                const isOut = stock <= 0;
                const isLow = stock > 0 && stock <= threshold;

                return (
                  <tr key={painting.id} className="hover:bg-[#FDFDFE]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={painting.image || '/images/hero-painting.jpg'}
                          alt={painting.title}
                          className="w-10 h-10 object-cover rounded bg-[#E5E5E8] shrink-0 border border-[#E5E5E8]"
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-[#141416] truncate">
                            {painting.title}
                          </div>
                          <div className="text-[11px] text-[#71717A]">
                            {painting.dimensions}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#555555]">
                      {painting.artworkType || 'ORIGINAL'}
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-[#141416]">
                      {painting.formattedPrice}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          isOut
                            ? 'bg-zinc-100 text-zinc-700'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOut ? 'SOLD OUT' : isLow ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-mono">
                      <span className="text-sm font-bold text-[#141416]">{stock}</span>
                      <span className="text-[10px] text-[#71717A] block">units</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStockChange(painting.id, stock - 1)}
                          disabled={stock <= 0}
                          className="w-7 h-7 bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] rounded flex items-center justify-center disabled:opacity-30 cursor-pointer"
                          title="Decrease stock by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(painting.id, stock + 1)}
                          className="w-7 h-7 bg-[#F4F4F6] hover:bg-[#EAEAEF] text-[#141416] rounded flex items-center justify-center cursor-pointer"
                          title="Increase stock by 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
