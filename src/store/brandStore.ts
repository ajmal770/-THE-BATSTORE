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

const brandNames = [
  // Mobile & Smartphone Brands
  'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google', 'Motorola', 'Nokia', 'Realme', 'Oppo',
  'Vivo', 'Poco', 'Honor', 'Sony', 'Asus', 'ZTE', 'TCL', 'Nothing', 'iQOO', 'Infinix', 'Tecno', 'HTC', 'BlackBerry',
  'Meizu', 'Nubia', 'Fairphone', 'Micromax', 'Lava', 'Alcatel',
  
  // Other Global Brands
  'Logitech', 'Nike', 'Adidas', 'Dell', 'HP', 'LG',
  'Panasonic', 'Under Armour', 'Puma', 'Bose', 'Microsoft', 'Lenovo', 'Acer', 'Intel', 'AMD', 'Nvidia',
  'Canon', 'Nikon', 'GoPro', 'Garmin', 'Fitbit', 'Amazon',
  'Razer', 'Corsair', 'SteelSeries', 'HyperX', 'Nintendo', 'PlayStation', 'Xbox', 'JBL', 'Sennheiser', 'Audio-Technica',
  'Beats', 'Skullcandy', 'Marshall', 'Harman Kardon', 'Philips', 'Braun', 'Gillette', 'Dyson', 'Whirlpool', 'Bosch',
  'Siemens', 'Electrolux', 'Miele', 'KitchenAid', 'Oster', 'Cuisinart', 'Breville', 'DeLonghi', 'Nespresso', 'Keurig',
  'IKEA', 'Ashley Furniture', 'Wayfair', 'West Elm', 'Pottery Barn', 'CB2', 'Crate & Barrel', 'Rolex', 'Omega', 'Seiko',
  'Casio', 'Citizen', 'Fossil', 'Timex', 'Guess', 'Tommy Hilfiger', 'Ralph Lauren', 'Calvin Klein', 'Hugo Boss', 'Armani',
  'Gucci', 'Prada', 'Louis Vuitton', 'Chanel', 'Dior', 'Hermes', 'Burberry', 'Versace', 'Balenciaga', 'Fendi',
  'Zara', 'H&M', 'Uniqlo', 'Forever 21', 'Gap', 'Levi\'s', 'Wrangler', 'Lee', 'Vans', 'Converse',
  'New Balance', 'Reebok', 'Asics', 'Fila', 'Champion', 'The North Face', 'Patagonia', 'Columbia', 'Timberland', 'Salomon',
  'L\'Oreal', 'Estee Lauder', 'MAC', 'Clinique', 'Sephora', 'Maybelline', 'Revlon', 'Dove', 'Nivea', 'Neutrogena'
];

const initialBrands: Brand[] = brandNames.map((name, index) => ({
  id: (index + 1).toString(),
  name,
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
    { name: 'thebatstore-brands-storage-v4' }
  )
);
