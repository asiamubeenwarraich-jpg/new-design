import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Check, 
  Eye, 
  ExternalLink,
  BookOpen,
  Award,
  Archive
} from 'lucide-react';
import { Painting } from '../../data/paintings';
import { galleryDatabase } from '../../services/galleryDatabase';
import { useCart } from '../../context/CartContext';

export interface CollectionArchivePageProps {
  onNavigateHome: () => void;
  onNavigateAcquire: () => void;
  onSelectPainting: (painting: Painting) => void;
  onInquiry?: (title: string) => void;
}

export const CollectionArchivePage: React.FC<CollectionArchivePageProps> = ({
  onNavigateHome,
  onNavigateAcquire,
  onSelectPainting,
  onInquiry,
}) => {
  const { addToCart, openCart } = useCart();
  const [paintings, setPaintings] = useState<Painting[]>(() => galleryDatabase.getPaintings());
  const [activeTab, setActiveTab] = useState<'all' | 'editorial' | 'available' | 'sold'>('editorial');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

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
      showToast(`Archive inquiry registered for "${paintingTitle}". Our gallery director will contact you.`);
    }
  };

  const filteredPaintings = useMemo(() => {
    return paintings
      .filter((p) => {
        const matchesTab = 
          activeTab === 'all' ||
          (activeTab === 'editorial' && (p.category.includes('2026') || p.year === 2026 || p.style?.includes('Contemporary') || p.id.startsWith('atmosphere') || p.id.startsWith('solitude') || p.id.startsWith('ethereal'))) ||
          (activeTab === 'available' && p.status === 'available') ||
          (activeTab === 'sold' && p.status !== 'available');

        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.medium.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.dimensions.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
      });
  }, [paintings, activeTab, searchQuery]);

  return (
    <div id="collection-archive-page" className="min-h-screen bg-[#F7F7F8] text-[#141416]">
      {/* Toast */}
      {notification && (
        <div 
          id="archive-toast-notification"
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
              <li className="text-[#141416] font-semibold">Collection Archive & Catalogue</li>
            </ol>
          </nav>

          <button
            type="button"
            onClick={onNavigateAcquire}
            className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#4A4A4D] hover:text-black flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Shop Available Works</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Editorial Page Header matching Screenshot 1 */}
      <section className="w-full bg-white border-b border-[#E5E5E8] pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#555558] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
              <span>2026 Editorial Series</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tight font-bold text-[#141416] leading-tight">
              Collection Archive & Catalogue
            </h1>
            
            <p className="text-sm sm:text-base text-[#4A4A4D] mt-3 font-normal leading-relaxed">
              Hand-crafted by <span className="font-semibold text-[#141416]">calligraphy__by_ulain8261</span>. Each piece accompanied by a signed Certificate of Authenticity.
            </p>

            {/* Curatorial Statement Note */}
            <div className="mt-6 p-5 sm:p-6 bg-[#F7F7F8] border-l-2 border-[#141416] text-xs sm:text-sm text-[#4A4A4D] leading-relaxed">
              <span className="font-mono uppercase tracking-widest text-[11px] font-semibold text-[#141416] block mb-1.5">
                Curatorial Note • 2026 Editorial Series
              </span>
              The 2026 Archive investigates the tactile dialogue between traditional Islamic calligraphy, raw earth pigments, pure 24-karat gold leaf, and untreated Belgian linen. Each artwork balances monumentality with introspective silence.
            </div>

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
                <Archive className="w-4 h-4 text-[#141416]" />
                <span className="font-medium">Museum-Grade Documentation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Tabs & Search Bar */}
      <section className="w-full border-b border-[#E5E5E8] bg-[#F7F7F8] py-4 sticky top-0 z-20 backdrop-blur-xs bg-[#F7F7F8]/95">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-mono uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab('editorial')}
              className={`px-3.5 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                activeTab === 'editorial'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              2026 Editorial Series
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                activeTab === 'all'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              Complete Archive ({paintings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('available')}
              className={`px-3.5 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                activeTab === 'available'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              Available for Acquisition
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sold')}
              className={`px-3.5 py-1.5 whitespace-nowrap cursor-pointer transition-colors border ${
                activeTab === 'sold'
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#555558] border-[#D5D5D8] hover:border-black hover:text-black'
              }`}
            >
              Private Collections (Sold Out)
            </button>
          </div>

          {/* Search Query */}
          <div className="relative md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A80]" />
            <input
              type="text"
              placeholder="Search archive catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D5D5D8] text-xs pl-8 pr-3 py-1.5 rounded-none focus:outline-hidden focus:border-[#141416] text-[#141416]"
            />
          </div>
        </div>
      </section>

      {/* Main Works Grid matching Screenshot 1 */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 py-10 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-mono tracking-wider uppercase text-[#7A7A80]">
            Catalogue Index: {filteredPaintings.length} Works Catalogued
          </p>
          <span className="text-xs font-mono text-[#7A7A80] hidden sm:inline">
            Curated by calligraphy__by_ulain8261
          </span>
        </div>

        {filteredPaintings.length === 0 ? (
          <div className="bg-white border border-[#E5E5E8] p-12 text-center my-8">
            <p className="text-base text-[#4A4A4D]">No catalogue pieces found matching your criteria.</p>
            <button
              type="button"
              onClick={() => {
                setActiveTab('editorial');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 bg-[#141416] text-white text-xs uppercase tracking-widest font-mono cursor-pointer"
            >
              Show 2026 Editorial Series
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
                  {/* Artwork Image */}
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
                        {isAvailable ? 'Available' : 'Reserved'}
                      </span>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 bg-white/95 text-[#141416] text-[11px] font-mono tracking-widest uppercase font-semibold shadow-md flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Catalogue Record</span>
                        </span>
                      </div>
                    </div>

                    {/* Artwork Metadata */}
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
                      <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-[#7A7A80]">
                        <span>Year: {painting.year || '2026'}</span>
                        <span>•</span>
                        <span>{painting.frame || 'Archival Mount'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Catalogue Action */}
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#E5E5E8] bg-[#FAFAFA] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#7A7A80] font-mono block">Acquisition Value</span>
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
                        Record
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Catalog Close / Return Action matching Screenshot 1 */}
        <div className="mt-12 pt-6 border-t border-[#E5E5E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555558]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#141416]" /> Insured Art Courier
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#141416]" /> Provenance Guaranteed
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-8 py-3 bg-[#141416] text-white text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            Return to Gallery Home
          </button>
        </div>
      </main>
    </div>
  );
};
