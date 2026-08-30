import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Brand {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
}

interface BrandStore {
  brands: Brand[];
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
}

const initialBrands: Brand[] = [
  { id: '1', name: 'Sony', status: 'Active' },
  { id: '2', name: 'Apple', status: 'Active' },
  { id: '3', name: 'Samsung', status: 'Active' },
  { id: '4', name: 'Logitech', status: 'Inactive' },
];

export const useBrandStore = create<BrandStore>()(
  persist(
    (set) => ({
      brands: initialBrands,
      addBrand: (brand) =>
        set((state) => ({
          brands: [...state.brands, { ...brand, id: Date.now().toString() }],
        })),
      updateBrand: (id, updates) =>
        set((state) => ({
          brands: state.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBrand: (id) =>
        set((state) => ({
          brands: state.brands.filter((b) => b.id !== id),
        })),
    }),
    { name: 'postscout-brands-storage' }
  )
);
