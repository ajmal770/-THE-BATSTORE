import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Mail, 
  Shield, 
  UserCheck, 
  UserX, 
  Eye, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Award,
  ShoppingBag,
  AlertTriangle,
  Lock,
  Download
} from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';
import type { Customer } from '../../store/customerStore';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from 'react-router-dom';

const Customers: React.FC = () => {
  const { 
    customers, 
    updateCustomerStatus, 
    updateCustomerRole, 
    deleteCustomer, 
    syncWithAuthUsers, 
    addCustomer 
  } = useCustomerStore();

  const { 
    registeredUsers, 
    adminAccounts, 
    updateUser, 
    deleteUser, 
    registerUser, 
    addAdminAccount 
  } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  
  // Add New User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Password123');
  const [newUserRole, setNewUserRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [addError, setAddError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Live synchronization between Auth store users & Customer store
  useEffect(() => {
    const authUsersList = [
      ...registeredUsers.map(u => ({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        role: u.role,
      })),
      ...adminAccounts.map(a => ({
        uid: a.uid,
        email: a.email,
        displayName: a.displayName,
        role: 'ADMIN' as const,
      })),
    ];
    syncWithAuthUsers(authUsersList);
  }, [registeredUsers, adminAccounts, syncWithAuthUsers]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (customer: Customer) => {
    const nextStatus = customer.status === 'Active' ? 'Inactive' : 'Active';
    updateCustomerStatus(customer.id, nextStatus);
    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer({ ...selectedCustomer, status: nextStatus });
    }
  };

  const handleToggleRole = (customer: Customer) => {
    const nextRole = customer.role === 'CUSTOMER' ? 'ADMIN' : 'CUSTOMER';
    updateCustomerRole(customer.id, nextRole);
    updateUser(customer.id, { role: nextRole });
    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer({ ...selectedCustomer, role: nextRole });
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDeleteCustomer = () => {
    if (!customerToDelete) return;
    const id = customerToDelete.id;
    deleteCustomer(id);
    deleteUser(id);
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
    setCustomerToDelete(null);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!newUserName.trim() || !newUserEmail.includes('@') || newUserPassword.length < 6) {
      setAddError('Please enter valid user details and a password with at least 6 characters.');
      return;
    }

    const emailLower = newUserEmail.trim().toLowerCase();

    if (newUserRole === 'ADMIN') {
      const mockUid = `ADM-${Date.now().toString().slice(-4)}`;
      addAdminAccount({
        uid: mockUid,
        email: emailLower,
        password: newUserPassword,
        displayName: newUserName.trim(),
        createdAt: new Date().toLocaleDateString(),
        role: 'ADMIN',
      });
      addCustomer({
        name: newUserName.trim(),
        email: emailLower,
        role: 'ADMIN',
        status: 'Active',
      });
    } else {
      const res = registerUser({
        email: emailLower,
        password: newUserPassword,
        displayName: newUserName.trim(),
        role: 'CUSTOMER',
      });
      if (!res.success) {
        setAddError(res.error || 'Email address is already registered.');
        return;
      }
      addCustomer({
        name: newUserName.trim(),
        email: emailLower,
        role: 'CUSTOMER',
        status: 'Active',
      });
    }

    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('Password123');
  };

  const handleExport = () => {
    const headers = ['User ID', 'Name', 'Email', 'Orders Count', 'Total Spent ($)', 'Status', 'Role', 'Joined Date'];
    const rows = customers.map(c => [c.id, c.name, c.email, c.orders, c.totalSpent.toFixed(2), c.status, c.role, c.joined]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `thebatstore_customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Stats computation
  const totalCustomers = customers.filter(c => c.role === 'CUSTOMER').length;
  const totalAdmins = customers.filter(c => c.role === 'ADMIN' || c.role === 'SUPER_ADMIN').length;
  const activeCount = customers.filter(c => c.status === 'Active').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#0F52BA]" />
            <span>Customer & User Management</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Live synchronized details for all registered accounts, roles, orders, and access statuses
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#0F52BA] to-[#000926] hover:from-[#000926] hover:to-[#0F52BA] text-white px-4 py-2.5 rounded-xl font-medium text-xs transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Live Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-1">
            <span>Total Accounts</span>
            <Users className="w-4 h-4 text-[#0F52BA]" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{customers.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-1">
            <span>Customers</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{totalCustomers}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-1">
            <span>Admin Access</span>
            <Shield className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{totalAdmins}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-1">
            <span>Active Status</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900">{activeCount}</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Toolbar */}
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or user ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F52BA]/30 focus:border-[#0F52BA] bg-white text-gray-900 transition-all"
            />
          </div>
          <div className="text-xs font-semibold text-gray-500">
            Showing <span className="text-gray-900 font-medium">{filteredCustomers.length}</span> of <span className="text-gray-900 font-medium">{customers.length}</span> accounts
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role & Status</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors group">
                  
                  {/* User Details Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F52BA]/15 to-[#000926]/15 text-[#0F52BA] flex items-center justify-center font-extrabold text-sm shadow-inner shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {customer.id}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-gray-400" /> 
                          <span>{customer.email}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role & Status Column */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1 ${
                        customer.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                        customer.role === 'ADMIN' ? 'bg-blue-100 text-[#0F52BA]' : 'bg-gray-100 text-gray-700'
                      }`}>
                        <Shield size={11} />
                        <span>{customer.role === 'SUPER_ADMIN' ? 'Super Admin' : customer.role === 'ADMIN' ? 'Admin' : 'Customer'}</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        customer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-red-50 text-red-700 border border-red-200/60'
                      }`}>
                        {customer.status}
                      </span>
                    </div>
                  </td>

                  {/* Orders Column */}
                  <td className="px-6 py-4 font-medium text-gray-900">{customer.orders}</td>

                  {/* Total Spent Column */}
                  <td className="px-6 py-4 text-[#0F52BA] font-extrabold">${customer.totalSpent.toFixed(2)}</td>

                  {/* Joined Date Column */}
                  <td className="px-6 py-4 text-gray-500 text-xs font-medium">{customer.joined}</td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        title="View Complete User Details"
                        className="p-2 text-gray-500 hover:text-[#0F52BA] rounded-xl hover:bg-[#0F52BA]/10 transition-colors cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Toggle Status Button */}
                      <button 
                        onClick={() => handleToggleStatus(customer)}
                        title={customer.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          customer.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {customer.status === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      
                      {/* Promote / Demote Role Button */}
                      {customer.role !== 'SUPER_ADMIN' && (
                        <button 
                          onClick={() => handleToggleRole(customer)}
                          title={customer.role === 'CUSTOMER' ? 'Promote to Admin' : 'Demote to Customer'}
                          className="p-2 text-gray-400 hover:text-purple-600 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <Award size={16} />
                        </button>
                      )}

                      {/* Delete Button */}
                      {customer.role !== 'SUPER_ADMIN' && (
                        <button 
                          onClick={() => handleDeleteClick(customer)}
                          title="Delete User Account"
                          className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-600">No user accounts found matching "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW COMPLETE USER DETAILS MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F52BA] via-blue-500 to-[#000926]" />

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0F52BA]/15 to-[#000926]/15 text-[#0F52BA] flex items-center justify-center font-extrabold text-xl shadow-inner shrink-0">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-gray-900">{selectedCustomer.name}</h3>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {selectedCustomer.id}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{selectedCustomer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-medium text-gray-400 block mb-1">Account Role</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  selectedCustomer.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                  selectedCustomer.role === 'ADMIN' ? 'bg-blue-100 text-[#0F52BA]' : 'bg-white text-gray-700 border border-gray-200'
                }`}>
                  <Shield size={12} />
                  <span>{selectedCustomer.role}</span>
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-medium text-gray-400 block mb-1">Status</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  selectedCustomer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  <CheckCircle2 size={12} />
                  <span>{selectedCustomer.status}</span>
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-medium text-gray-400 block mb-1">Total Orders</span>
                <span className="text-lg font-extrabold text-gray-900">{selectedCustomer.orders} Orders</span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="text-[10px] uppercase font-medium text-gray-400 block mb-1">Total Lifetime Spend</span>
                <span className="text-lg font-extrabold text-[#0F52BA]">${selectedCustomer.totalSpent.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl mb-6 text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-500">Member Since:</span>
                <span className="font-medium text-gray-900">{selectedCustomer.joined}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-500">Security Encryption:</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                  <Shield size={12} /> SSL Secured
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleToggleStatus(selectedCustomer)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                {selectedCustomer.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
              </button>

              {selectedCustomer.role !== 'SUPER_ADMIN' && (
                <button
                  type="button"
                  onClick={() => handleToggleRole(selectedCustomer)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                >
                  {selectedCustomer.role === 'CUSTOMER' ? 'Promote to Admin' : 'Demote to Customer'}
                </button>
              )}

              {selectedCustomer.role !== 'SUPER_ADMIN' && (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteClick(selectedCustomer);
                    setSelectedCustomer(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 bg-[#0F52BA] hover:bg-[#000926] text-white rounded-xl text-xs font-medium shadow-md transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT SMALL-BOX LUXURY DELETE MODAL */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 bg-[#000926]/75 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-white rounded-[22px] shadow-2xl max-w-[320px] w-full p-4 border border-slate-100 relative animate-in zoom-in-95 duration-150 text-left">
            
            {/* Compact Header Row */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100/60">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    Delete Account?
                  </h3>
                  <p className="text-[10px] font-medium text-slate-500">
                    Irreversible action
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compact User Details Box */}
            <div className="bg-[#0F52BA]/5 border border-[#0F52BA]/15 rounded-xl p-2.5 mb-2.5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F52BA] to-[#000926] text-white font-medium text-xs flex items-center justify-center shrink-0 shadow-sm">
                {customerToDelete.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-900 truncate">
                  {customerToDelete.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {customerToDelete.email}
                </p>
              </div>
            </div>

            {/* Compact Warning Box */}
            <div className="bg-red-50/90 border border-red-200/80 rounded-xl p-2.5 mb-2.5 flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <div className="text-[11px] leading-snug text-slate-700">
                <p className="font-semibold text-slate-800">
                  Are you sure you want to delete?
                </p>
                <p>
                  <span className="font-medium text-red-600">This action is permanent</span> and erases all data.
                </p>
              </div>
            </div>

            {/* Compact Checklist Box */}
            <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl p-2.5 mb-3 flex items-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100/80 text-[#0F52BA] flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-3 h-3" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-[11px] mb-1">
                  Permanently deletes:
                </p>
                <ul className="space-y-0.5 text-[10px] text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    <span>Personal information & data</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    <span>Order history & transactions</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                    <span>Account access & permissions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Compact Buttons Row */}
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={confirmDeleteCustomer}
                className="flex-1 py-2 px-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-medium text-xs shadow-md shadow-[#E11D48]/25 hover:shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>

            {/* Compact Bottom Lock Info */}
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Cannot be undone</span>
            </div>

          </div>
        </div>
      )}

      {/* ADD NEW USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setAddError(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-gray-900 mb-1">Add New User</h3>
            <p className="text-xs text-gray-500 mb-5">
              Create a new Customer or Admin account. Changes reflect immediately in live management.
            </p>

            {addError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Robinson"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Initial Password
                </label>
                <input
                  type="text"
                  required
                  placeholder="At least 6 characters"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewUserRole('CUSTOMER')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      newUserRole === 'CUSTOMER'
                        ? 'border-[#0F52BA] bg-[#0F52BA]/10 text-[#0F52BA]'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserRole('ADMIN')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      newUserRole === 'ADMIN'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddError(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#0F52BA] to-[#000926] hover:from-[#000926] hover:to-[#0F52BA] text-white rounded-xl text-xs font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;
