import React, { useState } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, X, Bookmark } from 'lucide-react';
import { useBrandStore } from '../../store/brandStore';
import type { Brand } from '../../store/brandStore';
import { useProductStore } from '../../store/productStore';
import { useAuthStore } from '../../store/authStore';
import { TextInput } from '../../components/TextInput';
import { motion, AnimatePresence } from 'framer-motion';

const Brands: React.FC = () => {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const { brands, addBrand, updateBrand, deleteBrand } = useBrandStore();
  const { products } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductCount = (brandName: string) => {
    return products.filter(p => p.name.toLowerCase().includes(brandName.toLowerCase())).length;
  };

  const handleAddClick = () => {
    setEditingBrand(null);
    setName('');
    setStatus('Active');
    setIsAddMode(true);
  };

  const handleEditClick = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setStatus(brand.status);
    setIsAddMode(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand? Products referencing it will not be deleted.')) {
      deleteBrand(id);
    }
  };

  const handleToggleStatus = (brand: Brand) => {
    const nextStatus = brand.status === 'Active' ? 'Inactive' : 'Active';
    updateBrand(brand.id, { status: nextStatus });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBrand) {
      updateBrand(editingBrand.id, { name: name.trim(), status });
    } else {
      addBrand({ name: name.trim(), status });
    }

    setIsAddMode(false);
    setEditingBrand(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deep-navy to-sapphire flex items-center gap-3">
            <Bookmark className="text-sapphire" size={32} /> Brand Management
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium ml-11">Curate and manage your product manufacturers</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="group relative px-6 py-3 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-2xl font-semibold tracking-wide overflow-hidden shadow-lg shadow-sapphire/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Add New Brand</span>
        </button>
      </div>

      {/* Modern Search Bar */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="text-gray-400 group-focus-within:text-sapphire transition-colors" size={20} />
        </div>
        <input 
          type="text" 
          placeholder="Search manufacturers & brands..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sapphire/10 focus:border-sapphire/30 text-gray-900 font-medium transition-all shadow-sm"
        />
      </div>

      {/* Premium Floating Table */}
      <div className="overflow-x-auto pb-8">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-4">
              <th className="px-6 py-2">Brand Name</th>
              {isSuperAdmin && <th className="px-6 py-2">Products Associated</th>}
              <th className="px-6 py-2">Status</th>
              <th className="px-6 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 4 : 3} className="px-6 py-12 text-center text-gray-400 font-semibold bg-white rounded-3xl border border-gray-100 shadow-sm">
                  No brands found.
                </td>
              </tr>
            ) : (
              filteredBrands.map(brand => (
                <tr key={brand.id} className="group bg-white hover:bg-gray-50/80 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl relative overflow-hidden">
                  <td className="px-6 py-5 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-400 group-hover:text-sapphire group-hover:border-sapphire/30 transition-colors shadow-inner">
                        <Bookmark size={18} />
                      </div>
                      <span className="font-medium text-gray-900 text-base">{brand.name}</span>
                    </div>
                  </td>
                  
                  {isSuperAdmin && (
                    <td className="px-6 py-5 text-gray-500 font-medium">
                      <div className="inline-flex items-center gap-1.5 bg-blue-50/50 border border-blue-100/50 px-3 py-1 rounded-lg">
                        <span className="text-sapphire font-semibold">{getProductCount(brand.name)}</span>
                        <span className="text-xs">products</span>
                      </div>
                    </td>
                  )}
                  
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => handleToggleStatus(brand)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 border ${
                        brand.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60 hover:bg-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                          : 'bg-rose-50 text-rose-600 border-rose-200/60 hover:bg-rose-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full animate-pulse ${brand.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {brand.status}
                    </button>
                  </td>
                  
                  <td className="px-6 py-5 rounded-r-2xl text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(brand)}
                        className="p-2.5 text-gray-400 hover:text-sapphire hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                        title="Edit Brand"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(brand.id)}
                        className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                        title="Delete Brand"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Advanced Glassmorphism Modal */}
      <AnimatePresence>
        {isAddMode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
              className="absolute inset-0 bg-deep-navy/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className={`px-8 py-6 border-b border-gray-100/50 flex items-center justify-between ${editingBrand ? 'bg-gradient-to-r from-amber-50/50 to-white/50' : 'bg-gradient-to-r from-gray-50/50 to-white/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white shadow-sm ${editingBrand ? 'bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-sapphire'}`}>
                    {editingBrand ? <Edit2 size={24} className="stroke-[2]" /> : <Bookmark size={24} className="stroke-[2]" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {editingBrand ? 'Edit Brand Details' : 'New Brand'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">Configure brand settings</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
                  className="p-2.5 bg-white hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-gray-700 border border-gray-100 shadow-sm hover:shadow"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">
                    Brand Name
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Sony, Nike, Apple" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">
                    Brand Status
                  </label>
                  <div className="relative">
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 cursor-pointer appearance-none"
                    >
                      <option value="Active">Active (Visible)</option>
                      <option value="Inactive">Inactive (Hidden)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-2 border-t border-gray-100/50 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
                    className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl text-gray-600 font-semibold tracking-wide hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className={`flex-1 py-4 text-white rounded-2xl font-semibold tracking-wide hover:shadow-lg transition-all active:scale-[0.98] border border-transparent ${editingBrand ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-amber-500/30' : 'bg-gradient-to-r from-sapphire to-blue-600 hover:shadow-sapphire/30'}`}
                  >
                    {editingBrand ? 'Save Changes' : 'Create Brand'}
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

export default Brands;

