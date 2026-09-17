import React, { useState } from 'react';

export interface PaintingCardProps {
  title: string;
  artist: string;
  price: number | string;
  image: string;
  status: 'NEW' | 'SOLD_OUT' | 'available' | 'sold_out';
  slug?: string;
  onClick?: () => void;
}

export const PaintingCard: React.FC<PaintingCardProps> = ({
  title,
  artist,
  price,
  image,
  status,
  slug,
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  const formattedPrice =
    typeof price === 'number'
      ? `Rs. ${price.toLocaleString()}`
      : price.startsWith('Rs.')
      ? price
      : `Rs. ${price}`;

  const href = slug ? `/paintings/${slug}` : '#';

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      id={`painting-card-${slug || title.toLowerCase().replace(/\s+/g, '-')}`}
      className="group flex flex-col w-full text-left select-none cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      aria-label={`${title} by ${artist}, ${formattedPrice}. Status: ${status === 'NEW' ? 'New' : 'Sold Out'}`}
    >
      {/* ================= 1. PAINTING IMAGE (4:3 ASPECT RATIO) ================= */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[2px] bg-[#F2F2F4]">
        {!imgError ? (
          <img
            src={image}
            alt={`${title} - Original Painting by ${artist}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          /* Elegant gallery fallback canvas if external asset is unreachable */
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#EAEAE8] via-[#DFDFDC] to-[#CECECA] transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            aria-label={title}
          >
            <div className="w-8 h-[1px] bg-[#111111]/30 mb-2" />
            <p className="text-[13px] font-medium tracking-wider text-[#111111] uppercase line-clamp-1">{title}</p>
            <p className="text-[11px] text-[#777777] tracking-wide mt-0.5">{artist}</p>
          </div>
        )}

        {/* ================= 2. STATUS BADGE (TOP-LEFT ONLY) ================= */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          {(status === 'NEW' || status === 'available') ? (
            <span 
              className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] uppercase rounded-full bg-[#FAFAF8]/95 text-[#111111] border border-[#E5E5E5] shadow-xs backdrop-blur-xs"
            >
              NEW
            </span>
          ) : (
            <span 
              className="inline-flex items-center justify-center px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] uppercase rounded-full bg-[#111111] text-white shadow-xs"
            >
              SOLD OUT
            </span>
          )}
        </div>
      </div>

      {/* ================= 3. CARD DETAILS ================= */}
      <div className="pt-3.5 sm:pt-4 flex flex-col space-y-1">
        {/* Painting Title */}
        <h3 
          className="text-[#111111] font-medium text-[15px] sm:text-[16px] leading-snug tracking-[0.01em] transition-colors duration-200 group-hover:text-[#555555] line-clamp-1"
        >
          {title}
        </h3>

        {/* Artist Name */}
        <p className="text-[#777777] text-[13px] sm:text-[14px] leading-normal font-normal line-clamp-1">
          {artist}
        </p>

        {/* Price */}
        <p className="text-[#111111] font-medium text-[14px] sm:text-[15px] tracking-tight pt-0.5">
          {formattedPrice}
        </p>
      </div>
    </article>
  );
};

export default PaintingCard;
