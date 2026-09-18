import React, { useState, useEffect } from 'react';
import { Pack, galleryDatabase } from '../../services/galleryDatabase';
import { useCart } from '../../context/CartContext';
import { Painting } from '../../data/paintings';
import { Package, ShoppingBag, ArrowRight, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export interface PacksPageProps {
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onInquiry?: (title: string) => void;
}

export const PacksPage: React.FC<PacksPageProps> = ({
  onNavigateHome,
  onNavigateCatalog,
  onInquiry,
}) => {
  const { addToCart, openCart } = useCart();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPacks = () => {
    try {
      setLoading(true);
      setError(null);
      const all = galleryDatabase.getPacks();
      // Only show non-draft packs on the public store
      const active = all.filter((p) => p.status !== 'DRAFT');
      setPacks(active);
    } catch (err) {
      console.error('Failed to load packs:', err);
      setError('Unable to load art packs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
    const unsub = galleryDatabase.subscribe(() => {
      fetchPacks();
    });
    return unsub;
  }, []);

  const handleAcquirePack = (pack: Pack) => {
    // Convert pack to Painting format compatible with CartContext
    const packAsPainting: Painting = {
      id: pack.id,
      slug: pack.slug,
      title: pack.title,
      artist: 'Studio Atelier Collection',
      price: pack.price,
      formattedPrice: `Rs. ${pack.price.toLocaleString()}`,
      currency: 'PKR',
      status: pack.status === 'SOLD_OUT' ? 'sold_out' : 'available',
      image: pack.image || '/images/hero-painting.jpg',
      images: [pack.image || '/images/hero-painting.jpg'],
      description: pack.description || 'Curated art pack bundle.',
      dimensions: 'Collection Suite',
      size: 'Multisize Art Suite',
      medium: 'Original Miniature Canvases & Prints',
      style: 'Curated Suite',
      category: 'Art Packs',
      year: 2026,
      frame: 'Gift Box Enclosed',
      type: 'Art Pack Bundle',
      isOriginal: true,
      isGift: true,
    };

    const res = addToCart(packAsPainting, 1);
    if (res.success) {
      setToastMessage(`"${pack.title}" added to your shopping cart.`);
      openCart();
    } else {
      setToastMessage(res.message);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div id="packs-page" className="min-h-screen bg-[#F7F7F8] text-[#141416]">
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
              <Package className="w-3 h-3 text-amber-400" />
              Collector Suites & Bundles
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.16em] uppercase text-[#141416]">
            PACKS
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#555558] max-w-2xl leading-relaxed tracking-wide font-light">
            Carefully curated collections of miniature originals, hand-finished calligraphy folios, and themed artwork suites offered as complete collector sets.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 py-10 sm:py-14">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#141416] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#707073]">Loading Art Packs...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center max-w-md mx-auto bg-white border border-[#E5E5E8] p-8">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-600" />
            <p className="text-sm font-semibold text-[#141416] mb-1">Unable to load art packs.</p>
            <p className="text-xs text-[#707073] mb-5">There was a communication glitch with the database.</p>
            <button
              type="button"
              onClick={fetchPacks}
              className="px-5 py-2.5 bg-[#141416] text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        ) : packs.length === 0 ? (
          /* Empty State as explicitly specified */
          <div className="py-20 text-center max-w-lg mx-auto bg-white border border-[#E5E5E8] p-8 sm:p-12">
            <h2 className="text-base sm:text-lg font-light tracking-[0.2em] uppercase text-[#141416] mb-2">
              PACKS
            </h2>
            <p className="text-xs sm:text-sm text-[#707073] mb-6">
              No art packs available right now.
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
              <span className="uppercase tracking-widest">{packs.length} CURATED BUNDLE{packs.length > 1 ? 'S' : ''} READY</span>
              <span className="hidden sm:inline font-mono">Pack Inventory: Live</span>
            </div>

            {/* Packs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packs.map((pack) => {
                const isSoldOut = pack.status === 'SOLD_OUT';
                return (
                  <div
                    key={pack.id}
                    className="bg-white border border-[#E5E5E8] hover:border-[#141416] transition-all duration-200 flex flex-col overflow-hidden shadow-xs hover:shadow-md"
                  >
                    {/* Pack Image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-[#EAEAEB]">
                      <img
                        src={pack.image || '/images/hero-painting.jpg'}
                        alt={pack.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-[#141416] text-white text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-amber-400" />
                          ART PACK
                        </span>
                      </div>
                      {isSoldOut ? (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold tracking-[0.2em] uppercase">
                            SOLD OUT
                          </span>
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 bg-emerald-600 text-white text-[9px] font-bold tracking-[0.2em] uppercase">
                            AVAILABLE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pack Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-medium tracking-[0.12em] uppercase text-[#141416]">
                          {pack.title}
                        </h3>
                        <p className="mt-2 text-xs text-[#555558] line-clamp-3 leading-relaxed">
                          {pack.description || 'Exclusive studio art bundle featuring original miniatures and gallery certs.'}
                        </p>

                        <div className="mt-4 pt-3 border-t border-[#F0F0F2] space-y-1 text-[11px] text-[#707073]">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Bespoke presentation packaging included</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Individual Signed Certificates</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#E5E5E8] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#8A8A8E] block">Pack Price</span>
                          <span className="text-base sm:text-lg font-mono font-semibold text-[#141416]">
                            Rs. {pack.price.toLocaleString()}
                          </span>
                        </div>

                        {!isSoldOut ? (
                          <button
                            type="button"
                            onClick={() => handleAcquirePack(pack)}
                            className="px-4 py-2 bg-[#141416] text-white hover:bg-black text-[11px] font-semibold uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Acquire Pack</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 bg-[#F4F4F6] text-red-600 text-xs font-bold uppercase tracking-wider">
                            Pack Sold Out
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
