import React, { useState } from 'react';
import { Users, Plus, Trash2, Shield, Mail, Lock, User, Eye, EyeOff, Crown, Calendar, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import type { AdminAccount } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const AdminManager: React.FC = () => {
  const { user, adminAccounts, addAdminAccount, deleteAdminAccount } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ displayName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const exists = adminAccounts.some((a) => a.email === form.email);
    if (exists) {
      setError('An admin with this email already exists.');
      return;
    }

    const newAdmin: AdminAccount = {
      uid: `admin-${Date.now()}`,
      email: form.email,
      password: form.password,
      displayName: form.displayName,
      createdAt: new Date().toISOString(),
      role: 'ADMIN',
    };

    addAdminAccount(newAdmin);
    setSuccess(`Admin account for "${form.displayName}" created successfully!`);
    setForm({ displayName: '', email: '', password: '' });
    setShowForm(false);
    
    // Auto clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = (uid: string, name: string) => {
    if (window.confirm(`Delete admin account for "${name}"? This cannot be undone.`)) {
      deleteAdminAccount(uid);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deep-navy to-sapphire flex items-center gap-3">
            <Crown className="text-yellow-500" size={32} /> Admin Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium ml-11">Create and manage admin accounts for the dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          {success && (
            <span className="text-emerald-600 bg-emerald-50/80 backdrop-blur-md px-4 py-2.5 rounded-2xl text-sm font-bold tracking-wide border border-emerald-200/60 animate-pulse flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> {success}
            </span>
          )}
          {isSuperAdmin && (
            <button
              onClick={() => { setShowForm(true); setError(''); setSuccess(''); }}
              className="group relative px-6 py-3 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-2xl font-semibold tracking-wide overflow-hidden shadow-lg shadow-sapphire/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <Plus size={20} className="relative z-10" />
              <span className="relative z-10">Create Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Super Admin info badge */}
      <div className="bg-gradient-to-r from-yellow-50/80 to-amber-50/80 backdrop-blur-md border border-yellow-200/60 rounded-3xl p-6 flex items-start gap-5 shadow-sm">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center shrink-0 border border-white shadow-inner">
          <Crown className="text-yellow-600" size={24} />
        </div>
        <div>
          <p className="text-lg font-bold text-yellow-900">Super Admin Account</p>
          <p className="text-sm font-medium text-yellow-700/80 mt-1">superadmin@thebatstore.com</p>
          <span className="inline-flex items-center mt-2.5 text-[10px] uppercase tracking-widest bg-yellow-200/50 text-yellow-800 px-3 py-1.5 rounded-full font-bold border border-yellow-300/30">
            Hardcoded • Cannot be deleted
          </span>
        </div>
      </div>

      {/* Admin Accounts List */}
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100/60 flex items-center justify-between bg-white/40">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-sapphire shadow-inner border border-white">
              <Users size={20} />
            </div>
            Active Administrators
          </h2>
          <span className="text-xs bg-gray-100/80 backdrop-blur-md text-gray-600 px-4 py-2 rounded-2xl font-bold border border-gray-200/50 shadow-inner">
            {adminAccounts.length} accounts
          </span>
        </div>

        {adminAccounts.length === 0 ? (
          <div className="p-16 text-center text-gray-400 bg-gray-50/30">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white">
              <Users size={32} className="opacity-40" />
            </div>
            <p className="text-lg font-bold text-gray-900">No admin accounts created yet</p>
            <p className="text-sm font-medium mt-2">Click "Create Admin" to add your first administrator.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {adminAccounts.map((admin) => (
                <div 
                  key={admin.uid} 
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-sapphire/30 hover:shadow-xl hover:shadow-sapphire/5 transition-all duration-300 group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center font-bold text-sapphire text-xl shadow-inner border border-white">
                      {admin.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 group-hover:text-sapphire transition-colors">{admin.displayName}</p>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="inline-block text-[10px] bg-blue-50 text-sapphire px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-blue-100/50">
                        Admin
                      </span>
                      <p className="text-xs font-medium text-gray-400 mt-1.5 flex items-center gap-1.5 sm:justify-end">
                        <Calendar size={12} /> {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(admin.uid, admin.displayName)}
                        className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-100 shadow-sm"
                        title="Delete admin"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Create Admin Modal */}
      <AnimatePresence>
        {showForm && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Glassmorphism Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowForm(false); setError(''); }}
              className="absolute inset-0 bg-deep-navy/40 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
              className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/60 z-10"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100/60 flex items-center justify-between bg-white/50 relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sapphire to-blue-400" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 text-sapphire rounded-2xl flex items-center justify-center shadow-inner border border-white">
                    <Shield size={20} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">New Admin Account</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">Provision a new administrator profile</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(''); }}
                  className="p-2.5 bg-white hover:bg-gray-50 rounded-xl transition-all cursor-pointer text-gray-400 hover:text-gray-600 border border-gray-100 flex items-center justify-center shadow-sm hover:shadow"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreate} className="p-8 overflow-y-auto space-y-6 bg-white/40">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50/80 backdrop-blur-sm border border-rose-200/60 text-rose-700 text-sm px-5 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Display Name Input */}
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Display Name</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 group-focus-within:text-sapphire transition-colors z-10">
                        <User size={14} />
                      </div>
                      <input
                        type="text"
                        value={form.displayName}
                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        placeholder="e.g. John Admin"
                        required
                        className="w-full pl-15 pr-4 py-4 bg-white/60 border border-gray-200 rounded-2xl text-sm text-gray-900 font-semibold focus:outline-none focus:bg-white focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 placeholder-gray-400 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 group-focus-within:text-sapphire transition-colors z-10">
                        <Mail size={14} />
                      </div>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="admin@example.com"
                        required
                        className="w-full pl-15 pr-4 py-4 bg-white/60 border border-gray-200 rounded-2xl text-sm text-gray-900 font-semibold focus:outline-none focus:bg-white focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 placeholder-gray-400 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2.5">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 group-focus-within:text-sapphire transition-colors z-10">
                        <Lock size={14} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min 6 characters"
                        required
                        className="w-full pl-15 pr-14 py-4 bg-white/60 border border-gray-200 rounded-2xl text-sm text-gray-900 font-semibold focus:outline-none focus:bg-white focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 placeholder-gray-400 shadow-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-sapphire transition-colors cursor-pointer z-10"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-8 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => { setShowForm(false); setError(''); }}
                    className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:shadow-lg hover:shadow-sapphire/30 transition-all cursor-pointer border-none shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManager;
