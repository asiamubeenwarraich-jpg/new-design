import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { Footer } from './components/Footer.tsx';
import { NewPaintings } from './components/paintings/NewPaintings.tsx';
import { SoldOutPaintings } from './components/paintings/SoldOutPaintings.tsx';
import { PaintingDetailPage } from './components/paintings/PaintingDetailPage.tsx';
import { PaintingsGridViewModal } from './components/paintings/PaintingsGridViewModal.tsx';
import { 
  NEW_PAINTINGS, 
  SOLD_OUT_PAINTINGS, 
  ALL_PAINTINGS, 
  Painting, 
  getPaintingBySlug 
} from './data/paintings.ts';
import { X, Sparkles, ExternalLink, Truck, ShieldCheck } from 'lucide-react';

export default function App() {
  const [modalType, setModalType] = useState<'shop' | 'collection' | null>(null);
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [viewAllCategory, setViewAllCategory] = useState<'new' | 'sold-out' | null>(null);
  const [inquiryNotice, setInquiryNotice] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Handle URL changes & deep linking for /paintings/[slug], /paintings/new, /paintings/sold-out
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      if (path === '/paintings/new') {
        setViewAllCategory('new');
        setSelectedPainting(null);
      } else if (path === '/paintings/sold-out') {
        setViewAllCategory('sold-out');
        setSelectedPainting(null);
      } else if (path.startsWith('/paintings/')) {
        const slug = path.replace('/paintings/', '').replace(/\/$/, '');
        const matched = getPaintingBySlug(slug);
        if (matched) {
          setSelectedPainting(matched);
        }
      } else {
        setSelectedPainting(null);
        setViewAllCategory(null);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const handleSelectPainting = (painting: Painting) => {
    setSelectedPainting(painting);
    setViewAllCategory(null);
    window.history.pushState(null, '', `/paintings/${painting.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setSelectedPainting(null);
    setViewAllCategory(null);
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCatalog = () => {
    setSelectedPainting(null);
    setViewAllCategory('new');
    window.history.pushState(null, '', '/paintings/new');
  };

  const handleViewAll = (path: string) => {
    if (path === '/paintings/new') {
      setViewAllCategory('new');
      window.history.pushState(null, '', '/paintings/new');
    } else if (path === '/paintings/sold-out') {
      setViewAllCategory('sold-out');
      window.history.pushState(null, '', '/paintings/sold-out');
    }
  };

  const handleCloseViewAll = () => {
    setViewAllCategory(null);
    window.history.pushState(null, '', '/');
  };

  const handleAddToCartSuccess = (painting: Painting, quantity: number) => {
    setCartCount((prev) => prev + quantity);
  };

  const handleInquiry = (title: string) => {
    setInquiryNotice(`Inquiry initiated for "${title}". A private client advisor will respond.`);
    setTimeout(() => setInquiryNotice(null), 4000);
  };

  const samplePaintings = [
    {
      id: "art-1",
      title: "Atmosphere No. VII",
      medium: "Oil & Gold Leaf on Belgian Linen",
      size: "48 × 36 in (122 × 91 cm)",
      price: "$2,850",
      status: "Available",
      year: "2026",
      image: "/images/hero-painting.jpg"
    },
    {
      id: "art-2",
      title: "Solitude in Amber",
      medium: "Mixed Media & Raw Umber",
      size: "60 × 40 in (152 × 101 cm)",
      price: "$3,400",
      status: "Reserved",
      year: "2026",
      image: "/images/hero-painting.jpg"
    },
    {
      id: "art-3",
      title: "Ethereal Gestures",
      medium: "Ink, Acrylic & Gesso on Canvas",
      size: "40 × 40 in (101 × 101 cm)",
      price: "$2,200",
      status: "Available",
      year: "2026",
      image: "/images/hero-painting.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#141416] flex flex-col selection:bg-[#141416] selection:text-white">
      {/* Global Toast Notification */}
      {inquiryNotice && (
        <div 
          id="global-toast-notification"
          className="fixed top-20 right-4 sm:right-8 z-50 px-5 py-3.5 bg-[#111111] text-white text-xs sm:text-sm font-sans shadow-xl border border-[#333333] flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4"
        >
          <span>{inquiryNotice}</span>
          <button 
            type="button" 
            onClick={() => setInquiryNotice(null)} 
            className="text-[#999999] hover:text-white transition-colors cursor-pointer text-base"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Main Navigation Bar */}
      <Navbar 
        brandName="calligraphy__by_ulain8261" 
        cartCount={cartCount}
        onNavigateHome={handleNavigateHome}
        onNavigatePaintings={handleNavigateCatalog}
      />

      {/* 2. Main Page View: Either Dedicated Product Detail Page or Full Homepage */}
      {selectedPainting ? (
        <PaintingDetailPage
          painting={selectedPainting}
          onNavigateHome={handleNavigateHome}
          onNavigateCatalog={handleNavigateCatalog}
          onSelectPainting={handleSelectPainting}
          cartCount={cartCount}
          onAddToCartSuccess={handleAddToCartSuccess}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            onShopClick={() => setModalType('shop')}
            onViewCollectionClick={() => setModalType('collection')}
          />

          {/* NEW PAINTINGS SECTION (Desktop 4 cards, tablet 2-3, mobile 1, no icons on art) */}
          <NewPaintings
            onSelectPainting={handleSelectPainting}
            onViewAll={handleViewAll}
          />

          {/* SOLD OUT PAINTINGS SECTION (Desktop 4 cards, tablet 2-3, mobile 1, no icons on art) */}
          <SoldOutPaintings
            onSelectPainting={handleSelectPainting}
            onViewAll={handleViewAll}
          />
        </main>
      )}

      {/* 3. Luxury Art Gallery Footer */}
      <Footer 
        brandName="calligraphy__by_ulain8261"
        email="hello@yourartgallery.com"
        phone="+92 300 1234567"
        address="Islamabad, Pakistan"
        onLinkClick={(linkName) => {
          if (linkName === 'Art Collections' || linkName === 'Our Artists') {
            setModalType('collection');
          } else {
            handleInquiry(`Section: ${linkName}`);
          }
        }}
      />

      {/* ================= MODALS & ROUTING OVERLAYS ================= */}

      {/* View All Grid Modal (/paintings/new or /paintings/sold-out) */}
      {viewAllCategory && (
        <PaintingsGridViewModal
          title={viewAllCategory === 'new' ? 'NEW PAINTINGS' : 'SOLD OUT PAINTINGS'}
          paintings={viewAllCategory === 'new' ? NEW_PAINTINGS : SOLD_OUT_PAINTINGS}
          onClose={handleCloseViewAll}
          onSelectPainting={(p) => {
            setSelectedPainting(p);
            setViewAllCategory(null);
            window.history.pushState(null, '', `/paintings/${p.slug}`);
          }}
        />
      )}

      {/* C. Minimalist Interactive Hero Preview Drawer / Modal */}
      {modalType && (
        <div 
          id="collection-preview-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl bg-white border border-[#E5E5E8] p-6 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-[#E5E5E8]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#555558] flex items-center gap-2 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#141416]" />
                  {modalType === 'shop' ? 'Available Original Works' : '2026 Editorial Series'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight font-bold text-[#141416] mt-2">
                  {modalType === 'shop' ? 'Acquire Original Paintings' : 'Collection Archive & Catalogue'}
                </h2>
                <p className="text-xs sm:text-sm text-[#4A4A4D] mt-1 font-normal">
                  Hand-crafted by calligraphy__by_ulain8261. Each piece accompanied by a signed Certificate of Authenticity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-2 text-[#555558] hover:text-black transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Paintings List */}
            <div className="py-6 overflow-y-auto space-y-6 flex-1 pr-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {samplePaintings.map((painting) => (
                  <div key={painting.id} className="group border border-[#E5E5E8] p-4 bg-[#F7F7F8] hover:border-[#141416]/50 transition-colors">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECECEE] mb-4">
                      <img 
                        src={painting.image} 
                        alt={painting.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] uppercase tracking-widest font-mono bg-white/90 text-[#141416] border border-[#D5D5D8] font-medium">
                        {painting.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold tracking-wide text-[#141416] uppercase">{painting.title}</h3>
                      <p className="text-[11px] text-[#555558]">{painting.medium}</p>
                      <p className="text-[10px] font-mono text-[#7A7A80]">{painting.size}</p>
                      <div className="pt-3 flex items-center justify-between border-t border-[#E5E5E8] mt-3">
                        <span className="text-xs font-mono font-semibold text-[#141416]">{painting.price}</span>
                        <button 
                          type="button"
                          onClick={() => handleInquiry(painting.title)}
                          className="text-[10px] uppercase tracking-widest text-[#4A4A4D] hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          Inquire <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Info */}
            <div className="pt-4 border-t border-[#E5E5E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555558]">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#141416]" /> Insured Art Courier</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#141416]" /> Provenance Guaranteed</span>
              </div>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-6 py-2.5 bg-[#141416] text-white text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                Close Catalogue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

