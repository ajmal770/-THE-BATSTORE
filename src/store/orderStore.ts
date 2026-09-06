import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  userId?: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemsCount: number;
  items: OrderItem[];
  billingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    customer: 'Alex Johnson',
    email: 'alex@example.com',
    date: 'Oct 24, 2026',
    total: 349.99,
    status: 'Processing',
    itemsCount: 2,
    items: [
      { id: '3', name: 'Premium Noise-Cancelling Headphones', price: 349.99, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' }
    ],
    billingInfo: { firstName: 'Alex', lastName: 'Johnson', address: '456 Oak Lane', city: 'Austin', state: 'TX', zipCode: '78701', phone: '5125550192' }
  },
  {
    id: 'ORD-2026-002',
    customer: 'Maria Garcia',
    email: 'maria@example.com',
    date: 'Oct 23, 2026',
    total: 129.50,
    status: 'Shipped',
    itemsCount: 1,
    items: [
      { id: '6', name: 'Mechanical Keyboard', price: 129.50, quantity: 1, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' }
    ],
    billingInfo: { firstName: 'Maria', lastName: 'Garcia', address: '789 Maple Ave', city: 'Miami', state: 'FL', zipCode: '33101', phone: '3055550143' }
  },
  {
    id: 'ORD-2026-003',
    customer: 'James Smith',
    email: 'james@example.com',
    date: 'Oct 22, 2026',
    total: 1998.00,
    status: 'Delivered',
    itemsCount: 1,
    items: [
      { id: '1', name: 'Sony Alpha a7 III Camera', price: 1998.00, quantity: 1, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80' }
    ],
    billingInfo: { firstName: 'James', lastName: 'Smith', address: '123 Pine St', city: 'Seattle', state: 'WA', zipCode: '98101', phone: '2065550122' }
  },
  {
    id: 'ORD-2026-004',
    customer: 'Linda Davis',
    email: 'linda@example.com',
    date: 'Oct 21, 2026',
    total: 45.00,
    status: 'Cancelled',
    itemsCount: 3,
    items: [
      { id: '7', name: 'Wireless Charging Pad', price: 39.99, quantity: 1, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80' }
    ],
    billingInfo: { firstName: 'Linda', lastName: 'Davis', address: '321 Elm Rd', city: 'Boston', state: 'MA', zipCode: '02101', phone: '6175550181' }
  },
  {
    id: 'ORD-2026-005',
    customer: 'Robert Wilson',
    email: 'robert@example.com',
    date: 'Oct 20, 2026',
    total: 890.00,
    status: 'Processing',
    itemsCount: 4,
    items: [
      { id: '5', name: 'Ergonomic Office Chair', price: 249.99, quantity: 2, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80' }
    ],
    billingInfo: { firstName: 'Robert', lastName: 'Wilson', address: '555 Birch Blvd', city: 'Denver', state: 'CO', zipCode: '80201', phone: '3035550115' }
  }
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: initialOrders,
      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id: `ORD-${Date.now().toString().slice(-6)}`,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            },
            ...state.orders,
          ],
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),
    }),
    { name: 'thebatstore-orders-storage' }
  )
);
