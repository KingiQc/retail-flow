import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, Payment, Sale } from '@/types/pos';
import { generateReceiptNumber } from '@/data/mockData';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemDiscount: (itemId: string, discount: number) => void;
  setGlobalDiscount: (discount: number) => void;
  clearCart: () => void;
  checkout: (payments: Payment[]) => Sale | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const taxRate = 0; // 0% tax - adjust as needed

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const itemDiscounts = items.reduce((sum, item) => sum + item.discount, 0);
  const discount = globalDiscount + itemDiscounts;
  const taxableAmount = subtotal - discount;
  const tax = Math.round(taxableAmount * taxRate);
  const total = taxableAmount + tax;

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const newItem: CartItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        product,
        selectedSize: size,
        selectedColor: color,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
      };

      return [...prevItems, newItem];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const updateItemDiscount = useCallback((itemId: string, discount: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, discount } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setGlobalDiscount(0);
  }, []);

  const checkout = useCallback((payments: Payment[]): Sale | null => {
    if (!user || items.length === 0) return null;

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid < total) return null;

    const sale: Sale = {
      id: `${Date.now()}`,
      receiptNumber: generateReceiptNumber(),
      items: [...items],
      subtotal,
      discount,
      tax,
      total,
      payments,
      cashierId: user.id,
      cashierName: user.name,
      createdAt: new Date(),
      status: 'completed',
    };

    // Save sale to localStorage
    const existingSales = JSON.parse(localStorage.getItem('pos_sales') || '[]');
    localStorage.setItem('pos_sales', JSON.stringify([...existingSales, sale]));

    clearCart();
    return sale;
  }, [user, items, subtotal, discount, tax, total, clearCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        discount,
        tax,
        total,
        addItem,
        removeItem,
        updateQuantity,
        updateItemDiscount,
        setGlobalDiscount,
        clearCart,
        checkout,
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
