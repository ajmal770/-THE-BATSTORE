import React from 'react';
import { Trash2, ArrowRight, ShieldCheck, CreditCard, Tag, ChevronDown, ChevronUp, X, Truck, ArrowLeft, Search, ShoppingBag, Heart, Star, HeadphonesIcon, Box } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useCouponStore } from '../store/couponStore';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getSubtotal, appliedCoupon, applyCoupon } = useCartStore();
  const { coupons } = useCouponStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = React.useState('');
  const [showPromoInput, setShowPromoInput] = React.useState(false);
  const [couponError, setCouponError] = React.useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = React.useState<string | null>(null);

  React.useEffect(() => {
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
  const isFreeShippingBySubtotal = subtotal >= shippingThreshold;
  const shipping = (isFreeShippingBySubtotal || isFreeShippingCouponActive) ? 0 : 15.00;
  const tax = Math.max(0, subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shipping + tax;
  const simSavings = (subtotal * 0.15) + discountAmount;

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

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        {/* Mobile Header for empty state */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-[70] px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ArrowLeft size={24} className="text-slate-800" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Shopping Cart</h1>
          </div>
        </div>

        <div className="text-center max-w-md mt-16 md:mt-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="bg-sapphire text-white px-8 py-3 rounded-lg font-medium hover:bg-deep-navy transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-32 md:pb-6 md:py-12">
      {/* 📱 MOBILE VIEW REDESIGN 📱 */}
      <div className="md:hidden block">
        {/* Mobile Top App Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl z-[70] px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <ArrowLeft size={24} className="text-slate-800" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Shopping Cart</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1 text-slate-800 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={22} />
            </button>
            <div className="relative">
              <ShoppingBag size={22} className="text-slate-800" />
              <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Header Summary */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {items.length} {items.length === 1 ? 'Item' : 'Items'} <span className="text-slate-500 font-normal">in your cart</span>
              </h2>
              <p className="text-emerald-500 text-sm font-semibold mt-1">You saved ${simSavings.toFixed(2)}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2">
               <Truck size={20} className="text-emerald-500" />
               <div>
                  <p className="text-emerald-500 text-xs font-bold leading-tight">Free Delivery</p>
                  <p className="text-slate-500 text-[9px] font-medium leading-tight mt-0.5">Arrives Tomorrow</p>
               </div>
            </div>
          </div>
        </div>

        {/* Mobile Item Cards */}
        <div className="px-4 py-2 space-y-4">
          {items.map((item) => {
            const oldPrice = item.price * 1.15; // simulate 15% off
            const discountPct = Math.round((1 - item.price/oldPrice)*100);
            return (
            <div key={`${item.id}-${item.color}`} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex gap-3 relative">
               <div className="w-[100px] h-[100px] shrink-0 bg-gray-50 rounded-xl relative flex items-center justify-center p-2">
                  <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md z-10">
                    -{discountPct}%
                  </span>
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md mix-blend-multiply" />
               </div>
               
               <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight pr-16">{item.name}</h3>
                      <div className="absolute top-3 right-3 flex gap-2">
                         <button className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors shadow-sm">
                           <Heart size={14} />
                         </button>
                         <button onClick={() => removeItem(item.id, item.color, item.size)} className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors shadow-sm cursor-pointer">
                           <Trash2 size={14} />
                         </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">Color: {item.color} <span className="w-2.5 h-2.5 rounded-full inline-block border border-gray-300" style={{backgroundColor: item.color === 'Black' || item.color === 'Matte Black' ? '#000' : item.color?.toLowerCase()}}></span></p>
                    {item.size && <p className="text-[10px] text-gray-500 mt-0.5">Size: {item.size}</p>}
                    
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-500">4.8</span>
                      <span className="text-[10px] text-gray-400">(215)</span>
                    </div>
                    
                    <div className="flex items-end gap-2 mt-1.5">
                      <span className="text-base font-black text-red-500">${item.price.toFixed(2)}</span>
                      <span className="text-[10px] font-semibold text-gray-400 line-through mb-1">${oldPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                       <span className="text-emerald-500 text-[10px] font-semibold">In Stock</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 right-3 flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm h-7">
                    <button onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-full flex items-center justify-center text-gray-600 font-medium hover:bg-gray-50 disabled:opacity-50 cursor-pointer">
                      −
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)} className="w-7 h-full flex items-center justify-center text-gray-600 font-medium hover:bg-gray-50 cursor-pointer">
                      +
                    </button>
                  </div>
               </div>
            </div>
          )})}
        </div>

        {/* Mobile Coupon Box */}
        <div className="px-4 mt-2">
          <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
               <Tag size={16} className="text-red-500" />
               <span className="text-sm font-bold text-slate-900">Have a Coupon?</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter coupon code" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-sapphire"
              />
              <button onClick={handleApplyCoupon} className="bg-sapphire text-white px-6 rounded-xl font-bold text-sm cursor-pointer hover:bg-blue-700 transition-colors">
                Apply
              </button>
            </div>
            
            {couponError && (
              <div className="mt-2 p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {couponError}
              </div>
            )}
            {couponSuccess && (
              <div className="mt-2 p-2.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                {couponSuccess}
              </div>
            )}
            {appliedCoupon && (
              <div className="mt-2 p-3 bg-blue-50/40 rounded-xl border border-blue-100/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-sapphire/10 text-sapphire rounded-lg">
                    <Tag size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">{appliedCoupon.code}</p>
                    <p className="text-[10px] text-gray-500 font-medium">Applied to your order!</p>
                  </div>
                </div>
                <button onClick={handleRemoveCoupon} className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer" title="Remove coupon">
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Active Promo Suggestions */}
            {!appliedCoupon && (
              <div className="mt-4">
                <p className="text-xs text-slate-600 mb-2 font-medium">Available Coupons</p>
                <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                   <button onClick={() => { setCouponInput('SAVE20'); handleApplyCoupon(); }} className="shrink-0 bg-emerald-50 border border-emerald-100 rounded-lg py-1.5 px-3 flex flex-col items-center cursor-pointer hover:bg-emerald-100 transition-colors">
                     <span className="text-emerald-600 text-[10px] font-bold">SAVE20</span>
                     <span className="text-emerald-500/70 text-[8px] font-semibold uppercase mt-0.5">20% OFF</span>
                   </button>
                   <button onClick={() => { setCouponInput('WELCOME10'); handleApplyCoupon(); }} className="shrink-0 bg-blue-50 border border-blue-100 rounded-lg py-1.5 px-3 flex flex-col items-center cursor-pointer hover:bg-blue-100 transition-colors">
                     <span className="text-blue-600 text-[10px] font-bold">WELCOME10</span>
                     <span className="text-blue-500/70 text-[8px] font-semibold uppercase mt-0.5">10% OFF</span>
                   </button>
                   <button onClick={() => { setCouponInput('FREESHIP'); handleApplyCoupon(); }} className="shrink-0 bg-purple-50 border border-purple-100 rounded-lg py-1.5 px-3 flex flex-col items-center cursor-pointer hover:bg-purple-100 transition-colors">
                     <span className="text-purple-600 text-[10px] font-bold">FREESHIP</span>
                     <span className="text-purple-500/70 text-[8px] font-semibold uppercase mt-0.5">Free Shipping</span>
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Order Summary */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal ({items.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-500 font-medium">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-500 uppercase text-xs font-bold' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-1 flex justify-between items-baseline">
                <span className="font-bold text-slate-900">Total</span>
                <div className="text-right">
                   <span className="text-lg font-black text-slate-900 block leading-none">${total.toFixed(2)}</span>
                   <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">You will save ${simSavings.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Trust Badges */}
        <div className="px-4 mt-6 mb-12 flex justify-between text-center pb-6">
           <div className="flex flex-col items-center gap-1.5 w-1/4">
             <ShieldCheck size={24} className="text-gray-400" strokeWidth={1.5} />
             <span className="text-[8px] font-bold text-slate-900 uppercase">Secure Payment</span>
             <span className="text-[7px] text-gray-500">256-bit SSL</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 w-1/4">
             <Truck size={24} className="text-gray-400" strokeWidth={1.5} />
             <span className="text-[8px] font-bold text-slate-900 uppercase">Free Delivery</span>
             <span className="text-[7px] text-gray-500">On orders $50+</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 w-1/4">
             <Box size={24} className="text-gray-400" strokeWidth={1.5} />
             <span className="text-[8px] font-bold text-slate-900 uppercase">Easy Returns</span>
             <span className="text-[7px] text-gray-500">30-day return</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 w-1/4">
             <HeadphonesIcon size={24} className="text-gray-400" strokeWidth={1.5} />
             <span className="text-[8px] font-bold text-slate-900 uppercase">24/7 Support</span>
             <span className="text-[7px] text-gray-500">We're here to help</span>
           </div>
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="fixed bottom-[65px] left-0 right-0 bg-sapphire text-white p-4 z-[60] flex items-center justify-between rounded-t-3xl shadow-[0_-10px_20px_rgba(14,81,255,0.15)] pb-safe">
           <div>
              <span className="text-xs font-semibold block opacity-90 mb-0.5">{items.length} Items</span>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-black leading-none">${total.toFixed(2)}</span>
                 <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">You save ${simSavings.toFixed(2)}</span>
              </div>
           </div>
           <button onClick={() => navigate('/checkout')} className="bg-white text-slate-900 font-bold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-sm hover:scale-105 transition-transform cursor-pointer">
              Proceed to Checkout <ArrowRight size={16} />
           </button>
        </div>
      </div>

      {/* 🖥️ DESKTOP VIEW 🖥️ */}
      <div className="hidden md:block container mx-auto px-4 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={`${item.id}-${item.color}`} className="p-6 flex flex-row items-center gap-6 relative group hover:bg-slate-50/80 transition-all duration-300">
                    <div className="w-32 h-32 shrink-0 rounded-2xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 p-1.5 border border-slate-200/90 shadow-md shadow-slate-200/60 overflow-hidden relative group/img cursor-pointer">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-white relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500 ease-out" 
                        />
                        <div className="absolute inset-0 bg-slate-950/5 group-hover/img:bg-transparent transition-colors"></div>
                        <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-widest shadow-sm">
                          Verified
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between self-stretch py-0.5">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0 pr-2">
                          <h3 className="text-lg font-extrabold text-slate-900 line-clamp-1 leading-tight mb-1.5 hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2">
                            {item.color && (
                              <span className="text-xs text-slate-600 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                                {item.color}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 font-medium">
                              ${item.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-black text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-slate-100 border border-slate-200/90 rounded-xl p-1 shadow-inner gap-1">
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-blue-600 hover:text-white font-black text-base transition-all shadow-sm disabled:opacity-30 border border-slate-200/80 cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="w-10 text-center text-sm font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 hover:bg-blue-600 hover:text-white font-black text-base transition-all shadow-sm border border-slate-200/80 cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id, item.color, item.size)}
                          className="text-slate-400 hover:text-red-600 transition-all flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-white hover:bg-red-50/80 px-3 py-2 rounded-xl border border-slate-200/80 hover:border-red-200 shadow-sm cursor-pointer"
                        >
                          <Trash2 size={14} className="text-red-500" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-96 shrink-0">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100/80 sticky top-28 backdrop-blur-md">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </h2>

              <div className="mb-6 p-4 bg-gradient-to-br from-blue-50/70 to-indigo-50/30 rounded-2xl border border-blue-100/40 relative overflow-hidden group">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-5 text-indigo-950 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                  <Truck size={100} />
                </div>
                
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Truck size={15} className="text-sapphire animate-pulse" />
                    {subtotal >= 100 
                      ? "Free Shipping Unlocked! 🎉" 
                      : `Spend $${(100 - subtotal).toFixed(2)} more for Free Shipping`}
                  </span>
                  <span className="text-xs font-black text-sapphire">{Math.min(100, Math.round((subtotal / 100) * 100))}%</span>
                </div>
                
                <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sapphire to-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="mb-6 border-b border-gray-100 pb-6">
                <button 
                  onClick={() => setShowPromoInput(!showPromoInput)}
                  className="flex justify-between items-center w-full text-sm font-bold text-gray-700 hover:text-sapphire transition-colors cursor-pointer outline-none"
                >
                  <span className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    {appliedCoupon ? 'Change Promo Code' : 'Have a Promo Code?'}
                  </span>
                  {showPromoInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {showPromoInput && (
                  <div className="mt-3.5 space-y-3.5">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter coupon code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="flex-1 px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sapphire/50 focus:bg-white focus:ring-4 focus:ring-sapphire/5 transition-all font-medium"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        className="px-5 py-2.5 bg-sapphire hover:bg-deep-navy text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-sapphire/10 active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                    
                    {couponError && (
                      <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {couponError}
                      </div>
                    )}
                    {couponSuccess && (
                      <div className="p-2.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {couponSuccess}
                      </div>
                    )}

                    {activeCoupons.length > 0 && (
                      <div className="pt-1.5 font-sans">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Available Coupons</p>
                        <div className="flex flex-wrap gap-1.5">
                          {activeCoupons.map((c) => (
                            <button 
                              key={c.id}
                              onClick={() => {
                                setCouponInput(c.code);
                                applyCoupon(c);
                                setCouponSuccess(`Coupon "${c.code}" applied successfully!`);
                                setCouponError(null);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                appliedCoupon?.code === c.code 
                                  ? 'bg-blue-50/80 border-sapphire text-sapphire shadow-sm'
                                  : 'bg-gray-50/60 border-gray-100 text-gray-600 hover:border-sapphire/40 hover:bg-blue-50/20 hover:text-sapphire'
                              }`}
                            >
                              {c.code}
                              <span className="block text-[9px] font-medium text-gray-400 mt-0.5">
                                {c.type === 'Percentage' ? `${c.value}% Off` : c.type === 'Fixed Amount' ? `$${c.value} Off` : 'Free Shipping'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {appliedCoupon && (
                  <div className="mt-4 p-3 bg-blue-50/40 rounded-xl border border-blue-100/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-sapphire/10 text-sapphire rounded-lg">
                        <Tag size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {appliedCoupon.type === 'Percentage' ? `${appliedCoupon.value}% discount applied` : appliedCoupon.type === 'Fixed Amount' ? `$${appliedCoupon.value} discount applied` : 'Free shipping applied'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleRemoveCoupon} 
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove coupon"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                
                {minOrderError && appliedCoupon && (
                  <div className="mt-2.5 p-2.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Requires min. order of ${appliedCoupon.minOrder.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3.5 text-sm mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && !minOrderError && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  {shipping === 0 ? (
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Free</span>
                  ) : (
                    <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax Estimate (8%)</span>
                  <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-base font-extrabold text-gray-900">Total</span>
                <span className="text-2xl font-black text-sapphire">${total.toFixed(2)}</span>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-sapphire to-blue-600 text-white py-4 rounded-xl font-extrabold hover:shadow-lg hover:shadow-sapphire/25 hover:from-deep-navy hover:to-sapphire transition-all duration-300 flex items-center justify-center gap-2 mb-5 cursor-pointer transform hover:-translate-y-0.5"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="border-t border-gray-50 pt-5 mt-2">
                <div className="flex items-center justify-center gap-6 text-gray-400 hover:text-gray-500 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <ShieldCheck size={16} className="text-sapphire" /> Secure Checkout
                  </div>
                  <div className="h-4 w-[1px] bg-gray-200" />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black tracking-wider uppercase bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">SSL</span> 256-Bit Key
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-3.5 opacity-55 hover:opacity-85 transition-opacity">
                  <CreditCard size={18} className="text-gray-500" />
                  <span className="text-[10px] font-extrabold text-gray-400 self-center">VISA • MASTERCARD • UPI • COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
