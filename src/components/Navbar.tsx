import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';

interface NavbarProps {
  brandName?: string;
  cartCount?: number;
  onNavigateHome?: () => void;
  onNavigatePaintings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName = "calligraphy__by_ulain8261",
  cartCount = 0,
  onNavigateHome,
  onNavigatePaintings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBrandClick = (e: React.MouseEvent) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  const handlePaintingsClick = (e: React.MouseEvent) => {
    if (onNavigatePaintings) {
      e.preventDefault();
      onNavigatePaintings();
    }
  };

  return (
    <nav 
      id="main-navigation"
      className="w-full bg-[#F7F7F8] border-b border-[#E5E5E8] text-[#141416] relative z-30 select-none"
      aria-label="Main Site Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 h-18 flex items-center justify-between">
        {/* Brand Name */}
        <div className="flex items-center gap-6">
          <a 
            id="nav-brand-link"
            href="/"
            onClick={handleBrandClick}
            className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.25em] text-[#141416] hover:text-[#4A4A4D] transition-colors uppercase"
          >
            {brandName}
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-xs tracking-[0.2em] uppercase font-medium text-[#4A4A4D]">
          <a 
            href="#paintings" 
            onClick={handlePaintingsClick}
            className="hover:text-[#141416] transition-colors"
          >
            Paintings
          </a>
          <a href="#collections" className="hover:text-[#141416] transition-colors">Collections</a>
          <a href="#calligraphy" className="hover:text-[#141416] transition-colors">Calligraphy</a>
          <a href="#exhibitions" className="hover:text-[#141416] transition-colors">Exhibitions</a>
          <a href="#about" className="hover:text-[#141416] transition-colors">The Artist</a>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-5">
          <button 
            id="nav-search-button"
            type="button" 
            aria-label="Search Catalog"
            className="p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button 
            id="nav-cart-button"
            type="button" 
            aria-label="Shopping Bag"
            className="relative p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#141416] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="nav-mobile-toggle"
            type="button"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#2B2B2E] hover:text-black transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E5E8] bg-[#F7F7F8] px-6 py-6 space-y-4 text-xs tracking-[0.2em] uppercase text-[#4A4A4D]">
          <a href="#paintings" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#141416]">Paintings</a>
          <a href="#collections" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#141416]">Collections</a>
          <a href="#calligraphy" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#141416]">Calligraphy</a>
          <a href="#exhibitions" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#141416]">Exhibitions</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-[#141416]">The Artist</a>
        </div>
      )}
    </nav>
  );
};
