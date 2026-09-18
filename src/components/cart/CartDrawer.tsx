import React, { useEffect } from 'react';
import { useCart, CartItem } from '../../context/CartContext';
import { X, Minus, Plus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  onNavigateCatalog?: () => void;
  onNavigateCartPage?: () => void;
  onNavigatePainting?: (slug: string) => void;
  onNavigateCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateCatalog,
  onNavigateCartPage,
  onNavigatePainting,
  onNavigateCheckout,
}) => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    cartShipping,
    cartTotal,
  } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleExplorePaintings = () => {
    closeCart();
    if (onNavigateCatalog) {
      onNavigateCatalog();
    }
  };

  const handleViewCartPage = () => {
    closeCart();
    if (onNavigateCartPage) {
      onNavigateCartPage();
    }
  };

  const handleItemClick = (slug: string) => {
    closeCart();
    if (onNavigatePainting) {
      onNavigatePainting(slug);
    }
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      onClick={closeCart}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
    >
      <div
        id="cart-drawer-panel"
        className="relative w-full max-w-md sm:max-w-lg bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= DRAWER HEADER ================= */}
        <div className="px-6 py-5 border-b border-[#E5E5E8] flex items-center justify-between bg-[#F7F7F8]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#141416]" />
            <h2 className="text-sm sm:text-base font-semibold tracking-[0.16em] uppercase text-[#141416]">
              Shopping Bag ({cartCount})
            </h2>
          </div>
          <button
            id="cart-drawer-close"
            type="button"
            onClick={closeCart}
            className="p-1.5 -mr-1.5 text-[#555558] hover:text-black transition-colors cursor-pointer rounded-full hover:bg-black/5"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= DRAWER BODY ================= */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {cartItems.length === 0 ? (
            /* EMPTY CART STATE */
            <div
              id="cart-drawer-empty"
              className="h-full flex flex-col items-center justify-center text-center py-16 space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-[#F2F2F4] flex items-center justify-center text-[#77777A]">
                <ShoppingBag className="w-7 h-7 stroke-[1.25]" />
              </div>
              <div className="space-y-1.5 max-w-xs">
                <h3 className="text-base sm:text-lg font-bold tracking-[0.14em] uppercase text-[#141416]">
                  YOUR CART IS EMPTY
                </h3>
                <p className="text-xs text-[#666668] leading-relaxed">
                  You haven&apos;t added any paintings yet. Discover our curated collection of original works.
                </p>
              </div>
              <button
                id="cart-drawer-empty-explore-btn"
                type="button"
                onClick={handleExplorePaintings}
                className="mt-4 px-8 py-3.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition-all cursor-pointer shadow-xs"
              >
                EXPLORE PAINTINGS
              </button>
            </div>
          ) : (
            /* CART ITEMS LIST */
            <div id="cart-drawer-items-list" className="space-y-5 divide-y divide-[#EFEFEF]">
              {cartItems.map((item: CartItem) => {
                const formattedItemPrice = `Rs. ${item.price.toLocaleString()}`;
                const isOriginal = item.isOriginal !== false;

                return (
                  <div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    className="pt-5 first:pt-0 flex gap-4 items-start group"
                  >
                    {/* Artwork Thumbnail Image */}
                    <div
                      className="w-20 sm:w-24 aspect-[4/5] bg-[#F5F5F7] border border-[#E5E5E8] overflow-hidden shrink-0 cursor-pointer"
                      onClick={() => handleItemClick(item.slug)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Image fallback to placeholder artwork
                          (e.target as HTMLImageElement).src = '/images/paintings/coastal-serenity-1.jpg';
                        }}
                      />
                    </div>

                    {/* Painting Details & Actions */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            onClick={() => handleItemClick(item.slug)}
                            className="text-xs sm:text-sm font-semibold tracking-tight uppercase text-[#141416] hover:text-[#555558] transition-colors cursor-pointer truncate"
                            title={item.title}
                          >
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#666668] tracking-wide mt-0.5 truncate">
                          {item.artist}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-[#141416] font-mono mt-1.5">
                          {formattedItemPrice}
                        </p>

                        {isOriginal && (
                          <span className="inline-block mt-1 text-[10px] uppercase font-mono tracking-wider text-[#77777A] bg-[#F3F3F5] px-1.5 py-0.5 border border-[#E2E2E5]">
                            1-of-1 Original Artwork
                          </span>
                        )}
                      </div>

                      {/* Quantity & Remove Controls */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-[#D5D5D8] bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-[#141416] hover:bg-[#F2F2F4] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span
                            className="w-7 text-center text-xs font-semibold font-mono"
                            aria-live="polite"
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={isOriginal}
                            className="w-7 h-7 flex items-center justify-center text-[#141416] hover:bg-[#F2F2F4] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                            aria-label={
                              isOriginal
                                ? 'Original artwork is limited to 1'
                                : `Increase quantity of ${item.title}`
                            }
                            title={isOriginal ? 'Original artwork is 1-of-1' : undefined}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#77777A] hover:text-[#C53030] transition-colors flex items-center gap-1 cursor-pointer py-1"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>REMOVE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= DRAWER FOOTER / TOTALS ================= */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#E5E5E8] bg-[#FBFBFA] px-6 py-5 space-y-4">
            {/* Calculation Breakdown */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-[#555558]">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-[#141416]">
                  Rs. {cartSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#555558]">
                <span className="flex items-center gap-1.5">
                  <span>Shipping</span>
                  <span className="text-[10px] font-mono tracking-tight text-[#88888B]">(Insured Courier)</span>
                </span>
                <span className="font-mono font-medium text-[#141416]">
                  Rs. {cartShipping.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E5E5E8] flex items-center justify-between text-sm sm:text-base font-bold text-[#141416]">
                <span className="tracking-wide">Total</span>
                <span className="font-mono">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Delivery Guarantee Notice */}
            <div className="flex items-center gap-2 py-2 px-3 bg-[#F0F0F2] text-[11px] text-[#4A4A4D] rounded-none">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Includes Certificate of Authenticity & Insured Transit</span>
            </div>

            {/* Drawer Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                id="cart-drawer-checkout-btn"
                type="button"
                onClick={() => {
                  closeCart();
                  if (onNavigateCheckout) {
                    onNavigateCheckout();
                  } else {
                    window.history.pushState(null, '', '/checkout');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="w-full h-12 bg-[#141416] hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="cart-drawer-view-page-btn"
                type="button"
                onClick={handleViewCartPage}
                className="w-full h-11 bg-transparent hover:bg-[#EAEAEB] border border-[#141416] text-[#141416] text-xs font-semibold tracking-[0.18em] uppercase rounded-none transition-all cursor-pointer flex items-center justify-center"
              >
                VIEW FULL CART PAGE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
