import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed Amount' | 'Free Shipping';
  value: number; // e.g., 20 for Percentage, 50.00 for Fixed Amount, 0 for Free Shipping
  minOrder: number; // 0 if no minimum
  expiry: string; // YYYY-MM-DD or 'Never'
  status: 'Active' | 'Expired';
  usage: number;
}

interface CouponStore {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usage'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  incrementUsage: (code: string) => void;
}

const initialCoupons: Coupon[] = [
  { id: '1', code: 'WELCOME20', type: 'Percentage', value: 20, minOrder: 50, expiry: '2026-12-31', status: 'Active', usage: 145 },
  { id: '2', code: 'FLAT50OFF', type: 'Fixed Amount', value: 50, minOrder: 200, expiry: '2026-11-15', status: 'Active', usage: 32 },
  { id: '3', code: 'FREESHIP', type: 'Free Shipping', value: 0, minOrder: 100, expiry: 'Never', status: 'Active', usage: 890 },
  { id: '4', code: 'SUMMER10', type: 'Percentage', value: 10, minOrder: 0, expiry: '2026-08-31', status: 'Expired', usage: 504 },
];

export const useCouponStore = create<CouponStore>()(
  persist(
    (set) => ({
      coupons: initialCoupons,
      addCoupon: (coupon) =>
        set((state) => ({
          coupons: [
            ...state.coupons,
            { ...coupon, id: Date.now().toString(), usage: 0, code: coupon.code.toUpperCase() },
          ],
        })),
      updateCoupon: (id, updates) =>
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCoupon: (id) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        })),
      incrementUsage: (code) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code.toUpperCase() === code.toUpperCase() ? { ...c, usage: c.usage + 1 } : c
          ),
        })),
    }),
    { name: 'postscout-coupons-storage' }
  )
);
