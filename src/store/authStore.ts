import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}

export interface AdminAccount {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  createdAt: string;
  role: 'ADMIN';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface RegisteredUser {
  uid: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatar?: string | null;
  shippingAddress?: Address;
  billingAddress?: Address;
}

interface AuthState {
  user: AppUser | null;
  firebaseUser: any | null;
  isLoading: boolean;
  adminAccounts: AdminAccount[];
  registeredUsers: RegisteredUser[];
  setUser: (user: AppUser | null, firebaseUser: any | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
  addAdminAccount: (admin: AdminAccount) => void;
  deleteAdminAccount: (uid: string) => void;
  registerUser: (user: Omit<RegisteredUser, 'uid' | 'role'> & { role?: UserRole }) => { success: boolean; error?: string; user?: RegisteredUser };
  updateUser: (uid: string, data: Partial<RegisteredUser>) => void;
  deleteUser: (uid: string) => void;
}

const defaultRegisteredUsers: RegisteredUser[] = [
  { uid: 'USR-1', email: 'john@example.com', password: 'Password123', role: 'CUSTOMER', displayName: 'John Doe' },
  { uid: 'USR-2', email: 'sarah.s@example.com', password: 'Password123', role: 'CUSTOMER', displayName: 'Sarah Smith' },
  { uid: 'USR-3', email: 'admin@postscout.com', password: 'Admin@123', role: 'ADMIN', displayName: 'Admin User' },
  { uid: 'USR-4', email: 'mikej@example.com', password: 'Password123', role: 'CUSTOMER', displayName: 'Mike Johnson' },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      firebaseUser: null,
      isLoading: false,
      adminAccounts: [],
      registeredUsers: defaultRegisteredUsers,
      setUser: (user, firebaseUser) => set({ user, firebaseUser, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, firebaseUser: null, isLoading: false }),
      addAdminAccount: (admin) =>
        set((state) => ({ adminAccounts: [...state.adminAccounts, admin] })),
      deleteAdminAccount: (uid) =>
        set((state) => ({ adminAccounts: state.adminAccounts.filter((a) => a.uid !== uid) })),
      registerUser: (newUser) => {
        const state = get();
        const emailLower = newUser.email.toLowerCase();
        
        // Check if email already exists in registeredUsers or adminAccounts
        const emailExists = state.registeredUsers.some((u) => u.email.toLowerCase() === emailLower) ||
                            state.adminAccounts.some((a) => a.email.toLowerCase() === emailLower) ||
                            emailLower === 'superadmin@postscout.com';
                            
        if (emailExists) {
          return { success: false, error: 'Email address is already in use by another account.' };
        }

        const createdUser: RegisteredUser = {
          uid: `USR-${Date.now().toString().slice(-4)}`,
          email: newUser.email,
          password: newUser.password,
          displayName: newUser.displayName,
          role: newUser.role || 'CUSTOMER',
        };

        set({ registeredUsers: [...state.registeredUsers, createdUser] });
        return { success: true, user: createdUser };
      },
      updateUser: (uid, data) => 
        set((state) => ({
          registeredUsers: state.registeredUsers.map(u => 
            u.uid === uid ? { ...u, ...data } : u
          ),
          // Also update the current active user if they are the one being updated
          user: state.user?.uid === uid ? { ...state.user, displayName: data.displayName || state.user.displayName } : state.user
        })),
      deleteUser: (uid) =>
        set((state) => ({
          registeredUsers: state.registeredUsers.filter((u) => u.uid !== uid),
          adminAccounts: state.adminAccounts.filter((a) => a.uid !== uid),
        })),
    }),
    { 
      name: 'postscout-auth-storage', 
      partialize: (state) => ({ 
        user: state.user,
        firebaseUser: state.firebaseUser,
        adminAccounts: state.adminAccounts, 
        registeredUsers: state.registeredUsers 
      }) 
    }
  )
);
