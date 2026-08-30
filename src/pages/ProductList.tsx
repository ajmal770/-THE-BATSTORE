import React, { useState, useMemo, useEffect } from 'react';
import { Star, ChevronDown, Heart, Search, LayoutGrid, List as ListIcon, X, SlidersHorizontal, ChevronRight, Check, ShoppingCart, Eye, Zap, Sparkles, Cpu, Headphones, Watch, ChevronLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useProductStore } from '../store/productStore';
import { motion, AnimatePresence } from 'framer-motion';

const HIERARCHY = [
  { name: 'Electronics', subs: ['Smartphones', 'Laptops', 'Smart Watches', 'Audio & Sound'] },
  { name: 'Furniture', subs: ['Living Room', 'Bedroom', 'Office'] },
  { name: 'Photography', subs: ['Cameras', 'Lenses', 'Drones', 'Accessories'] },
  { name: 'Fashion', subs: ['Apparel', 'Men', 'Women', 'Bags & Backpacks', 'Watches', 'Jewelry'] },
  { name: 'Home & Kitchen', subs: ['Decor', 'Appliances'] },
  { name: 'Sports & Fitness', subs: ['Workout Gear', 'Outdoor'] },
  { name: 'Beauty', subs: ['Skincare', 'Fragrance'] }
];

