import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  joined: string;
}

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'joined' | 'orders' | 'totalSpent' | 'status' | 'role'> & Partial<Pick<Customer, 'role' | 'status'>>) => void;
  updateCustomerStatus: (id: string, status: Customer['status']) => void;
  updateCustomerRole: (id: string, role: Customer['role']) => void;
  recordCustomerOrder: (email: string, amount: number) => void;
  deleteCustomer: (id: string) => void;
  syncWithAuthUsers: (authUsers: Array<{ uid?: string; email: string; displayName?: string; role?: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' }>) => void;
}

const initialCustomers: Customer[] = [
  { id: 'USR-1', name: 'John Doe', email: 'john@example.com', orders: 12, totalSpent: 1250.00, status: 'Active', role: 'CUSTOMER', joined: 'Jan 12, 2026' },
  { id: 'USR-2', name: 'Sarah Smith', email: 'sarah.s@example.com', orders: 3, totalSpent: 340.50, status: 'Active', role: 'CUSTOMER', joined: 'Mar 05, 2026' },
  { id: 'USR-3', name: 'Admin User', email: 'admin@postscout.com', orders: 0, totalSpent: 0, status: 'Active', role: 'ADMIN', joined: 'Dec 01, 2025' },
  { id: 'USR-4', name: 'Mike Johnson', email: 'mikej@example.com', orders: 1, totalSpent: 89.99, status: 'Inactive', role: 'CUSTOMER', joined: 'Jun 22, 2026' },
];

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      customers: initialCustomers,
      addCustomer: (cust) =>
        set((state) => {
          // Check if customer email already exists
          const exists = state.customers.some((c) => c.email.toLowerCase() === cust.email.toLowerCase());
          if (exists) return {};

          const newCustomer: Customer = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            name: cust.name,
            email: cust.email,
            orders: 0,
            totalSpent: 0,
            status: cust.status || 'Active',
            role: cust.role || 'CUSTOMER',
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          };
          return { customers: [...state.customers, newCustomer] };
        }),
      updateCustomerStatus: (id, status) =>
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      updateCustomerRole: (id, role) =>
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, role } : c)),
        })),
      recordCustomerOrder: (email, amount) =>
        set((state) => {
          const exists = state.customers.some((c) => c.email.toLowerCase() === email.toLowerCase());
          if (!exists) {
            // Create customer on the fly
            const newCust: Customer = {
              id: `USR-${Date.now().toString().slice(-4)}`,
              name: email.split('@')[0],
              email,
              orders: 1,
              totalSpent: amount,
              status: 'Active',
              role: 'CUSTOMER',
              joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            };
            return { customers: [...state.customers, newCust] };
          }
          return {
            customers: state.customers.map((c) =>
              c.email.toLowerCase() === email.toLowerCase()
                ? { ...c, orders: c.orders + 1, totalSpent: c.totalSpent + amount }
                : c
            ),
          };
        }),
      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),
      syncWithAuthUsers: (authUsers) =>
        set((state) => {
          let updatedCustomers = [...state.customers];
          let modified = false;

          // Always ensure superadmin is in the list
          const hasSuperAdmin = updatedCustomers.some((c) => c.email.toLowerCase() === 'superadmin@postscout.com');
          if (!hasSuperAdmin) {
            updatedCustomers.push({
              id: 'superadmin-001',
              name: 'Super Admin',
              email: 'superadmin@postscout.com',
              orders: 0,
              totalSpent: 0,
              status: 'Active',
              role: 'SUPER_ADMIN',
              joined: 'Jan 01, 2026',
            });
            modified = true;
          }

          for (const u of authUsers) {
            const emailLower = u.email.toLowerCase();
            const existingIndex = updatedCustomers.findIndex((c) => c.email.toLowerCase() === emailLower);
            if (existingIndex === -1) {
              updatedCustomers.push({
                id: u.uid || `USR-${Date.now().toString().slice(-4)}`,
                name: u.displayName || u.email.split('@')[0],
                email: u.email,
                orders: 0,
                totalSpent: 0,
                status: 'Active',
                role: u.role || 'CUSTOMER',
                joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              });
              modified = true;
            } else {
              const existing = updatedCustomers[existingIndex];
              if (u.role && existing.role !== u.role) {
                updatedCustomers[existingIndex] = { ...existing, role: u.role };
                modified = true;
              }
              if (u.displayName && existing.name !== u.displayName) {
                updatedCustomers[existingIndex] = { ...existing, name: u.displayName };
                modified = true;
              }
            }
          }

          return modified ? { customers: updatedCustomers } : {};
        }),
    }),
    { name: 'postscout-customers-storage' }
  )
);
