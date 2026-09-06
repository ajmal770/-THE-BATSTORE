import React, { useState, useEffect, useMemo } from 'react';
import { Star, Clock, Heart, Zap, Search, ShoppingCart, Check, ArrowLeft, Watch, Headphones, Smartphone, Flame, Package, Activity, Sparkles, Gamepad2, Car, Book, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { SEO } from '../components/SEO';

const CATEGORIES = ['All Deals', 'Electronics', 'Fashion', 'Furniture', 'Photography', 'Home & Kitchen', 'Sports', 'Beauty', 'Gaming', 'Automotive', 'Books', 'Gifts'];

const flashSaleProducts = [
  { id: 101, name: 'Noise-Cancelling Headphones Pro', category: 'Electronics', price: 199.99, oldPrice: 349.99, rating: 4.8, reviews: 320, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', discount: 43 },
  { id: 102, name: 'Smart Fitness Watch Series X', category: 'Electronics', price: 149.00, oldPrice: 299.00, rating: 4.7, reviews: 890, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', discount: 50 },
  { id: 103, name: 'Ultra HD Drone with Camera', category: 'Photography', price: 399.00, oldPrice: 599.00, rating: 4.9, reviews: 154, image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&q=80', discount: 33 },
  { id: 104, name: 'Premium Espresso Machine', category: 'Home & Kitchen', price: 449.00, oldPrice: 799.00, rating: 4.6, reviews: 412, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80', discount: 44 },
  { id: 105, name: '4K Action Camera Bundle', category: 'Photography', price: 249.00, oldPrice: 399.00, rating: 4.5, reviews: 210, image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=500&q=80', discount: 37 },
  { id: 106, name: 'Ergonomic Mesh Office Chair', category: 'Furniture', price: 189.00, oldPrice: 320.00, rating: 4.4, reviews: 145, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80', discount: 40 },
  { id: 107, name: 'Wireless Charging Dock Station', category: 'Electronics', price: 45.00, oldPrice: 89.00, rating: 4.8, reviews: 530, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80', discount: 49 },
  { id: 108, name: 'Smart Home Security Camera', category: 'Electronics', price: 79.99, oldPrice: 149.99, rating: 4.6, reviews: 312, image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500&q=80', discount: 46 },
  { id: 109, name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 89.50, oldPrice: 159.00, rating: 4.9, reviews: 1042, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80', discount: 43 },
  { id: 110, name: 'Premium Leather Messenger Bag', category: 'Fashion', price: 110.00, oldPrice: 220.00, rating: 4.8, reviews: 245, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', discount: 50 },
  { id: 111, name: 'Smart Temperature Thermostat', category: 'Electronics', price: 149.00, oldPrice: 249.00, rating: 4.7, reviews: 890, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&q=80', discount: 40 },
  { id: 112, name: 'Vintage Wooden Bookshelf', category: 'Furniture', price: 175.00, oldPrice: 350.00, rating: 4.9, reviews: 112, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&q=80', discount: 50 },
  { id: 113, name: 'Portable 2TB External SSD', category: 'Electronics', price: 139.99, oldPrice: 249.99, rating: 4.8, reviews: 3340, image: 'https://images.unsplash.com/photo-1562254492-377a3ac576f4?w=500&q=80', discount: 44 },
  { id: 114, name: 'Minimalist Ceramic Coffee Mug Set', category: 'Home & Kitchen', price: 19.99, oldPrice: 45.00, rating: 4.5, reviews: 540, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80', discount: 55 },
  { id: 115, name: 'Professional DSLR Camera Body', category: 'Photography', price: 899.00, oldPrice: 1299.00, rating: 4.9, reviews: 124, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', discount: 30 },
  { id: 116, name: 'Curved Ultra-Wide Monitor', category: 'Electronics', price: 399.00, oldPrice: 699.00, rating: 4.7, reviews: 856, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80', discount: 42 },
  { id: 117, name: 'Adjustable Dumbbell Set', category: 'Sports', price: 199.00, oldPrice: 299.00, rating: 4.8, reviews: 450, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&q=80', discount: 33 },
  { id: 118, name: 'Luxury Skincare Gift Set', category: 'Beauty', price: 89.00, oldPrice: 149.00, rating: 4.9, reviews: 672, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80', discount: 40 },
  { id: 119, name: 'Next-Gen VR Headset', category: 'Gaming', price: 299.00, oldPrice: 499.00, rating: 4.6, reviews: 890, image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=500&q=80', discount: 40 },
  { id: 120, name: 'Premium Car Wax Kit', category: 'Automotive', price: 34.99, oldPrice: 59.99, rating: 4.7, reviews: 320, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&q=80', discount: 41 },
  { id: 121, name: 'Bestselling Sci-Fi Novel Set', category: 'Books', price: 45.00, oldPrice: 75.00, rating: 4.9, reviews: 1250, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80', discount: 40 },
  { id: 122, name: 'Artisan Chocolate Box', category: 'Gifts', price: 29.99, oldPrice: 49.99, rating: 4.8, reviews: 560, image: 'https://images.unsplash.com/photo-1548883354-94cb221a6a02?w=500&q=80', discount: 40 },
];

const Sale: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });
  const [searchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Deals');
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, product: typeof flashSaleProducts[0]) => {
    e.preventDefault();
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const handleQuickOrder = (e: React.MouseEvent, product: typeof flashSaleProducts[0]) => {
    e.preventDefault();
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navigate('/checkout');
  };

  const filteredDeals = useMemo(() => {
    return flashSaleProducts.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Deals' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const categoryIcons: Record<string, any> = {
    'All Deals': Zap,
    'Electronics': Smartphone,
    'Fashion': Watch,
    'Furniture': Package,
    'Photography': Headphones,
    'Home & Kitchen': Flame,
    'Sports': Activity,
    'Beauty': Sparkles,
    'Gaming': Gamepad2,
    'Automotive': Car,
    'Books': Book,
    'Gifts': Gift,
  };

  return (
    <div className="bg-[#040814] min-h-screen pb-24 font-sans text-white">
      <SEO title="Flash Sale - Up to 50% Off" description="Incredible discounts on premium electronics, fashion, and furniture." />
      
      {/* Custom Mobile Top App Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-50 bg-[#040814]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1 className="text-lg font-bold text-white tracking-wide">Flash Sale</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-gray-300 transition-colors cursor-pointer">
            <Search size={22} />
          </button>
          <Link to="/cart" className="relative text-white hover:text-gray-300 transition-colors cursor-pointer">
            <ShoppingCart size={22} />
            <span className="absolute -top-1.5 -right-2 bg-[#3a93ff] text-white text-[10px] font-black min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border border-[#040814]">
              2
            </span>
          </Link>
        </div>
      </div>
      
      {/* Hero Banner */}
      <section className="relative px-4 pt-4 pb-6 overflow-hidden">
        <div className="relative bg-gradient-to-br from-[#0b1437] to-[#1a0b37] rounded-3xl p-5 border border-white/5 shadow-2xl shadow-blue-900/20 overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 w-[60%] sm:w-full">
            <div className="inline-flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider mb-3 shadow-md shadow-red-500/20">
              <Zap size={10} className="fill-white" /> Live Flash Sale
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black mb-2 leading-tight tracking-tight text-white">
              Limited-Time<br/>Discounts
            </h2>
            <p className="text-xs text-gray-300 font-medium mb-5 leading-relaxed max-w-[200px] sm:max-w-md">
              Up to 50% OFF on high-demand electronics and premium accessories.
            </p>
            
            {/* Timer */}
            <div className="flex items-center gap-2 bg-[#040814]/40 backdrop-blur-md rounded-xl p-2 border border-white/10 w-fit">
              <div className="flex items-center gap-1 text-[#00e5ff] text-[10px] font-bold mr-1">
                <Clock size={12} /> ENDS IN:
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-white/10 rounded-lg px-2 py-1 flex flex-col items-center min-w-[36px]">
                  <span className="text-sm font-black leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[7px] text-gray-400 font-bold mt-0.5">HRS</span>
                </div>
                <span className="text-white font-bold opacity-50">:</span>
                <div className="bg-white/10 rounded-lg px-2 py-1 flex flex-col items-center min-w-[36px]">
                  <span className="text-sm font-black leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[7px] text-gray-400 font-bold mt-0.5">MIN</span>
                </div>
                <span className="text-white font-bold opacity-50">:</span>
                <div className="bg-white/10 rounded-lg px-2 py-1 flex flex-col items-center min-w-[36px]">
                  <span className="text-sm font-black leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[7px] text-gray-400 font-bold mt-0.5">SEC</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Overlapping Hero Images */}
          <img 
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" 
            alt="Headphones" 
            className="absolute -right-6 top-0 w-40 h-40 object-cover mix-blend-screen opacity-90 scale-125"
            style={{ clipPath: 'circle(40% at 50% 50%)' }}
          />
          <img 
            src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80" 
            alt="Watch" 
            className="absolute -right-2 bottom-4 w-24 h-24 object-cover mix-blend-screen opacity-90"
            style={{ clipPath: 'circle(45% at 50% 50%)' }}
          />
        </div>
        
        {/* Social Proof */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <div className="flex -space-x-1.5">
              <div className="w-4 h-4 rounded-full bg-blue-500 border border-[#040814]"></div>
              <div className="w-4 h-4 rounded-full bg-purple-500 border border-[#040814]"></div>
            </div>
            <span><span className="font-bold text-white">1,258</span> people are shopping now</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300">
            <Flame size={12} className="text-orange-500 fill-orange-500" /> Hot Deals – Limited Stock!
          </div>
        </div>
      </section>

      {/* Categories Row */}
      <section className="px-2 mb-6">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x px-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map(cat => {
            const Icon = categoryIcons[cat] || Package;
            const isSelected = selectedCategory === cat || (cat === 'All Deals' && selectedCategory === 'All Deals');
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All Deals' ? 'All Deals' : cat)}
                className="flex flex-col items-center gap-2 shrink-0 snap-start group cursor-pointer w-16"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-[#3a93ff] shadow-lg shadow-blue-500/40 text-white border-2 border-white/20' 
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}>
                  <Icon size={20} className={isSelected ? 'fill-white' : ''} />
                </div>
                <span className={`text-[10px] font-bold text-center ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  {cat}
                </span>
                {isSelected && (
                  <div className="w-6 h-0.5 bg-[#3a93ff] rounded-full mt-[-2px]"></div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-4 pb-8">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-bold text-sm">No deals found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {filteredDeals.map((product, index) => {
              const stockLeft = Math.floor(Math.random() * 80) + 15; // Mock stock count
              const progressWidth = `${(stockLeft / 100) * 100}%`;
              
              return (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#121930] rounded-2xl overflow-hidden border border-white/5 flex flex-col relative shadow-lg"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-2.5 left-2.5 z-20 bg-red-500 text-white px-2 py-0.5 rounded-md font-black text-[10px] shadow-md shadow-red-500/20 flex items-center gap-0.5">
                    <Zap size={8} className="fill-white" /> -{product.discount}%
                  </div>
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleItem({ ...product, id: product.id.toString(), price: product.price, oldPrice: product.oldPrice, rating: product.rating, category: product.category });
                    }}
                    className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
                      isInWishlist(product.id.toString()) ? 'bg-white text-red-500' : 'bg-white/90 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart size={12} className={isInWishlist(product.id.toString()) ? 'fill-current' : ''} />
                  </button>

                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-white/5 p-4 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain object-center mix-blend-screen opacity-90 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-3 flex flex-col flex-1 bg-[#121930]">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star className="text-yellow-400 fill-yellow-400" size={10} />
                      <span className="text-[10px] font-bold text-white">{product.rating}</span>
                      <span className="text-[9px] text-gray-500 font-medium">({product.reviews})</span>
                    </div>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-bold text-white text-[11px] leading-snug mb-1.5 hover:text-[#3a93ff] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <p className="font-black text-sm text-white">${product.price.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-500 line-through font-medium">${product.oldPrice.toFixed(2)}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={(e) => handleQuickOrder(e, product)}
                        className="flex-1 bg-[#040814] text-white py-2 px-2 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                      >
                        <Zap size={10} className="fill-white" /> Quick Order
                      </button>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-8 h-8 shrink-0 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          addedIds.has(product.id)
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white text-[#121930] border-white hover:bg-gray-200'
                        }`}
                      >
                        {addedIds.has(product.id) ? <Check size={14} className="stroke-[3]" /> : <ShoppingCart size={13} className="fill-current" />}
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-auto pt-1 flex items-center gap-2">
                      <span className="text-[9px] font-black text-red-500 whitespace-nowrap">{stockLeft} LEFT</span>
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: progressWidth }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Sale;
