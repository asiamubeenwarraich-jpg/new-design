import React, { useState } from 'react';
import { useCart, CartItem } from '../../context/CartContext';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ShieldCheck, 
  ShoppingBag, 
  Lock, 
  Check, 
  Truck, 
  CreditCard 
} from 'lucide-react';

interface CartPageProps {
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onSelectPainting: (slug: string) => void;
  onNavigateCheckout?: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateHome,
  onNavigateCatalog,
  onSelectPainting,
  onNavigateCheckout,
}) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    cartShipping,
    cartTotal,
  } = useCart();

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = () => {
    if (onNavigateCheckout) {
      onNavigateCheckout();
    } else {
      window.history.pushState(null, '', '/checkout');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div id="cart-page" className="min-h-screen bg-[#FBFBFA] text-[#141416] pb-24 antialiased">
      {/* ================= BREADCRUMB NAVIGATION ================= */}
      <nav 
        id="cart-breadcrumb"
        className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-4"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center flex-wrap gap-2 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium text-[#77777A]">
          <li>
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-[#141416] transition-colors cursor-pointer"
            >
              HOME
            </button>
          </li>
          <li className="select-none text-[#CCCCCC]">&gt;</li>
          <li>
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="hover:text-[#141416] transition-colors cursor-pointer"
            >
              PAINTINGS
            </button>
          </li>
          <li className="select-none text-[#CCCCCC]">&gt;</li>
          <li className="text-[#141416] font-semibold" aria-current="page">
            YOUR CART
          </li>
        </ol>
      </nav>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-2">
        {/* Page Title & Item Count Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 sm:pb-8 border-b border-[#E5E5E8] mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-[1.5px] bg-[#141416]" />
              <span className="text-[11px] font-semibold tracking-[0.25em] text-[#77777A] uppercase font-mono">
                ACQUISITION SUMMARY
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold uppercase tracking-[0.04em] text-[#141416]">
              SHOPPING CART
            </h1>
          </div>

          {cartItems.length > 0 && (
            <div className="flex items-center gap-4 text-xs tracking-wider uppercase font-semibold text-[#555558]">
              <span>{cartCount} {cartCount === 1 ? 'Painting' : 'Paintings'} Selected</span>
              <span className="text-[#CCCCCC]">•</span>
              <button
                type="button"
                onClick={clearCart}
                className="text-[#88888B] hover:text-[#C53030] transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* ================= ORDER SUCCESS OVERLAY ================= */}
        {checkoutComplete ? (
          <div className="max-w-2xl mx-auto py-16 text-center space-y-6 bg-white border border-[#E5E5E8] p-8 sm:p-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-[0.08em] uppercase text-[#141416]">
                Acquisition Order Received
              </h2>
              <p className="text-xs sm:text-sm text-[#555558] max-w-md mx-auto leading-relaxed">
                Thank you for acquiring original art with us. Your private gallery liaison is currently preparing your Certificate of Authenticity and insured courier dispatch.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={onNavigateCatalog}
                className="px-8 py-3.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                RETURN TO GALLERY
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* ================= 20. EMPTY CART DESIGN ================= */
          <div
            id="cart-empty-state"
            className="py-20 sm:py-28 text-center flex flex-col items-center justify-center space-y-6 bg-white border border-[#E5E5E8] px-6"
          >
            <div className="w-20 h-20 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#88888B]">
              <ShoppingBag className="w-9 h-9 stroke-[1.25]" />
            </div>
            
            <div className="space-y-2 max-w-md">
              <h2 className="text-xl sm:text-2xl font-bold tracking-[0.14em] uppercase text-[#141416]">
                YOUR CART IS EMPTY
              </h2>
              <p className="text-xs sm:text-sm text-[#666668] leading-relaxed">
                You haven&apos;t added any paintings yet.
              </p>
            </div>

            <button
              id="cart-empty-explore-button"
              type="button"
              onClick={onNavigateCatalog}
              className="mt-2 inline-flex items-center justify-center px-9 py-4 bg-[#141416] hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-200 cursor-pointer shadow-xs"
            >
              EXPLORE PAINTINGS
            </button>
          </div>
        ) : (
          /* ================= CART CONTENT LAYOUT (ITEMS + SUMMARY) ================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ================= LEFT: 6. CART ITEMS LIST (8 COLS) ================= */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-[#E5E5E8] divide-y divide-[#EBEBEF]">
                {cartItems.map((item: CartItem) => {
                  const formattedItemPrice = `Rs. ${item.price.toLocaleString()}`;
                  const isOriginal = item.isOriginal !== false;

                  return (
                    <div
                      key={item.id}
                      id={`cart-page-item-${item.id}`}
                      className="p-5 sm:p-7 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center justify-between group"
                    >
                      {/* Left Block: Image + Title/Artist/Price */}
                      <div className="flex gap-4 sm:gap-6 items-center min-w-0">
                        {/* Painting Image: Clean presentation, no overlay icons */}
                        <div
                          className="w-24 sm:w-28 md:w-32 aspect-[4/5] bg-[#F5F5F7] border border-[#E5E5E8] overflow-hidden shrink-0 cursor-pointer"
                          onClick={() => onSelectPainting(item.slug)}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/paintings/coastal-serenity-1.jpg';
                            }}
                          />
                        </div>

                        {/* Painting Info */}
                        <div className="flex flex-col space-y-1 min-w-0">
                          <h3
                            onClick={() => onSelectPainting(item.slug)}
                            className="text-sm sm:text-base md:text-lg font-bold tracking-tight uppercase text-[#141416] hover:text-[#555558] transition-colors cursor-pointer truncate"
                            title={item.title}
                          >
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-[#666668] tracking-wide">
                            {item.artist}
                          </p>

                          <p className="text-sm sm:text-base font-semibold text-[#141416] font-mono pt-1">
                            {formattedItemPrice}
                          </p>

                          {isOriginal && (
                            <div className="pt-1">
                              <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#66666A] bg-[#F2F2F4] px-2 py-0.5 border border-[#E0E0E4]">
                                1-of-1 Original Artwork
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Block: Quantity & Remove Button */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0F0F2]">
                        {/* Quantity Controls */}
                        <div className="flex flex-col sm:items-end">
                          <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#88888B] mb-1">
                            Quantity:
                          </span>
                          <div className="inline-flex items-center border border-[#D5D5D8] bg-white">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center text-[#141416] hover:bg-[#F2F2F4] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                              aria-label={`Decrease quantity of ${item.title}`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span 
                              className="w-9 text-center text-xs sm:text-sm font-semibold font-mono select-none"
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isOriginal}
                              className="w-8 h-8 flex items-center justify-center text-[#141416] hover:bg-[#F2F2F4] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                              aria-label={
                                isOriginal
                                  ? 'Original piece is limited to 1'
                                  : `Increase quantity of ${item.title}`
                              }
                              title={isOriginal ? 'Original artwork is limited to 1 piece' : undefined}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs font-semibold tracking-[0.18em] uppercase text-[#77777A] hover:text-[#C53030] transition-colors flex items-center gap-1.5 cursor-pointer py-1.5"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>REMOVE</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateCatalog}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-[#141416] hover:text-[#666668] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>CONTINUE SHOPPING</span>
                </button>
              </div>
            </div>

            {/* ================= RIGHT: 7. CART TOTAL / ORDER SUMMARY (4 COLS) ================= */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <div className="bg-white border border-[#E5E5E8] p-6 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#141416] pb-4 border-b border-[#E5E5E8]">
                  ORDER SUMMARY
                </h2>

                {/* Pricing Breakdown */}
                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-[#555558]">
                    <span>Subtotal</span>
                    <span className="font-mono font-medium text-[#141416]">
                      Rs. {cartSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#555558]">
                    <div className="flex flex-col">
                      <span>Shipping</span>
                      <span className="text-[10px] text-[#88888B]">Insured Art Courier</span>
                    </div>
                    <span className="font-mono font-medium text-[#141416]">
                      Rs. {cartShipping.toLocaleString()}
                    </span>
                  </div>

                  {/* Calculated Grand Total */}
                  <div className="pt-4 border-t border-[#E5E5E8] flex items-center justify-between text-base font-bold text-[#141416]">
                    <span className="tracking-wide">Total</span>
                    <span className="font-mono text-lg">
                      Rs. {cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="pt-3">
                  <button
                    id="cart-page-checkout-btn"
                    type="button"
                    onClick={handleCheckout}
                    className="w-full h-13 bg-[#141416] hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Lock className="w-4 h-4" />
                    <span>CHECKOUT</span>
                  </button>
                </div>

                {/* Payment & Security Badges */}
                <div className="pt-4 border-t border-[#E5E5E8] space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#88888B] block text-center">
                    Guaranteed Safe & Secure Checkout
                  </span>

                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#333333]">
                    <span className="px-2.5 py-1 bg-[#F7F7F8] border border-[#DCDCD8] text-[11px] font-bold text-[#1A1F71]">
                      VISA
                    </span>
                    <span className="px-2.5 py-1 bg-[#F7F7F8] border border-[#DCDCD8] text-[11px] font-bold text-[#EB001B]">
                      Mastercard
                    </span>
                    <span className="px-2.5 py-1 bg-[#F7F7F8] border border-[#DCDCD8] text-[11px] font-bold text-[#0070BA]">
                      Bank Transfer
                    </span>
                  </div>
                </div>
              </div>

              {/* Gallery Assurance Highlights */}
              <div className="bg-[#F7F7F8] border border-[#E5E5E8] p-5 space-y-3 text-xs text-[#555558]">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#141416] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#141416] block">Provenance & Certificate</span>
                    <span className="text-[11px] leading-relaxed">Each original piece includes a signed Certificate of Authenticity by the artist.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-[#EAEAEA]">
                  <Truck className="w-4 h-4 text-[#141416] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#141416] block">Museum-Grade Crated Packaging</span>
                    <span className="text-[11px] leading-relaxed">Reinforced wood casing and humidity-shielded layers guarantee safe arrival.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};
