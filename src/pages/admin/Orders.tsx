import React, { useState, useEffect } from 'react';
import { Search, Eye, Download, Package, CheckCircle, Truck, X, User, Mail, MapPin, Phone, Calendar, CreditCard, ShieldCheck, RefreshCw } from 'lucide-react';
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
      // clear router state so it doesn't re-apply on back/forward navigation
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
    link.setAttribute("download", `postscout_orders_${Date.now()}.csv`);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track customer orders, update delivery status, and review billing information.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/10 border border-gray-100 overflow-hidden flex flex-col w-full">
        <div className="p-5 border-b flex flex-wrap gap-4 justify-between items-center bg-gray-50/20">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search orders by ID or customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/15 focus:border-sapphire/35 bg-white text-gray-900 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-2.5 bg-white text-gray-900 font-bold text-xs outline-none focus:ring-2 focus:ring-sapphire/15 focus:border-sapphire/35 cursor-pointer transition-all"
            >
              <option>All Statuses</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-black">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-semibold">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-blue-50/30 transition-colors cursor-pointer group ${selectedOrderId === order.id ? 'bg-blue-50/50' : ''}`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <td className="px-6 py-4 font-black text-sapphire">{order.id}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{order.date}</td>
                    <td className="px-6 py-4 font-extrabold text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">{order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}</td>
                    <td className="px-6 py-4 font-black text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${getStatusStyles(order.status).bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(order.status).dot}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOrderSelect(order); }}
                        className="p-2 text-gray-400 hover:text-sapphire hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer border-none bg-transparent inline-flex items-center justify-center"
                      >
                        <Eye size={18} />
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrderId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 z-10"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30 relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sapphire to-blue-500" />
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[9px] bg-blue-50 text-sapphire px-2.5 py-1 rounded-md font-black uppercase tracking-widest border border-blue-100/40">
                      Order Management
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${getStatusStyles(selectedOrder.status).bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(selectedOrder.status).dot}`} />
                      {selectedOrder.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mt-2 tracking-tight flex items-center gap-2">
                    Order ID: <span className="font-extrabold text-sapphire">{selectedOrder.id}</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-bold mt-1 flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-500" /> Placed on {selectedOrder.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrderId(null)}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 border border-gray-100 flex items-center justify-center shadow-sm"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white max-h-[calc(90vh-100px)]">
                
                {/* Left Area: Status, Info & Items */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Status Editor Card */}
                  <div className="bg-gradient-to-r from-gray-50/50 via-white to-gray-50/20 border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Package size={14} className="text-sapphire" /> Delivery Action
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">Update current status in real-time</p>
                    </div>
                    <div className="flex gap-2.5">
                      <select
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value as Order['status'])}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sapphire/15 bg-white text-gray-900 transition-all focus:border-sapphire/35 cursor-pointer shadow-sm"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={handleStatusUpdate}
                        className="bg-gradient-to-r from-sapphire to-blue-600 hover:shadow-lg hover:shadow-sapphire/20 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-none flex items-center gap-1.5"
                      >
                        <RefreshCw size={13} className="stroke-[2.5]" /> Update
                      </button>
                    </div>
                  </div>

                  {/* Customer Information Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Recipient Details Card */}
                    <div className="border border-gray-100 rounded-2xl p-5 bg-gradient-to-b from-white to-gray-50/30 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10" />
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                        <User size={14} className="text-sapphire" /> Recipient Details
                      </h4>
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-sapphire to-blue-400 text-white rounded-xl flex items-center justify-center text-lg font-black shadow-md shadow-sapphire/10">
                          {selectedOrder.customer.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{selectedOrder.customer}</p>
                          <p className="text-[10px] bg-blue-50 text-sapphire px-2 py-0.5 rounded font-black inline-block mt-0.5 border border-blue-100/30">Customer Profile</p>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-gray-100/60 pt-3 text-xs">
                        <div className="flex items-center justify-between text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> Email</span>
                          <span className="font-extrabold text-gray-900">{selectedOrder.email}</span>
                        </div>
                        {selectedOrder.billingInfo.phone && (
                          <div className="flex items-center justify-between text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> Phone</span>
                            <span className="font-extrabold text-gray-900">{selectedOrder.billingInfo.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Destination Card */}
                    <div className="border border-gray-100 rounded-2xl p-5 bg-gradient-to-b from-white to-gray-50/30 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10" />
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                        <MapPin size={14} className="text-sapphire" /> Delivery Destination
                      </h4>
                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex gap-3 text-xs">
                        <div className="p-2 bg-white rounded-lg border border-gray-200/60 shadow-sm text-sapphire shrink-0 flex items-center justify-center h-fit mt-0.5">
                          <MapPin size={14} className="stroke-[2.5]" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-0.5">Street Address</span>
                          <p className="font-extrabold text-gray-900 leading-relaxed break-words">{selectedOrder.billingInfo.address}</p>
                          <p className="font-bold text-gray-500 mt-1">{selectedOrder.billingInfo.city}, {selectedOrder.billingInfo.state} {selectedOrder.billingInfo.zipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ordered Product Cart</h4>
                      <span className="text-[11px] bg-gray-50 text-gray-500 border border-gray-100 px-2.5 py-0.5 rounded-full font-black">{selectedOrder.items.length} Product Line</span>
                    </div>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-gray-50/30 p-3 rounded-xl border border-gray-50/60 hover:bg-gray-50/50 transition-colors">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-gray-100 shrink-0 shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-extrabold mt-0.5">${item.price.toFixed(2)} <span className="font-medium text-gray-300 mx-1">x</span> {item.quantity}</p>
                          </div>
                          <p className="text-xs font-black text-gray-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Financial Receipt Summary */}
                    <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-400 font-bold">
                        <span>Items Subtotal</span>
                        <span className="text-gray-900 font-extrabold">${(selectedOrder.total * 0.9).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 font-bold">
                        <span>Estimated Shipping</span>
                        <span className="text-emerald-600 font-extrabold">FREE</span>
                      </div>
                      <div className="flex justify-between text-gray-400 font-bold">
                        <span>VAT / Tax (10%)</span>
                        <span className="text-gray-900 font-extrabold">${(selectedOrder.total * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100/60 bg-gradient-to-r from-sapphire/5 via-blue-50/10 to-transparent p-3.5 rounded-xl border border-sapphire/5">
                        <span className="font-black text-gray-900 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                          <CreditCard size={12} className="text-sapphire" /> Total Grand Paid
                        </span>
                        <span className="font-black text-xl text-sapphire">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Area: Timeline */}
                <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/30 flex flex-col justify-between h-fit relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full -z-10" />
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Delivery Milestone Timeline</h4>
                    <div className="space-y-6">
                      
                      {/* Step 1: Placed */}
                      <div className="flex gap-4 relative">
                        <div className="absolute left-[13px] top-6 bottom-[-24px] w-0.5 bg-green-200"></div>
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <CheckCircle size={14} className="stroke-[2.5]" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900">Order Placed</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">{selectedOrder.date}</p>
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
                            <X size={14} className="stroke-[2.5]" />
                          ) : (
                            <ShieldCheck size={14} className="stroke-[2.5]" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900">
                            {selectedOrder.status === 'Cancelled' ? 'Order Cancelled' : 'Payment Verified'}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">{selectedOrder.date}</p>
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
                          <Truck size={12} className={`stroke-[2.5] ${selectedOrder.status === 'Shipped' ? 'animate-pulse text-blue-600' : ''}`} />
                        </div>
                        <div>
                          <p className={`text-xs font-black ${['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'text-gray-900' : 'text-gray-400'}`}>
                            Order Shipped
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-0.5">
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
                            <Package size={12} className={`stroke-[2.5] ${selectedOrder.status === 'Delivered' ? 'text-emerald-600' : ''}`} />
                          </div>
                          <div>
                            <p className={`text-xs font-black ${selectedOrder.status === 'Delivered' ? 'text-gray-900' : 'text-gray-400'}`}>
                              Order Delivered
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">
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
