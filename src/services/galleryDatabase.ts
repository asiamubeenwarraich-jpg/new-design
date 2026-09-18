import { Painting, ALL_PAINTINGS, PaintingAvailability } from '../data/paintings';
import { CartItem } from '../context/CartContext';
import { CHECKOUT_CONFIG } from '../config/checkoutConfig';

// Storage Keys
const DB_PAINTINGS_KEY = 'art-gallery-database-paintings';
const DB_PACKS_KEY = 'art-gallery-database-packs';
const DB_ORDERS_KEY = 'art-gallery-orders';
const DB_EMAILS_KEY = 'art-gallery-sent-emails';
const DB_CATEGORIES_KEY = 'art-gallery-categories';
const DB_DISCOUNTS_KEY = 'art-gallery-discounts';
const DB_MESSAGES_KEY = 'art-gallery-messages';
const DB_NEWSLETTER_KEY = 'art-gallery-newsletter';
const DB_ADMIN_USERS_KEY = 'art-gallery-admin-users';
const DB_ADMIN_SESSION_KEY = 'art-gallery-admin-session';
const DB_AUDIT_LOG_KEY = 'art-gallery-audit-logs';
const DB_SETTINGS_KEY = 'art-gallery-store-settings';
const DB_HOMEPAGE_KEY = 'art-gallery-homepage-config';

// --------------------------------------------------------------------------
// TYPES & INTERFACES
// --------------------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Pack {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'DRAFT';
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

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
  customerName?: string;
  customerPhone?: string;
  marketingConsent: boolean;
  shippingAddress: CustomerShippingAddress;
  shippingMethod: {
    id: string;
    name: string;
    amount: number;
    estimatedDays: string;
  };
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

export interface MessageRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  createdAt?: string;
  read: boolean;
  status?: 'NEW' | 'REPLIED' | 'ARCHIVED';
}

export type CustomerInquiry = MessageRecord;
export type DiscountCode = Discount;

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscriptionDate: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  password?: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    avatar?: string;
  };
  loginAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  adminName: string;
  action: string;
  entity: 'PRODUCT' | 'ORDER' | 'CATEGORY' | 'PACK' | 'DISCOUNT' | 'SETTINGS' | 'USER' | 'INVENTORY';
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  phone: string;
  address: string;
  country: string;
  currency: string;
  defaultShippingFee: number;
  freeShippingThreshold: number;
  deliveryInfo: string;
  configuredPaymentMethods: string[];
  storeOwnerEmail: string;
  fromEmail: string;
  lowStockThreshold: number;
  enableCod?: boolean;
  enableCardPayments?: boolean;
  bankTransferDetails?: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  promotionalBannerText: string;
  promotionalBannerActive: boolean;
  featuredProductIds: string[];
  newPaintingsTitle: string;
  giftSectionTitle: string;
  packSectionTitle: string;
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

// --------------------------------------------------------------------------
// DEFAULT SEED DATA
// --------------------------------------------------------------------------

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-calligraphy', name: 'Calligraphy', slug: 'calligraphy', description: 'Masterful Islamic & modern script brushwork in 24k gold leaf and archival ink', image: '/images/hero-painting.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-islamic-art', name: 'Islamic Art', slug: 'islamic-art', description: 'Sacred geometric rhythms, divine verses, and contemporary spiritual compositions', image: '/images/paintings/white-blossoms.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-modern-art', name: 'Modern Art', slug: 'modern-art', description: 'Expressive minimalist and architectural works created for luxury contemporary spaces', image: '/images/paintings/coastal-serenity-1.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-abstract', name: 'Abstract', slug: 'abstract', description: 'Rich mineral impasto textures, subtle earth tones, and evocative non-figurative forms', image: '/images/paintings/inner-thoughts.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-landscape', name: 'Landscape', slug: 'landscape', description: 'Serene mountain vistas, Northern Pakistani highlands, and atmospheric horizon studies', image: '/images/paintings/mountain-lake.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-seascape', name: 'Seascape', slug: 'seascape', description: 'Tranquil coastal tides, deep marine pigments, and luminous twilight waters', image: '/images/paintings/coastal-serenity-2.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-floral', name: 'Floral', slug: 'floral', description: 'Botanical gestures, organic blossoms, and delicate springtime still lifes', image: '/images/paintings/white-blossoms.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-traditional', name: 'Traditional', slug: 'traditional', description: 'Heritage motifs, classic illumination, and time-honored pigment formulation', image: '/images/hero-painting.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'cat-contemporary', name: 'Contemporary', slug: 'contemporary', description: 'Avant-garde multimedia textures on raw Belgian linen', image: '/images/paintings/inner-thoughts.jpg', status: 'ACTIVE', createdAt: '2026-01-01T00:00:00.000Z' },
];

export const DEFAULT_PACKS: Pack[] = [
  {
    id: 'pack-art-gift',
    title: 'Art Gift Pack (3 Mini Paintings)',
    slug: 'art-gift-pack',
    description: 'Curated gift set of 3 hand-finished miniature original paintings on archival Belgian canvas panels. Embellished with genuine gold leaf and presented in luxury collector gift sleeves.',
    price: 5000,
    image: '/images/hero-painting.jpg',
    status: 'AVAILABLE',
    featured: true,
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
    featured: true,
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
    featured: false,
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-10T12:00:00.000Z',
  },
];

export const DEFAULT_DISCOUNTS: Discount[] = [
  {
    id: 'disc-art10',
    code: 'ART10',
    type: 'PERCENTAGE',
    value: 10,
    minOrder: 10000,
    maxDiscount: 15000,
    usedCount: 14,
    active: true,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'disc-welcome5',
    code: 'WELCOME5',
    type: 'PERCENTAGE',
    value: 5,
    minOrder: 5000,
    maxDiscount: 8000,
    usedCount: 27,
    active: true,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'disc-gallery2000',
    code: 'GALLERY2000',
    type: 'FIXED_AMOUNT',
    value: 2000,
    minOrder: 25000,
    usedCount: 6,
    active: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
];

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-super',
    name: 'Gallery Director',
    email: 'admin@gallery.com',
    role: 'SUPER_ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'admin-curator',
    name: 'Senior Curator',
    email: 'curator@gallery.com',
    role: 'ADMIN',
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'admin-editor',
    name: 'Editorial Staff',
    email: 'editor@gallery.com',
    role: 'EDITOR',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'calligraphy__by_ulain8261',
  storeEmail: 'hello@yourartgallery.com',
  phone: '+92 300 1234567',
  address: 'F-7 Markaz, Blue Area, Islamabad, Pakistan',
  country: 'Pakistan',
  currency: 'PKR',
  defaultShippingFee: 500,
  freeShippingThreshold: 50000,
  deliveryInfo: 'Insured White-Glove Courier Delivery in 3-5 Business Days across Pakistan. International express art shipping available upon request.',
  configuredPaymentMethods: [
    'Cash on Delivery (COD)',
    'Direct Bank Transfer (IBFT / Raast)',
    'Credit / Debit Card (Secure Checkout)',
  ],
  storeOwnerEmail: 'ulain8261@gallery.com',
  fromEmail: 'noreply@gallery.com',
  lowStockThreshold: 1,
  enableCod: true,
  enableCardPayments: true,
  bankTransferDetails: 'Meezan Bank - Account: 01020304050607 - IBAN: PK00MEZN0001020304050607 - Title: Calligraphy by Ulain',
  socialMedia: {
    instagram: 'https://instagram.com/calligraphy__by_ulain8261',
    facebook: 'https://facebook.com/calligraphybyulain',
    youtube: 'https://youtube.com/@artgallery',
    tiktok: 'https://tiktok.com/@artgallery',
  },
};

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  heroTitle: 'ART THAT TELLS A STORY',
  heroSubtitle: 'Original paintings crafted to bring character, color, and emotion into your space.',
  heroImage: '/images/hero-painting.jpg',
  promotionalBannerText: 'SPRING EDITORIAL 2026 • COMPLIMENTARY INSURED NATIONWIDE DELIVERY ON ORDERS OVER RS. 50,000',
  promotionalBannerActive: true,
  featuredProductIds: ['atmosphere-no-vii', 'ethereal-gestures', 'pack-art-gift'],
  newPaintingsTitle: 'NEW PAINTINGS',
  giftSectionTitle: 'CURATED GIFTS',
  packSectionTitle: 'ARTWORK SUITES & PACKS',
};

