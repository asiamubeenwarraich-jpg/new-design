import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ShoppingBag, Eye } from 'lucide-react';

/* =========================================================================
   EASY CONFIGURATION: Customize Image, Texts, and Buttons Here
   ========================================================================= */

// 1. REPLACE HERO IMAGE: Change the path below to your custom image
// You can use a local path in /public (e.g. "/images/hero-painting.jpg") or an external image URL.
export const HERO_IMAGE = "/images/hero-painting.jpg";

// 2. CHANGE HEADINGS & LABELS:
export const HERO_CONTENT = {
  // Store brand shown at the top of the hero
  brandName: "calligraphy__by_ulain8261",

  // Small uppercase category tag
  collectionTag: "ORIGINAL ART COLLECTION '26",

  // Large bold modern heading lines
  headingLine1: "ART THAT",
  headingLine2: "TELLS A STORY",

  // Subtitle / descriptive paragraph
  subheading: "Original paintings crafted to bring character, color, and emotion into your space.",

  // Button text & target actions
  buttonPrimaryText: "SHOP PAINTINGS",
  buttonSecondaryText: "VIEW COLLECTION",
};

export interface HeroSectionProps {
  heroImage?: string;
  brandName?: string;
  collectionTag?: string;
  headingLine1?: string;
  headingLine2?: string;
  subheading?: string;
  buttonPrimaryText?: string;
  buttonSecondaryText?: string;
  onShopClick?: () => void;
  onViewCollectionClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroImage = HERO_IMAGE,
  headingLine1 = HERO_CONTENT.headingLine1,
  headingLine2 = HERO_CONTENT.headingLine2,
  subheading = HERO_CONTENT.subheading,
  buttonPrimaryText = HERO_CONTENT.buttonPrimaryText,
  buttonSecondaryText = HERO_CONTENT.buttonSecondaryText,
  onShopClick,
  onViewCollectionClick,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (type: 'shop' | 'view') => {
    if (type === 'shop') {
      if (onShopClick) onShopClick();
      else showToast("Opening Paintings Catalog...");
    } else {
      if (onViewCollectionClick) onViewCollectionClick();
      else showToast("Viewing 2026 Collection...");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <section 
      id="hero-section"
      className="relative w-full min-h-[78vh] lg:h-[86vh] max-h-[1050px] flex flex-col justify-between overflow-hidden bg-[#F7F7F8]"
      aria-label="Art Gallery Hero Section"
    >
      {/* ================= BACKGROUND IMAGE CONTAINER ================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Artwork Image with subtle continuous ambient zoom */}
        <img
          id="hero-background-artwork"
          src={heroImage}
          alt="Original contemporary painting masterpiece"
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center transform transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-90' : 'opacity-70'
          } animate-subtle-zoom select-none`}
        />

        {/* Sophisticated light editorial overlay matching footer aesthetic */}
        {/* Layer 1: Directional gradient favoring the center-left content */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#F7F7F8]/95 via-[#F7F7F8]/80 to-[#F7F7F8]/30" 
          aria-hidden="true" 
        />
        {/* Layer 2: Subtle vertical gradient for top branding and bottom baseline integration */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#F7F7F8]/70 via-transparent to-[#F7F7F8]" 
          aria-hidden="true" 
        />
        {/* Layer 3: Subtle tonal scrim */}
        <div 
          className="absolute inset-0 bg-[#141416]/[0.02]" 
          aria-hidden="true" 
        />
      </div>

      {/* ================= MAIN CONTENT (CENTER-LEFT POSITIONED) ================= */}
      <main className="relative z-20 w-full flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto py-12 sm:py-20">
        <div className="max-w-3xl">
          {/* Large Bold Modern Heading */}
          <motion.h1
            id="hero-main-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[0.96] text-[#141416] mb-6 sm:mb-8 uppercase"
          >
            <span className="block">{headingLine1}</span>
            <span className="block text-[#1E1E20] mt-1 sm:mt-2">{headingLine2}</span>
          </motion.h1>

          {/* 3. Subheading Description */}
          <motion.p
            id="hero-subheading-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#4A4A4D] font-normal leading-relaxed max-w-xl mb-8 sm:mb-12 font-sans"
          >
            {subheading}
          </motion.p>

          {/* 4. Elegant Outline Buttons */}
          <motion.div
            id="hero-action-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-5"
          >
            {/* Button 1: SHOP PAINTINGS */}
            <button
              id="hero-button-shop"
              type="button"
              onClick={() => handleAction('shop')}
              className="group relative inline-flex items-center justify-center px-8 sm:px-9 py-4 sm:py-4.5 text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#141416] uppercase bg-transparent border border-[#141416] rounded-none transition-all duration-300 ease-out hover:bg-[#141416] hover:text-white active:scale-[0.98] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>{buttonPrimaryText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </span>
            </button>

            {/* Button 2: VIEW COLLECTION */}
            <button
              id="hero-button-view-collection"
              type="button"
              onClick={() => handleAction('view')}
              className="group relative inline-flex items-center justify-center px-8 sm:px-9 py-4 sm:py-4.5 text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#141416] uppercase bg-transparent border border-[#8E8E93] hover:border-[#141416] rounded-none transition-all duration-300 ease-out hover:bg-[#141416] hover:text-white active:scale-[0.98] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Eye className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>{buttonSecondaryText}</span>
              </span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* Notification Toast for Button Actions */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 right-6 z-50 bg-[#141416] text-white px-6 py-3 shadow-2xl text-xs font-semibold tracking-widest uppercase flex items-center gap-3 border border-neutral-800"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </section>
  );
};
