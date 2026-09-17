import React from 'react';

export interface PaintingInfoProps {
  title: string;
  artist: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  status: 'available' | 'sold_out' | 'NEW' | 'SOLD_OUT';
  isOriginal?: boolean;
}

export const PaintingInfo: React.FC<PaintingInfoProps> = ({
  title,
  artist,
  price,
  originalPrice,
  status,
  isOriginal = true,
}) => {
  const isAvailable = status === 'available' || status === 'NEW';
  const hasSale = Boolean(originalPrice && originalPrice > price);

  const formattedPrice = `Rs. ${price.toLocaleString()}`;
  const formattedOriginalPrice = originalPrice ? `Rs. ${originalPrice.toLocaleString()}` : null;

  return (
    <div id="painting-info-block" className="flex flex-col space-y-3 sm:space-y-4">
      {/* Availability Status Badge */}
      <div className="flex items-center gap-2">
        {isAvailable ? (
          <span 
            id="painting-availability-badge"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-emerald-800"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {isOriginal ? 'ONLY 1 AVAILABLE' : 'IN STOCK'}
          </span>
        ) : (
          <span 
            id="painting-availability-badge"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-[#777777]"
          >
            <span className="w-2 h-2 rounded-full bg-[#888888]" />
            SOLD OUT
          </span>
        )}
      </div>

      {/* Painting Title */}
      <h1 
        id="painting-title"
        className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl uppercase tracking-[0.02em] text-[#111111] leading-[1.08]"
      >
        {title}
      </h1>

      {/* Artist Credit */}
      <div className="flex items-center gap-2 text-sm tracking-[0.15em] uppercase text-[#777777] font-medium">
        <span>ARTIST:</span>
        <span className="text-[#111111] font-semibold">{artist}</span>
      </div>

      {/* Price Display with Optional Sale Tag */}
      <div id="painting-price-row" className="flex items-baseline gap-3 pt-1">
        {hasSale && formattedOriginalPrice && (
          <span className="text-base sm:text-lg text-[#999999] line-through font-light tracking-wide">
            {formattedOriginalPrice}
          </span>
        )}
        <span className="text-2xl sm:text-3xl font-semibold text-[#111111] tracking-tight font-display">
          {formattedPrice}
        </span>
        {hasSale && (
          <span 
            id="painting-sale-badge"
            className="px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold tracking-widest uppercase ml-1"
          >
            SALE
          </span>
        )}
      </div>
    </div>
  );
};
