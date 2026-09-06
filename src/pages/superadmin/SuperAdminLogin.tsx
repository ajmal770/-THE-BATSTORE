import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { AppUser } from '../../store/authStore';

// Super Admin credentials (hardcoded for demo / localStorage simulation)
const SUPER_ADMIN_EMAIL = 'superadmin@thebatstore.com';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin@123';

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, adminAccounts } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // Simulate network delay

    // Check Super Admin credentials
    if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
      const superAdmin: AppUser = {
        uid: 'superadmin-001',
        email: SUPER_ADMIN_EMAIL,
        displayName: 'Super Admin',
        role: 'SUPER_ADMIN',
      };
      setUser(superAdmin, null);
      navigate('/admin');
      return;
    }

    // Check dynamically created Admin accounts
    const adminAccount = adminAccounts.find(
      (a) => a.email === email && a.password === password
    );
    if (adminAccount) {
      const adminUser: AppUser = {
        uid: adminAccount.uid,
        email: adminAccount.email,
        displayName: adminAccount.displayName,
        role: 'ADMIN',
      };
      setUser(adminUser, null);
      navigate('/admin');
      return;
    }

    setError('Invalid email or password. Please try again.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-deep-navy to-slate-800 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sapphire rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-sapphire to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sapphire/30">
              <Shield className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-white mb-1">Super Admin Portal</h1>
            <p className="text-gray-400 text-sm">Restricted access — authorized personnel only</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@thebatstore.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-sapphire focus:ring-1 focus:ring-sapphire transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-sapphire to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-sapphire transition-all shadow-lg shadow-sapphire/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield size={20} /> Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-sapphire/10 border border-sapphire/20 rounded-xl">
            <p className="text-xs text-gray-400 text-center font-medium">🔐 Demo Credentials</p>
            <p className="text-xs text-gray-300 text-center mt-1">superadmin@thebatstore.com / SuperAdmin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
