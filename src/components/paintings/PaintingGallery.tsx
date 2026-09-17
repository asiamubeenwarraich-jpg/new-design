import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaintingGalleryProps {
  title: string;
  artist: string;
  images: string[];
  status?: string;
}

const THUMBNAIL_LABELS = [
  'Full Artwork',
  'Detail View',
  'Framed Exhibition',
  'Canvas Texture',
  'Artwork in Room',
];

export const PaintingGallery: React.FC<PaintingGalleryProps> = ({
  title,
  artist,
  images,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const displayImages = images && images.length > 0 ? images : ['/images/paintings/coastal-serenity-1.jpg'];
  const currentImage = displayImages[activeIndex] || displayImages[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="painting-gallery" className="w-full flex flex-col md:flex-row gap-4 lg:gap-6 items-start">
      {/* ================= DESKTOP VERTICAL THUMBNAIL GALLERY ================= */}
      <div 
        id="painting-thumbnails-desktop" 
        className="hidden md:flex flex-col gap-3 shrink-0 w-20 lg:w-24 max-h-[640px] overflow-y-auto no-scrollbar py-0.5"
        aria-label="Artwork thumbnail gallery"
      >
        {displayImages.map((imgSrc, idx) => {
          const isActive = idx === activeIndex;
          const label = THUMBNAIL_LABELS[idx] || `View ${idx + 1}`;
          return (
            <button
              key={`thumb-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`group relative w-full aspect-[4/5] rounded-[2px] overflow-hidden bg-[#F5F5F7] transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'ring-2 ring-[#111111] shadow-xs scale-[1.03]'
                  : 'opacity-70 hover:opacity-100 hover:ring-1 hover:ring-[#CCCCCC]'
              }`}
              aria-label={`Select ${label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {!imgError[idx] ? (
                <img
                  src={imgSrc}
                  alt={`${title} - ${label}`}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError((prev) => ({ ...prev, [idx]: true }))}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-1 text-[9px] text-[#777777] bg-[#EAEAE8] text-center uppercase font-mono">
                  {idx + 1}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= MAIN LARGE PAINTING CANVAS (DESKTOP & MOBILE) ================= */}
      <div className="flex-1 w-full flex flex-col">
        <div 
          id="painting-main-canvas"
          className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] max-h-[720px] bg-[#FBFBFA] border border-[#EBEBEB] rounded-[2px] overflow-hidden flex items-center justify-center p-4 sm:p-8 select-none"
        >
          {/* Main Artwork Presentation (strictly object-fit contain, no distortion, no overlay icons) */}
          {!imgError[activeIndex] ? (
            <img
              key={currentImage}
              src={currentImage}
              alt={`${title} by ${artist} - View ${activeIndex + 1}`}
              referrerPolicy="no-referrer"
              onError={() => setImgError((prev) => ({ ...prev, [activeIndex]: true }))}
              className="w-full h-full object-contain object-center drop-shadow-sm transition-opacity duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#F3F3F1]">
              <div className="w-10 h-[1px] bg-[#111111]/30 mb-3" />
              <p className="text-sm font-medium tracking-widest text-[#111111] uppercase">{title}</p>
              <p className="text-xs text-[#777777] tracking-wider mt-1">{artist}</p>
            </div>
          )}

          {/* Minimal Navigation Arrows (Beside/Over Main Image) */}
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#111111] border border-[#E5E5E5] flex items-center justify-center shadow-xs hover:scale-105 transition-all cursor-pointer z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#111111] border border-[#E5E5E5] flex items-center justify-center shadow-xs hover:scale-105 transition-all cursor-pointer z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </button>
            </>
          )}

          {/* Current view indicator pill in bottom center */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] tracking-widest font-mono uppercase backdrop-blur-xs pointer-events-none">
            {activeIndex + 1} / {displayImages.length}
          </div>
        </div>

        {/* ================= MOBILE HORIZONTALLY SCROLLABLE THUMBNAILS ================= */}
        <div 
          id="painting-thumbnails-mobile"
          className="flex md:hidden gap-2.5 overflow-x-auto no-scrollbar pt-3 pb-1 w-full"
          aria-label="Artwork thumbnail gallery mobile"
        >
          {displayImages.map((imgSrc, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`mobile-thumb-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-16 aspect-[4/5] rounded-[2px] overflow-hidden bg-[#F5F5F7] transition-all cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-[#111111] shadow-xs'
                    : 'opacity-65 hover:opacity-100'
                }`}
                aria-label={`View thumbnail ${idx + 1}`}
              >
                <img
                  src={imgSrc}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
