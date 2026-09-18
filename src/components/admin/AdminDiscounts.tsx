import React, { useState } from 'react';
import { Discount, galleryDatabase } from '../../services/galleryDatabase';
import { Tag, Plus, Trash2, X, Check } from 'lucide-react';

export const AdminDiscounts: React.FC = () => {
  const discounts = galleryDatabase.getDiscounts();

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [value, setValue] = useState<number | ''>('');
  const [minOrder, setMinOrder] = useState<number | ''>(0);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Discount code string is required.');
      return;
    }
    if (value === '' || isNaN(Number(value)) || Number(value) <= 0) {
      setError('A valid positive discount value is required.');
      return;
    }

    try {
      galleryDatabase.createDiscount({
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrder: Number(minOrder) || 0,
        active: true,
      });
      setShowModal(false);
      setCode('');
      setValue('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create discount.');
    }
  };

  const handleDelete = (id: string, discountCode: string) => {
    if (confirm(`Remove discount code "${discountCode}"?`)) {
      galleryDatabase.deleteDiscount(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
            Discount & Promotional Codes ({discounts.length})
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Active coupon vouchers redeemed during checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Create Code</span>
        </button>
      </div>

      {/* Grid of Discounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((disc) => (
          <div
            key={disc.id}
            className="bg-white border border-[#E5E5E8] rounded-lg p-5 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                    disc.active
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {disc.active ? 'ACTIVE' : 'INACTIVE'}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(disc.id, disc.code)}
                  className="text-red-500 hover:text-red-700 p-1 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="font-mono text-base font-bold text-[#141416] tracking-wider mt-2">
                {disc.code}
              </div>

              <div className="text-sm font-medium text-emerald-700 mt-1">
                {disc.type === 'PERCENTAGE' ? `${disc.value}% OFF` : `Rs. ${disc.value.toLocaleString()} OFF`}
              </div>

              <div className="text-[11px] text-[#71717A] mt-1">
                Min. Order:{' '}
                {disc.minOrder ? `Rs. ${disc.minOrder.toLocaleString()}` : 'No minimum'}
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0F0F2] text-[10px] font-mono text-[#A1A1AA]">
              Usages logged: {disc.usedCount || 0} times
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 border border-[#E5E5E8] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E5E8]">
              <h3 className="text-base font-serif font-medium text-[#141416]">
                New Promotional Code
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#71717A] hover:text-[#141416] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Code String *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. RAMADAN2026"
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416] focus:outline-none focus:border-[#141416]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (PKR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={value}
                    onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={type === 'PERCENTAGE' ? '15' : '3000'}
                    className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                  Minimum Order (PKR)
                </label>
                <input
                  type="number"
                  min={0}
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F0F2]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-[#71717A] hover:bg-[#F4F4F6] rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded cursor-pointer"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
