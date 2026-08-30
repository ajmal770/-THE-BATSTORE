import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationCategory = 'order' | 'account' | 'promo' | 'system';

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon?: string;
};

type NotificationStore = {
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, 'id' | 'isRead' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
};

const defaultNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'order',
    title: 'Order Shipped! 🚚',
    message: 'Your order ORD-2026-765 has been shipped and is on its way. Estimated delivery in 2-3 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-2',
    category: 'order',
    title: 'Order Delivered ✅',
    message: 'Your order ORD-2026-982 (Smart Thermostat) has been delivered. We hope you love it!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-3',
    category: 'promo',
    title: 'Flash Sale – 40% Off! 🔥',
    message: "Our biggest summer sale is live for the next 24 hours. Don't miss out on incredible deals.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: false,
  },
  {
    id: 'notif-4',
    category: 'account',
    title: 'Profile Updated 👤',
    message: "Your profile information has been updated successfully. If this wasn't you, please secure your account.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-5',
    category: 'account',
    title: 'New Sign-In Detected 🔐',
    message: 'A new sign-in was detected from Windows, Chrome. If this was you, no action is needed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-6',
    category: 'promo',
    title: 'Exclusive Member Reward 🎁',
    message: "As a valued member, you've earned 50 bonus loyalty points. Redeem them on your next order.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-7',
    category: 'system',
    title: 'App Update Available 🛠️',
    message: "We've made improvements to search, checkout, and performance. Refresh to get the latest version.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isRead: true,
  },
  {
    id: 'notif-8',
    category: 'system',
    title: 'Scheduled Maintenance 🔧',
    message: 'Our platform will undergo a brief maintenance window on July 22 from 2:00–3:00 AM. Service may be temporarily unavailable.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    isRead: true,
  },
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: defaultNotifications,

      addNotification: (n) => {
        const newNotif: AppNotification = {
          ...n,
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          isRead: false,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      unreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      },
    }),
    { name: 'postscout-notifications' }
  )
);
