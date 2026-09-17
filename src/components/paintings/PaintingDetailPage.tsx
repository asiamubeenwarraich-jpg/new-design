import React, { useEffect, useState } from 'react';
import { Painting, ALL_PAINTINGS } from '../../data/paintings';
import { PaintingGallery } from './PaintingGallery';
import { PaintingInfo } from './PaintingInfo';
import { PaintingDetails } from './PaintingDetails';
import { PurchasePanel } from './PurchasePanel';
import { PaymentInfo } from './PaymentInfo';
import { PaintingTabs } from './PaintingTabs';
import { RelatedPaintings } from './RelatedPaintings';
import { Check, ShoppingBag } from 'lucide-react';

export interface PaintingDetailPageProps {
  painting: Painting;
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onSelectPainting: (painting: Painting) => void;
  cartCount?: number;
  onAddToCartSuccess?: (painting: Painting, quantity: number) => void;
}

export const PaintingDetailPage: React.FC<PaintingDetailPageProps> = ({
  painting,
  onNavigateHome,
  onNavigateCatalog,
  onSelectPainting,
  cartCount = 0,
  onAddToCartSuccess,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scroll to top when painting changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [painting.slug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddToCart = (quantity: number) => {
    showToast(`Added ${quantity} × "${painting.title}" to your cart`);
    if (onAddToCartSuccess) {
      onAddToCartSuccess(painting, quantity);
    }
  };

  const handleBuyNow = (quantity: number) => {
    showToast(`Proceeding to secure checkout for "${painting.title}"...`);
    if (onAddToCartSuccess) {
      onAddToCartSuccess(painting, quantity);
    }
  };

  const handleNotifyMe = (email: string) => {
    showToast(`Notification registered for ${email}. You will receive alerts for new releases.`);
  };

  // Provide gallery images array, fallback to main image if not populated
  const galleryImages =
    painting.images && painting.images.length > 0
      ? painting.images
      : [painting.image, painting.image, painting.image];

  return (
    <div id="painting-detail-page" className="min-h-screen bg-white text-[#111111] antialiased">
      {/* ================= BREADCRUMB NAVIGATION ================= */}
      <nav 
        id="painting-breadcrumb"
        className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-4"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center flex-wrap gap-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium text-[#777777]">
          <li>
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#111111] transition-colors cursor-pointer"
            >
              HOME
            </button>
          </li>
          <li className="select-none text-[#CCCCCC]">&gt;</li>
          <li>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="hover:text-[#111111] transition-colors cursor-pointer"
            >
              PAINTINGS
            </button>
          </li>
          <li className="select-none text-[#CCCCCC]">&gt;</li>
          <li className="text-[#111111] font-semibold truncate max-w-[240px] sm:max-w-none" aria-current="page">
            {painting.title}
          </li>
        </ol>
      </nav>

      {/* ================= MAIN TWO-COLUMN PRODUCT SECTION ================= */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pb-12 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* LEFT: IMAGE GALLERY (~55% ON DESKTOP) */}
          <div className="lg:col-span-7 w-full">
            <PaintingGallery
              title={painting.title}
              artist={painting.artist}
              images={galleryImages}
              status={painting.status}
            />
          </div>

          {/* RIGHT: PRODUCT INFO & PURCHASE PANEL (~45% ON DESKTOP) */}
          <div className="lg:col-span-5 w-full flex flex-col space-y-6 lg:pl-2">
            {/* 1. Title, Artist, Price, Availability */}
            <PaintingInfo
              title={painting.title}
              artist={painting.artist}
              price={painting.price}
              originalPrice={painting.originalPrice}
              currency={painting.currency}
              status={painting.status}
              isOriginal={painting.isOriginal !== false}
            />

            {/* 2. Painting Specific Details */}
            <PaintingDetails
              artist={painting.artist}
              medium={painting.medium}
              size={painting.size || painting.dimensions}
              dimensions={painting.dimensions}
              style={painting.style || painting.category}
              category={painting.category}
              year={painting.year}
              frame={painting.frame}
              type={painting.type}
            />

            {/* 3. Quantity, Add To Cart, Buy Now, Sold Out State */}
            <PurchasePanel
              status={painting.status}
              isOriginal={painting.isOriginal !== false}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onNotifyMe={handleNotifyMe}
            />

            {/* 4. Payment Information Box */}
            <PaymentInfo />

            {/* 5. Product Information Tabs & Compact Shipping Box */}
            <PaintingTabs painting={painting} />
          </div>
        </div>

        {/* ================= FAR BOTTOM: YOU MAY ALSO LIKE CAROUSEL ================= */}
        <RelatedPaintings
          currentSlug={painting.slug}
          paintings={ALL_PAINTINGS}
          onSelectPainting={onSelectPainting}
        />
      </main>

      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div 
          id="gallery-notification-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#111111] text-white text-xs font-medium tracking-wider uppercase rounded-[2px] shadow-xl border border-[#333333] animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
