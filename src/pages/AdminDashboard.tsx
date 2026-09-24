import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  Download,
  CheckCircle2,
  X,
  Truck,
  Clock,
  XCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import type { Order } from '../store/orderStore';
import { useCustomerStore } from '../store/customerStore';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ title, value, change, isPositive, icon: Icon }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl shadow-gray-200/10 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10" />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1.5">{title}</p>
        <h3 className="text-3xl font-medium text-gray-900 tracking-tight">{value}</h3>
      </div>
      <div className="p-3 bg-blue-50 text-sapphire rounded-2xl shadow-sm">
        <Icon size={24} className="stroke-[2]" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs font-semibold">
      <span className={`flex items-center px-2 py-0.5 rounded-full ${
        isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
      }`}>
        {isPositive ? <ArrowUpRight size={14} className="mr-0.5 stroke-[2.5]" /> : <ArrowDownRight size={14} className="mr-0.5 stroke-[2.5]" />}
        {change}%
      </span>
      <span className="text-gray-400 ml-2 font-medium">vs last month</span>
    </div>
  </motion.div>
);

const AdminDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useOrderStore();
  const { customers } = useCustomerStore();

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [exportGroups, setExportGroups] = useState({ orders: true, customers: true, products: true });
  const [exportRange, setExportRange] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Chart States
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [chartView, setChartView] = useState<'orders' | 'monthly'>('orders');

  // Calculate dynamic stats
  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const conversionRate = totalCustomers > 0 ? ((totalOrders / (totalCustomers * 2.5)) * 100).toFixed(2) : '0.00';

  // Get recent orders
  const recentOrdersList = orders.slice(0, 5);

  // SVG Chart Calculations
  const chartWidth = 500;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Chart Data Mapping
  const chartData = orders.slice(-6).reverse(); // Last 6 orders
  const maxVal = Math.max(...chartData.map(o => o.total), 100);
  const points = chartData.map((o, idx) => {
    const x = paddingX + (idx * (chartWidth - paddingX * 2)) / (chartData.length - 1 || 1);
    const y = chartHeight - paddingY - (o.total / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, value: o.total, label: o.id.slice(-6), order: o };
  });

  // SVG path definitions
  const linePath = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  const handleExportSubmit = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export progress animation
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Trigger actual download
            const dataToExport: any = {};
            if (exportGroups.orders) dataToExport.orders = orders;
            if (exportGroups.customers) dataToExport.customers = customers;
            
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `thebatstore_report_${Date.now()}.${exportFormat.toLowerCase()}`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            setIsExporting(false);
            setExportSuccess(true);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const closeExportModal = () => {
    setShowExportModal(false);
    setExportSuccess(false);
    setIsExporting(false);
    setExportProgress(0);
  };

  const handleStatusChange = (id: string, newStatus: Order['status']) => {
    updateOrderStatus(id, newStatus);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle2 };
      case 'Shipped':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-100', icon: Truck };
      case 'Processing':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock };
      case 'Cancelled':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-100', icon: XCircle };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">Real-time store metrics synchronized with customer activities.</p>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-2xl text-sm font-medium hover:shadow-xl hover:shadow-sapphire/25 transition-all duration-300 flex items-center gap-2 cursor-pointer border-none"
        >
          <Download size={18} className="stroke-[2.5]" /> Export Report
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} change="12.5" isPositive={true} icon={DollarSign} />
        <StatCard title="Total Orders" value={totalOrders.toString()} change="8.2" isPositive={true} icon={ShoppingBag} />
        <StatCard title="Total Customers" value={totalCustomers.toString()} change="4.3" isPositive={true} icon={Users} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} change="0.8" isPositive={false} icon={TrendingUp} />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive Revenue Overview Graph */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/10 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 tracking-tight">Revenue Overview</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Visual overview of order values</p>
            </div>
            <div className="flex bg-gray-100/60 p-1.5 rounded-xl border border-gray-100">
              <button 
                onClick={() => setChartView('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border-none cursor-pointer ${
                  chartView === 'orders' ? 'bg-white text-sapphire shadow-sm' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
              <button 
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border-none cursor-pointer ${
                  chartView === 'monthly' ? 'bg-white text-sapphire shadow-sm' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="relative h-64 w-full bg-gradient-to-b from-gray-50/20 to-white rounded-2xl border border-gray-50 p-4 flex items-center justify-center">
            {chartView === 'orders' ? (
              <div className="w-full h-full flex flex-col justify-between">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B3C5D" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0B3C5D" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#F3F4F6" strokeWidth="1" />
                  <line x1={paddingX} y1={(chartHeight - paddingY * 2) / 2 + paddingY} x2={chartWidth - paddingX} y2={(chartHeight - paddingY * 2) / 2 + paddingY} stroke="#F3F4F6" strokeWidth="1" />
                  <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#E5E7EB" strokeWidth="1" />

                  {/* Area Fill */}
                  {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}
                  
                  {/* Connect Line */}
                  {linePath && <path d={linePath} fill="none" stroke="#0B3C5D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}

                  {/* Point circles & hover tags */}
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r="6" 
                        fill="#FFFFFF" 
                        stroke="#0B3C5D" 
                        strokeWidth="3"
                        className="cursor-pointer transition-all hover:r-8"
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      {/* Tooltip Overlay */}
                      {hoveredPoint === idx && (
                        <g>
                          <rect 
                            x={p.x - 45} 
                            y={p.y - 35} 
                            width="90" 
                            height="24" 
                            rx="6" 
                            fill="#0B3C5D" 
                            className="shadow-lg"
                          />
                          <text 
                            x={p.x} 
                            y={p.y - 19} 
                            fill="#FFFFFF" 
                            textAnchor="middle" 
                            fontSize="10" 
                            fontWeight="bold"
                          >
                            ${p.value.toFixed(2)}
                          </text>
                        </g>
                      )}
                      {/* X labels */}
                      <text 
                        x={p.x} 
                        y={chartHeight - 8} 
                        fill="#9CA3AF" 
                        textAnchor="middle" 
                        fontSize="9" 
                        fontWeight="bold"
                        className="font-mono"
                      >
                        {p.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                  <AlertCircle size={24} />
                </div>
                <h4 className="font-extrabold text-gray-900 text-sm">Monthly Data Pending</h4>
                <p className="text-xs text-gray-400 max-w-xs font-medium">Accumulating additional monthly aggregate transaction records to render complete trends.</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-sapphire rounded-full" /> Total Order Revenue</span>
            <span>Last 6 Orders</span>
          </div>
        </div>

        {/* Recent Orders List Panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl shadow-gray-200/10 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 tracking-tight">Recent Orders</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{orders.length} total orders</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {recentOrdersList.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-semibold text-sm">No orders placed yet.</div>
              ) : (
                recentOrdersList.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  const StatusIcon = statusStyle.icon;
                  return (
                    <motion.div 
                      key={order.id} 
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedOrder(order)}
                      className="p-3 bg-gradient-to-r from-gray-50/50 to-white hover:from-white hover:to-white border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md hover:border-sapphire/15 transition-all duration-300 group"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <p className="font-extrabold text-gray-900 text-xs sm:text-sm group-hover:text-sapphire transition-colors truncate">{order.id}</p>
                          <span className="p-1 hover:bg-gray-100 rounded-md text-gray-400 group-hover:text-sapphire transition-all shrink-0">
                            <Eye size={12} />
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate">{order.customer}</p>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm">${order.total.toFixed(2)}</p>
                        <span className={`text-[9px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 uppercase tracking-wider ${statusStyle.bg}`}>
                          <StatusIcon size={9} className="stroke-[3]" />
                          {order.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
          
          <p className="text-[11px] text-gray-400 font-medium border-t border-gray-100/60 pt-4 text-center mt-4">
            Click on any order row to inspect full details and manage shipment.
          </p>
        </div>
      </div>

      {/* Export Report Dialog Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeExportModal}
              className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden z-10"
            >
              <button 
                onClick={closeExportModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none"
              >
                <X size={16} />
              </button>

              {!exportSuccess ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 tracking-tight flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-sapphire rounded-xl">
                        <FileText size={20} className="stroke-[2.5]" />
                      </div>
                      Export Data Report
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-semibold">Customize filters to extract store statistics.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Format */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">File Format</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['JSON', 'CSV'] as const).map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setExportFormat(fmt)}
                            className={`py-3.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              exportFormat === fmt 
                                ? 'bg-sapphire text-white border-sapphire shadow-lg shadow-sapphire/15'
                                : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                            }`}
                          >
                            {fmt} Format
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Data Groups */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">Included Data Groups</label>
                      <div className="space-y-2.5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={exportGroups.orders} 
                            onChange={(e) => setExportGroups({...exportGroups, orders: e.target.checked})} 
                            className="rounded border-gray-300 text-sapphire focus:ring-sapphire w-4 h-4 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-gray-700">Order Transactions & Items</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={exportGroups.customers} 
                            onChange={(e) => setExportGroups({...exportGroups, customers: e.target.checked})} 
                            className="rounded border-gray-300 text-sapphire focus:ring-sapphire w-4 h-4 cursor-pointer"
                          />
                          <span className="text-xs font-medium text-gray-700">Registered Customer Directories</span>
                        </label>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest">Date Range</label>
                      <select 
                        value={exportRange} 
                        onChange={(e) => setExportRange(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire"
                      >
                        <option value="all">All Time Records</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="7days">Last 7 Days</option>
                      </select>
                    </div>
                  </div>

                  {isExporting ? (
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                        <span>Compiling records...</span>
                        <span>{exportProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sapphire transition-all duration-100" 
                          style={{ width: `${exportProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={closeExportModal}
                        className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-medium transition-all cursor-pointer border border-gray-100"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={handleExportSubmit}
                        className="flex-1 py-3.5 bg-sapphire text-white rounded-xl text-xs font-medium hover:bg-deep-navy shadow-lg shadow-sapphire/15 transition-all cursor-pointer border-none"
                      >
                        Start Export
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-emerald-50 text-emerald-500 rounded-full">
                    <CheckCircle2 size={40} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Report Exported Successfully</h3>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Your customized data compile report was downloaded to your local device downloads folder.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={closeExportModal}
                    className="w-full py-3.5 bg-sapphire text-white rounded-xl text-xs font-medium hover:bg-deep-navy shadow-md border-none cursor-pointer mt-4"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Recent Order Details View Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 shrink-0">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 tracking-tight flex items-center gap-2">
                    Order Details
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{selectedOrder.id} placed {selectedOrder.date}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-1">
                {/* Status and Actions block */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Order Status</span>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-md border flex items-center gap-1 uppercase tracking-wider ${
                      getStatusStyle(selectedOrder.status).bg
                    }`}>
                      {React.createElement(getStatusStyle(selectedOrder.status).icon, { size: 10, className: "stroke-[3]" })}
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-medium text-gray-500 shrink-0">Update:</span>
                    <select 
                      value={selectedOrder.status} 
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-700 outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire cursor-pointer flex-1 sm:flex-none"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest">Customer Details</h4>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2 shadow-sm">
                      <p className="text-sm font-extrabold text-gray-900">{selectedOrder.customer}</p>
                      <p className="text-xs text-gray-500 font-semibold">{selectedOrder.email}</p>
                      <div className="border-t border-gray-100/60 pt-2.5 mt-2.5 space-y-1">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Shipping Address</p>
                        <p className="text-xs text-gray-600 font-semibold">{selectedOrder.billingInfo.address}</p>
                        <p className="text-xs text-gray-600 font-semibold">
                          {selectedOrder.billingInfo.city}, {selectedOrder.billingInfo.state} {selectedOrder.billingInfo.zipCode}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold pt-1">📞 {selectedOrder.billingInfo.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest">Items Summary</h4>
                    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm max-h-[220px] overflow-y-auto">
                      {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center border-b border-gray-50 pb-3 last:border-none last:pb-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-extrabold text-gray-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">Qty: {item.quantity} • ${item.price.toFixed(2)}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-xs font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center shrink-0">
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Value Paid</p>
                  <p className="text-xl font-medium text-sapphire">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-medium transition-all border border-gray-100 cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
