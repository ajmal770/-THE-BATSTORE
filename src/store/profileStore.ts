import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id?: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface PaymentCard {
  id: string;
  name: string;
  cardNumber: string; // Stored masked in a real app
  expiry: string;
  brand: string;
}

export interface ProfilePreferences {
  orderUpdates: boolean;
  promotions: boolean;
  language?: string;
  currency?: string;
  twoFactorEnabled?: boolean;
}

export interface ProfileState {
  fullName: string;
  avatar: string | null;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
  savedAddresses: Address[];
  savedCards: PaymentCard[];
  preferences: ProfilePreferences;
  updateProfile: (data: Partial<ProfileState>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  addCard: (card: PaymentCard) => void;
  removeCard: (id: string) => void;
}

const initialState = {
  fullName: '',
  avatar: null,
  phone: '',
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
  billingAddress: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
  savedAddresses: [],
  savedCards: [],
  preferences: {
    orderUpdates: true,
    promotions: false,
    language: 'English (US)',
    currency: 'USD ($)',
    twoFactorEnabled: false,
  },
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...initialState,
      updateProfile: (data) => set((state) => ({ ...state, ...data })),
      addAddress: (address) => set((state) => ({ savedAddresses: [...state.savedAddresses, address] })),
      removeAddress: (id) => set((state) => ({ savedAddresses: state.savedAddresses.filter(a => a.id !== id) })),
      addCard: (card) => set((state) => ({ savedCards: [...state.savedCards, card] })),
      removeCard: (id) => set((state) => ({ savedCards: state.savedCards.filter(c => c.id !== id) })),
    }),
    {
      name: 'postscout-profile-storage',
    }
  )
);
