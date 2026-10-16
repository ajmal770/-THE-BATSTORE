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
  link?: string;
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

// Clean real-world initial state: 0 dummy data
const initialNotifications: AppNotification[] = [];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: initialNotifications,

      addNotification: (n) => {
        const newNotif: AppNotification = {
          ...n,
          id: `live-notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
    {
      name: 'thebatstore-notifications-v2',
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.notifications)) {
          // Remove any legacy dummy test notifications
          state.notifications = state.notifications.filter(
            (n) => !['notif-1', 'notif-2', 'notif-3', 'notif-4', 'notif-5', 'notif-6', 'notif-7', 'notif-8'].includes(n.id)
          );
        }
      },
    }
  )
);

// Clear legacy dummy storage item if present on client
if (typeof window !== 'undefined') {
  try {
    const legacy = localStorage.getItem('thebatstore-notifications');
    if (legacy && legacy.includes('notif-1')) {
      localStorage.removeItem('thebatstore-notifications');
    }
  } catch {
    // Ignore storage access errors
  }
}
