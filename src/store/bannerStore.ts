import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Banner {
  id: string;
  title: string;
  image: string;
  status: 'Active' | 'Inactive';
  order: number;
  link: string;
}

interface BannerStore {
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (banners: Banner[]) => void;
}

const initialBanners: Banner[] = [
  { id: '1', title: 'Summer Tech Sale', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80', status: 'Active', order: 1, link: '/products?category=Electronics' },
  { id: '2', title: 'New Furniture Collection', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', status: 'Inactive', order: 2, link: '/products?category=Furniture' },
];

export const useBannerStore = create<BannerStore>()(
  persist(
    (set) => ({
      banners: initialBanners,
      addBanner: (banner) =>
        set((state) => ({
          banners: [
            ...state.banners,
            { ...banner, id: Date.now().toString() },
          ],
        })),
      updateBanner: (id, updates) =>
        set((state) => ({
          banners: state.banners.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBanner: (id) =>
        set((state) => ({
          banners: state.banners.filter((b) => b.id !== id),
        })),
      reorderBanners: (newBanners) =>
        set(() => ({
          banners: newBanners.map((b, idx) => ({ ...b, order: idx + 1 })),
        })),
    }),
    { name: 'thebatstore-banners-storage' }
  )
);
