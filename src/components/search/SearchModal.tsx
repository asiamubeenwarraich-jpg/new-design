import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { Painting } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPainting: (painting: Painting) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPainting,
}) => {
  const [query, setQuery] = useState('');
  const [dbPaintings, setDbPaintings] = useState<Painting[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDbPaintings(galleryDatabase.getPaintings());
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search across actual database products on 5 required fields:
  // Painting title, Artist, Category, Medium, Style
  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return dbPaintings.filter((painting) => {
      const titleMatch = (painting.title || '').toLowerCase().includes(trimmed);
      const artistMatch = (painting.artist || '').toLowerCase().includes(trimmed);
      const categoryMatch = (painting.category || '').toLowerCase().includes(trimmed);
      const mediumMatch = (painting.medium || '').toLowerCase().includes(trimmed);
      const styleMatch = (painting.style || '').toLowerCase().includes(trimmed);
      return titleMatch || artistMatch || categoryMatch || mediumMatch || styleMatch;
    });
  }, [query, dbPaintings]);

  if (!isOpen) return null;

  const popularTags = ['Gold Leaf', 'Belgian Linen', 'Oil', 'Abstract', 'Calligraphy', 'Editorial'];

  return (
    <div 
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search Art Gallery Catalog"
    >
      <div 
        id="search-modal-content"
        className="bg-white w-full max-w-2xl rounded-none sm:rounded-sm shadow-2xl border border-[#E5E5E8] overflow-hidden text-[#141416] mt-4 sm:mt-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-[#E5E5E8] bg-[#F7F7F8]">
          <Search className="w-5 h-5 text-[#707073] shrink-0 mr-3" aria-hidden="true" />
          <input
            id="gallery-search-input"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, artist, medium, style, or category..."
            className="w-full bg-transparent text-sm sm:text-base text-[#141416] placeholder-[#8A8A8E] outline-none font-sans"
            aria-label="Search paintings"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#707073] hover:text-[#141416] mr-2 transition-colors cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            id="btn-close-search"
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider text-[#707073] hover:text-black hover:bg-black/5 rounded transition-colors cursor-pointer shrink-0 ml-1"
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 sm:px-6 py-3 bg-[#FFFFFF] border-b border-[#F0F0F2] flex items-center gap-1.5 overflow-x-auto text-[11px] font-sans">
          <span className="text-[#8A8A8E] uppercase tracking-wider text-[10px] shrink-0 mr-1">Popular:</span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-[#F4F4F6] hover:bg-[#EAEAEB] text-[#4A4A4D] hover:text-[#141416] transition-colors whitespace-nowrap cursor-pointer rounded-none text-xs"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-[#F0F0F2]">
          {query.trim().length === 0 ? (
            <div className="py-10 text-center text-[#707073]">
              <Search className="w-8 h-8 mx-auto mb-2 text-[#C0C0C4]" />
              <p className="text-xs uppercase tracking-widest text-[#8A8A8E]">Search The Permanent Collection</p>
              <p className="text-xs mt-1 text-[#A0A0A4]">Type an artist name, style, medium, or title.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-[#707073]">
              <p className="text-xs uppercase tracking-widest text-[#8A8A8E]">No Artworks Found</p>
              <p className="text-xs mt-1 text-[#A0A0A4]">No paintings in the database matched "{query}". Try checking the spelling or use broader search terms.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 text-[11px] uppercase tracking-wider text-[#8A8A8E]">
                <span>{results.length} Artwork{results.length > 1 ? 's' : ''} Found</span>
                <span>Select to View</span>
              </div>
              {results.map((painting) => {
                const isSoldOut = painting.status === 'sold_out' || painting.status === 'SOLD_OUT';
                return (
                  <button
                    key={painting.id}
                    type="button"
                    onClick={() => {
                      onSelectPainting(painting);
                      onClose();
                    }}
                    className="w-full text-left py-3 px-2.5 hover:bg-[#F9F9FA] transition-colors flex items-center justify-between gap-4 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={painting.image}
                        alt={painting.title}
                        className="w-14 h-14 object-cover border border-[#E5E5E8] shrink-0 bg-[#EAEAEB]"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#141416] group-hover:text-[#8C6D3B] transition-colors truncate">
                            {painting.title}
                          </h4>
                          {isSoldOut ? (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 tracking-wider uppercase shrink-0">
                              Sold Out
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 tracking-wider uppercase shrink-0">
                              Available
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#707073] mt-0.5 truncate">
                          {painting.artist} • {painting.medium}
                        </p>
                        <p className="text-[10px] text-[#8A8A8E] mt-0.5">
                          {painting.dimensions} • {painting.style}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <div>
                        <span className="text-xs sm:text-sm font-mono font-semibold text-[#141416]">
                          {painting.formattedPrice}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8A8A8E] group-hover:text-[#141416] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
