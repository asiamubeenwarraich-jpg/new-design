import React, { useState } from 'react';
import { StoreSettings, galleryDatabase } from '../../services/galleryDatabase';
import { Save, Check, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const currentSettings = galleryDatabase.getStoreSettings();

  const [storeName, setStoreName] = useState(currentSettings.storeName);
  const [storeEmail, setStoreEmail] = useState(currentSettings.storeEmail);
  const [currency, setCurrency] = useState(currentSettings.currency);
  const [lowStockThreshold, setLowStockThreshold] = useState(currentSettings.lowStockThreshold);
  const [enableCod, setEnableCod] = useState(currentSettings.enableCod);
  const [enableCardPayments, setEnableCardPayments] = useState(currentSettings.enableCardPayments);
  const [bankTransferDetails, setBankTransferDetails] = useState(currentSettings.bankTransferDetails || '');

  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    galleryDatabase.updateStoreSettings({
      storeName,
      storeEmail,
      currency,
      lowStockThreshold: Number(lowStockThreshold),
      enableCod,
      enableCardPayments,
      bankTransferDetails,
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleResetCatalog = () => {
    if (confirm('CAUTION: Reset catalog to initial gallery inventory and clear local modifications?')) {
      galleryDatabase.resetToSeedData();
      alert('Gallery database has been reset to original catalog.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif text-[#141416] tracking-tight">
          Gallery & Store Settings
        </h2>
        <p className="text-xs text-[#71717A] mt-0.5">
          Global gallery configuration, courier rates, payment options, and studio parameters.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Gallery store configuration saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Store Details */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-serif font-medium text-[#141416] pb-2 border-b border-[#E5E5E8]">
            1. Gallery Store Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                Store Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                Store Administrator Email
              </label>
              <input
                type="email"
                required
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                Default Currency Code
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min={0}
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416] focus:outline-none focus:border-[#141416]"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways & Checkout */}
        <div className="bg-white border border-[#E5E5E8] rounded-lg p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-serif font-medium text-[#141416] pb-2 border-b border-[#E5E5E8]">
            2. Payment Options & Settlement
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-[#F9F9FB] border border-[#DCDCE0] rounded cursor-pointer">
              <input
                type="checkbox"
                checked={enableCod}
                onChange={(e) => setEnableCod(e.target.checked)}
                className="w-4 h-4 text-[#141416] rounded"
              />
              <div>
                <span className="text-xs font-medium text-[#141416] block">
                  Enable Cash on Delivery (COD)
                </span>
                <span className="text-[11px] text-[#71717A]">
                  Allow clients in Pakistan to pay upon physical delivery of artworks.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-[#F9F9FB] border border-[#DCDCE0] rounded cursor-pointer">
              <input
                type="checkbox"
                checked={enableCardPayments}
                onChange={(e) => setEnableCardPayments(e.target.checked)}
                className="w-4 h-4 text-[#141416] rounded"
              />
              <div>
                <span className="text-xs font-medium text-[#141416] block">
                  Enable Online Credit Card & Bank Transfers
                </span>
                <span className="text-[11px] text-[#71717A]">
                  Accept direct Visa, Mastercard, and bank wire transfers.
                </span>
              </div>
            </label>

            <div>
              <label className="block text-xs font-mono uppercase text-[#555555] mb-1">
                Studio Bank Wire & Settlement Account
              </label>
              <textarea
                rows={2}
                value={bankTransferDetails}
                onChange={(e) => setBankTransferDetails(e.target.value)}
                placeholder="Bank Name: Standard Chartered / Meezan Bank&#10;Account Title: Art Gallery Studio&#10;IBAN: PK36SCBL0000001234567801"
                className="w-full p-2.5 bg-[#F9F9FB] border border-[#DCDCE0] rounded text-xs font-mono text-[#141416]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetCatalog}
            className="text-xs font-mono uppercase text-red-600 hover:text-red-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Database to Factory Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
