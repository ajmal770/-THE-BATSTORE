import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Invoice from './pages/Invoice';
import Sale from './pages/Sale';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Press from './pages/Press';
import Help from './pages/Help';

// Admin Imports
import AdminDashboard from './pages/AdminDashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Categories from './pages/admin/Categories';
import Coupons from './pages/admin/Coupons';
import Customers from './pages/admin/Customers';
import Settings from './pages/admin/Settings';
import Banners from './pages/admin/Banners';
import Brands from './pages/admin/Brands';
import AdminManager from './pages/admin/AdminManager';
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { Logo3DIntro } from './components/Logo3DIntro';
import { initFirestoreRealtimeSync } from './services/firestoreService';

function App() {
  useEffect(() => {
    const unsubscribe = initFirestoreRealtimeSync();
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Logo3DIntro />
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Routes with Navbar & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<ProductList />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<About />} />
          <Route path="/press" element={<Press />} />
          <Route path="/corporate" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/policy" element={<Help />} />
          <Route path="/payments" element={<Help />} />
          <Route path="/shipping" element={<Help />} />
          <Route path="/returns" element={<Help />} />
          <Route path="/faq" element={<Help />} />
          <Route path="/infringement" element={<Help />} />
        </Route>

        {/* Auth Routes (No Navbar/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        
        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="banners" element={<Banners />} />
          <Route path="brands" element={<Brands />} />
          <Route path="admin-manager" element={<AdminManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
