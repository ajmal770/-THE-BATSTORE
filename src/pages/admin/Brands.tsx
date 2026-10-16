import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, X, Bookmark, 
  Package, Layers, Filter, Check,
  ExternalLink, Tag, Eye, ChevronRight, Boxes
} from 'lucide-react';
import { useBrandStore, BRAND_ITEM_CATEGORIES } from '../../store/brandStore';
import type { Brand } from '../../store/brandStore';
import { useProductStore } from '../../store/productStore';
import type { Product } from '../../store/productStore';

import { motion, AnimatePresence } from 'framer-motion';

const getCategoryBadgeStyle = (category?: string) => {
  switch (category) {
    case 'Smartphones & Mobile':
      return 'bg-blue-50 text-blue-700 border-blue-200/80';
    case 'Computers & Laptops':
      return 'bg-sky-50 text-sky-700 border-sky-200/80';
    case 'Audio & Sound':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
    case 'Gaming & Peripherals':
      return 'bg-purple-50 text-purple-700 border-purple-200/80';
    case 'Cameras & Photography':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case 'Smart Wearables & Fitness':
      return 'bg-teal-50 text-teal-700 border-teal-200/80';
    case 'Home Appliances & Kitchen':
      return 'bg-orange-50 text-orange-700 border-orange-200/80';
    case 'Furniture & Living':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'Watches & Luxury':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200/80';
    case 'Fashion & Apparel':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    case 'Beauty & Cosmetics':
      return 'bg-pink-50 text-pink-700 border-pink-200/80';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const Brands: React.FC = () => {
  const navigate = useNavigate();
  const { brands, addBrand, updateBrand, deleteBrand } = useBrandStore();
  const { products } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  // Modal states
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [viewingBrandItems, setViewingBrandItems] = useState<Brand | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Smartphones & Mobile');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Compute category counts for item-wise separation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Items': brands.length };
    brands.forEach(b => {
      const cat = b.category || 'General & Accessories';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [brands]);

  // Find products belonging to a brand
  const getBrandProducts = (brandName: string): Product[] => {
    const bLower = brandName.toLowerCase();
    return products.filter(p => 
      (p.brand && p.brand.toLowerCase() === bLower) || 
      p.name.toLowerCase().includes(bLower)
    );
  };

  const getProductCount = (brandName: string): number => {
    return getBrandProducts(brandName).length;
  };

  // Filtered brands
  const filteredBrands = useMemo(() => {
    return brands.filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.category && b.category.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = 
        selectedCategory === 'All Items' || b.category === selectedCategory;
      const matchesStatus = 
        statusFilter === 'All' || b.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [brands, searchTerm, selectedCategory, statusFilter]);

  // Paginated brands
  const totalPages = Math.ceil(filteredBrands.length / pageSize) || 1;
  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBrands.slice(startIndex, startIndex + pageSize);
  }, [filteredBrands, currentPage, pageSize]);

  // Reset page when filter changes
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    setEditingBrand(null);
    setName('');
    setCategory(selectedCategory !== 'All Items' ? selectedCategory : 'Smartphones & Mobile');
    setStatus('Active');
    setFormError(null);
    setIsAddMode(true);
  };

  const handleEditClick = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setCategory(brand.category || 'General & Accessories');
    setStatus(brand.status);
    setFormError(null);
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
    if (!name.trim()) {
      setFormError('Brand name is required');
      return;
    }

    if (editingBrand) {
      updateBrand(editingBrand.id, { name: name.trim(), category, status });
    } else {
      addBrand({ name: name.trim(), category, status });
    }

    setIsAddMode(false);
    setEditingBrand(null);
    setFormError(null);
  };

  // Associated products for modal
  const currentBrandProducts = useMemo(() => {
    if (!viewingBrandItems) return [];
    return getBrandProducts(viewingBrandItems.name);
  }, [viewingBrandItems, products]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deep-navy to-sapphire flex items-center gap-3">
            <Bookmark className="text-sapphire" size={32} /> Brand Management
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium ml-11">
            Curate and manage your product manufacturers organized item-wise by category
          </p>
        </div>
        <button 
          onClick={handleAddClick}
          className="group relative px-6 py-3 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-2xl font-semibold tracking-wide overflow-hidden shadow-lg shadow-sapphire/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Add New Brand</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-sapphire flex items-center justify-center font-bold">
            <Bookmark size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Brands</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{brands.length}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Check size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Brands</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{brands.filter(b => b.status === 'Active').length}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Item Categories</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{BRAND_ITEM_CATEGORIES.length - 1}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Store Products</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{products.length}</p>
          </div>
        </div>
      </div>

      {/* Item-Wise Category Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Layers size={14} className="text-sapphire" /> Separate Item-Wise Categories:
          </label>
          <span className="text-xs font-semibold text-gray-400">
            Showing {filteredBrands.length} brands
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {BRAND_ITEM_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-sapphire to-blue-600 text-white border-transparent shadow-md shadow-sapphire/20 scale-[1.02]'
                    : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200/80 hover:border-sapphire/30'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative group flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-sapphire transition-colors" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search manufacturers by brand name or item category..." 
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sapphire/10 focus:border-sapphire/30 text-gray-900 text-sm font-medium transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-44">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'All' | 'Active' | 'Inactive');
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-sapphire/10 focus:border-sapphire/30 transition-all cursor-pointer appearance-none shadow-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Item-Wise Brands Floating Table */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-4">
              <th className="px-6 py-2">Brand Name</th>
              <th className="px-6 py-2">Item Category</th>
              <th className="px-6 py-2 text-center">Associated Items</th>
              <th className="px-6 py-2">Status</th>
              <th className="px-6 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedBrands.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400 font-semibold bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                      <Bookmark size={24} />
                    </div>
                    <p className="text-gray-600 font-bold">No brands found</p>
                    <p className="text-xs text-gray-400">No brands match your current search or item category filter.</p>
                    {(searchTerm || selectedCategory !== 'All Items' || statusFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All Items');
                          setStatusFilter('All');
                          setCurrentPage(1);
                        }}
                        className="px-4 py-2 bg-sapphire/10 text-sapphire rounded-xl text-xs font-bold hover:bg-sapphire/20 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBrands.map(brand => {
                const productCount = getProductCount(brand.name);
                return (
                  <tr key={brand.id} className="group bg-white hover:bg-gray-50/80 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl relative overflow-hidden">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-500 font-bold group-hover:text-sapphire group-hover:border-sapphire/30 transition-colors shadow-inner shrink-0">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-sm block">{brand.name}</span>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Manufacturer</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${getCategoryBadgeStyle(brand.category)}`}>
                        <Tag size={12} />
                        {brand.category || 'General & Accessories'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setViewingBrandItems(brand)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50/80 hover:bg-sapphire hover:text-white text-sapphire border border-blue-200/60 transition-all cursor-pointer group/btn"
                        title="Click to view separate items under this brand"
                      >
                        <Package size={14} className="group-hover/btn:scale-110 transition-transform" />
                        <span>{productCount} {productCount === 1 ? 'item' : 'items'}</span>
                        <ChevronRight size={12} className="opacity-60" />
                      </button>
                    </td>
                    
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(brand)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                          brand.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60 hover:bg-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                            : 'bg-rose-50 text-rose-600 border-rose-200/60 hover:bg-rose-100'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${brand.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {brand.status}
                      </button>
                    </td>
                    
                    <td className="px-6 py-4 rounded-r-2xl text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setViewingBrandItems(brand)}
                          className="p-2 text-gray-400 hover:text-sapphire hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 cursor-pointer"
                          title="View Separate Items"
                        >
                          <Eye size={17} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(brand)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100 cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit2 size={17} />
                        </button>
                        <button 
                          onClick={() => handleDelete(brand.id)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                          title="Delete Brand"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs font-bold text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredBrands.length)} of {filteredBrands.length} brands
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Only show a window of pages around current page if total pages is large
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  Math.abs(pageNum - currentPage) <= 1
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-sapphire text-white shadow-md shadow-sapphire/20'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === 2 && currentPage > 3) {
                  return <span key={pageNum} className="px-1 text-gray-400 text-xs">...</span>;
                }
                if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                  return <span key={pageNum} className="px-1 text-gray-400 text-xs">...</span>;
                }
                return null;
              })}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Separate Items Viewer Modal */}
      <AnimatePresence>
        {viewingBrandItems && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingBrandItems(null)}
              className="absolute inset-0 bg-deep-navy/40 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/70 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sapphire/10 text-sapphire flex items-center justify-center font-bold">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                        {viewingBrandItems.name} Items
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${getCategoryBadgeStyle(viewingBrandItems.category)}`}>
                        {viewingBrandItems.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Showing all products associated with {viewingBrandItems.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingBrandItems(null)}
                  className="p-2.5 bg-white hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-700 border border-gray-100 cursor-pointer shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-4 max-h-[calc(85vh-160px)]">
                {currentBrandProducts.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-sapphire rounded-full flex items-center justify-center mx-auto">
                      <Boxes size={28} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-800">No products linked yet</h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                        There are currently no products with "{viewingBrandItems.name}" in their name or brand field.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setViewingBrandItems(null);
                        navigate('/admin/products');
                      }}
                      className="px-5 py-2.5 bg-sapphire text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-md shadow-sapphire/20 cursor-pointer"
                    >
                      <Plus size={16} /> Add Product for {viewingBrandItems.name}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500 px-1">
                      <span>{currentBrandProducts.length} Associated Products</span>
                      <button
                        onClick={() => {
                          setViewingBrandItems(null);
                          navigate('/admin/products', { state: { searchTerm: viewingBrandItems.name } });
                        }}
                        className="text-sapphire hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Manage in Products <ExternalLink size={12} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {currentBrandProducts.map(p => (
                        <div 
                          key={p.id}
                          className="flex items-center justify-between p-3.5 bg-gray-50/70 hover:bg-blue-50/40 rounded-2xl border border-gray-100 transition-all group"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img 
                              src={p.image} 
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200/80 bg-white shrink-0" 
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div className="min-w-0">
                              <h5 className="text-sm font-bold text-gray-900 truncate group-hover:text-sapphire transition-colors">
                                {p.name}
                              </h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-semibold text-gray-500">
                                  {p.category} {p.subcategory ? `• ${p.subcategory}` : ''}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md font-bold">
                                  Stock: {p.stock}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 pl-3">
                            <span className="text-sm font-black text-gray-900">
                              ${p.price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => {
                                setViewingBrandItems(null);
                                navigate('/admin/products', { state: { searchTerm: p.name } });
                              }}
                              className="p-2 text-gray-400 hover:text-sapphire hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                              title="Edit in Products"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setViewingBrandItems(null)}
                  className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Brand Modal with Item Category */}
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
              className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              {/* Modal Header */}
              <div className={`px-8 py-6 border-b border-gray-100 flex items-center justify-between ${editingBrand ? 'bg-gradient-to-r from-amber-50/50 to-white/50' : 'bg-gradient-to-r from-gray-50/50 to-white/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white shadow-sm ${editingBrand ? 'bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-sapphire'}`}>
                    {editingBrand ? <Edit2 size={24} className="stroke-[2]" /> : <Bookmark size={24} className="stroke-[2]" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                      {editingBrand ? 'Edit Brand Details' : 'New Brand'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">Configure brand and its item category</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
                  className="p-2.5 bg-white hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-gray-700 border border-gray-100 shadow-sm hover:shadow cursor-pointer"
                >
                  <X size={18} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">
                    Brand Name *
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Sony, Nike, Apple" 
                    value={name} 
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formError) setFormError(null);
                    }} 
                    className={`w-full px-4 py-3.5 border rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all ${
                      formError ? 'border-red-300 focus:border-red-500 ring-2 ring-red-100' : 'border-gray-200 focus:border-sapphire/40'
                    }`}
                  />
                  {formError && (
                    <p className="text-red-500 text-xs font-bold mt-1 ml-1">{formError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">
                    Item Category *
                  </label>
                  <div className="relative">
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 cursor-pointer appearance-none text-sm"
                    >
                      {BRAND_ITEM_CATEGORIES.filter(c => c !== 'All Items').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 ml-1">
                    Groups this brand item-wise in the catalog and storefront filters.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest ml-1">
                    Brand Status
                  </label>
                  <div className="relative">
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 cursor-pointer appearance-none text-sm"
                    >
                      <option value="Active">Active (Visible)</option>
                      <option value="Inactive">Inactive (Hidden)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-2 border-t border-gray-100 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddMode(false); setEditingBrand(null); }}
                    className="flex-1 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-600 font-semibold tracking-wide hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className={`flex-1 py-3.5 text-white rounded-2xl font-semibold tracking-wide hover:shadow-lg transition-all active:scale-[0.98] border border-transparent cursor-pointer ${
                      editingBrand ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-amber-500/30' : 'bg-gradient-to-r from-sapphire to-blue-600 hover:shadow-sapphire/30'
                    }`}
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
