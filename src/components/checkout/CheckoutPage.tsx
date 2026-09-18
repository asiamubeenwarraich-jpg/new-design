import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { CHECKOUT_CONFIG, ShippingOption } from '../../config/checkoutConfig';
import { 
  galleryDatabase, 
  CustomerShippingAddress, 
  OrderRecord, 
  SentEmail 
} from '../../services/galleryDatabase';
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Truck, 
  Mail, 
  CreditCard, 
  Banknote, 
  Tag, 
  AlertCircle,
  ExternalLink,
  Eye
} from 'lucide-react';

export type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmed';

interface CheckoutPageProps {
  onNavigateHome: () => void;
  onNavigateCatalog: () => void;
  onNavigateCart: () => void;
  initialStep?: CheckoutStep;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateHome,
  onNavigateCatalog,
  onNavigateCart,
  initialStep = 'information',
}) => {
  const { cartItems, clearCart } = useCart();

  // Current active step
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialStep);

  // Form State
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [country, setCountry] = useState(CHECKOUT_CONFIG.defaultCountry);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Shipping Method selection (default is standard Rs. 200)
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(
    CHECKOUT_CONFIG.shippingOptions.find((s) => s.isDefault) || CHECKOUT_CONFIG.shippingOptions[0]
  );

  // Payment Method selection
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  // Discount / Coupon Code
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    amount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Mobile Order Summary Drawer Collapse State
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Order Placement & Result
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [sentBuyerEmail, setSentBuyerEmail] = useState<SentEmail | null>(null);
  const [sentStoreOwnerEmail, setSentStoreOwnerEmail] = useState<SentEmail | null>(null);
  const [previewEmailModal, setPreviewEmailModal] = useState<SentEmail | null>(null);

  // User simulated logged in toggle
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const userEmail = "collector@contemporaryart.pk";

  // Verified items from live Database
  const [verifiedDbState, setVerifiedDbState] = useState(() => 
    galleryDatabase.verifyCheckoutItems(cartItems)
  );

  // Synchronize with database on cart or DB change
  useEffect(() => {
    const updateVerification = () => {
      setVerifiedDbState(galleryDatabase.verifyCheckoutItems(cartItems));
    };
    updateVerification();
    const unsubscribe = galleryDatabase.subscribe(updateVerification);
    return () => unsubscribe();
  }, [cartItems]);

  // Handle URL history state for checkout steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const path = window.location.pathname;
    if (path === '/checkout/shipping' && currentStep !== 'shipping' && currentStep !== 'confirmed') {
      setCurrentStep('shipping');
    } else if (path === '/checkout/payment' && currentStep !== 'payment' && currentStep !== 'confirmed') {
      setCurrentStep('payment');
    } else if (path === '/checkout/confirmed' && currentStep !== 'confirmed') {
      // stay or fallback
    }
  }, [currentStep]);

  // Set email if logged in
  useEffect(() => {
    if (isLoggedInUser && !email) {
      setEmail(userEmail);
    }
  }, [isLoggedInUser]);

  // -------------------------------------------------------------
  // Form Validation Logic
  // -------------------------------------------------------------
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value.trim()) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return 'Please enter a valid email address.';
        }
        return '';
      case 'firstName':
        return !value.trim() ? 'Please enter your first name.' : '';
      case 'lastName':
        return !value.trim() ? 'Please enter your last name.' : '';
      case 'address':
        return !value.trim() ? 'Please enter your street address.' : '';
      case 'city':
        return !value.trim() ? 'Please enter your city.' : '';
      case 'phone':
        if (!value.trim()) return 'Please enter a valid phone number.';
        if (!/^[\d\s+\-()]{7,16}$/.test(value.trim())) {
          return 'Please enter a valid phone number (e.g., 0300 1234567).';
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const validateAllInformationFields = (): boolean => {
    const newErrors: Record<string, string> = {
      email: validateField('email', email),
      firstName: validateField('firstName', firstName),
      lastName: validateField('lastName', lastName),
      address: validateField('address', address),
      city: validateField('city', city),
      phone: validateField('phone', phone),
    };

    setTouched({
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      city: true,
      phone: true,
    });

    setErrors(newErrors);
    return !Object.values(newErrors).some((msg) => msg.length > 0);
  };

  // -------------------------------------------------------------
  // Step Navigation Handlers
  // -------------------------------------------------------------
  const handleContinueToShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAllInformationFields()) {
      return;
    }
    setCurrentStep('shipping');
    window.history.pushState(null, '', '/checkout/shipping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueToPayment = () => {
    setCurrentStep('payment');
    window.history.pushState(null, '', '/checkout/payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------------------------------------------------------
  // Discount Code Verification (Server-Side / DB simulation)
  // -------------------------------------------------------------
  const handleApplyDiscount = () => {
    setCouponError(null);
    if (!discountCodeInput.trim()) {
      setCouponError('Please enter a discount code.');
      return;
    }

    setIsValidatingCoupon(true);
    setTimeout(() => {
      const result = galleryDatabase.validateCouponCode(
        discountCodeInput,
        verifiedDbState.subtotal,
        selectedShipping.amount
      );

      setIsValidatingCoupon(false);
      if (result.valid) {
        setAppliedCoupon({
          code: result.code,
          amount: result.discountAmount,
          message: result.message,
        });
        setDiscountCodeInput('');
      } else {
        setCouponError(result.message);
      }
    }, 400);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // -------------------------------------------------------------
  // Dynamic Pricing Calculations
  // -------------------------------------------------------------
  const dynamicSubtotal = verifiedDbState.subtotal;
  const dynamicShipping = selectedShipping.amount;
  const dynamicDiscount = appliedCoupon ? appliedCoupon.amount : 0;
  const dynamicTotal = Math.max(0, dynamicSubtotal + dynamicShipping - dynamicDiscount);

  // -------------------------------------------------------------
  // Place Order Action
  // -------------------------------------------------------------
  const handlePlaceOrder = () => {
    if (verifiedDbState.hasSoldOutItems) {
      setOrderError(
        `Cannot complete checkout: ${verifiedDbState.soldOutTitles.join(', ')} was marked SOLD OUT by curator.`
      );
      return;
    }

    setIsProcessing(true);
    setOrderError(null);

    setTimeout(() => {
      try {
        const shippingAddress: CustomerShippingAddress = {
          country,
          firstName,
          lastName,
          address,
          apartment,
          city,
          postalCode,
          phone,
        };

        const result = galleryDatabase.createOrder({
          customerEmail: email,
          marketingConsent,
          shippingAddress,
          shippingMethod: selectedShipping,
          paymentMethod,
          items: cartItems,
          discountAmount: dynamicDiscount,
          discountCode: appliedCoupon?.code,
        });

        setConfirmedOrder(result.order);
        setSentBuyerEmail(result.buyerEmail);
        setSentStoreOwnerEmail(result.storeOwnerEmail);
        clearCart();
        setCurrentStep('confirmed');
        window.history.pushState(null, '', '/checkout/confirmed');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: any) {
        setOrderError(err.message || 'An error occurred while creating your order.');
      } finally {
        setIsProcessing(false);
      }
    }, 900);
  };

  // Full Address String for summary
  const fullAddressString = `${address}${apartment ? `, ${apartment}` : ''}, ${city}, ${postalCode ? `${postalCode}, ` : ''}${country}`;

  // -------------------------------------------------------------
  // RENDER: ORDER CONFIRMED VIEW
  // -------------------------------------------------------------
  if (currentStep === 'confirmed' && confirmedOrder) {
    return (
      <div id="checkout-confirmed-page" className="min-h-screen bg-white text-[#141416] antialiased">
        <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
          {/* Header Brand */}
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-[#141416]">
              {CHECKOUT_CONFIG.storeName}
            </h1>
            <p className="text-xs tracking-[0.18em] uppercase text-[#666668] mt-1">
              {CHECKOUT_CONFIG.brandTagline}
            </p>
          </div>

          {/* Success Banner */}
          <div className="bg-[#F4F9F4] border border-[#C6E5C6] p-6 sm:p-8 rounded-lg text-center max-w-2xl mx-auto mb-10 shadow-xs">
            <CheckCircle2 className="w-14 h-14 text-[#2E7D32] mx-auto mb-3" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#2E7D32] block mb-1">
              Acquisition Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase text-[#141416]">
              ORDER CONFIRMED
            </h2>
            <p className="text-sm text-[#444446] mt-2 leading-relaxed">
              Thank you, <span className="font-semibold text-[#141416]">{confirmedOrder.shippingAddress.firstName}</span>! Your artwork order has been registered and is being prepared for museum-grade shipment.
            </p>
            <div className="inline-block mt-4 px-4 py-1.5 bg-white border border-[#D5E5D5] rounded text-xs font-mono font-bold text-[#141416]">
              Order Number: {confirmedOrder.orderNumber}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Left: Summary of Purchased Artwork */}
            <div className="border border-[#E5E5E8] rounded-lg p-6 bg-[#FAFAFA]">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#141416] pb-3 border-b border-[#E5E5E8] mb-4">
                Purchased Original Artwork
              </h3>
              <div className="space-y-4">
                {confirmedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded border border-[#E0E0E0]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold uppercase truncate text-[#141416]">{item.title}</h4>
                      <p className="text-xs text-[#666668]">{item.artist}</p>
                      <p className="text-[11px] text-[#88888B]">{item.medium}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-[#141416]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="block text-[11px] text-[#88888B]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Totals */}
              <div className="mt-6 pt-4 border-t border-[#E5E5E8] space-y-2 text-xs">
                <div className="flex justify-between text-[#666668]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#141416]">Rs. {confirmedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#666668]">
                  <span>Shipping ({confirmedOrder.shippingMethod.name})</span>
                  <span className="font-mono text-[#141416]">Rs. {confirmedOrder.shippingFee.toLocaleString()}</span>
                </div>
                {confirmedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E7D32] font-medium">
                    <span>Discount ({confirmedOrder.discountCode})</span>
                    <span className="font-mono">-Rs. {confirmedOrder.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E5E5E8] flex justify-between text-sm font-bold text-[#141416]">
                  <span>Total</span>
                  <span className="font-mono text-base">PKR Rs. {confirmedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right: Customer & Delivery Info */}
            <div className="space-y-6">
              <div className="border border-[#E5E5E8] rounded-lg p-6 bg-white space-y-4 text-xs">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#141416] pb-3 border-b border-[#E5E5E8]">
                  Customer & Shipping Info
                </h3>
                <div>
                  <span className="font-semibold text-[#88888B] uppercase block text-[10px]">Contact Information</span>
                  <span className="text-sm text-[#141416] block mt-0.5">{confirmedOrder.customerEmail}</span>
                  <span className="text-xs text-[#555558] block">{confirmedOrder.shippingAddress.phone}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#88888B] uppercase block text-[10px]">Shipping Address</span>
                  <p className="text-xs text-[#141416] mt-0.5 leading-relaxed">
                    {confirmedOrder.shippingAddress.firstName} {confirmedOrder.shippingAddress.lastName}<br />
                    {confirmedOrder.shippingAddress.address} {confirmedOrder.shippingAddress.apartment && `(${confirmedOrder.shippingAddress.apartment})`}<br />
                    {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-[#88888B] uppercase block text-[10px]">Shipping Method</span>
                  <span className="text-xs text-[#141416] block mt-0.5">
                    {confirmedOrder.shippingMethod.name} — {confirmedOrder.shippingMethod.estimatedDays}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#88888B] uppercase block text-[10px]">Payment Method & Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-[#F0F0F2] text-[#141416] font-medium rounded text-[11px]">
                      {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      confirmedOrder.paymentStatus === 'PAID' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'
                    }`}>
                      {confirmedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Email Audit Panel */}
              <div className="border border-[#D2E3FC] rounded-lg p-5 bg-[#F8FAFF]">
                <div className="flex items-center gap-2 mb-2 text-[#1773B0]">
                  <Mail className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Automated Notification System</h4>
                </div>
                <p className="text-[11px] text-[#555558] mb-3">
                  Two automated notifications were recorded and generated for this order in compliance with gallery workflow:
                </p>
                <div className="space-y-2">
                  {sentBuyerEmail && (
                    <button
                      type="button"
                      onClick={() => setPreviewEmailModal(sentBuyerEmail)}
                      className="w-full text-left p-2.5 bg-white border border-[#D5E1F0] hover:border-[#1773B0] rounded transition-all text-xs flex items-center justify-between group cursor-pointer"
                    >
                      <div className="truncate mr-2">
                        <span className="font-semibold text-[#141416] block">Buyer Confirmation Email</span>
                        <span className="text-[10px] text-[#77777A] truncate">To: {sentBuyerEmail.to} • {sentBuyerEmail.subject}</span>
                      </div>
                      <Eye className="w-4 h-4 text-[#1773B0] shrink-0 group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                  {sentStoreOwnerEmail && (
                    <button
                      type="button"
                      onClick={() => setPreviewEmailModal(sentStoreOwnerEmail)}
                      className="w-full text-left p-2.5 bg-white border border-[#D5E1F0] hover:border-[#1773B0] rounded transition-all text-xs flex items-center justify-between group cursor-pointer"
                    >
                      <div className="truncate mr-2">
                        <span className="font-semibold text-[#141416] block">Store Owner New-Order Alert</span>
                        <span className="text-[10px] text-[#77777A] truncate">To: {sentStoreOwnerEmail.to} • {sentStoreOwnerEmail.subject}</span>
                      </div>
                      <Eye className="w-4 h-4 text-[#1773B0] shrink-0 group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={onNavigateCatalog}
              className="px-8 py-3.5 bg-[#141416] hover:bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-md transition-colors cursor-pointer"
            >
              Continue Exploring Paintings
            </button>
          </div>
        </div>

        {/* Email Preview Modal */}
        {previewEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-2xl border border-[#E5E5E8] max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between pb-4 border-b border-[#E5E5E8]">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#1773B0] font-bold">
                    {previewEmailModal.recipientType === 'buyer' ? 'Customer Dispatch Email' : 'Store Owner Alert'}
                  </span>
                  <h3 className="text-base font-bold text-[#141416] mt-0.5">{previewEmailModal.subject}</h3>
                  <span className="text-xs text-[#666668]">Sent to: {previewEmailModal.to} • {previewEmailModal.sentAt}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewEmailModal(null)}
                  className="text-[#88888B] hover:text-black text-lg p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="py-4 overflow-y-auto flex-1 font-mono text-xs whitespace-pre-wrap text-[#222224] bg-[#F9F9FA] p-4 rounded border border-[#EAEAEC]">
                {previewEmailModal.bodyText}
              </div>
              <div className="pt-4 border-t border-[#E5E5E8] text-right">
                <button
                  type="button"
                  onClick={() => setPreviewEmailModal(null)}
                  className="px-5 py-2 bg-[#141416] text-white text-xs uppercase font-semibold rounded"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: MAIN SHOPIFY-STYLE 2-COLUMN CHECKOUT LAYOUT
  // -------------------------------------------------------------
  return (
    <div id="shopify-checkout-container" className="min-h-screen bg-white text-[#333333] antialiased">
      {/* ================= MOBILE ORDER SUMMARY DRAWER / ACCORDION ================= */}
      <div className="lg:hidden border-b border-[#E1E3E5] bg-[#FAFAFA]">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full py-4 px-4 sm:px-8 flex items-center justify-between text-xs sm:text-sm text-[#1773B0] font-medium cursor-pointer"
          aria-expanded={mobileSummaryOpen}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#1773B0]" />
            <span>{mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
            {mobileSummaryOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="font-bold text-[#141416] font-mono text-sm sm:text-base">
            PKR Rs. {dynamicTotal.toLocaleString()}
          </span>
        </button>

        {mobileSummaryOpen && (
          <div className="px-4 sm:px-8 pb-6 pt-2 border-t border-[#E1E3E5] bg-[#F8F9FA] space-y-5 animate-in fade-in duration-150">
            {/* Cart Items List */}
            <div className="space-y-4 pt-2">
              {cartItems.length === 0 ? (
                <p className="text-xs text-[#707070]">Your cart is currently empty.</p>
              ) : (
                verifiedDbState.verifiedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="relative w-16 h-16 bg-[#ECECEC] rounded-md border border-[#DCDCDC] shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/paintings/coastal-serenity-1.jpg';
                        }}
                      />
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#707070] text-white text-[11px] font-bold rounded-full flex items-center justify-center font-mono">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-semibold text-[#141416] truncate text-xs">{item.title}</h4>
                      <p className="text-[11px] text-[#707070] truncate">{item.artist}</p>
                      <p className="text-[10px] text-[#8C8C8C]">{item.medium}</p>
                    </div>
                    <span className="font-mono font-medium text-xs text-[#141416] shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Discount Code Box */}
            <div className="pt-3 border-t border-[#E1E3E5]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCodeInput}
                  onChange={(e) => setDiscountCodeInput(e.target.value)}
                  placeholder="Discount code"
                  className="flex-1 px-3 py-2 text-xs border border-[#D9D9D9] rounded-md focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0] outline-none uppercase font-mono"
                />
                <button
                  type="button"
                  disabled={isValidatingCoupon}
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 bg-[#C8C8C8] hover:bg-[#1773B0] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  {isValidatingCoupon ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-[11px] text-[#DE3618] mt-1.5">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-[#2E7D32] bg-[#EBF7EE] p-2 mt-2 rounded">
                  <span>{appliedCoupon.message}</span>
                  <button type="button" onClick={handleRemoveCoupon} className="font-bold text-sm ml-2">✕</button>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div className="pt-3 border-t border-[#E1E3E5] space-y-2 text-xs">
              <div className="flex justify-between text-[#707070]">
                <span>Subtotal</span>
                <span className="font-mono text-[#141416]">Rs. {dynamicSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#707070]">
                <span>Shipping</span>
                <span className="font-mono text-[#141416]">Rs. {dynamicShipping.toLocaleString()}</span>
              </div>
              {dynamicDiscount > 0 && (
                <div className="flex justify-between text-[#2E7D32]">
                  <span>Discount</span>
                  <span className="font-mono">-Rs. {dynamicDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E1E3E5] flex justify-between text-sm font-bold text-[#141416]">
                <span>Total</span>
                <span className="font-mono">PKR Rs. {dynamicTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MAIN SPLIT: LEFT 55% | RIGHT 45% ================= */}
      <div className="w-full max-w-[1400px] mx-auto min-h-screen flex flex-col lg:flex-row">
        {/* =============================================================
            LEFT SIDE (APPROX 55%): BRAND, STEPS, FORM (Information / Shipping / Payment)
            ============================================================= */}
        <div className="w-full lg:w-[56%] xl:w-[58%] px-4 sm:px-10 lg:pl-16 lg:pr-14 py-8 sm:py-12 flex flex-col justify-between">
          <div>
            {/* Gallery Branding / Logo */}
            <div className="mb-6">
              <button
                type="button"
                onClick={onNavigateHome}
                className="text-left group cursor-pointer inline-block"
              >
                <span className="text-xs tracking-[0.25em] uppercase font-bold text-[#1773B0] block">
                  Art Gallery & Studio
                </span>
                <span className="text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-[#141416] group-hover:text-[#1773B0] transition-colors">
                  {CHECKOUT_CONFIG.storeName}
                </span>
              </button>
            </div>

            {/* Breadcrumb Steps: Cart > Information > Shipping > Payment */}
            <nav aria-label="Checkout Steps" className="mb-8">
              <ol className="flex items-center flex-wrap gap-2 text-xs font-medium">
                <li>
                  <button
                    type="button"
                    onClick={onNavigateCart}
                    className="text-[#1773B0] hover:underline cursor-pointer"
                  >
                    Cart
                  </button>
                </li>
                <li className="text-[#999999] select-none">&gt;</li>
                <li>
                  <button
                    type="button"
                    disabled={currentStep === 'information'}
                    onClick={() => {
                      setCurrentStep('information');
                      window.history.pushState(null, '', '/checkout');
                    }}
                    className={`${
                      currentStep === 'information'
                        ? 'text-[#141416] font-bold'
                        : 'text-[#1773B0] hover:underline cursor-pointer'
                    }`}
                  >
                    Information
                  </button>
                </li>
                <li className="text-[#999999] select-none">&gt;</li>
                <li>
                  <button
                    type="button"
                    disabled={currentStep === 'information'}
                    onClick={() => {
                      if (validateAllInformationFields()) {
                        setCurrentStep('shipping');
                        window.history.pushState(null, '', '/checkout/shipping');
                      }
                    }}
                    className={`${
                      currentStep === 'shipping'
                        ? 'text-[#141416] font-bold'
                        : currentStep === 'payment'
                        ? 'text-[#1773B0] hover:underline cursor-pointer'
                        : 'text-[#707070]'
                    }`}
                  >
                    Shipping
                  </button>
                </li>
                <li className="text-[#999999] select-none">&gt;</li>
                <li>
                  <span
                    className={`${
                      currentStep === 'payment'
                        ? 'text-[#141416] font-bold'
                        : 'text-[#707070]'
                    }`}
                  >
                    Payment
                  </span>
                </li>
              </ol>
            </nav>

            {/* Global Order Error / Sold Out Alert */}
            {orderError && (
              <div className="mb-6 p-4 bg-[#FFF4F2] border border-[#F1A99C] rounded-md text-xs text-[#DE3618] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{orderError}</span>
              </div>
            )}

            {/* ================= STEP 1: INFORMATION ================= */}
            {currentStep === 'information' && (
              <form onSubmit={handleContinueToShipping} noValidate className="space-y-8">
                {/* 1. Contact Information */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg sm:text-xl font-medium text-[#333333]">
                      Contact information
                    </h2>
                    <button
                      type="button"
                      onClick={() => setIsLoggedInUser(!isLoggedInUser)}
                      className="text-xs text-[#1773B0] hover:underline cursor-pointer"
                    >
                      {isLoggedInUser ? 'Log out' : 'Already have an account? Log in'}
                    </button>
                  </div>

                  {isLoggedInUser ? (
                    <div className="p-3 bg-[#F4F6F8] rounded-md border border-[#E1E3E5] text-xs flex items-center justify-between text-[#333333]">
                      <div>
                        <span className="text-[#707070] block text-[11px]">Logged in as:</span>
                        <span className="font-semibold">{email || userEmail}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Signed In
                      </span>
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="customer-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="customer-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (touched.email) handleBlur('email', e.target.value);
                        }}
                        onBlur={(e) => handleBlur('email', e.target.value)}
                        placeholder="Email address *"
                        required
                        className={`w-full px-3.5 py-3 text-sm border rounded-md outline-none transition-colors ${
                          errors.email && touched.email
                            ? 'border-[#DE3618] focus:border-[#DE3618] ring-1 ring-[#DE3618]/20'
                            : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]'
                        }`}
                      />
                      {errors.email && touched.email && (
                        <p className="text-xs text-[#DE3618] mt-1.5">{errors.email}</p>
                      )}
                    </div>
                  )}

                  {/* News & Updates Checkbox */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      id="marketing-consent"
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="w-4 h-4 text-[#1773B0] rounded border-[#D9D9D9] focus:ring-[#1773B0] cursor-pointer"
                    />
                    <label htmlFor="marketing-consent" className="text-xs text-[#555558] cursor-pointer">
                      Email me with news and updates
                    </label>
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#333333] mb-3">
                    Shipping address
                  </h2>

                  <div className="space-y-3">
                    {/* Country / Region */}
                    <div>
                      <label htmlFor="shipping-country" className="sr-only">
                        Country / Region
                      </label>
                      <div className="relative">
                        <select
                          id="shipping-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-3.5 py-3 text-sm border border-[#D9D9D9] rounded-md outline-none bg-white focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0] cursor-pointer appearance-none"
                        >
                          {CHECKOUT_CONFIG.supportedCountries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#707070] absolute right-3 top-4 pointer-events-none" />
                      </div>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="shipping-first-name" className="sr-only">
                          First name
                        </label>
                        <input
                          id="shipping-first-name"
                          type="text"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            if (touched.firstName) handleBlur('firstName', e.target.value);
                          }}
                          onBlur={(e) => handleBlur('firstName', e.target.value)}
                          placeholder="First name *"
                          required
                          className={`w-full px-3.5 py-3 text-sm border rounded-md outline-none transition-colors ${
                            errors.firstName && touched.firstName
                              ? 'border-[#DE3618] focus:border-[#DE3618] ring-1 ring-[#DE3618]/20'
                              : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]'
                          }`}
                        />
                        {errors.firstName && touched.firstName && (
                          <p className="text-xs text-[#DE3618] mt-1.5">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="shipping-last-name" className="sr-only">
                          Last name
                        </label>
                        <input
                          id="shipping-last-name"
                          type="text"
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                            if (touched.lastName) handleBlur('lastName', e.target.value);
                          }}
                          onBlur={(e) => handleBlur('lastName', e.target.value)}
                          placeholder="Last name *"
                          required
                          className={`w-full px-3.5 py-3 text-sm border rounded-md outline-none transition-colors ${
                            errors.lastName && touched.lastName
                              ? 'border-[#DE3618] focus:border-[#DE3618] ring-1 ring-[#DE3618]/20'
                              : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]'
                          }`}
                        />
                        {errors.lastName && touched.lastName && (
                          <p className="text-xs text-[#DE3618] mt-1.5">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label htmlFor="shipping-address" className="sr-only">
                        Address
                      </label>
                      <input
                        id="shipping-address"
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (touched.address) handleBlur('address', e.target.value);
                        }}
                        onBlur={(e) => handleBlur('address', e.target.value)}
                        placeholder="Address *"
                        required
                        className={`w-full px-3.5 py-3 text-sm border rounded-md outline-none transition-colors ${
                          errors.address && touched.address
                            ? 'border-[#DE3618] focus:border-[#DE3618] ring-1 ring-[#DE3618]/20'
                            : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]'
                        }`}
                      />
                      {errors.address && touched.address && (
                        <p className="text-xs text-[#DE3618] mt-1.5">{errors.address}</p>
                      )}
                    </div>

                    {/* Apartment, suite, etc. (optional) */}
                    <div>
                      <label htmlFor="shipping-apartment" className="sr-only">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        id="shipping-apartment"
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="Apartment, suite, etc. (optional)"
                        className="w-full px-3.5 py-3 text-sm border border-[#D9D9D9] rounded-md outline-none focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]"
                      />
                    </div>

                    {/* City & Postal Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="shipping-city" className="sr-only">
                          City
                        </label>
                        <input
                          id="shipping-city"
                          type="text"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            if (touched.city) handleBlur('city', e.target.value);
                          }}
                          onBlur={(e) => handleBlur('city', e.target.value)}
                          placeholder="City *"
                          required
                          className={`w-full px-3.5 py-3 text-sm border rounded-md outline-none transition-colors ${
                            errors.city && touched.city
                              ? 'border-[#DE3618] focus:border-[#DE3618] ring-1 ring-[#DE3618]/20'
                              : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]'
                          }`}
                        />
                        {errors.city && touched.city && (
                          <p className="text-xs text-[#DE3618] mt-1.5">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="shipping-postal" className="sr-only">
                          Postal code
                        </label>
                        <input
                          id="shipping-postal"
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="Postal code"
                          className="w-full px-3.5 py-3 text-sm border border-[#D9D9D9] rounded-md outline-none focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="shipping-phone" className="sr-only">
                        Phone
                      </label>
                      <input
                        id="shipping-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (touched.phone) handleBlur('phone', e.target.value);
                        }}
                        onBlur={(e) => handleBlur('phone', e.target.value)}
                        placeholder="Phone *"
                        required
                        className={`w-full px-3.5 py-3 text-sm border rounded-md outline-none transition-colors ${
                          errors.phone && touched.phone
                            ? 'border-[#DE3618] focus:border-[#DE3618] ring-1 ring-[#DE3618]/20'
                            : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]'
                        }`}
                      />
                      {errors.phone && touched.phone && (
                        <p className="text-xs text-[#DE3618] mt-1.5">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Bottom Buttons */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={onNavigateCart}
                    className="text-xs sm:text-sm text-[#1773B0] hover:underline flex items-center gap-1.5 cursor-pointer py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to cart</span>
                  </button>

                  <button
                    id="btn-continue-to-shipping"
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#1773B0] hover:bg-[#135d8f] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    Continue to shipping
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 2: SHIPPING ================= */}
            {currentStep === 'shipping' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Recap Box: Contact & Ship to */}
                <div className="border border-[#D9D9D9] rounded-md divide-y divide-[#E1E3E5] text-xs">
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-[#707070] w-16 shrink-0">Contact</span>
                      <span className="text-[#141416] font-medium truncate max-w-[200px] sm:max-w-none">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('information')}
                      className="text-[#1773B0] hover:underline cursor-pointer ml-2"
                    >
                      Change
                    </button>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-[#707070] w-16 shrink-0">Ship to</span>
                      <span className="text-[#141416] font-medium truncate max-w-[200px] sm:max-w-none">{fullAddressString}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('information')}
                      className="text-[#1773B0] hover:underline cursor-pointer ml-2"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Shipping Method Section */}
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#333333] mb-3">
                    Shipping method
                  </h2>

                  <div className="border border-[#D9D9D9] rounded-md divide-y divide-[#E1E3E5] overflow-hidden bg-white">
                    {CHECKOUT_CONFIG.shippingOptions.map((opt) => {
                      const isSelected = selectedShipping.id === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#F4F9FC]' : 'hover:bg-[#FAFAFA]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              checked={isSelected}
                              onChange={() => setSelectedShipping(opt)}
                              className="mt-1 w-4 h-4 text-[#1773B0] focus:ring-[#1773B0] cursor-pointer"
                            />
                            <div>
                              <span className="text-xs sm:text-sm font-medium text-[#141416] block">
                                {opt.name}
                              </span>
                              <span className="text-xs text-[#707070] block mt-0.5">
                                {opt.estimatedDays} • {opt.description}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-xs sm:text-sm font-semibold text-[#141416] pl-2">
                            Rs. {opt.amount.toLocaleString()}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Action Buttons */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('information')}
                    className="text-xs sm:text-sm text-[#1773B0] hover:underline flex items-center gap-1.5 cursor-pointer py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to information</span>
                  </button>

                  <button
                    id="btn-continue-to-payment"
                    type="button"
                    onClick={handleContinueToPayment}
                    className="w-full sm:w-auto px-7 py-3.5 bg-[#1773B0] hover:bg-[#135d8f] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    Continue to payment
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: PAYMENT ================= */}
            {currentStep === 'payment' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Recap Box: Contact, Ship to, Method */}
                <div className="border border-[#D9D9D9] rounded-md divide-y divide-[#E1E3E5] text-xs">
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-[#707070] w-16 shrink-0">Contact</span>
                      <span className="text-[#141416] font-medium truncate max-w-[200px] sm:max-w-none">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('information')}
                      className="text-[#1773B0] hover:underline cursor-pointer ml-2"
                    >
                      Change
                    </button>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-[#707070] w-16 shrink-0">Ship to</span>
                      <span className="text-[#141416] font-medium truncate max-w-[200px] sm:max-w-none">{fullAddressString}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('information')}
                      className="text-[#1773B0] hover:underline cursor-pointer ml-2"
                    >
                      Change
                    </button>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-[#707070] w-16 shrink-0">Method</span>
                      <span className="text-[#141416] font-medium">
                        {selectedShipping.name} · Rs. {selectedShipping.amount.toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="text-[#1773B0] hover:underline cursor-pointer ml-2"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Payment Section */}
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#333333]">Payment</h2>
                  <p className="text-xs text-[#707070] mt-1 mb-3">
                    All transactions are securely processed.
                  </p>

                  <div className="border border-[#D9D9D9] rounded-md divide-y divide-[#E1E3E5] overflow-hidden bg-white">
                    {/* Method 1: Cash on Delivery (COD) */}
                    <div>
                      <label className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'cod' ? 'bg-[#F4F9FC]' : 'hover:bg-[#FAFAFA]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0] cursor-pointer"
                          />
                          <span className="text-xs sm:text-sm font-medium text-[#141416]">
                            Cash on Delivery (COD)
                          </span>
                        </div>
                        <Banknote className="w-4 h-4 text-[#707070]" />
                      </label>
                      {paymentMethod === 'cod' && (
                        <div className="p-4 bg-[#F8F9FA] border-t border-[#E1E3E5] text-xs text-[#555558] space-y-1.5 leading-relaxed">
                          <p>
                            Pay in cash upon physical delivery of your original artwork to your doorstep.
                          </p>
                          <p className="text-[11px] text-[#707070]">
                            The courier provides an art inspection slip and Certificate of Authenticity before collecting payment.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Method 2: Online Payment */}
                    <div>
                      <label className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                        paymentMethod === 'online' ? 'bg-[#F4F9FC]' : 'hover:bg-[#FAFAFA]'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === 'online'}
                            onChange={() => setPaymentMethod('online')}
                            className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0] cursor-pointer"
                          />
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-[#141416] block">
                              Online Payment / Bank Transfer
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#707070]">
                          <CreditCard className="w-4 h-4" />
                          <span>Debit / Card</span>
                        </div>
                      </label>
                      {paymentMethod === 'online' && (
                        <div className="p-4 bg-[#F8F9FA] border-t border-[#E1E3E5] text-xs text-[#555558] space-y-2">
                          <p>
                            Direct automated payment gateway session.
                          </p>
                          <div className="p-3 bg-white border border-[#E1E3E5] rounded text-[11px] space-y-1 text-[#444446]">
                            <div className="flex items-center gap-2 text-emerald-800 font-medium">
                              <ShieldCheck className="w-4 h-4" />
                              <span>256-bit Bank Grade Encryption</span>
                            </div>
                            <p className="text-[#77777A]">
                              Raw card numbers, CVVs, and credentials are never captured or saved in our database. Payment secrets are processed server-side.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing Address Section */}
                <div>
                  <h3 className="text-sm font-medium text-[#333333] mb-2">Billing address</h3>
                  <div className="border border-[#D9D9D9] rounded-md divide-y divide-[#E1E3E5] overflow-hidden bg-white text-xs">
                    <label className={`p-3.5 flex items-center gap-3 cursor-pointer ${
                      billingSameAsShipping ? 'bg-[#F4F9FC]' : ''
                    }`}>
                      <input
                        type="radio"
                        name="billingOption"
                        checked={billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(true)}
                        className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span className="text-[#141416]">Same as shipping address</span>
                    </label>

                    <label className={`p-3.5 flex items-center gap-3 cursor-pointer ${
                      !billingSameAsShipping ? 'bg-[#F4F9FC]' : ''
                    }`}>
                      <input
                        type="radio"
                        name="billingOption"
                        checked={!billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(false)}
                        className="w-4 h-4 text-[#1773B0] focus:ring-[#1773B0]"
                      />
                      <span className="text-[#141416]">Use a different billing address</span>
                    </label>
                  </div>
                </div>

                {/* Payment Action Buttons */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="text-xs sm:text-sm text-[#1773B0] hover:underline flex items-center gap-1.5 cursor-pointer py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to shipping</span>
                  </button>

                  <button
                    id="btn-place-order"
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#1773B0] hover:bg-[#135d8f] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? 'Processing...'
                        : paymentMethod === 'cod'
                        ? 'Place Order'
                        : 'Pay Now'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Copyright */}
          <div className="pt-12 mt-12 border-t border-[#E1E3E5] text-[11px] text-[#707070] flex flex-wrap items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} {CHECKOUT_CONFIG.storeName}. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:underline">Privacy policy</a>
              <a href="#terms" className="hover:underline">Terms of service</a>
              <a href="#shipping" className="hover:underline">Shipping policy</a>
            </div>
          </div>
        </div>

        {/* =============================================================
            RIGHT SIDE (APPROX 45%): ORDER SUMMARY (Light Neutral Background)
            ============================================================= */}
        <div className="hidden lg:block w-full lg:w-[44%] xl:w-[42%] bg-[#F9FAFB] border-l border-[#E1E3E5] px-8 xl:px-12 py-12">
          <div className="sticky top-10 space-y-6">
            {/* Cart Items List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#707070]">
                  Your cart is currently empty.
                </div>
              ) : (
                verifiedDbState.verifiedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                    {/* 64x64 Image with Quantity Badge */}
                    <div className="relative w-16 h-16 bg-[#ECECEC] rounded-md border border-[#DCDCDC] shrink-0 overflow-visible">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/paintings/coastal-serenity-1.jpg';
                        }}
                      />
                      <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-[#707070] text-white text-[11px] font-bold rounded-full flex items-center justify-center font-mono shadow-xs">
                        {item.quantity}
                      </span>
                    </div>

                    {/* Title, Artist, Medium */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="font-semibold text-[#141416] text-xs truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#707070] truncate">{item.artist}</p>
                      <p className="text-[10px] text-[#8C8C8C]">{item.medium}</p>
                      {item.priceChanged && (
                        <span className="text-[10px] text-amber-700 font-medium block">
                          Price updated from database
                        </span>
                      )}
                    </div>

                    {/* Formatted Price */}
                    <span className="font-mono font-medium text-xs text-[#141416] shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Discount Code Section */}
            <div className="pt-4 border-t border-[#E1E3E5]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCodeInput}
                  onChange={(e) => setDiscountCodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyDiscount();
                    }
                  }}
                  placeholder="Discount code"
                  className="flex-1 px-3 py-2.5 text-xs border border-[#D9D9D9] rounded-md focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0] outline-none uppercase font-mono bg-white"
                />
                <button
                  type="button"
                  disabled={isValidatingCoupon}
                  onClick={handleApplyDiscount}
                  className="px-5 py-2.5 bg-[#1773B0] hover:bg-[#135d8f] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  {isValidatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>

              {couponError && (
                <p className="text-xs text-[#DE3618] mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{couponError}</span>
                </p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-[#2E7D32] bg-[#EBF7EE] border border-[#CDEBD4] p-2.5 mt-2 rounded-md">
                  <span className="font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {appliedCoupon.message}
                  </span>
                  <button 
                    type="button" 
                    onClick={handleRemoveCoupon} 
                    className="text-[#2E7D32] hover:text-black font-bold text-sm cursor-pointer ml-2"
                    aria-label="Remove coupon"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="pt-4 border-t border-[#E1E3E5] space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#707070]">
                <span>Subtotal</span>
                <span className="font-mono text-[#141416]">Rs. {dynamicSubtotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[#707070]">
                <div className="flex flex-col">
                  <span>Shipping</span>
                  <span className="text-[10px] text-[#8C8C8C]">{selectedShipping.name}</span>
                </div>
                <span className="font-mono text-[#141416]">Rs. {dynamicShipping.toLocaleString()}</span>
              </div>

              {dynamicDiscount > 0 && (
                <div className="flex items-center justify-between text-[#2E7D32] font-medium">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-Rs. {dynamicDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E1E3E5] flex items-center justify-between text-sm sm:text-base font-bold text-[#141416]">
                <span>Total</span>
                <div className="text-right">
                  <span className="text-[10px] text-[#707070] font-normal block font-sans">Including all local duties</span>
                  <span className="font-mono text-lg text-[#141416]">PKR Rs. {dynamicTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Note / Important Information Box */}
            <div className="pt-4 border-t border-[#E1E3E5]">
              <div className="p-4 bg-[#F2F4F7] border border-[#E1E3E5] rounded-md text-xs text-[#555558] space-y-2">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#141416] text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1773B0]" />
                  <span>IMPORTANT INFORMATION</span>
                </div>
                <ul className="space-y-1.5 text-[11px] leading-relaxed text-[#555558]">
                  {CHECKOUT_CONFIG.importantInformationNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#1773B0] font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
