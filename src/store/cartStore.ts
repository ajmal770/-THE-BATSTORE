import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Coupon } from './couponStore';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, color: string | undefined, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => void;
  getSubtotal: () => number;
  applyCoupon: (coupon: Coupon | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item === existingItem ? { ...item, quantity: item.quantity + newItem.quantity } : item
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (id, color, size) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.color === color && item.size === size)),
        }));
      },
      updateQuantity: (id, color, size, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            (item.id === id && item.color === color && item.size === size) 
              ? { ...item, quantity: Math.max(1, quantity) } 
              : item
          ),
        }));
      },
      clearCart: () => set({ items: [], appliedCoupon: null }),
      getTotalItems: () => {}, // Handled directly in component usually
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
    }),
    {
      name: 'thebatstore-cart-storage', // saves to localStorage automatically
    }
  )
);
