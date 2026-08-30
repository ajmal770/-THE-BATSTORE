import React from 'react';
import {
  ArrowRight, Star, Heart, Zap, ShoppingCart, Box,
  X, CheckCircle2, Sparkles, RefreshCw, Check, Layers, Clock,
  ShieldCheck, Truck, Smartphone, Headphones, Watch, Laptop, LayoutGrid,
  Gamepad2, MoreHorizontal, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useProductStore } from '../store/productStore';
import { useCategoryStore } from '../store/categoryStore';
import { useBannerStore } from '../store/bannerStore';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';

const staticCategories = [
  { id: '1', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80', items: '1,204' },
  { id: '2', name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80', items: '840' },
  { id: '3', name: 'Smart Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', items: '320' },
  { id: '4', name: 'Photography', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', items: '150' },
  { id: '5', name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', items: '420' },
  { id: '6', name: 'Gaming', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80', items: '680' },
  { id: '7', name: 'Home Appliances', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80', items: '210' },
  { id: '8', name: 'Accessories', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80', items: '950' },
];

const customerReviews = [
  {
    id: 1,
    name: "Alexander Wright",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    comment: "The 3D interactive model preview was super accurate! What I received looks even better in person. Express shipping took only 2 days!",
    product: "Noise-Cancelling Studio Headphones"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
    comment: "Sublime design and minimalist aesthetic. Fits my ergonomic desk setup perfectly. Customer support was top tier.",
    product: "Ergonomic Executive Chair"
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Verified Buyer",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    comment: "Fast delivery and crisp UI! The quick checkout feature makes ordering effortless. Will definitely shop here again.",
    product: "Ultra-Wide Curved Monitor"
  }
];

const Home: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const products = useProductStore((state) => state.products);
  const { categories } = useCategoryStore();
  const { banners } = useBannerStore();

  // Quick View / 3D Model Modal States
  const [quickViewProduct, setQuickViewProduct] = React.useState<any | null>(null);
  const [modelAngle, setModelAngle] = React.useState<number>(0);
  const [selectedColor, setSelectedColor] = React.useState<string>('Space Gray');
  const [selectedQty, setSelectedQty] = React.useState<number>(1);
  const [addedToast, setAddedToast] = React.useState<boolean>(false);

  // 3D Model Touch/Mouse Drag Rotation State
  const [isDraggingModel, setIsDraggingModel] = React.useState<boolean>(false);
  const [activePromoIndex, setActivePromoIndex] = React.useState(0);
  const [dragStartX, setDragStartX] = React.useState<number>(0);

  const handlePromoScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.children.length === 0) return;
    const cardWidth = container.children[0].clientWidth;
    const index = Math.round(container.scrollLeft / cardWidth);
    setActivePromoIndex(Math.min(3, Math.max(0, index)));
  };

  const handleModelMouseDown = (e: React.MouseEvent) => {
    setIsDraggingModel(true);
    setDragStartX(e.clientX);
  };

  const handleModelMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingModel) return;
    const deltaX = e.clientX - dragStartX;
    setModelAngle((prev) => {
      let next = prev + Math.round(deltaX * 0.8);
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return next;
    });
    setDragStartX(e.clientX);
  };

  const handleModelMouseUp = () => {
    setIsDraggingModel(false);
  };

  const handleModelTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDraggingModel(true);
      setDragStartX(e.touches[0].clientX);
    }
  };

  const handleModelTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingModel || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    setModelAngle((prev) => {
      let next = prev + Math.round(deltaX * 1.2);
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      return next;
    });
    setDragStartX(e.touches[0].clientX);
  };

  const handleModelTouchEnd = () => {
    setIsDraggingModel(false);
  };

  // Promo Carousel Swipe Handlers
  const [promoTouchStartX, setPromoTouchStartX] = React.useState<number>(0);

  const handlePromoTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setPromoTouchStartX(e.touches[0].clientX);
    }
  };

  const handlePromoTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - promoTouchStartX;
      if (deltaX < -40) {
        setCurrentPromoSlide((prev) => (prev + 1) % promoAds.length);
      } else if (deltaX > 40) {
        setCurrentPromoSlide((prev) => (prev - 1 + promoAds.length) % promoAds.length);
      }
    }
  };

  // Category Filter Showcase State
  const [selectedCategoryTab, setSelectedCategoryTab] = React.useState<string>('All');

  // Flash Sale Setup
  let flashSaleProducts = products.filter((p) => p.isFlashSale);
  if (flashSaleProducts.length < 12) {
    const additional = products
      .filter((p) => !p.isFlashSale)
      .slice(0, 12 - flashSaleProducts.length)
      .map(p => ({
        ...p,
        isFlashSale: true,
        oldPrice: p.price * 1.35,
        discount: Math.round((1 - 1 / 1.35) * 100)
      }));
    flashSaleProducts = [...flashSaleProducts, ...additional];
  }
  const uniqueFlashSale = Array.from(new Map(flashSaleProducts.map(item => [item.id, item])).values());

  const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000;
  const [cycleIndex, setCycleIndex] = React.useState(Math.floor(Date.now() / EIGHT_HOURS_MS));
  const [timeLeft, setTimeLeft] = React.useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showAllFlash, setShowAllFlash] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [currentPromoSlide, setCurrentPromoSlide] = React.useState(0);
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);



  const promoAds = React.useMemo(() => [
    {
      id: 1,
      tag: "🔥 Limited Edition",
      title1: "Elevate Your Setup",
      title2: "With Premium Gear.",
      description: "Discover our newest collection of ergonomic furniture and high-fidelity audio equipment designed for ultimate comfort and peak productivity.",
      btn1Text: "Shop Tech",
      btn1Link: "/products?category=Electronics",
      btn2Text: "Explore Furniture",
      btn2Link: "/products?category=Furniture",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000",
      bgColor: "bg-slate-900",
      gradient: "from-cyan-400 via-sky-300 to-blue-500",
      blurColor: "bg-blue-600/30",
    },
    {
      id: 2,
      tag: "⚡ Flash Drop",
      title1: "Immersive Audio",
      title2: "Like Never Before.",
      description: "Experience studio-quality sound with our next-generation noise-cancelling headphones and smart speakers.",
      btn1Text: "Shop Audio",
      btn1Link: "/products?category=Audio",
      btn2Text: "View All Offers",
      btn2Link: "/sale",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
      bgColor: "bg-zinc-900",
      gradient: "from-pink-400 via-rose-400 to-amber-300",
      blurColor: "bg-pink-600/30",
    },
    {
      id: 3,
      tag: "⌚ Just Arrived",
      title1: "Next-Gen Wearables",
      title2: "Track Your Life.",
      description: "Stay connected and monitor your health with our premium selection of cutting-edge smartwatches.",
      btn1Text: "Shop Watches",
      btn1Link: "/products?category=Smart Watches",
      btn2Text: "Discover More",
      btn2Link: "/products",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000",
      bgColor: "bg-teal-950",
      gradient: "from-emerald-300 via-teal-300 to-cyan-300",
      blurColor: "bg-teal-500/30",
    },
    {
      id: 4,
      tag: "📸 Creator Bundle",
      title1: "Capture Every",
      title2: "Perfect Moment.",
      description: "Professional grade mirrorless cameras and high-end lenses to bring your creative vision to life.",
      btn1Text: "Shop Photography",
      btn1Link: "/products?category=Photography",
      btn2Text: "View Deals",
      btn2Link: "/sale",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000",
      bgColor: "bg-indigo-950",
      gradient: "from-fuchsia-300 via-purple-300 to-pink-400",
      blurColor: "bg-purple-600/30",
    }
  ], []);

  React.useEffect(() => {
    const promoTimer = setInterval(() => {
      setCurrentPromoSlide(prev => (prev + 1) % promoAds.length);
    }, 7000);
    return () => clearInterval(promoTimer);
  }, [promoAds.length]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentCycle = Math.floor(now / EIGHT_HOURS_MS);
      const nextCycleStart = (currentCycle + 1) * EIGHT_HOURS_MS;
      const diff = nextCycleStart - now;

      if (currentCycle !== cycleIndex) {
        setCycleIndex(currentCycle);
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cycleIndex, EIGHT_HOURS_MS]);

  // Rotate items based on cycle
  const rotationOffset = cycleIndex % Math.max(1, uniqueFlashSale.length);
  flashSaleProducts = [...uniqueFlashSale.slice(rotationOffset), ...uniqueFlashSale.slice(0, rotationOffset)].slice(0, 12);



  const activeBanners = banners.filter(b => b.status === 'Active').sort((a, b) => a.order - b.order);
  const heroBanners = activeBanners.length > 0 ? activeBanners : [
    {
      id: 'default-1',
      title: 'Redefine Your Lifestyle.',
      image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000',
      link: '/products',
    },
    {
      id: 'default-2',
      title: 'Experience Premium Sound.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000',
      link: '/products?category=Audio',
    },
    {
      id: 'default-3',
      title: 'Minimalist Workspace Goals.',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2000',
      link: '/products?category=Furniture',
    }
  ];

  React.useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [heroBanners.length]);

  const heroBanner = heroBanners[currentSlide];

  const isMatchCategory = React.useCallback((product: any, catName: string) => {
    if (!catName || catName === 'All') return true;
    const target = catName.toLowerCase();
    const cat = (product.category || '').toLowerCase();
    const subcat = (product.subcategory || '').toLowerCase();
    const name = (product.name || '').toLowerCase();

    if (cat === target || subcat === target) return true;
    if (target === 'audio' && (cat.includes('audio') || subcat.includes('audio') || subcat.includes('sound') || name.includes('headphone') || name.includes('earbud') || name.includes('speaker') || name.includes('airpods') || name.includes('soundbar'))) return true;
    if (target === 'smart watches' && (cat.includes('watch') || subcat.includes('watch') || name.includes('watch') || name.includes('fitbit') || name.includes('garmin') || name.includes('band'))) return true;
    if (target === 'gaming' && (cat.includes('gaming') || subcat.includes('console') || subcat.includes('gaming') || name.includes('gaming') || name.includes('playstation') || name.includes('xbox') || name.includes('nintendo') || name.includes('rog') || name.includes('dualsense') || name.includes('keychron'))) return true;
    return false;
  }, []);

  const displayCategories = categories.length > 0 ? categories.slice(0, 8).map((c, i) => {
    const images = [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
      'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80'
    ];
    const matchCount = products.filter(p => isMatchCategory(p, c.name)).length;
    return {
      id: c.id,
      name: c.name,
      image: images[i % images.length],
      items: matchCount > 0 ? `${matchCount}+` : '15+'
    };
  }) : staticCategories;

  // Filtered showcase products
  const categoryTabNames = ['All', 'Audio', 'Smart Watches', 'Gaming', 'Electronics', 'Furniture', 'Photography'];
  const filteredProducts = React.useMemo(() => {
    if (selectedCategoryTab === 'All') return products.slice(0, 12);
    return products.filter(p => isMatchCategory(p, selectedCategoryTab)).slice(0, 12);
  }, [products, selectedCategoryTab, isMatchCategory]);

  const handleQuickAdd = (e: React.MouseEvent, product: any, qty: number = 1) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleQuickOrder = (e: React.MouseEvent, product: any, qty: number = 1) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navigate('/checkout');
  };

  const openQuickView = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setModelAngle(0);
    setSelectedColor('Space Gray');
    setSelectedQty(1);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm border border-emerald-400"
          >
            <CheckCircle2 size={20} />
            <span>Item added to your cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 📱 MOBILE-ONLY LAYOUT (HERO, CATEGORIES)  */}
      {/* ========================================= */}
      <div className="sm:hidden flex flex-col pt-2 pb-8 space-y-6 bg-gradient-to-b from-[#e8f0ff] via-[#f5f8ff] to-[#f4f7ff] overflow-hidden relative border-b border-gray-100">

        {/* Background Decorative Rings */}
        <div className="absolute top-[-5%] right-[-15%] w-[320px] h-[320px] rounded-full border-[1px] border-dashed border-[#0057ff]/20 opacity-40 pointer-events-none"></div>
        <div className="absolute top-[5%] right-[5%] w-[250px] h-[250px] rounded-full border-[1px] border-dashed border-[#0057ff]/20 opacity-30 pointer-events-none"></div>
        <div className="absolute top-[8%] right-[10%] w-[180px] h-[180px] rounded-full border-[1px] border-dashed border-[#0057ff]/20 opacity-20 pointer-events-none"></div>

        {/* Mobile Hero Content */}
        <div className="px-4 relative flex flex-col gap-4 z-10 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6c5dd3] text-white rounded-full text-[10px] font-bold self-start shadow-md shadow-[#6c5dd3]/30">
            <Sparkles size={12} className="text-white fill-white" />
            NEW COLLECTION 2026
          </div>

          <h1 className="text-5xl font-black text-gray-900 leading-[1.05] tracking-tight">
            Summer <br />
            Tech <br />
            <span className="text-[#3a93ff]">Sale</span>
          </h1>

          <p className="text-gray-600 text-xs font-medium w-[65%] mt-1 leading-relaxed">
            Shop the newest electronics, fashion, and lifestyle essentials with <span className="text-[#0057ff] font-bold">exclusive deals.</span>
          </p>

          <div className="space-y-3 mt-3 w-[70%] z-10 relative">
            <div className="flex items-center gap-3">
              <div className="text-[#0057ff] bg-blue-50 p-1.5 rounded-full border border-blue-100"><ShieldCheck size={16} /></div>
              <div>
                <p className="text-[11px] font-black leading-none text-gray-900 mb-0.5">100% Original Products</p>
                <p className="text-[9px] font-medium text-gray-500">Authentic & Trusted Brands</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[#0057ff] bg-blue-50 p-1.5 rounded-full border border-blue-100"><Truck size={16} /></div>
              <div>
                <p className="text-[11px] font-black leading-none text-gray-900 mb-0.5">Free & Fast Delivery</p>
                <p className="text-[9px] font-medium text-gray-500">On Orders Above $50</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 mt-5 z-10 relative">
            <Link to="/products" className="bg-[#0b1021] text-white px-4 py-3.5 rounded-2xl text-sm font-bold flex-[1.2] flex items-center justify-center gap-2 shadow-lg shadow-[#0b1021]/30">
              Shop Now <ArrowRight size={16} />
            </Link>
            <Link to="/sale" className="bg-white text-gray-900 px-4 py-3.5 rounded-2xl text-[13px] font-bold flex-1 flex items-center justify-center gap-1.5 shadow-md shadow-gray-200/50 border border-gray-100">
              <Sparkles size={14} className="text-gray-900" /> Explore Collection
            </Link>
          </div>

          {/* Large Overlapping Headphone Image */}
          <div className="absolute right-[-45px] top-[10px] w-[270px] h-[340px] pointer-events-none z-0">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" alt="Headphones" className="w-full h-full object-cover scale-110 object-center" style={{ clipPath: 'circle(48% at 55% 45%)', mixBlendMode: 'multiply' }} />
          </div>

          {/* 70% OFF Bubble */}
          <div className="absolute right-[15px] top-[75px] bg-gradient-to-br from-[#6c5dd3] to-[#5143b8] text-white w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center shadow-2xl shadow-[#6c5dd3]/50 border-4 border-[#f0f4ff] z-20 transform rotate-12 animate-pulse">
            <span className="text-[9px] font-black uppercase tracking-wider mb-0.5">Up to</span>
            <span className="text-[20px] font-black leading-none tracking-tighter">70%</span>
            <span className="text-[10px] font-bold mt-0.5">OFF</span>
          </div>
        </div>

        {/* Mobile Categories (Round Icons) */}
        <div className="pt-2 z-10">
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory px-4 [&::-webkit-scrollbar]:hidden bg-white/50 backdrop-blur-md py-4 mx-4 rounded-3xl border border-white shadow-sm shadow-blue-900/5">
            {[
              { name: 'Electronics', color: 'bg-blue-500', bg: 'bg-blue-100', iconColor: 'text-white', Icon: Smartphone },
              { name: 'Audio', color: 'bg-purple-500', bg: 'bg-purple-100', iconColor: 'text-white', Icon: Headphones },
              { name: 'Smart Watch', color: 'bg-orange-500', bg: 'bg-orange-100', iconColor: 'text-white', Icon: Watch },
              { name: 'Laptops', color: 'bg-teal-500', bg: 'bg-teal-100', iconColor: 'text-white', Icon: Laptop },
              { name: 'All Categories', color: 'bg-pink-500', bg: 'bg-pink-100', iconColor: 'text-white', Icon: LayoutGrid }
            ].map(cat => (
              <Link to="/products" key={cat.name} className="flex flex-col items-center gap-2.5 shrink-0 snap-start group cursor-pointer w-[65px]">
                <div className={`w-14 h-14 bg-gradient-to-br from-white to-${cat.bg.replace('bg-', '')} rounded-full flex items-center justify-center shadow-md shadow-gray-200 border-[3px] border-white group-hover:scale-105 transition-transform relative overflow-hidden`}>
                  <div className={`absolute inset-0 opacity-20 ${cat.color}`}></div>
                  <div className={`w-9 h-9 ${cat.color} rounded-full flex items-center justify-center shadow-inner`}>
                    <cat.Icon size={18} className={cat.iconColor} />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-800 text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Promo Banners (Carousel) */}
        <div className="z-10 mt-1">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory px-4 [&::-webkit-scrollbar]:hidden" onScroll={handlePromoScroll}>

            {/* Card 1 */}
            <div className="shrink-0 w-[85vw] max-w-[300px] snap-center bg-gradient-to-br from-[#e6f0ff] to-[#cce0ff] rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden h-44 border border-white shadow-sm">
              <div className="z-10 relative">
                <span className="text-blue-600 text-[10px] font-black uppercase tracking-wider mb-1 block">Limited Time Offer</span>
                <h4 className="text-lg font-black text-gray-900 leading-tight">Extra 10% Off</h4>
                <p className="text-xs font-bold text-gray-700 mt-1 block">On Prepaid Orders</p>
                <button onClick={() => navigate('/sale')} className="mt-5 w-8 h-8 rounded-full bg-[#0b1021] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"><ArrowRight size={16} /></button>
              </div>
              {/* Clean white background image for multiply blend */}
              <img src="https://images.unsplash.com/photo-1606220838315-056192d5e927?w=300&q=80" alt="AirPods" className="absolute right-[-20px] bottom-[-20px] w-36 h-36 object-cover mix-blend-multiply opacity-95 pointer-events-none" />
            </div>

            {/* Card 2 */}
            <div className="shrink-0 w-[85vw] max-w-[300px] snap-center bg-gradient-to-br from-[#f3e6ff] to-[#e6ccff] rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden h-44 border border-white shadow-sm">
              <div className="z-10 relative">
                <span className="text-purple-600 text-[10px] font-black uppercase tracking-wider mb-1 block">New Arrivals</span>
                <h4 className="text-lg font-black text-gray-900 leading-tight">Smart Watches</h4>
                <p className="text-xs font-bold text-gray-700 mt-1 block">Starting at $59</p>
                <button onClick={() => navigate('/shop')} className="mt-5 w-8 h-8 rounded-full bg-[#0b1021] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"><ArrowRight size={16} /></button>
              </div>
              <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&q=80" alt="Watch" className="absolute right-[-10px] bottom-[-10px] w-32 h-32 object-cover mix-blend-multiply opacity-95 pointer-events-none" />
            </div>

            {/* Card 3 */}
            <div className="shrink-0 w-[85vw] max-w-[300px] snap-center bg-gradient-to-br from-[#e6fff0] to-[#b3ffd9] rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden h-44 border border-white shadow-sm">
              <div className="z-10 relative">
                <span className="text-green-600 text-[10px] font-black uppercase tracking-wider mb-1 block">Top Rated</span>
                <h4 className="text-lg font-black text-gray-900 leading-tight">Premium Audio</h4>
                <p className="text-xs font-bold text-gray-700 mt-1 block">Noise Cancelling</p>
                <button onClick={() => navigate('/shop')} className="mt-5 w-8 h-8 rounded-full bg-[#0b1021] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"><ArrowRight size={16} /></button>
              </div>
              <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&q=80" alt="Headphones" className="absolute right-[-10px] bottom-[-10px] w-32 h-32 object-cover mix-blend-multiply opacity-95 pointer-events-none" />
            </div>

            {/* Card 4 */}
            <div className="shrink-0 w-[85vw] max-w-[300px] snap-center bg-gradient-to-br from-[#fff0e6] to-[#ffccb3] rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden h-44 border border-white shadow-sm">
              <div className="z-10 relative">
                <span className="text-orange-600 text-[10px] font-black uppercase tracking-wider mb-1 block">Clearance</span>
                <h4 className="text-lg font-black text-gray-900 leading-tight">Gaming Gear</h4>
                <p className="text-xs font-bold text-gray-700 mt-1 block">Up to 40% Off</p>
                <button onClick={() => navigate('/shop')} className="mt-5 w-8 h-8 rounded-full bg-[#0b1021] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer"><ArrowRight size={16} /></button>
              </div>
              <img src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=300&q=80" alt="Controller" className="absolute right-[-10px] bottom-[-10px] w-32 h-32 object-cover mix-blend-multiply opacity-95 pointer-events-none" />
            </div>

          </div>

          {/* Dynamic visual dots */}
          <div className="flex justify-center gap-1.5 mt-2 pb-2">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full block transition-all duration-300 ${activePromoIndex === index ? 'w-6 bg-[#0057ff]' : 'w-2 bg-[#0057ff]/20'}`}
              ></span>
            ))}
          </div>
        </div>

      </div>

      {/* Hero Banner Area */}
      <section className="relative min-h-[580px] h-[85vh] sm:h-[80vh] bg-ice-blue hidden sm:flex items-center overflow-hidden">
        {/* Background Image Slider with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-0 w-full h-full"
          >
            <img
              src={heroBanner.image}
              alt="Hero Background"
              className="w-full h-full object-cover object-center mix-blend-multiply"
            />
          </motion.div>
        </AnimatePresence>

        {/* Mobile Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-ice-blue via-ice-blue/90 to-transparent z-0 pointer-events-none md:via-ice-blue/70"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center h-full pt-10 pb-16 md:py-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6 }}
              className="w-full md:w-3/5 lg:w-1/2 text-deep-navy space-y-4 sm:space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sapphire text-white text-xs font-bold uppercase tracking-widest shadow-md">
                <Sparkles size={14} className="text-amber-300 fill-amber-300" />
                <span>New Collection 2026</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-gray-900">
                {heroBanner.title.includes(' ') ? (
                  <>
                    {heroBanner.title.split(' ').slice(0, -1).join(' ')}{' '}
                    <span className="text-sapphire relative inline-block">
                      {heroBanner.title.split(' ').slice(-1)}
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-sapphire/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>
                  </>
                ) : (
                  heroBanner.title
                )}
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-lg font-medium leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                <Link
                  to={heroBanner.link || '/products'}
                  className="bg-deep-navy text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold hover:bg-sapphire transition-all flex items-center justify-center gap-2 shadow-lg shadow-deep-navy/20 hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
                >
                  {t('hero.btn')} <ArrowRight size={18} />
                </Link>
                <Link
                  to="/sale"
                  className="bg-white/80 backdrop-blur-md border border-gray-300 text-gray-900 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base cursor-pointer"
                >
                  <Zap size={18} className="text-amber-500 fill-amber-500" />
                  <span>Explore Sale</span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators & Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
          {heroBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentSlide ? 'w-7 bg-sapphire' : 'w-2 bg-gray-400 hover:bg-gray-600'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories Carousel Section */}
      <section className="py-14 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 hidden sm:block">
        <div className="mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sapphire/10 text-sapphire text-xs font-black uppercase tracking-widest mb-2.5 border border-sapphire/20 shadow-xs">
            <Layers size={13} /> Featured Departments
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire via-blue-600 to-cyan-500">Category</span>
          </h2>
          <p className="text-gray-500/90 text-sm sm:text-base mt-2 font-medium max-w-xl">
            Explore curated departments designed for your modern lifestyle.
          </p>
        </div>

        <div
          ref={categoryScrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] after:content-[''] after:w-1 after:shrink-0 sm:after:hidden"
        >
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="w-[220px] sm:w-[270px] lg:w-[310px] shrink-0 snap-center sm:snap-start"
            >
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl shadow-gray-200/70 block w-full h-full bg-gray-950 border border-gray-100/80 transition-transform duration-500 hover:-translate-y-1"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-95 group-hover:opacity-85 transition-opacity duration-500"></div>

                <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-end z-20">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 drop-shadow-md translate-y-1 group-hover:translate-y-0 transition-transform duration-500">{category.name}</h3>

                  <div className="flex items-center justify-between opacity-100 sm:opacity-90 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pt-1 gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/25 text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase group-hover:bg-sapphire group-hover:border-sapphire group-hover:text-white transition-all duration-300 shadow-md whitespace-nowrap shrink-0">
                      <span className="hidden sm:inline">Explore Department</span>
                      <span className="sm:hidden">Explore</span>
                      <ArrowRight size={12} className="stroke-[2.5]" />
                    </span>

                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-gray-900 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-lg shrink-0">
                      <ArrowRight size={14} className="stroke-[3]" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-deep-navy via-sapphire to-blue-700 text-white relative overflow-hidden">
        {/* Glow Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header & Timer */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-5">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <Zap size={12} className="fill-current" /> Live Flash Sale
                </span>
                {isSuperAdmin && (
                  <span className="text-blue-200 text-xs font-semibold">({flashSaleProducts.length} deals active)</span>
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Limited-Time Discounts</h2>
              <p className="text-blue-100/90 text-sm sm:text-base mt-1 max-w-lg font-medium">Up to 50% OFF on high-demand electronics and premium accessories.</p>
            </div>

            {/* Advanced Metallic Glass Countdown Timer Box */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-xl p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl border border-white/30 shadow-2xl shadow-cyan-950/40">
              <span className="text-xs sm:text-sm font-black uppercase text-cyan-200 tracking-wider px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center gap-1.5 shadow-xs">
                <Clock size={14} className="text-cyan-300 animate-spin" />
                <span>ENDS IN:</span>
              </span>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {[
                  { v: timeLeft.hours, l: 'HRS' },
                  { v: timeLeft.minutes, l: 'MIN' },
                  { v: timeLeft.seconds, l: 'SEC' }
                ].map((t, i) => (
                  <React.Fragment key={t.l}>
                    {i > 0 && <span className="text-xl sm:text-2xl font-black text-cyan-300 animate-pulse">:</span>}
                    <div className="bg-gradient-to-b from-white/25 via-white/15 to-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center min-w-[50px] sm:min-w-[62px] border border-white/40 shadow-inner group hover:scale-105 transition-transform duration-300">
                      <span className="block text-lg sm:text-2xl font-black tabular-nums text-white drop-shadow-[0_2px_8px_rgba(34,211,238,0.5)]">
                        {String(t.v).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-cyan-200 font-extrabold tracking-widest uppercase">
                        {t.l}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Flash Sale Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {flashSaleProducts.slice(0, showAllFlash ? 12 : 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white text-gray-900 rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl overflow-hidden group relative flex flex-col h-full border border-gray-100/90 transition-all duration-300"
              >
                {/* Badges Stacked cleanly on top-left to avoid Wishlist button on top-right */}
                <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1 items-start">
                  <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-2 py-0.5 sm:px-2.5 rounded-full font-black text-[9px] sm:text-[11px] shadow-md flex items-center gap-0.5">
                    <Zap size={10} className="fill-current" /> -{product.discount}%
                  </span>
                  {product.stock <= 15 && (
                    <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold shadow-sm">
                      Only {product.stock} left
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleItem({ ...product, id: product.id.toString(), price: product.price, oldPrice: product.oldPrice, rating: product.rating, category: product.category });
                  }}
                  aria-label="Wishlist"
                  className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer ${isInWishlist(product.id.toString())
                      ? 'bg-pink-50 text-pink-500 border border-pink-200'
                      : 'bg-white/90 text-gray-400 hover:text-pink-500 hover:scale-105 border border-gray-200'
                    }`}
                >
                  <Heart size={14} className={isInWishlist(product.id.toString()) ? 'fill-current scale-110' : ''} />
                </button>

                {/* Product Image Container with safe fallback */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100 group">
                  <img
                    src={product.image}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/800x800/f1f5f9/64748b?text=Product+Image';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Interactive Quick View / 3D Model Trigger Overlay */}
                  <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                    <button
                      onClick={(e) => openQuickView(e, product)}
                      className="bg-white/95 text-gray-900 font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs shadow-xl hover:bg-sapphire hover:text-white transition-all flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 cursor-pointer"
                    >
                      <Box size={14} className="text-sapphire group-hover:text-white" />
                      <span>Interactive 3D View</span>
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-2.5 sm:p-4 flex flex-col flex-1 bg-white">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-800">
                      <Star className="fill-amber-400 text-amber-400" size={10} />
                      <span className="text-[10px] font-black">{product.rating}</span>
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 hover:text-sapphire transition-colors line-clamp-2 text-[12px] sm:text-sm leading-snug min-h-[2.1rem] sm:min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto space-y-2.5 sm:space-y-3 pt-1">
                    <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                      <span className="font-black text-sm sm:text-xl text-gray-900">${product.price.toFixed(2)}</span>
                      {product.oldPrice && (
                        <span className="text-[9px] sm:text-xs text-gray-400 line-through font-medium">
                          ${product.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Storefront Action Buttons Model */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={(e) => handleQuickOrder(e, product)}
                        className="flex-1 bg-gray-900 text-white py-2 sm:py-2.5 px-2 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 hover:bg-sapphire transition-all shadow-xs cursor-pointer whitespace-nowrap"
                      >
                        <Zap size={13} className="fill-current" />
                        <span>Quick Order</span>
                      </button>

                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="w-8.5 h-8.5 sm:w-10 sm:h-10 shrink-0 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-sapphire text-gray-700 hover:text-sapphire flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                        title="Add to Cart"
                      >
                        <ShoppingCart size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stock Progress Bar */}
                <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 bg-white rounded-b-2xl sm:rounded-b-3xl border-t border-gray-50 pt-1.5">
                  <div className="flex justify-between text-[8px] sm:text-[9px] font-bold text-gray-400 mb-1 uppercase tracking-wider">
                    <span>Stock</span>
                    <span className="text-orange-500">{product.stock} left</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1 sm:h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 h-full rounded-full"
                      style={{ width: `${Math.max(15, Math.min(90, 100 - (product.stock / 150) * 100))}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Flash Sale CTA */}
          <div className="text-center mt-10">
            {!showAllFlash ? (
              <button
                onClick={() => setShowAllFlash(true)}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 text-white font-bold px-7 py-3 rounded-2xl hover:bg-white/20 transition-all text-sm cursor-pointer shadow-lg"
              >
                View More Flash Deals ({flashSaleProducts.length - 8} items left)
              </button>
            ) : (
              <Link
                to="/sale"
                className="inline-flex items-center gap-2 bg-white text-deep-navy font-black px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition-all shadow-xl text-base hover:-translate-y-0.5"
              >
                Explore Full Sale Page <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Category Filter Showcase Section (Desktop) */}
      <section className="hidden md:block py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-sapphire/90 font-bold uppercase tracking-widest text-xs mb-1 block">Curated Selection</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Explore Top Products</h2>
            <p className="text-gray-500/90 text-sm sm:text-base mt-1 font-medium">Filter top rated electronics, wearables, audio, and home gear.</p>
          </div>

          {/* Filter Tabs - Clean Flex Wrap on Desktop & Touch Snap on Mobile */}
          <div className="w-full overflow-x-auto scrollbar-none no-scrollbar py-4 px-2 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 flex-nowrap md:flex-wrap min-w-max md:min-w-0 mx-auto px-4">
              {categoryTabNames.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap cursor-pointer ${selectedCategoryTab === tab
                      ? 'bg-deep-navy text-white shadow-md shadow-deep-navy/20 ring-2 ring-deep-navy/15 scale-102'
                      : 'bg-white text-gray-600/90 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 shadow-xs'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c1b4?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleItem({ ...product, id: product.id.toString(), price: product.price, rating: product.rating, category: product.category });
                      }}
                      className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isInWishlist(product.id.toString()) ? 'bg-pink-50 text-pink-500' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-pink-500'
                        }`}
                    >
                      <Heart size={14} className={isInWishlist(product.id.toString()) ? 'fill-current' : ''} />
                    </button>

                    <button
                      onClick={(e) => openQuickView(e, product)}
                      className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-md text-gray-900 font-bold px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Box size={12} className="text-sapphire" />
                      <span>3D Preview</span>
                    </button>
                  </div>

                  <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="text-amber-400 fill-amber-400" size={11} />
                      <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                      <span className="text-[10px] text-gray-400">({product.reviews})</span>
                    </div>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-bold text-gray-900 hover:text-sapphire transition-colors line-clamp-2 text-[12px] sm:text-sm mb-1.5 leading-snug min-h-[2.1rem] sm:min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
                      <span className="font-black text-sm sm:text-base text-gray-900">${product.price.toFixed(2)}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleQuickOrder(e, product)}
                          className="bg-gray-900 hover:bg-sapphire text-white transition-all px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-extrabold flex items-center gap-1 shadow-xs cursor-pointer whitespace-nowrap"
                          title="Quick Order"
                        >
                          <Zap size={12} />
                          <span>Quick Order</span>
                        </button>
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="bg-sapphire/10 hover:bg-sapphire text-sapphire hover:text-white transition-colors p-2 rounded-xl cursor-pointer"
                          title="Add to cart"
                        >
                          <ShoppingCart size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Interactive Category Filter Showcase Section (Mobile Redesign) */}
      <section className="md:hidden py-10 bg-[#f8f9fc]">
        <div className="px-4">
          <div className="text-center mb-6">
            <span className="text-sapphire font-bold uppercase tracking-widest text-[11px] mb-1.5 block">CURATED SELECTION</span>
            <h2 className="text-[28px] font-black text-[#0f172a] leading-tight mb-2">Explore Top Products</h2>
            <p className="text-[#64748b] text-[13px] leading-relaxed">Filter top rated electronics, wearables, audio, <br /> and home gear.</p>
          </div>

          <div className="flex overflow-x-auto gap-2.5 pb-4 mb-4 -mx-4 px-4 scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categoryTabNames.map((tab) => {
              const isSelected = selectedCategoryTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors shadow-sm cursor-pointer ${isSelected
                      ? 'bg-[#0f172a] text-white border-none'
                      : 'bg-white text-gray-700 border border-gray-100'
                    }`}
                >
                  {tab === 'All' && <LayoutGrid size={14} className={isSelected ? 'text-white' : 'text-gray-500'} />}
                  {tab === 'Audio' && <Headphones size={14} className={isSelected ? 'text-white' : 'text-gray-500'} />}
                  {tab === 'Smart Watches' && <Watch size={14} className={isSelected ? 'text-white' : 'text-gray-500'} />}
                  {tab === 'Gaming' && <Gamepad2 size={14} className={isSelected ? 'text-white' : 'text-gray-500'} />}
                  {tab !== 'All' && tab !== 'Audio' && tab !== 'Smart Watches' && tab !== 'Gaming' && <MoreHorizontal size={14} className={isSelected ? 'text-white' : 'text-gray-500'} />}
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {filteredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col">
                <div className="relative aspect-square w-full bg-gray-50">
                  <Link to={`/products/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c1b4?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleItem({ ...product, id: product.id.toString(), price: product.price, rating: product.rating, category: product.category });
                    }}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer"
                  >
                    <Heart size={15} className="text-pink-500 fill-pink-500" />
                  </button>
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="text-amber-400 fill-amber-400" size={12} />
                    <span className="text-[11px] font-black text-gray-900">{product.rating}</span>
                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                  </div>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-[#0f172a] text-[12px] leading-snug line-clamp-2 mb-2 min-h-[34px]">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="font-black text-[15px] text-[#0f172a] mb-2.5">
                    ${product.price.toFixed(2)}
                  </div>

                  <div className="mt-auto flex gap-1.5">
                    <button
                      onClick={(e) => handleQuickOrder(e, product)}
                      className="flex-1 bg-[#0f172a] text-white py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Zap size={11} className="fill-white" /> Quick Order
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="w-8 h-8 rounded-xl bg-blue-50/50 text-slate-700 flex items-center justify-center cursor-pointer hover:bg-blue-100/50"
                    >
                      <ShoppingCart size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <Link to="/products" className="bg-white border border-gray-200 text-[#0f172a] font-bold py-3.5 px-6 rounded-2xl text-[13px] flex items-center gap-2 shadow-sm w-full max-w-[280px] justify-center cursor-pointer">
              <LayoutGrid size={16} /> View More Products <ChevronRight size={16} />
            </Link>
          </div>


        </div>
      </section>

      {/* Promotional Ads / Feature Banner Slider */}
      <section className="py-12 sm:py-20 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`promo-${currentPromoSlide}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                onTouchStart={handlePromoTouchStart}
                onTouchEnd={handlePromoTouchEnd}
                className={`relative rounded-3xl overflow-hidden ${promoAds[currentPromoSlide].bgColor} shadow-2xl flex flex-col md:flex-row items-stretch border border-gray-800 min-h-[460px] sm:min-h-[400px]`}
              >
                {/* Glow Backdrop */}
                <div className={`absolute top-0 right-0 w-96 h-96 ${promoAds[currentPromoSlide].blurColor} blur-3xl rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3`}></div>

                {/* Full Card Image Backdrop */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={promoAds[currentPromoSlide].image}
                    alt="Promotion background"
                    className="w-full h-full object-cover object-center md:object-right filter brightness-90"
                  />
                  {/* Dynamic Seamless Gradient Overlay: Top-to-bottom on mobile, Left-to-right on desktop */}
                  <div className={`absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-slate-950 via-slate-950/90 md:via-slate-950/85 to-slate-950/40 md:to-transparent z-10 pointer-events-none`}></div>
                </div>

                {/* Content Box */}
                <div className="relative z-20 p-6 sm:p-10 lg:p-16 flex flex-col justify-center w-full md:w-3/5 lg:w-1/2 text-white my-auto">
                  <span className="inline-block px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-widest text-white w-max mb-3 shadow-sm">
                    {promoAds[currentPromoSlide].tag}
                  </span>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight mb-3 sm:mb-4 text-white drop-shadow-md">
                    {promoAds[currentPromoSlide].title1} <br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${promoAds[currentPromoSlide].gradient}`}>
                      {promoAds[currentPromoSlide].title2}
                    </span>
                  </h2>

                  <p className="text-gray-300 text-xs sm:text-base leading-relaxed mb-6 max-w-md font-medium drop-shadow">
                    {promoAds[currentPromoSlide].description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to={promoAds[currentPromoSlide].btn1Link}
                      className="bg-white text-gray-900 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm hover:bg-gray-100 transition-all text-center flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      {promoAds[currentPromoSlide].btn1Text} <ArrowRight size={16} />
                    </Link>
                    <Link
                      to={promoAds[currentPromoSlide].btn2Link}
                      className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-white/20 transition-all text-center cursor-pointer"
                    >
                      {promoAds[currentPromoSlide].btn2Text}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {promoAds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPromoSlide(idx)}
                aria-label={`Promo slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${idx === currentPromoSlide ? 'w-8 bg-sapphire' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews Section (Desktop) */}
      <section className="hidden md:block py-14 sm:py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-sapphire font-black uppercase tracking-widest text-xs mb-1 block">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Loved by Thousands</h2>
            <p className="text-gray-500 text-sm sm:text-base mt-1">Read genuine feedback from verified buyers across the globe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1">
                      {rev.name}
                      <CheckCircle2 size={13} className="text-sapphire" />
                    </h4>
                    <span className="text-xs text-gray-400">{rev.product}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews Section (Mobile Redesign) */}
      <section className="md:hidden py-12 bg-gradient-to-b from-[#f8f9fc] to-[#f1f4f9] border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-sapphire font-black uppercase tracking-[0.2em] text-[11px] mb-2 block">Testimonials</span>
            <h2 className="text-[28px] font-black text-slate-900 leading-tight mb-2">Loved by Thousands</h2>
            <p className="text-slate-500 text-[14px] leading-relaxed px-4">Read genuine feedback from verified buyers across the globe.</p>
          </div>

          <div className="flex flex-col gap-4">
            {customerReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-800 text-[15px] leading-relaxed mb-5 italic font-medium">"{rev.comment}"</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <img src={rev.avatar} alt={rev.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px] flex items-center gap-1.5 mb-0.5">
                      {rev.name}
                      <CheckCircle2 size={15} className="text-sapphire" strokeWidth={2.5} />
                    </h4>
                    <span className="text-[13px] text-slate-500">{rev.product}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-sapphire"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </section>

      {/* App Download Banner */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sapphire to-blue-600 shadow-2xl p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between text-white">
            <div className="relative z-10 w-full md:w-3/5 text-center md:text-left mb-8 md:mb-0">
              <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-widest mb-3">
                Mobile Shopping App
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-3">
                Shop Faster & Save More. <br className="hidden sm:inline" /> Any Time, Anywhere.
              </h2>
              <p className="text-blue-100/90 text-sm sm:text-base max-w-md mx-auto md:mx-0 mb-6 font-medium">
                Get real-time flash deal notifications, order tracking, and exclusive app-only rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button className="bg-deep-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer">
                  <AppleIcon /> App Store
                </button>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer">
                  <PlayStoreIcon /> Google Play
                </button>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-2/5 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800"
                alt="App preview"
                className="rounded-2xl shadow-2xl border-4 border-white/20 transform md:rotate-2 hover:rotate-0 transition-transform duration-500 w-full aspect-video object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE 3D / QUICK VIEW PRODUCT MODEL MODAL                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden relative border border-gray-100 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Side: 3D Rotatable Model Stage */}
                <div
                  className="bg-slate-950 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden text-white min-h-[360px] select-none cursor-grab active:cursor-grabbing"
                  onMouseDown={handleModelMouseDown}
                  onMouseMove={handleModelMouseMove}
                  onMouseUp={handleModelMouseUp}
                  onMouseLeave={handleModelMouseUp}
                  onTouchStart={handleModelTouchStart}
                  onTouchMove={handleModelTouchMove}
                  onTouchEnd={handleModelTouchEnd}
                >
                  {/* Subtle 3D Grid backdrop effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-sapphire text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Box size={12} /> 3D Interactive Model
                    </span>
                    <span className="text-gray-400 text-xs font-mono">Angle: {modelAngle}°</span>
                  </div>

                  {/* 3D Model Stage Image */}
                  <div className="relative my-4 sm:my-6 flex flex-col items-center justify-center py-2">
                    <motion.div
                      style={{
                        transform: `perspective(1000px) rotateY(${modelAngle}deg)`,
                        transition: isDraggingModel ? 'none' : 'transform 0.15s ease-out'
                      }}
                      className="relative w-44 sm:w-60 aspect-square flex items-center justify-center pointer-events-none"
                    >
                      <img
                        src={quickViewProduct.image}
                        alt={quickViewProduct.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(15,82,186,0.4)]"
                      />
                    </motion.div>
                    <span className="text-[10px] text-cyan-300 font-medium opacity-75 mt-2 animate-pulse">
                      👈 Drag or swipe to rotate 360° 👉
                    </span>
                  </div>

                  {/* 3D Rotation Controls */}
                  <div className="relative z-10 space-y-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between text-xs text-gray-300 font-bold">
                      <span className="flex items-center gap-1">
                        <RefreshCw size={12} className="animate-spin text-cyan-400" /> Rotate 360° View
                      </span>
                      <span>{modelAngle}°</span>
                    </div>

                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={modelAngle}
                      onChange={(e) => setModelAngle(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sapphire"
                    />

                    <div className="flex justify-between gap-1">
                      {[-90, 0, 90, 180].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => setModelAngle(deg)}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${modelAngle === deg ? 'bg-sapphire text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Product Details & Purchase Actions */}
                <div className="p-6 sm:p-8 flex flex-col justify-between bg-white text-gray-900">
                  <div>
                    <span className="text-sapphire text-xs font-black uppercase tracking-wider block mb-1">
                      {quickViewProduct.category || 'Featured'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 leading-tight">
                      {quickViewProduct.name}
                    </h2>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-800">
                        <Star className="fill-amber-400 text-amber-400" size={13} />
                        <span className="text-xs font-bold">{quickViewProduct.rating || 4.8}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">({quickViewProduct.reviews || 124} reviews)</span>
                      <span className="text-emerald-600 text-xs font-bold ml-auto flex items-center gap-1">
                        <Check size={12} /> In Stock ({quickViewProduct.stock || 45})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="text-2xl sm:text-3xl font-black text-gray-900">${quickViewProduct.price.toFixed(2)}</span>
                      {quickViewProduct.oldPrice && (
                        <span className="text-sm text-gray-400 line-through font-semibold">
                          ${quickViewProduct.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Color Swatches */}
                    <div className="mb-5">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 mb-2">
                        Color: <span className="text-gray-900">{selectedColor}</span>
                      </label>
                      <div className="flex gap-2">
                        {[
                          { name: 'Space Gray', class: 'bg-slate-700' },
                          { name: 'Obsidian Black', class: 'bg-black' },
                          { name: 'Pure White', class: 'bg-slate-100 border border-gray-300' },
                          { name: 'Alpine Green', class: 'bg-emerald-800' }
                        ].map((col) => (
                          <button
                            key={col.name}
                            onClick={() => setSelectedColor(col.name)}
                            className={`w-8 h-8 rounded-full ${col.class} flex items-center justify-center transition-all cursor-pointer ${selectedColor === col.name ? 'ring-2 ring-offset-2 ring-sapphire scale-110' : 'opacity-70 hover:opacity-100'
                              }`}
                            title={col.name}
                          >
                            {selectedColor === col.name && <Check size={14} className={col.name === 'Pure White' ? 'text-gray-900' : 'text-white'} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Picker */}
                    <div className="mb-6">
                      <label className="block text-xs font-extrabold uppercase text-gray-500 mb-2">Quantity</label>
                      <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-xl w-max border border-gray-200">
                        <button
                          onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                          className="w-8 h-8 rounded-lg bg-white text-gray-800 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-black text-sm">{selectedQty}</span>
                        <button
                          onClick={() => setSelectedQty(selectedQty + 1)}
                          className="w-8 h-8 rounded-lg bg-white text-gray-800 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        handleQuickAdd(e, quickViewProduct, selectedQty);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 bg-white border-2 border-sapphire text-sapphire hover:bg-blue-50 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart size={16} /> Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        handleQuickOrder(e, quickViewProduct, selectedQty);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 bg-sapphire hover:bg-deep-navy text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-sapphire/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap size={16} /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// SVG Helpers for App Store Icons
const AppleIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.65.06 2.93.63 3.75 1.5-3.1 1.95-2.6 6.32.61 7.64-.69 1.69-1.37 3.32-2.32 4.49zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const PlayStoreIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 512 512">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
  </svg>
);

export default Home;
