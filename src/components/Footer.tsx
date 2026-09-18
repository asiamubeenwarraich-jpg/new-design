import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';

/* =========================================================================
   CUSTOMIZABLE PROPS & DATA
   ========================================================================= */

export interface FooterProps {
  brandName?: string;
  email?: string;
  phone?: string;
  address?: string;
  onLinkClick?: (linkName: string) => void;
  onNavigateAdmin?: () => void;
}

// Column 2: Customer Care Navigation Links
export const CUSTOMER_CARE_LINKS = [
  { name: 'FAQs', href: '#faqs' },
  { name: 'Shipping & Delivery', href: '#shipping' },
  { name: 'Returns & Refunds', href: '#returns' },
  { name: 'Contact Us', href: '#contact' },
  { name: 'Order Tracking', href: '#order-tracking' },
];

// Column 3: Information Navigation Links
export const INFORMATION_LINKS = [
  { name: 'About Us', href: '#about' },
  { name: 'Our Artists', href: '#artists' },
  { name: 'Art Collections', href: '#collections' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Privacy Policy', href: '#privacy' },
  { name: 'Terms & Conditions', href: '#terms' },
  { name: 'Payment Methods', href: '#payments' },
  { name: 'Admin Dashboard', href: '/admin' },
];

// Pinterest line icon component to match Lucide style
const PinterestIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    <line x1="12" y1="9" x2="12" y2="21" />
    <path d="M8 12a4 4 0 1 1 8 0c0 3-1.5 5.5-4 5.5s-2.5-.5-3-2" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({
  brandName = "calligraphy__by_ulain8261",
  email = "hello@yourartgallery.com",
  phone = "+92 300 1234567",
  address = "Islamabad, Pakistan",
  onLinkClick,
  onNavigateAdmin,
}) => {
  // Newsletter Form State & Feedback
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setStatus('success');
    setStatusMessage('Thank you for subscribing to our gallery updates.');
    setNewsletterEmail('');
    setTimeout(() => {
      setStatus('idle');
      setStatusMessage('');
    }, 4500);
  };

  const handleLink = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    if (name === 'Admin Dashboard' && onNavigateAdmin) {
      onNavigateAdmin();
      return;
    }
    if (onLinkClick) {
      onLinkClick(name);
    }
  };

  return (
    <footer 
      id="art-gallery-footer"
      className="w-full bg-[#F7F7F8] text-[#1E1E20] border-t border-[#E5E5E8] pt-[55px] md:pt-[65px] pb-[22px] md:pb-[25px] select-none"
      role="contentinfo"
      aria-label="Art Gallery Website Footer"
    >
      {/* Container with ~1400px maximum width and responsive padding */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-14 xl:px-16">
        
        {/* ================= 4-COLUMN MAIN CONTENT GRID ================= */}
        {/* Responsive layout: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-14 xl:gap-20 pb-12 md:pb-14">
          
          {/* ---------------- COLUMN 1: CONTACT US ---------------- */}
          <div className="space-y-4">
            <h3 
              id="footer-heading-contact"
              className="text-[15px] sm:text-[16px] font-semibold tracking-[0.08em] uppercase text-[#141416] pb-1"
            >
              CONTACT US
            </h3>

            <address className="not-italic space-y-3.5 pt-1 text-[13px] sm:text-[14px] text-[#4A4A4D] font-normal leading-relaxed">
              {/* Support Email */}
              <div className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 text-[#2B2B2E] shrink-0 mt-1 transition-colors group-hover:text-black" aria-hidden="true" />
                <a 
                  id="footer-contact-email"
                  href={`mailto:${email}`}
                  className="hover:text-black transition-colors underline-offset-4 hover:underline break-all tracking-[0.02em]"
                  aria-label={`Send email to ${email}`}
                >
                  {email}
                </a>
              </div>

              {/* Phone Number */}
              <div className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 text-[#2B2B2E] shrink-0 transition-colors group-hover:text-black" aria-hidden="true" />
                <a 
                  id="footer-contact-phone"
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="hover:text-black transition-colors tracking-[0.02em]"
                  aria-label={`Call us at ${phone}`}
                >
                  {phone}
                </a>
              </div>

              {/* Gallery Location */}
              <div className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 text-[#2B2B2E] shrink-0 mt-1 transition-colors group-hover:text-black" aria-hidden="true" />
                <span id="footer-contact-address" className="tracking-[0.02em] text-[#4A4A4D]">
                  {address}
                </span>
              </div>
            </address>
          </div>

          {/* ---------------- COLUMN 2: CUSTOMER CARE ---------------- */}
          <div className="space-y-4">
            <h3 
              id="footer-heading-customer-care"
              className="text-[15px] sm:text-[16px] font-semibold tracking-[0.08em] uppercase text-[#141416] pb-1"
            >
              CUSTOMER CARE
            </h3>

            <ul className="space-y-2.5 pt-1 text-[13px] sm:text-[14px] text-[#4A4A4D]" role="list">
              {CUSTOMER_CARE_LINKS.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => handleLink(e, link.name)}
                    className="inline-block tracking-[0.02em] hover:text-black hover:translate-x-0.5 transition-all duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- COLUMN 3: INFORMATION ---------------- */}
          <div className="space-y-4">
            <h3 
              id="footer-heading-information"
              className="text-[15px] sm:text-[16px] font-semibold tracking-[0.08em] uppercase text-[#141416] pb-1"
            >
              INFORMATION
            </h3>

            <ul className="space-y-2.5 pt-1 text-[13px] sm:text-[14px] text-[#4A4A4D]" role="list">
              {INFORMATION_LINKS.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    onClick={(e) => handleLink(e, link.name)}
                    className="inline-block tracking-[0.02em] hover:text-black hover:translate-x-0.5 transition-all duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- COLUMN 4: NEWSLETTER SIGNUP ---------------- */}
          <div className="space-y-4">
            <h3 
              id="footer-heading-newsletter"
              className="text-[15px] sm:text-[16px] font-semibold tracking-[0.08em] uppercase text-[#141416] pb-1"
            >
              NEWSLETTER SIGNUP
            </h3>

            <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.06em] leading-relaxed text-[#555558] font-medium">
              SUBSCRIBE TO OUR NEWSLETTER FOR<br className="hidden sm:inline" /> EXCLUSIVE ART &amp; GALLERY UPDATES
            </p>

            {/* Newsletter Input + Button Form */}
            <form onSubmit={handleNewsletterSubmit} className="pt-1 space-y-2" noValidate>
              <div className="flex items-stretch rounded-[3px] overflow-hidden border border-[#D5D5D8] focus-within:border-[#141416] transition-colors shadow-xs">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  autoComplete="email"
                  className="w-full bg-white text-[13px] text-[#141416] placeholder:text-[#8E8E93] px-3.5 py-2.5 focus:outline-none tracking-[0.01em]"
                  aria-invalid={status === 'error'}
                />
                <button
                  id="footer-newsletter-submit"
                  type="submit"
                  className="bg-[#141416] hover:bg-black text-white text-[11px] sm:text-[12px] font-semibold tracking-[0.14em] uppercase px-4 sm:px-5 py-2.5 transition-all duration-200 shrink-0 cursor-pointer active:scale-[0.98]"
                >
                  SUBSCRIBE
                </button>
              </div>

              {/* Status Message / Notification */}
              {statusMessage && (
                <p 
                  className={`text-[11px] font-medium pt-0.5 tracking-wide ${
                    status === 'success' ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                  role="status"
                >
                  {statusMessage}
                </p>
              )}
            </form>

            {/* Social Media Channels */}
            <div className="pt-2">
              <div className="flex items-center gap-4 text-[#3A3A3D]">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow our Art Gallery on Facebook"
                  className="hover:text-black hover:scale-110 transition-all duration-200 p-1"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow our Art Gallery on Instagram"
                  className="hover:text-black hover:scale-110 transition-all duration-200 p-1"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to our Art Gallery YouTube channel"
                  className="hover:text-black hover:scale-110 transition-all duration-200 p-1"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow our Art Gallery on TikTok"
                  className="hover:text-black hover:scale-110 transition-all duration-200 p-1"
                >
                  <Music2 className="w-4 h-4" />
                </a>

                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Explore our Art Gallery collections on Pinterest"
                  className="hover:text-black hover:scale-110 transition-all duration-200 p-1"
                >
                  <PinterestIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ================= BOTTOM SECTION (COPYRIGHT & PAYMENT ICONS) ================= */}
        <div className="border-t border-[#E5E5E8] pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-[12px] tracking-[0.05em] text-[#6A6A6F]">
          
          {/* Left Side: Copyright */}
          <div className="text-center sm:text-left">
            <p id="footer-copyright-text">
              &copy; 2026 {brandName.toUpperCase()}. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Right Side: Subtle Minimal Payment Icons */}
          <div 
            id="footer-payment-methods"
            className="flex items-center gap-3 shrink-0" 
            aria-label="Accepted payment methods: Visa, Mastercard, PayPal"
          >
            {/* Visa Badge */}
            <div 
              className="h-6 px-2.5 py-1 bg-white border border-[#DCDCE0] rounded-[2px] flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
              title="Visa"
            >
              <span className="text-[10px] font-black italic tracking-tighter text-[#1A1F71]">
                VISA
              </span>
            </div>

            {/* Mastercard Badge */}
            <div 
              className="h-6 px-2.5 py-1 bg-white border border-[#DCDCE0] rounded-[2px] flex items-center justify-center gap-0.5 opacity-85 hover:opacity-100 transition-opacity"
              title="Mastercard"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#EB001B] opacity-90" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] -ml-1.5 opacity-90" />
              <span className="text-[9px] font-semibold text-[#141416] ml-1 tracking-tight">
                mastercard
              </span>
            </div>

            {/* PayPal Badge */}
            <div 
              className="h-6 px-2.5 py-1 bg-white border border-[#DCDCE0] rounded-[2px] flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
              title="PayPal"
            >
              <span className="text-[10px] font-bold italic tracking-tight text-[#003087]">
                Pay<span className="text-[#0079C1]">Pal</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
