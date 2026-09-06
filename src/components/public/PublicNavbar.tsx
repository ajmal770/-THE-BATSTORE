import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Package, Heart, X, ChevronDown, ChevronRight, Home as HomeIcon, ShoppingBag, Tag, LogOut, Bell, Trash2, CheckCheck, LayoutGrid, Settings, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useProfileStore } from '../../store/profileStore';
import { useNotificationStore } from '../../store/notificationStore';
import type { NotificationCategory } from '../../store/notificationStore';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProductStore } from '../../store/productStore';

// MEGA MENU COMPONENT FOR CATEGORIES
const CategoriesDropdown: React.FC<{ isOpen: boolean, onClose: () => void, categories: any[] }> = ({ isOpen, onClose, categories }) => {
  const navigate = useNavigate();
  const topCategories = categories.filter(c => c.parent === '-');

  const handleCategoryClick = (name: string) => {
    onClose();
    navigate(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[720px] bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 p-6 z-50 grid grid-cols-5 gap-6"
        >
          {/* Categories Grid (Col Span 3) */}
          <div className="col-span-3 space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
              Departments
            </h3>
            <div className="grid grid-cols-3 gap-x-4 gap-y-6">
              {topCategories.map((cat) => {
                const subCats = categories.filter(sub => sub.parent === cat.name);
                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(cat.name)}
                      className="font-bold text-gray-900 hover:text-sapphire transition-colors text-sm text-left flex items-center gap-1 group cursor-pointer"
                    >
                      {cat.name}
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-sapphire" />
                    </button>
                    {subCats.length > 0 && (
                      <div className="flex flex-col gap-1 pl-2">
                        {subCats.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleCategoryClick(sub.name)}
                            className="text-xs text-gray-500 hover:text-sapphire text-left transition-colors font-medium cursor-pointer"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Promo Banner with image (Col Span 2) */}
          <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg shadow-sapphire/15 flex flex-col justify-between p-5 text-white min-h-[260px] group/banner">
            {/* Background Image with Zoom on Hover */}
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
              alt="Summer Essentials"
              className="absolute inset-0 w-full h-full object-cover group-hover/banner:scale-105 transition-transform duration-500"
            />
            {/* Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/65 to-transparent"></div>

            <div className="relative z-10">
              <span className="bg-sapphire text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider inline-block mb-2 shadow-sm">
                Limited Time
              </span>
              <h4 className="text-base font-black leading-tight mb-1 drop-shadow-sm">Summer Essentials Up to 40% Off</h4>
              <p className="text-gray-200 text-[10px] leading-relaxed drop-shadow-sm font-medium">Upgrade your gear with our curated list.</p>
            </div>

            <button
              onClick={() => { onClose(); navigate('/sale'); }}
              className="relative z-10 mt-4 w-full bg-white text-gray-900 py-2 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              Shop the Sale <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ADVANCED SEARCH COMMAND PALETTE
const SearchOverlay: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const products = useProductStore(state => state.products);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const filteredProducts = searchQuery.trim() === ''
    ? []
    : products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);

  const handleProductClick = (id: string) => {
    onClose();
    setSearchQuery('');
    navigate(`/products/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center md:p-4 bg-gray-900/35 backdrop-blur-sm">
          {/* Backdrop Closer */}
          <div className="absolute inset-0 hidden md:block" onClick={onClose}></div>

          {/* Modal box */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white md:rounded-3xl shadow-2xl w-full h-full md:h-auto md:max-w-2xl overflow-hidden md:mt-16 md:border border-gray-100 flex flex-col md:max-h-[80vh] z-10"
          >
            {/* Header Input */}
            <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-4 border-b border-gray-100 bg-white">
              <Search className="text-gray-400 animate-pulse shrink-0" size={22} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-base md:text-lg text-gray-900 placeholder:text-gray-300 outline-none bg-transparent min-w-0"
              />
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900 cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Results Body */}
            <div className="overflow-y-auto p-4 md:p-6 flex-1 bg-gray-50/30">
              {searchQuery.trim() !== '' ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Search Results
                  </h4>
                  {filteredProducts.length > 0 ? (
                    <div className="space-y-2">
                      {filteredProducts.map(product => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-4 p-3 bg-white hover:bg-blue-50/50 shadow-sm hover:shadow rounded-2xl cursor-pointer transition-all group border border-gray-100 hover:border-sapphire/30"
                        >
                          <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200/50">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 group-hover:text-sapphire transition-colors text-sm line-clamp-1">{product.name}</h5>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{product.category}</span>
                          </div>
                          <div className="font-black text-sapphire text-sm pr-2">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-500 flex flex-col items-center">
                      <Search size={48} className="text-gray-200 mb-4" />
                      <p className="text-sm">No products found matching "<span className="font-semibold text-gray-900">{searchQuery}</span>"</p>
                      <p className="text-xs text-gray-400 mt-1">Try checking your spelling or using more general terms.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Suggestions */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Popular Searches
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Camera', 'Headphones', 'Backpack', 'Thermostat'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-sm hover:shadow hover:border-sapphire hover:text-sapphire transition-all cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Categories */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Shop Categories
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['Electronics', 'Furniture', 'Photography', 'Accessories'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { onClose(); navigate(`/products?category=${encodeURIComponent(cat)}`); }}
                          className="flex items-center justify-between p-4 bg-white border border-gray-100 hover:border-sapphire hover:shadow-md rounded-xl hover:bg-gradient-to-r hover:from-white hover:to-blue-50 text-left text-xs font-black text-gray-700 hover:text-sapphire transition-all cursor-pointer group"
                        >
                          {cat}
                          <ChevronRight size={16} className="text-gray-300 group-hover:text-sapphire group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// FULL MOBILE MENU DRAWER COMPONENT
const MobileMenuDrawer: React.FC<{ isOpen: boolean, onClose: () => void, user: any, avatarUrl?: string | null, wishlistCount: number, cartCount: number, notifCount: number, categories: any[], handleLogout: () => void }> = ({ isOpen, onClose, user, avatarUrl, wishlistCount, cartCount, notifCount, categories, handleLogout }) => {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(false);
  const topCategories = categories.filter(c => c.parent === '-');

  const handleLinkClick = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer content (Left side, curved right corners) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-[340px] bg-white shadow-2xl rounded-r-[2rem] overflow-hidden flex flex-col"
          >
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto px-5 py-6 pb-24 hide-scrollbar">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-[#0b1021] leading-none tracking-wide flex items-center gap-1.5">
                      THE
                      <img src="/logo.svg" alt="Bat Logo" className="h-5 w-auto object-contain" />
                      STORE
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-1.5">Discover • Shop • Save</span>
                  </div>
                </Link>
                <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-gray-700">
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Promo Banner */}
              <div className="mb-6 relative bg-gradient-to-br from-[#0b1b3d] to-[#1a3a7a] rounded-2xl p-4 overflow-hidden shadow-lg shadow-blue-900/20">
                <div className="relative z-10 w-[60%]">
                  <p className="text-[#3a93ff] text-[9px] font-black uppercase tracking-wider mb-1">New Collection 2026</p>
                  <h3 className="text-white text-lg font-black leading-tight mb-1">Summer Tech Sale</h3>
                  <p className="text-white text-[11px] font-bold mb-3">Up to <span className="text-[#3a93ff] text-base font-black">70% OFF</span></p>
                  <button onClick={() => handleLinkClick('/sale')} className="bg-white text-[#0b1b3d] text-[10px] font-black px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:bg-gray-100 transition-colors cursor-pointer">
                    Shop Now <ArrowRight size={12} />
                  </button>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" 
                  alt="Headphones" 
                  className="absolute -right-8 -top-4 w-44 h-44 object-cover transform rotate-12 mix-blend-screen opacity-90 scale-125"
                  style={{ clipPath: 'circle(40% at 50% 50%)' }}
                />
                {/* Decorative sparks */}
                <div className="absolute right-4 top-4 w-1.5 h-1.5 bg-yellow-400 rounded-full blur-[1px]"></div>
                <div className="absolute right-12 bottom-4 w-2 h-2 bg-yellow-400 rounded-full blur-[1px]"></div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 mb-6 border-b border-gray-100 pb-6">
                <button onClick={() => handleLinkClick('/')} className="w-full flex items-center justify-between text-left font-bold text-[#0057ff] py-2.5 px-3 rounded-2xl bg-blue-50/50 cursor-pointer group">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-[#0057ff] text-white p-2 rounded-[10px]"><HomeIcon size={18} /></div>
                    <span className="text-sm">Home</span>
                  </div>
                  <ChevronRight size={16} className="text-[#0057ff]" />
                </button>

                <button onClick={() => handleLinkClick('/shop')} className="w-full flex items-center justify-between text-left font-bold text-[#0b1021] py-2.5 px-3 rounded-2xl hover:bg-gray-50 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-gray-100 text-[#0b1021] p-2 rounded-[10px]"><ShoppingBag size={18} /></div>
                    <span className="text-sm group-hover:text-[#0057ff] transition-colors">Shop All</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-[#0057ff]" />
                </button>

                {/* Categories Accordion */}
                <div className="px-3 py-1">
                  <button
                    onClick={() => setActiveAccordion(!activeAccordion)}
                    className="w-full flex items-center justify-between text-left font-bold text-[#0b1021] py-2 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="bg-blue-50 text-[#0057ff] p-2 rounded-[10px]"><Package size={18} /></div>
                      <span className="text-sm group-hover:text-[#0057ff] transition-colors">Categories</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${activeAccordion ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion && (
                    <div className="pl-[52px] pt-1 pb-2 space-y-3 max-h-48 overflow-y-auto">
                      {topCategories.map(c => (
                        <button
                          key={c.id}
                          onClick={() => handleLinkClick(`/products?category=${encodeURIComponent(c.name)}`)}
                          className="w-full text-left text-sm font-semibold text-gray-500 hover:text-[#0057ff] cursor-pointer block"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => handleLinkClick('/sale')} className="w-full flex items-center justify-between text-left font-bold text-red-500 py-2.5 px-3 rounded-2xl hover:bg-red-50/50 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-red-50 text-red-500 p-2 rounded-[10px]"><Tag size={18} /></div>
                    <span className="text-sm">Sale</span>
                  </div>
                  <ChevronRight size={16} className="text-red-300" />
                </button>
              </div>

              {/* Action Links (Wishlist, Cart, Notifs) */}
              <div className="space-y-1 mb-8">
                <button onClick={() => handleLinkClick('/wishlist')} className="w-full flex items-center justify-between text-left font-bold text-[#0b1021] py-2.5 px-3 rounded-2xl hover:bg-gray-50 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-pink-50 text-pink-500 p-2 rounded-[10px]"><Heart size={18} /></div>
                    <span className="text-sm group-hover:text-pink-500 transition-colors">Wishlist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {wishlistCount > 0 && <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black min-w-[20px] text-center">{wishlistCount > 9 ? '9+' : wishlistCount}</span>}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>

                <button onClick={() => handleLinkClick('/cart')} className="w-full flex items-center justify-between text-left font-bold text-[#0b1021] py-2.5 px-3 rounded-2xl hover:bg-gray-50 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-blue-50 text-[#0057ff] p-2 rounded-[10px]"><ShoppingCart size={18} /></div>
                    <span className="text-sm group-hover:text-[#0057ff] transition-colors">My Cart</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {cartCount > 0 && <span className="bg-blue-50 text-[#0057ff] px-2 py-0.5 rounded-full text-[10px] font-black min-w-[20px] text-center">{cartCount > 9 ? '9+' : cartCount}</span>}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>

                <button onClick={() => handleLinkClick('/notifications')} className="w-full flex items-center justify-between text-left font-bold text-[#0b1021] py-2.5 px-3 rounded-2xl hover:bg-gray-50 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-indigo-50 text-indigo-500 p-2 rounded-[10px]"><Bell size={18} /></div>
                    <span className="text-sm group-hover:text-indigo-500 transition-colors">Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {notifCount > 0 && <span className="bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full text-[10px] font-black min-w-[20px] text-center">{notifCount > 9 ? '9+' : notifCount}</span>}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              </div>

              {/* User Profile Section */}
              {user ? (
                <div className="bg-gradient-to-b from-[#f5f8ff] to-[#e8f0ff] rounded-2xl p-4 shadow-sm border border-blue-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                      ) : (
                        <div className="relative w-12 h-12 bg-gradient-to-tr from-sapphire to-blue-400 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white">
                          {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-black text-[15px] text-[#0b1021] truncate leading-tight">{user.displayName || 'Batman'}</p>
                        <p className="text-[11px] font-bold text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => handleLinkClick('/settings')} className="p-2 bg-blue-100/50 text-[#0057ff] rounded-xl hover:bg-blue-100 transition-colors cursor-pointer shrink-0">
                      <Settings size={18} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleLinkClick('/profile')}
                    className="w-full bg-[#3a93ff] text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between px-4 shadow-md shadow-blue-500/20 cursor-pointer hover:bg-[#0057ff]"
                  >
                    <div className="flex items-center gap-2">
                      <User size={14} /> View Profile
                    </div>
                    <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="w-full bg-sapphire text-white py-3.5 rounded-2xl font-bold hover:bg-deep-navy transition-colors text-center block shadow-lg shadow-sapphire/20 cursor-pointer"
                >
                  Sign In or Register
                </button>
              )}

              {/* Sign Out Button */}
              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 border border-red-200 text-red-500 bg-white py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer hover:bg-red-50 shadow-sm"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              )}

              {/* Footer Trust Badge */}
              <div className="mt-6 flex items-center justify-center gap-3 bg-gray-50 py-3 rounded-xl border border-gray-100">
                <div className="text-[#3a93ff]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#0b1021] leading-tight">100% Secure Shopping</p>
                  <p className="text-[9px] font-bold text-gray-500">Your data is always protected</p>
                </div>
                <ChevronRight size={14} className="text-gray-300 ml-2" />
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── NOTIFICATION PANEL COMPONENT ───────────────────────────────────────────
const CATEGORY_META: Record<NotificationCategory, { label: string; color: string; dot: string }> = {
  order:   { label: 'Order',   color: 'text-blue-600 bg-blue-50 border-blue-200',   dot: 'bg-blue-500' },
  account: { label: 'Account', color: 'text-violet-600 bg-violet-50 border-violet-200', dot: 'bg-violet-500' },
  promo:   { label: 'Promo',   color: 'text-amber-600 bg-amber-50 border-amber-200',  dot: 'bg-amber-500' },
  system:  { label: 'System',  color: 'text-slate-600 bg-slate-100 border-slate-200', dot: 'bg-slate-400' },
};

function timeAgo(isoString: string): string {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

type FilterTab = 'all' | NotificationCategory;

const NotificationPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();
  const [activeFilter] = useState<FilterTab>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.category === activeFilter);

  const unreadCount = notifications.filter(n => !n.isRead).length;



  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute top-full right-[-60px] md:right-[-100px] mt-3 w-[340px] bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 z-50 flex flex-col overflow-hidden"
          style={{ maxHeight: '60vh' }}
        >
          {/* Header */}
          <div className="px-5 py-3 border-b border-gray-200/40 flex items-center justify-between bg-transparent shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sapphire/10 text-sapphire rounded-lg">
                <Bell size={16} className="stroke-[2.5]" />
              </div>
              <span className="font-black text-gray-900 text-base">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-sapphire text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="flex items-center gap-1 text-[11px] font-bold text-sapphire hover:text-deep-navy hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <CheckCheck size={13} /> All read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all"
                  className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>



          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 bg-gray-200/30 rounded-full flex items-center justify-center mb-4">
                  <Bell size={28} className="text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-900">No notifications here</p>
                <p className="text-xs text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100/50">
                {filtered.map(notif => {
                  const meta = CATEGORY_META[notif.category];
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`relative flex gap-3 px-4 py-3.5 group cursor-pointer transition-all hover:bg-white/50 ${
                        !notif.isRead ? 'bg-blue-50/20' : ''
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      {/* Unread dot */}
                      {!notif.isRead && (
                        <span className={`absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      )}

                      {/* Category badge */}
                      <div className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wide h-fit ${meta.color}`}>
                        {meta.label}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug line-clamp-1 ${!notif.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                          {timeAgo(notif.timestamp)}
                        </p>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        className="shrink-0 self-start opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200/40 bg-transparent shrink-0">
            <Link
              to="/notifications"
              onClick={onClose}
              className="block w-full py-2.5 text-center text-xs font-bold text-sapphire hover:text-white hover:bg-sapphire rounded-xl transition-all"
            >
              View all notifications
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// MAIN NAVBAR COMPONENT
export const PublicNavbar: React.FC = () => {
  const { user, firebaseUser, logout, registeredUsers } = useAuthStore();
  const dbUser = registeredUsers.find(u => u.uid === user?.uid);
  const profile = useProfileStore();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const avatarUrl = dbUser?.avatar || profile?.avatar || firebaseUser?.photoURL || (user as any)?.photoURL;
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { categories } = useCategoryStore();

  const { unreadCount } = useNotificationStore();
  const notifUnread = unreadCount();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for glassmorphism layout shifts
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-semibold tracking-wide py-2 transition-colors flex items-center h-full ${isActive ? 'text-sapphire' : 'text-gray-600 hover:text-sapphire'
    }`;

  const location = useLocation();
  const isHiddenMobileTopNav = location.pathname === '/sale' || location.pathname === '/cart';

  return (
    <>
      {/* Top utility bar */}
      <div className={`bg-deep-navy text-white text-[11px] py-2.5 px-4 text-center font-bold tracking-wider uppercase ${isHiddenMobileTopNav ? 'hidden md:block' : ''}`}>
        {t('feature.shipping.title')} • {t('feature.shipping.desc')}
      </div>

      <nav className={`sticky top-0 z-50 bg-white transition-all duration-200 ${scrolled ? 'border-b border-gray-200 shadow-md shadow-gray-900/5' : 'border-b border-gray-100'} ${isHiddenMobileTopNav ? 'hidden md:block' : ''}`}>

        {/* Main Navbar */}
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

            {/* Mobile Hamburger (Left Side) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 mr-1 text-gray-900 hover:text-sapphire rounded-xl transition-colors cursor-pointer"
            >
              <Menu size={24} />
            </button>

            {/* 3D Animated Logo */}
            <Link to="/" className="flex items-center group mr-auto md:mr-0">
              <span className="text-xl font-black text-gray-900 tracking-wider flex items-center gap-2">
                THE
                <img src="/logo.svg" alt="Bat Logo" className="h-6 w-auto object-contain" />
                <span className="text-sapphire font-black">STORE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 h-full">
              <NavLink to="/" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {t('nav.home')}
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sapphire rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink to="/shop" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {t('nav.shop')}
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-sapphire rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>

              {/* Dynamic Categories Dropdown Trigger */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="text-gray-600 hover:text-sapphire font-semibold text-sm tracking-wide flex items-center gap-1.5 cursor-pointer py-2">
                  {t('nav.categories')}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                <CategoriesDropdown isOpen={isCategoriesOpen} onClose={() => setIsCategoriesOpen(false)} categories={categories} />
              </div>

              <NavLink to="/sale" className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    <span className="text-red-500 hover:text-red-600 font-bold flex items-center gap-1.5">
                      {t('nav.sale')}
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-red-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </div>

            {/* Right Icons Row */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-sapphire hover:bg-gray-100/80 rounded-xl transition-all cursor-pointer outline-none flex items-center justify-center"
                title="Search"
              >
                <Search size={20} />
              </button>

              <Link
                to="/wishlist"
                className="hidden md:flex items-center justify-center p-2 text-gray-700 hover:text-sapphire hover:bg-gray-100/80 rounded-xl transition-all relative"
                title="Wishlist"
              >
                <Heart size={20} />
                <AnimatePresence>
                  {wishlistItems.length > 0 && (
                    <motion.span
                      key={wishlistItems.length}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm"
                    >
                      {wishlistItems.length > 99 ? '99+' : wishlistItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {user ? (
                <>
                  <div className="relative hidden md:flex items-center justify-center" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="relative flex items-center justify-center p-1 text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all border border-transparent cursor-pointer outline-none group"
                      title="Account"
                    >
                      {avatarUrl ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                          <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                          {(dbUser?.displayName || profile.fullName || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* Green Online Indicator */}
                      <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 w-60 bg-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] border border-gray-200/90 p-1.5 z-[100]"
                        >
                          {/* Classic & Elegant Executive Header */}
                          <div className="flex items-center gap-3 p-2.5 mb-1 bg-gray-50/70 rounded-xl border border-gray-100">
                            <div className="relative shrink-0">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt="Profile"
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                  {(dbUser?.displayName || profile?.fullName || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {dbUser?.displayName || profile?.fullName || user.displayName || 'Account'}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {/* Classic Navigation List */}
                          <div className="space-y-0.5">
                            {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                              <Link
                                to="/admin"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-xl transition-colors group"
                              >
                                <div className="flex items-center gap-2.5">
                                  <ShieldCheck size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                                  <span>Admin Board</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700">PRO</span>
                              </Link>
                            )}

                            <Link
                              to="/profile"
                              state={{ tab: 'orders' }}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-xl transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <ShoppingBag size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                                <span>My Orders</span>
                              </div>
                              <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                            </Link>

                            <Link
                              to="/wishlist"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-xl transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <Heart size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                                <span>Saved Wishlist</span>
                              </div>
                              {wishlistItems.length > 0 ? (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 rounded-md">
                                  {wishlistItems.length}
                                </span>
                              ) : (
                                <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                              )}
                            </Link>

                            <Link
                              to="/profile"
                              state={{ tab: 'profile' }}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-xl transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <User size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                                <span>My Profile</span>
                              </div>
                              <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                            </Link>

                            <Link
                              to="/profile"
                              state={{ tab: 'settings' }}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-xl transition-colors group"
                            >
                              <div className="flex items-center gap-2.5">
                                <Settings size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                                <span>Account Settings</span>
                              </div>
                              <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-700 transition-colors" />
                            </Link>
                          </div>

                          {/* Classic Divider & Logout */}
                          <div className="border-t border-gray-150 mt-1 pt-1">
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer group"
                            >
                              <LogOut size={16} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center justify-center p-2 text-gray-600 hover:text-sapphire hover:bg-gray-50 rounded-xl transition-all"
                  title="Sign In"
                >
                  <User size={20} />
                </Link>
              )}

              {/* Notification Bell */}
              {user && (
                <div className="relative flex items-center justify-center" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 text-gray-700 hover:text-sapphire hover:bg-gray-100/80 rounded-xl transition-all relative cursor-pointer outline-none flex items-center justify-center"
                    title="Notifications"
                  >
                    <Bell size={20} />
                    <AnimatePresence>
                      {notifUnread > 0 && (
                        <motion.span
                          key={notifUnread}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm border border-white"
                        >
                          {notifUnread > 9 ? '9+' : notifUnread}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                </div>
              )}

              <Link
                to="/cart"
                className="flex items-center justify-center p-2 text-gray-700 hover:text-sapphire hover:bg-gray-100/80 rounded-xl transition-all relative"
                title="Cart"
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-sapphire text-white text-[9px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm border border-white"
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* Advanced Command Palette Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Full-Featured Mobile Navigation Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        avatarUrl={avatarUrl}
        wishlistCount={wishlistItems.length}
        cartCount={totalItems}
        notifCount={notifUnread}
        categories={categories}
        handleLogout={handleLogout}
      />

      {/* Mobile Bottom Navigation Bar (Light Theme) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-[60] px-4 py-2 flex justify-between items-center pb-safe">
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#0E51FF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <HomeIcon size={24} className={location.pathname === '/' ? 'fill-current' : ''} strokeWidth={location.pathname === '/' ? 2 : 1.5} />
          <span className="text-[10px] font-bold">Home</span>
        </NavLink>
        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          <LayoutGrid size={24} strokeWidth={1.5} />
          <span className="text-[10px] font-bold">Categories</span>
        </button>
        <NavLink to="/sale" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#0E51FF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <Zap size={24} className={location.pathname === '/sale' ? 'fill-current' : ''} strokeWidth={location.pathname === '/sale' ? 2 : 1.5} />
          <span className="text-[10px] font-bold">Flash Sale</span>
        </NavLink>
        <NavLink to="/wishlist" className={({isActive}) => `relative flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#0E51FF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <Heart size={24} className={location.pathname === '/wishlist' ? 'fill-current' : ''} strokeWidth={location.pathname === '/wishlist' ? 2 : 1.5} />
          <span className="text-[10px] font-bold">Wishlist</span>
          {wishlistItems.length > 0 && (
            <span className="absolute -top-1.5 right-[2px] bg-pink-500 text-white text-[9px] font-black w-[16px] h-[16px] rounded-full flex items-center justify-center border-2 border-white">
              {wishlistItems.length}
            </span>
          )}
        </NavLink>
        <NavLink to={user ? "/profile" : "/login"} className={({isActive}) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#0E51FF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <User size={24} className={location.pathname === '/profile' ? 'fill-current' : ''} strokeWidth={location.pathname === '/profile' ? 2 : 1.5} />
          <span className="text-[10px] font-bold">Account</span>
        </NavLink>
      </div>
    </>
  );
};
