import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Painting } from '../data/paintings';
import { CHECKOUT_CONFIG } from '../config/checkoutConfig';

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
  status: 'available' | 'sold_out' | 'NEW' | 'SOLD_OUT' | string;
  type?: string;
  isOriginal?: boolean;
}

export interface AddToCartResult {
  success: boolean;
  message: string;
  item?: CartItem;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Painting, quantity?: number) => AddToCartResult;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartShipping: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const STORAGE_KEY = 'art-gallery-cart';
// Configurable shipping fee defined in CHECKOUT_CONFIG
const SHIPPING_FEE = CHECKOUT_CONFIG.shippingOptions[0].amount;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      // Validate each item to prevent corrupted data
      return parsed.filter((item: any): item is CartItem => {
        return (
          item &&
          typeof item.id === 'string' &&
          item.id.trim().length > 0 &&
          typeof item.title === 'string' &&
          typeof item.artist === 'string' &&
          typeof item.price === 'number' &&
          !isNaN(item.price) &&
          typeof item.image === 'string' &&
          typeof item.quantity === 'number' &&
          item.quantity > 0
        );
      });
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage on cart change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product: Painting, quantity: number = 1): AddToCartResult => {
    // 1. Validate product attributes
    if (!product) {
      console.error('Cannot add product: product object is null or undefined');
      return { success: false, message: 'Cannot add product: product is undefined' };
    }
    if (!product.id) {
      console.error('Cannot add product: missing product ID', product);
      return { success: false, message: 'Cannot add product: missing product ID' };
    }
    if (!product.title) {
      console.error('Cannot add product: missing product title', product);
      return { success: false, message: 'Cannot add product: missing product title' };
    }
    if (typeof product.price !== 'number' || isNaN(product.price)) {
      console.error('Cannot add product: invalid product price', product);
      return { success: false, message: 'Cannot add product: invalid product price' };
    }
    if (!product.image) {
      console.error('Cannot add product: missing product image', product);
      return { success: false, message: 'Cannot add product: missing product image' };
    }

    // 2. Reject Sold Out artwork
    const isSoldOut = product.status === 'sold_out' || product.status === 'SOLD_OUT';
    if (isSoldOut) {
      console.warn(`Cannot add "${product.title}": artwork is SOLD OUT.`);
      return {
        success: false,
        message: `"${product.title}" is SOLD OUT and cannot be added to your cart.`,
      };
    }

    // 3. Check if artwork is original 1-of-1
    const isOriginal =
      product.isOriginal !== false &&
      (product.type === 'Original Artwork' || product.type === undefined);

    const existingIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      // Product already in cart
      if (isOriginal) {
        // Unique 1-of-1 artwork cannot exceed quantity 1
        return {
          success: true,
          message: `"${product.title}" is an original 1-of-1 artwork and is already in your cart (Qty: 1).`,
          item: cartItems[existingIndex],
        };
      } else {
        // Limited edition or print allows increment
        const qtyToAdd = Math.max(1, quantity);
        const updated = [...cartItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd,
        };
        setCartItems(updated);
        return {
          success: true,
          message: `Updated quantity for "${product.title}" in your cart.`,
          item: updated[existingIndex],
        };
      }
    } else {
      // Brand new item added to cart
      const initialQty = isOriginal ? 1 : Math.max(1, quantity);
      const newItem: CartItem = {
        id: product.id,
        slug: product.slug || product.id,
        title: product.title,
        artist: product.artist || 'calligraphy__by_ulain8261',
        price: product.price,
        image: product.image,
        quantity: initialQty,
        status: product.status || 'available',
        type: product.type || 'Original Artwork',
        isOriginal: isOriginal,
      };

      setCartItems((prev) => [...prev, newItem]);
      return {
        success: true,
        message: `Added "${product.title}" to cart`,
        item: newItem,
      };
    }
  };

  const removeFromCart = (productId: string) => {
    if (!productId) return;
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (!productId) return;
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        // If it's a unique original artwork, clamp to 1
        if (item.isOriginal) {
          return { ...item, quantity: 1 };
        }
        return { ...item, quantity: newQuantity };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Computed totals
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const cartShipping = useMemo(() => {
    return cartItems.length > 0 ? SHIPPING_FEE : 0;
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartShipping;
  }, [cartSubtotal, cartShipping]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartShipping,
        cartTotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