export const DEFAULT_ORDERS: OrderRecord[] = [
  {
    orderNumber: 'ART-849201',
    createdAt: '2026-03-16T14:32:00.000Z',
    customerEmail: 'dr.farhan@gmail.com',
    customerName: 'Dr. Farhan Malik',
    customerPhone: '+92 321 5551234',
    marketingConsent: true,
    shippingAddress: {
      firstName: 'Dr. Farhan',
      lastName: 'Malik',
      address: 'House 42, Street 18, Sector F-8/2',
      city: 'Islamabad',
      postalCode: '44000',
      country: 'Pakistan',
      phone: '+92 321 5551234',
    },
    shippingMethod: {
      id: 'express',
      name: 'Insured Art Courier',
      amount: 500,
      estimatedDays: '2-3 Business Days',
    },
    paymentMethod: 'online',
    paymentStatus: 'PAID',
    orderStatus: 'DELIVERED',
    items: [
      {
        id: 'solitude-in-amber',
        slug: 'solitude-in-amber',
        title: 'Solitude in Amber',
        artist: 'calligraphy__by_ulain8261',
        price: 95000,
        image: '/images/hero-painting.jpg',
        quantity: 1,
        medium: 'Mixed Media & Raw Umber',
        type: 'Original Artwork',
        isOriginal: true,
      },
    ],
    subtotal: 95000,
    shippingFee: 500,
    discountAmount: 0,
    total: 95500,
  },
  {
    orderNumber: 'ART-719342',
    createdAt: '2026-03-17T09:15:00.000Z',
    customerEmail: 'ayesha.rehman@outlook.com',
    customerName: 'Ayesha Rehman',
    customerPhone: '+92 301 9876543',
    marketingConsent: true,
    shippingAddress: {
      firstName: 'Ayesha',
      lastName: 'Rehman',
      address: 'Penthouse 5B, Creek Vistas, Phase 8 DHA',
      city: 'Karachi',
      postalCode: '75500',
      country: 'Pakistan',
      phone: '+92 301 9876543',
    },
    shippingMethod: {
      id: 'express',
      name: 'Insured Art Courier',
      amount: 500,
      estimatedDays: '3-4 Business Days',
    },
    paymentMethod: 'cod',
    paymentStatus: 'PENDING',
    orderStatus: 'PROCESSING',
    items: [
      {
        id: 'pack-art-gift',
        slug: 'art-gift-pack',
        title: 'Art Gift Pack (3 Mini Paintings)',
        artist: 'calligraphy__by_ulain8261',
        price: 5000,
        image: '/images/hero-painting.jpg',
        quantity: 2,
        medium: 'Belgian Canvas Panels',
        type: 'Gift Suite',
        isOriginal: false,
      },
    ],
    subtotal: 10000,
    shippingFee: 500,
    discountAmount: 1000,
    discountCode: 'ART10',
    total: 9500,
  },
  {
    orderNumber: 'ART-992314',
    createdAt: '2026-03-18T08:20:00.000Z',
    customerEmail: 'bilal.tariq@lahore.co',
    customerName: 'Bilal Tariq',
    customerPhone: '+92 333 4448899',
    marketingConsent: false,
    shippingAddress: {
      firstName: 'Bilal',
      lastName: 'Tariq',
      address: '24-C Gulberg III',
      city: 'Lahore',
      postalCode: '54000',
      country: 'Pakistan',
      phone: '+92 333 4448899',
    },
    shippingMethod: {
      id: 'express',
      name: 'Insured Art Courier',
      amount: 500,
      estimatedDays: '2-3 Business Days',
    },
    paymentMethod: 'online',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    items: [
      {
        id: 'rainy-evening',
        slug: 'rainy-evening',
        title: 'Rainy Evening',
        artist: 'calligraphy__by_ulain8261',
        price: 28000,
        image: '/images/paintings/coastal-serenity-1.jpg',
        quantity: 1,
        medium: 'Oil on Canvas',
        type: 'Original Artwork',
        isOriginal: true,
      },
    ],
    subtotal: 28000,
    shippingFee: 500,
    discountAmount: 0,
    total: 28500,
  },
];

export const DEFAULT_MESSAGES: MessageRecord[] = [
  {
    id: 'msg-1',
    name: 'Zubair Ahmed',
    email: 'z.ahmed@corporate.pk',
    phone: '+92 300 4567890',
    subject: 'Commission for Corporate Executive Suite',
    message: 'Seeking a 72 × 48 inch custom Arabic calligraphy centerpiece in 24k gold leaf and Prussian blue. Please share timeline and commissioning process.',
    date: '2026-03-17T11:45:00.000Z',
    read: false,
  },
  {
    id: 'msg-2',
    name: 'Mariam Khalid',
    email: 'mariam.design@gmail.com',
    phone: '+92 322 1122334',
    subject: 'Certificate of Authenticity Inquiry',
    message: 'We received Atmosphere No. VII yesterday. The packaging was immaculate! Could you please provide a digital copy of the appraisal document for our home insurance?',
    date: '2026-03-15T16:20:00.000Z',
    read: true,
  },
];

export const DEFAULT_NEWSLETTER: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'asiamubeenwarraich@gmail.com', subscriptionDate: '2026-03-10T10:00:00.000Z', status: 'ACTIVE' },
  { id: 'sub-2', email: 'collector.tariq@gmail.com', subscriptionDate: '2026-03-12T14:30:00.000Z', status: 'ACTIVE' },
  { id: 'sub-3', email: 'interior.art@lahorestudio.com', subscriptionDate: '2026-03-14T09:15:00.000Z', status: 'ACTIVE' },
];

export const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    adminEmail: 'admin@gallery.com',
    adminName: 'Gallery Director',
    action: 'INITIALIZED_SYSTEM',
    entity: 'SETTINGS',
    details: 'System database bootstrapped with 2026 art catalog, inventory, and payment channels.',
    timestamp: '2026-03-15T08:00:00.000Z',
  },
  {
    id: 'log-2',
    adminEmail: 'curator@gallery.com',
    adminName: 'Senior Curator',
    action: 'VERIFIED_CATALOG',
    entity: 'PRODUCT',
    details: 'Verified high-resolution museum scans and archival linen specifications.',
    timestamp: '2026-03-16T10:30:00.000Z',
  },
];

