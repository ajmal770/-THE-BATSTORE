import React, { useState, useEffect, useRef } from 'react';
import { Search, Eye, Download, Package, CheckCircle, Truck, X, User, Mail, MapPin, Phone, Calendar, CreditCard, ShieldCheck, RefreshCw, Check, ChevronDown, Filter, Hash, Copy } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import type { Order } from '../../store/orderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Delivered': return { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-100/50', dot: 'bg-emerald-500' };
    case 'Shipped': return { bg: 'bg-blue-50 text-blue-700 border border-blue-100/50', dot: 'bg-blue-500' };
    case 'Processing': return { bg: 'bg-amber-50 text-amber-700 border border-amber-100/50', dot: 'bg-amber-500 animate-pulse' };
    case 'Cancelled': return { bg: 'bg-rose-50 text-rose-700 border border-rose-100/50', dot: 'bg-rose-500' };
    default: return { bg: 'bg-gray-50 text-gray-700 border border-gray-100', dot: 'bg-gray-400' };
  }
};

const CustomSelect = ({ value, onChange, options, placeholder = "Select...", icon: Icon, className = "" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative group min-w-[160px] ${className}`} ref={dropdownRef}>
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sapphire transition-colors z-10" size={16} />}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3 border rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all cursor-pointer flex items-center bg-white border-gray-200 hover:border-sapphire/30 focus:border-sapphire ${isOpen ? 'ring-4 ring-sapphire/10 border-sapphire' : ''}`}
      >
        <span className={value ? "text-gray-900 truncate font-bold" : "text-gray-400 font-bold"}>
          {value ? (options.find((o: any) => o.value === value)?.label || value) : placeholder}
        </span>
      </div>
      <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300 ${isOpen ? 'rotate-180 text-sapphire' : ''}`} size={16} />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
              {options.map((opt: any) => (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                    value === opt.value ? 'bg-sapphire text-white font-bold shadow-md shadow-sapphire/20' : 'text-gray-700 hover:bg-gray-50 font-bold'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <Check size={14} className="shrink-0" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [tempStatus, setTempStatus] = useState<Order['status']>('Processing');

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleOrderSelect = (order: Order) => {
    setSelectedOrderId(order.id);
    setTempStatus(order.status);
  };

  const handleStatusUpdate = () => {
    if (selectedOrderId) {
      updateOrderStatus(selectedOrderId, tempStatus);
      alert(`Order ${selectedOrderId} updated to ${tempStatus}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Total ($)', 'Status', 'Items Count'];
    const rows = orders.map(o => [o.id, o.customer, o.email, o.date, o.total.toFixed(2), o.status, o.itemsCount]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `thebatstore_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'All Statuses', label: 'All Statuses' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];
  
  const updateStatusOptions = [
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Track customer orders, update delivery status, and review billing information.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all cursor-pointer hover:border-gray-300"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full">
        <div className="p-5 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sapphire transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search orders by ID or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-sapphire/10 focus:border-sapphire bg-white text-gray-900 transition-all"
            />
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <CustomSelect 
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              icon={Filter}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm">
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Items</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold text-gray-500">No orders found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-blue-50/30 transition-colors cursor-pointer group ${selectedOrderId === order.id ? 'bg-blue-50/50' : ''}`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-sapphire/10 text-sapphire flex items-center justify-center shrink-0 shadow-sm border border-sapphire/20">
                          <Hash size={14} />
                        </div>
                        <span className="font-mono font-bold text-gray-900 tracking-tight">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{order.date}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500 font-bold">{order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusStyles(order.status).bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(order.status).dot}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOrderSelect(order); }}
                        className="w-8 h-8 mx-auto rounded-lg bg-gray-50 hover:bg-sapphire hover:text-white text-gray-500 flex items-center justify-center transition-all cursor-pointer border border-gray-200 hover:border-sapphire shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Popup Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 z-10"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40 relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sapphire to-blue-500" />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] bg-blue-50 text-sapphire px-2.5 py-1 rounded-md font-bold uppercase tracking-widest border border-blue-100/40">
                      Order Management
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getStatusStyles(selectedOrder.status).bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(selectedOrder.status).dot}`} />
                      {selectedOrder.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-3 tracking-tight flex items-center gap-3">
                    Order <span className="flex items-center gap-1.5 font-mono text-sapphire bg-sapphire/5 px-3 py-1 rounded-xl border border-sapphire/10 shadow-sm"><Hash size={18} className="text-sapphire/50" /> {selectedOrder.id}</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" /> Placed on {selectedOrder.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 border border-gray-200 flex items-center justify-center shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white max-h-[calc(90vh-100px)]">
                
                {/* Left Area: Status, Info & Items */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Status Editor Card */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Package size={14} className="text-sapphire" /> Delivery Action
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">Update current status in real-time</p>
                    </div>
                    <div className="flex gap-3">
                      <CustomSelect 
                        value={tempStatus}
                        onChange={setTempStatus}
                        options={updateStatusOptions}
                        className="min-w-[140px]"
                      />
                      <button
                        onClick={handleStatusUpdate}
                        className="bg-gradient-to-r from-sapphire to-blue-600 hover:from-deep-navy hover:to-sapphire shadow-md shadow-sapphire/20 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer border-none flex items-center gap-2 hover:-translate-y-0.5"
                      >
                        <RefreshCw size={14} /> Update
                      </button>
                    </div>
                  </div>

                  {/* Customer Information Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Recipient Details Card */}
                    <div className="border border-gray-100 rounded-3xl p-5 bg-gray-50/50 shadow-sm relative overflow-hidden group">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                        <User size={14} className="text-sapphire" /> Recipient Details
                      </h4>
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-sapphire to-blue-400 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-md shadow-sapphire/10">
                          {selectedOrder.customer.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{selectedOrder.customer}</p>
                          <p className="text-[10px] bg-blue-50 text-sapphire px-2 py-0.5 rounded font-bold inline-block mt-0.5 border border-blue-100/30">Customer Profile</p>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-gray-100 pt-3 text-xs">
                        <div className="flex items-center justify-between text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> Email</span>
                          <span className="font-bold text-gray-900">{selectedOrder.email}</span>
                        </div>
                        {selectedOrder.billingInfo.phone && (
                          <div className="flex items-center justify-between text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> Phone</span>
                            <span className="font-bold text-gray-900">{selectedOrder.billingInfo.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Destination Card */}
                    <div className="border border-gray-100 rounded-3xl p-5 bg-gray-50/50 shadow-sm relative overflow-hidden group">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                        <MapPin size={14} className="text-sapphire" /> Delivery Destination
                      </h4>
                      <div className="bg-white p-3 rounded-2xl border border-gray-100 flex gap-3 text-xs shadow-sm">
                        <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 text-sapphire shrink-0 flex items-center justify-center h-fit mt-0.5">
                          <MapPin size={14} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Street Address</span>
                          <p className="font-bold text-gray-900 leading-relaxed break-words">{selectedOrder.billingInfo.address}</p>
                          <p className="font-medium text-gray-500 mt-1">{selectedOrder.billingInfo.city}, {selectedOrder.billingInfo.state} {selectedOrder.billingInfo.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm space-y-4 relative overflow-hidden">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ordered Product Cart</h4>
                      <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full font-bold">{selectedOrder.items.length} Product Line</span>
                    </div>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-gray-200 shrink-0 shadow-sm bg-white" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 font-bold mt-0.5">${item.price.toFixed(2)} <span className="font-medium text-gray-300 mx-1">x</span> {item.quantity}</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Financial Receipt Summary */}
                    <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Items Subtotal</span>
                        <span className="text-gray-900 font-bold">${(selectedOrder.total * 0.9).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Estimated Shipping</span>
                        <span className="text-emerald-600 font-bold">FREE</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>VAT / Tax (10%)</span>
                        <span className="text-gray-900 font-bold">${(selectedOrder.total * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100 bg-gradient-to-r from-sapphire/5 via-blue-50/10 to-transparent p-4 rounded-2xl border border-sapphire/10">
                        <span className="font-bold text-gray-900 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                          <CreditCard size={12} className="text-sapphire" /> Total Grand Paid
                        </span>
                        <span className="font-bold text-xl text-sapphire">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Area: Timeline */}
                <div className="border border-gray-100 rounded-3xl p-6 bg-gray-50/50 flex flex-col justify-between h-fit relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full -z-10" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Delivery Milestone</h4>
                    <div className="space-y-6">
                      
                      {/* Step 1: Placed */}
                      <div className="flex gap-4 relative">
                        <div className="absolute left-[13px] top-6 bottom-[-24px] w-0.5 bg-green-200"></div>
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <CheckCircle size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Order Placed</p>
                          <p className="text-[10px] text-gray-500 font-medium mt-0.5">{selectedOrder.date}</p>
                        </div>
                      </div>

                      {/* Step 2: Payment */}
                      <div className="flex gap-4 relative">
                        <div className="absolute left-[13px] top-6 bottom-[-24px] w-0.5 bg-green-200"></div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${
                          selectedOrder.status !== 'Cancelled' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' 
                            : 'bg-rose-50 text-rose-600 border border-rose-100/50'
                        }`}>
                          {selectedOrder.status === 'Cancelled' ? (
                            <X size={14} />
                          ) : (
                            <ShieldCheck size={14} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            {selectedOrder.status === 'Cancelled' ? 'Order Cancelled' : 'Payment Verified'}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium mt-0.5">{selectedOrder.date}</p>
                        </div>
                      </div>

                      {/* Step 3: Shipped */}
                      <div className="flex gap-4 relative">
                        {selectedOrder.status !== 'Cancelled' && (
                          <div className="absolute left-[13px] top-6 bottom-[-24px] w-0.5 bg-gray-200"></div>
                        )}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm transition-all duration-300 ${
                          ['Shipped', 'Delivered'].includes(selectedOrder.status) 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100/50 ring-4 ring-blue-50/40' 
                            : 'bg-white border border-gray-200 text-gray-300'
                        }`}>
                          <Truck size={12} className={selectedOrder.status === 'Shipped' ? 'animate-pulse text-blue-600' : ''} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'text-gray-900' : 'text-gray-400'}`}>
                            Order Shipped
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                            {['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'Completed & Handed to Carrier' : 'Pending dispatch'}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Delivered */}
                      {selectedOrder.status !== 'Cancelled' && (
                        <div className="flex gap-4">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm transition-all duration-300 ${
                            selectedOrder.status === 'Delivered' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50 ring-4 ring-emerald-50/40' 
                              : 'bg-white border border-gray-200 text-gray-300'
                          }`}>
                            <Package size={12} className={selectedOrder.status === 'Delivered' ? 'text-emerald-600' : ''} />
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${selectedOrder.status === 'Delivered' ? 'text-gray-900' : 'text-gray-400'}`}>
                              Order Delivered
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                              {selectedOrder.status === 'Delivered' ? 'Delivered successfully' : 'Awaiting delivery destination'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
