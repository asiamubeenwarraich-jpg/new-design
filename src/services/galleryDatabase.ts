import { Painting, ALL_PAINTINGS, PaintingAvailability } from '../data/paintings';
import { CartItem } from '../context/CartContext';
import { CHECKOUT_CONFIG } from '../config/checkoutConfig';

const DB_PAINTINGS_KEY = 'art-gallery-database-paintings';
const DB_PACKS_KEY = 'art-gallery-database-packs';
const DB_ORDERS_KEY = 'art-gallery-orders';
const DB_EMAILS_KEY = 'art-gallery-sent-emails';

export interface Pack {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PACKS: Pack[] = [
  {
    id: 'pack-art-gift',
    title: 'Art Gift Pack (3 Mini Paintings)',
    slug: 'art-gift-pack',
    description: 'Curated gift set of 3 hand-finished miniature original paintings on archival Belgian canvas panels. Embellished with genuine gold leaf and presented in luxury collector gift sleeves.',
    price: 5000,
    image: '/images/hero-painting.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 'pack-premium-art',
    title: 'Premium Art Pack (5 Mini Paintings)',
    slug: 'premium-art-pack',
    description: 'Exclusive collector suite of 5 miniature original canvases exploring organic textures, calligraphy motifs, and mineral pigments. Arrives in a bespoke presentation box with signed authenticity certificate.',
    price: 9000,
    image: '/images/paintings/coastal-serenity-1.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-03-05T12:00:00.000Z',
  },
  {
    id: 'pack-calligraphy-trio',
    title: 'Calligraphy Master Trio Pack',
    slug: 'calligraphy-master-trio-pack',
    description: 'Triptych portfolio of 3 fine calligraphy studies in genuine 24k gold leaf and black Japanese sumi ink on handmade cotton rag paper. Perfect for executive gifting.',
    price: 15000,
    image: '/images/paintings/white-blossoms.jpg',
    status: 'AVAILABLE',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-10T12:00:00.000Z',
  },
];

export interface OrderItem {
  id: string;
  slug: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
  medium?: string;
  type?: string;
  isOriginal?: boolean;
}

export interface CustomerShippingAddress {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode?: string;
  phone: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  customerEmail: string;
  marketingConsent: boolean;
  shippingAddress: CustomerShippingAddress;
  shippingMethod: {
    id: string;
    name: string;
    amount: number;
    estimatedDays: string;
  };
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'PENDING' | 'PAID';
  orderStatus: 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
}

export interface SentEmail {
  id: string;
  recipientType: 'buyer' | 'store_owner';
  to: string;
  subject: string;
  sentAt: string;
  orderNumber: string;
  bodyText: string;
}

export interface CouponResult {
  valid: boolean;
  code: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountAmount: number;
  message: string;
}

// Internal listeners for reactive UI updates across admin and checkout
type DbListener = () => void;
const listeners: Set<DbListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in database listener:', e);
    }
  });
}

