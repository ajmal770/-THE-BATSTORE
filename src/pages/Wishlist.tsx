import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star, Check, ChevronDown, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const addItemToCart = useCartStore((state) => state.addItem);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToCart = (item: typeof wishlistItems[0]) => {
    addItemToCart({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };


  const totalPrice = wishlistItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-32 font-sans">
      <SEO title="My Wishlist" description="View your saved items and products." />

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-sapphire transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2" /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="text-pink-500" size={22} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 text-sm mt-0.5">{wishlistItems.length} items saved for later</p>
            </div>
            <button className="ml-auto px-6 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 cursor-pointer">
              Select
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-4 lg:px-8 max-w-6xl md:mt-8">
        
        {/* Mobile Header (Matching Mockup exactly) */}
        <div className="md:hidden flex items-center justify-between pt-6 pb-4 px-4">
          <div className="flex items-start gap-3">
            <Heart className="text-pink-500 mt-1" size={26} strokeWidth={2} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-none">My Wishlist</h1>
              <p className="text-gray-500 text-[13px] mt-1.5">{wishlistItems.length} items saved for later</p>
            </div>
          </div>
          <button className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer">
            Select
          </button>
        </div>

        {/* Mobile Filter Row */}
        <div className="md:hidden flex items-center gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-[13px] font-medium whitespace-nowrap shrink-0">
            All Items ({wishlistItems.length})
          </button>
          <button className="px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-[13px] font-medium flex items-center justify-between gap-2 shrink-0 min-w-[130px]">
            Price: Low to High <ChevronDown size={14} className="text-gray-400" />
          </button>
          <button className="px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 shrink-0 flex-1">
            <Filter size={14} className="text-gray-400" /> Filter
          </button>
        </div>

        <AnimatePresence>
          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white md:border md:border-gray-100 md:rounded-3xl p-10 md:p-16 text-center md:shadow-sm min-h-[50vh] flex flex-col items-center justify-center mx-4 md:mx-0 rounded-2xl"
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-pink-100 rounded-full animate-ping opacity-20"></div>
                <div className="relative w-full h-full bg-pink-50 rounded-full flex items-center justify-center shadow-inner">
                  <Heart className="text-pink-400 drop-shadow-md animate-pulse" size={40} fill="currentColor" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto text-[13px] leading-relaxed">
                You haven't saved any items yet. Start exploring and tap the heart icon on products you love to save them for later!
              </p>
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#1859E3] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md text-[13px] w-full max-w-[200px] cursor-pointer"
              >
                Explore Products
              </button>
            </motion.div>
          ) : (
            <div className="px-4 md:px-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 md:hover:shadow-xl transition-all duration-300 group flex flex-row md:flex-col relative"
                  >
                    {/* Image Section */}
                    <div className="relative w-[110px] h-[110px] md:w-full md:h-auto md:aspect-square shrink-0 bg-gray-50 rounded-xl overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Discount Badge */}
                      {item.oldPrice && (
                        <div className="absolute top-1.5 left-1.5 bg-[#FF2B5E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          -{Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}%
                        </div>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="pl-3 md:pl-0 md:pt-3 flex flex-col flex-1 relative min-w-0">
                      {/* Delete Button */}
                      <button
                        onClick={() => removeWishlistItem(item.id)}
                        className="absolute -top-1 -right-1 p-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white/80 rounded-full cursor-pointer border border-gray-100 shadow-sm"
                      >
                        <Trash2 size={14} />
                      </button>

                      <h4
                        className="font-bold text-gray-900 text-[13px] md:text-sm leading-snug line-clamp-1 hover:text-sapphire cursor-pointer pr-8 mb-0.5"
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        {item.name}
                      </h4>
                      
                      {item.category && (
                        <p className="text-[11px] text-gray-500 mb-1">
                          {item.category === 'electronics' ? 'Smart Watch' : item.category === 'audio' ? 'Portable Bluetooth Speaker' : item.category}
                        </p>
                      )}

                      {/* Rating */}
                      {item.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-[11px] font-bold text-gray-700">{item.rating}</span>
                          <span className="text-[11px] text-gray-400">({Math.floor(Math.random() * 900) + 100})</span>
                        </div>
                      )}

                      {/* Price Row */}
                      <div className="flex items-baseline gap-1.5 mb-1.5">
                        <p className="text-[15px] font-bold text-[#FF2B5E]">${item.price.toFixed(2)}</p>
                        {item.oldPrice && (
                          <p className="text-[11px] text-gray-400 line-through font-medium">${item.oldPrice.toFixed(2)}</p>
                        )}
                      </div>

                      {/* In Stock & Add to cart button row */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${index % 3 === 0 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                          <span className={`text-[10px] font-medium ${index % 3 === 0 ? 'text-orange-500' : 'text-green-500'}`}>
                            {index % 3 === 0 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm text-[11px] font-medium ${
                            addedIds.has(item.id)
                              ? 'bg-emerald-500 text-white'
                              : 'bg-[#0E51FF] text-white hover:bg-blue-700'
                          }`}
                        >
                          {addedIds.has(item.id) ? <Check size={12} className="stroke-[3]" /> : <ShoppingCart size={12} />}
                          {addedIds.has(item.id) ? 'Added' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Sticky Summary Bar (Mobile Only) */}
              <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-gray-500 font-medium mb-0.5">Total ({wishlistItems.length} Items)</p>
                  <div className="flex items-baseline gap-1.5">
                    <p className="text-lg font-black text-gray-900">${totalPrice.toFixed(2)}</p>
                    <p className="text-[11px] text-gray-400 line-through">${(totalPrice * 1.25).toFixed(2)}</p>
                  </div>
                </div>
                <button
                  className="bg-[#0E51FF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-[13px] cursor-pointer"
                >
                  <ShoppingCart size={14} /> Add All to Cart
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;
