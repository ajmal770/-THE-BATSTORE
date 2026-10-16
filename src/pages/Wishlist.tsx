import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Star, Check, ChevronDown, Filter, CheckSquare, X, CheckCircle2 } from 'lucide-react';
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
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 2500);
  };

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

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === wishlistItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(wishlistItems.map((item) => item.id)));
    }
  };

  const handleAddSelectedToCart = () => {
    const itemsToAdd = wishlistItems.filter((item) => selectedIds.has(item.id));
    if (itemsToAdd.length === 0) return;

    itemsToAdd.forEach((item) => {
      addItemToCart({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      });
    });

    showToast(`${itemsToAdd.length} ${itemsToAdd.length === 1 ? 'item' : 'items'} added to cart!`, 'success');
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    if (count === 0) return;

    selectedIds.forEach((id) => {
      removeWishlistItem(id);
    });

    showToast(`${count} ${count === 1 ? 'item' : 'items'} removed from wishlist`, 'success');
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleAddAllToCart = () => {
    if (wishlistItems.length === 0) return;
    wishlistItems.forEach((item) => {
      addItemToCart({
        id: item.id.toString(),
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      });
    });
    showToast(`All ${wishlistItems.length} items added to cart!`, 'success');
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
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
              <Heart className="text-pink-500" size={22} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 text-sm mt-0.5">{wishlistItems.length} items saved for later</p>
            </div>

            {/* Desktop Select Section */}
            {isSelectionMode ? (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={toggleSelectAll}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckSquare size={14} className="text-gray-700" />
                  <span>{selectedIds.size === wishlistItems.length ? 'Deselect All' : `Select All (${wishlistItems.length})`}</span>
                </button>
                
                <button
                  disabled={selectedIds.size === 0}
                  onClick={handleAddSelectedToCart}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0E51FF] hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={14} />
                  <span>Add to Cart {selectedIds.size > 0 && `(${selectedIds.size})`}</span>
                </button>

                <button
                  disabled={selectedIds.size === 0}
                  onClick={handleDeleteSelected}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  <span>Delete {selectedIds.size > 0 && `(${selectedIds.size})`}</span>
                </button>

                <button
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedIds(new Set());
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gray-900 hover:bg-black text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <X size={14} />
                  <span>Done</span>
                </button>
              </div>
            ) : (
              <button
                disabled={wishlistItems.length === 0}
                onClick={() => setIsSelectionMode(true)}
                className={`ml-auto px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                  wishlistItems.length === 0
                    ? 'bg-gray-100/90 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                    : 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-2xs active:scale-95 cursor-pointer'
                }`}
              >
                <CheckSquare size={15} className={wishlistItems.length === 0 ? "text-gray-400" : "text-gray-700"} />
                <span className={wishlistItems.length === 0 ? "text-gray-400" : "text-gray-900"}>Select</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-4 lg:px-8 max-w-6xl md:mt-8">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between pt-6 pb-4 px-4">
          <div className="flex items-start gap-3">
            <Heart className="text-pink-500 mt-1" size={26} strokeWidth={2} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-none">My Wishlist</h1>
              <p className="text-gray-500 text-[13px] mt-1.5">{wishlistItems.length} items saved for later</p>
            </div>
          </div>
          {isSelectionMode ? (
            <button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedIds(new Set());
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gray-900 text-white hover:bg-black shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Done</span>
            </button>
          ) : (
            <button
              disabled={wishlistItems.length === 0}
              onClick={() => setIsSelectionMode(true)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                wishlistItems.length === 0
                  ? 'bg-gray-100/90 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                  : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-2xs cursor-pointer'
              }`}
            >
              <CheckSquare size={13} className={wishlistItems.length === 0 ? "text-gray-400" : "text-gray-700"} />
              <span className={wishlistItems.length === 0 ? "text-gray-400" : "text-gray-900"}>Select</span>
            </button>
          )}
        </div>

        {/* Mobile Selection Action Bar */}
        {isSelectionMode && wishlistItems.length > 0 && (
          <div className="md:hidden flex items-center justify-between px-4 pb-3 pt-1 border-b border-gray-200/70 mb-2">
            <button
              onClick={toggleSelectAll}
              className="text-xs font-bold text-gray-800 hover:text-black flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <CheckSquare size={14} className="text-gray-700" />
              <span>{selectedIds.size === wishlistItems.length ? 'Deselect All' : `Select All (${wishlistItems.length})`}</span>
            </button>
            <span className="text-xs font-bold text-gray-500">
              {selectedIds.size} selected
            </span>
          </div>
        )}

        {/* Mobile Filter Row (Only when items exist and not in selection mode) */}
        {wishlistItems.length > 0 && !isSelectionMode && (
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
        )}

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
                {wishlistItems.map((item, index) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        if (isSelectionMode) {
                          toggleSelectItem(item.id);
                        }
                      }}
                      className={`bg-white rounded-2xl p-3 shadow-sm border transition-all duration-300 group flex flex-row md:flex-col relative ${
                        isSelectionMode ? 'cursor-pointer' : ''
                      } ${
                        isSelected
                          ? 'border-[#0E51FF] ring-2 ring-blue-500/30 bg-blue-50/10'
                          : 'border-gray-100 md:hover:shadow-xl'
                      }`}
                    >
                      {/* Image Section */}
                      <div
                        className="relative w-[110px] h-[110px] md:w-full md:h-auto md:aspect-square shrink-0 bg-gray-50 rounded-xl overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          if (isSelectionMode) {
                            e.stopPropagation();
                            toggleSelectItem(item.id);
                          } else {
                            navigate(`/products/${item.id}`);
                          }
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Selection Checkbox Overlay */}
                        {isSelectionMode && (
                          <div className="absolute top-2 left-2 z-20">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#0E51FF] text-white shadow-md'
                                  : 'bg-white/95 border-2 border-gray-400 shadow-xs'
                              }`}
                            >
                              {isSelected && <Check size={14} className="stroke-[3]" />}
                            </div>
                          </div>
                        )}

                        {/* Discount Badge */}
                        {item.oldPrice && (
                          <div
                            className={`absolute top-1.5 ${
                              isSelectionMode ? 'left-10' : 'left-1.5'
                            } bg-[#FF2B5E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-all`}
                          >
                            -{Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}%
                          </div>
                        )}
                      </div>

                      {/* Info Section */}
                      <div className="pl-3 md:pl-0 md:pt-3 flex flex-col flex-1 relative min-w-0">
                        {/* Delete Button (Normal mode only) */}
                        {!isSelectionMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWishlistItem(item.id);
                            }}
                            className="absolute -top-1 -right-1 p-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white/80 rounded-full cursor-pointer border border-gray-100 shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                        <h4
                          className="font-bold text-gray-900 text-[13px] md:text-sm leading-snug line-clamp-1 hover:text-sapphire cursor-pointer pr-8 mb-0.5"
                          onClick={(e) => {
                            if (isSelectionMode) {
                              e.stopPropagation();
                              toggleSelectItem(item.id);
                            } else {
                              navigate(`/products/${item.id}`);
                            }
                          }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
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
                  );
                })}
              </motion.div>

              {/* Sticky Summary Bar (Mobile Only) */}
              {isSelectionMode ? (
                <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-white border-t border-gray-100 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 flex items-center justify-between gap-2">
                  <button
                    disabled={selectedIds.size === 0}
                    onClick={handleDeleteSelected}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete ({selectedIds.size})</span>
                  </button>
                  <button
                    disabled={selectedIds.size === 0}
                    onClick={handleAddSelectedToCart}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#0E51FF] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ShoppingCart size={14} />
                    <span>Add to Cart ({selectedIds.size})</span>
                  </button>
                </div>
              ) : (
                <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium mb-0.5">Total ({wishlistItems.length} Items)</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-lg font-black text-gray-900">${totalPrice.toFixed(2)}</p>
                      <p className="text-[11px] text-gray-400 line-through">${(totalPrice * 1.25).toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddAllToCart}
                    className="bg-[#0E51FF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 text-[13px] cursor-pointer"
                  >
                    <ShoppingCart size={14} /> Add All to Cart
                  </button>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 text-xs sm:text-sm font-bold text-white ${
              toast.type === 'success' ? 'bg-gray-900 border border-gray-800' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <X size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
