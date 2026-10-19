import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Trash2, MapPin, Bell, Mail, Lock, CreditCard, Plus, Camera, X, User as UserIcon, Shield, CheckCircle2, Calendar, DollarSign, FileText, Check, Truck, Moon, Filter, ShoppingCart, Star, ChevronRight, CheckCircle, Package, Headset, Globe, AlertTriangle, Download, ShieldCheck, Navigation, ChevronDown, Edit3, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { useProfileStore } from '../store/profileStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCustomerStore } from '../store/customerStore';
import { useNotificationStore } from '../store/notificationStore';
import { useOrderStore, type Order } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { auth } from '../firebase/config';
import { PhoneInputField } from '../components/PhoneInputField';

type TabType = 'orders' | 'profile' | 'settings';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

const CARD_THEMES = [
  { id: 'sapphire', name: 'Royal Sapphire', gradient: 'from-[#0b1f3f] via-[#143d79] to-[#0a1832]', border: 'border-blue-400/40', accent: '#38bdf8', circle: 'bg-blue-600' },
  { id: 'obsidian', name: 'Obsidian Black', gradient: 'from-[#0f172a] via-[#1e293b] to-[#090d16]', border: 'border-white/20', accent: '#94a3b8', circle: 'bg-slate-800' },
  { id: 'emerald', name: 'Emerald Titanium', gradient: 'from-[#042f2e] via-[#065f46] to-[#022c22]', border: 'border-emerald-400/40', accent: '#34d399', circle: 'bg-emerald-700' },
  { id: 'violet', name: 'Cyber Violet', gradient: 'from-[#2e1065] via-[#581c87] to-[#1e1b4b]', border: 'border-purple-400/40', accent: '#c084fc', circle: 'bg-purple-700' },
  { id: 'gold', name: 'Imperial Gold', gradient: 'from-[#451a03] via-[#78350f] to-[#291002]', border: 'border-amber-400/40', accent: '#fbbf24', circle: 'bg-amber-600' }
] as const;

type CardThemeId = typeof CARD_THEMES[number]['id'];

const detectCardBrand = (number: string): 'VISA' | 'MASTERCARD' | 'AMEX' | 'RUPAY' => {
  const clean = number.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
  if (/^3[47]/.test(clean)) return 'AMEX';
  if (/^(60|65|81|82|508)/.test(clean)) return 'RUPAY';
  return 'VISA';
};

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 2) {
    let month = parseInt(digits.slice(0, 2), 10);
    if (month > 12) month = 12;
    if (month === 0) month = 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const year = digits.slice(2);
    return `${monthStr}${year ? '/' + year : ''}`;
  }
  return digits;
};

const renderBrandLogo = (brand: string) => {
  switch (brand) {
    case 'MASTERCARD':
      return (
        <div className="flex items-center -space-x-2 drop-shadow-sm">
          <div className="w-5 h-5 rounded-full bg-[#eb001b]" />
          <div className="w-5 h-5 rounded-full bg-[#f79e1b] opacity-90" />
        </div>
      );
    case 'AMEX':
      return (
        <div className="bg-[#002663] text-white font-black text-[9px] px-1.5 py-0.5 rounded tracking-tighter border border-white/25">
          AMEX
        </div>
      );
    case 'RUPAY':
      return (
        <div className="flex items-center gap-0.5 bg-white text-gray-900 font-black text-[9px] px-1.5 py-0.5 rounded tracking-tight shadow-xs">
          <span className="text-[#005a9c]">Ru</span><span className="text-[#f47920]">Pay</span>
        </div>
      );
    case 'VISA':
    default:
      return (
        <span className="text-base font-black italic tracking-wider text-white drop-shadow-md">
          VISA
        </span>
      );
  }
};

