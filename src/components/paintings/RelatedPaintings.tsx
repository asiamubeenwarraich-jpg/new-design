import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Painting } from '../../data/paintings';

export interface RelatedPaintingsProps {
  currentSlug: string;
  paintings: Painting[];
  onSelectPainting: (painting: Painting) => void;
}

export const RelatedPaintings: React.FC<RelatedPaintingsProps> = ({
  currentSlug,
  paintings,
  onSelectPainting,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(5);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter out the current painting to provide 5+ relevant recommendations
  const relatedList = paintings.filter((p) => p.slug !== currentSlug);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setVisibleCards(5);
      } else if (width >= 1024) {
        setVisibleCards(4);
      } else if (width >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, relatedList.length - visibleCards);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex, currentSlug]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch / Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40;

    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (relatedList.length === 0) return null;

  return (
    <section 
      id="you-may-also-like" 
      className="w-full pt-12 sm:pt-20 border-t border-[#E5E5E5] mt-12 sm:mt-20 select-none overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-[1.5px] bg-[#111111]" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#777777] uppercase font-mono">
              CURATED RECOMMENDATIONS
            </span>
          </div>
          <h2 className="font-display font-medium text-xl sm:text-2xl lg:text-3xl uppercase tracking-[0.02em] text-[#111111]">
            YOU MAY ALSO LIKE
          </h2>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D5D5D5] bg-white text-[#111111] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Previous recommendations"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D5D5D5] bg-white text-[#111111] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Next recommendations"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Carousel Track Container (1 card visible on mobile, 5 on desktop) */}
      <div
        className="w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] -mx-2.5 sm:-mx-3 lg:-mx-3.5"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
          }}
        >
          {relatedList.map((item) => {
            const formattedPrice = `Rs. ${item.price.toLocaleString()}`;
            return (
              <div
                key={item.slug}
                className="shrink-0 px-2.5 sm:px-3 lg:px-3.5 group cursor-pointer"
                style={{ width: `${100 / visibleCards}%` }}
                role="button"
                tabIndex={0}
                onClick={() => onSelectPainting(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPainting(item);
                  }
                }}
              >
                {/* Painting Image: Clean, pristine presentation with zero icons */}
                <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-[#F5F5F7] mb-2.5 sm:mb-3">
                  <img
                    src={item.image}
                    alt={`${item.title} - ${item.artist}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Painting Name, Artist Name, Price */}
                <div className="flex flex-col space-y-0.5">
                  <h3 className="text-sm font-medium text-[#111111] tracking-tight group-hover:text-[#555555] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#777777] tracking-wide truncate">
                    {item.artist}
                  </p>
                  <p className="text-xs font-semibold text-[#111111] tracking-tight pt-0.5">
                    {formattedPrice}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots for Mobile & Tablet */}
      {maxIndex > 0 && (
        <div 
          className="pt-6 sm:pt-8 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Recommendations Pagination"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-5 h-1.5 bg-[#111111]'
                    : 'w-1.5 h-1.5 bg-[#D5D5D8] hover:bg-[#888888]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={isActive}
                role="tab"
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
