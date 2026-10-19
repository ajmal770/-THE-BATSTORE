import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id?: string;
  name?: string;
  phone?: string;
  pincode?: string;
  locality?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  landmark?: string;
  alternatePhone?: string;
  addressType?: 'Home' | 'Work';
  label?: string;
  isDefault?: boolean;
}

export interface PaymentCard {
  id: string;
  name: string;
  cardNumber: string; // Stored masked in a real app
  expiry: string;
  brand: string;
  theme?: 'sapphire' | 'obsidian' | 'emerald' | 'violet' | 'gold';
  isDefault?: boolean;
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
  firstName?: string;
  lastName?: string;
  gender?: string;
  avatar: string | null;
  phone: string;
  shippingAddress: Address;
  billingAddress: Address;
  savedAddresses: Address[];
  savedCards: PaymentCard[];
  preferences: ProfilePreferences;
  updateProfile: (data: Partial<ProfileState>) => void;
  resetProfile: () => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addCard: (card: PaymentCard) => void;
  removeCard: (id: string) => void;
  setDefaultCard: (id: string) => void;
}

const initialState = {
  fullName: '',
  firstName: '',
  lastName: '',
  gender: '',
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
      resetProfile: () => set(() => ({ ...initialState })),
      addAddress: (address) => set((state) => {
        const isFirst = state.savedAddresses.length === 0;
        const newAddr = { ...address, isDefault: address.isDefault ?? isFirst };
        const updatedList = [...state.savedAddresses, newAddr];
        return {
          savedAddresses: updatedList,
          shippingAddress: newAddr.isDefault ? newAddr : state.shippingAddress
        };
      }),
      updateAddress: (id, updated) => set((state) => {
        const updatedList = state.savedAddresses.map(a => a.id === id ? { ...a, ...updated } : a);
        const updatedItem = updatedList.find(a => a.id === id);
        return {
          savedAddresses: updatedList,
          shippingAddress: updatedItem?.isDefault ? { ...state.shippingAddress, ...updatedItem } : state.shippingAddress
        };
      }),
      removeAddress: (id) => set((state) => {
        const target = state.savedAddresses.find(a => a.id === id);
        const remaining = state.savedAddresses.filter(a => a.id !== id);
        let newShipping = state.shippingAddress;
        if (target?.isDefault) {
          if (remaining.length > 0) {
            remaining[0] = { ...remaining[0], isDefault: true };
            newShipping = remaining[0];
          } else {
            newShipping = { street: '', city: '', state: '', zip: '' };
          }
        }
        return {
          savedAddresses: remaining,
          shippingAddress: newShipping
        };
      }),
      setDefaultAddress: (id) => set((state) => {
        let defaultAddr = state.shippingAddress;
        const updatedList = state.savedAddresses.map(a => {
          if (a.id === id) {
            defaultAddr = { ...a, isDefault: true };
            return defaultAddr;
          }
          return { ...a, isDefault: false };
        });
        return {
          savedAddresses: updatedList,
          shippingAddress: defaultAddr
        };
      }),
      addCard: (card) => set((state) => {
        const isFirst = state.savedCards.length === 0;
        const newCard = { ...card, isDefault: card.isDefault ?? isFirst };
        return { savedCards: [...state.savedCards, newCard] };
      }),
      removeCard: (id) => set((state) => {
        const target = state.savedCards.find(c => c.id === id);
        const remaining = state.savedCards.filter(c => c.id !== id);
        if (target?.isDefault && remaining.length > 0) {
          remaining[0] = { ...remaining[0], isDefault: true };
        }
        return { savedCards: remaining };
      }),
      setDefaultCard: (id) => set((state) => ({
        savedCards: state.savedCards.map(c => ({
          ...c,
          isDefault: c.id === id
        }))
      })),
    }),
    {
      name: 'thebatstore-profile-storage',
    }
  )
);
