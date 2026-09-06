import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Bell, Search, Menu, ShoppingBag, AlertTriangle, MessageSquare, Check, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { useProductStore } from '../../store/productStore';
import { useCustomerStore } from '../../store/customerStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'order' | 'stock' | 'ticket';
}

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { orders } = useOrderStore();
  const { products } = useProductStore();
  const { customers } = useCustomerStore();

  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('thebatstore-read-notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [clearedNotifications, setClearedNotifications] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('thebatstore-cleared-notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Calculate live notifications list dynamically
  const notifications: NotificationItem[] = [];

  // 1. Process Orders
  orders.forEach(order => {
    if (order.status === 'Processing') {
      const id = `order-${order.id}`;
      if (!clearedNotifications.includes(id)) {
        notifications.push({
          id,
          title: 'New Order Received',
          description: `Order ${order.id} placed by ${order.customer} ($${order.total.toFixed(2)})`,
          time: order.date || 'Just now',
          unread: !readNotifications.includes(id),
          type: 'order'
        });
      }
    }
  });

  // 2. Process Low Stock Products
  products.forEach(product => {
    if (product.stock <= 15) {
      const id = `stock-${product.id}`;
      if (!clearedNotifications.includes(id)) {
        notifications.push({
          id,
          title: product.stock === 0 ? 'Out of Stock Alert' : 'Low Stock Warning',
          description: `${product.name} is down to ${product.stock} units!`,
          time: 'Needs Attention',
          unread: !readNotifications.includes(id),
          type: 'stock'
        });
      }
    }
  });

  // 3. Fallback support ticket
  const ticketId = 'ticket-1';
  if (!clearedNotifications.includes(ticketId)) {
    notifications.push({
      id: ticketId,
      title: 'New Support Ticket',
      description: 'Customer inquiry regarding delivery to NY',
      time: '3 hours ago',
      unread: !readNotifications.includes(ticketId),
      type: 'ticket'
    });
  }

  // Sort: Put unread first, then type order
  notifications.sort((a, b) => {
    if (a.unread && !b.unread) return -1;
    if (!a.unread && b.unread) return 1;
    return 0;
  });

  // Global search filtering
  const searchQuery = globalSearch.trim().toLowerCase();
  const matchedProducts = searchQuery ? products.filter(p => 
    p.name.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery)
  ).slice(0, 3) : [];

  const matchedOrders = searchQuery ? orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery) || o.customer.toLowerCase().includes(searchQuery)
  ).slice(0, 3) : [];

  const matchedCustomers = searchQuery ? customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery) || c.email.toLowerCase().includes(searchQuery)
  ).slice(0, 3) : [];

  const totalMatches = matchedProducts.length + matchedOrders.length + matchedCustomers.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = (id: string) => {
    if (!readNotifications.includes(id)) {
      const updated = [...readNotifications, id];
      setReadNotifications(updated);
      localStorage.setItem('thebatstore-read-notifications', JSON.stringify(updated));
    }
  };

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...readNotifications, ...allIds]));
    setReadNotifications(updated);
    localStorage.setItem('thebatstore-read-notifications', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...clearedNotifications, ...allIds]));
    setClearedNotifications(updated);
    localStorage.setItem('thebatstore-cleared-notifications', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return (
          <div className="p-2.5 bg-blue-50 text-sapphire rounded-xl shrink-0">
            <ShoppingBag size={16} />
          </div>
        );
      case 'stock':
        return (
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <AlertTriangle size={16} />
          </div>
        );
      case 'ticket':
        return (
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <MessageSquare size={16} />
          </div>
        );
    }
  };

  return (
    <header className="bg-white h-16 border-b px-6 flex items-center justify-between shadow-sm sticky top-0 z-45">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-900 cursor-pointer bg-transparent border-none p-1">
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block" ref={searchContainerRef}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search here..." 
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="pl-11 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/60 focus:bg-white border border-gray-100 focus:border-sapphire/30 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sapphire/10 w-64 transition-all duration-300 placeholder:text-gray-400 font-medium"
          />

          <AnimatePresence>
            {showSearchResults && searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-3 w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 py-4 z-50 max-h-[385px] overflow-y-auto divide-y divide-gray-55"
              >
                {totalMatches === 0 ? (
                  <div className="px-5 py-6 text-center">
                    <p className="text-xs text-gray-400 font-bold">No results found for "{globalSearch}"</p>
                  </div>
                ) : (
                  <>
                    {/* Products */}
                    {matchedProducts.length > 0 && (
                      <div className="px-4 py-2">
                        <h4 className="text-[10px] text-gray-450 font-black uppercase tracking-widest px-2 mb-2">Products</h4>
                        <div className="space-y-1">
                          {matchedProducts.map(p => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setShowSearchResults(false);
                                setGlobalSearch('');
                                navigate('/admin/products', { state: { searchTerm: p.name } });
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
                            >
                              <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-extrabold text-gray-900 truncate leading-tight">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold leading-normal">{p.category}</p>
                              </div>
                              <span className="text-xs font-black text-sapphire shrink-0">${p.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Orders */}
                    {matchedOrders.length > 0 && (
                      <div className="px-4 py-2">
                        <h4 className="text-[10px] text-gray-455 font-black uppercase tracking-widest px-2 mb-2">Orders</h4>
                        <div className="space-y-1">
                          {matchedOrders.map(o => (
                            <div
                              key={o.id}
                              onClick={() => {
                                setShowSearchResults(false);
                                setGlobalSearch('');
                                navigate('/admin/orders', { state: { searchTerm: o.id } });
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
                            >
                              <div className="p-2 bg-blue-50 text-sapphire rounded-xl shrink-0">
                                <ShoppingBag size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-extrabold text-gray-900 truncate leading-tight">{o.id}</p>
                                <p className="text-[10px] text-gray-400 font-bold leading-normal">by {o.customer}</p>
                              </div>
                              <span className="text-xs font-black text-gray-950 shrink-0">${o.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customers */}
                    {matchedCustomers.length > 0 && (
                      <div className="px-4 py-2">
                        <h4 className="text-[10px] text-gray-455 font-black uppercase tracking-widest px-2 mb-2">Customers</h4>
                        <div className="space-y-1">
                          {matchedCustomers.map(c => (
                            <div
                              key={c.id}
                              onClick={() => {
                                setShowSearchResults(false);
                                setGlobalSearch('');
                                navigate('/admin/customers', { state: { searchTerm: c.name } });
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs shrink-0">
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-extrabold text-gray-900 truncate leading-tight">{c.name}</p>
                                <p className="text-[10px] text-gray-450 font-bold leading-normal truncate">{c.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Notifications Dropdown Wrapper */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="relative text-gray-500 hover:text-gray-900 transition-colors p-1.5 hover:bg-gray-50 rounded-xl cursor-pointer outline-none bg-transparent border-none flex items-center justify-center"
          >
            <Bell size={20} className="stroke-[2]" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 py-4 z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-gray-900 text-sm">Notifications</h4>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{unreadCount} Unread</p>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-sapphire hover:text-deep-navy text-xs font-bold bg-transparent border-none cursor-pointer flex items-center gap-1"
                    >
                      <Check size={12} className="stroke-[3]" /> Mark all as read
                    </button>
                  )}
                </div>

                {/* List Body */}
                <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50/50">
                  {notifications.length > 0 ? (
                    notifications.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => handleMarkAsRead(item.id)}
                        className={`flex items-start gap-3.5 p-4 transition-colors cursor-pointer relative group ${item.unread ? 'bg-blue-50/15 hover:bg-blue-50/30' : 'hover:bg-gray-50/80'}`}
                      >
                        {/* Unread dot indicator */}
                        {item.unread && (
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sapphire rounded-full" />
                        )}
                        
                        {getIcon(item.type)}
                        
                        <div className="flex-1 space-y-0.5">
                          <h5 className={`text-xs text-gray-900 font-black leading-tight ${item.unread ? 'text-gray-950 font-black' : 'text-gray-500 font-semibold'}`}>
                            {item.title}
                          </h5>
                          <p className="text-[11px] text-gray-500 leading-normal font-medium">{item.description}</p>
                          <span className="text-[9px] text-gray-400 font-bold block pt-0.5">{item.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                      <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-3">
                        <Check size={28} className="stroke-[1.5]" />
                      </div>
                      <h5 className="font-extrabold text-gray-900 text-sm">All Caught Up!</h5>
                      <p className="text-xs text-gray-400 font-medium mt-1">You have no new notifications.</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-5 pt-3 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={handleClearAll}
                      className="text-red-500 hover:text-red-600 text-xs font-black flex items-center gap-1.5 bg-transparent border-none cursor-pointer"
                    >
                      <Trash2 size={12} /> Clear All
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-gray-200 shrink-0" />

        {/* Profile Info & Logout */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-sapphire text-white flex items-center justify-center font-black text-base shadow-sm shrink-0 border border-sapphire/15 select-none">
            <span className="leading-none">{user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}</span>
          </div>
          <div className="hidden md:flex flex-col justify-center">
            <p className="text-xs font-black text-gray-900 leading-none">{user?.displayName || 'Admin User'}</p>
            <p className="text-[8px] text-gray-400 font-black tracking-widest mt-1 uppercase leading-none">{user?.role}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="ml-1.5 text-gray-400 hover:text-red-500 hover:scale-105 transition-all duration-200 bg-transparent border-none cursor-pointer p-2 hover:bg-red-50 rounded-xl flex items-center justify-center"
            title="Log Out"
          >
            <LogOut size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
