import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ShieldCheck, Tag, ChevronDown, ChevronUp, X, Truck, Lock, Check, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { TextInput } from '../components/TextInput';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useCustomerStore } from '../store/customerStore';
import { useCouponStore } from '../store/couponStore';
import { useAuthStore } from '../store/authStore';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(4, 'Valid zip code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = () => {
  const { items, getSubtotal, clearCart, appliedCoupon, applyCoupon } = useCartStore();
  const { coupons } = useCouponStore();
  const { user } = useAuthStore();
  const { addOrder } = useOrderStore();
  const { recordCustomerOrder } = useCustomerStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [placedTotal, setPlacedTotal] = useState(0);

  const [couponInput, setCouponInput] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

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

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const handleNextStep1 = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep2 = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      // Save order to store
      const newOrderId = `ORD-${Date.now()}`;
      addOrder({
        customer: `${data.firstName} ${data.lastName}`,
        email: data.email,
        userId: user?.uid,
        total: total,
        status: 'Processing',
        itemsCount: items.reduce((acc, it) => acc + it.quantity, 0),
        items: items.map(it => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image
        })),
        billingInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          phone: data.phone
        }
      });

      // Update customer record
      recordCustomerOrder(data.email, total);
      setPlacedOrderId(newOrderId);
      setPlacedTotal(total);
      clearCart();
      setOrderPlaced(true);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-6 sm:p-10 max-w-lg w-full text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-lg shadow-emerald-200"
          >
            <Check size={36} className="text-white stroke-[2.5] sm:w-11 sm:h-11" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">Order Confirmed! 🎉</h1>
            <p className="text-gray-500 text-xs sm:text-sm mb-5 sm:mb-6 font-medium">Your order has been placed successfully and is now being processed.</p>

            {/* Order Details Card */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 text-left space-y-2.5 sm:space-y-3 border border-gray-100">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Order ID</span>
                <span className="text-xs sm:text-sm font-black text-sapphire font-mono truncate">{placedOrderId}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-2.5 sm:pt-3">
                <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Amount Paid</span>
                <span className="text-lg sm:text-xl font-black text-gray-900 shrink-0">${placedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-2.5 sm:pt-3">
                <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Status</span>
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full border border-amber-100 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Processing
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-2.5 sm:pt-3 gap-2">
                <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest shrink-0">Delivery</span>
                <span className="flex items-center justify-end gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-600 truncate">
                  <Truck size={14} className="shrink-0" /> <span className="truncate">Est. 3–5 Business Days</span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={() => navigate('/products')}
                className="flex-1 flex items-center justify-center gap-2 bg-sapphire hover:bg-deep-navy text-white font-bold py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-sapphire/20 cursor-pointer text-sm sm:text-base"
              >
                <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" /> Continue Shopping
              </button>
              <button
                onClick={() => navigate('/profile', { state: { tab: 'orders' } })}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-sm sm:text-base"
              >
                <Package size={16} className="sm:w-[18px] sm:h-[18px]" /> Track Order <ArrowRight size={14} className="sm:w-[15px] sm:h-[15px]" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-sapphire text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-sapphire/20 hover:bg-deep-navy transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <ArrowRight size={18} /> Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8 sm:mb-10 text-center">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center w-full max-w-lg">
            <div className={`flex flex-col items-center gap-2 flex-1 ${step >= 1 ? 'text-sapphire' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-sapphire text-white shadow-md shadow-sapphire/20' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Shipping</span>
            </div>
            <div className={`h-1 w-12 sm:w-24 rounded-full transition-colors ${step >= 2 ? 'bg-sapphire' : 'bg-gray-200'}`} />
            <div className={`flex flex-col items-center gap-2 flex-1 ${step >= 2 ? 'text-sapphire' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-sapphire text-white shadow-md shadow-sapphire/20' : 'bg-gray-200 text-gray-500'}`}>2</div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Summary</span>
            </div>
            <div className={`h-1 w-12 sm:w-24 rounded-full transition-colors ${step >= 3 ? 'bg-sapphire' : 'bg-gray-200'}`} />
            <div className={`flex flex-col items-center gap-2 flex-1 ${step >= 3 ? 'text-sapphire' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 3 ? 'bg-sapphire text-white shadow-md shadow-sapphire/20' : 'bg-gray-200 text-gray-500'}`}>3</div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Payment</span>
            </div>
          </div>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/30 p-4 sm:p-8 border border-gray-100/80">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6">1. Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="First Name" {...register('firstName')} error={errors.firstName?.message} />
                <TextInput label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
              </div>
              <TextInput label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
              <TextInput label="Street Address" {...register('address')} error={errors.address?.message} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextInput label="City" {...register('city')} error={errors.city?.message} />
                <TextInput label="State / Province" {...register('state')} error={errors.state?.message} />
                <TextInput label="Zip / Postal Code" {...register('zipCode')} error={errors.zipCode?.message} />
              </div>
              <TextInput label="Phone Number" type="tel" {...register('phone')} error={errors.phone?.message} />
              
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100 flex justify-end">
                <button type="button" onClick={handleNextStep1} className="w-full sm:w-auto bg-sapphire hover:bg-deep-navy text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-sapphire/20 cursor-pointer">
                  Next: Review Order <ArrowRight size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Order Summary */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/30 p-4 sm:p-8 border border-gray-100/80">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center justify-between">
                <span>2. Order Summary</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </h2>
              
              {/* Product items list */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center justify-between p-2.5 sm:p-3 border border-gray-100 rounded-xl sm:rounded-2xl bg-gray-50/50">
                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-xl border border-gray-100 shrink-0 overflow-hidden shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1 -right-1 bg-slate-600 text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="overflow-hidden min-w-0">
                        <span className="text-gray-900 font-bold block truncate text-xs sm:text-sm">{item.name}</span>
                        {item.color && <span className="text-[10px] sm:text-xs text-gray-500 block mt-0.5 sm:mt-1 truncate">Color: {item.color}</span>}
                      </div>
                    </div>
                    <span className="text-gray-900 font-black text-xs sm:text-sm shrink-0 pl-2">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Free Shipping Progress Tracker */}
              <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-br from-blue-50/70 to-indigo-50/30 rounded-xl sm:rounded-2xl border border-blue-100/40 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5 sm:gap-2">
                    <Truck size={16} className="text-sapphire animate-pulse sm:w-[18px] sm:h-[18px]" />
                    {subtotal >= 100 
                      ? "Free Shipping!" 
                      : <span className="truncate max-w-[150px] sm:max-w-none">Spend ${Math.max(0, 100 - subtotal).toFixed(2)} more</span>}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-sapphire">{Math.min(100, Math.round((subtotal / 100) * 100))}%</span>
                </div>
                
                <div className="w-full bg-slate-200/80 h-2 sm:h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sapphire to-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Promo Code section */}
              <div className="mb-8 border-b border-gray-100 pb-8">
                <button 
                  type="button"
                  onClick={() => setShowPromoInput(!showPromoInput)}
                  className="flex justify-between items-center w-full text-sm font-bold text-gray-700 hover:text-sapphire transition-colors cursor-pointer outline-none"
                >
                  <span className="flex items-center gap-2">
                    <Tag size={18} className="text-gray-400" />
                    {appliedCoupon ? 'Change Promo Code' : 'Have a Promo Code?'}
                  </span>
                  {showPromoInput ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {showPromoInput && (
                  <div className="mt-4 space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter coupon code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        className="flex-1 px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm outline-none focus:border-sapphire/50 focus:bg-white focus:ring-4 focus:ring-sapphire/5 transition-all font-medium"
                      />
                      <button 
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-6 py-3 bg-sapphire hover:bg-deep-navy text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-sapphire/10 active:scale-95"
                      >
                        Apply
                      </button>
                    </div>
                    
                    {couponError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {couponError}
                      </div>
                    )}
                    {couponSuccess && (
                      <div className="p-3 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {couponSuccess}
                      </div>
                    )}

                    {/* Active Promo Suggestions */}
                    {activeCoupons.length > 0 && (
                      <div className="pt-2 font-sans">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">Available Coupons</p>
                        <div className="flex flex-wrap gap-2">
                          {activeCoupons.map((c) => (
                            <button 
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setCouponInput(c.code);
                                applyCoupon(c);
                                setCouponSuccess(`Coupon "${c.code}" applied successfully!`);
                                setCouponError(null);
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                appliedCoupon?.code === c.code 
                                  ? 'bg-blue-50/80 border-sapphire text-sapphire shadow-sm'
                                  : 'bg-gray-50/60 border-gray-100 text-gray-600 hover:border-sapphire/40 hover:bg-blue-50/20 hover:text-sapphire'
                              }`}
                            >
                              {c.code}
                              <span className="block text-[10px] font-medium text-gray-400 mt-1">
                                {c.type === 'Percentage' ? `${c.value}% Off` : c.type === 'Fixed Amount' ? `$${c.value} Off` : 'Free Shipping'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Display currently applied coupon details */}
                {appliedCoupon && (
                  <div className="mt-4 p-4 bg-blue-50/40 rounded-xl border border-blue-100/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sapphire/10 text-sapphire rounded-lg">
                        <Tag size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-800">{appliedCoupon.code}</p>
                        <p className="text-xs text-gray-500 font-medium">
                          {appliedCoupon.type === 'Percentage' ? `${appliedCoupon.value}% discount applied` : appliedCoupon.type === 'Fixed Amount' ? `$${appliedCoupon.value} discount applied` : 'Free shipping applied'}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleRemoveCoupon} 
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      title="Remove coupon"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {minOrderError && appliedCoupon && (
                  <div className="mt-3 p-3 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold border border-amber-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Requires min. order of ${appliedCoupon.minOrder.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && !minOrderError && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium bg-emerald-50/50 p-2 rounded-lg -mx-2">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">Free</span>
                  ) : (
                    <span className="font-bold text-gray-900">${shipping.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <button type="button" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-gray-500 font-bold hover:text-sapphire px-6 py-2.5 sm:py-3 transition-colors cursor-pointer text-sm sm:text-base">
                  Back to Shipping
                </button>
                <button type="button" onClick={handleNextStep2} className="w-full sm:w-auto bg-sapphire hover:bg-deep-navy text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-sapphire/20 cursor-pointer">
                  Next: Payment <ArrowRight size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payment Method */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/30 p-4 sm:p-8 border border-gray-100/80">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <span>3. Payment Method</span>
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium flex items-center gap-1 w-fit">
                  <Lock size={12} className="text-sapphire" /> 256-Bit Encrypted
                </span>
              </h2>
              
              {/* Advanced Mode Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Razorpay Option */}
                <div 
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    paymentMethod === 'RAZORPAY' 
                      ? 'border-sapphire bg-gradient-to-br from-blue-50/50 to-indigo-50/10 shadow-md shadow-sapphire/5' 
                      : 'border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-colors ${
                        paymentMethod === 'RAZORPAY' ? 'bg-sapphire text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-gray-900 block">Instant Payment</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Cards, UPI, NetBanking</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      paymentMethod === 'RAZORPAY' ? 'border-sapphire bg-sapphire' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'RAZORPAY' && <Check size={12} className="text-white font-bold" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Pay instantly using secure checkout. Supports major Credit/Debit Cards, UPI IDs (GPay, PhonePe), and NetBanking.
                  </p>
                </div>

                {/* Cash on Delivery Option */}
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    paymentMethod === 'COD' 
                      ? 'border-emerald-600 bg-gradient-to-br from-emerald-50/40 to-green-50/10 shadow-md shadow-emerald-600/5' 
                      : 'border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-colors ${
                        paymentMethod === 'COD' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Banknote size={20} />
                      </div>
                      <div>
                        <span className="font-extrabold text-sm text-gray-900 block">Cash on Delivery</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Pay at your Doorstep</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      paymentMethod === 'COD' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'COD' && <Check size={12} className="text-white font-bold" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Pay with cash or scan a UPI QR code at your doorstep upon receiving the package. Safe and hassle-free choice.
                  </p>
                </div>
              </div>

              {/* Sub-panel details with high-end micro-layouts */}
              {paymentMethod === 'RAZORPAY' ? (
                <div className="p-4 sm:p-5 bg-slate-50/80 rounded-xl sm:rounded-2xl border border-slate-100 space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 sm:pb-3">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700">Preferred partners:</span>
                    <div className="flex gap-1.5 sm:gap-2">
                      <span className="text-[8px] sm:text-[9px] font-black text-slate-400 border border-slate-200 px-1 sm:px-1.5 py-0.5 rounded bg-white">VISA</span>
                      <span className="text-[8px] sm:text-[9px] font-black text-slate-400 border border-slate-200 px-1 sm:px-1.5 py-0.5 rounded bg-white">MC</span>
                      <span className="text-[8px] sm:text-[9px] font-black text-slate-400 border border-slate-200 px-1 sm:px-1.5 py-0.5 rounded bg-white">UPI</span>
                    </div>
                  </div>
                  
                  {/* Simulated card preview element for wow factor */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-lg border border-slate-700 w-full max-w-[280px] sm:max-w-[340px] mx-auto">
                    <div className="absolute right-0 top-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/5 rounded-full blur-xl -mr-8 -mt-8 sm:-mr-10 sm:-mt-10" />
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="w-8 sm:w-10 h-6 sm:h-8 bg-amber-500/20 rounded sm:rounded-md border border-amber-500/30 flex items-center justify-center">
                        <div className="w-5 sm:w-6 h-3 sm:h-4 bg-amber-400/40 rounded-[2px] sm:rounded-sm" />
                      </div>
                      <span className="text-[10px] sm:text-sm font-bold tracking-wider italic text-slate-300">SECURE GATEWAY</span>
                    </div>
                    
                    <div className="mb-4 sm:mb-6">
                      <p className="text-slate-400 text-[8px] sm:text-[9px] font-mono uppercase tracking-widest mb-1 sm:mb-1.5">Card Number</p>
                      <p className="font-mono text-sm sm:text-base tracking-widest text-slate-100">••••  ••••  ••••  ••••</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-slate-400 text-[8px] sm:text-[9px] font-mono uppercase tracking-widest mb-1 sm:mb-1.5">Card Holder</p>
                        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-slate-200">YOUR NAME</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[8px] sm:text-[9px] font-mono uppercase tracking-widest mb-1 sm:mb-1.5">Expires</p>
                        <p className="font-mono text-[10px] sm:text-xs text-slate-200">MM/YY</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[10px] sm:text-xs text-slate-500 text-center font-medium leading-relaxed max-w-sm mx-auto">
                    Upon clicking "Place Order", a secure pop-up window will initialize to process the transaction.
                  </p>
                </div>
              ) : (
                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-700 font-extrabold text-sm bg-emerald-50 p-4 rounded-xl border border-emerald-100/50">
                    <Check size={18} className="shrink-0" />
                    <span>Cash on Delivery Active</span>
                  </div>
                  <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside pl-1 font-medium font-sans">
                    <li>Please ensure someone is available at the address to receive and pay for the order.</li>
                    <li>Contactless payments via UPI QR scanning are available with the delivery agent.</li>
                    <li>No additional handling or service fee is charged for COD orders.</li>
                  </ul>
                </div>
              )}

              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100">
                <div className="flex justify-between items-baseline mb-6 sm:mb-8 bg-blue-50/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-blue-100/50">
                  <span className="text-base sm:text-lg font-extrabold text-gray-900">Total to Pay</span>
                  <span className="text-2xl sm:text-3xl font-black text-sapphire">${total.toFixed(2)}</span>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4">
                  <button type="button" onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-gray-500 font-bold hover:text-sapphire px-6 py-2.5 sm:py-3 transition-colors cursor-pointer text-sm sm:text-base">
                    Back to Summary
                  </button>
                  <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-gradient-to-r from-sapphire to-blue-600 text-white px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl font-extrabold hover:shadow-lg hover:shadow-sapphire/25 hover:from-deep-navy hover:to-sapphire transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed text-base sm:text-lg">
                    {isSubmitting ? 'Processing...' : 'Place Order'} <ShieldCheck size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Safe Checkout Badges */}
                <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-400">
                  <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
                    <ShieldCheck size={16} className="text-sapphire" /> Secure Checkout
                  </div>
                  <div className="hidden sm:block h-4 w-[1px] bg-gray-200" />
                  <div className="flex items-center gap-1 text-xs font-semibold shrink-0">
                    <span className="text-[10px] font-black tracking-wider uppercase bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">SSL</span> 256-Bit Key
                  </div>
                  <div className="hidden sm:block h-4 w-[1px] bg-gray-200" />
                  <div className="flex gap-2">
                    <CreditCard size={18} />
                    <span className="text-[10px] font-extrabold self-center">VISA • MC • UPI</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </form>
      </div>
    </div>
  );
};

export default Checkout;
