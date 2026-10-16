import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Brand {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive';
}

export const BRAND_ITEM_CATEGORIES = [
  'All Items',
  'Smartphones & Mobile',
  'Computers & Laptops',
  'Audio & Sound',
  'Gaming & Peripherals',
  'Cameras & Photography',
  'Smart Wearables & Fitness',
  'Home Appliances & Kitchen',
  'Furniture & Living',
  'Watches & Luxury',
  'Fashion & Apparel',
  'Beauty & Cosmetics',
  'General & Accessories'
] as const;

export type BrandItemCategory = typeof BRAND_ITEM_CATEGORIES[number];

interface BrandStore {
  brands: Brand[];
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
}

interface BrandSeed {
  name: string;
  category: string;
}

const initialBrandSeeds: BrandSeed[] = [
  // Smartphones & Mobile
  { name: 'Apple', category: 'Smartphones & Mobile' },
  { name: 'Samsung', category: 'Smartphones & Mobile' },
  { name: 'Xiaomi', category: 'Smartphones & Mobile' },
  { name: 'Huawei', category: 'Smartphones & Mobile' },
  { name: 'OnePlus', category: 'Smartphones & Mobile' },
  { name: 'Google', category: 'Smartphones & Mobile' },
  { name: 'Motorola', category: 'Smartphones & Mobile' },
  { name: 'Nokia', category: 'Smartphones & Mobile' },
  { name: 'Realme', category: 'Smartphones & Mobile' },
  { name: 'Oppo', category: 'Smartphones & Mobile' },
  { name: 'Vivo', category: 'Smartphones & Mobile' },
  { name: 'Poco', category: 'Smartphones & Mobile' },
  { name: 'Honor', category: 'Smartphones & Mobile' },
  { name: 'ZTE', category: 'Smartphones & Mobile' },
  { name: 'TCL', category: 'Smartphones & Mobile' },
  { name: 'Nothing', category: 'Smartphones & Mobile' },
  { name: 'iQOO', category: 'Smartphones & Mobile' },
  { name: 'Infinix', category: 'Smartphones & Mobile' },
  { name: 'Tecno', category: 'Smartphones & Mobile' },
  { name: 'HTC', category: 'Smartphones & Mobile' },
  { name: 'BlackBerry', category: 'Smartphones & Mobile' },
  { name: 'Meizu', category: 'Smartphones & Mobile' },
  { name: 'Nubia', category: 'Smartphones & Mobile' },
  { name: 'Fairphone', category: 'Smartphones & Mobile' },
  { name: 'Micromax', category: 'Smartphones & Mobile' },
  { name: 'Lava', category: 'Smartphones & Mobile' },
  { name: 'Alcatel', category: 'Smartphones & Mobile' },

  // Computers & Laptops
  { name: 'Dell', category: 'Computers & Laptops' },
  { name: 'HP', category: 'Computers & Laptops' },
  { name: 'Lenovo', category: 'Computers & Laptops' },
  { name: 'Acer', category: 'Computers & Laptops' },
  { name: 'Asus', category: 'Computers & Laptops' },
  { name: 'Intel', category: 'Computers & Laptops' },
  { name: 'AMD', category: 'Computers & Laptops' },
  { name: 'Nvidia', category: 'Computers & Laptops' },
  { name: 'Microsoft', category: 'Computers & Laptops' },

  // Audio & Sound
  { name: 'Bose', category: 'Audio & Sound' },
  { name: 'JBL', category: 'Audio & Sound' },
  { name: 'Sennheiser', category: 'Audio & Sound' },
  { name: 'Audio-Technica', category: 'Audio & Sound' },
  { name: 'Beats', category: 'Audio & Sound' },
  { name: 'Skullcandy', category: 'Audio & Sound' },
  { name: 'Marshall', category: 'Audio & Sound' },
  { name: 'Harman Kardon', category: 'Audio & Sound' },

  // Gaming & Peripherals
  { name: 'Logitech', category: 'Gaming & Peripherals' },
  { name: 'Razer', category: 'Gaming & Peripherals' },
  { name: 'Corsair', category: 'Gaming & Peripherals' },
  { name: 'SteelSeries', category: 'Gaming & Peripherals' },
  { name: 'HyperX', category: 'Gaming & Peripherals' },
  { name: 'Nintendo', category: 'Gaming & Peripherals' },
  { name: 'PlayStation', category: 'Gaming & Peripherals' },
  { name: 'Xbox', category: 'Gaming & Peripherals' },

  // Cameras & Photography
  { name: 'Sony', category: 'Cameras & Photography' },
  { name: 'Canon', category: 'Cameras & Photography' },
  { name: 'Nikon', category: 'Cameras & Photography' },
  { name: 'GoPro', category: 'Cameras & Photography' },

  // Smart Wearables & Fitness
  { name: 'Garmin', category: 'Smart Wearables & Fitness' },
  { name: 'Fitbit', category: 'Smart Wearables & Fitness' },

  // Home Appliances & Kitchen
  { name: 'LG', category: 'Home Appliances & Kitchen' },
  { name: 'Panasonic', category: 'Home Appliances & Kitchen' },
  { name: 'Philips', category: 'Home Appliances & Kitchen' },
  { name: 'Braun', category: 'Home Appliances & Kitchen' },
  { name: 'Gillette', category: 'Home Appliances & Kitchen' },
  { name: 'Dyson', category: 'Home Appliances & Kitchen' },
  { name: 'Whirlpool', category: 'Home Appliances & Kitchen' },
  { name: 'Bosch', category: 'Home Appliances & Kitchen' },
  { name: 'Siemens', category: 'Home Appliances & Kitchen' },
  { name: 'Electrolux', category: 'Home Appliances & Kitchen' },
  { name: 'Miele', category: 'Home Appliances & Kitchen' },
  { name: 'KitchenAid', category: 'Home Appliances & Kitchen' },
  { name: 'Oster', category: 'Home Appliances & Kitchen' },
  { name: 'Cuisinart', category: 'Home Appliances & Kitchen' },
  { name: 'Breville', category: 'Home Appliances & Kitchen' },
  { name: 'DeLonghi', category: 'Home Appliances & Kitchen' },
  { name: 'Nespresso', category: 'Home Appliances & Kitchen' },
  { name: 'Keurig', category: 'Home Appliances & Kitchen' },

  // Furniture & Living
  { name: 'IKEA', category: 'Furniture & Living' },
  { name: 'Ashley Furniture', category: 'Furniture & Living' },
  { name: 'Wayfair', category: 'Furniture & Living' },
  { name: 'West Elm', category: 'Furniture & Living' },
  { name: 'Pottery Barn', category: 'Furniture & Living' },
  { name: 'CB2', category: 'Furniture & Living' },
  { name: 'Crate & Barrel', category: 'Furniture & Living' },

  // Watches & Luxury
  { name: 'Rolex', category: 'Watches & Luxury' },
  { name: 'Omega', category: 'Watches & Luxury' },
  { name: 'Seiko', category: 'Watches & Luxury' },
  { name: 'Casio', category: 'Watches & Luxury' },
  { name: 'Citizen', category: 'Watches & Luxury' },
  { name: 'Fossil', category: 'Watches & Luxury' },
  { name: 'Timex', category: 'Watches & Luxury' },

  // Fashion & Apparel
  { name: 'Nike', category: 'Fashion & Apparel' },
  { name: 'Adidas', category: 'Fashion & Apparel' },
  { name: 'Puma', category: 'Fashion & Apparel' },
  { name: 'Under Armour', category: 'Fashion & Apparel' },
  { name: 'Guess', category: 'Fashion & Apparel' },
  { name: 'Tommy Hilfiger', category: 'Fashion & Apparel' },
  { name: 'Ralph Lauren', category: 'Fashion & Apparel' },
  { name: 'Calvin Klein', category: 'Fashion & Apparel' },
  { name: 'Hugo Boss', category: 'Fashion & Apparel' },
  { name: 'Armani', category: 'Fashion & Apparel' },
  { name: 'Gucci', category: 'Fashion & Apparel' },
  { name: 'Prada', category: 'Fashion & Apparel' },
  { name: 'Louis Vuitton', category: 'Fashion & Apparel' },
  { name: 'Chanel', category: 'Fashion & Apparel' },
  { name: 'Dior', category: 'Fashion & Apparel' },
  { name: 'Hermes', category: 'Fashion & Apparel' },
  { name: 'Burberry', category: 'Fashion & Apparel' },
  { name: 'Versace', category: 'Fashion & Apparel' },
  { name: 'Balenciaga', category: 'Fashion & Apparel' },
  { name: 'Fendi', category: 'Fashion & Apparel' },
  { name: 'Zara', category: 'Fashion & Apparel' },
  { name: 'H&M', category: 'Fashion & Apparel' },
  { name: 'Uniqlo', category: 'Fashion & Apparel' },
  { name: 'Forever 21', category: 'Fashion & Apparel' },
  { name: 'Gap', category: 'Fashion & Apparel' },
  { name: 'Levi\'s', category: 'Fashion & Apparel' },
  { name: 'Wrangler', category: 'Fashion & Apparel' },
  { name: 'Lee', category: 'Fashion & Apparel' },
  { name: 'Vans', category: 'Fashion & Apparel' },
  { name: 'Converse', category: 'Fashion & Apparel' },
  { name: 'New Balance', category: 'Fashion & Apparel' },
  { name: 'Reebok', category: 'Fashion & Apparel' },
  { name: 'Asics', category: 'Fashion & Apparel' },
  { name: 'Fila', category: 'Fashion & Apparel' },
  { name: 'Champion', category: 'Fashion & Apparel' },
  { name: 'The North Face', category: 'Fashion & Apparel' },
  { name: 'Patagonia', category: 'Fashion & Apparel' },
  { name: 'Columbia', category: 'Fashion & Apparel' },
  { name: 'Timberland', category: 'Fashion & Apparel' },
  { name: 'Salomon', category: 'Fashion & Apparel' },
  { name: 'Amazon', category: 'Fashion & Apparel' },

  // Beauty & Cosmetics
  { name: 'L\'Oreal', category: 'Beauty & Cosmetics' },
  { name: 'Estee Lauder', category: 'Beauty & Cosmetics' },
  { name: 'MAC', category: 'Beauty & Cosmetics' },
  { name: 'Clinique', category: 'Beauty & Cosmetics' },
  { name: 'Sephora', category: 'Beauty & Cosmetics' },
  { name: 'Maybelline', category: 'Beauty & Cosmetics' },
  { name: 'Revlon', category: 'Beauty & Cosmetics' },
  { name: 'Dove', category: 'Beauty & Cosmetics' },
  { name: 'Nivea', category: 'Beauty & Cosmetics' },
  { name: 'Neutrogena', category: 'Beauty & Cosmetics' }
];

const initialBrands: Brand[] = initialBrandSeeds.map((seed, index) => ({
  id: (index + 1).toString(),
  name: seed.name,
  category: seed.category,
  status: 'Active'
}));

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
    {
      name: 'thebatstore-brands-storage-v5',
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.brands)) {
          // Auto-migrate any brands that might be missing the item category
          let needsUpdate = false;
          const updated = state.brands.map((b) => {
            if (!b.category) {
              needsUpdate = true;
              const seed = initialBrandSeeds.find(
                (s) => s.name.toLowerCase() === b.name.toLowerCase()
              );
              return {
                ...b,
                category: seed ? seed.category : 'General & Accessories',
              };
            }
            return b;
          });
          if (needsUpdate) {
            state.brands = updated;
          }
        }
      },
    }
  )
);
