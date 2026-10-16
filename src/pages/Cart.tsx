import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Sparkles, 
  Tag, 
  ChevronDown, 
  Truck, 
  Info, 
  Lock, 
  ArrowRight, 
  Trash2, 
  X, 
  ShieldCheck, 
  Box, 
  HeadphonesIcon 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useCouponStore } from '../store/couponStore';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getSubtotal, appliedCoupon, applyCoupon } = useCartStore();
  const { coupons } = useCouponStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const subtotal = getSubtotal();

  // Calculate discount and shipping rules
  let discountAmount = 0;
  let isFreeShippingCouponActive = false;
  let minOrderError = false;

  if (appliedCoupon) {
    if (subtotal < appliedCoupon.minOrder) {
      minOrderError = true;
    } else {
      if (appliedCoupon.type === 'Percentage') {
        discountAmount = subtotal * (appliedCoupon.value / 100);
      } else if (appliedCoupon.type === 'Fixed Amount') {
        discountAmount = Math.min(subtotal, appliedCoupon.value);
      } else if (appliedCoupon.type === 'Free Shipping') {
        isFreeShippingCouponActive = true;
      }
    }
  }

  const shippingThreshold = 100;
  const isFreeShipping = (subtotal >= shippingThreshold && subtotal > 0) || isFreeShippingCouponActive;
  
  // When cart is empty: all amounts are 0.00 (empty model).
  // When products are added ("product adding time"), shipping ($15.00 or FREE), tax, and total are calculated.
  const shipping = items.length === 0 ? 0 : (isFreeShipping ? 0 : 15.00);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = items.length === 0 ? 0 : taxableAmount * 0.08;
  const total = items.length === 0 ? 0 : (taxableAmount + shipping + tax);

  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);

    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const code = couponInput.trim().toUpperCase();
    const foundCoupon = coupons.find(c => c.code.toUpperCase() === code);

    if (!foundCoupon) {
      setCouponError('Invalid coupon code.');
      return;
    }

    if (foundCoupon.status !== 'Active') {
      setCouponError('This coupon code has expired.');
      return;
    }

    if (subtotal < foundCoupon.minOrder) {
      setCouponError(`This coupon requires a minimum order of $${foundCoupon.minOrder.toFixed(2)}.`);
      return;
    }

    applyCoupon(foundCoupon);
    setCouponSuccess(`Coupon "${foundCoupon.code}" applied successfully!`);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
  };

  const activeCoupons = coupons.filter(c => c.status === 'Active');

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header (Matching Image 1) */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-center shrink-0">
            <ShoppingCart className="text-[#2563eb]" size={26} strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Shopping Cart
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-normal mt-0.5">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>

        {/* Content: Empty State or 2-Column Responsive Layout */}
        {items.length === 0 ? (
          /* Empty Cart State - Order Summary is hidden */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden max-w-2xl mx-auto">
            <div className="py-16 md:py-20 px-6 flex flex-col items-center justify-center text-center">
              {/* Soft Light Blue Circle with Cart and Sparkle Icon */}
              <div className="w-24 h-24 rounded-full bg-[#f0f6ff] flex items-center justify-center relative mb-5">
                <ShoppingCart size={38} className="text-[#3b82f6]" strokeWidth={2.2} />
                <Sparkles size={18} className="text-[#60a5fa] absolute top-4 right-4" strokeWidth={2.2} />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                Your cart is empty!
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mb-7 leading-relaxed">
                Looks like you haven't added any items yet. Explore our curated collections to get started.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-7 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer"
              >
                <span>Start Shopping</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          /* 2-Column Responsive Layout when items exist */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Column: Items in Your Cart */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Header inside the card */}
                <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">
                    Items in Your Cart
                  </h2>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div 
                      key={`${item.id}-${item.color}-${item.size}`}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:bg-slate-50/40 transition-colors"
                    >
                      {/* Left: Thumbnail + Title & Unit Price */}
                      <div className="flex items-center gap-4 sm:gap-5 min-w-0 flex-1">
                        {/* Product Thumbnail (Clickable to open product) */}
                        <Link 
                          to={`/products/${item.id}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f8fafc] border border-slate-200/70 p-2.5 shrink-0 flex items-center justify-center overflow-hidden hover:border-blue-400 hover:shadow-xs transition-all group"
                          title={`View ${item.name}`}
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
                          />
                        </Link>

                        {/* Product Details (Clickable to open product) */}
                        <div className="min-w-0">
                          <Link
                            to={`/products/${item.id}`}
                            className="block text-base sm:text-lg font-bold text-slate-900 truncate hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                            title={`View ${item.name}`}
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-slate-400 font-normal mt-1">
                            ${item.price.toFixed(2)} each
                          </p>
                          {(item.color || item.size) && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              {item.color && (
                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/70">
                                  {item.color}
                                </span>
                              )}
                              {item.size && (
                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/70">
                                  Size: {item.size}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Stepper pill + Subtotal Price + Trash Icon */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 shrink-0">
                        {/* Stepper Pill matching the image */}
                        <div className="flex items-center bg-[#f1f5f9] border border-slate-200/60 rounded-2xl p-1 gap-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 font-semibold text-sm disabled:opacity-30 transition-all cursor-pointer"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl bg-white text-slate-800 hover:bg-slate-50 font-bold text-sm shadow-2xs border border-slate-200/60 transition-all cursor-pointer"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Subtotal Price */}
                        <div className="w-20 sm:w-24 text-right">
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Trash/Remove Button */}
                        <button 
                          onClick={() => removeItem(item.id, item.color, item.size)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50/70 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={18} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* Right Column: Order Summary (Matching Image 2) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 overflow-hidden sticky top-28">
              
              {/* Header with Blue-to-Indigo Gradient */}
              <div className="bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#4f46e5] px-6 py-3.5 text-white flex items-center justify-between relative overflow-hidden shrink-0">
                <div className="flex items-center gap-2.5 relative z-10">
                  <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/20 shadow-xs">
                    <ShoppingCart size={18} className="text-white" strokeWidth={2.4} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight">
                      Order Summary
                    </h2>
                    <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                      Complete your purchase
                    </p>
                  </div>
                </div>

                {/* 3D-styled Shopping Bag Graphic with Dashed Outline Accent */}
                <div className="relative z-10 shrink-0">
                  <svg className="w-9 h-9 drop-shadow-sm" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="bagGrad" x1="12" y1="20" x2="52" y2="60" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#67e8f9" />
                        <stop offset="0.4" stopColor="#38bdf8" />
                        <stop offset="1" stopColor="#2563eb" />
                      </linearGradient>
                      <linearGradient id="handleGrad" x1="24" y1="8" x2="40" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#bae6fd" />
                        <stop offset="1" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                    <path d="M25 22V15C25 11.134 28.134 8 32 8C35.866 8 39 11.134 39 15V22" stroke="url(#handleGrad)" strokeWidth="4" strokeLinecap="round" />
                    <rect x="12" y="20" width="40" height="36" rx="8" fill="url(#bagGrad)" />
                    <rect x="14" y="22" width="36" height="4" rx="2" fill="white" fillOpacity="0.25" />
                    <rect x="23" y="32" width="18" height="12" rx="3" stroke="white" strokeWidth="2" strokeDasharray="3 3" strokeOpacity="0.8" />
                  </svg>
                </div>
              </div>

              {/* Order Summary Body */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                
                {/* Have a Promo Code? Accordion Box */}
                <div className="border border-slate-200/90 rounded-2xl bg-slate-50/70 overflow-hidden transition-all">
                  <div 
                    onClick={() => setShowPromoInput(!showPromoInput)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 shadow-xs">
                        <Tag size={15} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          Have a Promo Code?
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Enter code to get special discount
                        </p>
                      </div>
                    </div>
                    <ChevronDown 
                      size={18} 
                      className={`text-slate-400 transition-transform duration-200 ${showPromoInput ? 'rotate-180' : ''}`} 
                    />
                  </div>

                  {showPromoInput && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-200/60 space-y-3">
                      <div className="flex gap-2 pt-2">
                        <input 
                          type="text" 
                          placeholder="Enter promo code" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 uppercase"
                        />
                        <button 
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
                        >
                          Apply
                        </button>
                      </div>

                      {couponError && (
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          {couponError}
                        </div>
                      )}
                      {couponSuccess && (
                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {couponSuccess}
                        </div>
                      )}

                      {activeCoupons.length > 0 && !appliedCoupon && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Available Coupons</p>
                          <div className="flex flex-wrap gap-1.5">
                            {activeCoupons.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => {
                                  setCouponInput(c.code);
                                  applyCoupon(c);
                                  setCouponSuccess(`Coupon "${c.code}" applied!`);
                                  setCouponError(null);
                                }}
                                className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                              >
                                {c.code}
                                <span className="text-[9px] text-blue-600 ml-1 font-semibold">
                                  {c.type === 'Percentage' ? `${c.value}% off` : c.type === 'Fixed Amount' ? `$${c.value} off` : 'Free ship'}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="mx-3.5 mb-3.5 p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700">{appliedCoupon.code}</span>
                        <span className="text-[10px] text-blue-500 font-medium">
                          {appliedCoupon.type === 'Percentage' ? `-${appliedCoupon.value}%` : appliedCoupon.type === 'Fixed Amount' ? `-$${appliedCoupon.value}` : 'Free Ship'} applied
                        </span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {minOrderError && appliedCoupon && (
                    <div className="mx-3.5 mb-3.5 p-2 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-medium border border-amber-100">
                      Requires minimum order of ${appliedCoupon.minOrder.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Subtotal, Shipping & Tax Lines */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">Subtotal</span>
                    <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-emerald-600 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Truck size={16} className="text-slate-500" />
                        <span>Shipping Estimate</span>
                      </div>
                      <span className="text-slate-900 font-bold">
                        {items.length === 0 ? (
                          '$0.00'
                        ) : shipping === 0 ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-6 mt-0.5">
                      {items.length === 0 
                        ? 'Free shipping on all orders' 
                        : isFreeShipping 
                          ? 'Free shipping unlocked! 🎉' 
                          : `Spend $${(100 - subtotal).toFixed(2)} more for Free Shipping`}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <span>Tax Estimate (8%)</span>
                      <span title="Estimated state and local sales tax" className="inline-flex items-center">
                        <Info size={14} className="text-slate-400 cursor-pointer" />
                      </span>
                    </div>
                    <span className="text-slate-900 font-bold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-[#1d4ed8]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Proceed to Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#5289f7] hover:bg-[#3b82f6] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Lock size={16} className="text-white/90" />
                  <span className="text-sm font-bold">Proceed to Checkout</span>
                  <ArrowRight size={16} className="text-white/90" />
                </button>

              </div>
            </div>
          </div>

        </div>
      )}

        {/* Trust & Confidence Badges */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Secure Payment</span>
            <span className="text-[11px] text-slate-500">256-bit SSL encrypted checkout</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Fast Delivery</span>
            <span className="text-[11px] text-slate-500">Free shipping on orders over $100</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Box size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">Easy Returns</span>
            <span className="text-[11px] text-slate-500">30-day money-back guarantee</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <HeadphonesIcon size={20} />
            </div>
            <span className="text-xs font-bold text-slate-800">24/7 Support</span>
            <span className="text-[11px] text-slate-500">Dedicated expert customer service</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
