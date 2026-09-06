import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  Tag, CreditCard, Image, Bookmark, Crown, LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Tag, label: 'Categories', path: '/admin/categories' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: CreditCard, label: 'Coupons', path: '/admin/coupons' },
  { icon: Image, label: 'Banners', path: '/admin/banners' },
  { icon: Bookmark, label: 'Brands', path: '/admin/brands' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const superAdminNavItems = [
  { icon: Crown, label: 'Admin Manager', path: '/admin/admin-manager' },
];

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/superadmin/login');
  };

  return (
    <aside className="w-64 bg-deep-navy min-h-screen text-white flex flex-col hidden md:flex">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <span className="flex items-center gap-1 uppercase tracking-tighter">THE <img src="/logo.svg" alt="Bat Logo" className="h-4 w-auto object-contain brightness-0 invert" /> STORE</span>
        </h2>
        <div className="mt-3 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSuperAdmin ? 'bg-yellow-400' : 'bg-green-400'}`} />
          <span className="text-xs text-gray-400">{isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
        </div>
      </div>
      
      <nav className="flex-1 px-3 mt-4 space-y-1">
        {/* Regular admin items */}
        <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-2 mt-2">Management</p>
        {adminNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                isActive
                  ? 'bg-sapphire text-white shadow-md shadow-sapphire/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}

        {/* Super Admin only items */}
        {isSuperAdmin && (
          <>
            <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-2 mt-5">Super Admin</p>
            {superAdminNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${
                    isActive
                      ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/30'
                      : 'text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>
      
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all text-sm font-medium"
        >
          <LogOut size={18} /> Sign Out
        </button>
        <p className="text-xs text-gray-600 text-center mt-3 flex items-center justify-center gap-1">© 2026 THE <img src="/logo.svg" alt="Bat Logo" className="h-3 w-auto object-contain brightness-0 invert opacity-50" /> STORE</p>
      </div>
    </aside>
  );
};
