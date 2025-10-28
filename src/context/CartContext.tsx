'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useOptimistic,
  useTransition,
  ReactNode,
  useCallback
} from 'react';
import type { CartItem as CartItemType } from '@/types/cart';
import { addToCartAction } from '@/app/actions/cart';

// Re-export for backward compatibility
export type CartItem = CartItemType;

interface CartContextType {
  // Existing API (backward compatible)
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;

  // New optimistic update API
  optimisticItems: CartItem[];
  isPending: boolean;

  // Undo functionality
  undoLastAction: () => void;
  canUndo: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'fern-fog-cart';
const MAX_HISTORY = 5;

/**
 * Check if Shopify cart sync is enabled
 */
const isShopifyCartEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true';
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState<CartItem[][]>([]);
  const [isPending, startTransition] = useTransition();

  // Optimistic state for instant UI updates
  const [optimisticItems, addOptimistic] = useOptimistic<
    CartItem[],
    { type: 'add'; payload: { item: Omit<CartItem, 'quantity'>; quantity: number } } |
    { type: 'remove'; payload: string } |
    { type: 'update'; payload: { productId: string; quantity: number } } |
    { type: 'clear' }
  >(items, (state, action) => {
    switch (action.type) {
      case 'add': {
        const { item, quantity } = action.payload;
        const existing = state.find(i => i.productId === item.productId);
        if (existing) {
          return state.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...state, { ...item, quantity }];
      }
      case 'remove':
        return state.filter(i => i.productId !== action.payload);
      case 'update': {
        const { productId, quantity } = action.payload;
        if (quantity <= 0) {
          return state.filter(i => i.productId !== productId);
        }
        return state.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        );
      }
      case 'clear':
        return [];
    }
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isLoaded]);

  // Save to history before mutations (for undo)
  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = [...prev, items];
      // Keep only last MAX_HISTORY states
      return newHistory.slice(-MAX_HISTORY);
    });
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    saveToHistory();
    startTransition(() => {
      // Optimistic update
      addOptimistic({ type: 'add', payload: { item, quantity } });

      // Actual update
      setItems(currentItems => {
        const existingItem = currentItems.find(i => i.productId === item.productId);

        let updatedItems: CartItem[];
        if (existingItem) {
          // Update quantity of existing item
          updatedItems = currentItems.map(i =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          // Add new item
          updatedItems = [...currentItems, { ...item, quantity }];
        }

        // Optionally sync to Shopify (fire and forget)
        if (isShopifyCartEnabled()) {
          const itemToSync = updatedItems.find(i => i.productId === item.productId);
          if (itemToSync) {
            addToCartAction(itemToSync).catch(error => {
              console.error('Failed to sync cart addition to Shopify:', error);
              // Note: We don't revert the local state on Shopify sync failure
              // The local cart remains the source of truth
            });
          }
        }

        return updatedItems;
      });
    });
  };

  const removeItem = (productId: string) => {
    saveToHistory();
    startTransition(() => {
      // Optimistic update
      addOptimistic({ type: 'remove', payload: productId });

      // Actual update
      setItems(currentItems => currentItems.filter(item => item.productId !== productId));
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    saveToHistory();
    startTransition(() => {
      // Optimistic update
      addOptimistic({ type: 'update', payload: { productId, quantity } });

      // Actual update
      if (quantity <= 0) {
        setItems(currentItems => currentItems.filter(item => item.productId !== productId));
        return;
      }

      setItems(currentItems =>
        currentItems.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    });
  };

  const clearCart = () => {
    saveToHistory();
    startTransition(() => {
      // Optimistic update
      addOptimistic({ type: 'clear' } as const);

      // Actual update
      setItems([]);
    });
  };

  const undoLastAction = useCallback(() => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setItems(previousState);
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        // Existing API
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,

        // New API
        optimisticItems,
        isPending,
        undoLastAction,
        canUndo: history.length > 0
      }}
    >
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