export const galleryDatabase = {
  subscribe(listener: DbListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getPaintings(): Painting[] {
    if (typeof window === 'undefined') return ALL_PAINTINGS;
    try {
      const stored = window.localStorage.getItem(DB_PAINTINGS_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(ALL_PAINTINGS));
        return ALL_PAINTINGS;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure isGift is populated from ALL_PAINTINGS default if undefined
        return parsed.map((item) => {
          if (item.isGift === undefined) {
            const defaultItem = ALL_PAINTINGS.find((p) => p.id === item.id || p.slug === item.slug);
            return { ...item, isGift: defaultItem?.isGift ?? false };
          }
          return item;
        });
      }
      return ALL_PAINTINGS;
    } catch (e) {
      console.error('Failed reading paintings database:', e);
      return ALL_PAINTINGS;
    }
  },

  getPaintingById(id: string): Painting | undefined {
    const all = this.getPaintings();
    return all.find((p) => p.id === id || p.slug === id);
  },

  getNewPaintings(): Painting[] {
    const all = this.getPaintings();
    return all.filter((p) => {
      const statusLower = (p.status || '').toLowerCase();
      // Status = NEW or available (excluding sold out)
      return p.status === 'NEW' || statusLower === 'new' || statusLower === 'available';
    });
  },

  getSoldPaintings(): Painting[] {
    const all = this.getPaintings();
    return all.filter((p) => {
      const statusLower = (p.status || '').toLowerCase();
      return p.status === 'SOLD_OUT' || statusLower === 'sold_out' || statusLower === 'sold';
    });
  },

  getGiftPaintings(): Painting[] {
    const all = this.getPaintings();
    return all.filter((p) => Boolean(p.isGift) === true);
  },

  searchPaintings(query: string): Painting[] {
    const trimmed = (query || '').trim().toLowerCase();
    if (!trimmed) return [];
    const all = this.getPaintings();
    return all.filter((p) => {
      const titleMatch = (p.title || '').toLowerCase().includes(trimmed);
      const artistMatch = (p.artist || '').toLowerCase().includes(trimmed);
      const categoryMatch = (p.category || '').toLowerCase().includes(trimmed);
      const mediumMatch = (p.medium || '').toLowerCase().includes(trimmed);
      const styleMatch = (p.style || '').toLowerCase().includes(trimmed);
      return titleMatch || artistMatch || categoryMatch || mediumMatch || styleMatch;
    });
  },

  createPainting(newPainting: Partial<Painting> & { title: string; price: number }): Painting {
    const all = this.getPaintings();
    const id = newPainting.id || `painting-${Date.now()}`;
    const slug = newPainting.slug || newPainting.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const formattedPrice = `Rs. ${newPainting.price.toLocaleString()}`;
    const status: PaintingAvailability = newPainting.status || 'NEW';
    const isGift = Boolean(newPainting.isGift);

    const created: Painting = {
      id,
      slug,
      title: newPainting.title,
      artist: newPainting.artist || 'calligraphy__by_ulain8261',
      price: newPainting.price,
      originalPrice: newPainting.originalPrice,
      formattedPrice,
      currency: 'PKR',
      status,
      image: newPainting.image || '/images/hero-painting.jpg',
      images: newPainting.images || [newPainting.image || '/images/hero-painting.jpg'],
      description: newPainting.description || 'Authentic original artwork from the gallery studio.',
      dimensions: newPainting.dimensions || '36 × 48 in (91 × 122 cm)',
      size: newPainting.size || '36 × 48 inches',
      medium: newPainting.medium || 'Oil & Mixed Media on Belgian Linen',
      style: newPainting.style || 'Contemporary Calligraphy & Abstract',
      category: newPainting.category || '2026 Editorial Series',
      year: newPainting.year || 2026,
      frame: newPainting.frame || 'Bespoke Gallery Frame',
      type: newPainting.type || 'Original Artwork',
      isOriginal: newPainting.isOriginal !== false,
      isGift,
    };

    all.unshift(created);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(all));
      }
      notifyListeners();
    } catch (e) {
      console.error('Error saving new painting to DB:', e);
    }
    return created;
  },

  updatePainting(id: string, updates: Partial<Painting>): boolean {
    const all = this.getPaintings();
    const index = all.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;

    const current = all[index];
    const updatedPrice = updates.price !== undefined ? updates.price : current.price;
    all[index] = {
      ...current,
      ...updates,
      price: updatedPrice,
      formattedPrice: `Rs. ${updatedPrice.toLocaleString()}`,
    };

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(all));
      }
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Error updating painting in DB:', e);
      return false;
    }
  },

  updatePaintingGift(id: string, isGift: boolean): boolean {
    return this.updatePainting(id, { isGift });
  },

  deletePainting(id: string): boolean {
    const all = this.getPaintings();
    const filtered = all.filter((p) => p.id !== id && p.slug !== id);
    if (filtered.length === all.length) return false;

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(filtered));
      }
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Error deleting painting from DB:', e);
      return false;
    }
  },

  // ================= PACKS DATABASE API =================
  getPacks(): Pack[] {
    if (typeof window === 'undefined') return DEFAULT_PACKS;
    try {
      const stored = window.localStorage.getItem(DB_PACKS_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(DEFAULT_PACKS));
        return DEFAULT_PACKS;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_PACKS;
    } catch (e) {
      console.error('Failed reading packs database:', e);
      return DEFAULT_PACKS;
    }
  },

  getPackById(id: string): Pack | undefined {
    const all = this.getPacks();
    return all.find((p) => p.id === id || p.slug === id);
  },

  getPackBySlug(slug: string): Pack | undefined {
    const all = this.getPacks();
    return all.find((p) => p.slug === slug || p.id === slug);
  },

  createPack(data: {
    title: string;
    description?: string;
    price: number;
    image?: string;
    status?: 'AVAILABLE' | 'SOLD_OUT' | 'DRAFT';
    slug?: string;
  }): Pack {
    const all = this.getPacks();
    const id = `pack-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const newPack: Pack = {
      id,
      title: data.title,
      slug,
      description: data.description || '',
      price: data.price,
      image: data.image || '/images/hero-painting.jpg',
      status: data.status || 'AVAILABLE',
      createdAt: now,
      updatedAt: now,
    };

    all.unshift(newPack);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(all));
      }
      notifyListeners();
    } catch (e) {
      console.error('Error saving new pack to DB:', e);
    }
    return newPack;
  },

  updatePack(id: string, updates: Partial<Pack>): boolean {
    const all = this.getPacks();
    const index = all.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;

    all[index] = {
      ...all[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(all));
      }
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Error updating pack in DB:', e);
      return false;
    }
  },

  deletePack(id: string): boolean {
    const all = this.getPacks();
    const filtered = all.filter((p) => p.id !== id && p.slug !== id);
    if (filtered.length === all.length) return false;

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(filtered));
      }
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Error deleting pack from DB:', e);
      return false;
    }
  },

  resetPacksDatabase(): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(DEFAULT_PACKS));
      }
      notifyListeners();
    } catch (e) {
      console.error('Error resetting packs database:', e);
    }
  },

  updatePaintingPrice(id: string, newPrice: number): boolean {
    const all = this.getPaintings();
    const index = all.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;

    all[index] = {
      ...all[index],
      price: newPrice,
      formattedPrice: `Rs. ${newPrice.toLocaleString()}`,
    };

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(all));
      }
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Error updating painting price in DB:', e);
      return false;
    }
  },

  updatePaintingStatus(id: string, newStatus: PaintingAvailability): boolean {
    const all = this.getPaintings();
    const index = all.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;

    all[index] = {
      ...all[index],
      status: newStatus,
    };

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(all));
      }
      notifyListeners();
      return true;
    } catch (e) {
      console.error('Error updating painting status in DB:', e);
      return false;
    }
  },

  resetPaintingsDatabase(): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(ALL_PAINTINGS));
      }
      notifyListeners();
    } catch (e) {
      console.error('Error resetting database:', e);
    }
  },

  /**
   * Recalculates cart items using LIVE database pricing and checks for SOLD OUT flags.
   */
  verifyCheckoutItems(cartItems: CartItem[]): {
    verifiedItems: Array<CartItem & { dbPrice: number; priceChanged: boolean; isSoldOutInDb: boolean; medium?: string }>;
    hasSoldOutItems: boolean;
    soldOutTitles: string[];
    subtotal: number;
  } {
    const dbPaintings = this.getPaintings();
    const dbPacks = this.getPacks();
    let hasSoldOutItems = false;
    const soldOutTitles: string[] = [];
    let subtotal = 0;

    const verifiedItems = cartItems.map((item) => {
      const dbMatch = dbPaintings.find((p) => p.id === item.id || p.slug === item.slug);
      const packMatch = !dbMatch ? dbPacks.find((pk) => pk.id === item.id || pk.slug === item.slug) : undefined;
      const effectiveMatch = dbMatch || packMatch;

      const dbPrice = effectiveMatch && typeof effectiveMatch.price === 'number' ? effectiveMatch.price : item.price;
      const isSoldOutInDb =
        effectiveMatch?.status === 'sold_out' ||
        effectiveMatch?.status === 'SOLD_OUT' ||
        item.status === 'sold_out' ||
        item.status === 'SOLD_OUT';

      if (isSoldOutInDb) {
        hasSoldOutItems = true;
        soldOutTitles.push(item.title);
      }

      const effectivePrice = dbPrice;
      subtotal += effectivePrice * item.quantity;

      return {
        ...item,
        price: effectivePrice,
        dbPrice,
        priceChanged: dbPrice !== item.price,
        isSoldOutInDb,
        medium: (dbMatch && dbMatch.medium) || (packMatch ? 'Art Pack Suite' : 'Oil on Canvas'),
      };
    });

    return {
      verifiedItems,
      hasSoldOutItems,
      soldOutTitles,
      subtotal,
    };
  },

  validateCouponCode(code: string, currentSubtotal: number, shippingFee: number): CouponResult {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return {
        valid: false,
        code: '',
        discountType: 'fixed',
        discountAmount: 0,
        message: 'Please enter a discount code.',
      };
    }

    if (trimmed === 'ART10') {
      const discount = Math.round(currentSubtotal * 0.1);
      return {
        valid: true,
        code: 'ART10',
        discountType: 'percentage',
        discountAmount: discount,
        message: `Coupon ART10 applied: 10% off (Rs. ${discount.toLocaleString()})`,
      };
    }

    if (trimmed === 'WELCOME5') {
      const discount = Math.round(currentSubtotal * 0.05);
      return {
        valid: true,
        code: 'WELCOME5',
        discountType: 'percentage',
        discountAmount: discount,
        message: `Coupon WELCOME5 applied: 5% off (Rs. ${discount.toLocaleString()})`,
      };
    }

    if (trimmed === 'FREESHIP') {
      return {
        valid: true,
        code: 'FREESHIP',
        discountType: 'shipping',
        discountAmount: shippingFee,
        message: `Coupon FREESHIP applied: Free Nationwide Courier (Rs. ${shippingFee.toLocaleString()})`,
      };
    }

    if (trimmed === 'GALLERY2000') {
      const discount = Math.min(2000, currentSubtotal);
      return {
        valid: true,
        code: 'GALLERY2000',
        discountType: 'fixed',
        discountAmount: discount,
        message: `Coupon GALLERY2000 applied: Rs. 2,000 off`,
      };
    }

    return {
      valid: false,
      code: trimmed,
      discountType: 'fixed',
      discountAmount: 0,
      message: 'Enter a valid discount code.',
    };
  },

  createOrder(params: {
    customerEmail: string;
    marketingConsent: boolean;
    shippingAddress: CustomerShippingAddress;
    shippingMethod: {
      id: string;
      name: string;
      amount: number;
      estimatedDays: string;
    };
    paymentMethod: 'cod' | 'online';
    items: CartItem[];
    discountAmount?: number;
    discountCode?: string;
  }): { order: OrderRecord; buyerEmail: SentEmail; storeOwnerEmail: SentEmail } {
    // 1. Re-verify prices & inventory against DB
    const verification = this.verifyCheckoutItems(params.items);
    if (verification.hasSoldOutItems) {
      throw new Error(`Cannot checkout: Painting(s) ${verification.soldOutTitles.join(', ')} are SOLD OUT.`);
    }

    const orderNumber = `ART-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAt = new Date().toISOString();
    const subtotal = verification.subtotal;
    const shippingFee = params.shippingMethod.amount;
    const discountAmount = params.discountAmount || 0;
    const total = Math.max(0, subtotal + shippingFee - discountAmount);

    const orderItems: OrderItem[] = verification.verifiedItems.map((i) => ({
      id: i.id,
      slug: i.slug,
      title: i.title,
      artist: i.artist,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
      medium: i.medium,
      type: i.type,
      isOriginal: i.isOriginal,
    }));

    const paymentStatus: 'PENDING' | 'PAID' = params.paymentMethod === 'cod' ? 'PENDING' : 'PAID';

    const order: OrderRecord = {
      orderNumber,
      createdAt,
      customerEmail: params.customerEmail,
      marketingConsent: params.marketingConsent,
      shippingAddress: params.shippingAddress,
      shippingMethod: params.shippingMethod,
      paymentMethod: params.paymentMethod,
      paymentStatus,
      orderStatus: 'PROCESSING',
      items: orderItems,
      subtotal,
      shippingFee,
      discountAmount,
      discountCode: params.discountCode,
      total,
    };

    // 2. Update Painting Inventory: If an original painting is ordered, mark its DB status as SOLD_OUT
    const dbPaintings = this.getPaintings();
    let dbChanged = false;
    orderItems.forEach((orderItem) => {
      if (orderItem.isOriginal !== false) {
        const pIdx = dbPaintings.findIndex((p) => p.id === orderItem.id || p.slug === orderItem.slug);
        if (pIdx > -1) {
          dbPaintings[pIdx] = {
            ...dbPaintings[pIdx],
            status: 'sold_out',
          };
          dbChanged = true;
        }
      }
    });

    if (dbChanged && typeof window !== 'undefined') {
      window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(dbPaintings));
    }

    // 3. Save order record
    const existingOrders = this.getOrders();
    const updatedOrders = [order, ...existingOrders];
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(updatedOrders));
    }

    // 4. Generate & record automated emails
    const customerFullName = `${params.shippingAddress.firstName} ${params.shippingAddress.lastName}`;
    const formattedAddress = `${params.shippingAddress.address}${params.shippingAddress.apartment ? `, ${params.shippingAddress.apartment}` : ''}, ${params.shippingAddress.city}, ${params.shippingAddress.country} (Phone: ${params.shippingAddress.phone})`;

    const itemsSummary = orderItems
      .map(
        (it) =>
          `• ${it.title} by ${it.artist} (Qty: ${it.quantity}) — Rs. ${(it.price * it.quantity).toLocaleString()}`
      )
      .join('\n');

    // Email 1: Confirmation to Buyer
    const buyerEmail: SentEmail = {
      id: `email-${Date.now()}-buyer`,
      recipientType: 'buyer',
      to: params.customerEmail,
      subject: `Order Confirmation — ${orderNumber}`,
      sentAt: new Date().toLocaleString(),
      orderNumber,
      bodyText: `Dear ${customerFullName},

Thank you for acquiring artwork from ${CHECKOUT_CONFIG.storeName}.

Order Number: ${orderNumber}
Payment Method: ${params.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
Payment Status: ${paymentStatus}

Purchased Painting(s):
${itemsSummary}

Subtotal: Rs. ${subtotal.toLocaleString()}
Shipping (${params.shippingMethod.name}): Rs. ${shippingFee.toLocaleString()}
${discountAmount > 0 ? `Discount (${params.discountCode || 'Applied'}): -Rs. ${discountAmount.toLocaleString()}\n` : ''}Total: PKR Rs. ${total.toLocaleString()}

Shipping Address:
${formattedAddress}

Estimated Delivery: ${params.shippingMethod.estimatedDays}

All original paintings are crated in museum-grade protective packaging accompanied by a signed Certificate of Authenticity.

Warm regards,
Private Collector Desk
${CHECKOUT_CONFIG.storeName}`,
    };

    // Email 2: Alert to Store Owner
    const storeOwnerEmail: SentEmail = {
      id: `email-${Date.now()}-owner`,
      recipientType: 'store_owner',
      to: CHECKOUT_CONFIG.storeOwnerEmail,
      subject: `NEW ART GALLERY ORDER — ${orderNumber}`,
      sentAt: new Date().toLocaleString(),
      orderNumber,
      bodyText: `New artwork acquisition received!

Order Number: ${orderNumber}
Order Status: PROCESSING
Payment Status: ${paymentStatus}
Payment Method: ${params.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}

Customer Details:
Name: ${customerFullName}
Email: ${params.customerEmail}
Phone: ${params.shippingAddress.phone}

Shipping Address:
${formattedAddress}

Purchased Artwork:
${itemsSummary}

Order Subtotal: Rs. ${subtotal.toLocaleString()}
Shipping Method: ${params.shippingMethod.name} (Rs. ${shippingFee.toLocaleString()})
${discountAmount > 0 ? `Discount Code: ${params.discountCode} (-Rs. ${discountAmount.toLocaleString()})\n` : ''}Total Amount: PKR Rs. ${total.toLocaleString()}

Action Required: Please arrange insured packing and prepare the Certificate of Authenticity.`,
    };

    const existingEmails = this.getSentEmails();
    const updatedEmails = [buyerEmail, storeOwnerEmail, ...existingEmails];
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_EMAILS_KEY, JSON.stringify(updatedEmails));
    }

    notifyListeners();

    return { order, buyerEmail, storeOwnerEmail };
  },

  getOrders(): OrderRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(DB_ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  getSentEmails(): SentEmail[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(DB_EMAILS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
};
