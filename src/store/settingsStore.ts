import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  address: string;
  flatShippingRate: number;
  freeShippingThreshold: number;
  defaultTaxRate: number;
  metaTitle: string;
  metaDescription: string;
  googleAnalyticsId: string;
  metaPixelId: string;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  storeName: 'The BatStore',
  supportEmail: 'support@batstore.com',
  supportPhone: '+1 (555) 123-4567',
  currency: 'USD ($)',
  address: '123 Gotham Blvd, Suite 400\nGotham City, NY 10001',
  flatShippingRate: 15.00,
  freeShippingThreshold: 100.00,
  defaultTaxRate: 8.0,
  metaTitle: 'The BatStore | Premium E-Commerce Platform',
  metaDescription: 'Shop the latest high-quality electronics, modern furniture, and everyday essentials at The BatStore.',
  googleAnalyticsId: '',
  metaPixelId: '',
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
    }),
    { name: 'thebatstore-settings-storage' }
  )
);
