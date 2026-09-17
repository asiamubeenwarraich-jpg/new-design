import React, { useState } from 'react';
import { Truck, RotateCcw, Lock } from 'lucide-react';
import { Painting } from '../../data/paintings';

export interface PaintingTabsProps {
  painting: Painting;
}

export const PaintingTabs: React.FC<PaintingTabsProps> = ({ painting }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');

  const displaySize = painting.size || painting.dimensions || '36 × 48 inches';
  const displayStyle = painting.style || painting.category || 'Contemporary Fine Art';
  const displayYear = String(painting.year || '2026');
  const displayFrame = painting.frame || 'Unframed';
  const displayType = painting.type || '100% Original Artwork';

  return (
    <div id="painting-tabs-section" className="w-full flex flex-col space-y-6 pt-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#E5E5E5] gap-4 sm:gap-8 overflow-x-auto no-scrollbar whitespace-nowrap" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'description'}
          onClick={() => setActiveTab('description')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-[0.14em] sm:tracking-[0.16em] uppercase transition-all duration-150 cursor-pointer relative shrink-0 ${
            activeTab === 'description'
              ? 'text-[#111111]'
              : 'text-[#888888] hover:text-[#111111]'
          }`}
        >
          DESCRIPTION
          {activeTab === 'description' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#111111]" />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'details'}
          onClick={() => setActiveTab('details')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-[0.14em] sm:tracking-[0.16em] uppercase transition-all duration-150 cursor-pointer relative shrink-0 ${
            activeTab === 'details'
              ? 'text-[#111111]'
              : 'text-[#888888] hover:text-[#111111]'
          }`}
        >
          DETAILS
          {activeTab === 'details' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#111111]" />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'shipping'}
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-[0.14em] sm:tracking-[0.16em] uppercase transition-all duration-150 cursor-pointer relative shrink-0 ${
            activeTab === 'shipping'
              ? 'text-[#111111]'
              : 'text-[#888888] hover:text-[#111111]'
          }`}
        >
          SHIPPING & CARE
          {activeTab === 'shipping' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#111111]" />
          )}
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="text-sm text-[#444444] leading-relaxed min-h-[120px]">
        {activeTab === 'description' && (
          <div id="tab-description" className="space-y-3">
            <p className="text-[#333333] text-sm sm:text-[15px] leading-relaxed">
              {painting.description}
            </p>
            <p className="text-[#666666] text-xs leading-relaxed italic">
              Accompanied by a Gallery Certificate of Authenticity signed by the artist.
            </p>
          </div>
        )}

        {activeTab === 'details' && (
          <div id="tab-details" className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
              <span className="text-[#777777] uppercase font-medium tracking-wider">Artist:</span>
              <span className="text-[#111111] font-semibold">{painting.artist}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
              <span className="text-[#777777] uppercase font-medium tracking-wider">Medium:</span>
              <span className="text-[#111111] font-semibold">{painting.medium}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
              <span className="text-[#777777] uppercase font-medium tracking-wider">Size:</span>
              <span className="text-[#111111] font-semibold">{displaySize}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
              <span className="text-[#777777] uppercase font-medium tracking-wider">Year:</span>
              <span className="text-[#111111] font-semibold">{displayYear}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
              <span className="text-[#777777] uppercase font-medium tracking-wider">Style:</span>
              <span className="text-[#111111] font-semibold">{displayStyle}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0]">
              <span className="text-[#777777] uppercase font-medium tracking-wider">Frame:</span>
              <span className="text-[#111111] font-semibold">{displayFrame}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0] sm:col-span-2">
              <span className="text-[#777777] uppercase font-medium tracking-wider">Artwork Type:</span>
              <span className="text-[#111111] font-semibold">{displayType}</span>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div id="tab-shipping" className="space-y-3 text-xs sm:text-sm">
            <ul className="list-disc pl-5 space-y-1.5 text-[#555555]">
              <li>Carefully packaged for delivery with multi-layer archival foam & wooden crates</li>
              <li>Protective art packaging ensures your canvas arrives in pristine gallery condition</li>
              <li>Shipping available across Pakistan via insured art couriers (3–5 business days)</li>
              <li>International white-glove art shipping can be arranged upon inquiry</li>
              <li>Keep artwork away from direct moisture and humid environments</li>
              <li>Avoid prolonged direct sunlight exposure to preserve mineral pigments and oil saturation</li>
            </ul>
          </div>
        )}
      </div>

      {/* ================= COMPACT SHIPPING & TRUST INFORMATION BOX ================= */}
      <div 
        id="compact-shipping-trust-box"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 pb-2 border-t border-[#E5E5E5] text-xs text-[#555555]"
      >
        <div className="flex items-start gap-3">
          <Truck className="w-4 h-4 text-[#111111] shrink-0 mt-0.5 stroke-[1.5]" />
          <div>
            <span className="font-semibold text-[#111111] tracking-wider uppercase block text-[11px]">
              SECURE ART DELIVERY
            </span>
            <span className="text-[11px] text-[#777777] leading-snug block">
              Carefully packaged to protect your artwork.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <RotateCcw className="w-4 h-4 text-[#111111] shrink-0 mt-0.5 stroke-[1.5]" />
          <div>
            <span className="font-semibold text-[#111111] tracking-wider uppercase block text-[11px]">
              RETURNS
            </span>
            <span className="text-[11px] text-[#777777] leading-snug block">
              Return policy according to your gallery policy.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Lock className="w-4 h-4 text-[#111111] shrink-0 mt-0.5 stroke-[1.5]" />
          <div>
            <span className="font-semibold text-[#111111] tracking-wider uppercase block text-[11px]">
              SECURE PAYMENT
            </span>
            <span className="text-[11px] text-[#777777] leading-snug block">
              Your payment information is securely processed.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
