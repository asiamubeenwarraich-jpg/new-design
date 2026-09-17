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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter out the current painting to provide 5+ relevant recommendations
  const relatedList = paintings.filter((p) => p.slug !== currentSlug);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [relatedList]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (relatedList.length === 0) return null;

  return (
    <section id="you-may-also-like" className="w-full pt-16 sm:pt-20 border-t border-[#E5E5E5] mt-16 sm:mt-20">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-[1.5px] bg-[#111111]" />
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[#777777] uppercase font-mono">
              CURATED RECOMMENDATIONS
            </span>
          </div>
          <h2 className="font-display font-medium text-2xl sm:text-3xl uppercase tracking-[0.02em] text-[#111111]">
            YOU MAY ALSO LIKE
          </h2>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D5D5D5] bg-white text-[#111111] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Previous recommendations"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D5D5D5] bg-white text-[#111111] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            aria-label="Next recommendations"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel (5 items on desktop screen space) */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        tabIndex={0}
        aria-label="Related paintings carousel"
      >
        {relatedList.map((item) => {
          const formattedPrice = `Rs. ${item.price.toLocaleString()}`;
          return (
            <div
              key={item.slug}
              className="shrink-0 w-[240px] sm:w-[220px] md:w-[240px] lg:w-[calc(20%-19.2px)] group select-none cursor-pointer"
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
              <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden bg-[#F5F5F7] mb-3">
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
    </section>
  );
};
