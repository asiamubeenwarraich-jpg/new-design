import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Filter, 
  Search, 
  ShoppingBag, 
  Check, 
  Eye, 
  ExternalLink,
  Award,
  Clock
} from 'lucide-react';
import { Painting } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import { useCart } from '../../context/CartContext';

export interface AcquirePaintingsPageProps {
  onNavigateHome: () => void;
  onNavigateCollection: () => void;
  onSelectPainting: (painting: Painting) => void;
  onInquiry?: (title: string) => void;
}

export const AcquirePaintingsPage: React.FC<AcquirePaintingsPageProps> = ({
  onNavigateHome,
  onNavigateCollection,
  onSelectPainting,
  onInquiry,
}) => {
  const { addToCart, openCart } = useCart();
  const [paintings, setPaintings] = useState<Painting[]>(() => galleryDatabase.getPaintings());
  const [selectedMedium, setSelectedMedium] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Re-sync with database if updated
  React.useEffect(() => {
    const unsub = galleryDatabase.subscribe(() => {
      setPaintings(galleryDatabase.getPaintings());
    });
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAcquire = (e: React.MouseEvent, painting: Painting) => {
    e.stopPropagation();
    const result = addToCart(painting, 1);
    if (result.success) {
      showToast(`"${painting.title}" added to your acquisition bag.`);
      openCart();
    } else {
      showToast(result.message);
    }
  };

  const handleInquireClick = (e: React.MouseEvent, paintingTitle: string) => {
    e.stopPropagation();
    if (onInquiry) {
      onInquiry(paintingTitle);
    } else {
      showToast(`Inquiry sent for "${paintingTitle}". Our private curator will contact you.`);
    }
  };

  // Filter available original works
  const filteredPaintings = useMemo(() => {
    return paintings
      .filter((p) => {
        const matchesMedium = 
          selectedMedium === 'all' || 
          p.medium.toLowerCase().includes(selectedMedium.toLowerCase()) ||
          p.category.toLowerCase().includes(selectedMedium.toLowerCase());
        const matchesSearch = 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.dimensions.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesMedium && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        // Featured: prioritize 2026 Editorial Series and available items
        if (a.status === 'available' && b.status !== 'available') return -1;
        if (a.status !== 'available' && b.status === 'available') return 1;
        return 0;
      });
  }, [paintings, selectedMedium, sortBy, searchQuery]);

  return (
    <div id="acquire-paintings-page" className="min-h-screen bg-[#F7F7F8] text-[#141416]">
      {/* Toast */}
      {notification && (
        <div 
          id="acquire-toast-notification"
          className="fixed top-20 right-4 sm:right-8 z-50 px-5 py-3.5 bg-[#141416] text-white text-xs sm:text-sm font-sans shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="w-full bg-white border-b border-[#E5E5E8]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 py-3 sm:py-4 flex items-center justify-between">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#7A7A80]">
              <li>
                <button 
                  type="button" 
                  onClick={onNavigateHome}
                  className="hover:text-[#141416] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
              </li>
              <li>/</li>
              <li className="text-[#141416] font-semibold">Acquire Original Paintings</li>
            </ol>
          </nav>

          <button
            type="button"
            onClick={onNavigateCollection}
            className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#4A4A4D] hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View 2026 Archive</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Editorial Page Header */}
      <section className="w-full bg-white border-b border-[#E5E5E8] pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#555558] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
              <span>Available Original Works</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight font-bold text-[#141416] leading-tight">
              Acquire Original Paintings
            </h1>
            
            <p className="text-sm sm:text-base text-[#4A4A4D] mt-3 font-normal leading-relaxed">
              Hand-crafted by <span className="font-semibold text-[#141416]">calligraphy__by_ulain8261</span>. Each piece is accompanied by a signed Certificate of Authenticity, insured white-glove courier dispatch, and complete provenance documentation.
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-6 pt-6 border-t border-[#E5E5E8] text-xs text-[#555558]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#141416]" />
                <span className="font-medium">Insured Art Courier</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#141416]" />
                <span className="font-medium">Provenance Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#141416]" />
                <span className="font-medium">1-of-1 Original Canvas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls & Filters Bar */}
      <section className="w-full border-b border-[#E5E5E8] bg-[#F7F7F8] py-4 sticky top-0 z-20 backdrop-blur-xs bg-[#F7F7F8]/95">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Medium Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setSelectedMedium('all')}
              className={`px-3 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                selectedMedium === 'all'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              All Works ({paintings.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedMedium('Linen')}
              className={`px-3 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                selectedMedium === 'Linen'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              Belgian Linen & Gold
            </button>
            <button
              type="button"
              onClick={() => setSelectedMedium('Canvas')}
              className={`px-3 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                selectedMedium === 'Canvas'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              Oil & Acrylic Canvas
            </button>
            <button
              type="button"
              onClick={() => setSelectedMedium('Editorial')}
              className={`px-3 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                selectedMedium === 'Editorial'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              2026 Editorial Series
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A80]" />
              <input
                type="text"
                placeholder="Search medium or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#D5D5D8] text-xs pl-8 pr-3 py-1.5 rounded-none focus:outline-hidden focus:border-[#141416] text-[#141416]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#555558]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-[#D5D5D8] px-2.5 py-1.5 text-xs font-mono rounded-none focus:outline-hidden focus:border-black cursor-pointer text-[#141416]"
                aria-label="Sort paintings"
              >
                <option value="featured">Sort: Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Works Grid */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 py-10 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-mono tracking-wider uppercase text-[#7A7A80]">
            Displaying {filteredPaintings.length} {filteredPaintings.length === 1 ? 'Masterpiece' : 'Masterpieces'}
          </p>
          <span className="text-xs font-mono text-[#7A7A80] hidden sm:inline">
            Direct Studio Dispatch • Islamabad Studio
          </span>
        </div>

        {filteredPaintings.length === 0 ? (
          <div className="bg-white border border-[#E5E5E8] p-12 text-center my-8">
            <p className="text-base text-[#4A4A4D]">No original paintings match the selected criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedMedium('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 bg-[#141416] text-white text-xs uppercase tracking-widest font-mono cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPaintings.map((painting) => {
              const isAvailable = painting.status === 'available';
              return (
                <article
                  key={painting.id}
                  onClick={() => onSelectPainting(painting)}
                  className="group bg-white border border-[#E5E5E8] hover:border-[#141416] transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md"
                >
                  {/* Artwork Image Container */}
                  <div className="p-4 sm:p-5">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECECEE] mb-5">
                      <img
                        src={painting.image}
                        alt={painting.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <span 
                        className={`absolute top-3 right-3 px-2.5 py-1 text-[9px] uppercase tracking-widest font-mono font-semibold border backdrop-blur-xs ${
                          isAvailable
                            ? 'bg-white/95 text-[#141416] border-[#D5D5D8]'
                            : 'bg-[#141416]/90 text-white border-black/40'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Reserved / Archive'}
                      </span>

                      {/* Quick view overlay prompt */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 bg-white/95 text-[#141416] text-[11px] font-mono tracking-widest uppercase font-semibold shadow-md flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Artwork</span>
                        </span>
                      </div>
                    </div>

                    {/* Artwork Details */}
                    <div className="space-y-1.5">
                      <h2 className="text-base sm:text-lg font-semibold tracking-wide text-[#141416] uppercase">
                        {painting.title}
                      </h2>
                      <p className="text-xs text-[#555558] line-clamp-1">
                        {painting.medium}
                      </p>
                      <p className="text-[11px] font-mono text-[#7A7A80]">
                        {painting.dimensions}
                      </p>
                      {painting.year && (
                        <p className="text-[10px] font-mono text-[#9999A0] uppercase">
                          Series: {painting.year} Original
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Acquisition Actions */}
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#E5E5E8] bg-[#FAFAFA] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#7A7A80] font-mono block">Acquisition Price</span>
                        <span className="text-base sm:text-lg font-mono font-bold text-[#141416]">
                          {painting.formattedPrice}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleInquireClick(e, painting.title)}
                        className="text-[11px] uppercase tracking-wider text-[#555558] hover:text-black font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Inquire</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {isAvailable ? (
                        <button
                          type="button"
                          onClick={(e) => handleAcquire(e, painting)}
                          className="w-full py-2.5 bg-[#141416] hover:bg-black text-white text-[11px] font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Acquire</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleInquireClick(e, painting.title)}
                          className="w-full py-2.5 bg-[#E5E5E8] text-[#555558] hover:bg-[#D5D5D8] hover:text-black text-[11px] font-mono tracking-widest uppercase font-semibold cursor-pointer transition-colors"
                        >
                          Commission
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectPainting(painting)}
                        className="w-full py-2.5 border border-[#D5D5D8] hover:border-black bg-white text-[#141416] text-[11px] font-mono tracking-widest uppercase font-semibold cursor-pointer transition-colors text-center"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Private Commission Inquiry Footer Banner */}
        <section className="mt-16 bg-white border border-[#E5E5E8] p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7A7A80]">
                Curatorial Advisory & Private Commissions
              </span>
              <h3 className="text-xl sm:text-2xl font-display uppercase font-bold text-[#141416]">
                Seeking a bespoke scale or private commission?
              </h3>
              <p className="text-xs sm:text-sm text-[#555558] leading-relaxed max-w-2xl">
                Our artist creates custom architectural-scale calligraphy and textured contemporary canvasses tailored to private residences, corporate lobbies, and interior architectural specifications.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onInquiry) onInquiry("Bespoke Commission Request");
                  else showToast("Our private client advisor will connect with you via email.");
                }}
                className="w-full px-6 py-3.5 bg-[#141416] hover:bg-black text-white text-xs font-mono uppercase tracking-widest font-semibold text-center cursor-pointer transition-colors"
              >
                Inquire for Commission
              </button>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full px-6 py-3 border border-[#D5D5D8] hover:border-black text-[#141416] text-xs font-mono uppercase tracking-widest text-center cursor-pointer transition-colors bg-white"
              >
                Return to Gallery Home
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
