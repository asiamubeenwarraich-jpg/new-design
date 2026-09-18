import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  brandName?: string;
  cartCount?: number;
  currentPath?: string;
  onNavigateHome?: () => void;
  onNavigateNewPaintings?: () => void;
  onNavigateSoldPaintings?: () => void;
  onNavigateGifts?: () => void;
  onNavigatePacks?: () => void;
  onOpenCart?: () => void;
  onNavigateCart?: () => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName = "calligraphy__by_ulain8261",
  cartCount: propCartCount,
  currentPath = '/',
  onNavigateHome,
  onNavigateNewPaintings,
  onNavigateSoldPaintings,
  onNavigateGifts,
  onNavigatePacks,
  onOpenCart,
  onNavigateCart,
  onOpenSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount: ctxCartCount, openCart } = useCart();

  const displayCount = propCartCount !== undefined ? propCartCount : ctxCartCount;

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const handleNavNewPaintings = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateNewPaintings) {
      onNavigateNewPaintings();
    }
  };

  const handleNavSoldPaintings = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateSoldPaintings) {
      onNavigateSoldPaintings();
    }
  };

  const handleNavGifts = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateGifts) {
      onNavigateGifts();
    }
  };

  const handleNavPacks = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigatePacks) {
      onNavigatePacks();
    }
  };

  const handleCartAction = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigateCart) {
      onNavigateCart();
    } else if (onOpenCart) {
      onOpenCart();
    } else {
      openCart();
    }
  };

  const handleOpenSearchAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  return (
    <>
      <nav 
        id="main-navigation"
        className="w-full bg-[#F7F7F8] border-b border-[#E5E5E8] text-[#141416] sticky top-0 z-30 select-none backdrop-blur-xs"
        aria-label="Main Art Gallery Navigation"
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Name / Logo */}
          <div className="flex items-center min-w-0 pr-2">
            <a 
              id="nav-brand-link"
              href="/"
              onClick={handleBrandClick}
              className="text-[11px] xs:text-xs sm:text-sm md:text-base font-semibold tracking-[0.18em] sm:tracking-[0.24em] text-[#141416] hover:text-[#4A4A4D] transition-colors uppercase truncate max-w-[180px] xs:max-w-[220px] sm:max-w-none"
              title={brandName}
            >
              {brandName}
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10 text-xs tracking-[0.22em] uppercase font-medium text-[#4A4A4D]">
            <a 
              id="desktop-nav-new-paintings"
              href="/paintings/new" 
              onClick={handleNavNewPaintings}
              className={`hover:text-[#141416] transition-colors py-1 ${
                currentPath === '/paintings/new' ? 'text-[#141416] font-semibold border-b border-[#141416]' : ''
              }`}
            >
              New Paintings
            </a>
            <a 
              id="desktop-nav-sold-paintings"
              href="/paintings/sold" 
              onClick={handleNavSoldPaintings}
              className={`hover:text-[#141416] transition-colors py-1 ${
                currentPath === '/paintings/sold' || currentPath === '/paintings/sold-out' 
                  ? 'text-[#141416] font-semibold border-b border-[#141416]' 
                  : ''
              }`}
            >
              Sold Paintings
            </a>
            <a 
              id="desktop-nav-gifts"
              href="/gifts" 
              onClick={handleNavGifts}
              className={`hover:text-[#141416] transition-colors py-1 ${
                currentPath === '/gifts' ? 'text-[#141416] font-semibold border-b border-[#141416]' : ''
              }`}
            >
              Gifts
            </a>
            <a 
              id="desktop-nav-packs"
              href="/packs" 
              onClick={handleNavPacks}
              className={`hover:text-[#141416] transition-colors py-1 ${
                currentPath === '/packs' ? 'text-[#141416] font-semibold border-b border-[#141416]' : ''
              }`}
            >
              Packs
            </a>
          </div>

          {/* Utility Actions (Desktop & Mobile header bar) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Search Button */}
            <button 
              id="nav-search-button"
              type="button" 
              aria-label="Search Catalog"
              onClick={handleOpenSearchAction}
              className="p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {/* Shopping Cart Button */}
            <button 
              id="nav-cart-button"
              type="button" 
              aria-label="Shopping Bag"
              onClick={handleCartAction}
              className="relative p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {displayCount > 0 && (
                <span 
                  id="nav-cart-badge-count"
                  className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-[#141416] text-white text-[9px] font-bold flex items-center justify-center rounded-full font-mono"
                >
                  {displayCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="nav-mobile-toggle"
              type="button"
              aria-label="Open Navigation Menu"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* FULL-SCREEN / SLIDE-IN MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-50 bg-white text-[#141416] flex flex-col animate-in fade-in duration-200 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Top Header matching reference layout: [ LOGO ] [ SEARCH ] [ CART ] [ X ] */}
          <div className="w-full px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between border-b border-[#EBEBEF]">
            {/* Logo / Brand */}
            <a 
              id="mobile-nav-brand-link"
              href="/"
              onClick={handleBrandClick}
              className="text-xs sm:text-sm font-semibold tracking-[0.2em] sm:tracking-[0.24em] text-[#141416] uppercase truncate max-w-[190px] xs:max-w-none"
            >
              {brandName}
            </a>

            {/* Actions: [ SEARCH ] [ CART ] [ X ] */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button 
                id="mobile-nav-search-button"
                type="button" 
                aria-label="Search Catalog"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleOpenSearchAction(e);
                }}
                className="p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>

              <button 
                id="mobile-nav-cart-button"
                type="button" 
                aria-label="Shopping Cart"
                onClick={handleCartAction}
                className="relative p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                {displayCount > 0 && (
                  <span 
                    id="mobile-nav-cart-badge-count"
                    className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-[#141416] text-white text-[9px] font-bold flex items-center justify-center rounded-full font-mono"
                  >
                    {displayCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-nav-close-button"
                type="button"
                aria-label="Close Navigation Menu"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Below Header: Vertical Navigation Links with Generous Spacing */}
          <div className="flex-1 px-6 sm:px-10 py-10 sm:py-14 flex flex-col justify-start">
            <div className="flex flex-col space-y-7 sm:space-y-9 text-left">
              {/* 1. NEW PAINTINGS */}
              <div>
                <a
                  id="mobile-menu-link-new-paintings"
                  href="/paintings/new"
                  onClick={handleNavNewPaintings}
                  className="block text-sm sm:text-base font-medium tracking-[0.24em] uppercase text-[#141416] hover:text-[#707073] transition-colors py-1"
                >
                  NEW PAINTINGS
                </a>
              </div>

              {/* 2. SOLD PAINTINGS */}
              <div>
                <a
                  id="mobile-menu-link-sold-paintings"
                  href="/paintings/sold"
                  onClick={handleNavSoldPaintings}
                  className="block text-sm sm:text-base font-medium tracking-[0.24em] uppercase text-[#141416] hover:text-[#707073] transition-colors py-1"
                >
                  SOLD PAINTINGS
                </a>
              </div>

              {/* 3. GIFTS */}
              <div>
                <a
                  id="mobile-menu-link-gifts"
                  href="/gifts"
                  onClick={handleNavGifts}
                  className="block text-sm sm:text-base font-medium tracking-[0.24em] uppercase text-[#141416] hover:text-[#707073] transition-colors py-1"
                >
                  GIFTS
                </a>
              </div>

              {/* 4. PACKS */}
              <div>
                <a
                  id="mobile-menu-link-packs"
                  href="/packs"
                  onClick={handleNavPacks}
                  className="block text-sm sm:text-base font-medium tracking-[0.24em] uppercase text-[#141416] hover:text-[#707073] transition-colors py-1"
                >
                  PACKS
                </a>
              </div>

              {/* 5. SHOPPING CART */}
              <div className="pt-2">
                <button
                  id="mobile-menu-link-shopping-cart"
                  type="button"
                  onClick={handleCartAction}
                  className="w-full flex items-center justify-between text-sm sm:text-base font-medium tracking-[0.24em] uppercase text-[#141416] hover:text-[#707073] transition-colors py-1 text-left cursor-pointer"
                >
                  <span>SHOPPING CART</span>
                  {displayCount > 0 && (
                    <span 
                      id="mobile-menu-cart-count-badge"
                      className="font-mono text-xs font-semibold px-2 py-0.5 bg-[#141416] text-white rounded-full min-w-[20px] text-center"
                    >
                      {displayCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Minimal Subtle Brand Tagline at bottom of mobile menu */}
            <div className="mt-auto pt-12 border-t border-[#F0F0F3] text-[11px] tracking-[0.2em] uppercase text-[#8E8E93]">
              <span>Original Islamic Calligraphy & Art</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