const COLORS = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Pink'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'];
const BRANDS = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Logitech', 'Dell', 'HP', 'LG', 'Bose'];

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category');

  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  // Layout State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [availability, setAvailability] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  
  const [sortBy, setSortBy] = useState('Featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Sync category param
  useEffect(() => {
    if (initialCategory) {
      // Check if it's a subcategory
      const parentCat = HIERARCHY.find(c => c.subs.includes(initialCategory));
      
      if (parentCat) {
        setSelectedCategory(parentCat.name);
        setSelectedSubcategory(initialCategory);
        if (!expandedCategories.includes(parentCat.name)) {
          setExpandedCategories([...expandedCategories, parentCat.name]);
        }
      } else {
        setSelectedCategory(initialCategory);
        if (!expandedCategories.includes(initialCategory)) {
          setExpandedCategories([...expandedCategories, initialCategory]);
        }
      }
    }
  }, [initialCategory]);

  const toggleCategoryAccordion = (cat: string) => {
    setExpandedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleCategorySelect = (cat: string) => {
    if (selectedCategory === cat) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(cat);
      setSelectedSubcategory(null);
      if (!expandedCategories.includes(cat)) setExpandedCategories([...expandedCategories, cat]);
    }
  };

  const toggleArrayFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedRating(null);
    setAvailability('all');
    setCurrentPage(1);
  };

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerSearch) || p.description?.toLowerCase().includes(lowerSearch));
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedSubcategory) {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => p.brand && selectedBrands.includes(p.brand));
    }

    if (selectedColors.length > 0) {
      result = result.filter(p => p.colors && p.colors.some(c => selectedColors.includes(c)));
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    }

    if (selectedRating) {
      result = result.filter(p => p.rating >= selectedRating);
    }

    if (availability === 'inStock') {
      result = result.filter(p => p.stock > 0);
    } else if (availability === 'outOfStock') {
      result = result.filter(p => p.stock === 0);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    switch (sortBy) {
      case 'Newest':
        result = [...result].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'Price Low to High':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'Price High to Low':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'Best Selling':
        result = [...result].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'Highest Rated':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'Featured':
      default:
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedSubcategory, selectedBrands, selectedColors, selectedSizes, selectedRating, availability, priceRange, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, '...', total];
    if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem({ id: product.id.toString(), name: product.name, price: product.price, quantity: 1, image: product.image });
  };

  const handleQuickOrder = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem({ id: product.id.toString(), name: product.name, price: product.price, quantity: 1, image: product.image });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navigate('/cart');
  };

  const getBadges = (p: any) => {
    const badges = [];
    if (p.isNew) badges.push({ text: 'NEW', color: 'bg-emerald-500' });
    if (p.isFlashSale || p.discount) badges.push({ text: `SALE ${p.discount ? `-${p.discount}%` : ''}`, color: 'bg-rose-500' });
    if (p.isTrending) badges.push({ text: 'HOT', color: 'bg-orange-500' });
    if (p.isBestSeller) badges.push({ text: 'BEST SELLER', color: 'bg-sapphire' });
    return badges.slice(0, 2); // Show max 2
  };

  const renderProductCard = (product: any) => {
    const isList = viewMode === 'list';
    const badges = getBadges(product);
    
    return (
      <div key={product.id} className={`bg-white font-sans rounded-xl sm:rounded-2xl group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex ${isList ? 'flex-row' : 'flex-col'} h-full`}>
        {/* Image Box */}
        <Link to={`/products/${product.id}`} className={`relative bg-gray-50 overflow-hidden block shrink-0 ${isList ? 'w-28 sm:w-64 md:w-72 aspect-square sm:aspect-auto sm:h-full' : 'aspect-square sm:aspect-[4/5] w-full'}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2 z-10">
            {badges.map((b, i) => (
              <span key={i} className={`${b.color} text-white px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded sm:rounded-md text-[8px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm`}>{b.text}</span>
            ))}
          </div>

          {/* Quick Actions (Desktop Hover) */}
          <div className="absolute right-2 top-2 sm:right-4 sm:top-4 flex flex-col gap-1.5 sm:gap-2 sm:opacity-0 sm:translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
            <button onClick={(e) => { e.preventDefault(); toggleItem({ ...product, id: product.id.toString() }); }} className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm sm:bg-white shadow-md hover:bg-pink-50 hover:text-pink-500 transition-colors ${isInWishlist(product.id.toString()) ? 'text-pink-500' : 'text-gray-500'}`}>
              <Heart size={14} className={isInWishlist(product.id.toString()) ? 'fill-current' : ''} />
            </button>
            <button className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center bg-white text-gray-500 shadow-md hover:bg-sapphire hover:text-white transition-colors" title="Quick View">
              <Eye size={16} />
            </button>
          </div>
        </Link>

        {/* Content Box */}
        <div className={`p-3 sm:p-5 flex flex-col flex-1 ${isList ? 'justify-center' : ''}`}>
          {product.brand && <p className="text-[9px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 sm:mb-1.5 line-clamp-1">{product.brand}</p>}
          <Link to={`/products/${product.id}`} className="block mb-1 sm:mb-2">
            <h3 className={`font-bold text-gray-900 hover:text-sapphire transition-colors ${isList ? 'text-sm sm:text-xl line-clamp-2' : 'text-xs sm:text-base line-clamp-2 min-h-[32px] sm:min-h-[48px]'}`}>{product.name}</h3>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-3">
            <div className="flex items-center text-yellow-400">
              <Star className="fill-current" size={10} strokeWidth={2} />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">({product.reviewCount || product.reviews || 0})</span>
          </div>

          {isList && product.description && (
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-4 hidden sm:block">{product.description}</p>
          )}

          <div className={`mt-auto flex ${isList ? 'flex-col sm:flex-row sm:items-center justify-between gap-2' : 'flex-col gap-2 sm:gap-4'}`}>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-black text-sm sm:text-xl text-gray-900">${product.price.toFixed(2)}</span>
              {(product.oldPrice || product.salePrice) && (
                <span className="text-[10px] sm:text-sm text-gray-400 line-through">${(product.oldPrice || product.salePrice).toFixed(2)}</span>
              )}
            </div>
            <div className={`flex flex-row gap-1.5 sm:gap-2 ${isList ? 'w-full sm:w-auto mt-2 sm:mt-0' : 'w-full mt-1 sm:mt-0'}`}>
              <button onClick={(e) => handleQuickOrder(e, product)} disabled={product.stock === 0} className={`flex-1 bg-gray-900 text-white py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2 hover:bg-sapphire transition-colors shadow-sm whitespace-nowrap ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}>
                <Zap size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Quick Order</span><span className="sm:hidden">Buy</span>
              </button>
              <button onClick={(e) => handleQuickAdd(e, product)} disabled={product.stock === 0} className={`w-8 h-8 sm:w-11 sm:h-11 shrink-0 bg-white border border-gray-200 sm:border-2 sm:border-gray-100 text-gray-900 rounded-lg sm:rounded-xl flex items-center justify-center hover:border-sapphire hover:text-sapphire transition-colors ${product.stock === 0 ? 'opacity-50 cursor-not-allowed border-gray-50 text-gray-300' : ''}`} title="Add to Cart">
                <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO title="Shop All Products" description="Premium electronics, fashion, and lifestyle products." />
      
      {/* Classic Light Theme Shop Header */}
      <div className="bg-white border-b border-gray-200/80 shadow-xs relative">
        <div className="container mx-auto px-4 lg:px-8 py-7 sm:py-9">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            {/* Left Info Column */}
            <div className="max-w-2xl">
              {/* Breadcrumb Path */}
              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-2.5">
                <Link to="/" className="hover:text-sapphire transition-colors">Home</Link>
                <ChevronRight size={12} className="text-gray-300" />
                <Link to="/products" className="hover:text-sapphire transition-colors text-gray-700">Shop</Link>
                {selectedCategory && (
                  <>
                    <ChevronRight size={12} className="text-gray-300" />
                    <span className="text-sapphire font-extrabold">{selectedCategory}</span>
                  </>
                )}
                {selectedSubcategory && (
                  <>
                    <ChevronRight size={12} className="text-gray-300" />
                    <span className="text-sapphire font-extrabold">{selectedSubcategory}</span>
                  </>
                )}
              </div>

              {/* Classic Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {selectedSubcategory || selectedCategory ? (
                  <>
                    <span className="text-sapphire">{selectedSubcategory || selectedCategory}</span>
                  </>
                ) : (
                  <>All Products</>
                )}
              </h1>

              <p className="text-gray-500/90 text-sm mt-1.5 font-medium max-w-xl">
                Browse high-performance electronics, wearable tech, audio equipment, and lifestyle products.
              </p>
            </div>

            {/* Right Side Floating Animated Electronics Showcase Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ duration: 0.4 }}
              className="hidden sm:block shrink-0 mt-3 lg:mt-0 cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-slate-950 via-deep-navy to-slate-900 border border-cyan-400/40 group-hover:border-cyan-300 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-cyan-950/40 relative overflow-hidden flex items-center gap-4.5 max-w-md transition-colors duration-500">
                {/* Vibrant Glow Blobs */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/20 blur-2xl rounded-full pointer-events-none group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-sapphire/30 blur-2xl rounded-full pointer-events-none group-hover:bg-sapphire/45 transition-all duration-500"></div>

                {/* Animated Floating Electronics Icons Stack */}
                <div className="relative flex items-center gap-2.5 shrink-0">
                  {/* Central CPU Icon Box with Pulse Aura */}
                  <motion.div 
                    animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-sapphire opacity-75 blur-sm animate-pulse"></div>
                    <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-sapphire via-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-xl border border-white/30">
                      <Cpu size={26} className="stroke-[2.5] drop-shadow-md" />
                    </div>
                  </motion.div>
                  
                  {/* Side Orbit Icons */}
                  <div className="flex flex-col gap-2">
                    <motion.div 
                      animate={{ y: [0, 5, 0], scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut', delay: 0.1 }}
                      className="w-8.5 h-8.5 rounded-xl bg-cyan-500/20 backdrop-blur-md border border-cyan-400/50 text-cyan-300 flex items-center justify-center shadow-md shadow-cyan-500/20"
                    >
                      <Headphones size={17} className="stroke-[2.5]" />
                    </motion.div>

                    <motion.div 
                      animate={{ y: [0, -5, 0], scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut', delay: 0.4 }}
                      className="w-8.5 h-8.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/50 text-amber-300 flex items-center justify-center shadow-md shadow-amber-500/20"
                    >
                      <Watch size={17} className="stroke-[2.5]" />
                    </motion.div>
                  </div>
                </div>

                {/* Tech Badge & Text Content */}
                <div className="relative z-10">
                  {/* Glowing Live Electronics Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-sapphire/30 border border-cyan-400/60 text-cyan-300 text-[10px] font-black uppercase tracking-widest mb-1.5 shadow-md shadow-cyan-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                    </span>
                    Live Electronics
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-white tracking-tight group-hover:text-cyan-200 transition-colors drop-shadow-md">
                    Smart Electronics Showcase
                  </h4>

                  <p className="text-[11px] text-gray-300 mt-0.5 font-bold flex items-center gap-1.5">
                    <span className="text-cyan-300 font-extrabold">{filteredProducts.length} items</span>
                    <span className="text-gray-400 font-medium">verified in stock</span>
                    <Sparkles size={13} className="text-amber-400 animate-[spin_6s_linear_infinite]" />
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Advanced Mobile Category Touch Slider & Filter Toolbar (lg:hidden) */}
        <div className="lg:hidden w-full flex flex-col gap-3 mb-2">
          {/* Quick Categories Horizontal Scroll Pills */}
          <div className="w-full overflow-x-auto scrollbar-none no-scrollbar py-1 -mx-4 px-4 flex items-center gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
                navigate('/products');
              }}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                !selectedCategory ? 'bg-deep-navy text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 shadow-xs'
              }`}
            >
              All Items
            </button>
            {HIERARCHY.map(cat => (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedSubcategory('');
                  navigate(`/products?category=${encodeURIComponent(cat.name)}`);
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.name ? 'bg-sapphire text-white shadow-md' : 'bg-white text-gray-700 border border-gray-200 shadow-xs'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Secondary Subcategories Horizontal Scroll Pills (When a category is active) */}
          {selectedCategory && (
            <div className="w-full overflow-x-auto scrollbar-none no-scrollbar py-1.5 -mx-4 px-4 flex items-center gap-2 bg-blue-50/70 border-y border-blue-100/90 my-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="text-[10px] font-black text-sapphire uppercase tracking-wider shrink-0 mr-1">
                Subcategories:
              </span>
              <button
                onClick={() => setSelectedSubcategory('')}
                className={`shrink-0 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  !selectedSubcategory ? 'bg-sapphire text-white shadow-xs' : 'bg-white/90 text-gray-700 border border-gray-200/80 hover:bg-white'
                }`}
              >
                All {selectedCategory}
              </button>
              {(HIERARCHY.find(c => c.name === selectedCategory)?.subs || []).map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`shrink-0 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSubcategory === sub ? 'bg-sapphire text-white shadow-xs' : 'bg-white/90 text-gray-700 border border-gray-200/80 hover:bg-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Active Filters Pills Strip */}
          {(selectedCategory || selectedSubcategory || selectedBrands.length > 0 || selectedColors.length > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 bg-white border border-sapphire/30 text-sapphire px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-2xs">
                  Category: {selectedCategory}
                  <button onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); navigate('/products'); }} className="hover:text-red-500 ml-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedSubcategory && (
                <span className="inline-flex items-center gap-1 bg-white border border-cyan-500/30 text-cyan-800 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-2xs">
                  Sub: {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory('')} className="hover:text-red-500 ml-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedBrands.map(b => (
                <span key={b} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-2xs">
                  {b}
                  <button onClick={() => toggleArrayFilter(setSelectedBrands, b)} className="hover:text-red-500 ml-0.5 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={resetFilters}
                className="text-[10px] font-black text-red-500 hover:underline px-2 py-1 uppercase tracking-wider ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Dedicated Mobile High-Contrast Search Input Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 stroke-[2.5]" size={16} />
            <input 
              type="text" 
              placeholder="Search products by keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:border-sapphire transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sticky Mobile Filter & Search Bar */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-2.5 shadow-sm flex items-center justify-between gap-2">
            <button 
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex-1 bg-gray-900 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 font-bold text-xs shadow-sm cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {(selectedCategory || selectedBrands.length > 0 || selectedColors.length > 0) && (
                <span className="w-4.5 h-4.5 rounded-full bg-cyan-400 text-gray-950 font-black text-[10px] flex items-center justify-center">
                  {(selectedCategory ? 1 : 0) + (selectedSubcategory ? 1 : 0) + selectedBrands.length + selectedColors.length}
                </span>
              )}
            </button>

            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/80 shrink-0">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-sapphire' : 'text-gray-500'}`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-xs text-sapphire' : 'text-gray-500'}`}
                title="List View"
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 lg:top-24 left-0 w-[300px] lg:w-72 h-[100dvh] lg:h-[calc(100vh-120px)] bg-white lg:bg-transparent z-50 lg:z-auto transition-transform duration-300 ease-in-out ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-2xl lg:shadow-none overflow-y-auto custom-scrollbar flex flex-col shrink-0`}>
          <div className="p-6 lg:p-0 flex flex-col gap-8">
            <div className="flex items-center justify-between lg:hidden mb-2">
              <h2 className="text-xl font-black text-gray-900">Filters</h2>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={16} /></button>
            </div>

            <div className="bg-white lg:rounded-3xl lg:border border-gray-100 lg:p-6 lg:shadow-sm space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">Categories</h3>
                <div className="space-y-1">
                  {HIERARCHY.map(cat => (
                    <div key={cat.name} className="border-b border-gray-50 last:border-0 pb-1 last:pb-0">
                      <button 
                        onClick={() => toggleCategoryAccordion(cat.name)}
                        className={`w-full flex items-center justify-between py-2 text-sm font-bold transition-colors ${selectedCategory === cat.name ? 'text-sapphire' : 'text-gray-700 hover:text-gray-900'}`}
                      >
                        <span onClick={(e) => { e.stopPropagation(); handleCategorySelect(cat.name); }}>{cat.name}</span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${expandedCategories.includes(cat.name) ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {expandedCategories.includes(cat.name) && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="pl-3 py-1 space-y-1 border-l-2 border-gray-100 ml-1 mb-2 mt-1">
                              {cat.subs.map(sub => (
                                <button 
                                  key={sub}
                                  onClick={() => { setSelectedCategory(cat.name); setSelectedSubcategory(sub); }}
                                  className={`w-full text-left py-1.5 text-xs font-medium transition-colors ${selectedSubcategory === sub ? 'text-sapphire font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Price Range</h3>
                  <span className="text-xs font-bold text-sapphire">${priceRange[0]} - ${priceRange[1]}</span>
                </div>
                <div className="space-y-4">
                  <input type="range" min="0" max="5000" step="50" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-sapphire" />
                  <div className="flex items-center gap-3">
                    <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 text-center" placeholder="Min" />
                    <span className="text-gray-400">-</span>
                    <input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 text-center" placeholder="Max" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Brands */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {BRANDS.map(brand => (
                    <label key={brand} onClick={() => toggleArrayFilter(setSelectedBrands, brand)} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${selectedBrands.includes(brand) ? 'bg-sapphire border-sapphire' : 'bg-white border-gray-300 group-hover:border-sapphire'}`}>
                        {selectedBrands.includes(brand) && <Check size={10} className="text-white" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <hr className="border-gray-100" />
              
              {/* Colors */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button 
                      key={color}
                      onClick={() => toggleArrayFilter(setSelectedColors, color)}
                      title={color}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${selectedColors.includes(color) ? 'scale-110 border-gray-900 shadow-md' : 'border-gray-200 hover:scale-105'}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Sizes */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <button 
                      key={size}
                      onClick={() => toggleArrayFilter(setSelectedSizes, size)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xs font-bold transition-colors ${selectedSizes.includes(size) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <hr className="border-gray-100" />
              
              {/* Availability */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">Availability</h3>
                <div className="space-y-2">
                  {(['all', 'inStock', 'outOfStock'] as const).map(opt => (
                    <label key={opt} onClick={() => setAvailability(opt)} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${availability === opt ? 'border-sapphire' : 'border-gray-300 group-hover:border-sapphire'}`}>
                        {availability === opt && <div className="w-2 h-2 rounded-full bg-sapphire" />}
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-gray-900">{opt.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={resetFilters} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors mb-6 lg:mb-0">
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobileDrawerOpen && (
          <div onClick={() => setIsMobileDrawerOpen(false)} className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden" />
        )}

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0 flex flex-col">
          
          {/* Top Toolbar */}
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 stroke-[2.5]" size={16} />
              <input 
                type="text" 
                placeholder="Search products by keyword..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-gray-100/90 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sapphire/30 focus:bg-white focus:border-sapphire transition-all shadow-2xs"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-gray-200/80 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
              <div className="text-xs font-bold text-gray-400 whitespace-nowrap">
                Showing <span className="text-gray-900">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredProducts.length)}</span> of <span className="text-gray-900">{filteredProducts.length}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap border border-gray-100">
                    {sortBy} <ChevronDown size={14} />
                  </button>
                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 py-2">
                      {['Featured', 'Newest', 'Price Low to High', 'Price High to Low', 'Best Selling', 'Highest Rated'].map(opt => (
                        <button key={opt} onClick={() => { setSortBy(opt); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${sortBy === opt ? 'text-sapphire bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 shrink-0">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-sapphire' : 'text-gray-400 hover:text-gray-600'}`}>
                    <LayoutGrid size={16} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-sapphire' : 'text-gray-400 hover:text-gray-600'}`}>
                    <ListIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center justify-center h-[50vh]">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Search size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">We couldn't find any products matching your current filters. Try adjusting your search criteria or resetting filters.</p>
              <button onClick={resetFilters} className="bg-gray-900 hover:bg-sapphire text-white px-8 py-3 rounded-2xl font-black transition-colors shadow-lg">
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6' : 'flex flex-col gap-3 sm:gap-4'}>
                {paginatedProducts.map(renderProductCard)}
              </div>

              {/* Responsive Mobile-Optimized Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
                  {/* Items per page selector */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start border-b sm:border-b-0 pb-3 sm:pb-0 border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Show</span>
                    <select 
                      value={pageSize} 
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} 
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sapphire/20 cursor-pointer"
                    >
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={48}>48 per page</option>
                    </select>
                  </div>
                  
                  {/* Mobile Compact Controls (< sm) */}
                  <div className="flex sm:hidden items-center justify-between gap-2 w-full">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 bg-gray-50 rounded-xl text-xs font-extrabold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={14} /> Prev
                    </button>
                    
                    <span className="text-xs font-extrabold text-gray-900 bg-gray-100 px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs">
                      {currentPage} / {totalPages}
                    </span>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-2 bg-gray-50 rounded-xl text-xs font-extrabold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1 cursor-pointer"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Desktop Smart Truncated Controls (>= sm) */}
                  <div className="hidden sm:flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-100 flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>

                    <div className="flex gap-1 items-center">
                      {getPageNumbers(currentPage, totalPages).map((p, idx) => (
                        typeof p === 'number' ? (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-8 h-8 rounded-xl text-xs font-black transition-colors border cursor-pointer ${currentPage === p ? 'bg-sapphire text-white border-sapphire shadow-md' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                          >
                            {p}
                          </button>
                        ) : (
                          <span key={`dots-${idx}`} className="px-1 text-gray-400 font-bold text-xs">...</span>
                        )
                      ))}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors border border-gray-100 flex items-center gap-1 cursor-pointer"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductList;
