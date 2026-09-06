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
  };

  const handleDelete = (uid: string, name: string) => {
    if (window.confirm(`Delete admin account for "${name}"? This cannot be undone.`)) {
      deleteAdminAccount(uid);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="text-yellow-500" size={26} /> Admin Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage admin accounts for the dashboard.</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => { setShowForm(true); setError(''); setSuccess(''); }}
            className="flex items-center gap-2 bg-sapphire text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-deep-navy transition-colors shadow-md shadow-sapphire/20"
          >
            <Plus size={18} /> Create Admin
          </button>
        )}
      </div>

      {/* Super Admin info badge */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
          <Crown className="text-yellow-600" size={20} />
        </div>
        <div>
          <p className="font-bold text-yellow-900">Super Admin</p>
          <p className="text-sm text-yellow-700 mt-0.5">superadmin@thebatstore.com</p>
          <span className="inline-block mt-1 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">Hardcoded · Cannot be deleted</span>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          ✅ {success}
        </div>
      )}

      {/* Create Admin Form */}
      <AnimatePresence>
        {showForm && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowForm(false); setError(''); setSuccess(''); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100/80 z-10"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sapphire to-blue-500" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-sapphire rounded-xl flex items-center justify-center border border-blue-100/35">
                    <Shield size={18} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">New Admin Account</h3>
                    <p className="text-[11px] text-gray-400 font-bold mt-0.5">Provision a new administrator profile with secure credentials</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(''); setSuccess(''); }}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 border border-gray-100 flex items-center justify-center shadow-sm"
                >
                  <X size={16} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleCreate} className="p-8 overflow-y-auto space-y-6 bg-white text-xs">
                {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs px-4 py-3.5 rounded-xl font-bold">
                    ⚠️ {error}
                  </div>
                )}

                {/* Display Name Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                      placeholder="e.g. John Admin"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/15 transition-all focus:border-sapphire/35 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="admin@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/15 transition-all focus:border-sapphire/35 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 6 characters"
                      required
                      className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/15 transition-all focus:border-sapphire/35 placeholder-gray-400"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-6 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => { setShowForm(false); setError(''); setSuccess(''); }}
                    className="flex-1 py-3.5 border border-gray-200 rounded-xl text-gray-600 font-black uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer text-[10px]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3.5 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-xl font-black uppercase tracking-wider hover:shadow-lg hover:shadow-sapphire/20 transition-all cursor-pointer border-none text-[10px]"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Accounts List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Users size={18} className="text-sapphire" /> Admin Accounts
          </h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
            {adminAccounts.length} accounts
          </span>
        </div>

        {adminAccounts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No admin accounts created yet.</p>
            <p className="text-sm mt-1">Click "Create Admin" to add your first admin.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {adminAccounts.map((admin) => (
              <div key={admin.uid} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-sapphire/10 rounded-full flex items-center justify-center font-bold text-sapphire text-lg">
                    {admin.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{admin.displayName}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs bg-blue-50 text-sapphire px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 justify-end">
                      <Calendar size={11} /> {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleDelete(admin.uid, admin.displayName)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete admin"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManager;
