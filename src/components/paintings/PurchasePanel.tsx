import React, { useState } from 'react';
import { Minus, Plus, Bell, Check, Lock } from 'lucide-react';

export interface PurchasePanelProps {
  status: 'available' | 'sold_out' | 'NEW' | 'SOLD_OUT';
  isOriginal?: boolean;
  onAddToCart?: (quantity: number) => void;
  onBuyNow?: (quantity: number) => void;
  onNotifyMe?: (email: string) => void;
}

export const PurchasePanel: React.FC<PurchasePanelProps> = ({
  status,
  isOriginal = true,
  onAddToCart,
  onBuyNow,
  onNotifyMe,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isAvailable = status === 'available' || status === 'NEW';

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (isOriginal) {
      // Original 1-of-1 artworks cannot be increased beyond 1
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    setAddedAnimation(true);
    if (onAddToCart) onAddToCart(quantity);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAvailable) return;
    if (onBuyNow) onBuyNow(quantity);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    if (onNotifyMe) onNotifyMe(notifyEmail);
    setNotifySent(true);
    setTimeout(() => {
      setNotifyOpen(false);
      setNotifySent(false);
      setNotifyEmail('');
    }, 2500);
  };

  return (
    <div id="painting-purchase-panel" className="w-full flex flex-col space-y-4 pt-1">
      {isAvailable ? (
        <>
          {/* ================= QUANTITY CONTROLS ================= */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#777777]">
                QUANTITY
              </span>
              {isOriginal && (
                <span className="text-[11px] text-[#999999] tracking-tight">
                  One-of-a-kind original artwork
                </span>
              )}
            </div>

            <div 
              id="quantity-selector"
              className="inline-flex items-center border border-[#D5D5D5] rounded-[2px] bg-white text-[#111111]"
            >
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="w-10 h-9 flex items-center justify-center text-[#111111] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span 
                className="w-10 text-center font-medium text-sm select-none"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={isOriginal}
                className="w-10 h-9 flex items-center justify-center text-[#111111] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                aria-label={isOriginal ? 'Original piece is limited to 1' : 'Increase quantity'}
                title={isOriginal ? 'Original one-of-one piece' : undefined}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ================= PURCHASE ACTION BUTTONS ================= */}
          <div className="flex flex-col space-y-2.5 pt-2">
            {/* ADD TO CART */}
            <button
              id="btn-add-to-cart"
              type="button"
              onClick={handleAddToCart}
              className="w-full h-12 sm:h-13 bg-[#111111] hover:bg-[#252525] text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-[2px] shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none active:scale-[0.99]"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>ADDED TO CART</span>
                </>
              ) : (
                <span>ADD TO CART</span>
              )}
            </button>

            {/* BUY NOW */}
            <button
              id="btn-buy-now"
              type="button"
              onClick={handleBuyNow}
              className="w-full h-12 sm:h-13 bg-[#1F1F22] hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-[2px] shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none active:scale-[0.99]"
            >
              <span>BUY NOW</span>
            </button>
          </div>
        </>
      ) : (
        /* ================= SOLD OUT STATE ================= */
        <div id="sold-out-panel" className="flex flex-col space-y-3 pt-2">
          {/* Disabled SOLD OUT button */}
          <button
            id="btn-sold-out-disabled"
            type="button"
            disabled
            className="w-full h-12 sm:h-13 bg-[#E5E5E5] text-[#888888] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-[2px] cursor-not-allowed flex items-center justify-center gap-2 select-none"
          >
            <Lock className="w-4 h-4 text-[#888888]" />
            <span>SOLD OUT</span>
          </button>

          <p className="text-xs text-[#777777] leading-relaxed">
            This original one-of-one artwork has been acquired into a private collection and is no longer available for purchase.
          </p>

          {/* NOTIFY ME OPTION */}
          {!notifyOpen ? (
            <button
              id="btn-notify-me-toggle"
              type="button"
              onClick={() => setNotifyOpen(true)}
              className="w-full h-11 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-semibold tracking-[0.18em] uppercase rounded-[2px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>NOTIFY ME WHEN SIMILAR WORKS ARE RELEASED</span>
            </button>
          ) : (
            <form onSubmit={handleNotifySubmit} className="flex flex-col space-y-2 p-3 bg-[#F9F9F8] border border-[#E5E5E5] rounded-[2px]">
              <label htmlFor="notify-email-input" className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#111111]">
                Receive Curator Alerts for this Artist
              </label>
              <div className="flex gap-2">
                <input
                  id="notify-email-input"
                  type="email"
                  required
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-xs border border-[#CCCCCC] rounded-[2px] bg-white text-[#111111] focus:outline-none focus:border-[#111111]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-semibold tracking-wider uppercase rounded-[2px] hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  {notifySent ? 'Saved' : 'Notify Me'}
                </button>
              </div>
              {notifySent && (
                <span className="text-[11px] text-emerald-700 font-medium">
                  ✓ You will be notified when new releases by this artist become available.
                </span>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
};
