import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaintingCard } from './PaintingCard.tsx';
import { SOLD_OUT_PAINTINGS, Painting } from '../../data/paintings.ts';

export interface SoldOutPaintingsProps {
  paintings?: Painting[];
  onSelectPainting?: (painting: Painting) => void;
  onViewAll?: (path: string) => void;
}

export const SoldOutPaintings: React.FC<SoldOutPaintingsProps> = ({
  paintings = SOLD_OUT_PAINTINGS,
  onSelectPainting,
  onViewAll,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setVisibleCards(4);
      } else if (width >= 1024) {
        setVisibleCards(3);
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

  const maxIndex = Math.max(0, paintings.length - visibleCards);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

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

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewAll) {
      onViewAll('/paintings/sold-out');
    }
  };

  return (
    <section 
      id="sold-out-paintings-section"
      className="w-full bg-[#FAFAF8] py-12 sm:py-20 lg:py-24 border-b border-[#E5E5E5] select-none overflow-hidden"
      aria-labelledby="sold-out-paintings-heading"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="flex items-center justify-between pb-5 sm:pb-8 border-b border-[#E5E5E5] mb-6 sm:mb-12">
          {/* Small horizontal line before heading + Heading */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="w-5 sm:w-8 h-[1.5px] bg-[#111111]" aria-hidden="true" />
            <h2 
              id="sold-out-paintings-heading"
              className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#111111]"
            >
              SOLD OUT PAINTINGS
            </h2>
          </div>

          {/* VIEW ALL link */}
          <a
            href="/paintings/sold-out"
            onClick={handleViewAllClick}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[#111111] hover:text-[#777777] transition-colors cursor-pointer shrink-0"
            aria-label="View all sold out archive paintings"
          >
            <span>VIEW ALL</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </a>
        </div>

        {/* ================= CAROUSEL AREA WITH FLANKING ARROWS ================= */}
        <div className="relative group/carousel">
          
          {/* Circular Previous Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-1 sm:-left-5 lg:-left-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-[#E5E5E5] text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-200 shadow-md flex items-center justify-center cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Previous sold out paintings"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 -ml-0.5" />
          </button>

          {/* Cards Track Container (no horizontal scroll) */}
          <div 
            className="w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] -mx-3 sm:-mx-3.5 lg:-mx-4"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
              }}
            >
              {paintings.map((painting) => (
                <div
                  key={painting.id}
                  className="shrink-0 px-3 sm:px-3.5 lg:px-4"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <PaintingCard
                    title={painting.title}
                    artist={painting.artist}
                    price={painting.price}
                    image={painting.image}
                    status={painting.status}
                    slug={painting.slug}
                    onClick={() => onSelectPainting?.(painting)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Circular Next Arrow */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-1 sm:-right-5 lg:-right-6 top-[38%] -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-[#E5E5E5] text-[#111111] hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-200 shadow-md flex items-center justify-center cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Next sold out paintings"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 -mr-0.5" />
          </button>

        </div>

        {/* ================= PAGINATION DOTS ================= */}
        {maxIndex > 0 && (
          <div 
            className="pt-8 sm:pt-10 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Sold Out Paintings Carousel Pagination"
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
                      ? 'w-6 h-2 bg-[#111111]'
                      : 'w-2 h-2 bg-[#D5D5D8] hover:bg-[#888888]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={isActive}
                  role="tab"
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default SoldOutPaintings;