const Profile: React.FC = () => {
  const { user, registeredUsers, updateUser } = useAuthStore();
  const dbUser = registeredUsers.find(u => u.uid === user?.uid);
  const profile = useProfileStore();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const addItemToCart = useCartStore(state => state.addItem);
  const orders = useOrderStore(state => state.orders);
  const addReview = useProductStore(state => state.addReview);

  const userOrders = orders.filter(order => order.userId === user?.uid || order.email === user?.email || (dbUser && order.email === dbUser.email));

  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>((location.state?.tab as TabType) || 'profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [isSaving, setIsSaving] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All Orders');

  // Modals state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Modal data state
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    street: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: '',
    addressType: 'Home' as 'Home' | 'Work',
    zip: '',
    label: 'Home'
  });
  const [newCard, setNewCard] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    brand: 'VISA' as 'VISA' | 'MASTERCARD' | 'AMEX' | 'RUPAY',
    theme: 'sapphire' as CardThemeId,
    isDefault: false
  });
  const [showCvv, setShowCvv] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [reviewModalData, setReviewModalData] = useState<{ show: boolean, item: any, orderDate: string, orderId: string } | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [recommendProduct, setRecommendProduct] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setNewAddress({
      name: formData.fullName || '',
      phone: formData.phone || '',
      pincode: '',
      locality: '',
      street: '',
      city: '',
      state: '',
      landmark: '',
      alternatePhone: '',
      addressType: 'Home',
      zip: '',
      label: 'Home'
    });
    setShowAddressModal(true);
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr.id || null);
    setNewAddress({
      name: addr.name || formData.fullName || '',
      phone: addr.phone || formData.phone || '',
      pincode: addr.pincode || addr.zip || '',
      locality: addr.locality || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      landmark: addr.landmark || '',
      alternatePhone: addr.alternatePhone || '',
      addressType: (addr.addressType as 'Home' | 'Work') || 'Home',
      zip: addr.pincode || addr.zip || '',
      label: addr.label || addr.addressType || 'Home'
    });
    setShowAddressModal(true);
  };

  const handleRemoveAddress = (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to remove this address?')) {
      profile.removeAddress(id);
      showToast('Address removed successfully');
    }
  };

  const handleSetDefaultAddress = (id?: string) => {
    if (!id) return;
    profile.setDefaultAddress(id);
    showToast('Default shipping address updated');
  };

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab as TabType);
    }
  }, [location.state?.tab]);

  // Derive initial first name, second name (last name), and gender
  const initialDisplayName = dbUser?.displayName || profile.fullName || user?.displayName || 'User';
  const nameParts = initialDisplayName.trim().split(/\s+/);
  const initialFirstName = dbUser?.firstName || profile.firstName || (nameParts.length > 0 ? nameParts[0] : '');
  const initialLastName = dbUser?.lastName || profile.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
  const initialGender = dbUser?.gender || profile.gender || 'male';

  // Form State for Settings
  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    fullName: initialDisplayName,
    gender: initialGender,
    avatar: dbUser?.avatar || profile.avatar || null,
    phone: dbUser?.phone || profile.phone || '',
    shippingAddress: dbUser?.shippingAddress || profile.shippingAddress,
    billingAddress: dbUser?.billingAddress || profile.billingAddress,
    preferences: profile.preferences,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size cannot exceed 10MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: result }));
        updateProfile({ avatar: result });
        if (user) {
          updateUser(user.uid, { avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    const computedFullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() || formData.fullName || 'User';

    updateProfile({
      ...formData,
      fullName: computedFullName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
    });

    if (user) {
      updateUser(user.uid, {
        displayName: computedFullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        phone: formData.phone,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress,
        avatar: formData.avatar
      });
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Profile & Settings saved successfully!', 'success');
    }, 800);
  };

  const handleConfirmDeleteAccount = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    try {
      const userUid = user.uid;
      const userEmail = user.email || '';

      // 1. Delete from Firebase Auth if current user exists
      try {
        if (auth?.currentUser && (auth.currentUser.uid === userUid || auth.currentUser.email === userEmail)) {
          await auth.currentUser.delete();
        }
      } catch (fbErr) {
        console.warn('Firebase user deletion bypassed or requires reauth:', fbErr);
      }

      // 2. Delete user from auth store
      useAuthStore.getState().deleteUser(userUid);

      // 3. Delete user customer record
      useCustomerStore.getState().deleteCustomer(userUid);
      if (userEmail) {
        useCustomerStore.getState().deleteCustomer(userEmail);
      }

      // 4. Reset profile store (wipe addresses, cards, preferences)
      useProfileStore.getState().resetProfile();

      // 5. Clear cart and wishlist
      useCartStore.getState().clearCart();
      useWishlistStore.getState().clearWishlist();

      // 6. Sign out session
      useAuthStore.getState().logout();

      setShowDeleteModal(false);
      setIsDeletingAccount(false);

      // Redirect to home with notification
      navigate('/', { replace: true });
      useNotificationStore.getState().addNotification({
        category: 'account',
        title: 'Account Deleted 🗑️',
        message: 'Your account and personal data have been permanently removed.',
        link: '/',
      });
    } catch (err) {
      console.error('Account deletion error:', err);
      setIsDeletingAccount(false);
      showToast('Failed to delete account. Please try again.', 'error');
    }
  };


  if (!user) {
    navigate('/login');
    return null;
  }


  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sapphire shadow-sm border border-gray-100">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">My Orders</h2>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">Track, return or buy again from your orders</p>
                </div>
              </div>
              <div className="relative">
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 pl-10 pr-10 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-sm outline-none focus:border-sapphire focus:ring-2 focus:ring-sapphire/20"
                >
                  <option value="All Orders">All Orders</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Shipped">Shipped</option>
                </select>
                <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <ChevronRight size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none rotate-90" />
              </div>
            </div>

            {/* Orders List */}
            {userOrders.filter(order => orderFilter === 'All Orders' || order.status === orderFilter).length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-sapphire mb-4">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-500 max-w-md">You haven't placed any orders yet, or no orders match your current filter.</p>
              </div>
            ) : userOrders.filter(order => orderFilter === 'All Orders' || order.status === orderFilter).map(order => (
              <div
                key={order.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Top Section */}
                <div className="bg-gray-50/50 px-6 py-5 flex flex-wrap items-center justify-between border-b border-gray-100 gap-4">
                  <div className="flex flex-wrap gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-sapphire"><Calendar size={18} /></div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Order Placed</p>
                        <p className="text-sm font-bold text-gray-900">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600"><DollarSign size={18} /></div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Paid</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><FileText size={18} /></div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Order #</p>
                        <p className="text-sm font-bold text-sapphire">{order.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/invoice/${order.id}`, { state: { order } });
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-sapphire hover:text-deep-navy transition-colors bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50"
                  >
                    <FileText size={16} /> View Invoice <ChevronRight size={16} />
                  </button>
                </div>

                {/* Bottom Section */}
                <div className="p-6">
                  <div className={`border-l-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm ${order.status === 'Delivered' ? 'border-l-green-500' : 'border-l-sapphire'}`}>
                    {/* Status Header */}
                    <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-sapphire'}`}>
                          {order.status === 'Delivered' ? <Check size={16} strokeWidth={3} /> : <Moon size={16} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {order.status === 'Delivered' ? 'Delivered on ' + order.date : 'Arriving soon'}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">
                            {order.status === 'Delivered' ? 'Your package has been delivered successfully.' : 'Your items are on the way.'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-sapphire'}`}>
                        {order.status === 'Delivered' ? <CheckCircle size={12} /> : <Truck size={12} />}
                        {order.status}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="divide-y divide-gray-50 bg-gray-50/30">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-5 flex flex-col xl:flex-row gap-6 xl:items-center">
                          <div className="flex gap-4 items-center flex-1">
                            <div className="w-20 h-20 rounded-xl bg-white overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{item.name}</h4>
                              <p className="text-sm font-semibold text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500 mt-0.5 font-medium">Qty: 1</p>
                            </div>
                          </div>

                          {/* Progress Tracker (Only for Shipped) */}
                          {order.status === 'Shipped' && (
                            <div className="flex-1 w-full max-w-xs mx-auto xl:mx-0 py-4 xl:py-0">
                              <div className="flex justify-between relative">
                                <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                                <div className="absolute top-2 left-0 w-2/3 h-0.5 bg-sapphire -z-10"></div>

                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-4 h-4 rounded-full bg-sapphire text-white flex items-center justify-center"><Check size={10} strokeWidth={4} /></div>
                                  <span className="text-[9px] text-gray-500 font-bold mt-1">Confirmed</span>
                                  <span className="text-[9px] text-gray-400">Jul 02</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-4 h-4 rounded-full bg-sapphire text-white flex items-center justify-center"><Check size={10} strokeWidth={4} /></div>
                                  <span className="text-[9px] text-gray-500 font-bold mt-1">Shipped</span>
                                  <span className="text-[9px] text-gray-400">Jul 03</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-4 h-4 rounded-full bg-sapphire text-white flex items-center justify-center"><Truck size={10} /></div>
                                  <span className="text-[9px] text-sapphire font-bold mt-1">In Transit</span>
                                  <span className="text-[9px] text-gray-400">Jul 04</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-200 box-border"></div>
                                  <span className="text-[9px] text-gray-400 font-bold mt-1">Delivered</span>
                                  <span className="text-[9px] text-gray-400">Jul 06</span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col gap-2 shrink-0 md:w-40 xl:ml-auto">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addItemToCart({ id: item.name, name: item.name, price: item.price, quantity: 1, image: item.image });
                                showToast(`${item.name} added to cart!`, 'success');
                              }}
                              className="w-full flex items-center justify-center gap-2 bg-sapphire text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-deep-navy transition-colors cursor-pointer border-none shadow-sm shadow-sapphire/20">
                              <ShoppingCart size={14} /> Buy Again
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewModalData({ show: true, item, orderDate: order.date, orderId: order.id });
                              }}
                              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                              <Star size={14} /> Write a Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Footer Trust Badges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 mt-8 border-t border-gray-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-sapphire flex items-center justify-center"><Shield size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Secure Shopping</p>
                  <p className="text-[10px] text-gray-500 font-medium">Your data is 100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-sapphire flex items-center justify-center"><Package size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Easy Returns</p>
                  <p className="text-[10px] text-gray-500 font-medium">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-sapphire flex items-center justify-center"><Headset size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-900">24/7 Support</p>
                  <p className="text-[10px] text-gray-500 font-medium">We're here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-sapphire flex items-center justify-center"><Lock size={18} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Safe Payments</p>
                  <p className="text-[10px] text-gray-500 font-medium">Multiple secure options</p>
                </div>
              </div>
            </div>

          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.08, delayChildren: 0.05 }
              },
              exit: { opacity: 0, y: -15 }
            }}
            className="space-y-8"
          >
            {/* Avatar & Cover Settings */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10" />
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                  <Camera size={20} className="stroke-[2.5]" />
                </div>
                Profile Picture
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group/avatar cursor-pointer">
                  {formData.avatar ? (
                    <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl shadow-sapphire/15 border-4 border-white mx-auto transform transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:shadow-sapphire/25 bg-white">
                      <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-28 h-28 bg-gradient-to-tr from-sapphire to-blue-400 text-white rounded-full flex items-center justify-center text-5xl font-black shadow-xl shadow-sapphire/15 border-4 border-white mx-auto transform transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:shadow-sapphire/25">
                      {(formData.fullName || 'User').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-white border border-gray-100 text-gray-700 p-2.5 rounded-full shadow-lg hover:text-sapphire hover:border-sapphire hover:scale-110 transition-all flex items-center justify-center cursor-pointer font-bold"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="text-center sm:text-left space-y-3">
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/jpeg, image/png, image/gif"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-sapphire text-white px-5 py-2.5 rounded-xl font-bold hover:bg-deep-navy hover:shadow-lg hover:shadow-sapphire/15 transition-all text-xs cursor-pointer"
                    >
                      Upload New
                    </button>
                    {formData.avatar && (
                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, avatar: null }));
                          updateProfile({ avatar: null });
                          if (user) updateUser(user.uid, { avatar: null });
                        }}
                        className="bg-gray-50 text-gray-600 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors text-xs cursor-pointer border border-gray-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Accepts JPEG, PNG, or GIF. Maximum file size is 10MB.</p>
                </div>
              </div>
            </motion.div>

            {/* Account Details - Advanced Luxury Model */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-xl shadow-slate-200/40 relative z-20 overflow-hidden group hover:shadow-2xl hover:shadow-sapphire/5 transition-all duration-300"
            >
              {/* Luxury Ambient Mesh Highlights */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 via-sapphire/5 to-transparent rounded-bl-full pointer-events-none -z-10" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-gradient-to-tr from-emerald-500/5 via-blue-500/5 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
              <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-sapphire/25 to-transparent pointer-events-none" />

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sapphire/15 via-blue-500/10 to-indigo-500/5 text-sapphire border border-sapphire/20 flex items-center justify-center shadow-inner shrink-0">
                    <UserIcon size={22} className="stroke-[2.3]" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      Account Details
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Personal credentials & verified profile identity
                    </p>
                  </div>
                </div>

              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* First Name Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      First Name
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">Legal Name</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-100 group-focus-within:bg-blue-50 text-slate-400 group-focus-within:text-sapphire flex items-center justify-center transition-all duration-200 pointer-events-none">
                      <UserIcon size={15} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. John"
                      value={formData.firstName}
                      onChange={(e) => {
                        const updatedFirst = e.target.value;
                        const updatedFull = [updatedFirst, formData.lastName].filter(Boolean).join(' ').trim();
                        setFormData({ ...formData, firstName: updatedFirst, fullName: updatedFull });
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50/90 border border-slate-200/90 rounded-2xl focus:bg-white focus:ring-4 focus:ring-sapphire/10 focus:border-sapphire outline-none transition-all duration-200 text-slate-900 font-bold text-sm placeholder:text-slate-400 placeholder:font-normal shadow-2xs"
                    />
                  </div>
                </div>

                {/* Second Name (Last Name) Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      Second Name (Last Name)
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">Surname</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-100 group-focus-within:bg-blue-50 text-slate-400 group-focus-within:text-sapphire flex items-center justify-center transition-all duration-200 pointer-events-none">
                      <UserIcon size={15} />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Doe"
                      value={formData.lastName}
                      onChange={(e) => {
                        const updatedLast = e.target.value;
                        const updatedFull = [formData.firstName, updatedLast].filter(Boolean).join(' ').trim();
                        setFormData({ ...formData, lastName: updatedLast, fullName: updatedFull });
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50/70 hover:bg-slate-50/90 border border-slate-200/90 rounded-2xl focus:bg-white focus:ring-4 focus:ring-sapphire/10 focus:border-sapphire outline-none transition-all duration-200 text-slate-900 font-bold text-sm placeholder:text-slate-400 placeholder:font-normal shadow-2xs"
                    />
                  </div>
                </div>

                {/* Email Address Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      Email Address
                    </label>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Verified Account
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center pointer-events-none">
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      defaultValue={user.email || ''}
                      readOnly
                      className="w-full pl-12 pr-20 py-3 bg-slate-100/60 border border-slate-200/70 rounded-2xl text-slate-600 font-bold text-sm outline-none cursor-not-allowed select-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200/60 text-slate-500 text-[10px] font-extrabold uppercase tracking-wide">
                      <Lock size={10} /> Locked
                    </div>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      Phone Number
                    </label>
                    <span className="text-[10px] font-bold text-blue-600">SMS Notifications</span>
                  </div>
                  <div>
                    <PhoneInputField
                      value={formData.phone}
                      onChange={(newPhone) => setFormData({ ...formData, phone: newPhone })}
                      placement="top"
                      label=""
                    />
                  </div>
                </div>

                {/* Gender - Advanced Compact Segmented Control */}
                <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                      Gender Identity
                    </label>
                    <span className="text-[10px] font-bold text-slate-400">Personalized Sizing & Catalog</span>
                  </div>
                  <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 gap-1.5 shadow-2xs">
                    {[
                      { id: 'male', label: 'Male' },
                      { id: 'female', label: 'Female' },
                      { id: 'other', label: 'Other' },
                    ].map((g) => {
                      const isSelected = (formData.gender || 'male').toLowerCase() === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g.id })}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-gradient-to-r from-sapphire to-blue-600 text-white shadow-md shadow-sapphire/25 scale-[1.02]'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          <span>{g.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Bottom Security Footer Strip */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                  <span>Account profile data encrypted & synced with session credentials</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                  <Check size={12} className="text-emerald-500" />
                  <span>Realtime State Ready</span>
                </div>
              </div>
            </motion.div>

            {/* Split Vault Box: Left Side Address Book, Right Side Payment Methods */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-300 rounded-3xl p-5 sm:p-7 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* LEFT SIDE: Address Book */}
                <div className="space-y-4">
                  {/* Left Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-sapphire rounded-xl shadow-xs">
                        <MapPin size={18} className="stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-gray-900">Address Book</h4>
                        <p className="text-[11px] text-gray-400 font-medium">Delivery & billing addresses</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddAddress}
                      className="bg-white hover:bg-gray-50 text-black border border-gray-200 hover:border-gray-300 font-extrabold text-xs transition-all duration-200 flex items-center gap-1 px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer"
                    >
                      <Plus size={14} className="stroke-[2.5]" /> Add Address
                    </button>
                  </div>

                  {/* Left Content: Compact Address List */}
                  <div className="space-y-3">
                    {profile.savedAddresses && profile.savedAddresses.length > 0 ? (
                      profile.savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-2xl p-4 transition-all duration-300 relative group ${
                            address.isDefault
                              ? 'border-sapphire/40 bg-gradient-to-b from-blue-50/20 to-white shadow-xs'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="bg-blue-50 text-[#2874f0] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                {address.addressType || address.label || 'Home'}
                              </span>
                              {address.isDefault && (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 border border-emerald-200/60">
                                  <Check size={10} className="stroke-[3]" /> Default
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditAddress(address)}
                                className="text-sapphire hover:text-deep-navy text-xs font-bold transition-colors flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveAddress(address.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors bg-transparent border-none p-0 cursor-pointer"
                                title="Remove Address"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div className="mb-1.5">
                            <h5 className="font-extrabold text-gray-900 text-sm flex items-center gap-2 flex-wrap">
                              <span>{address.name || formData.fullName}</span>
                              {address.phone && (
                                <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                  {address.phone}
                                </span>
                              )}
                            </h5>
                          </div>

                          <p className="text-gray-600 text-xs font-medium leading-relaxed">
                            {address.street}{address.locality ? `, ${address.locality}` : ''}
                          </p>
                          <p className="text-gray-400 text-[11px] font-semibold mt-0.5">
                            {address.city ? `${address.city}, ` : ''}{address.state} {address.pincode ? `- ${address.pincode}` : (address.zip ? `- ${address.zip}` : '')}
                          </p>

                          {!address.isDefault && (
                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="text-[11px] font-bold text-gray-500 hover:text-sapphire transition-colors bg-transparent border-none p-0 cursor-pointer"
                              >
                                Set as Default
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-6 px-4 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-xs font-bold text-gray-700">No addresses saved yet</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Click above to add your first address</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE: Payment Methods */}
                <div className="space-y-4 lg:border-l lg:border-gray-100 lg:pl-8">
                  {/* Right Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-sapphire rounded-xl shadow-xs">
                        <CreditCard size={18} className="stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-gray-900">Payment Methods</h4>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                            <ShieldCheck size={9} /> SSL
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">Encrypted 1-click checkout cards</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNewCard({
                          name: formData.fullName || '',
                          cardNumber: '',
                          expiry: '',
                          cvv: '',
                          brand: 'VISA',
                          theme: 'sapphire',
                          isDefault: profile.savedCards.length === 0
                        });
                        setIsFlipped(false);
                        setShowCardModal(true);
                      }}
                      className="bg-white hover:bg-gray-50 text-black border border-gray-200 hover:border-gray-300 font-extrabold text-xs transition-all duration-200 flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer"
                    >
                      <Plus size={14} className="stroke-[3]" /> Add Card
                    </button>
                  </div>

                  {/* Right Content: Compact Payment Cards */}
                  <div className="space-y-3">
                    {profile.savedCards && profile.savedCards.length > 0 ? (
                      profile.savedCards.map((card) => {
                        const theme = CARD_THEMES.find(t => t.id === card.theme) || CARD_THEMES[0];
                        const brand = (card.brand || 'VISA').toUpperCase();

                        return (
                          <div
                            key={card.id}
                            className={`rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden flex flex-col justify-between shadow-md transition-all duration-300 bg-gradient-to-br ${theme.gradient} border ${theme.border} min-h-[155px]`}
                          >
                            {/* Card Shimmer */}
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

                            {/* Top row */}
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 border border-yellow-100/60 shadow-inner p-0.5 flex flex-col justify-between relative overflow-hidden shrink-0">
                                  <div className="w-full h-[1px] bg-amber-900/30 my-auto" />
                                  <div className="absolute inset-x-1.5 inset-y-0.5 border border-amber-900/25 rounded-xs pointer-events-none" />
                                </div>
                                <svg className="w-3.5 h-3.5 text-white/80 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                  <path d="M8.5 15.5a5 5 0 0 0 0-7" />
                                  <path d="M12 18.5a9 9 0 0 0 0-13" />
                                  <path d="M15.5 21.5a13 13 0 0 0 0-19" />
                                </svg>
                              </div>

                              <div className="flex items-center gap-2">
                                {card.isDefault && (
                                  <span className="bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 backdrop-blur-xs">
                                    <Check size={9} className="stroke-[3]" /> Default
                                  </span>
                                )}
                                <div>{renderBrandLogo(brand)}</div>
                              </div>
                            </div>

                            {/* Card Number */}
                            <div className="my-2 relative z-10">
                              <p className="font-mono text-base sm:text-lg font-bold tracking-widest text-white/95 drop-shadow-sm">
                                •••• •••• •••• {card.cardNumber}
                              </p>
                            </div>

                            {/* Card Footer */}
                            <div className="relative z-10 pt-2 border-t border-white/10 flex items-end justify-between gap-3 text-xs">
                              <div className="space-y-0.5">
                                <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold block">Holder</span>
                                <p className="text-xs font-black tracking-wider text-white uppercase truncate max-w-[120px]">
                                  {card.name || formData.fullName}
                                </p>
                              </div>

                              <div className="space-y-0.5 text-center">
                                <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold block">Expires</span>
                                <p className="text-xs font-mono font-bold text-white">
                                  {card.expiry || '12/28'}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 ml-auto">
                                {!card.isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      profile.setDefaultCard(card.id);
                                      showToast('Default payment card updated!');
                                    }}
                                    className="px-2 py-0.5 rounded bg-white/15 hover:bg-white text-white hover:text-gray-900 text-[10px] font-extrabold transition-all border border-white/20 cursor-pointer backdrop-blur-xs"
                                  >
                                    Set Default
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to remove this card?')) {
                                      profile.removeCard(card.id);
                                      showToast('Payment card removed.');
                                    }
                                  }}
                                  className="p-1 rounded bg-white/10 hover:bg-red-500/80 text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
                                  title="Remove Card"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-6 px-4 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-xs font-bold text-gray-700">No cards saved yet</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Click above to add a credit/debit card</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assurance footer across bottom of the box */}
                <div className="col-span-1 lg:col-span-2 pt-4 mt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-sapphire" /> 256-Bit SSL Encrypted Vault
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock size={14} className="text-emerald-500" /> Bank-Grade AES Tokenization
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-indigo-500" /> Instant 1-Click Vault Checkout
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Save Profile Actions & Delete Account */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4"
            >
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full sm:w-auto px-4 py-3 font-bold transition-colors duration-200 flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 text-base transform hover:-translate-y-0.5 border-none min-w-[220px] ${isSaving
                  ? 'bg-emerald-500 text-white cursor-default hover:-translate-y-0 shadow-lg shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-sapphire to-blue-600 text-white cursor-pointer hover:shadow-xl hover:shadow-sapphire/25 hover:from-deep-navy hover:to-sapphire'
                  }`}
              >
                {isSaving ? (
                  <>
                    <CheckCircle2 size={20} className="animate-bounce" />
                    <span>Saved Changes!</span>
                  </>
                ) : (
                  <span>Save Profile Changes</span>
                )}
              </button>
            </motion.div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.08, delayChildren: 0.05 }
              },
              exit: { opacity: 0, y: -15 }
            }}
            className="space-y-8"
          >

            {/* Notifications & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Preferences */}
              <motion.div
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden"
              >
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                    <Bell size={20} className="stroke-[2.5]" />
                  </div>
                  Notifications
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between cursor-pointer group" onClick={() => setFormData({ ...formData, preferences: { ...formData.preferences, orderUpdates: !formData.preferences.orderUpdates } })}>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-sapphire transition-colors">Order Updates</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">Push updates on your delivery status</p>
                    </div>
                    <div className={`relative inline-block w-11 h-6 rounded-full transition-colors duration-300 ${formData.preferences.orderUpdates ? 'bg-sapphire' : 'bg-gray-200'}`}>
                      <span className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${formData.preferences.orderUpdates ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between cursor-pointer group" onClick={() => setFormData({ ...formData, preferences: { ...formData.preferences, promotions: !formData.preferences.promotions } })}>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm group-hover:text-sapphire transition-colors">Promotions</h4>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">Get early alerts on flash sales & promos</p>
                    </div>
                    <div className={`relative inline-block w-11 h-6 rounded-full transition-colors duration-300 ${formData.preferences.promotions ? 'bg-sapphire' : 'bg-gray-200'}`}>
                      <span className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${formData.preferences.promotions ? 'translate-x-6' : 'translate-x-1'}`}></span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Security */}
              <motion.div
                variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } }}
                className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                      <Shield size={20} className="stroke-[2.5]" />
                    </div>
                    Security
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mb-6">Manage your credentials, active authentication sessions, and sign-in options.</p>
                </div>
                <div className="space-y-3">
                  <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-100 text-gray-700 hover:bg-gray-100 px-6 py-3.5 rounded-xl font-bold transition-all text-sm cursor-pointer hover:shadow-sm">
                    <Lock size={16} /> Change Account Password
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Language & Currency Preferences */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10" />
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                  <Globe size={20} className="stroke-[2.5]" />
                </div>
                Language & Currency Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Display Language</label>
                  <select
                    value={formData.preferences.language || 'English (US)'}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, language: e.target.value } })}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire outline-none transition-all text-gray-900 font-semibold cursor-pointer"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Spanish (ES)">Spanish (ES)</option>
                    <option value="French (FR)">French (FR)</option>
                    <option value="Arabic (AR)">Arabic (AR)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Preferred Currency</label>
                  <select
                    value={formData.preferences.currency || 'USD ($)'}
                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, currency: e.target.value } })}
                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire outline-none transition-all text-gray-900 font-semibold cursor-pointer"
                  >
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                    <option value="AUD ($)">AUD ($) - Australian Dollar</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Two-Factor Authentication (2FA) */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-7 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0 border border-emerald-100">
                  <ShieldCheck size={24} className="stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-gray-900">
                      Two-Factor Authentication (2FA)
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={13} className="text-emerald-600" /> Enabled
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                    Two-Factor Authentication is active and protecting your account. Every sign-in is secured with multi-factor verification for your security.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Privacy & Account Data */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                  <Shield size={20} className="stroke-[2.5]" />
                </div>
                Privacy & Data
              </h3>

              <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">Download My Account Data</h4>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Download a complete JSON export of your personal profile, saved addresses, and order history for your records.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ profile: formData, orders: userOrders }, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `thebatstore_account_data_${user?.uid || 'export'}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    showToast('Account data exported successfully!', 'success');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Download size={15} /> Export JSON Data
                </button>
              </div>

              {/* Delete Account Section */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer transition-colors p-0"
                >
                  <Trash2 size={16} />
                  <span>Delete Account</span>
                </button>
              </div>
            </motion.div>

            {/* Save Actions */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              className="flex justify-end pt-4"
            >
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`px-8 py-4 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 text-base transform hover:-translate-y-0.5 border-none min-w-[220px] ${isSaving
                  ? 'bg-emerald-500 text-white cursor-default hover:-translate-y-0 shadow-lg shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-sapphire to-blue-600 text-white cursor-pointer hover:shadow-xl hover:shadow-sapphire/25 hover:from-deep-navy hover:to-sapphire'
                  }`}
              >
                {isSaving ? (
                  <>
                    <CheckCircle2 size={20} className="animate-pulse" /> Changes Saved!
                  </>
                ) : (
                  <>
                    <Settings size={20} /> Save Settings Changes
                  </>
                )}
              </button>
            </motion.div>

          </motion.div>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO title="My Account" description="Manage your profile, orders, and settings." />

      {/* Cover Photo */}
      <div className="h-64 bg-gradient-to-r from-deep-navy via-sapphire to-blue-400 relative">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-5xl -mt-24 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-sapphire/5 p-8 border border-gray-100">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedOrder.id} • {selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-lg text-gray-900">Items Ordered</h3>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-sapphire'
                    }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="space-y-6">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                      <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">Qty: 1</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-deep-navy">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/invoice/${selectedOrder.id}`, { state: { order: selectedOrder } })}
                  className="w-full bg-sapphire text-white py-4 rounded-xl font-bold text-lg hover:bg-deep-navy transition-colors shadow-lg shadow-sapphire/20"
                >
                  Download Invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }} className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-gray-100 my-8">
              <button
                type="button"
                onClick={() => {
                  setShowAddressModal(false);
                  setEditingAddressId(null);
                }}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors cursor-pointer border-none"
              >
                <X size={18} />
              </button>

              <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-wide mb-4">
                {editingAddressId ? 'Edit Address' : 'Add a New Address'}
              </h3>

              {/* Use My Current Location Button */}
              <button
                type="button"
                onClick={() => {
                  if (!navigator.geolocation) {
                    showToast('Geolocation is not supported by your browser', 'error');
                    return;
                  }
                  setIsLocating(true);
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      try {
                        const { latitude, longitude } = position.coords;
                        // Enforce English language in Nominatim reverse geocode
                        const res = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en-US,en;q=0.9&addressdetails=1`,
                          {
                            headers: {
                              'Accept-Language': 'en-US,en;q=0.9',
                            },
                          }
                        );
                        const data = await res.json();
                        const addr = data.address || {};

                        // Clean any Malayalam Unicode characters ([\u0D00-\u0D7F])
                        const cleanEnglishText = (text: string = ''): string => {
                          return text
                            .replace(/[\u0D00-\u0D7F]+/g, '')
                            .replace(/\s{2,}/g, ' ')
                            .replace(/,\s*,/g, ', ')
                            .replace(/^,\s*|,\s*$/g, '')
                            .trim();
                        };

                        // Fallback transliterations for Kerala regions/districts if OSM native tag is present
                        const keralaEnglishMap: Record<string, string> = {
                          'തിരുവനന്തപുരം': 'Thiruvananthapuram',
                          'കൊല്ലം': 'Kollam',
                          'പത്തനംതിട്ട': 'Pathanamthitta',
                          'ആലപ്പുഴ': 'Alappuzha',
                          'കോട്ടയം': 'Kottayam',
                          'ഇടുക്കി': 'Idukki',
                          'എറണാകുളം': 'Ernakulam',
                          'കൊച്ചി': 'Kochi',
                          'തൃശ്ശൂർ': 'Thrissur',
                          'പാലക്കാട്': 'Palakkad',
                          'മലപ്പുറം': 'Malappuram',
                          'കോഴിക്കോട്': 'Kozhikode',
                          'വയനാട്': 'Wayanad',
                          'കണ്ണൂർ': 'Kannur',
                          'കാസർഗോഡ്': 'Kasaragod',
                          'കാസർകോട്': 'Kasaragod',
                          'കേരളം': 'Kerala',
                          'കേരള': 'Kerala',
                        };

                        const resolveToEnglish = (text: string = ''): string => {
                          let resolved = text;
                          for (const [mal, eng] of Object.entries(keralaEnglishMap)) {
                            if (resolved.includes(mal)) {
                              resolved = resolved.replace(new RegExp(mal, 'g'), eng);
                            }
                          }
                          return cleanEnglishText(resolved);
                        };

                        // 1. Resolve State in English
                        const rawState = addr['state:en'] || addr.state || '';
                        const resolvedState = resolveToEnglish(rawState);
                        const matchedState = INDIAN_STATES.find(s =>
                          s.toLowerCase() === resolvedState.toLowerCase() ||
                          resolvedState.toLowerCase().includes(s.toLowerCase())
                        );
                        const finalState = matchedState || (resolvedState.toLowerCase().includes('kerala') ? 'Kerala' : resolvedState);

                        // 2. Resolve City in English
                        const rawCity = addr['city:en'] || addr.city || addr['town:en'] || addr.town || addr['state_district:en'] || addr.state_district || addr['county:en'] || addr.county || '';
                        const finalCity = resolveToEnglish(rawCity);

                        // 3. Resolve Locality in English
                        const rawLocality = addr['suburb:en'] || addr.suburb || addr['neighbourhood:en'] || addr.neighbourhood || addr['village:en'] || addr.village || addr['road:en'] || addr.road || '';
                        const finalLocality = resolveToEnglish(rawLocality);

                        // 4. Resolve Street in English
                        const road = resolveToEnglish(addr['road:en'] || addr.road || '');
                        const suburb = resolveToEnglish(addr['suburb:en'] || addr.suburb || '');
                        let finalStreet = [road, suburb].filter(Boolean).join(', ');
                        if (!finalStreet && data.display_name) {
                          const englishSegments = data.display_name
                            .split(',')
                            .map((seg: string) => resolveToEnglish(seg))
                            .filter(Boolean);
                          finalStreet = englishSegments.slice(0, 2).join(', ');
                        }

                        const pincode = addr.postcode || '';

                        setNewAddress(prev => ({
                          ...prev,
                          pincode: pincode || prev.pincode,
                          zip: pincode || prev.zip,
                          locality: finalLocality || prev.locality,
                          street: finalStreet || prev.street,
                          city: finalCity || prev.city,
                          state: finalState || prev.state,
                        }));
                        showToast('Current location detected in English!');
                      } catch {
                        showToast('Could not fetch address from coordinates', 'error');
                      } finally {
                        setIsLocating(false);
                      }
                    },
                    () => {
                      setIsLocating(false);
                      showToast('Location permission denied or unavailable', 'error');
                    },
                    { timeout: 10000 }
                  );
                }}
                disabled={isLocating}
                className="bg-[#2874f0] hover:bg-[#1f62d1] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded shadow-xs flex items-center gap-2 cursor-pointer border-none transition-colors mb-5 disabled:opacity-60"
              >
                <Navigation size={15} className={`fill-white ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Detecting Location...' : 'Use my current location'}</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Row 1: Name and Mobile Number */}
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full px-3.5 py-3 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3.5 py-3 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all"
                  />
                </div>

                {/* Row 2: Pincode and Locality */}
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setNewAddress({ ...newAddress, pincode: val, zip: val });
                    }}
                    className="w-full px-3.5 py-3 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Locality"
                    value={newAddress.locality}
                    onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                    className="w-full px-3.5 py-3 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all"
                  />
                </div>

                {/* Row 3: Address (Area and Street) */}
                <div className="col-span-1 sm:col-span-2">
                  <textarea
                    rows={3}
                    placeholder="Address (Area and Street)"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all resize-none"
                  />
                </div>

                {/* Row 4: City/District/Town and State */}
                <div>
                  <input
                    type="text"
                    placeholder="City/District/Town"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3.5 py-3 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all"
                  />
                </div>
                <div>
                  <div className="relative border border-gray-300 rounded bg-white focus-within:border-[#2874f0] focus-within:ring-1 focus-within:ring-[#2874f0] px-3.5 py-1.5 transition-all">
                    <label className="block text-[10px] text-gray-500 font-medium leading-none mb-1">State</label>
                    <select
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full bg-transparent text-sm text-gray-900 outline-none cursor-pointer pr-4 appearance-none"
                    >
                      <option value="">--Select State--</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Row 5: Landmark (Optional) and Alternate Phone (Optional) */}
                <div>
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                    className="w-full px-3.5 py-3 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Alternate Phone (Optional)"
                    value={newAddress.alternatePhone}
                    onChange={(e) => setNewAddress({ ...newAddress, alternatePhone: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3.5 py-3 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0] outline-none transition-all"
                  />
                </div>

                {/* Row 6: Address Type */}
                <div className="col-span-1 sm:col-span-2 pt-1">
                  <span className="block text-xs text-gray-500 font-medium mb-2.5">Address Type</span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 font-medium select-none">
                      <input
                        type="radio"
                        name="addressType"
                        value="Home"
                        checked={newAddress.addressType === 'Home'}
                        onChange={() => setNewAddress({ ...newAddress, addressType: 'Home', label: 'Home' })}
                        className="w-4 h-4 text-[#2874f0] border-gray-300 focus:ring-[#2874f0] cursor-pointer"
                      />
                      <span>Home</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-800 font-medium select-none">
                      <input
                        type="radio"
                        name="addressType"
                        value="Work"
                        checked={newAddress.addressType === 'Work'}
                        onChange={() => setNewAddress({ ...newAddress, addressType: 'Work', label: 'Work' })}
                        className="w-4 h-4 text-[#2874f0] border-gray-300 focus:ring-[#2874f0] cursor-pointer"
                      />
                      <span>Work</span>
                    </label>
                  </div>
                </div>

                {/* Row 7: SAVE and CANCEL buttons */}
                <div className="col-span-1 sm:col-span-2 flex items-center gap-6 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newAddress.name?.trim()) {
                        showToast('Please enter full name', 'error');
                        return;
                      }
                      if (!newAddress.phone || newAddress.phone.length < 10) {
                        showToast('Please enter a valid 10-digit mobile number', 'error');
                        return;
                      }
                      if (!newAddress.pincode || newAddress.pincode.length < 6) {
                        showToast('Please enter a valid 6-digit pincode', 'error');
                        return;
                      }
                      if (!newAddress.street?.trim()) {
                        showToast('Please enter Area and Street address', 'error');
                        return;
                      }
                      if (!newAddress.city?.trim()) {
                        showToast('Please enter City/District/Town', 'error');
                        return;
                      }
                      if (!newAddress.state) {
                        showToast('Please select State', 'error');
                        return;
                      }

                      const savedAddr = {
                        id: editingAddressId || Date.now().toString(),
                        name: newAddress.name.trim(),
                        phone: newAddress.phone,
                        pincode: newAddress.pincode,
                        locality: newAddress.locality?.trim(),
                        street: newAddress.street.trim(),
                        city: newAddress.city.trim(),
                        state: newAddress.state,
                        zip: newAddress.pincode,
                        landmark: newAddress.landmark?.trim(),
                        alternatePhone: newAddress.alternatePhone,
                        addressType: newAddress.addressType,
                        label: newAddress.addressType
                      };

                      if (editingAddressId) {
                        profile.updateAddress(editingAddressId, savedAddr);
                        showToast('Address updated successfully!');
                      } else {
                        profile.addAddress(savedAddr);
                        showToast('Address added successfully!');
                      }

                      setShowAddressModal(false);
                      setEditingAddressId(null);
                      setNewAddress({
                        name: '',
                        phone: '',
                        pincode: '',
                        locality: '',
                        street: '',
                        city: '',
                        state: '',
                        landmark: '',
                        alternatePhone: '',
                        addressType: 'Home',
                        zip: '',
                        label: 'Home'
                      });
                    }}
                    className="bg-[#2874f0] hover:bg-[#1a62d6] text-white px-10 sm:px-12 py-3.5 rounded font-bold uppercase text-sm tracking-wide shadow-md transition-colors cursor-pointer border-none"
                  >
                    SAVE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressModal(false);
                      setEditingAddressId(null);
                    }}
                    className="text-[#2874f0] hover:text-[#1a62d6] font-bold uppercase text-sm tracking-wide bg-transparent border-none cursor-pointer py-3.5 px-2 transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Interactive Payment Card Modal */}
      <AnimatePresence>
        {showCardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border border-gray-100 my-auto max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Pinned Modal Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-3.5 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-sapphire rounded-xl shadow-xs">
                    <CreditCard size={18} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 leading-tight">Add Payment Card</h3>
                    <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                      <Lock size={11} className="text-emerald-500" /> 256-Bit Encrypted Digital Vault
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors cursor-pointer border-none"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
                {/* Interactive Live Card Preview */}
                <div className="perspective-1000">
                  {(() => {
                    const activeTheme = CARD_THEMES.find(t => t.id === newCard.theme) || CARD_THEMES[0];
                    return (
                      <motion.div
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.45, type: 'spring', damping: 20 }}
                        className={`w-full max-w-[340px] aspect-[1.586/1] mx-auto rounded-2xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden bg-gradient-to-br ${activeTheme.gradient} border ${activeTheme.border} flex flex-col justify-between`}
                      >
                        {/* Metallic Shimmer Overlays */}
                        <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-black/25 rounded-full blur-xl pointer-events-none" />

                        {!isFlipped ? (
                          /* Front of Card */
                          <>
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-2.5">
                                {/* Authentic Golden EMV Smart Chip */}
                                <div className="w-8 h-6 rounded bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 border border-yellow-100/70 shadow-inner p-0.5 flex flex-col justify-between relative overflow-hidden shrink-0">
                                  <div className="w-full h-[1px] bg-amber-900/30 my-auto" />
                                  <div className="absolute inset-x-1.5 inset-y-0.5 border border-amber-900/25 rounded-xs pointer-events-none" />
                                </div>
                                {/* Authentic Contactless Waves Icon */}
                                <svg className="w-4 h-4 text-white/90 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                                  <path d="M8.5 15.5a5 5 0 0 0 0-7" />
                                  <path d="M12 18.5a9 9 0 0 0 0-13" />
                                  <path d="M15.5 21.5a13 13 0 0 0 0-19" />
                                </svg>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setIsFlipped(true)}
                                  className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[9px] font-extrabold uppercase tracking-wider transition-all border border-white/20 cursor-pointer backdrop-blur-xs"
                                >
                                  CVV
                                </button>
                                <div>{renderBrandLogo(newCard.brand)}</div>
                              </div>
                            </div>

                            <div className="my-auto relative z-10 py-1">
                              <p className="font-mono text-base sm:text-lg font-bold tracking-widest text-white drop-shadow-md">
                                {newCard.cardNumber
                                  ? formatCardNumber(newCard.cardNumber)
                                  : '•••• •••• •••• ••••'}
                              </p>
                            </div>

                            <div className="flex items-end justify-between relative z-10 pt-1.5 border-t border-white/15 text-xs">
                              <div className="space-y-0.5">
                                <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold block">
                                  Cardholder Name
                                </span>
                                <p className="text-xs font-black tracking-wider text-white uppercase truncate max-w-[170px]">
                                  {newCard.name || formData.fullName || 'CARDHOLDER NAME'}
                                </p>
                              </div>

                              <div className="space-y-0.5 text-right">
                                <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold block">
                                  Expires
                                </span>
                                <p className="text-xs font-mono font-bold text-white tracking-wider">
                                  {newCard.expiry || 'MM/YY'}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Back of Card (CVV mode) */
                          <div className="h-full flex flex-col justify-between py-1 -mx-4 sm:-mx-5">
                            {/* Black Magnetic Stripe */}
                            <div className="w-full h-8 bg-black/90 shadow-inner mb-1" />

                            <div className="px-4 sm:px-5 space-y-1">
                              <div className="flex items-center justify-between text-[8px] text-white/70 uppercase tracking-widest font-bold">
                                <span>Authorized Signature</span>
                                <span>Security Code</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-7 bg-white/90 rounded flex items-center px-2 text-gray-500 font-mono text-[10px] italic">
                                  Electronic Verification
                                </div>
                                <div className="w-12 h-7 bg-white text-gray-900 rounded font-mono font-bold text-xs flex items-center justify-center border border-amber-400 shadow-inner">
                                  {showCvv ? (newCard.cvv || '•••') : '•••'}
                                </div>
                              </div>
                            </div>

                            <div className="px-4 sm:px-5 flex items-center justify-between text-[8px] text-white/60 font-mono">
                              <button
                                type="button"
                                onClick={() => setIsFlipped(false)}
                                className="text-white hover:text-white/80 underline cursor-pointer bg-transparent border-none p-0 text-[9px] font-bold"
                              >
                                ← Front
                              </button>
                              <span>256-Bit SSL Token</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}
                </div>

                {/* Theme & Brand Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Theme Selector */}
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1 block">
                      <Sparkles size={11} className="text-sapphire" /> Card Theme
                    </label>
                    <div className="flex items-center gap-2">
                      {CARD_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setNewCard({ ...newCard, theme: theme.id })}
                          title={theme.name}
                          className={`w-6 h-6 rounded-full ${theme.circle} transition-all cursor-pointer border-2 ${
                            newCard.theme === theme.id ? 'ring-2 ring-sapphire ring-offset-2 scale-110 border-white' : 'border-transparent opacity-75 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Card Brand Selector */}
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 block">
                      Card Brand
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['VISA', 'MASTERCARD', 'AMEX', 'RUPAY'] as const).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setNewCard({ ...newCard, brand: b })}
                          className={`py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer border ${
                            newCard.brand === b
                              ? 'bg-sapphire text-white border-sapphire shadow-xs'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {b === 'MASTERCARD' ? 'Mastercard' : b === 'RUPAY' ? 'RuPay' : b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Input Fields */}
                <div className="space-y-3 pt-1">
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        type="text"
                        placeholder="NAME ON CARD"
                        value={newCard.name}
                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value.toUpperCase() })}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire transition-all font-bold text-gray-900 placeholder:text-gray-400 text-sm tracking-wide"
                      />
                    </div>
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Card Number (16 Digits)
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formatCardNumber(newCard.cardNumber)}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const autoBrand = detectCardBrand(raw);
                          setNewCard({ ...newCard, cardNumber: raw, brand: autoBrand });
                        }}
                        maxLength={19}
                        className="w-full pl-9 pr-14 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire transition-all font-mono font-bold text-gray-900 placeholder:text-gray-400 text-sm tracking-widest"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {renderBrandLogo(newCard.brand)}
                      </div>
                    </div>
                  </div>

                  {/* Expiry Date & CVV Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={newCard.expiry}
                          onChange={(e) => setNewCard({ ...newCard, expiry: formatExpiry(e.target.value) })}
                          maxLength={5}
                          className="w-full pl-9 pr-3 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire transition-all font-mono font-bold text-gray-900 placeholder:text-gray-400 text-sm text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                        CVV / Security Code
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                          type={showCvv ? 'text' : 'password'}
                          placeholder="•••"
                          value={newCard.cvv}
                          onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          maxLength={4}
                          className="w-full pl-9 pr-10 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire transition-all font-mono font-bold text-gray-900 placeholder:text-gray-400 text-sm text-center"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0"
                        >
                          {showCvv ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Default Card Checkbox */}
                  <div className="pt-0.5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newCard.isDefault}
                        onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
                        className="w-4 h-4 text-sapphire rounded border-gray-300 focus:ring-sapphire cursor-pointer"
                      />
                      <span className="text-xs text-gray-700 font-bold">
                        Set as primary default card for 1-click checkout
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pinned Modal Action Footer - Never Cut Off */}
              <div className="flex items-center gap-3 px-5 sm:px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (!newCard.name.trim()) {
                      showToast('Please enter cardholder name', 'error');
                      return;
                    }
                    const rawDigits = newCard.cardNumber.replace(/\D/g, '');
                    if (rawDigits.length < 15) {
                      showToast('Please enter a valid 16-digit card number', 'error');
                      return;
                    }
                    if (!newCard.expiry || newCard.expiry.length < 4) {
                      showToast('Please enter valid expiry date (MM/YY)', 'error');
                      return;
                    }

                    const last4 = rawDigits.slice(-4);
                    profile.addCard({
                      id: Date.now().toString(),
                      name: newCard.name.trim(),
                      cardNumber: last4,
                      expiry: newCard.expiry.trim(),
                      brand: newCard.brand || 'VISA',
                      theme: newCard.theme || 'sapphire',
                      isDefault: newCard.isDefault || profile.savedCards.length === 0
                    });

                    setShowCardModal(false);
                    setNewCard({
                      name: '',
                      cardNumber: '',
                      expiry: '',
                      cvv: '',
                      brand: 'VISA',
                      theme: 'sapphire',
                      isDefault: false
                    });
                    setIsFlipped(false);
                    showToast('Payment card added securely to vault!');
                  }}
                  className="flex-1 bg-gradient-to-r from-sapphire to-blue-600 hover:from-deep-navy hover:to-sapphire text-white py-3 rounded-xl font-black text-sm transition-all duration-300 border-none cursor-pointer shadow-lg shadow-sapphire/20 flex items-center justify-center gap-2 hover:shadow-xl"
                >
                  <ShieldCheck size={18} /> Save to Encrypted Vault
                </button>
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-3 text-gray-500 hover:text-gray-800 font-bold text-sm bg-white hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sapphire to-blue-400" />
              <button onClick={() => setShowPasswordModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-all duration-300 cursor-pointer border-none"><X size={20} /></button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center shadow-inner border border-blue-100/50">
                  <Lock size={28} className="text-sapphire" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Security</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Update your account password</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-4">
                  <input type="password" placeholder="Current Password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                  <input type="password" placeholder="New Password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                  <input type="password" placeholder="Confirm New Password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} className={`w-full px-5 py-4 bg-gray-50/50 border rounded-2xl outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 ${passwordData.new && passwordData.confirm && passwordData.new !== passwordData.confirm ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-gray-200 focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10'}`} />

                  {passwordData.new && passwordData.confirm && passwordData.new !== passwordData.confirm && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs font-bold pl-2 flex items-center gap-1">
                      <X size={12} /> Passwords do not match.
                    </motion.p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                    showToast('Password updated successfully!');
                  }}
                  disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
                  className="w-full bg-gradient-to-r from-sapphire to-blue-600 text-white py-4 rounded-2xl font-black mt-2 hover:from-deep-navy hover:to-sapphire transition-all duration-300 disabled:opacity-50 disabled:grayscale border-none cursor-pointer shadow-lg shadow-sapphire/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModalData?.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] max-w-4xl w-full shadow-2xl relative overflow-hidden border border-gray-100 my-8">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Write a Review</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Share your experience with this product</p>
                </div>
                <button onClick={() => setReviewModalData(null)} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-all duration-300 cursor-pointer border-none"><X size={20} /></button>
              </div>

              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* Left Column (Form) */}
                <div className="flex-1 p-6 space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Overall Rating <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="text-yellow-400 hover:scale-110 transition-transform cursor-pointer border-none bg-transparent p-0"
                          >
                            <Star size={24} className={reviewRating >= star ? "fill-yellow-400" : ""} />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-green-600 ml-2">
                        {reviewRating === 5 ? 'Excellent' : reviewRating === 4 ? 'Good' : reviewRating === 3 ? 'Average' : reviewRating === 2 ? 'Poor' : 'Terrible'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Review Title <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Excellent Smart Thermostat" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Your Review <span className="text-red-500">*</span></label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="The Smart Thermostat exceeded my expectations..."
                      className="w-full h-32 px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
                    />
                    <div className="text-right text-xs font-bold text-gray-400 mt-1">{reviewText.length}/1000</div>
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Add Photos (Optional)</label>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1558002038-1055907df827?w=150&q=80" className="w-full h-full object-cover" /></div>
                      <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1558002038-1055907df827?w=150&q=80" className="w-full h-full object-cover" /></div>
                      <button className="w-16 h-16 rounded-xl border-2 border-dashed border-sapphire/30 flex flex-col items-center justify-center text-sapphire hover:bg-blue-50 transition-colors cursor-pointer bg-white">
                        <Plus size={18} />
                        <span className="text-[9px] font-bold mt-0.5">Add More</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-full md:w-80 p-6 bg-gray-50/50 space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Would you recommend this product?</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${recommendProduct ? 'border-sapphire' : 'border-gray-300 group-hover:border-sapphire'}`}>
                          {recommendProduct && <div className="w-2.5 h-2.5 rounded-full bg-sapphire" />}
                        </div>
                        <input type="radio" className="hidden" checked={recommendProduct} onChange={() => setRecommendProduct(true)} />
                        <span className="text-sm font-medium text-gray-700">Yes, I recommend it</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${!recommendProduct ? 'border-sapphire' : 'border-gray-300 group-hover:border-sapphire'}`}>
                          {!recommendProduct && <div className="w-2.5 h-2.5 rounded-full bg-sapphire" />}
                        </div>
                        <input type="radio" className="hidden" checked={!recommendProduct} onChange={() => setRecommendProduct(false)} />
                        <span className="text-sm font-medium text-gray-700">No, I do not recommend it</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-2 text-green-700 font-bold mb-1.5 text-sm">
                      <CheckCircle2 size={16} /> Verified Purchase
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">
                      This review is from a verified purchase on {reviewModalData?.orderDate}.
                    </p>
                  </div>

                  {reviewModalData?.item && (
                    <div className="bg-white border border-gray-200 rounded-xl p-3 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100"><img src={reviewModalData.item.image} className="w-full h-full object-cover" /></div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm truncate w-40">{reviewModalData.item.name}</p>
                        <p className="text-xs font-semibold text-gray-600 mt-0.5">${reviewModalData.item.price.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">Order # {reviewModalData.orderId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-4 rounded-b-[2rem]">
                <button onClick={() => setReviewModalData(null)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (reviewModalData?.item) {
                      addReview(reviewModalData.item.id, {
                        userId: user?.uid || 'anonymous',
                        userName: user?.displayName || 'Anonymous User',
                        rating: reviewRating,
                        title: 'Review for ' + reviewModalData.item.name, // Will use proper input later if needed, but keeping it simple
                        body: reviewText,
                        recommended: recommendProduct
                      });
                    }
                    setReviewModalData(null);
                    setReviewText('');
                    setReviewRating(5);
                    setRecommendProduct(true);
                    showToast('Review submitted successfully!');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sapphire text-white font-bold text-sm hover:bg-deep-navy transition-colors cursor-pointer border-none shadow-md shadow-sapphire/20"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Modal (Admin Customers Review Style) */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-[#000926]/75 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="bg-white rounded-[22px] shadow-2xl max-w-[320px] w-full p-4 border border-slate-100 relative animate-in zoom-in-95 duration-150 text-left">
              
              {/* Compact Header Row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100/60">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                      Delete Account?
                    </h3>
                    <p className="text-[10px] font-medium text-slate-500">
                      Irreversible action
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !isDeletingAccount && setShowDeleteModal(false)}
                  disabled={isDeletingAccount}
                  className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Compact User Details Box */}
              <div className="bg-[#0F52BA]/5 border border-[#0F52BA]/15 rounded-xl p-2.5 mb-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F52BA] to-[#000926] text-white font-medium text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {([formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() || formData.fullName || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-900 truncate">
                    {[formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() || formData.fullName || user.displayName || 'Account User'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Compact Warning Box */}
              <div className="bg-red-50/90 border border-red-200/80 rounded-xl p-2.5 mb-2.5 flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3" />
                </div>
                <div className="text-[11px] leading-snug text-slate-700">
                  <p className="font-semibold text-slate-800">
                    Are you sure you want to delete?
                  </p>
                  <p>
                    <span className="font-medium text-red-600">This action is permanent</span> and erases all data.
                  </p>
                </div>
              </div>

              {/* Compact Checklist Box */}
              <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl p-2.5 mb-3 flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-100/80 text-[#0F52BA] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-3 h-3" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-[11px] mb-1">
                    Permanently deletes:
                  </p>
                  <ul className="space-y-0.5 text-[10px] text-slate-600 font-medium">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                      <span>Personal information & data</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                      <span>Order history & transactions</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                      <span>Account access & permissions</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Compact Buttons Row */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => !isDeletingAccount && setShowDeleteModal(false)}
                  disabled={isDeletingAccount}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Cancel</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteAccount}
                  disabled={isDeletingAccount}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-medium text-xs shadow-md shadow-[#E11D48]/25 hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-60"
                >
                  <Trash2 className={`w-3 h-3 ${isDeletingAccount ? 'animate-spin' : ''}`} />
                  <span>{isDeletingAccount ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>

              {/* Compact Bottom Lock Info */}
              <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Cannot be undone</span>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-sm font-bold text-white ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
