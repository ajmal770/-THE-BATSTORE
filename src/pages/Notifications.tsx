import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCheck, Trash2, X, ArrowLeft, Package, 
  ShieldCheck, Tag, Wrench, ShoppingBag, ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';
import { useNotificationStore } from '../store/notificationStore';
import type { NotificationCategory, AppNotification } from '../store/notificationStore';

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORY_META: Record<NotificationCategory, {
  label: string; color: string; dot: string; bg: string; icon: React.ReactNode;
}> = {
  order:   { label: 'Orders',      color: 'text-blue-700',   dot: 'bg-blue-500',   bg: 'bg-blue-50 border-blue-200',       icon: <Package size={14} /> },
  account: { label: 'Account',     color: 'text-violet-700', dot: 'bg-violet-500', bg: 'bg-violet-50 border-violet-200',   icon: <ShieldCheck size={14} /> },
  promo:   { label: 'Promotions',  color: 'text-amber-700',  dot: 'bg-amber-500',  bg: 'bg-amber-50 border-amber-200',     icon: <Tag size={14} /> },
  system:  { label: 'System',      color: 'text-slate-600',  dot: 'bg-slate-400',  bg: 'bg-slate-100 border-slate-200',    icon: <Wrench size={14} /> },
};

function timeAgo(isoString: string): string {
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60)     return 'just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type FilterTab = 'all' | NotificationCategory;

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.category === activeFilter);

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all',     label: 'All',        count: notifications.length },
    { id: 'order',   label: 'Orders',     count: notifications.filter(n => n.category === 'order').length },
    { id: 'account', label: 'Account',    count: notifications.filter(n => n.category === 'account').length },
    { id: 'promo',   label: 'Promotions', count: notifications.filter(n => n.category === 'promo').length },
    { id: 'system',  label: 'System',     count: notifications.filter(n => n.category === 'system').length },
  ];

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO title="Notifications" description="View your real-time order updates, account security alerts, and live promotions." />

      {/* Hero Banner */}
      <div className="h-48 bg-gradient-to-r from-deep-navy via-sapphire to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl -mt-12 relative z-10">
        {/* Header card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-sapphire/10 border border-gray-100 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border-none bg-transparent text-gray-500 hover:text-gray-900"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="p-2.5 bg-sapphire/10 text-sapphire rounded-xl">
                    <Bell size={22} className="stroke-[2.5]" />
                  </div>
                  <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
                  
                  {/* Real-time live status indicator */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-bold shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Stream Active</span>
                  </div>

                  {unreadCount > 0 && (
                    <span className="bg-sapphire text-white text-xs font-black px-3 py-1 rounded-full animate-pulse shadow-sm">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-14">
                  Real-time live updates for your orders, account activity, and store promotions.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-14 sm:ml-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-xs font-bold text-sapphire hover:text-deep-navy bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-all cursor-pointer border-none"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all cursor-pointer border-none"
                >
                  <Trash2 size={14} /> Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border-none ${
                  activeFilter === tab.id
                    ? 'bg-sapphire text-white shadow-md shadow-sapphire/25'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notification list */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/20 border border-gray-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="relative mb-5">
                <div className="w-20 h-20 bg-blue-50/70 border border-blue-100 text-sapphire rounded-full flex items-center justify-center shadow-inner">
                  <Bell size={36} className="stroke-[2]" />
                </div>
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800">Your live feed is clear</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed font-medium">
                There are no pending alerts. Real-time notifications for placed orders, shipment status, account updates, and exclusive promos will appear here as they happen.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => navigate('/products')}
                  className="px-5 py-2.5 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-sapphire/25 transition-all flex items-center gap-2 cursor-pointer border-none"
                >
                  <ShoppingBag size={14} /> Explore Catalog
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none"
                >
                  View My Orders
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-50/80">
              <AnimatePresence initial={false}>
                {filtered.map((notif: AppNotification) => {
                  const meta = CATEGORY_META[notif.category] || CATEGORY_META.system;
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.22 }}
                      className={`relative flex gap-4 sm:gap-5 px-5 sm:px-7 py-5 group cursor-pointer transition-colors hover:bg-gray-50/80 ${
                        !notif.isRead ? 'bg-blue-50/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      {/* Unread dot */}
                      {!notif.isRead && (
                        <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${meta.dot} shrink-0`} />
                      )}

                      {/* Icon circle */}
                      <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border ${meta.bg} ${meta.color} mt-0.5`}>
                        {meta.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm leading-snug ${!notif.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                                {notif.title}
                              </p>
                              {!notif.isRead && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-sapphire bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                          <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap shrink-0 mt-0.5">
                            {timeAgo(notif.timestamp)}
                          </span>
                        </div>

                        {/* Category label & action link */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border ${meta.bg} ${meta.color}`}>
                            {meta.icon}
                            {meta.label}
                          </span>

                          {notif.link && (
                            <span className="text-xs font-bold text-sapphire hover:underline flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              View details <ExternalLink size={12} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                        className="shrink-0 self-start mt-1 opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                        title="Delete notification"
                      >
                        <X size={15} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6 font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Real-time live notifications are active. New updates deliver automatically.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
