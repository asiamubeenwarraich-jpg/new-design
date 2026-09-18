import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { Footer } from './components/Footer.tsx';
import { NewPaintings } from './components/paintings/NewPaintings.tsx';
import { SoldOutPaintings } from './components/paintings/SoldOutPaintings.tsx';
import { PaintingDetailPage } from './components/paintings/PaintingDetailPage.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { CartDrawer } from './components/cart/CartDrawer.tsx';
import { CartPage } from './components/cart/CartPage.tsx';
import { CheckoutPage, CheckoutStep } from './components/checkout/CheckoutPage.tsx';
import { AdminQuickModal } from './components/admin/AdminQuickModal.tsx';
import { AcquirePaintingsPage } from './components/pages/AcquirePaintingsPage.tsx';
import { CollectionArchivePage } from './components/pages/CollectionArchivePage.tsx';
import { NewPaintingsPage } from './components/pages/NewPaintingsPage.tsx';
import { SoldPaintingsPage } from './components/pages/SoldPaintingsPage.tsx';
import { GiftsPage } from './components/pages/GiftsPage.tsx';
import { PacksPage } from './components/pages/PacksPage.tsx';
import { SearchModal } from './components/search/SearchModal.tsx';
import { 
  Painting, 
  getPaintingBySlug 
} from './data/paintings.ts';
import { Pack } from './services/galleryDatabase.ts';
import { Database } from 'lucide-react';

