import React, { useState, useEffect } from 'react';
import { Painting } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import { useCart } from '../../context/CartContext';
import { Gift, ShoppingBag, ArrowRight, ShieldCheck, Heart, Sparkles, AlertCircle } from 'lucide-react';

export interface GiftsPageProps {
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onSelectPainting: (painting: Painting) => void;
  onInquiry?: (title: string) => void;
}

export const GiftsPage: React.FC<GiftsPageProps> = ({
  onNavigateHome,
  onNavigateCatalog,
  onSelectPainting,
  onInquiry,
}) => {
  const { addToCart, openCart } = useCart();
  const [giftPaintings, setGiftPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchGifts = () => {
    try {
      setLoading(true);
      setError(null);
      const items = galleryDatabase.getGiftPaintings();
      setGiftPaintings(items);
    } catch (err) {
      console.error('Failed to load gift paintings:', err);
      setError('Unable to load gift artworks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
    const unsub = galleryDatabase.subscribe(() => {
      fetchGifts();
    });
    return unsub;
  }, []);

  const handleAcquire = (e: React.MouseEvent, painting: Painting) => {
    e.stopPropagation();
    const res = addToCart(painting, 1);
    if (res.success) {
      setToastMessage(`"${painting.title}" gift artwork added to your cart.`);
      openCart();
    } else {
      setToastMessage(res.message);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div id="gifts-page" className="min-h-screen bg-[#F7F7F8] text-[#141416]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-3 bg-[#111111] text-white text-xs font-sans shadow-xl border border-[#333333] flex items-center gap-3 animate-in fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-white border-b border-[#E5E5E8] py-12 sm:py-16">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#141416] text-white text-[10px] font-semibold tracking-[0.2em] uppercase">
              <Gift className="w-3 h-3 text-amber-400" />
              Luxury Curated Gifting
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.16em] uppercase text-[#141416]">
            GIFTS
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#555558] max-w-2xl leading-relaxed tracking-wide font-light">
            Artworks eligible for luxury collector gifting. Every gift edition arrives with complimentary archival museum wrapping, a hand-inked calligraphic card, and an official Certificate of Authenticity.
          </p>

          {/* Gifting Features Pill row */}
          <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-[#4A4A4D] font-medium">
            <span className="inline-flex items-center gap-1.5 bg-[#F4F4F6] px-3 py-1.5 border border-[#E5E5E8]">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D3B]" />
              Complimentary Atelier Gift Box
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#F4F4F6] px-3 py-1.5 border border-[#E5E5E8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D3B]" />
              Signed Certificate of Authenticity
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#F4F4F6] px-3 py-1.5 border border-[#E5E5E8]">
              <Gift className="w-3.5 h-3.5 text-[#8C6D3B]" />
              Hand-Inked Dedication Included
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 py-10 sm:py-14">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#141416] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#707073]">Loading Gift Collection...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center max-w-md mx-auto bg-white border border-[#E5E5E8] p-8">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-600" />
            <p className="text-sm font-semibold text-[#141416] mb-1">Unable to load gift artworks.</p>
            <p className="text-xs text-[#707073] mb-5">There was a communication glitch with the database.</p>
            <button
              type="button"
              onClick={fetchGifts}
              className="px-5 py-2.5 bg-[#141416] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        ) : giftPaintings.length === 0 ? (
          /* Empty State as explicitly specified */
          <div className="py-20 text-center max-w-lg mx-auto bg-white border border-[#E5E5E8] p-8 sm:p-12">
            <h2 className="text-base sm:text-lg font-light tracking-[0.2em] uppercase text-[#141416] mb-2">
              GIFTS
            </h2>
            <p className="text-xs sm:text-sm text-[#707073] mb-6">
              No gift artworks available right now.
            </p>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#141416] text-white text-xs font-medium tracking-[0.2em] uppercase hover:bg-black transition-colors cursor-pointer"
            >
              <span>EXPLORE ALL PAINTINGS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E8] text-xs text-[#707073]">
              <span className="uppercase tracking-widest">{giftPaintings.length} GIFT SELECTION{giftPaintings.length > 1 ? 'S' : ''} READY FOR DISPATCH</span>
              <span className="hidden sm:inline font-mono">Archive: Gifting Tier Enabled</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {giftPaintings.map((painting) => {
                const isSoldOut = painting.status === 'sold_out' || painting.status === 'SOLD_OUT';
                return (
                  <div
                    key={painting.id}
                    onClick={() => onSelectPainting(painting)}
                    className="group bg-white border border-[#E5E5E8] hover:border-[#141416] transition-all duration-200 flex flex-col cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-3/4 overflow-hidden bg-[#EFEFEF]">
                      <img
                        src={painting.image}
                        alt={painting.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="px-2.5 py-1 bg-[#141416] text-white text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1">
                          <Gift className="w-2.5 h-2.5 text-amber-400" />
                          GIFT
                        </span>
                      </div>
                      {isSoldOut && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold tracking-[0.2em] uppercase">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Artwork Meta */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs sm:text-sm font-medium tracking-[0.16em] uppercase text-[#141416] group-hover:text-[#8C6D3B] transition-colors truncate">
                          {painting.title}
                        </h3>
                        <p className="text-[11px] text-[#707073] mt-1 truncate">
                          {painting.artist}
                        </p>
                        <p className="text-[10px] text-[#8A8A8E] mt-0.5 truncate">
                          {painting.medium} • {painting.dimensions}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#F0F0F2] flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-mono font-semibold text-[#141416]">
                          {painting.formattedPrice}
                        </span>
                        {!isSoldOut ? (
                          <button
                            type="button"
                            onClick={(e) => handleAcquire(e, painting)}
                            className="px-3 py-1.5 bg-[#141416] text-white hover:bg-black text-[10px] font-semibold uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Acquire Gift</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                            Acquired
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
