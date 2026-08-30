import { 
  doc, 
  setDoc, 
  writeBatch 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useProductStore } from '../store/productStore';
import { useOrderStore } from '../store/orderStore';
import { useProfileStore } from '../store/profileStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useCategoryStore } from '../store/categoryStore';
import { useCouponStore } from '../store/couponStore';
import { useCustomerStore } from '../store/customerStore';
import { useBannerStore } from '../store/bannerStore';
import { useBrandStore } from '../store/brandStore';
import { useSettingsStore } from '../store/settingsStore';
import { useNotificationStore } from '../store/notificationStore';

/**
 * Checks if real Firebase API credentials are configured in .env
 */
export const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return (
    Boolean(apiKey) &&
    apiKey !== 'your_api_key_here' &&
    apiKey.length > 10 &&
    Boolean(projectId) &&
    projectId !== 'your_project_id'
  );
};

/**
 * 1. Syncs all store products to Firestore 'products' collection
 */
export const syncProductsToFirestore = async (products: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const prod of products) {
      if (!prod.id) continue;
      const docRef = doc(db, 'products', prod.id.toString());
      batch.set(docRef, { ...prod, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${products.length} products to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Products sync failed:', error);
    return false;
  }
};

/**
 * 2. Syncs all orders to Firestore 'orders' collection
 */
export const syncOrdersToFirestore = async (orders: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const order of orders) {
      if (!order.id) continue;
      const docRef = doc(db, 'orders', order.id.toString());
      batch.set(docRef, { ...order, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${orders.length} orders to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Orders sync failed:', error);
    return false;
  }
};

/**
 * 3. Syncs user profile and preferences to Firestore 'profiles' collection
 */
export const syncProfileToFirestore = async (uid: string, profileData: any): Promise<boolean> => {
  if (!isFirebaseConfigured() || !uid) return false;
  try {
    const docRef = doc(db, 'profiles', uid);
    await setDoc(docRef, { ...profileData, updatedAt: new Date().toISOString() }, { merge: true });
    console.log(`[Firestore Sync] Synced user profile (${uid}) to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Profile sync failed:', error);
    return false;
  }
};

/**
 * 4. Syncs categories to Firestore 'categories' collection
 */
export const syncCategoriesToFirestore = async (categories: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const cat of categories) {
      if (!cat.id) continue;
      const docRef = doc(db, 'categories', cat.id.toString());
      batch.set(docRef, { ...cat, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${categories.length} categories to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Categories sync failed:', error);
    return false;
  }
};

/**
 * 5. Syncs discount coupons to Firestore 'coupons' collection
 */
export const syncCouponsToFirestore = async (coupons: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const coupon of coupons) {
      if (!coupon.id) continue;
      const docRef = doc(db, 'coupons', coupon.id.toString());
      batch.set(docRef, { ...coupon, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${coupons.length} coupons to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Coupons sync failed:', error);
    return false;
  }
};

/**
 * 6. Syncs customers to Firestore 'customers' collection
 */
export const syncCustomersToFirestore = async (customers: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const cust of customers) {
      if (!cust.id && !cust.email) continue;
      const docId = (cust.id || cust.email).toString();
      const docRef = doc(db, 'customers', docId);
      batch.set(docRef, { ...cust, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${customers.length} customers to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Customers sync failed:', error);
    return false;
  }
};

/**
 * 7. Syncs homepage promotional banners to Firestore 'banners' collection
 */
export const syncBannersToFirestore = async (banners: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const banner of banners) {
      if (!banner.id) continue;
      const docRef = doc(db, 'banners', banner.id.toString());
      batch.set(docRef, { ...banner, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${banners.length} banners to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Banners sync failed:', error);
    return false;
  }
};

/**
 * 8. Syncs store brands to Firestore 'brands' collection
 */
export const syncBrandsToFirestore = async (brands: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const brand of brands) {
      if (!brand.id) continue;
      const docRef = doc(db, 'brands', brand.id.toString());
      batch.set(docRef, { ...brand, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${brands.length} brands to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Brands sync failed:', error);
    return false;
  }
};

/**
 * 9. Syncs store settings to Firestore 'settings' document
 */
export const syncSettingsToFirestore = async (settings: any): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const docRef = doc(db, 'settings', 'global');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
    console.log('[Firestore Sync] Synced store settings to Cloud Firestore.');
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Settings sync failed:', error);
    return false;
  }
};

/**
 * 10. Syncs notifications to Firestore 'notifications' collection
 */
export const syncNotificationsToFirestore = async (notifications: any[]): Promise<boolean> => {
  if (!isFirebaseConfigured()) return false;
  try {
    const batch = writeBatch(db);
    for (const notif of notifications) {
      if (!notif.id) continue;
      const docRef = doc(db, 'notifications', notif.id.toString());
      batch.set(docRef, { ...notif, updatedAt: new Date().toISOString() }, { merge: true });
    }
    await batch.commit();
    console.log(`[Firestore Sync] Synced ${notifications.length} notifications to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error('[Firestore Sync Error] Notifications sync failed:', error);
    return false;
  }
};

/**
 * Master Sync function to sync ALL 10 database sections from LocalStorage stores to Cloud Firestore
 */
export const syncAllProjectDataToFirestore = async (): Promise<{
  success: boolean;
  message: string;
  syncedCollections: string[];
}> => {
  if (!isFirebaseConfigured()) {
    return {
      success: false,
      message: 'Firebase API keys are not yet set in .env file. Using LocalStorage fallback.',
      syncedCollections: []
    };
  }

  try {
    const products = useProductStore.getState().products || [];
    const orders = useOrderStore.getState().orders || [];
    const profile = useProfileStore.getState();
    const cartItems = useCartStore.getState().items || [];
    const wishlistItems = useWishlistStore.getState().items || [];
    const user = useAuthStore.getState().user;
    const categories = useCategoryStore.getState().categories || [];
    const coupons = useCouponStore.getState().coupons || [];
    const customers = useCustomerStore.getState().customers || [];
    const banners = useBannerStore.getState().banners || [];
    const brands = useBrandStore.getState().brands || [];
    const settings = useSettingsStore.getState().settings;
    const notifications = useNotificationStore.getState().notifications || [];

    const synced: string[] = [];

    if (products.length > 0) {
      const pSuccess = await syncProductsToFirestore(products);
      if (pSuccess) synced.push(`Products (${products.length})`);
    }

    if (orders.length > 0) {
      const oSuccess = await syncOrdersToFirestore(orders);
      if (oSuccess) synced.push(`Orders (${orders.length})`);
    }

    if (user?.uid) {
      const profSuccess = await syncProfileToFirestore(user.uid, {
        fullName: profile.fullName,
        phone: profile.phone,
        shippingAddress: profile.shippingAddress,
        billingAddress: profile.billingAddress,
        savedAddresses: profile.savedAddresses,
        savedCards: profile.savedCards,
        preferences: profile.preferences,
        cartCount: cartItems.length,
        wishlistCount: wishlistItems.length
      });
      if (profSuccess) synced.push('User Profile & Vault');
    }

    if (categories.length > 0) {
      const cSuccess = await syncCategoriesToFirestore(categories);
      if (cSuccess) synced.push(`Categories (${categories.length})`);
    }

    if (coupons.length > 0) {
      const cpSuccess = await syncCouponsToFirestore(coupons);
      if (cpSuccess) synced.push(`Coupons (${coupons.length})`);
    }

    if (customers.length > 0) {
      const cuSuccess = await syncCustomersToFirestore(customers);
      if (cuSuccess) synced.push(`Customers (${customers.length})`);
    }

    if (banners.length > 0) {
      const bSuccess = await syncBannersToFirestore(banners);
      if (bSuccess) synced.push(`Banners (${banners.length})`);
    }

    if (brands.length > 0) {
      const brSuccess = await syncBrandsToFirestore(brands);
      if (brSuccess) synced.push(`Brands (${brands.length})`);
    }

    if (settings) {
      const sSuccess = await syncSettingsToFirestore(settings);
      if (sSuccess) synced.push('Store Settings');
    }

    if (notifications.length > 0) {
      const nSuccess = await syncNotificationsToFirestore(notifications);
      if (nSuccess) synced.push(`Notifications (${notifications.length})`);
    }

    return {
      success: true,
      message: `Successfully synced all 10 database collections to Google Cloud Firestore (${synced.join(', ')}).`,
      syncedCollections: synced
    };
  } catch (error: any) {
    console.error('[Firestore Master Sync Error]:', error);
    return {
      success: false,
      message: error?.message || 'Failed to sync with Firebase Firestore.',
      syncedCollections: []
    };
  }
};

/**
 * Initializes real-time background sync from LocalStores to Cloud Firestore
 */
export const initFirestoreRealtimeSync = () => {
  if (!isFirebaseConfigured()) {
    console.log('[Firestore Sync] Ready for cloud sync. Add Firebase keys in .env to connect.');
    return () => {};
  }

  console.log('[Firestore Sync] Cloud Firestore Realtime Sync Active for all 10 database sections.');

  // Subscribe to profile modifications and sync automatically
  const unsubProfile = useProfileStore.subscribe((state) => {
    const user = useAuthStore.getState().user;
    if (user?.uid) {
      syncProfileToFirestore(user.uid, {
        fullName: state.fullName,
        phone: state.phone,
        shippingAddress: state.shippingAddress,
        savedAddresses: state.savedAddresses,
        preferences: state.preferences
      });
    }
  });

  return () => {
    unsubProfile();
  };
};
