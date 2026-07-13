import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category_name?: string;
  quantity: number;
  color?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => boolean;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem): boolean => {
    if (!user && !localStorage.getItem('token')) {
      alert('Vui lòng đăng nhập tài khoản trước khi thêm vào giỏ hàng!');
      window.location.href = '/login';
      return false;
    }
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.color === item.color);
      if (existing) {
        return prev.map(i => (i.id === item.id && i.color === item.color) ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    return true;
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax for example
  const shipping = subtotal > 100 ? 0 : (subtotal > 0 ? 10 : 0); // Free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      tax,
      shipping,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
