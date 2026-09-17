import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Painting } from '../../data/paintings.ts';
import { PaintingCard } from './PaintingCard.tsx';

export interface PaintingsGridViewModalProps {
  title: string;
  paintings: Painting[];
  onClose: () => void;
  onSelectPainting: (painting: Painting) => void;
}

export const PaintingsGridViewModal: React.FC<PaintingsGridViewModalProps> = ({
  title,
  paintings,
  onClose,
  onSelectPainting,
}) => {
  return (
    <div
      id="paintings-grid-view-modal-backdrop"
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-view-heading"
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 sm:px-12 py-3.5 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 pr-2">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -ml-1 text-[#111111] hover:text-[#777777] transition-colors cursor-pointer shrink-0"
            aria-label="Back to gallery home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-4 h-[1.5px] bg-[#111111] shrink-0" aria-hidden="true" />
          <h2
            id="collection-view-heading"
            className="text-sm sm:text-lg font-bold tracking-[0.12em] uppercase text-[#111111] truncate"
          >
            {title} ({paintings.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full border border-[#E5E5E5] text-[#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer shrink-0"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-10 lg:px-14 py-8 sm:py-14">
        <div className="mb-8">
          <p className="text-sm text-[#777777] max-w-xl">
            Curated catalogue of original artworks. Each painting is an individual physical creation accompanied by a signed Certificate of Authenticity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {paintings.map((painting) => (
            <PaintingCard
              key={painting.id}
              title={painting.title}
              artist={painting.artist}
              price={painting.price}
              image={painting.image}
              status={painting.status}
              slug={painting.slug}
              onClick={() => onSelectPainting(painting)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PaintingsGridViewModal;
