import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  id: string; // unique id for product + size + color combination
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkoutWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('za-pass-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('za-pass-cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (product: Product, size: string, color: string) => {
    const itemId = `${product.id}-${size}-${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: itemId, product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const getItemCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const checkoutWhatsApp = () => {
    const PHONE_NUMBER = '5491112345678';
    let message = 'Hola Za-pass! Quiero realizar el siguiente pedido:\n\n';
    
    cart.forEach((item) => {
      message += `• ${item.product.name}\n`;
      message += `  Talle: ${item.selectedSize} US | Color: ${item.selectedColor}\n`;
      message += `  Cantidad: ${item.quantity} | Subtotal: $${(item.product.price * item.quantity).toLocaleString('es-AR')}\n\n`;
    });

    message += `*TOTAL: $${getTotalPrice().toLocaleString('es-AR')}*`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <CartContext.Provider value={{ 
      cart, addItem, removeItem, updateQuantity, clearCart, 
      getItemCount, getTotalPrice, isCartOpen, setIsCartOpen, 
      checkoutWhatsApp 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