function GalleryApp() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  
  // Page Route States
  const [isNewPaintingsPage, setIsNewPaintingsPage] = useState<boolean>(false);
  const [isSoldPaintingsPage, setIsSoldPaintingsPage] = useState<boolean>(false);
  const [isGiftsPage, setIsGiftsPage] = useState<boolean>(false);
  const [isPacksPage, setIsPacksPage] = useState<boolean>(false);
  const [isCartPage, setIsCartPage] = useState<boolean>(false);
  const [isShopPage, setIsShopPage] = useState<boolean>(false);
  const [isCollectionPage, setIsCollectionPage] = useState<boolean>(false);
  const [isCheckoutPage, setIsCheckoutPage] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('information');
  
  // Modals
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [inquiryNotice, setInquiryNotice] = useState<string | null>(null);

  const { cartCount, openCart, addToCart } = useCart();

  const resetAllViews = () => {
    setSelectedPainting(null);
    setIsNewPaintingsPage(false);
    setIsSoldPaintingsPage(false);
    setIsGiftsPage(false);
    setIsPacksPage(false);
    setIsCartPage(false);
    setIsShopPage(false);
    setIsCollectionPage(false);
    setIsCheckoutPage(false);
  };

  // Handle URL changes & deep linking
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      resetAllViews();

      if (path.startsWith('/checkout')) {
        setIsCheckoutPage(true);
        if (path === '/checkout/shipping') {
          setCheckoutStep('shipping');
        } else if (path === '/checkout/payment') {
          setCheckoutStep('payment');
        } else if (path === '/checkout/confirmed') {
          setCheckoutStep('confirmed');
        } else {
          setCheckoutStep('information');
        }
      } else if (path === '/cart') {
        setIsCartPage(true);
      } else if (path === '/paintings/new') {
        setIsNewPaintingsPage(true);
      } else if (path === '/paintings/sold' || path === '/paintings/sold-out') {
        setIsSoldPaintingsPage(true);
      } else if (path === '/gifts') {
        setIsGiftsPage(true);
      } else if (path === '/packs') {
        setIsPacksPage(true);
      } else if (path === '/shop' || path === '/acquire' || path === '/paintings/available' || path === '/shop-paintings') {
        setIsShopPage(true);
      } else if (path === '/collection' || path === '/collections' || path === '/catalogue' || path === '/archive') {
        setIsCollectionPage(true);
      } else if (path.startsWith('/paintings/')) {
        const slug = path.replace('/paintings/', '').replace(/\/$/, '');
        const matched = getPaintingBySlug(slug);
        if (matched) {
          setSelectedPainting(matched);
        }
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Navigation handlers
  const handleSelectPainting = (painting: Painting) => {
    resetAllViews();
    setSelectedPainting(painting);
    setCurrentPath(`/paintings/${painting.slug}`);
    window.history.pushState(null, '', `/paintings/${painting.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    resetAllViews();
    setCurrentPath('/');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateNewPaintings = () => {
    resetAllViews();
    setIsNewPaintingsPage(true);
    setCurrentPath('/paintings/new');
    window.history.pushState(null, '', '/paintings/new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSoldPaintings = () => {
    resetAllViews();
    setIsSoldPaintingsPage(true);
    setCurrentPath('/paintings/sold');
    window.history.pushState(null, '', '/paintings/sold');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateGifts = () => {
    resetAllViews();
    setIsGiftsPage(true);
    setCurrentPath('/gifts');
    window.history.pushState(null, '', '/gifts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigatePacks = () => {
    resetAllViews();
    setIsPacksPage(true);
    setCurrentPath('/packs');
    window.history.pushState(null, '', '/packs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateShop = () => {
    resetAllViews();
    setIsShopPage(true);
    setCurrentPath('/shop');
    window.history.pushState(null, '', '/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCollection = () => {
    resetAllViews();
    setIsCollectionPage(true);
    setCurrentPath('/collection');
    window.history.pushState(null, '', '/collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCart = () => {
    resetAllViews();
    setIsCartPage(true);
    setCurrentPath('/cart');
    window.history.pushState(null, '', '/cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCheckout = (step: CheckoutStep = 'information') => {
    resetAllViews();
    setIsCheckoutPage(true);
    setCheckoutStep(step);
    const targetUrl = step === 'information' ? '/checkout' : `/checkout/${step}`;
    setCurrentPath(targetUrl);
    window.history.pushState(null, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAll = (path: string) => {
    if (path === '/paintings/new') {
      handleNavigateNewPaintings();
    } else if (path === '/paintings/sold-out' || path === '/paintings/sold') {
      handleNavigateSoldPaintings();
    } else {
      handleNavigateShop();
    }
  };

  const handleInquiry = (title: string) => {
    setInquiryNotice(`Inquiry registered for "${title}". Our gallery advisor will respond promptly.`);
    setTimeout(() => setInquiryNotice(null), 4000);
  };

  const handleAddToCartPainting = (painting: Painting) => {
    addToCart(painting, 1);
    openCart();
  };

  const handleAddToCartPack = (pack: Pack) => {
    addToCart(pack as any, 1);
    openCart();
  };

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

      {/* Main Views: Checkout Flow OR Storefront / Dedicated Pages */}
      {isCheckoutPage ? (
        <CheckoutPage
          onNavigateHome={handleNavigateHome}
          onNavigateCatalog={handleNavigateNewPaintings}
          onNavigateCart={handleNavigateCart}
          initialStep={checkoutStep}
        />
      ) : (
        <>
          {/* Main Navigation Bar with Mobile Drawer & New Navigation Items */}
          <Navbar 
            brandName="calligraphy__by_ulain8261" 
            cartCount={cartCount}
            currentPath={currentPath}
            onNavigateHome={handleNavigateHome}
            onNavigateNewPaintings={handleNavigateNewPaintings}
            onNavigateSoldPaintings={handleNavigateSoldPaintings}
            onNavigateGifts={handleNavigateGifts}
            onNavigatePacks={handleNavigatePacks}
            onOpenCart={openCart}
            onNavigateCart={handleNavigateCart}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />

          {/* Slide-out Cart Drawer */}
          <CartDrawer 
            onNavigateCatalog={handleNavigateNewPaintings}
            onNavigateCartPage={handleNavigateCart}
            onNavigatePainting={(slug) => {
              const matched = getPaintingBySlug(slug);
              if (matched) handleSelectPainting(matched);
            }}
            onNavigateCheckout={() => handleNavigateCheckout('information')}
          />

          {/* Search Modal */}
          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onSelectPainting={(painting) => {
              setIsSearchModalOpen(false);
              handleSelectPainting(painting);
            }}
            onSelectPack={(pack) => {
              setIsSearchModalOpen(false);
              handleAddToCartPack(pack);
            }}
          />

          {/* Main Page Routing */}
          {isCartPage ? (
            <CartPage
              onNavigateHome={handleNavigateHome}
              onNavigateCatalog={handleNavigateNewPaintings}
              onSelectPainting={(slug) => {
                const matched = getPaintingBySlug(slug);
                if (matched) handleSelectPainting(matched);
              }}
              onNavigateCheckout={() => handleNavigateCheckout('information')}
            />
          ) : isNewPaintingsPage ? (
            <NewPaintingsPage
              onNavigateHome={handleNavigateHome}
              onSelectPainting={handleSelectPainting}
              onAddToCart={handleAddToCartPainting}
              onInquiry={handleInquiry}
            />
          ) : isSoldPaintingsPage ? (
            <SoldPaintingsPage
              onNavigateHome={handleNavigateHome}
              onSelectPainting={handleSelectPainting}
              onInquiry={handleInquiry}
            />
          ) : isGiftsPage ? (
            <GiftsPage
              onNavigateHome={handleNavigateHome}
              onSelectPainting={handleSelectPainting}
              onAddToCart={handleAddToCartPainting}
              onInquiry={handleInquiry}
            />
          ) : isPacksPage ? (
            <PacksPage
              onNavigateHome={handleNavigateHome}
              onAddToCart={handleAddToCartPack}
              onInquiry={handleInquiry}
            />
          ) : isShopPage ? (
            <AcquirePaintingsPage
              onNavigateHome={handleNavigateHome}
              onNavigateCollection={handleNavigateSoldPaintings}
              onSelectPainting={handleSelectPainting}
              onInquiry={handleInquiry}
            />
          ) : isCollectionPage ? (
            <CollectionArchivePage
              onNavigateHome={handleNavigateHome}
              onNavigateAcquire={handleNavigateNewPaintings}
              onSelectPainting={handleSelectPainting}
              onInquiry={handleInquiry}
            />
          ) : selectedPainting ? (
            <PaintingDetailPage
              painting={selectedPainting}
              onNavigateHome={handleNavigateHome}
              onNavigateCatalog={handleNavigateNewPaintings}
              onSelectPainting={handleSelectPainting}
              cartCount={cartCount}
            />
          ) : (
            <main className="flex-1">
              {/* Hero Section with direct page navigation */}
              <HeroSection
                onShopClick={handleNavigateNewPaintings}
                onViewCollectionClick={handleNavigateSoldPaintings}
              />

              {/* NEW PAINTINGS SECTION */}
              <NewPaintings
                onSelectPainting={handleSelectPainting}
                onViewAll={handleViewAll}
              />

              {/* SOLD OUT PAINTINGS SECTION */}
              <SoldOutPaintings
                onSelectPainting={handleSelectPainting}
                onViewAll={handleViewAll}
              />
            </main>
          )}

          {/* Luxury Art Gallery Footer */}
          <Footer 
            brandName="calligraphy__by_ulain8261"
            email="hello@yourartgallery.com"
            phone="+92 300 1234567"
            address="Islamabad, Pakistan"
            onLinkClick={(linkName) => {
              if (linkName === 'Art Collections' || linkName === 'Sold Paintings') {
                handleNavigateSoldPaintings();
              } else if (linkName === 'Our Artists' || linkName === 'Shop' || linkName === 'Paintings' || linkName === 'New Paintings') {
                handleNavigateNewPaintings();
              } else if (linkName === 'Gifts') {
                handleNavigateGifts();
              } else if (linkName === 'Packs') {
                handleNavigatePacks();
              } else if (linkName === 'Order Tracking' || linkName === 'Payment Methods' || linkName === 'Shopping Cart') {
                handleNavigateCart();
              } else {
                handleInquiry(`Section: ${linkName}`);
              }
            }}
          />
        </>
      )}

      {/* Floating Admin & Database Control Trigger */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          id="btn-open-admin-database"
          type="button"
          onClick={() => setIsAdminModalOpen(true)}
          className="px-3 py-2 bg-[#141416]/95 hover:bg-black text-white text-[11px] font-mono tracking-wider uppercase rounded-full shadow-lg border border-white/20 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
          title="Open Art Gallery Database & Admin Controls"
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin & Database</span>
        </button>
      </div>

      {/* Admin Panel Modal for Live DB Pricing, Status, Gift Flags, & Packs Management */}
      <AdminQuickModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <GalleryApp />
    </CartProvider>
  );
}
