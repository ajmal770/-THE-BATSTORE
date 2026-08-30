import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  recommended: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  price: number;
  oldPrice?: number;
  salePrice?: number;
  discount?: number;
  stock: number;
  rating: number;
  reviews: number;
  reviewCount?: number;
  reviewsList?: Review[];
  image: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  description?: string;
  isFlashSale?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  createdAt?: string;
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setFlashSale: (id: string, isFlashSale: boolean, discount?: number, oldPrice?: number) => void;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Sony Alpha a7 III Camera', category: 'Photography', subcategory: 'Cameras', price: 1998.00, rating: 4.8, reviews: 124, stock: 15, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', isFeatured: true },
  { id: '2', name: 'Apple Watch Series 9', category: 'Electronics', subcategory: 'Smart Watches', price: 399.00, rating: 4.9, reviews: 890, stock: 50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', isFeatured: true },
  { id: '3', name: 'Premium Noise-Cancelling Headphones', category: 'Electronics', subcategory: 'Audio & Sound', price: 349.99, oldPrice: 499.99, rating: 4.7, reviews: 452, stock: 30, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', isFlashSale: true, discount: 30 },
  { id: '4', name: 'Minimalist Desk Lamp', category: 'Furniture', subcategory: 'Office', price: 89.00, rating: 4.6, reviews: 112, stock: 80, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: '5', name: 'Ergonomic Office Chair', category: 'Furniture', subcategory: 'Office', price: 249.99, rating: 4.5, reviews: 320, stock: 12, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
  { id: '6', name: 'MacBook Pro 16" M3 Max', category: 'Electronics', subcategory: 'Laptops', price: 3499.00, rating: 4.9, reviews: 542, stock: 25, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', isFeatured: true },
  { id: '7', name: 'Wireless Charging Pad', category: 'Electronics', subcategory: 'Smartphones', price: 39.99, rating: 4.4, reviews: 215, stock: 100, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80' },
  { id: '8', name: 'iPhone 15 Pro Max', category: 'Electronics', subcategory: 'Smartphones', price: 1199.00, rating: 4.9, reviews: 1240, stock: 45, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', isFeatured: true },
  { id: '9', name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', subcategory: 'Smartphones', price: 1299.00, rating: 4.8, reviews: 856, stock: 32, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80' },
  { id: '10', name: 'AirPods Pro (2nd Gen)', category: 'Electronics', subcategory: 'Audio & Sound', price: 249.00, rating: 4.8, reviews: 2100, stock: 150, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80' },
  { id: '11', name: 'Leather Messenger Bag', category: 'Fashion', subcategory: 'Bags & Backpacks', price: 180.00, rating: 4.8, reviews: 92, stock: 25, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: '12', name: 'Ceramic Coffee Mug', category: 'Home & Kitchen', subcategory: 'Decor', price: 24.00, rating: 4.9, reviews: 310, stock: 200, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80' },
  { id: '13', name: 'Fitness Tracker Band', category: 'Electronics', subcategory: 'Smart Watches', price: 59.99, oldPrice: 89.99, rating: 4.3, reviews: 450, stock: 70, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80', isFlashSale: true, discount: 33 },
  { id: '14', name: 'Dell XPS 15', category: 'Electronics', subcategory: 'Laptops', price: 1899.00, rating: 4.7, reviews: 289, stock: 15, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80' },
  { id: '15', name: 'Smart Thermostat', category: 'Electronics', price: 249.00, rating: 4.8, reviews: 134, stock: 18, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&q=80' },
  { id: '16', name: 'Yoga Mat Premium', category: 'Sports & Fitness', subcategory: 'Workout Gear', price: 68.00, rating: 4.9, reviews: 540, stock: 90, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80' },
  { id: '17', name: 'Razer Blade 14 Gaming Laptop', category: 'Electronics', subcategory: 'Laptops', price: 2399.99, rating: 4.6, reviews: 345, stock: 55, image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=500&q=80' },
  { id: '18', name: 'Smart Fitness Watch X', category: 'Electronics', subcategory: 'Smart Watches', price: 149.00, oldPrice: 299.00, rating: 4.7, reviews: 890, stock: 25, image: 'https://images.unsplash.com/photo-1546868871-7041f8a44cfb?w=500&q=80', isFlashSale: true, discount: 50 },
  { id: '19', name: '4K Drone Pro Camera', category: 'Photography', subcategory: 'Drones', price: 299.00, oldPrice: 599.00, rating: 4.6, reviews: 180, stock: 10, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80', isFlashSale: true, discount: 50 },
  { id: '20', name: 'Wireless Power Bank 20000mAh', category: 'Electronics', subcategory: 'Smartphones', price: 29.99, oldPrice: 59.99, rating: 4.8, reviews: 920, stock: 80, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80', isFlashSale: true, discount: 50 },
  { id: '21', name: 'Google Pixel 8 Pro', category: 'Electronics', subcategory: 'Smartphones', price: 999.00, oldPrice: 1099.00, rating: 4.7, reviews: 312, stock: 28, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80', isFlashSale: true, discount: 10 },
  { id: '22', name: 'Premium Leather Messenger Bag', category: 'Fashion', subcategory: 'Bags & Backpacks', price: 79.00, oldPrice: 180.00, rating: 4.8, reviews: 92, stock: 15, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', isFlashSale: true, discount: 56 },
  { id: '23', name: 'Gaming Mechanical Keyboard RGB', category: 'Electronics', price: 69.00, oldPrice: 149.00, rating: 4.8, reviews: 542, stock: 30, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', isFlashSale: true, discount: 54 },
  { id: '24', name: 'Lenovo ThinkPad X1 Carbon', category: 'Electronics', subcategory: 'Laptops', price: 1699.00, oldPrice: 1999.00, rating: 4.8, reviews: 145, stock: 12, image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '25', name: 'Bose QuietComfort Earbuds', category: 'Electronics', subcategory: 'Audio & Sound', price: 199.00, oldPrice: 279.00, rating: 4.7, reviews: 671, stock: 45, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80', isFlashSale: true, discount: 30 },
  { id: '26', name: 'ASUS ROG Zephyrus G14', category: 'Electronics', subcategory: 'Laptops', price: 1499.00, oldPrice: 1799.00, rating: 4.8, reviews: 320, stock: 18, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80', isFlashSale: true, discount: 16 },
  { id: '27', name: 'HP Spectre x360 14', category: 'Electronics', subcategory: 'Laptops', price: 1399.00, rating: 4.7, reviews: 190, stock: 22, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80' },
  { id: '28', name: 'Microsoft Surface Laptop 6', category: 'Electronics', subcategory: 'Laptops', price: 1299.00, rating: 4.6, reviews: 85, stock: 40, image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?w=500&q=80' },
  { id: '29', name: 'Samsung Galaxy Watch 6 Classic', category: 'Electronics', subcategory: 'Smart Watches', price: 349.99, rating: 4.8, reviews: 512, stock: 35, image: 'https://images.unsplash.com/photo-1526045612212-70fc35cb4a5e?w=500&q=80' },
  { id: '30', name: 'Garmin Fenix 7 Pro', category: 'Electronics', subcategory: 'Smart Watches', price: 799.99, rating: 4.9, reviews: 320, stock: 15, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' },
  { id: '31', name: 'Google Pixel Watch 2', category: 'Electronics', subcategory: 'Smart Watches', price: 349.00, oldPrice: 399.00, rating: 4.5, reviews: 215, stock: 45, image: 'https://images.unsplash.com/photo-1517420879255-6677f54c33f2?w=500&q=80', isFlashSale: true, discount: 12 },
  { id: '32', name: 'Huawei Watch GT 4', category: 'Electronics', subcategory: 'Smart Watches', price: 249.00, rating: 4.7, reviews: 180, stock: 60, image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&q=80' },
  { id: '33', name: 'Amazfit GTR 4', category: 'Electronics', subcategory: 'Smart Watches', price: 199.99, rating: 4.6, reviews: 420, stock: 85, image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5288?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '34', name: 'Fitbit Versa 4', category: 'Electronics', subcategory: 'Smart Watches', price: 199.95, rating: 4.5, reviews: 890, stock: 120, image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500&q=80' },
  { id: '35', name: 'Fossil Gen 6 Smartwatch', category: 'Electronics', subcategory: 'Smart Watches', price: 299.00, oldPrice: 349.00, rating: 4.4, reviews: 250, stock: 30, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&q=80', isFlashSale: true, discount: 14 },
  { id: '36', name: 'Suunto 9 Baro', category: 'Electronics', subcategory: 'Smart Watches', price: 499.00, rating: 4.8, reviews: 115, stock: 25, image: 'https://images.unsplash.com/photo-1498144846853-6ccac7af1c47?w=500&q=80' },
  { id: '37', name: 'TicWatch Pro 5', category: 'Electronics', subcategory: 'Smart Watches', price: 349.99, rating: 4.6, reviews: 190, stock: 40, image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&q=80' },
  { id: '38', name: 'Sony WH-1000XM5 Wireless Headphones', category: 'Electronics', subcategory: 'Audio & Sound', price: 398.00, rating: 4.9, reviews: 1250, stock: 40, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80', isFeatured: true },
  { id: '39', name: 'Sennheiser Momentum 4', category: 'Electronics', subcategory: 'Audio & Sound', price: 349.95, rating: 4.8, reviews: 412, stock: 25, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80' },
  { id: '40', name: 'JBL Flip 6 Portable Bluetooth Speaker', category: 'Electronics', subcategory: 'Audio & Sound', price: 129.95, rating: 4.8, reviews: 890, stock: 150, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '41', name: 'Sonos Roam Smart Speaker', category: 'Electronics', subcategory: 'Audio & Sound', price: 179.00, rating: 4.6, reviews: 320, stock: 60, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80' },
  { id: '42', name: 'Shure SM7B Vocal Dynamic Microphone', category: 'Electronics', subcategory: 'Audio & Sound', price: 399.00, rating: 4.9, reviews: 2100, stock: 15, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&q=80', isFeatured: true },
  { id: '43', name: 'Audio-Technica ATH-M50x', category: 'Electronics', subcategory: 'Audio & Sound', price: 149.00, rating: 4.8, reviews: 5400, stock: 200, image: 'https://images.unsplash.com/photo-1511335534287-c9af14a2c753?w=500&q=80' },
  { id: '44', name: 'Apple AirPods Max', category: 'Electronics', subcategory: 'Audio & Sound', price: 549.00, rating: 4.7, reviews: 3100, stock: 45, image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&q=80', isFeatured: true },
  { id: '45', name: 'Beats Studio Pro', category: 'Electronics', subcategory: 'Audio & Sound', price: 349.99, rating: 4.6, reviews: 1250, stock: 80, image: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=500&q=80' },
  { id: '46', name: 'Bose SoundLink Revolve+ II', category: 'Electronics', subcategory: 'Audio & Sound', price: 329.00, rating: 4.8, reviews: 890, stock: 35, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', isFlashSale: true, discount: 10 },
  { id: '47', name: 'Marshall Stanmore II', category: 'Electronics', subcategory: 'Audio & Sound', price: 379.99, rating: 4.9, reviews: 650, stock: 20, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80' },
  { id: '48', name: 'Blue Yeti USB Microphone', category: 'Electronics', subcategory: 'Audio & Sound', price: 129.99, rating: 4.7, reviews: 8400, stock: 150, image: 'https://images.unsplash.com/photo-1583548906969-95e54d31405f?w=500&q=80', isFlashSale: true, discount: 20 },
  { id: '49', name: 'Logitech G PRO X Wireless Headset', category: 'Electronics', subcategory: 'Audio & Sound', price: 229.99, rating: 4.6, reviews: 420, stock: 65, image: 'https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?w=500&q=80' },
  { id: '50', name: 'Mid-Century Modern Sofa', category: 'Furniture', subcategory: 'Living Room', price: 899.00, rating: 4.8, reviews: 312, stock: 10, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', isFeatured: true },
  { id: '51', name: 'Solid Wood Coffee Table', category: 'Furniture', subcategory: 'Living Room', price: 249.00, rating: 4.7, reviews: 145, stock: 25, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80' },
  { id: '52', name: 'Velvet Lounge Chair', category: 'Furniture', subcategory: 'Living Room', price: 399.00, rating: 4.9, reviews: 89, stock: 15, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '53', name: 'Upholstered Queen Bed Frame', category: 'Furniture', subcategory: 'Bedroom', price: 549.00, rating: 4.6, reviews: 420, stock: 12, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80' },
  { id: '54', name: 'Minimalist Nightstand', category: 'Furniture', subcategory: 'Bedroom', price: 129.00, rating: 4.5, reviews: 215, stock: 40, image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=500&q=80' },
  { id: '55', name: '6-Drawer Wood Dresser', category: 'Furniture', subcategory: 'Bedroom', price: 499.00, rating: 4.7, reviews: 178, stock: 8, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&q=80' },
  { id: '56', name: 'Adjustable Standing Desk', category: 'Furniture', subcategory: 'Office', price: 399.00, oldPrice: 499.00, rating: 4.8, reviews: 560, stock: 22, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80', isFlashSale: true, discount: 20 },
  { id: '57', name: 'Modern Bookshelf', category: 'Furniture', subcategory: 'Office', price: 189.00, rating: 4.6, reviews: 134, stock: 30, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&q=80' },
  { id: '58', name: 'Minimalist TV Stand', category: 'Furniture', subcategory: 'Living Room', price: 199.00, rating: 4.6, reviews: 120, stock: 45, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80' },
  { id: '59', name: 'Accent Armchair', category: 'Furniture', subcategory: 'Living Room', price: 299.00, rating: 4.7, reviews: 85, stock: 12, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80' },
  { id: '60', name: 'Geometric Area Rug', category: 'Furniture', subcategory: 'Living Room', price: 149.00, rating: 4.5, reviews: 210, stock: 60, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80' },
  { id: '61', name: 'Arc Floor Lamp', category: 'Furniture', subcategory: 'Living Room', price: 129.00, rating: 4.8, reviews: 310, stock: 25, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: '62', name: 'Marble Side Table', category: 'Furniture', subcategory: 'Living Room', price: 89.00, rating: 4.4, reviews: 90, stock: 35, image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=500&q=80' },
  { id: '63', name: 'Tall Bookcase', category: 'Furniture', subcategory: 'Living Room', price: 179.00, rating: 4.6, reviews: 155, stock: 18, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&q=80' },
  { id: '64', name: 'Leather Ottoman', category: 'Furniture', subcategory: 'Living Room', price: 199.00, rating: 4.7, reviews: 75, stock: 14, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80' },
  { id: '65', name: 'Fabric Loveseat', category: 'Furniture', subcategory: 'Living Room', price: 599.00, rating: 4.8, reviews: 240, stock: 10, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80' },
  { id: '66', name: 'Power Recliner', category: 'Furniture', subcategory: 'Living Room', price: 499.00, rating: 4.9, reviews: 400, stock: 20, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80' },
  { id: '67', name: 'Entertainment Center', category: 'Furniture', subcategory: 'Living Room', price: 349.00, rating: 4.5, reviews: 110, stock: 8, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80' },
  { id: '68', name: 'Canvas Wall Art Set', category: 'Furniture', subcategory: 'Living Room', price: 79.00, rating: 4.6, reviews: 320, stock: 50, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80' },
  { id: '69', name: 'Console Table', category: 'Furniture', subcategory: 'Living Room', price: 159.00, rating: 4.7, reviews: 185, stock: 22, image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=500&q=80' },
  { id: '70', name: 'L-Shape Sectional', category: 'Furniture', subcategory: 'Living Room', price: 1299.00, rating: 4.8, reviews: 500, stock: 5, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80' },
  { id: '71', name: '10" Memory Foam Mattress', category: 'Furniture', subcategory: 'Bedroom', price: 399.00, rating: 4.8, reviews: 2000, stock: 40, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80' },
  { id: '72', name: '2-Drawer Nightstand', category: 'Furniture', subcategory: 'Bedroom', price: 89.00, rating: 4.6, reviews: 340, stock: 60, image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=500&q=80' },
  { id: '73', name: 'Wood Wardrobe', category: 'Furniture', subcategory: 'Bedroom', price: 449.00, rating: 4.5, reviews: 150, stock: 15, image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=500&q=80' },
  { id: '74', name: 'Bedside Table Lamp', category: 'Furniture', subcategory: 'Bedroom', price: 49.00, rating: 4.7, reviews: 450, stock: 100, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: '75', name: 'Cotton Comforter Set', category: 'Furniture', subcategory: 'Bedroom', price: 119.00, rating: 4.8, reviews: 800, stock: 55, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80' },
  { id: '76', name: 'Upholstered Bench', category: 'Furniture', subcategory: 'Bedroom', price: 159.00, rating: 4.6, reviews: 220, stock: 25, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80' },
  { id: '77', name: 'Wood Platform Bed', category: 'Furniture', subcategory: 'Bedroom', price: 349.00, rating: 4.7, reviews: 600, stock: 30, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80' },
  { id: '78', name: 'Full-Length Mirror', category: 'Furniture', subcategory: 'Bedroom', price: 129.00, rating: 4.9, reviews: 1100, stock: 45, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80' },
  { id: '79', name: 'Smart Alarm Clock', category: 'Furniture', subcategory: 'Bedroom', price: 39.00, rating: 4.5, reviews: 300, stock: 80, image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=500&q=80' },
  { id: '80', name: 'Plush Bedroom Rug', category: 'Furniture', subcategory: 'Bedroom', price: 89.00, rating: 4.8, reviews: 400, stock: 50, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80' },
  { id: '81', name: 'Blackout Curtains Set', category: 'Furniture', subcategory: 'Bedroom', price: 59.00, rating: 4.7, reviews: 1500, stock: 120, image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=500&q=80' },
  { id: '82', name: 'Brass Bedside Sconce', category: 'Furniture', subcategory: 'Bedroom', price: 69.00, rating: 4.6, reviews: 180, stock: 35, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: '83', name: 'Tall Wood Dresser', category: 'Furniture', subcategory: 'Bedroom', price: 399.00, rating: 4.8, reviews: 290, stock: 15, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80' },
  { id: '84', name: 'Metal Filing Cabinet', category: 'Furniture', subcategory: 'Office', price: 149.00, rating: 4.5, reviews: 420, stock: 50, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
  { id: '85', name: 'Desk Organizer Set', category: 'Furniture', subcategory: 'Office', price: 39.00, rating: 4.8, reviews: 850, stock: 150, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: '86', name: 'Dual Monitor Stand', category: 'Furniture', subcategory: 'Office', price: 59.00, rating: 4.7, reviews: 600, stock: 75, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
  { id: '87', name: 'Faux Potted Plant', category: 'Furniture', subcategory: 'Office', price: 29.00, rating: 4.9, reviews: 1200, stock: 200, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&q=80' },
  { id: '88', name: 'Magnetic Whiteboard', category: 'Furniture', subcategory: 'Office', price: 89.00, rating: 4.6, reviews: 310, stock: 40, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
  { id: '89', name: 'Clear Desk Chair Mat', category: 'Furniture', subcategory: 'Office', price: 49.00, rating: 4.4, reviews: 900, stock: 110, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
  { id: '90', name: 'Leather Desk Pad', category: 'Furniture', subcategory: 'Office', price: 34.00, rating: 4.8, reviews: 1500, stock: 85, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
  { id: '91', name: 'L-Shaped Corner Desk', category: 'Furniture', subcategory: 'Office', price: 299.00, rating: 4.7, reviews: 480, stock: 20, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
  { id: '92', name: 'Mesh Conference Chair', category: 'Furniture', subcategory: 'Office', price: 179.00, rating: 4.5, reviews: 230, stock: 60, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' },
  { id: '93', name: 'LED Task Lamp', category: 'Furniture', subcategory: 'Office', price: 49.00, rating: 4.9, reviews: 750, stock: 95, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { id: '94', name: 'Under-Desk Keyboard Tray', category: 'Furniture', subcategory: 'Office', price: 69.00, rating: 4.4, reviews: 180, stock: 45, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
  { id: '95', name: 'Steel Mesh Trash Can', category: 'Furniture', subcategory: 'Office', price: 19.00, rating: 4.8, reviews: 2200, stock: 300, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80' },
  
  // NEW AUDIO ITEMS
  { id: '101', name: 'Sony HT-A7000 Dolby Atmos Soundbar', category: 'Audio', subcategory: 'Speakers', price: 1299.99, oldPrice: 1499.99, rating: 4.9, reviews: 310, stock: 18, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80', isFlashSale: true, discount: 13, isFeatured: true },
  { id: '102', name: 'Bowers & Wilkins PX8 Wireless Headphones', category: 'Audio', subcategory: 'Headphones', price: 699.00, rating: 4.9, reviews: 185, stock: 12, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', isFeatured: true },
  { id: '103', name: 'Marshall Acton III Bluetooth Speaker', category: 'Audio', subcategory: 'Speakers', price: 279.99, oldPrice: 329.99, rating: 4.8, reviews: 420, stock: 35, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '104', name: 'Bang & Olufsen Beosound A1 2nd Gen', category: 'Audio', subcategory: 'Speakers', price: 299.00, rating: 4.8, reviews: 290, stock: 22, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80' },
  { id: '105', name: 'Sennheiser HD 660S2 Open-Back Headphones', category: 'Audio', subcategory: 'Headphones', price: 499.95, rating: 4.9, reviews: 620, stock: 15, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80' },
  { id: '106', name: 'Technics EAH-AZ80 True Wireless Earbuds', category: 'Audio', subcategory: 'Earbuds', price: 299.99, oldPrice: 349.99, rating: 4.8, reviews: 340, stock: 45, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80', isFlashSale: true, discount: 14 },
  { id: '107', name: 'Sonos Move 2 Portable Smart Speaker', category: 'Audio', subcategory: 'Speakers', price: 449.00, rating: 4.9, reviews: 512, stock: 30, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80' },

  // NEW SMART WATCHES ITEMS
  { id: '108', name: 'Apple Watch Ultra 2 Titanium (49mm)', category: 'Smart Watches', subcategory: 'Wearables', price: 799.00, rating: 4.9, reviews: 1420, stock: 30, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', isFeatured: true },
  { id: '109', name: 'Garmin Epix Pro Gen 2 Sapphire Edition', category: 'Smart Watches', subcategory: 'Fitness', price: 899.99, rating: 4.9, reviews: 310, stock: 10, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80' },
  { id: '110', name: 'Samsung Galaxy Watch Ultra (47mm LTE)', category: 'Smart Watches', subcategory: 'Wearables', price: 649.99, oldPrice: 749.99, rating: 4.8, reviews: 512, stock: 25, image: 'https://images.unsplash.com/photo-1526045612212-70fc35cb4a5e?w=500&q=80', isFlashSale: true, discount: 13 },
  { id: '111', name: 'OnePlus Watch 2 Dual-Engine Smartwatch', category: 'Smart Watches', subcategory: 'Wearables', price: 299.99, rating: 4.7, reviews: 240, stock: 40, image: 'https://images.unsplash.com/photo-1517420879255-6677f54c33f2?w=500&q=80' },
  { id: '112', name: 'Withings ScanWatch Horizon Hybrid GPS', category: 'Smart Watches', subcategory: 'Health', price: 499.95, rating: 4.8, reviews: 180, stock: 16, image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&q=80' },
  { id: '113', name: 'Garmin Forerunner 965 AMOLED Runner Watch', category: 'Smart Watches', subcategory: 'Fitness', price: 599.99, oldPrice: 649.99, rating: 4.9, reviews: 890, stock: 20, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80', isFlashSale: true, discount: 8 },
  { id: '114', name: 'Mobvoi TicWatch Pro 5 Enduro', category: 'Smart Watches', subcategory: 'Wearables', price: 349.99, rating: 4.7, reviews: 310, stock: 35, image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5288?w=500&q=80' },

  // NEW GAMING ITEMS
  { id: '115', name: 'PlayStation 5 Pro Digital Console 2TB', category: 'Gaming', subcategory: 'Consoles', price: 699.99, rating: 4.9, reviews: 2150, stock: 20, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80', isFeatured: true },
  { id: '116', name: 'Xbox Series X 1TB Gaming Console', category: 'Gaming', subcategory: 'Consoles', price: 499.99, rating: 4.8, reviews: 1890, stock: 35, image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80' },
  { id: '117', name: 'Nintendo Switch OLED Zelda Limited Edition', category: 'Gaming', subcategory: 'Consoles', price: 359.99, rating: 4.9, reviews: 3400, stock: 45, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80' },
  { id: '118', name: 'ASUS ROG Ally X Handheld Gaming PC', category: 'Gaming', subcategory: 'Handhelds', price: 799.99, rating: 4.8, reviews: 620, stock: 15, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80', isFeatured: true },
  { id: '119', name: 'Secretlab TITAN Evo Ergonomic Gaming Chair', category: 'Gaming', subcategory: 'Furniture', price: 549.00, oldPrice: 649.00, rating: 4.9, reviews: 1540, stock: 25, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '120', name: 'Logitech G502 LIGHTSPEED Wireless Gaming Mouse', category: 'Gaming', subcategory: 'Fashion', price: 119.99, oldPrice: 149.99, rating: 4.8, reviews: 4200, stock: 100, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80', isFlashSale: true, discount: 20 },
  { id: '121', name: 'Razer BlackWidow V4 Pro Mechanical Keyboard', category: 'Gaming', subcategory: 'Keyboards', price: 229.99, rating: 4.7, reviews: 890, stock: 50, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
  { id: '122', name: 'Samsung Odyssey G9 49" OLED Curved Monitor', category: 'Gaming', subcategory: 'Monitors', price: 1599.99, oldPrice: 1799.99, rating: 4.9, reviews: 410, stock: 12, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80', isFlashSale: true, discount: 11 },
  { id: '123', name: 'SteelSeries Arctis Nova Pro Wireless Headset', category: 'Gaming', subcategory: 'Headsets', price: 349.99, rating: 4.9, reviews: 980, stock: 40, image: 'https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?w=500&q=80' },
  { id: '124', name: 'Elgato Stream Deck MK.2 Production Studio', category: 'Gaming', subcategory: 'Streaming', price: 149.99, oldPrice: 179.99, rating: 4.9, reviews: 2400, stock: 65, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80', isFlashSale: true, discount: 16 },
  { id: '125', name: 'DualSense Edge Wireless Controller for PS5', category: 'Gaming', subcategory: 'Fashion', price: 199.99, rating: 4.8, reviews: 1650, stock: 70, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80' },
  { id: '126', name: 'Canon EOS R5 Mirrorless Camera', category: 'Photography', subcategory: 'Cameras', price: 3899.00, rating: 4.9, reviews: 345, stock: 12, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', isFeatured: true },
  { id: '127', name: 'Nikon Z9 Full-Frame Camera', category: 'Photography', subcategory: 'Cameras', price: 5499.00, rating: 4.8, reviews: 128, stock: 8, image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&q=80' },
  { id: '128', name: 'Sony FE 24-70mm f/2.8 GM II Lens', category: 'Photography', subcategory: 'Lenses', price: 2298.00, rating: 4.9, reviews: 512, stock: 20, image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '129', name: 'DJI Mavic 3 Pro Drone', category: 'Photography', subcategory: 'Drones', price: 2199.00, rating: 4.8, reviews: 890, stock: 15, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80', isFeatured: true },
  { id: '130', name: 'Pro Camera Backpack', category: 'Photography', subcategory: 'Fashion', price: 149.00, rating: 4.7, reviews: 240, stock: 45, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: '131', name: 'Carbon Fiber Tripod', category: 'Photography', subcategory: 'Fashion', price: 299.00, rating: 4.8, reviews: 315, stock: 25, image: 'https://images.unsplash.com/photo-1524748839077-8d2662a5b6f0?w=500&q=80' },
  { id: '132', name: 'Fujifilm X-T5 Mirrorless Camera', category: 'Photography', subcategory: 'Cameras', price: 1699.00, rating: 4.9, reviews: 215, stock: 18, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' },
  { id: '133', name: 'Panasonic Lumix GH6', category: 'Photography', subcategory: 'Cameras', price: 2199.00, rating: 4.7, reviews: 145, stock: 10, image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&q=80' },
  { id: '134', name: 'Sigma 35mm f/1.4 Art Lens', category: 'Photography', subcategory: 'Lenses', price: 899.00, rating: 4.8, reviews: 620, stock: 35, image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&q=80', isFlashSale: true, discount: 20 },
  { id: '135', name: 'Canon RF 50mm f/1.2 L USM Lens', category: 'Photography', subcategory: 'Lenses', price: 2299.00, rating: 4.9, reviews: 198, stock: 12, image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=500&q=80' },
  { id: '136', name: 'DJI Mini 4 Pro', category: 'Photography', subcategory: 'Drones', price: 959.00, rating: 4.8, reviews: 1100, stock: 25, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80' },
  { id: '137', name: 'Autel Robotics EVO Lite+', category: 'Photography', subcategory: 'Drones', price: 1249.00, rating: 4.6, reviews: 210, stock: 15, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80' },
  { id: '138', name: 'SanDisk 128GB Extreme PRO SDXC', category: 'Photography', subcategory: 'Fashion', price: 39.99, rating: 4.9, reviews: 4500, stock: 200, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: '139', name: 'Godox V860III Camera Flash', category: 'Photography', subcategory: 'Fashion', price: 229.00, rating: 4.7, reviews: 310, stock: 40, image: 'https://images.unsplash.com/photo-1524748839077-8d2662a5b6f0?w=500&q=80' },
  { id: '140', name: 'Peak Design Everyday Sling 6L', category: 'Photography', subcategory: 'Fashion', price: 119.95, rating: 4.9, reviews: 890, stock: 65, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: '141', name: 'Tiffen 77mm Variable ND Filter', category: 'Photography', subcategory: 'Fashion', price: 129.00, rating: 4.6, reviews: 412, stock: 55, image: 'https://images.unsplash.com/photo-1524748839077-8d2662a5b6f0?w=500&q=80' },
  { id: '142', name: 'Classic White T-Shirt', category: 'Fashion', subcategory: 'Men', price: 24.99, rating: 4.5, reviews: 890, stock: 150, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', isFlashSale: true, discount: 10 },
  { id: '143', name: 'Vintage Denim Jacket', category: 'Fashion', subcategory: 'Women', price: 89.00, rating: 4.8, reviews: 320, stock: 45, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80' },
  { id: '144', name: 'Hydrating Facial Serum', category: 'Beauty', subcategory: 'Skincare', price: 45.00, rating: 4.9, reviews: 1240, stock: 80, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', isFeatured: true },
  { id: '145', name: 'Matte Liquid Lipstick', category: 'Beauty', subcategory: 'Makeup', price: 18.00, rating: 4.6, reviews: 512, stock: 120, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80' },
  { id: '146', name: 'Modern Velvet Sofa', category: 'Furniture', subcategory: 'Living Room', price: 899.00, rating: 4.7, reviews: 145, stock: 10, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80' },
  { id: '147', name: 'Adjustable Dumbbell Set', category: 'Sports & Fitness', subcategory: 'Workout Gear', price: 199.00, rating: 4.8, reviews: 890, stock: 35, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&q=80', isFlashSale: true, discount: 25 },
  { id: '148', name: 'Mid-Century Dining Table', category: 'Furniture', subcategory: 'Dining', price: 549.00, rating: 4.6, reviews: 210, stock: 18, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500&q=80' },
  { id: '149', name: 'Stainless Steel Water Bottle', category: 'Sports & Fitness', subcategory: 'Fashion', price: 29.99, rating: 4.9, reviews: 1420, stock: 300, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80' },
  { id: '150', name: 'Luxury Scented Candle', category: 'Home & Kitchen', subcategory: 'Decor', price: 34.00, rating: 4.8, reviews: 560, stock: 95, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&q=80' },
  { id: '151', name: 'Men\'s Running Sneakers', category: 'Fashion', subcategory: 'Shoes', price: 129.00, rating: 4.7, reviews: 890, stock: 65, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', isFeatured: true },
  { id: '152', name: 'Luxury Chronograph Watch', category: 'Fashion', subcategory: 'Watches', price: 499.00, rating: 4.9, reviews: 310, stock: 15, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80' },
  { id: '153', name: 'Minimalist Leather Watch', category: 'Fashion', subcategory: 'Watches', price: 129.00, rating: 4.6, reviews: 145, stock: 45, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80', isFlashSale: true, discount: 20 },
  { id: '154', name: 'Gold Chain Necklace', category: 'Fashion', subcategory: 'Jewelry', price: 89.00, rating: 4.8, reviews: 212, stock: 30, image: 'https://images.unsplash.com/photo-1599643478514-4a4209228eb9?w=500&q=80' },
  { id: '155', name: 'Diamond Stud Earrings', category: 'Fashion', subcategory: 'Jewelry', price: 299.00, rating: 4.9, reviews: 156, stock: 20, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80', isFeatured: true },
  { id: '156', name: 'Cozy Knit Sweater', category: 'Fashion', subcategory: 'Apparel', price: 59.99, rating: 4.7, reviews: 540, stock: 85, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80' },
  { id: '157', name: 'Slim Fit Chinos', category: 'Fashion', subcategory: 'Apparel', price: 45.00, rating: 4.5, reviews: 320, stock: 110, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '158', name: 'Smart Coffee Maker', category: 'Home & Kitchen', subcategory: 'Appliances', price: 149.99, rating: 4.8, reviews: 540, stock: 45, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80' },
  { id: '159', name: 'Air Fryer Max XL', category: 'Home & Kitchen', subcategory: 'Appliances', price: 129.00, rating: 4.9, reviews: 1240, stock: 65, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80', isFlashSale: true, discount: 20 },
  { id: '160', name: 'Robot Vacuum Cleaner', category: 'Home & Kitchen', subcategory: 'Appliances', price: 299.00, rating: 4.7, reviews: 890, stock: 25, image: 'https://images.unsplash.com/photo-1589839589302-b258ee0420df?w=500&q=80' },
  { id: '161', name: 'High-Speed Blender', category: 'Home & Kitchen', subcategory: 'Appliances', price: 89.00, rating: 4.8, reviews: 312, stock: 80, image: 'https://images.unsplash.com/photo-1585237834241-db4ecbc89c74?w=500&q=80', isFeatured: true },
  { id: '162', name: 'Waterproof Camping Tent', category: 'Sports & Fitness', subcategory: 'Outdoor', price: 189.00, rating: 4.8, reviews: 340, stock: 25, image: 'https://images.unsplash.com/photo-1504280390227-3665a3977c7b?w=500&q=80', isFeatured: true },
  { id: '163', name: 'Lightweight Sleeping Bag', category: 'Sports & Fitness', subcategory: 'Outdoor', price: 65.00, rating: 4.7, reviews: 520, stock: 120, image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '164', name: 'Trekking Backpack 50L', category: 'Sports & Fitness', subcategory: 'Outdoor', price: 110.00, rating: 4.9, reviews: 890, stock: 45, image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500&q=80' },
  { id: '165', name: 'Portable Camping Stove', category: 'Sports & Fitness', subcategory: 'Outdoor', price: 45.00, rating: 4.6, reviews: 210, stock: 80, image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=500&q=80' },
  { id: '166', name: 'Signature Eau de Parfum', category: 'Beauty', subcategory: 'Fragrance', price: 125.00, rating: 4.9, reviews: 450, stock: 40, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80', isFeatured: true },
  { id: '167', name: 'Floral Bloom Perfume', category: 'Beauty', subcategory: 'Fragrance', price: 85.00, rating: 4.7, reviews: 320, stock: 55, image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500&q=80', isFlashSale: true, discount: 15 },
  { id: '168', name: 'Woody Cedar Cologne', category: 'Beauty', subcategory: 'Fragrance', price: 95.00, rating: 4.8, reviews: 215, stock: 30, image: 'https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?w=500&q=80' },
  { id: '169', name: 'Travel Size Discovery Set', category: 'Beauty', subcategory: 'Fragrance', price: 45.00, rating: 4.9, reviews: 890, stock: 120, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80' },
  { id: '170', name: 'Vitamin C Brightening Serum', category: 'Beauty', subcategory: 'Skincare', price: 58.00, rating: 4.8, reviews: 1120, stock: 95, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', isFlashSale: true, discount: 20 },
  { id: '171', name: 'Overnight Repair Cream', category: 'Beauty', subcategory: 'Skincare', price: 75.00, rating: 4.9, reviews: 840, stock: 60, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80' },
  { id: '172', name: 'Gentle Foaming Cleanser', category: 'Beauty', subcategory: 'Skincare', price: 28.00, rating: 4.7, reviews: 1560, stock: 150, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80' },
  { id: '173', name: 'Daily Sunscreen SPF 50', category: 'Beauty', subcategory: 'Skincare', price: 34.00, rating: 4.8, reviews: 2100, stock: 200, image: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?w=500&q=80', isFeatured: true }
];

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: initialProducts,
      addProduct: (product) =>
        set((state) => ({
          products: [
            { ...product, id: Date.now().toString() },
            ...state.products,
          ],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      setFlashSale: (id, isFlashSale, discount, oldPrice) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isFlashSale, discount, oldPrice } : p
          ),
        })),
      addReview: (productId, review) =>
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== productId) return p;
            const newReview: Review = {
              ...review,
              id: `REV-${Date.now()}`,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            };
            const currentReviews = p.reviewsList || [];
            // Update average rating
            const totalRating = currentReviews.reduce((sum, r) => sum + r.rating, 0) + newReview.rating;
            const newAverageRating = Number((totalRating / (currentReviews.length + 1)).toFixed(1));
            
            return {
              ...p,
              reviewsList: [newReview, ...currentReviews],
              rating: newAverageRating,
              reviews: p.reviews + 1,
              reviewCount: (p.reviewCount || p.reviews) + 1
            };
          }),
        })),
    }),
    { name: 'postscout-products-storage-v15' }
  )
);
