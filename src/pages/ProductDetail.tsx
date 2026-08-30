import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, ShoppingCart, Package, AlertTriangle, CheckCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { useWishlistStore } from '../store/wishlistStore';
import { motion, AnimatePresence } from 'framer-motion';

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500', canAdd: false };
  if (stock <= 10) return { label: `Only ${stock} left!`, color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500 animate-pulse', canAdd: true };
  return { label: 'In Stock', color: 'text-green-700 bg-green-50 border-green-200', dot: 'bg-green-500', canAdd: true };
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const product = products.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Create a mock gallery using the actual product image to ensure it matches and loads perfectly
  const images = product ? [
    product.image,
    product.image,
    product.image,
    product.image
  ] : [];

  const stockStatus = product ? getStockStatus(product.stock) : null;

  // CSS classes to fake different image poses using the same image
  const poseStyles = [
    "object-cover object-center",
    "object-cover object-[10%_20%] scale-[1.3]",
    "object-cover object-[80%_80%] scale-[1.3]",
    "object-cover object-bottom scale-110",
  ];

  const handleAddToCart = () => {
    if (!product || !stockStatus?.canAdd) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  // Product not found fallback
  if (!product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={36} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or may have been removed.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-sapphire text-white px-8 py-3 rounded-xl font-bold hover:bg-deep-navy transition-colors shadow-lg shadow-sapphire/20"
          >
            <ArrowLeft size={18} /> Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const ratingStars = Math.round(product.rating);

  return (
    <div className="bg-white min-h-screen py-8">
      <SEO title={product.name} description={product.description?.substring(0, 150) || `Buy ${product.name} at the best price.`} />
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-sapphire flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span>/</span>
          <Link to="/products" className="hover:text-sapphire transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group cursor-crosshair">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isFlashSale && product.discount && (
                  <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                    -{product.discount}% OFF
                  </span>
                )}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  <div className="w-full h-full group-hover:scale-125 transition-transform duration-700 ease-out">
                    <img
                      src={images[activeImage]}
                      alt={product.name}
                      className={`w-full h-full ${poseStyles[activeImage]}`}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-sapphire shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-200'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className={`w-full h-full ${poseStyles[idx]}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Column */}
          <div className="flex-1 flex flex-col font-sans space-y-6">
            {/* Category & Title */}
            <div>
              <p className="text-xs font-black text-sapphire uppercase tracking-widest mb-3 bg-blue-50 px-2.5 py-1 rounded-md w-fit">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={18}
                      className={s <= ratingStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-900">{product.rating}</span>
                  <span className="text-sm font-medium text-gray-400">({product.reviews || product.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-gray-900 tracking-tight">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-xl font-bold text-gray-400 line-through mb-1.5">${product.oldPrice.toFixed(2)}</span>
              )}
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black px-2.5 py-1 rounded-lg mb-2">
                  Save ${(product.oldPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

              {/* Stock Status */}
              {stockStatus && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold w-fit ${stockStatus.color}`}>
                  <div className={`w-2 h-2 rounded-full ${stockStatus.dot}`} />
                  {stockStatus.label}
                </div>
              )}

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base border-t border-gray-100 pt-6 mt-2">{product.description}</p>
            )}

            {/* Quantity */}
            {stockStatus?.canAdd && (
              <div className="pt-2">
                <p className="text-sm font-bold text-gray-700 mb-3">Quantity</p>
                <div className="flex items-center gap-0.5 bg-gray-100 rounded-2xl p-1 w-fit">
                  <button
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:bg-sapphire hover:text-white font-bold text-xl transition-all shadow-sm disabled:opacity-40 cursor-pointer"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >−</button>
                  <span className="w-14 text-center font-bold text-gray-900 text-lg tabular-nums">{quantity}</span>
                  <button
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:bg-sapphire hover:text-white font-bold text-xl transition-all shadow-sm disabled:opacity-40 cursor-pointer"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >+</button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 mb-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!stockStatus?.canAdd}
                className={`flex-1 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all text-base cursor-pointer ${
                  addedToCart
                    ? 'bg-green-500 text-white shadow-green-200'
                    : stockStatus?.canAdd
                    ? 'bg-sapphire text-white hover:bg-deep-navy shadow-sapphire/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={20} /> Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      {stockStatus?.canAdd ? 'Add to Cart' : 'Out of Stock'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                onClick={() => toggleItem({ ...product })}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center ${
                  isInWishlist(product.id)
                    ? 'border-pink-400 bg-pink-50 text-pink-500'
                    : 'border-gray-200 text-gray-400 hover:border-pink-400 hover:text-pink-500 hover:bg-pink-50'
                }`}
                title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={22} className={isInWishlist(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50">
                <div className="p-2.5 bg-blue-50 text-sapphire rounded-xl shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 tracking-tight">Free Shipping</p>
                  <p className="text-xs text-gray-500 font-medium">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50">
                <div className="p-2.5 bg-green-50 text-green-600 rounded-xl shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 tracking-tight">1 Year Warranty</p>
                  <p className="text-xs text-gray-500 font-medium">Full manufacturer cover</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 tracking-tight">Stock: {product.stock} units</p>
                  <p className="text-xs text-gray-500 font-medium">Updated in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100/50">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 tracking-tight">Secure Checkout</p>
                  <p className="text-xs text-gray-500 font-medium">SSL encrypted payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16 border-t border-gray-100 pt-16 pb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8">Customer Reviews</h2>
          
          {product.reviewsList && product.reviewsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviewsList.map((review) => (
                <div key={review.id} className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={16} className={s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                        ))}
                      </div>
                      <h4 className="font-bold text-gray-900">{review.title}</h4>
                    </div>
                    <span className="text-xs font-medium text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.body}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100/60">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sapphire/10 flex items-center justify-center text-sapphire font-bold text-xs">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{review.userName}</span>
                    </div>
                    {review.recommended && (
                      <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 size={14} /> Recommends this product
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50/50 rounded-3xl p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                <Star size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">Be the first to review this product and share your thoughts with other customers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
