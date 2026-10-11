import React from 'react';
import {
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Armchair,
  Camera,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  Sparkles,
  BookOpen,
  Baby,
  Car,
  UtensilsCrossed,
  HeartPulse,
  PawPrint,
  Gem,
  Luggage,
  Leaf,
  Gift
} from 'lucide-react';

export interface MegaCategorySection {
  name: string;
  icon: React.ReactNode;
  subcategories: string[];
}

export interface MegaColumn {
  sections: MegaCategorySection[];
}

export const TOP_CATEGORY_TABS: string[] = [
  'Audio',
  'Automotive',
  'Beauty & Personal Care',
  'Books & Stationery',
  'Electronics',
  'Fashion',
  'Furniture',
  'Gaming',
  'Garden & Outdoor',
  'Gifts & Collectibles',
  'Grocery & Gourmet Food',
  'Health & Wellness',
  'Home & Kitchen',
  'Jewelry & Luxury',
  'Pet Supplies',
  'Photography',
  'Smart Watches & Wearables',
  'Sports & Fitness',
  'Toys & Baby Products',
  'Travel & Luggage'
];

export const MEGA_COLUMNS: MegaColumn[] = [
  // Column 1 (A - B)
  {
    sections: [
      {
        name: 'Audio',
        icon: <Headphones size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Audio Accessories',
          'Earbuds',
          'Headphones',
          'Home Audio Systems',
          'Microphones',
          'Soundbars',
          'Speakers'
        ]
      },
      {
        name: 'Automotive',
        icon: <Car size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Bike Accessories',
          'Car Accessories',
          'Car Care Products',
          'Car Electronics',
          'Riding Gear',
          'Tyres & Accessories',
          'Vehicle Cleaning'
        ]
      },
      {
        name: 'Beauty & Personal Care',
        icon: <Sparkles size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Beauty Tools',
          'Fragrance',
          'Hair Care',
          'Makeup',
          'Personal Care',
          'Skincare'
        ]
      },
      {
        name: 'Books & Stationery',
        icon: <BookOpen size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Academic Books',
          'Art & Craft Supplies',
          'Educational Books',
          'Fiction & Nonfiction',
          'Notebooks & Diaries',
          'Office Supplies',
          'Pens & Pencils'
        ]
      }
    ]
  },
  // Column 2 (E - G)
  {
    sections: [
      {
        name: 'Electronics',
        icon: <Laptop size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Computer Accessories',
          'Desktops & Monitors',
          'Laptops',
          'Networking',
          'Printers & Accessories',
          'Smartphones',
          'Storage Devices',
          'Tablets'
        ]
      },
      {
        name: 'Fashion',
        icon: <Shirt size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Apparel',
          'Bags & Backpacks',
          'Fashion Accessories',
          'Footwear',
          'Kids',
          'Men',
          'Watches & Jewelry',
          'Women'
        ]
      },
      {
        name: 'Furniture',
        icon: <Armchair size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Bedroom',
          'Dining Room',
          'Living Room',
          'Office Furniture',
          'Outdoor Furniture',
          'Storage Furniture'
        ]
      },
      {
        name: 'Gaming',
        icon: <Gamepad2 size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Gaming Accessories',
          'Gaming Consoles',
          'Gaming Monitors',
          'Gaming PCs',
          'Video Games',
          'VR Headsets'
        ]
      }
    ]
  },
  // Column 3 (G - H)
  {
    sections: [
      {
        name: 'Garden & Outdoor',
        icon: <Leaf size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Garden Furniture',
          'Gardening Tools',
          'Outdoor Lighting',
          'Planters & Pots',
          'Seeds & Plants',
          'Watering Equipment'
        ]
      },
      {
        name: 'Gifts & Collectibles',
        icon: <Gift size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Collectibles',
          'Gift Sets',
          'Greeting Cards',
          'Hobby Kits',
          'Personalized Gifts',
          'Seasonal Gifts'
        ]
      },
      {
        name: 'Grocery & Gourmet Food',
        icon: <UtensilsCrossed size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Beverages',
          'Breakfast Foods',
          'Chocolates & Sweets',
          'Cooking Essentials',
          'Organic Foods',
          'Packaged Foods',
          'Snacks'
        ]
      },
      {
        name: 'Health & Wellness',
        icon: <HeartPulse size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'First Aid Supplies',
          'Fitness & Recovery',
          'Health Monitoring Devices',
          'Massage Equipment',
          'Personal Hygiene',
          'Wellness Accessories'
        ]
      }
    ]
  },
  // Column 4 (H - P)
  {
    sections: [
      {
        name: 'Home & Kitchen',
        icon: <HomeIcon size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Cleaning Supplies',
          'Cookware & Bakeware',
          'Dining & Serveware',
          'Home Appliances',
          'Home Decor',
          'Kitchen Appliances',
          'Lighting',
          'Storage & Organization'
        ]
      },
      {
        name: 'Jewelry & Luxury',
        icon: <Gem size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Fashion Jewelry',
          'Gemstone Jewelry',
          'Gold Jewelry',
          'Jewelry Boxes',
          'Luxury Watches',
          'Silver Jewelry'
        ]
      },
      {
        name: 'Pet Supplies',
        icon: <PawPrint size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Aquariums & Accessories',
          'Cat Supplies',
          'Dog Supplies',
          'Grooming Supplies',
          'Pet Beds',
          'Pet Food',
          'Pet Toys'
        ]
      },
      {
        name: 'Photography',
        icon: <Camera size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Camera Accessories',
          'Camera Lenses',
          'Digital Cameras',
          'Drones',
          'Lighting Equipment',
          'Tripods & Stabilizers'
        ]
      }
    ]
  },
  // Column 5 (S - T)
  {
    sections: [
      {
        name: 'Smart Watches & Wearables',
        icon: <Watch size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Charging Accessories',
          'Fitness Trackers',
          'Smart Watches',
          'Traditional Watches',
          'Watch Straps'
        ]
      },
      {
        name: 'Sports & Fitness',
        icon: <Dumbbell size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Cycling',
          'Gym Equipment',
          'Outdoor Recreation',
          'Sportswear',
          'Team Sports',
          'Workout Gear',
          'Yoga & Fitness'
        ]
      },
      {
        name: 'Toys & Baby Products',
        icon: <Baby size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Action Figures',
          'Baby Care',
          'Baby Clothing',
          'Baby Feeding',
          'Board Games',
          'Dolls',
          'Educational Toys',
          'Outdoor Toys'
        ]
      },
      {
        name: 'Travel & Luggage',
        icon: <Luggage size={18} className="text-sapphire stroke-[2.2]" />,
        subcategories: [
          'Duffel Bags',
          'Neck Pillows',
          'Suitcases',
          'Travel Accessories',
          'Travel Backpacks',
          'Travel Organizers'
        ]
      }
    ]
  }
];
