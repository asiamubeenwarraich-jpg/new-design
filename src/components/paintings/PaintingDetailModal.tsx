import React from 'react';
import { X, Check, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { Painting } from '../../data/paintings.ts';

export interface PaintingDetailModalProps {
  painting: Painting | null;
  onClose: () => void;
  onAddToCart?: (painting: Painting) => void;
}

export const PaintingDetailModal: React.FC<PaintingDetailModalProps> = ({
  painting,
  onClose,
  onAddToCart,
}) => {
  if (!painting) return null;

  const isSoldOut = painting.status === 'SOLD_OUT';

  return (
    <div
      id="painting-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-painting-title"
    >
      <div
        id="painting-detail-card"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-none sm:rounded-sm border border-[#E5E5E5] shadow-2xl flex flex-col md:flex-row text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 border border-[#E5E5E5] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer shadow-xs"
          aria-label="Close details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Large Artwork Image */}
        <div className="w-full md:w-1/2 bg-[#F6F6F7] flex items-center justify-center p-4 sm:p-8 border-b md:border-b-0 md:border-r border-[#E5E5E5]">
          <div className="relative w-full aspect-[4/3] max-w-md shadow-lg overflow-hidden bg-white">
            <img
              src={painting.image}
              alt={painting.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Status Pill on Large Image */}
            <div className="absolute top-3 left-3 pointer-events-none">
              {isSoldOut ? (
                <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-[#111111] text-white shadow-xs">
                  SOLD OUT
                </span>
              ) : (
                <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-white text-[#111111] border border-[#E5E5E5] shadow-xs">
                  NEW ARRIVAL
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Artwork Details */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Slug & Year indicator */}
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#777777] uppercase mb-2">
              <span>{painting.category}</span>
              <span>•</span>
              <span>{painting.year}</span>
            </div>

            {/* Title */}
            <h2
              id="modal-painting-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] mb-1"
            >
              {painting.title}
            </h2>

            {/* Artist */}
            <p className="text-sm sm:text-base text-[#777777] mb-4">
              Original Artwork by <span className="text-[#111111] font-medium">{painting.artist}</span>
            </p>

            {/* Price */}
            <div className="text-xl sm:text-2xl font-bold text-[#111111] pb-5 border-b border-[#E5E5E5] mb-5">
              {painting.formattedPrice}
            </div>

            {/* Description */}
            <p className="text-sm text-[#4A4A4D] leading-relaxed mb-6">
              {painting.description}
            </p>

            {/* Specifications Matrix */}
            <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs pb-6 border-b border-[#E5E5E5] mb-6">
              <div>
                <dt className="text-[#777777] uppercase tracking-wider text-[10px] mb-0.5">Dimensions</dt>
                <dd className="text-[#111111] font-medium">{painting.dimensions}</dd>
              </div>
              <div>
                <dt className="text-[#777777] uppercase tracking-wider text-[10px] mb-0.5">Medium</dt>
                <dd className="text-[#111111] font-medium">{painting.medium}</dd>
              </div>
              <div>
                <dt className="text-[#777777] uppercase tracking-wider text-[10px] mb-0.5">Availability</dt>
                <dd className={`font-semibold ${isSoldOut ? 'text-neutral-500' : 'text-emerald-700'}`}>
                  {isSoldOut ? 'Acquired (Private Collection)' : 'Available for Acquisition'}
                </dd>
              </div>
              <div>
                <dt className="text-[#777777] uppercase tracking-wider text-[10px] mb-0.5">Authenticity</dt>
                <dd className="text-[#111111] font-medium">Signed with Certificate</dd>
              </div>
            </dl>
          </div>

          {/* Action Buttons */}
          <div>
            {isSoldOut ? (
              <div className="space-y-3">
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 px-6 bg-[#F2F2F4] text-[#8E8E93] text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-none border border-[#E5E5E5] cursor-not-allowed text-center"
                >
                  SOLD OUT — ARCHIVE VIEW ONLY
                </button>
                <p className="text-[11px] text-center text-[#777777]">
                  This original painting has been acquired by a private collector. Inquire to commission similar artwork.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onAddToCart) onAddToCart(painting);
                    onClose();
                  }}
                  className="w-full py-3.5 px-6 bg-[#111111] hover:bg-[#333333] text-white text-xs sm:text-sm font-semibold tracking-[0.12em] uppercase rounded-none transition-colors cursor-pointer shadow-xs"
                >
                  ACQUIRE PAINTING — {painting.formattedPrice}
                </button>
                <div className="flex items-center justify-center gap-4 text-[11px] text-[#777777] pt-1">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#111111]" />
                    Insured Worldwide Shipping
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
                    Gallery Certificate
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingDetailModal;