// Reactive Listeners
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

// --------------------------------------------------------------------------
// MAIN GALLERY DATABASE SERVICE (SINGLE SOURCE OF TRUTH)
// --------------------------------------------------------------------------

export const galleryDatabase = {
  subscribe(listener: DbListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // ------------------------------------------------------------------------
  // 1. PRODUCTS MANAGEMENT
  // ------------------------------------------------------------------------

  getPaintings(): Painting[] {
    if (typeof window === 'undefined') return ALL_PAINTINGS;
    try {
      const stored = window.localStorage.getItem(DB_PAINTINGS_KEY);
      if (!stored) {
        // Hydrate initial paintings with stockQuantity, categoryId, artworkType, etc.
        const hydrated = ALL_PAINTINGS.map((p) => {
          const isSold = p.status === 'sold_out' || p.status === 'SOLD_OUT';
          return {
            ...p,
            stockQuantity: p.stockQuantity ?? (isSold ? 0 : 1),
            artworkType: p.artworkType || (p.isOriginal !== false ? 'ORIGINAL' : 'LIMITED_EDITION'),
            categoryId: p.categoryId || (p.category ? p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'cat-calligraphy'),
            featured: p.featured ?? true,
            createdAt: p.createdAt || '2026-01-15T10:00:00.000Z',
            updatedAt: p.updatedAt || '2026-03-15T10:00:00.000Z',
            deletedAt: null,
          };
        });
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(hydrated));
        return hydrated;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out soft-deleted products for standard queries
        return parsed
          .filter((item) => !item.deletedAt)
          .map((item) => {
            if (item.stockQuantity === undefined) {
              const isSold = item.status === 'sold_out' || item.status === 'SOLD_OUT';
              item.stockQuantity = isSold ? 0 : 1;
            }
            if (!item.artworkType) {
              item.artworkType = item.isOriginal !== false ? 'ORIGINAL' : 'LIMITED_EDITION';
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

  getAllPaintingsIncludingDeleted(): Painting[] {
    if (typeof window === 'undefined') return ALL_PAINTINGS;
    try {
      const stored = window.localStorage.getItem(DB_PAINTINGS_KEY);
      return stored ? JSON.parse(stored) : ALL_PAINTINGS;
    } catch {
      return ALL_PAINTINGS;
    }
  },

  getPaintingById(id: string): Painting | undefined {
    const all = this.getAllPaintingsIncludingDeleted();
    return all.find((p) => p.id === id || p.slug === id);
  },

  getNewPaintings(): Painting[] {
    const all = this.getPaintings();
    return all.filter((p) => {
      const statusUpper = (p.status || '').toUpperCase();
      // Status = NEW or available (excluding sold out and drafts)
      return (statusUpper === 'NEW' || statusUpper === 'AVAILABLE') && statusUpper !== 'SOLD_OUT' && statusUpper !== 'DRAFT';
    });
  },

  getSoldPaintings(): Painting[] {
    const all = this.getPaintings();
    return all.filter((p) => {
      const statusUpper = (p.status || '').toUpperCase();
      return statusUpper === 'SOLD_OUT' || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
    });
  },

  getGiftPaintings(): Painting[] {
    const all = this.getPaintings();
    return all.filter((p) => Boolean(p.isGift) === true && (p.status || '').toUpperCase() !== 'DRAFT');
  },

  getFeaturedPaintings(): Painting[] {
    const all = this.getPaintings();
    return all.filter((p) => Boolean(p.featured) === true && (p.status || '').toUpperCase() !== 'DRAFT');
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
      const slugMatch = (p.slug || '').toLowerCase().includes(trimmed);
      return titleMatch || artistMatch || categoryMatch || mediumMatch || styleMatch || slugMatch;
    });
  },

  createPainting(data: Partial<Painting> & { title: string; price: number }): Painting {
    // Validation
    if (!data.title?.trim()) throw new Error('Painting Title is required.');
    if (data.price === undefined || isNaN(data.price) || data.price < 0) throw new Error('Price must be a valid positive number.');
    if (data.stockQuantity !== undefined && data.stockQuantity < 0) throw new Error('Stock cannot be negative.');

    const all = this.getAllPaintingsIncludingDeleted();
    const id = data.id || `painting-${Date.now()}`;
    const slug = data.slug?.trim() || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const formattedPrice = `Rs. ${Number(data.price).toLocaleString()}`;
    const status: PaintingAvailability = data.status || 'NEW';
    const isGift = Boolean(data.isGift);
    const now = new Date().toISOString();

    const created: Painting = {
      id,
      slug,
      title: data.title.trim(),
      artist: data.artist?.trim() || 'calligraphy__by_ulain8261',
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      formattedPrice,
      currency: data.currency || 'PKR',
      status,
      image: data.image || '/images/hero-painting.jpg',
      images: data.images && data.images.length > 0 ? data.images : [data.image || '/images/hero-painting.jpg'],
      description: data.description || 'Authentic original artwork from the gallery studio.',
      dimensions: data.dimensions || '36 × 48 in (91 × 122 cm)',
      size: data.size || data.dimensions || '36 × 48 inches',
      medium: data.medium || 'Oil & Mixed Media on Belgian Linen',
      style: data.style || 'Contemporary Calligraphy & Abstract',
      category: data.category || 'Calligraphy',
      categoryId: data.categoryId || 'cat-calligraphy',
      subcategory: data.subcategory || '',
      year: data.year || 2026,
      frame: data.frame || 'Bespoke Gallery Frame',
      type: data.type || (data.artworkType === 'ORIGINAL' ? 'Original Artwork' : 'Fine Art'),
      artworkType: data.artworkType || 'ORIGINAL',
      stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : (status === 'SOLD_OUT' ? 0 : 1),
      featured: data.featured !== undefined ? Boolean(data.featured) : true,
      isOriginal: data.artworkType ? data.artworkType === 'ORIGINAL' : (data.isOriginal !== false),
      isGift,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    all.unshift(created);
    this._saveAllPaintings(all);
    this.logAuditAction('CREATED_PRODUCT', 'PRODUCT', created.id, `Created painting "${created.title}" at Rs. ${created.price.toLocaleString()} (Status: ${created.status})`);
    notifyListeners();
    return created;
  },

  updatePainting(id: string, updates: Partial<Painting>): boolean {
    const all = this.getAllPaintingsIncludingDeleted();
    const index = all.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;

    const current = all[index];
    const updatedPrice = updates.price !== undefined ? Number(updates.price) : current.price;
    const now = new Date().toISOString();

    // Automatic Sold-Out status trigger if stock reaches 0
    let updatedStatus = updates.status !== undefined ? updates.status : current.status;
    let updatedStock = updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : current.stockQuantity;

    if (updatedStock !== undefined && updatedStock <= 0) {
      updatedStatus = 'SOLD_OUT';
    } else if (updatedStock !== undefined && updatedStock > 0 && updatedStatus === 'SOLD_OUT' && updates.status === undefined) {
      // If stock replenished and status wasn't explicitly set to sold out, make AVAILABLE
      updatedStatus = 'AVAILABLE';
    }

    all[index] = {
      ...current,
      ...updates,
      price: updatedPrice,
      formattedPrice: `Rs. ${updatedPrice.toLocaleString()}`,
      status: updatedStatus,
      stockQuantity: updatedStock,
      updatedAt: now,
    };

    this._saveAllPaintings(all);
    this.logAuditAction(
      'UPDATED_PRODUCT',
      'PRODUCT',
      id,
      `Updated "${current.title}": Price Rs. ${updatedPrice.toLocaleString()}, Status ${updatedStatus}, Stock ${updatedStock}`
    );
    notifyListeners();
    return true;
  },

  updatePaintingGift(id: string, isGift: boolean): boolean {
    return this.updatePainting(id, { isGift });
  },

  resetPaintingsDatabase(): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(DB_PAINTINGS_KEY);
      }
      notifyListeners();
    } catch (e) {
      console.error('Error resetting database:', e);
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
    return this.updatePainting(id, { price: newPrice });
  },

  updatePaintingStatus(id: string, newStatus: PaintingAvailability): boolean {
    const updates: Partial<Painting> = { status: newStatus };
    if (newStatus === 'SOLD_OUT') {
      updates.stockQuantity = 0;
    } else if (newStatus === 'AVAILABLE' || newStatus === 'NEW') {
      const current = this.getPaintingById(id);
      if (current && (current.stockQuantity === undefined || current.stockQuantity <= 0)) {
        updates.stockQuantity = 1;
      }
    }
    return this.updatePainting(id, updates);
  },

  updatePaintingStock(id: string, newStock: number): boolean {
    const updates: Partial<Painting> = { stockQuantity: newStock };
    if (newStock <= 0) {
      updates.status = 'SOLD_OUT';
    } else {
      const current = this.getPaintingById(id);
      if (current && (current.status === 'SOLD_OUT' || current.status === 'sold_out')) {
        updates.status = 'AVAILABLE';
      }
    }
    return this.updatePainting(id, updates);
  },

  duplicatePainting(id: string): Painting | null {
    const original = this.getPaintingById(id);
    if (!original) return null;

    const copyData: Partial<Painting> & { title: string; price: number } = {
      ...original,
      id: `painting-${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'DRAFT',
      stockQuantity: 1,
    };

    delete (copyData as any).createdAt;
    delete (copyData as any).updatedAt;
    delete (copyData as any).deletedAt;

    const created = this.createPainting(copyData);
    this.logAuditAction('DUPLICATE_PRODUCT', 'PRODUCT', created.id, `Duplicated from "${original.title}" as "${created.title}"`);
    return created;
  },

  deletePainting(id: string, softDelete = true): boolean {
    const all = this.getAllPaintingsIncludingDeleted();
    const index = all.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return false;

    const target = all[index];

    if (softDelete) {
      // Soft deletion preserves historical orders and snapshots
      all[index] = {
        ...target,
        deletedAt: new Date().toISOString(),
        status: 'DRAFT',
      };
      this._saveAllPaintings(all);
    } else {
      const filtered = all.filter((p) => p.id !== id && p.slug !== id);
      this._saveAllPaintings(filtered);
    }

    this.logAuditAction('DELETED_PRODUCT', 'PRODUCT', id, `Deleted painting "${target.title}" (Soft: ${softDelete})`);
    notifyListeners();
    return true;
  },

  _saveAllPaintings(paintings: Painting[]): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_PAINTINGS_KEY, JSON.stringify(paintings));
      }
    } catch (e) {
      console.error('Error saving paintings to DB:', e);
    }
  },

  // ------------------------------------------------------------------------
  // 2. CATEGORIES MANAGEMENT
  // ------------------------------------------------------------------------

  getCategories(): Category[] {
    if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
    try {
      const stored = window.localStorage.getItem(DB_CATEGORIES_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  getCategoryById(id: string): Category | undefined {
    const all = this.getCategories();
    return all.find((c) => c.id === id || c.slug === id);
  },

  createCategory(data: { name: string; slug?: string; description?: string; image?: string; status?: 'ACTIVE' | 'INACTIVE' }): Category {
    if (!data.name?.trim()) throw new Error('Category name is required.');
    const all = this.getCategories();
    const slug = data.slug?.trim() || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: data.name.trim(),
      slug,
      description: data.description || '',
      image: data.image || '/images/hero-painting.jpg',
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    all.push(newCat);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_CATEGORIES_KEY, JSON.stringify(all));
    }
    this.logAuditAction('CREATED_CATEGORY', 'CATEGORY', newCat.id, `Created category "${newCat.name}"`);
    notifyListeners();
    return newCat;
  },

  updateCategory(id: string, updates: Partial<Category>): boolean {
    const all = this.getCategories();
    const idx = all.findIndex((c) => c.id === id || c.slug === id);
    if (idx === -1) return false;
    all[idx] = { ...all[idx], ...updates };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_CATEGORIES_KEY, JSON.stringify(all));
    }
    this.logAuditAction('UPDATED_CATEGORY', 'CATEGORY', id, `Updated category "${all[idx].name}"`);
    notifyListeners();
    return true;
  },

  deleteCategory(id: string): boolean {
    const all = this.getCategories();
    const filtered = all.filter((c) => c.id !== id && c.slug !== id);
    if (filtered.length === all.length) return false;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_CATEGORIES_KEY, JSON.stringify(filtered));
    }
    this.logAuditAction('DELETED_CATEGORY', 'CATEGORY', id, `Deleted category ${id}`);
    notifyListeners();
    return true;
  },

  // ------------------------------------------------------------------------
  // 3. PACKS MANAGEMENT
  // ------------------------------------------------------------------------

  getPacks(): Pack[] {
    if (typeof window === 'undefined') return DEFAULT_PACKS;
    try {
      const stored = window.localStorage.getItem(DB_PACKS_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(DEFAULT_PACKS));
        return DEFAULT_PACKS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PACKS;
    } catch {
      return DEFAULT_PACKS;
    }
  },

  getPackById(id: string): Pack | undefined {
    return this.getPacks().find((p) => p.id === id || p.slug === id);
  },

  createPack(data: {
    title: string;
    description?: string;
    price: number;
    image?: string;
    status?: 'AVAILABLE' | 'SOLD_OUT' | 'DRAFT';
    featured?: boolean;
    slug?: string;
  }): Pack {
    if (!data.title?.trim()) throw new Error('Pack Title is required.');
    if (data.price === undefined || data.price < 0) throw new Error('Price must be positive.');

    const all = this.getPacks();
    const id = `pack-${Date.now()}`;
    const slug = data.slug?.trim() || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    const newPack: Pack = {
      id,
      title: data.title.trim(),
      slug,
      description: data.description || '',
      price: Number(data.price),
      image: data.image || '/images/hero-painting.jpg',
      status: data.status || 'AVAILABLE',
      featured: data.featured !== undefined ? Boolean(data.featured) : true,
      createdAt: now,
      updatedAt: now,
    };

    all.unshift(newPack);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('CREATED_PACK', 'PACK', newPack.id, `Created pack "${newPack.title}" at Rs. ${newPack.price.toLocaleString()}`);
    notifyListeners();
    return newPack;
  },

  updatePack(id: string, updates: Partial<Pack>): boolean {
    const all = this.getPacks();
    const idx = all.findIndex((p) => p.id === id || p.slug === id);
    if (idx === -1) return false;

    all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('UPDATED_PACK', 'PACK', id, `Updated pack "${all[idx].title}"`);
    notifyListeners();
    return true;
  },

  deletePack(id: string): boolean {
    const all = this.getPacks();
    const filtered = all.filter((p) => p.id !== id && p.slug !== id);
    if (filtered.length === all.length) return false;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_PACKS_KEY, JSON.stringify(filtered));
    }
    this.logAuditAction('DELETED_PACK', 'PACK', id, `Deleted pack ${id}`);
    notifyListeners();
    return true;
  },

  // ------------------------------------------------------------------------
  // 4. ORDERS & CHECKOUT MANAGEMENT
  // ------------------------------------------------------------------------

  getOrders(): OrderRecord[] {
    if (typeof window === 'undefined') return DEFAULT_ORDERS;
    try {
      const stored = window.localStorage.getItem(DB_ORDERS_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_ORDERS;
    } catch {
      return DEFAULT_ORDERS;
    }
  },

  getOrderById(orderNumber: string): OrderRecord | undefined {
    return this.getOrders().find((o) => o.orderNumber === orderNumber);
  },

  updateOrderStatus(orderNumber: string, newStatus: OrderRecord['orderStatus']): boolean {
    const all = this.getOrders();
    const idx = all.findIndex((o) => o.orderNumber === orderNumber);
    if (idx === -1) return false;

    all[idx] = { ...all[idx], orderStatus: newStatus };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('UPDATED_ORDER_STATUS', 'ORDER', orderNumber, `Changed order ${orderNumber} status to ${newStatus}`);
    notifyListeners();
    return true;
  },

  updatePaymentStatus(orderNumber: string, newPaymentStatus: OrderRecord['paymentStatus']): boolean {
    const all = this.getOrders();
    const idx = all.findIndex((o) => o.orderNumber === orderNumber);
    if (idx === -1) return false;

    all[idx] = { ...all[idx], paymentStatus: newPaymentStatus };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('UPDATED_PAYMENT_STATUS', 'ORDER', orderNumber, `Changed order ${orderNumber} payment to ${newPaymentStatus}`);
    notifyListeners();
    return true;
  },

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
        (dbMatch && dbMatch.stockQuantity !== undefined && dbMatch.stockQuantity <= 0) ||
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

  createOrder(params: {
    customerEmail: string;
    customerName?: string;
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
    notes?: string;
  }): { order: OrderRecord; buyerEmail: SentEmail; storeOwnerEmail: SentEmail } {
    // 1. Re-verify prices & inventory against DB
    const verification = this.verifyCheckoutItems(params.items);
    if (verification.hasSoldOutItems) {
      throw new Error(`Cannot checkout: Artwork "${verification.soldOutTitles.join(', ')}" is SOLD OUT.`);
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
    const customerFullName = params.customerName || `${params.shippingAddress.firstName} ${params.shippingAddress.lastName}`;

    const order: OrderRecord = {
      orderNumber,
      createdAt,
      customerEmail: params.customerEmail,
      customerName: customerFullName,
      customerPhone: params.shippingAddress.phone,
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
      notes: params.notes,
    };

    // 2. AUTOMATIC SOLD-OUT & STOCK UPDATE FOR ORIGINAL ARTWORKS
    const allPaintings = this.getAllPaintingsIncludingDeleted();
    let dbChanged = false;
    orderItems.forEach((orderItem) => {
      const pIdx = allPaintings.findIndex((p) => p.id === orderItem.id || p.slug === orderItem.slug);
      if (pIdx > -1) {
        const p = allPaintings[pIdx];
        const isOriginal = p.artworkType === 'ORIGINAL' || p.isOriginal !== false;
        if (isOriginal) {
          // Reduce stock by ordered quantity
          const remainingStock = Math.max(0, (p.stockQuantity ?? 1) - orderItem.quantity);
          allPaintings[pIdx] = {
            ...p,
            stockQuantity: remainingStock,
            status: remainingStock <= 0 ? 'SOLD_OUT' : p.status,
            updatedAt: new Date().toISOString(),
          };
          dbChanged = true;
        }
      }
    });

    if (dbChanged) {
      this._saveAllPaintings(allPaintings);
    }

    // 3. Save order record
    const existingOrders = this.getOrders();
    const updatedOrders = [order, ...existingOrders];
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(updatedOrders));
    }

    // 4. Update coupon usage count if used
    if (params.discountCode) {
      this.incrementDiscountUsage(params.discountCode);
    }

    // 5. Generate & record automated confirmation emails
    const settings = this.getStoreSettings();
    const formattedAddress = `${params.shippingAddress.address}${params.shippingAddress.apartment ? `, ${params.shippingAddress.apartment}` : ''}, ${params.shippingAddress.city}, ${params.shippingAddress.country} (Phone: ${params.shippingAddress.phone})`;
    const itemsSummary = orderItems
      .map(
        (it) =>
          `• ${it.title} by ${it.artist} (Qty: ${it.quantity}) — Rs. ${(it.price * it.quantity).toLocaleString()}`
      )
      .join('\n');

    const buyerEmail: SentEmail = {
      id: `email-${Date.now()}-buyer`,
      recipientType: 'buyer',
      to: params.customerEmail,
      subject: `Order Confirmation — ${orderNumber}`,
      sentAt: new Date().toLocaleString(),
      orderNumber,
      bodyText: `Dear ${customerFullName},

Thank you for acquiring artwork from ${settings.storeName}.

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
${settings.storeName}`,
    };

    const storeOwnerEmail: SentEmail = {
      id: `email-${Date.now()}-owner`,
      recipientType: 'store_owner',
      to: settings.storeOwnerEmail || CHECKOUT_CONFIG.storeOwnerEmail,
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

    this.logAuditAction('CREATED_ORDER', 'ORDER', orderNumber, `Customer ${customerFullName} placed order for Rs. ${total.toLocaleString()}`);
    notifyListeners();

    return { order, buyerEmail, storeOwnerEmail };
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

  // ------------------------------------------------------------------------
  // 5. PAYMENTS & TRANSACTIONS
  // ------------------------------------------------------------------------

  getPayments(): PaymentRecord[] {
    const orders = this.getOrders();
    return orders.map((o) => ({
      id: `pay-${o.orderNumber}`,
      transactionId: o.paymentMethod === 'online' ? `TXN-${o.orderNumber.replace('ART-', 'PKR')}` : `COD-${o.orderNumber.replace('ART-', '')}`,
      orderNumber: o.orderNumber,
      customerName: o.customerName || `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`,
      customerEmail: o.customerEmail,
      amount: o.total,
      paymentMethod: o.paymentMethod === 'online' ? 'Online Card / IBFT' : 'Cash on Delivery (COD)',
      status: o.paymentStatus,
      date: o.createdAt,
    }));
  },

  // ------------------------------------------------------------------------
  // 6. CUSTOMERS MANAGEMENT
  // ------------------------------------------------------------------------

  getCustomers(): Customer[] {
    const orders = this.getOrders();
    const customerMap: Record<string, Customer> = {};

    orders.forEach((o) => {
      const email = (o.customerEmail || '').toLowerCase().trim();
      if (!email) return;

      const customerName = o.customerName || `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`;
      if (!customerMap[email]) {
        customerMap[email] = {
          id: `cust-${email.replace(/[^a-z0-9]/g, '-')}`,
          name: customerName,
          email,
          phone: o.customerPhone || o.shippingAddress.phone,
          city: o.shippingAddress.city,
          address: `${o.shippingAddress.address}, ${o.shippingAddress.city}`,
          ordersCount: 0,
          totalSpent: 0,
          lastOrderAt: o.createdAt,
          createdAt: o.createdAt,
        };
      }

      customerMap[email].ordersCount += 1;
      customerMap[email].totalSpent += o.total;
      if (new Date(o.createdAt) > new Date(customerMap[email].lastOrderAt)) {
        customerMap[email].lastOrderAt = o.createdAt;
      }
    });

    return Object.values(customerMap);
  },

  getCustomerById(id: string): { customer: Customer; orders: OrderRecord[] } | null {
    const customers = this.getCustomers();
    const matched = customers.find((c) => c.id === id || c.email === id);
    if (!matched) return null;

    const allOrders = this.getOrders().filter((o) => (o.customerEmail || '').toLowerCase().trim() === matched.email.toLowerCase().trim());
    return { customer: matched, orders: allOrders };
  },

  // ------------------------------------------------------------------------
  // 7. DISCOUNTS & COUPONS
  // ------------------------------------------------------------------------

  getDiscounts(): Discount[] {
    if (typeof window === 'undefined') return DEFAULT_DISCOUNTS;
    try {
      const stored = window.localStorage.getItem(DB_DISCOUNTS_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_DISCOUNTS_KEY, JSON.stringify(DEFAULT_DISCOUNTS));
        return DEFAULT_DISCOUNTS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DISCOUNTS;
    } catch {
      return DEFAULT_DISCOUNTS;
    }
  },

  createDiscount(data: {
    code: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    minOrder?: number;
    maxDiscount?: number;
    usageLimit?: number;
    active?: boolean;
  }): Discount {
    const code = data.code.trim().toUpperCase();
    if (!code) throw new Error('Discount Code is required.');
    if (data.value <= 0) throw new Error('Discount value must be greater than zero.');

    const all = this.getDiscounts();
    if (all.some((d) => d.code === code)) {
      throw new Error(`Discount code "${code}" already exists.`);
    }

    const newDiscount: Discount = {
      id: `disc-${Date.now()}`,
      code,
      type: data.type || 'PERCENTAGE',
      value: Number(data.value),
      minOrder: data.minOrder ? Number(data.minOrder) : 0,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
      usedCount: 0,
      active: data.active !== false,
      createdAt: new Date().toISOString(),
    };

    all.unshift(newDiscount);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_DISCOUNTS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('CREATED_DISCOUNT', 'DISCOUNT', newDiscount.code, `Created discount ${newDiscount.code} (${newDiscount.value}${newDiscount.type === 'PERCENTAGE' ? '%' : ' PKR'})`);
    notifyListeners();
    return newDiscount;
  },

  updateDiscount(id: string, updates: Partial<Discount>): boolean {
    const all = this.getDiscounts();
    const idx = all.findIndex((d) => d.id === id || d.code === id);
    if (idx === -1) return false;

    all[idx] = { ...all[idx], ...updates };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_DISCOUNTS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('UPDATED_DISCOUNT', 'DISCOUNT', all[idx].code, `Updated discount ${all[idx].code}`);
    notifyListeners();
    return true;
  },

  deleteDiscount(id: string): boolean {
    const all = this.getDiscounts();
    const filtered = all.filter((d) => d.id !== id && d.code !== id);
    if (filtered.length === all.length) return false;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_DISCOUNTS_KEY, JSON.stringify(filtered));
    }
    this.logAuditAction('DELETED_DISCOUNT', 'DISCOUNT', id, `Deleted discount ${id}`);
    notifyListeners();
    return true;
  },

  incrementDiscountUsage(code: string): void {
    const all = this.getDiscounts();
    const idx = all.findIndex((d) => d.code === code.toUpperCase());
    if (idx > -1) {
      all[idx].usedCount = (all[idx].usedCount || 0) + 1;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DB_DISCOUNTS_KEY, JSON.stringify(all));
      }
    }
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

    const discounts = this.getDiscounts();
    const matched = discounts.find((d) => d.code === trimmed && d.active);

    if (matched) {
      if (matched.minOrder > 0 && currentSubtotal < matched.minOrder) {
        return {
          valid: false,
          code: trimmed,
          discountType: 'fixed',
          discountAmount: 0,
          message: `Minimum order for code ${trimmed} is Rs. ${matched.minOrder.toLocaleString()}.`,
        };
      }

      if (matched.usageLimit && matched.usedCount >= matched.usageLimit) {
        return {
          valid: false,
          code: trimmed,
          discountType: 'fixed',
          discountAmount: 0,
          message: `Coupon ${trimmed} has reached its maximum usage limit.`,
        };
      }

      let discount = 0;
      if (matched.type === 'PERCENTAGE') {
        discount = Math.round(currentSubtotal * (matched.value / 100));
        if (matched.maxDiscount && discount > matched.maxDiscount) {
          discount = matched.maxDiscount;
        }
      } else {
        discount = Math.min(matched.value, currentSubtotal);
      }

      return {
        valid: true,
        code: matched.code,
        discountType: matched.type === 'PERCENTAGE' ? 'percentage' : 'fixed',
        discountAmount: discount,
        message: `Coupon ${matched.code} applied: -Rs. ${discount.toLocaleString()}`,
      };
    }

    // Special hardcoded FREESHIP case
    if (trimmed === 'FREESHIP') {
      return {
        valid: true,
        code: 'FREESHIP',
        discountType: 'shipping',
        discountAmount: shippingFee,
        message: `Coupon FREESHIP applied: Free Nationwide Courier (Rs. ${shippingFee.toLocaleString()})`,
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

  // ------------------------------------------------------------------------
  // 8. HOMEPAGE MANAGEMENT
  // ------------------------------------------------------------------------

  getHomepageConfig(): HomepageConfig {
    if (typeof window === 'undefined') return DEFAULT_HOMEPAGE_CONFIG;
    try {
      const stored = window.localStorage.getItem(DB_HOMEPAGE_KEY);
      return stored ? { ...DEFAULT_HOMEPAGE_CONFIG, ...JSON.parse(stored) } : DEFAULT_HOMEPAGE_CONFIG;
    } catch {
      return DEFAULT_HOMEPAGE_CONFIG;
    }
  },

  updateHomepageConfig(updates: Partial<HomepageConfig>): boolean {
    const current = this.getHomepageConfig();
    const updated = { ...current, ...updates };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_HOMEPAGE_KEY, JSON.stringify(updated));
    }
    this.logAuditAction('UPDATED_HOMEPAGE', 'SETTINGS', 'homepage', 'Updated homepage layout and featured artwork selections');
    notifyListeners();
    return true;
  },

  // ------------------------------------------------------------------------
  // 9. MESSAGES & INQUIRIES
  // ------------------------------------------------------------------------

  getMessages(): MessageRecord[] {
    if (typeof window === 'undefined') return DEFAULT_MESSAGES;
    try {
      const stored = window.localStorage.getItem(DB_MESSAGES_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(DEFAULT_MESSAGES));
        return DEFAULT_MESSAGES;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  },

  createMessage(data: { name: string; email: string; phone?: string; subject: string; message: string }): MessageRecord {
    const all = this.getMessages();
    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      date: new Date().toISOString(),
      read: false,
    };
    all.unshift(newMsg);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(all));
    }
    notifyListeners();
    return newMsg;
  },

  markMessageRead(id: string, read = true): boolean {
    const all = this.getMessages();
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    all[idx].read = read;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(all));
    }
    notifyListeners();
    return true;
  },

  deleteMessage(id: string): boolean {
    const all = this.getMessages();
    const filtered = all.filter((m) => m.id !== id);
    if (filtered.length === all.length) return false;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(filtered));
    }
    notifyListeners();
    return true;
  },

  // ------------------------------------------------------------------------
  // 10. NEWSLETTER
  // ------------------------------------------------------------------------

  getNewsletterSubscribers(): NewsletterSubscriber[] {
    if (typeof window === 'undefined') return DEFAULT_NEWSLETTER;
    try {
      const stored = window.localStorage.getItem(DB_NEWSLETTER_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_NEWSLETTER_KEY, JSON.stringify(DEFAULT_NEWSLETTER));
        return DEFAULT_NEWSLETTER;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_NEWSLETTER;
    } catch {
      return DEFAULT_NEWSLETTER;
    }
  },

  addNewsletterSubscriber(email: string): boolean {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) return false;

    const all = this.getNewsletterSubscribers();
    if (all.some((s) => s.email.toLowerCase() === trimmed)) {
      return true; // Already subscribed
    }

    all.unshift({
      id: `sub-${Date.now()}`,
      email: trimmed,
      subscriptionDate: new Date().toISOString(),
      status: 'ACTIVE',
    });

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_NEWSLETTER_KEY, JSON.stringify(all));
    }
    notifyListeners();
    return true;
  },

  removeNewsletterSubscriber(id: string): boolean {
    const all = this.getNewsletterSubscribers();
    const filtered = all.filter((s) => s.id !== id && s.email !== id);
    if (filtered.length === all.length) return false;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_NEWSLETTER_KEY, JSON.stringify(filtered));
    }
    notifyListeners();
    return true;
  },

  // ------------------------------------------------------------------------
  // 11. ADMIN USERS & AUTHENTICATION
  // ------------------------------------------------------------------------

  getAdminUsers(): AdminUser[] {
    if (typeof window === 'undefined') return DEFAULT_ADMIN_USERS;
    try {
      const stored = window.localStorage.getItem(DB_ADMIN_USERS_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_ADMIN_USERS_KEY, JSON.stringify(DEFAULT_ADMIN_USERS));
        return DEFAULT_ADMIN_USERS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADMIN_USERS;
    } catch {
      return DEFAULT_ADMIN_USERS;
    }
  },

  createAdminUser(data: { name: string; email: string; role: AdminRole }): AdminUser {
    const all = this.getAdminUsers();
    if (all.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error(`User with email "${data.email}" already exists.`);
    }

    const newUser: AdminUser = {
      id: `admin-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      createdAt: new Date().toISOString(),
    };

    all.push(newUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ADMIN_USERS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('CREATED_USER', 'USER', newUser.email, `Created admin user ${newUser.name} with role ${newUser.role}`);
    notifyListeners();
    return newUser;
  },

  updateAdminUser(id: string, updates: Partial<AdminUser>): boolean {
    const all = this.getAdminUsers();
    const idx = all.findIndex((u) => u.id === id);
    if (idx === -1) return false;

    all[idx] = { ...all[idx], ...updates };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ADMIN_USERS_KEY, JSON.stringify(all));
    }
    this.logAuditAction('UPDATED_USER', 'USER', id, `Updated admin user role/details for ${all[idx].email}`);
    notifyListeners();
    return true;
  },

  deleteAdminUser(id: string): boolean {
    const all = this.getAdminUsers();
    if (all.length <= 1) throw new Error('Cannot delete the last remaining administrator.');
    const filtered = all.filter((u) => u.id !== id);
    if (filtered.length === all.length) return false;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ADMIN_USERS_KEY, JSON.stringify(filtered));
    }
    this.logAuditAction('DELETED_USER', 'USER', id, `Removed admin user ${id}`);
    notifyListeners();
    return true;
  },

  loginAdmin(email: string, role?: AdminRole): AdminSession {
    const trimmed = (email || '').trim().toLowerCase();
    const allUsers = this.getAdminUsers();
    const matched = allUsers.find((u) => u.email.toLowerCase() === trimmed);

    const user: AdminUser = matched || {
      id: `admin-custom`,
      name: trimmed.split('@')[0] || 'Administrator',
      email: trimmed || 'admin@gallery.com',
      role: role || 'SUPER_ADMIN',
      createdAt: new Date().toISOString(),
    };

    const session: AdminSession = {
      token: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role || user.role,
        avatar: user.avatar,
      },
      loginAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_ADMIN_SESSION_KEY, JSON.stringify(session));
    }

    this.logAuditAction('ADMIN_LOGIN', 'USER', user.email, `Admin "${user.name}" logged in with role ${session.user.role}`);
    notifyListeners();
    return session;
  },

  logoutAdmin(): void {
    const current = this.getCurrentAdminSession();
    if (current) {
      this.logAuditAction('ADMIN_LOGOUT', 'USER', current.user.email, `Admin "${current.user.name}" logged out.`);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DB_ADMIN_SESSION_KEY);
    }
    notifyListeners();
  },

  getCurrentAdminSession(): AdminSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem(DB_ADMIN_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  hasPermission(action: 'manage_products' | 'manage_orders' | 'manage_settings' | 'manage_users'): boolean {
    const session = this.getCurrentAdminSession();
    if (!session) return false;
    const role = session.user.role;

    if (role === 'SUPER_ADMIN') return true;
    if (role === 'ADMIN') {
      return action !== 'manage_users';
    }
    if (role === 'EDITOR') {
      return action === 'manage_products';
    }
    return false;
  },

  // ------------------------------------------------------------------------
  // 12. AUDIT LOGS
  // ------------------------------------------------------------------------

  getAuditLogs(): AuditLogEntry[] {
    if (typeof window === 'undefined') return DEFAULT_AUDIT_LOGS;
    try {
      const stored = window.localStorage.getItem(DB_AUDIT_LOG_KEY);
      if (!stored) {
        window.localStorage.setItem(DB_AUDIT_LOG_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
        return DEFAULT_AUDIT_LOGS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_AUDIT_LOGS;
    } catch {
      return DEFAULT_AUDIT_LOGS;
    }
  },

  logAuditAction(action: string, entity: AuditLogEntry['entity'], entityId?: string, details = ''): void {
    const session = this.getCurrentAdminSession();
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      adminEmail: session?.user.email || 'system@gallery.com',
      adminName: session?.user.name || 'System / Auto',
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };

    const all = this.getAuditLogs();
    const updated = [entry, ...all].slice(0, 200); // Retain latest 200 entries
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_AUDIT_LOG_KEY, JSON.stringify(updated));
    }
  },

  // ------------------------------------------------------------------------
  // 13. STORE SETTINGS
  // ------------------------------------------------------------------------

  getStoreSettings(): StoreSettings {
    if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;
    try {
      const stored = window.localStorage.getItem(DB_SETTINGS_KEY);
      return stored ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(stored) } : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  },

  updateStoreSettings(updates: Partial<StoreSettings>): boolean {
    const current = this.getStoreSettings();
    const updated = { ...current, ...updates };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_SETTINGS_KEY, JSON.stringify(updated));
    }
    this.logAuditAction('UPDATED_SETTINGS', 'SETTINGS', 'store_settings', 'Store configuration and shipping parameters updated');
    notifyListeners();
    return true;
  },

  // ------------------------------------------------------------------------
  // 14. LIVE DASHBOARD STATISTICS
  // ------------------------------------------------------------------------

  getDashboardStats(): {
    totalProducts: number;
    availablePaintings: number;
    newPaintings: number;
    soldPaintings: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    revenue: number;
    lowStockPaintings: Painting[];
    recentOrders: OrderRecord[];
    recentPaintings: Painting[];
  } {
    const paintings = this.getPaintings();
    const orders = this.getOrders();
    const settings = this.getStoreSettings();

    const available = paintings.filter((p) => {
      const st = (p.status || '').toUpperCase();
      return (st === 'AVAILABLE' || st === 'NEW') && (p.stockQuantity === undefined || p.stockQuantity > 0);
    });

    const newItems = paintings.filter((p) => {
      const st = (p.status || '').toUpperCase();
      return st === 'NEW';
    });

    const sold = paintings.filter((p) => {
      const st = (p.status || '').toUpperCase();
      return st === 'SOLD_OUT' || (p.stockQuantity !== undefined && p.stockQuantity <= 0);
    });

    const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING');
    const completedOrders = orders.filter((o) => o.orderStatus === 'DELIVERED' || o.orderStatus === 'COMPLETED');

    const revenue = orders.reduce((sum, o) => {
      // Calculate revenue from paid or delivered orders
      if (o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED' || o.orderStatus === 'COMPLETED' || o.orderStatus === 'PROCESSING') {
        return sum + (o.total || 0);
      }
      return sum;
    }, 0);

    const threshold = settings.lowStockThreshold ?? 1;
    const lowStockPaintings = paintings.filter((p) => {
      const st = (p.status || '').toUpperCase();
      return st !== 'SOLD_OUT' && p.stockQuantity !== undefined && p.stockQuantity <= threshold;
    });

    return {
      totalProducts: paintings.length,
      availablePaintings: available.length,
      newPaintings: newItems.length,
      soldPaintings: sold.length,
      totalOrders: orders.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      revenue,
      lowStockPaintings: lowStockPaintings.slice(0, 5),
      recentOrders: orders.slice(0, 6),
      recentPaintings: paintings.slice(0, 6),
    };
  },

  // ------------------------------------------------------------------------
  // 15. CSV IMPORT & EXPORT
  // ------------------------------------------------------------------------

  exportPaintingsToCsv(): string {
    const paintings = this.getPaintings();
    const headers = ['id', 'title', 'artist', 'price', 'status', 'stockQuantity', 'category', 'medium', 'dimensions', 'year', 'isGift', 'featured'];
    const rows = paintings.map((p) => [
      `"${p.id}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.artist || '').replace(/"/g, '""')}"`,
      p.price,
      `"${p.status}"`,
      p.stockQuantity ?? 1,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      `"${(p.medium || '').replace(/"/g, '""')}"`,
      `"${(p.dimensions || '').replace(/"/g, '""')}"`,
      p.year || 2026,
      p.isGift ? 'YES' : 'NO',
      p.featured ? 'YES' : 'NO',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  importPaintingsFromCsv(csvText: string): { importedCount: number; errors: string[] } {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) {
      return { importedCount: 0, errors: ['CSV file is empty or missing header row.'] };
    }

    const errors: string[] = [];
    let count = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Basic CSV token parser
      const parts = line.split(',').map((p) => p.replace(/^"|"$/g, '').trim());
      const title = parts[1];
      const price = parseFloat(parts[3]);

      if (!title) {
        errors.push(`Row ${i + 1}: Title is missing.`);
        continue;
      }
      if (isNaN(price) || price < 0) {
        errors.push(`Row ${i + 1}: Invalid price "${parts[3]}".`);
        continue;
      }

      try {
        this.createPainting({
          title,
          artist: parts[2] || 'calligraphy__by_ulain8261',
          price,
          status: (parts[4] as any) || 'NEW',
          stockQuantity: parts[5] ? parseInt(parts[5], 10) : 1,
          category: parts[6] || 'Calligraphy',
          medium: parts[7] || 'Oil on Canvas',
          dimensions: parts[8] || '36 × 48 in',
          isGift: parts[10]?.toUpperCase() === 'YES',
          featured: parts[11]?.toUpperCase() === 'YES',
        });
        count++;
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err.message || 'Import failed'}`);
      }
    }

    return { importedCount: count, errors };
  },

  // ------------------------------------------------------------------------
  // 16. ALIASES & COMPATIBILITY HELPERS
  // ------------------------------------------------------------------------

  getAdminSession(): AdminSession | null {
    return this.getCurrentAdminSession();
  },

  getInquiries(): MessageRecord[] {
    return this.getMessages();
  },

  updateInquiryStatus(id: string, status: 'NEW' | 'REPLIED' | 'ARCHIVED' | boolean): boolean {
    const all = this.getMessages();
    const idx = all.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    if (typeof status === 'string') {
      all[idx].status = status;
      all[idx].read = status !== 'NEW';
    } else {
      all[idx].read = status;
      all[idx].status = status ? 'REPLIED' : 'NEW';
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DB_MESSAGES_KEY, JSON.stringify(all));
    }
    notifyListeners();
    return true;
  },

  deleteInquiry(id: string): boolean {
    return this.deleteMessage(id);
  },

  resetToSeedData(): boolean {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DB_PAINTINGS_KEY);
      window.localStorage.removeItem(DB_PACKS_KEY);
      window.localStorage.removeItem(DB_CATEGORIES_KEY);
      window.localStorage.removeItem(DB_DISCOUNTS_KEY);
      window.localStorage.removeItem(DB_SETTINGS_KEY);
      window.localStorage.removeItem(DB_MESSAGES_KEY);
      window.localStorage.removeItem(DB_NEWSLETTER_KEY);
      window.localStorage.removeItem(DB_HOMEPAGE_KEY);
    }
    this.logAuditAction('DATABASE_RESET', 'SETTINGS', 'system', 'Catalog reset to original seed data.');
    notifyListeners();
    return true;
  },
};
