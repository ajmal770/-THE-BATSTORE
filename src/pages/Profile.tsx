import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, Trash2, MapPin, Bell, Phone, Mail, Lock, CreditCard, Plus, Camera, X, User as UserIcon, Shield, CheckCircle2, Calendar, DollarSign, FileText, Check, Truck, Moon, Filter, ShoppingCart, Star, ChevronRight, CheckCircle, Package, Headset, Globe, KeyRound, Monitor, Smartphone, AlertTriangle, Download, ShieldCheck, Database, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { useProfileStore } from '../store/profileStore';
import { useCartStore } from '../store/cartStore';
import { useOrderStore, type Order } from '../store/orderStore';
import { useProductStore } from '../store/productStore';
import { isFirebaseConfigured, syncAllProjectDataToFirestore } from '../services/firestoreService';

type TabType = 'orders' | 'profile' | 'settings';

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
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All Orders');

  // Modals state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Modal data state
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', state: '', zip: '' });
  const [newCard, setNewCard] = useState({ name: '', cardNumber: '', expiry: '', brand: 'VISA' });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [reviewModalData, setReviewModalData] = useState<{ show: boolean, item: any, orderDate: string, orderId: string } | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [recommendProduct, setRecommendProduct] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type }), 3000);
  };

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab as TabType);
    }
  }, [location.state?.tab]);

  // Form State for Settings
  const [formData, setFormData] = useState({
    fullName: dbUser?.displayName || profile.fullName || user?.displayName || 'User',
    avatar: dbUser?.avatar || profile.avatar || null,
    phone: dbUser?.phone || profile.phone,
    shippingAddress: dbUser?.shippingAddress || profile.shippingAddress,
    billingAddress: dbUser?.billingAddress || profile.billingAddress,
    preferences: profile.preferences,
  });

  const [editingShipping, setEditingShipping] = useState(false);
  const [editingBilling, setEditingBilling] = useState(false);
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
    updateProfile(formData);
    if (user) {
      updateUser(user.uid, {
        displayName: formData.fullName,
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

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    const result = await syncAllProjectDataToFirestore();
    setIsSyncingCloud(false);
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
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

            {/* Account Details */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10" />
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                  <UserIcon size={20} className="stroke-[2.5]" />
                </div>
                Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sapphire transition-colors animate-none" size={18} />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/30 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire outline-none transition-all text-gray-900 font-semibold placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      defaultValue={user.email || ''}
                      readOnly
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-400 font-semibold outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sapphire transition-colors" size={18} />
                    <input
                      type="tel"
                      placeholder="Mobile number for delivery updates"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/30 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire outline-none transition-all text-gray-900 font-semibold placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Address Book */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                    <MapPin size={20} className="stroke-[2.5]" />
                  </div>
                  Address Book
                </h3>
                <button onClick={() => setShowAddressModal(true)} className="text-sapphire font-extrabold text-sm hover:text-deep-navy transition-colors flex items-center gap-1.5 bg-blue-50/50 px-3.5 py-2 rounded-xl border-none cursor-pointer">
                  <Plus size={16} className="stroke-[2.5]" /> Add New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="border border-gray-300 rounded-2xl p-6 relative group bg-gradient-to-b from-white to-gray-50/40 hover:shadow-lg hover:shadow-gray-200/40 hover:border-sapphire/20 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 bg-sapphire/10 text-sapphire text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">Default Shipping</div>
                  <h4 className="font-extrabold text-gray-900 mb-3">{formData.fullName}</h4>

                  {editingShipping ? (
                    <div className="space-y-3 mt-4">
                      <input type="text" placeholder="Street Address" value={formData.shippingAddress.street} onChange={(e) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, street: e.target.value } })} className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                      <input type="text" placeholder="City" value={formData.shippingAddress.city} onChange={(e) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, city: e.target.value } })} className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                      <div className="flex gap-2">
                        <input type="text" placeholder="State" value={formData.shippingAddress.state} onChange={(e) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, state: e.target.value } })} className="w-1/2 px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                        <input type="text" placeholder="ZIP" value={formData.shippingAddress.zip} onChange={(e) => setFormData({ ...formData, shippingAddress: { ...formData.shippingAddress, zip: e.target.value } })} className="w-1/2 px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                      </div>
                      <button onClick={() => setEditingShipping(false)} className="w-full bg-sapphire text-white py-2.5 rounded-xl text-xs font-bold hover:bg-deep-navy shadow-md shadow-sapphire/15 border-none cursor-pointer">Done</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm mb-1 font-medium">{formData.shippingAddress.street || 'No street provided'}</p>
                      <p className="text-gray-500 text-sm mb-5 font-medium">
                        {formData.shippingAddress.city ? `${formData.shippingAddress.city}, ` : ''}
                        {formData.shippingAddress.state} {formData.shippingAddress.zip}
                      </p>
                      <div className="flex items-center justify-between border-t border-gray-100/60 pt-4">
                        <button onClick={() => setEditingShipping(true)} className="text-sapphire text-xs font-black hover:text-deep-navy transition-colors bg-transparent border-none p-0 cursor-pointer">Edit Address</button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this shipping address?')) {
                              const cleared = { street: '', city: '', state: '', zip: '' };
                              setFormData(prev => ({ ...prev, shippingAddress: cleared }));
                              updateProfile({ shippingAddress: cleared });
                              if (user) updateUser(user.uid, { shippingAddress: cleared });
                            }
                          }}
                          className="text-red-500 hover:text-red-600 text-xs font-black transition-colors flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Additional Saved Addresses */}
                {profile.savedAddresses?.map((address) => (
                  <motion.div
                    key={address.id}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className="border border-gray-300 rounded-2xl p-6 relative group bg-gradient-to-b from-white to-gray-50/40 hover:shadow-lg hover:shadow-gray-200/40 hover:border-sapphire/20 transition-all duration-300"
                  >
                    <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">{address.label || 'Saved'}</div>
                    <h4 className="font-extrabold text-gray-900 mb-3">{formData.fullName}</h4>
                    <p className="text-gray-500 text-sm mb-1 font-medium">{address.street}</p>
                    <p className="text-gray-500 text-sm mb-5 font-medium">
                      {address.city ? `${address.city}, ` : ''}
                      {address.state} {address.zip}
                    </p>
                    <div className="flex items-center justify-end border-t border-gray-100/60 pt-4">
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this address?')) {
                            if (address.id) profile.removeAddress(address.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-600 text-xs font-black transition-colors flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Billing Address */}
                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="border border-gray-300 rounded-2xl p-6 relative group bg-gradient-to-b from-white to-gray-50/40 hover:shadow-lg hover:shadow-gray-200/40 hover:border-sapphire/20 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">Default Billing</div>
                  <h4 className="font-extrabold text-gray-900 mb-3">{formData.fullName}</h4>

                  {editingBilling ? (
                    <div className="space-y-3 mt-4">
                      <input type="text" placeholder="Street Address" value={formData.billingAddress.street} onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, street: e.target.value } })} className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                      <input type="text" placeholder="City" value={formData.billingAddress.city} onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, city: e.target.value } })} className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                      <div className="flex gap-2">
                        <input type="text" placeholder="State" value={formData.billingAddress.state} onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, state: e.target.value } })} className="w-1/2 px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                        <input type="text" placeholder="ZIP" value={formData.billingAddress.zip} onChange={(e) => setFormData({ ...formData, billingAddress: { ...formData.billingAddress, zip: e.target.value } })} className="w-1/2 px-3 py-2.5 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-xl text-xs outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire font-semibold" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setFormData({ ...formData, billingAddress: formData.shippingAddress })} className="w-1/2 bg-gray-50 border border-gray-100 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 cursor-pointer">Copy Shipping</button>
                        <button onClick={() => setEditingBilling(false)} className="w-1/2 bg-sapphire text-white py-2.5 rounded-xl text-xs font-bold hover:bg-deep-navy shadow-md shadow-sapphire/15 border-none cursor-pointer">Done</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-500 text-sm mb-1 font-medium">{formData.billingAddress.street || 'Same as shipping address'}</p>
                      <p className="text-gray-500 text-sm mb-5 font-medium">
                        {formData.billingAddress.city ? `${formData.billingAddress.city}, ` : ''}
                        {formData.billingAddress.state} {formData.billingAddress.zip}
                      </p>
                      <div className="flex items-center justify-between border-t border-gray-100/60 pt-4">
                        <button onClick={() => setEditingBilling(true)} className="text-sapphire text-xs font-black hover:text-deep-navy transition-colors bg-transparent border-none p-0 cursor-pointer">Edit Address</button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to remove this billing address?')) {
                              const cleared = { street: '', city: '', state: '', zip: '' };
                              setFormData(prev => ({ ...prev, billingAddress: cleared }));
                              updateProfile({ billingAddress: cleared });
                              if (user) updateUser(user.uid, { billingAddress: cleared });
                            }
                          }}
                          className="text-red-500 hover:text-red-600 text-xs font-black transition-colors flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Compact Executive Payment Methods & Digital Vault */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-300 rounded-3xl p-6 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              {/* Compact Header Section */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-sapphire rounded-xl">
                    <CreditCard size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-gray-900">Payment Methods</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200/60 flex items-center gap-1">
                        <ShieldCheck size={11} className="stroke-[2.5]" /> 256-Bit SSL
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Encrypted default cards & instant checkout
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCardModal(true)}
                  className="bg-gradient-to-r from-sapphire to-blue-600 text-white font-extrabold text-xs hover:from-deep-navy hover:to-sapphire transition-all duration-300 flex items-center gap-1.5 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md border-none cursor-pointer"
                >
                  <Plus size={15} className="stroke-[3]" /> Add Card
                </button>
              </div>

              {/* Compact Sleek Card List */}
              <div className="space-y-3">
                {/* Primary Default Card */}
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  className="border border-gray-300 rounded-2xl p-4 flex items-center justify-between bg-gradient-to-r from-gray-50/70 via-white to-gray-50/40 hover:border-sapphire/30 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {/* Mini Metallic Card Graphic */}
                    <div className="w-13 h-8 bg-gradient-to-br from-[#0A192F] to-[#1E3A5F] rounded-lg flex items-center justify-between px-2 text-white shadow-md border border-white/10 shrink-0">
                      <div className="w-3.5 h-2.5 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-xs" />
                      <span className="text-[10px] font-black italic tracking-wide">VISA</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-gray-900 text-sm">Visa ending in •••• 4242</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black flex items-center gap-1 border border-emerald-200/60">
                          <CheckCircle2 size={11} /> Default
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        Expires 12/28 • {formData.fullName || 'Alexander Wright'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-50 rounded-lg">Primary</span>
                  </div>
                </motion.div>

                {/* Secondary Saved Card */}
                <motion.div
                  whileHover={{ scale: 1.005 }}
                  className="border border-gray-300 rounded-2xl p-4 flex items-center justify-between bg-gradient-to-r from-gray-50/70 via-white to-gray-50/40 hover:border-sapphire/30 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-8 bg-gradient-to-br from-[#0F172A] to-[#334155] rounded-lg flex items-center justify-between px-2 text-white shadow-md border border-white/10 shrink-0">
                      <div className="w-3.5 h-2.5 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-xs" />
                      <span className="text-[10px] font-black italic tracking-wide">VISA</span>
                    </div>

                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">Visa ending in •••• 8834</p>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">
                        Expires 10/30 • John Anderson
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('Updated primary default card!')}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-sapphire hover:text-white text-gray-600 text-xs font-extrabold transition-all border border-gray-200/60 cursor-pointer"
                    >
                      Set Default
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Remove this saved card?')) {
                          showToast('Payment method removed.');
                        }
                      }}
                      className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                      title="Remove Card"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>

                {/* Dynamic Saved Cards */}
                {profile.savedCards?.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.005 }}
                    className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between bg-gradient-to-r from-gray-50/70 via-white to-gray-50/40 hover:border-sapphire/30 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-13 h-8 bg-gradient-to-br from-[#064E3B] to-[#047857] rounded-lg flex items-center justify-between px-2 text-white shadow-md border border-white/10 shrink-0">
                        <div className="w-3.5 h-2.5 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-xs" />
                        <span className="text-[10px] font-black italic tracking-wide">{card.brand || 'VISA'}</span>
                      </div>

                      <div>
                        <p className="font-extrabold text-gray-900 text-sm">{card.brand || 'VISA'} ending in •••• {card.cardNumber}</p>
                        <p className="text-xs text-gray-400 font-semibold mt-0.5">
                          Expires {card.expiry || '12/29'} • {card.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast('Updated primary default card!')}
                        className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-sapphire hover:text-white text-gray-600 text-xs font-extrabold transition-all border border-gray-200/60 cursor-pointer"
                      >
                        Set Default
                      </button>
                      <button
                        onClick={() => {
                          profile.removeCard(card.id);
                          showToast('Payment card removed.');
                        }}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                        title="Remove Card"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Compact Inline Assurance Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-100 text-[11px] font-bold text-gray-400">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <ShieldCheck size={14} className="text-sapphire" /> Zero liability protection
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Lock size={14} className="text-emerald-600" /> Tokenized & encrypted card vault
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <CheckCircle2 size={14} className="text-indigo-600" /> Instant 1-click checkout
                </span>
              </div>
            </motion.div>

            {/* Save Profile Actions */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
              className="flex justify-end pt-4"
            >
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className={`px-8 py-4 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 text-base transform hover:-translate-y-0.5 border-none min-w-[220px] ${isSaving
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
            {/* Google Cloud Firestore Database Sync */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-gradient-to-r from-deep-navy via-sapphire to-blue-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-sapphire/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-10 pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 shadow-inner shrink-0">
                  <Database size={26} className="stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-white">Google Cloud Firestore Database</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                      isFirebaseConfigured()
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-amber-400/20 text-amber-200 border border-amber-300/40'
                    }`}>
                      {isFirebaseConfigured() ? '🟢 Connected to Cloud' : '🟡 LocalStorage • Cloud Ready'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1.5 max-w-xl leading-relaxed">
                    {isFirebaseConfigured()
                      ? 'Your project database is live-connected to Google Cloud Firestore. You can manually push all local data to your Firestore collections anytime.'
                      : 'Your app is using fast LocalStorage persistence. To save to Cloud Firestore, add your Firebase API keys to your .env file and click Sync Now.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloudSync}
                disabled={isSyncingCloud}
                className="w-full md:w-auto px-6 py-3.5 bg-white text-sapphire hover:bg-blue-50 font-black rounded-2xl transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2.5 shrink-0 cursor-pointer disabled:opacity-75 border-none"
              >
                {isSyncingCloud ? (
                  <>
                    <Cloud size={18} className="animate-bounce text-sapphire" />
                    <span>Syncing to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Cloud size={18} className="text-sapphire" />
                    <span>Sync All Data to Firestore</span>
                  </>
                )}
              </button>
            </motion.div>

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

            {/* Two-Factor Authentication & Active Sessions */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/20 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                      <KeyRound size={20} className="stroke-[2.5]" />
                    </div>
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Add an extra layer of security to your account upon signing in.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${formData.preferences.twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {formData.preferences.twoFactorEnabled ? 'Enabled (Protected)' : 'Disabled'}
                  </span>
                  <div
                    onClick={() => {
                      const nextVal = !formData.preferences.twoFactorEnabled;
                      setFormData({ ...formData, preferences: { ...formData.preferences, twoFactorEnabled: nextVal } });
                      showToast(nextVal ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled', nextVal ? 'success' : 'error');
                    }}
                    className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${formData.preferences.twoFactorEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${formData.preferences.twoFactorEnabled ? 'translate-x-7' : 'translate-x-1'}`}></span>
                  </div>
                </div>
              </div>

              {/* Active Logged-In Sessions */}
              <div className="border-t border-gray-100 pt-5 mt-5">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Active Sign-in Sessions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50/60 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-sapphire flex items-center justify-center">
                        <Monitor size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Windows PC - Chrome</p>
                        <p className="text-xs text-gray-400">Current Session • Active now</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">This Device</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/60 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">iPhone 15 Pro - Safari</p>
                        <p className="text-xs text-gray-400">New York, USA • 2 hours ago</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Session revoked successfully!', 'success')}
                      className="text-xs font-bold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100 bg-transparent"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Privacy & Danger Zone */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="bg-white border border-red-100/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-red-500/5 relative overflow-hidden"
            >
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                  <AlertTriangle size={20} className="stroke-[2.5]" />
                </div>
                Privacy & Danger Zone
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Download Account Data */}
                <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/40 flex flex-col justify-between gap-4">
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
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all cursor-pointer shadow-sm"
                  >
                    <Download size={15} /> Export JSON Data
                  </button>
                </div>

                {/* Account Deletion */}
                <div className="p-5 border border-red-100 rounded-2xl bg-red-50/30 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-extrabold text-red-900 text-sm">Deactivate or Delete Account</h4>
                    <p className="text-xs text-red-700/80 font-medium mt-1">
                      Permanently delete your account, saved addresses, and active preferences. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
                        useAuthStore.getState().logout();
                        navigate('/');
                      }
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-red-700 transition-all cursor-pointer shadow-sm shadow-red-500/20 border-none"
                  >
                    <Trash2 size={15} /> Delete Account
                  </button>
                </div>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2rem] p-8 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sapphire to-blue-400" />
              <button onClick={() => setShowAddressModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-all duration-300 cursor-pointer border-none"><X size={20} /></button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center shadow-inner border border-blue-100/50">
                  <MapPin size={28} className="text-sapphire" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">New Address</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Add a new destination to your address book</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-4">
                  <input type="text" placeholder="Address Label (e.g. Home, Work)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                  <input type="text" placeholder="Street Address" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                  <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="w-1/2 px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                    <input type="text" placeholder="ZIP" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} className="w-1/2 px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-sapphire focus:ring-4 focus:ring-sapphire/10 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    profile.addAddress({ id: Date.now().toString(), ...newAddress });
                    setShowAddressModal(false);
                    setNewAddress({ label: '', street: '', city: '', state: '', zip: '' });
                    showToast('Address added successfully!');
                  }}
                  disabled={!newAddress.street || !newAddress.city}
                  className="w-full bg-gradient-to-r from-sapphire to-blue-600 text-white py-4 rounded-2xl font-black mt-2 hover:from-deep-navy hover:to-sapphire transition-all duration-300 disabled:opacity-50 disabled:grayscale border-none cursor-pointer shadow-lg shadow-sapphire/20 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Save Address
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showCardModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">Add Payment Card</h3>
                    <p className="text-[11px] text-gray-400 font-medium">Encrypted wallet storage</p>
                  </div>
                </div>
                <button onClick={() => setShowCardModal(false)} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-all cursor-pointer border-none"><X size={18} /></button>
              </div>

              <div className="space-y-4">
                {/* Brand Selector */}
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 block">Card Brand</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['VISA', 'MASTERCARD', 'AMEX'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setNewCard({ ...newCard, brand: b })}
                        className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          newCard.brand === b
                            ? 'bg-sapphire text-white border-sapphire shadow-sm'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-sapphire transition-all font-medium text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Card Number (16 Digits)"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\D/g, '') })}
                    maxLength={16}
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-sapphire transition-all font-medium text-gray-900 placeholder:text-gray-400 font-mono tracking-wider text-xs sm:text-sm"
                  />
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                      maxLength={5}
                      className="w-1/2 px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-sapphire transition-all font-medium text-gray-900 placeholder:text-gray-400 font-mono text-xs sm:text-sm"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      className="w-1/2 px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-sapphire transition-all font-medium text-gray-900 placeholder:text-gray-400 font-mono text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const last4 = newCard.cardNumber.slice(-4) || 'XXXX';
                    profile.addCard({
                      id: Date.now().toString(),
                      name: newCard.name,
                      cardNumber: last4,
                      expiry: newCard.expiry,
                      brand: newCard.brand || 'VISA'
                    });
                    setShowCardModal(false);
                    setNewCard({ name: '', cardNumber: '', expiry: '', brand: 'VISA' });
                    showToast('Card added to encrypted vault!');
                  }}
                  disabled={!newCard.name || !newCard.cardNumber}
                  className="w-full bg-gradient-to-r from-sapphire to-blue-600 text-white py-3 rounded-xl font-bold text-xs sm:text-sm mt-3 hover:from-deep-navy hover:to-sapphire transition-all duration-300 disabled:opacity-50 disabled:grayscale border-none cursor-pointer shadow-md"
                >
                  Save Card
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
