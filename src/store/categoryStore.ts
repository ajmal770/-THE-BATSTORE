import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent: string;
}

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const rawCategoriesData: { name: string; subs: string[] }[] = [
  {
    name: 'Audio',
    subs: ['Audio Accessories', 'Earbuds', 'Headphones', 'Home Audio Systems', 'Microphones', 'Soundbars', 'Speakers']
  },
  {
    name: 'Automotive',
    subs: ['Bike Accessories', 'Car Accessories', 'Car Care Products', 'Car Electronics', 'Riding Gear', 'Tyres & Accessories', 'Vehicle Cleaning']
  },
  {
    name: 'Beauty & Personal Care',
    subs: ['Beauty Tools', 'Fragrance', 'Hair Care', 'Makeup', 'Personal Care', 'Skincare']
  },
  {
    name: 'Books & Stationery',
    subs: ['Academic Books', 'Art & Craft Supplies', 'Educational Books', 'Fiction & Nonfiction', 'Notebooks & Diaries', 'Office Supplies', 'Pens & Pencils']
  },
  {
    name: 'Electronics',
    subs: ['Computer Accessories', 'Desktops & Monitors', 'Laptops', 'Networking', 'Printers & Accessories', 'Smartphones', 'Storage Devices', 'Tablets']
  },
  {
    name: 'Fashion',
    subs: ['Apparel', 'Bags & Backpacks', 'Fashion Accessories', 'Footwear', 'Kids', 'Men', 'Watches & Jewelry', 'Women']
  },
  {
    name: 'Furniture',
    subs: ['Bedroom', 'Dining Room', 'Living Room', 'Office Furniture', 'Outdoor Furniture', 'Storage Furniture']
  },
  {
    name: 'Gaming',
    subs: ['Gaming Accessories', 'Gaming Consoles', 'Gaming Monitors', 'Gaming PCs', 'Video Games', 'VR Headsets']
  },
  {
    name: 'Garden & Outdoor',
    subs: ['Garden Furniture', 'Gardening Tools', 'Outdoor Lighting', 'Planters & Pots', 'Seeds & Plants', 'Watering Equipment']
  },
  {
    name: 'Gifts & Collectibles',
    subs: ['Collectibles', 'Gift Sets', 'Greeting Cards', 'Hobby Kits', 'Personalized Gifts', 'Seasonal Gifts']
  },
  {
    name: 'Grocery & Gourmet Food',
    subs: ['Beverages', 'Breakfast Foods', 'Chocolates & Sweets', 'Cooking Essentials', 'Organic Foods', 'Packaged Foods', 'Snacks']
  },
  {
    name: 'Health & Wellness',
    subs: ['First Aid Supplies', 'Fitness & Recovery', 'Health Monitoring Devices', 'Massage Equipment', 'Personal Hygiene', 'Wellness Accessories']
  },
  {
    name: 'Home & Kitchen',
    subs: ['Cleaning Supplies', 'Cookware & Bakeware', 'Dining & Serveware', 'Home Appliances', 'Home Decor', 'Kitchen Appliances', 'Lighting', 'Storage & Organization']
  },
  {
    name: 'Jewelry & Luxury',
    subs: ['Fashion Jewelry', 'Gemstone Jewelry', 'Gold Jewelry', 'Jewelry Boxes', 'Luxury Watches', 'Silver Jewelry']
  },
  {
    name: 'Pet Supplies',
    subs: ['Aquariums & Accessories', 'Cat Supplies', 'Dog Supplies', 'Grooming Supplies', 'Pet Beds', 'Pet Food', 'Pet Toys']
  },
  {
    name: 'Photography',
    subs: ['Camera Accessories', 'Camera Lenses', 'Digital Cameras', 'Drones', 'Lighting Equipment', 'Tripods & Stabilizers']
  },
  {
    name: 'Smart Watches & Wearables',
    subs: ['Charging Accessories', 'Fitness Trackers', 'Smart Watches', 'Traditional Watches', 'Watch Straps']
  },
  {
    name: 'Sports & Fitness',
    subs: ['Cycling', 'Gym Equipment', 'Outdoor Recreation', 'Sportswear', 'Team Sports', 'Workout Gear', 'Yoga & Fitness']
  },
  {
    name: 'Toys & Baby Products',
    subs: ['Action Figures', 'Baby Care', 'Baby Clothing', 'Baby Feeding', 'Board Games', 'Dolls', 'Educational Toys', 'Outdoor Toys']
  },
  {
    name: 'Travel & Luggage',
    subs: ['Duffel Bags', 'Neck Pillows', 'Suitcases', 'Travel Accessories', 'Travel Backpacks', 'Travel Organizers']
  }
];

const initialCategories: Category[] = rawCategoriesData.flatMap((cat, idx) => {
  const parentId = (idx + 1).toString();
  const parentSlug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const parentCat: Category = {
    id: parentId,
    name: cat.name,
    slug: parentSlug,
    parent: '-'
  };
  const subCats: Category[] = cat.subs.map((sub, sIdx) => ({
    id: `${parentId}-${sIdx + 1}`,
    name: sub,
    slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    parent: cat.name
  }));
  return [parentCat, ...subCats];
});

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: initialCategories,
      addCategory: (cat) =>
        set((state) => ({
          categories: [...state.categories, { ...cat, id: Date.now().toString() }],
        })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
    }),
    { name: 'thebatstore-categories-storage-v5' }
  )
);
