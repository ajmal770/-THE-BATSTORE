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

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', parent: '-' },
  { id: '1a', name: 'Smart Watches', slug: 'smart-watches', parent: '-' },
  { id: '1b', name: 'Audio', slug: 'audio', parent: '-' },
  { id: '1c', name: 'Gaming', slug: 'gaming', parent: '-' },
  { id: '1d', name: 'Laptops', slug: 'laptops', parent: 'Electronics' },
  { id: '1e', name: 'Smartphones', slug: 'smartphones', parent: 'Electronics' },

  { id: '2', name: 'Furniture', slug: 'furniture', parent: '-' },
  { id: '2a', name: 'Living Room', slug: 'living-room', parent: 'Furniture' },
  { id: '2b', name: 'Bedroom', slug: 'bedroom', parent: 'Furniture' },
  { id: '2c', name: 'Office', slug: 'office', parent: 'Furniture' },

  { id: '3', name: 'Photography', slug: 'photography', parent: '-' },
  { id: '3a', name: 'Cameras', slug: 'cameras', parent: 'Photography' },
  { id: '3b', name: 'Lenses', slug: 'lenses', parent: 'Photography' },
  { id: '3c', name: 'Drones', slug: 'drones', parent: 'Photography' },
  { id: '3d', name: 'Accessories', slug: 'photography-accessories', parent: 'Photography' },

  { id: '4', name: 'Fashion', slug: 'fashion', parent: '-' },
  { id: '4a', name: 'Apparel', slug: 'apparel', parent: 'Fashion' },
  { id: '4b', name: 'Men', slug: 'men', parent: 'Fashion' },
  { id: '4c', name: 'Women', slug: 'women', parent: 'Fashion' },
  { id: '4d', name: 'Bags & Backpacks', slug: 'bags', parent: 'Fashion' },
  { id: '4e', name: 'Watches', slug: 'watches', parent: 'Fashion' },
  { id: '4f', name: 'Jewelry', slug: 'jewelry', parent: 'Fashion' },

  { id: '5', name: 'Home & Kitchen', slug: 'home', parent: '-' },
  { id: '5a', name: 'Decor', slug: 'decor', parent: 'Home & Kitchen' },
  { id: '5b', name: 'Appliances', slug: 'appliances', parent: 'Home & Kitchen' },

  { id: '6', name: 'Sports & Fitness', slug: 'sports', parent: '-' },
  { id: '6a', name: 'Workout Gear', slug: 'workout-gear', parent: 'Sports & Fitness' },
  { id: '6b', name: 'Outdoor', slug: 'outdoor', parent: 'Sports & Fitness' },

  { id: '8', name: 'Beauty', slug: 'beauty', parent: '-' },
  { id: '8a', name: 'Skincare', slug: 'skincare', parent: 'Beauty' },
  { id: '8b', name: 'Fragrance', slug: 'fragrance', parent: 'Beauty' },
];

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
    { name: 'postscout-categories-storage-v3' }
  )
);
