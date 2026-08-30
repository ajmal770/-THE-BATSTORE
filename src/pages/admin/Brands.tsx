import React, { useState } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="text-sapphire" /> Brand Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage product brands and manufacturers</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-sapphire text-white px-4 py-2 rounded-lg font-medium hover:bg-deep-navy transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={18} /> Add New Brand
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/10 border border-gray-100 overflow-hidden flex flex-col w-full">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex gap-4 bg-gray-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search manufacturers & brands..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sapphire/15 focus:border-sapphire/35 bg-white text-gray-900 font-semibold transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider font-black border-b border-gray-100">
                <th className="px-6 py-4">Brand Name</th>
                {isSuperAdmin && <th className="px-6 py-4">Products Associated</th>}
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60 text-sm">
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 4 : 3} className="px-6 py-12 text-center text-gray-400 font-semibold">No brands found.</td>
                </tr>
              ) : (
                filteredBrands.map(brand => (
                  <tr key={brand.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 font-black text-gray-900">{brand.name}</td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 text-gray-600 font-semibold">
                        <span className="font-black text-sapphire bg-blue-50/60 border border-blue-100/30 px-2.5 py-0.5 rounded-md text-xs">{getProductCount(brand.name)}</span> products
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(brand)}
                        className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider cursor-pointer transition-colors border-none ${
                          brand.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/60' 
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100/60'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {brand.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleEditClick(brand)}
                          className="p-1.5 text-gray-400 hover:text-sapphire hover:bg-blue-50/50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(brand.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Brand Modal */}
      <AnimatePresence>
        {isAddMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 z-10"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sapphire to-blue-500" />
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-blue-50 text-sapphire rounded-xl flex items-center justify-center border border-blue-100/35">
                    <Tag size={16} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 leading-tight">
                      {editingBrand ? 'Modify Brand' : 'Add New Brand'}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Manage manufacturer names & states</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 border border-gray-100 flex items-center justify-center shadow-sm"
                >
                  <X size={16} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 bg-white text-xs">
                
                {/* Brand Name Input */}
                <div>
                  <TextInput 
                    label="Brand Name" 
                    placeholder="e.g. Sony" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="font-bold text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-xs" 
                  />
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Active Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sapphire/15 transition-all focus:border-sapphire/35 cursor-pointer text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-4 flex gap-3.5">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-black uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer text-[10px]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-xl font-black uppercase tracking-wider hover:shadow-lg hover:shadow-sapphire/20 transition-all cursor-pointer border-none text-[10px]"
                  >
                    {editingBrand ? 'Save Changes' : 'Add Brand'}
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
