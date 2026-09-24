import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Zap, Filter, ChevronDown, ArrowUpRight, PackageSearch, Image as ImageIcon, Info, DollarSign, LayoutList, ShieldCheck, Star, TrendingUp } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoryStore';
import type { Product } from '../../store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-600 border-red-100' };
  if (stock <= 15) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-600 border-amber-100' };
  return { label: 'In Stock', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
};

const emptyForm = {
  name: '',
  category: '',
  subcategory: '',
  brand: '',
  price: '' as any,
  oldPrice: '' as any,
  stock: '0' as any,
  rating: '4.5' as any,
  reviews: '0' as any,
  image: '',
  image2: '',
  image3: '',
  image4: '',
  image5: '',
  image6: '',
  colors: '' as any,
  sizes: '' as any,
  tags: '' as any,
  description: '',
  isFlashSale: false,
  isFeatured: false,
  isTrending: false,
  isBestSeller: false,
  isNew: false,
  discount: '' as any,
};

const CustomSelect = ({ value, onChange, options, placeholder = "Select...", icon: Icon, error, className = "" }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative group w-full ${className}`} ref={dropdownRef}>
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sapphire transition-colors z-10" size={16} />}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3.5 border rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all cursor-pointer flex items-center ${
          error ? 'border-red-300 focus:border-red-400 bg-red-50' : 'border-gray-200 hover:border-sapphire/30 focus:border-sapphire bg-inherit'
        } ${isOpen ? 'ring-4 ring-sapphire/10 border-sapphire' : ''}`}
      >
        <span className={value ? "text-gray-900 truncate" : "text-gray-400"}>
          {value ? (options.find((o: any) => o.value === value)?.label || value) : placeholder}
        </span>
      </div>
      <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform duration-300 ${isOpen ? 'rotate-180 text-sapphire' : ''}`} size={16} />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar p-1.5 flex flex-col gap-0.5">
              {options.map((opt: any) => (
                <div
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-3 py-2.5 text-sm rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                    value === opt.value ? 'bg-sapphire text-white font-bold shadow-md shadow-sapphire/20' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <Check size={14} className="shrink-0" />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories } = useCategoryStore();
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Advanced Model Form State
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'media' | 'settings'>('general');
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.category.trim()) e.category = 'Required';
    
    const parsedPrice = parseFloat(form.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) e.price = 'Invalid';
    
    const parsedStock = parseInt(form.stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) e.stock = 'Invalid';
    
    setErrors(e);
    
    // Auto-switch to tab with errors if validation fails
    if (e.name || e.category) setActiveTab('general');
    else if (e.price || e.stock) setActiveTab('pricing');
    
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => { 
    setForm({ ...emptyForm }); 
    setErrors({}); 
    setActiveTab('general');
    setSelectedPreviewImage(null);
    setMode('add'); 
  };
  
  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ 
      name: p.name, 
      category: p.category, 
      subcategory: p.subcategory || '',
      brand: p.brand || '',
      price: p.price.toString(), 
      oldPrice: p.oldPrice ? p.oldPrice.toString() : '', 
      stock: p.stock.toString(), 
      rating: p.rating.toString(), 
      reviews: p.reviews.toString(), 
      image: p.image, 
      image2: p.images?.[0] || '',
      image3: p.images?.[1] || '',
      image4: p.images?.[2] || '',
      image5: p.images?.[3] || '',
      image6: p.images?.[4] || '',
      colors: p.colors ? p.colors.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : '',
      tags: p.tags ? p.tags.join(', ') : '',
      description: p.description || '', 
      isFlashSale: p.isFlashSale || false, 
      isFeatured: p.isFeatured || false, 
      isTrending: p.isTrending || false,
      isBestSeller: p.isBestSeller || false,
      isNew: p.isNew || false,
      discount: p.discount ? p.discount.toString() : ''
    });
    setErrors({});
    setActiveTab('general');
    setSelectedPreviewImage(null);
    setMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const parsedPrice = parseFloat(form.price) || 0;
    const parsedOldPrice = form.oldPrice ? parseFloat(form.oldPrice) : undefined;
    const parsedStock = parseInt(form.stock, 10) || 0;
    const parsedRating = parseFloat(form.rating) || 4.5;
    const parsedReviews = parseInt(form.reviews, 10) || 0;

    let discountVal = form.discount ? parseInt(form.discount, 10) : undefined;
    if (parsedOldPrice && parsedOldPrice > parsedPrice) {
      discountVal = Math.round(((parsedOldPrice - parsedPrice) / parsedOldPrice) * 100);
    }

    const payload: Omit<Product, 'id'> = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, ''),
      category: form.category,
      subcategory: form.subcategory || undefined,
      brand: form.brand || undefined,
      price: parsedPrice,
      oldPrice: parsedOldPrice,
      stock: parsedStock,
      rating: parsedRating,
      reviews: parsedReviews,
      reviewCount: parsedReviews,
      image: form.image,
      images: [form.image2, form.image3, form.image4, form.image5, form.image6].filter(Boolean) as string[],
      colors: typeof form.colors === 'string' && form.colors.trim() ? form.colors.split(',').map((s: string) => s.trim()) : undefined,
      sizes: typeof form.sizes === 'string' && form.sizes.trim() ? form.sizes.split(',').map((s: string) => s.trim()) : undefined,
      tags: typeof form.tags === 'string' && form.tags.trim() ? form.tags.split(',').map((s: string) => s.trim()) : undefined,
      description: form.description,
      isFlashSale: form.isFlashSale,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isBestSeller: form.isBestSeller,
      isNew: form.isNew,
      discount: discountVal,
      createdAt: mode === 'add' ? new Date().toISOString() : undefined,
    };

    if (mode === 'add') {
      addProduct(payload);
    } else if (mode === 'edit' && editingProduct) {
      updateProduct(editingProduct.id, payload);
    }
    setMode('list');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product permanently?')) {
      deleteProduct(id);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category))];

  const InputField = ({ label, field, type = 'text', placeholder = '', colSpan = 1, icon: Icon }: { label: string; field: keyof typeof form; type?: string; placeholder?: string, colSpan?: number, icon?: any }) => (
    <div className={`space-y-1.5 ${colSpan === 2 ? 'md:col-span-2' : ''}`}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sapphire transition-colors" size={16} />}
        <input
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'decimal' : undefined}
          placeholder={placeholder}
          value={(form[field] !== undefined && form[field] !== null) ? (form[field] as string | number) : ''}
          onChange={(e) => {
            const val = e.target.value;
            if (type === 'number' && val !== '' && !/^\d*\.?\d*$/.test(val)) return;
            setForm({ ...form, [field]: val });
          }}
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 border rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:bg-white focus:ring-4 focus:ring-sapphire/10 ${
            errors[field] ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-sapphire'
          }`}
        />
        {errors[field] && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm">
            {errors[field]}
          </span>
        )}
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, field, icon: Icon, colorClass, desc }: any) => (
    <div className="flex items-start justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group" onClick={() => setForm({ ...form, [field]: !form[field as keyof typeof form] })}>
      <div className="flex gap-3">
        <div className={`p-2 rounded-xl bg-white shadow-sm border border-gray-100 ${form[field as keyof typeof form] ? colorClass : 'text-gray-400'} group-hover:scale-105 transition-transform`}>
          <Icon size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">{label}</h4>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 mt-1 shrink-0 ${form[field as keyof typeof form] ? 'bg-sapphire' : 'bg-gray-200'}`}>
        <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className="bg-white w-4 h-4 rounded-full shadow-md" animate={{ x: form[field as keyof typeof form] ? 24 : 0 }} />
      </div>
    </div>
  );

  if (mode !== 'list') {
    return (
      <div className="space-y-6 max-w-[1400px] mx-auto pb-20">
        {/* Dynamic Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10 pointer-events-none" />
          <div className="flex items-center gap-4">
            <button onClick={() => setMode('list')} className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition-colors shadow-sm border border-gray-200 cursor-pointer group">
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {mode === 'add' ? 'Create New Product' : 'Edit Product'}
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {mode === 'add' ? 'Design and publish a new item to your catalog.' : `Modifying advanced parameters for "${editingProduct?.name}".`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button type="button" onClick={() => setMode('list')} className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-sm font-bold transition-all cursor-pointer shadow-sm">
              Discard
            </button>
            <button onClick={handleSubmit} className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-sapphire to-blue-600 hover:from-deep-navy hover:to-sapphire text-white rounded-2xl text-sm font-bold shadow-lg shadow-sapphire/25 hover:shadow-sapphire/40 transition-all flex items-center justify-center gap-2 cursor-pointer border-none hover:-translate-y-0.5">
              <Check size={18} /> {mode === 'add' ? 'Publish Now' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Custom Tab Navigation */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex overflow-x-auto no-scrollbar gap-2">
              {[
                { id: 'general', label: 'General Info', icon: Info },
                { id: 'pricing', label: 'Pricing & Stock', icon: DollarSign },
                { id: 'media', label: 'Media & Attributes', icon: ImageIcon },
                { id: 'settings', label: 'Visibility Badges', icon: ShieldCheck },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer border-none ${
                    activeTab === tab.id 
                      ? 'bg-sapphire text-white shadow-md' 
                      : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* General Tab */}
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
                        <p className="text-xs text-gray-500 mt-1 font-medium">This is the core data displayed to your customers.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Product Title *" field="name" placeholder="e.g. Premium Leather Jacket" colSpan={2} icon={LayoutList} />
                        
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Category *</label>
                          <CustomSelect
                            value={form.category}
                            onChange={(val: string) => setForm({ ...form, category: val })}
                            options={categories.map(c => ({ value: c.name, label: c.name }))}
                            placeholder="Select a Category"
                            icon={Filter}
                            error={errors.category}
                            className="bg-gray-50/50 hover:bg-gray-50"
                          />
                          {errors.category && <p className="text-red-500 text-[10px] font-bold px-1 mt-1">{errors.category}</p>}
                        </div>

                        <InputField label="Brand Name" field="brand" placeholder="e.g. Nike" />
                        
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rich Description</label>
                          <textarea
                            rows={6}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full p-4 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 text-gray-900 focus:border-sapphire focus:bg-white rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all placeholder:text-gray-400 resize-y leading-relaxed"
                            placeholder="Write a compelling product description detailing the features, materials, and benefits..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing Tab */}
                  {activeTab === 'pricing' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Pricing & Inventory</h2>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Control the cost and track the available stock for this item.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/30 p-6 rounded-2xl border border-gray-100">
                        <InputField label="Selling Price ($) *" field="price" type="number" placeholder="0.00" icon={DollarSign} />
                        <InputField label="Original Price ($)" field="oldPrice" type="number" placeholder="0.00 (Crossed out)" icon={DollarSign} />
                        <InputField label="Available Stock *" field="stock" type="number" placeholder="0" icon={PackageSearch} />
                        
                        {/* Auto Discount Calculator Preview */}
                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Calculated Discount</p>
                            <p className="text-2xl font-black text-emerald-500 mt-1">
                              {form.oldPrice && parseFloat(form.oldPrice) > (parseFloat(form.price) || 0) 
                                ? `${Math.round(((parseFloat(form.oldPrice) - (parseFloat(form.price) || 0)) / parseFloat(form.oldPrice)) * 100)}%` 
                                : '0%'}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                            <Zap size={24} className="fill-emerald-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media Tab */}
                  {activeTab === 'media' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Media & Variations</h2>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Manage images, tags, and product variants like colors and sizes.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Primary Image URL" field="image" placeholder="https://..." colSpan={2} icon={ImageIcon} />
                        
                        <div className="md:col-span-2 p-6 bg-gray-50/50 border border-gray-100 border-dashed rounded-2xl text-center">
                          <div className="flex gap-2 justify-center mb-3">
                            <ImageIcon size={32} className="text-gray-300" />
                          </div>
                          <p className="text-sm font-bold text-gray-700">Add Primary & Additional Images</p>
                          <p className="text-xs text-gray-500 mt-1 font-medium">Provide valid URLs. The primary image displays on the preview card immediately.</p>
                        </div>

                        <InputField label="Image 2 URL" field="image2" placeholder="https://..." icon={ImageIcon} />
                        <InputField label="Image 3 URL" field="image3" placeholder="https://..." icon={ImageIcon} />
                        <InputField label="Image 4 URL" field="image4" placeholder="https://..." icon={ImageIcon} />
                        <InputField label="Image 5 URL" field="image5" placeholder="https://..." icon={ImageIcon} />
                        <InputField label="Image 6 URL" field="image6" placeholder="https://..." colSpan={2} icon={ImageIcon} />
                        
                        <InputField label="Available Colors (CSV)" field="colors" placeholder="e.g. Red, Blue, Matte Black" />
                        <InputField label="Available Sizes (CSV)" field="sizes" placeholder="e.g. S, M, L, XL" />
                        <InputField label="Search Tags (CSV)" field="tags" placeholder="e.g. summer, premium, new" colSpan={2} />
                      </div>
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <div className="pb-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Visibility & Status Badges</h2>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Highlight this product in special sections across the storefront.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ToggleSwitch 
                          label="Flash Sale" 
                          field="isFlashSale" 
                          icon={Zap} 
                          colorClass="text-yellow-500" 
                          desc="Display discount badges heavily" 
                        />
                        <ToggleSwitch 
                          label="Featured Product" 
                          field="isFeatured" 
                          icon={ArrowUpRight} 
                          colorClass="text-blue-500" 
                          desc="Show in top showcase sections" 
                        />
                        <ToggleSwitch 
                          label="Trending Now" 
                          field="isTrending" 
                          icon={TrendingUp} 
                          colorClass="text-rose-500" 
                          desc="Add the fire trending badge" 
                        />
                        <ToggleSwitch 
                          label="Best Seller" 
                          field="isBestSeller" 
                          icon={Star} 
                          colorClass="text-amber-500" 
                          desc="Mark as top selling item" 
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Advanced Live Preview */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-gray-900 to-sapphire px-6 py-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <h3 className="text-sm font-bold tracking-widest uppercase">Live View</h3>
                </div>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">Storefront</span>
              </div>
              
              <div className="p-6 bg-gray-50 flex-1">
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm group">
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {form.isFlashSale && <span className="bg-red-500 text-white px-2.5 py-1 rounded text-[10px] font-black tracking-widest shadow-lg uppercase">Sale</span>}
                    {form.isNew && <span className="bg-blue-500 text-white px-2.5 py-1 rounded text-[10px] font-black tracking-widest shadow-lg uppercase">New</span>}
                  </div>
                  
                  {/* Image Section */}
                  <div className="aspect-[4/3] bg-gray-100 flex flex-col justify-end overflow-hidden relative group/img">
                    {form.image || selectedPreviewImage ? (
                      <img src={selectedPreviewImage || form.image} alt="preview" className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-in-out" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest">Image Area</span>
                      </div>
                    )}
                    {/* Hover Overlay Mock */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Extra Images Thumbnails Overlay */}
                    {[form.image2, form.image3, form.image4, form.image5, form.image6].filter(Boolean).length > 0 && (
                      <div className="relative z-10 flex gap-1.5 p-3 w-full bg-gradient-to-t from-black/60 via-black/20 to-transparent overflow-x-auto no-scrollbar">
                        {[form.image, form.image2, form.image3, form.image4, form.image5, form.image6].filter(Boolean).map((img, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedPreviewImage(img)}
                            className={`w-10 h-10 rounded-md overflow-hidden border-2 shadow-sm shrink-0 bg-white/20 backdrop-blur-sm cursor-pointer transition-all hover:scale-110 ${
                              (selectedPreviewImage === img) || (!selectedPreviewImage && i === 0) 
                                ? 'border-white ring-2 ring-white/50 scale-110' 
                                : 'border-white/40 hover:border-white/80'
                            }`}
                          >
                            <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Details Section */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] bg-gray-50 text-gray-500 px-2 py-1 rounded font-bold uppercase tracking-widest border border-gray-100">
                        {form.category || 'CATEGORY'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[10px] font-bold text-gray-600">{form.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1">{form.name || 'Your Product Title'}</h3>
                    {form.brand && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{form.brand}</p>}
                    
                    <div className="flex items-end gap-2 mt-4">
                      <span className="font-black text-xl text-sapphire">${form.price ? (parseFloat(form.price) || 0).toFixed(2) : '0.00'}</span>
                      {form.oldPrice && <span className="text-sm text-gray-400 line-through font-bold mb-0.5">${(parseFloat(form.oldPrice) || 0).toFixed(2)}</span>}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50">
                       <span className={`inline-flex items-center px-2 py-1 rounded-[4px] text-[9px] font-bold uppercase tracking-wider ${getStockStatus(parseInt(form.stock, 10) || 0).color}`}>
                        {getStockStatus(parseInt(form.stock, 10) || 0).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LIST MODE (Unchanged from previous advanced model)
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products Management</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage your store catalog and inventory beautifully.</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-gradient-to-r from-sapphire to-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-sapphire/20 hover:-translate-y-0.5 transition-all cursor-pointer border-none">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sapphire/20 focus:border-sapphire shadow-sm transition-all placeholder:text-gray-400"
          />
        </div>
        <CustomSelect
          value={selectedCategory}
          onChange={(val: string) => setSelectedCategory(val)}
          options={uniqueCategories.map(c => ({ value: c, label: c === 'All' ? 'All Categories' : c }))}
          icon={Filter}
          className="min-w-[200px] bg-white shadow-sm"
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                <th className="p-5 pl-6">Product</th>
                <th className="p-5">Price</th>
                <th className="p-5">Inventory</th>
                <th className="p-5">Status</th>
                <th className="p-5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock);
                  return (
                    <tr 
                      key={product.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 shadow-sm">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            {product.isFlashSale && <div className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"><Zap size={10} /></div>}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm hover:text-sapphire transition-colors cursor-pointer" onClick={() => handleEdit(product)}>{product.name}</p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900 text-sm">${product.price.toFixed(2)}</p>
                        {product.oldPrice && <p className="text-xs text-gray-400 line-through font-medium">${product.oldPrice.toFixed(2)}</p>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                            <div className={`h-full rounded-full ${product.stock > 15 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 w-8">{product.stock}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(product)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-sapphire hover:text-white text-gray-500 flex items-center justify-center transition-all cursor-pointer border border-gray-200 hover:border-sapphire shadow-sm">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-500 hover:text-white text-gray-500 flex items-center justify-center transition-all cursor-pointer border border-gray-200 hover:border-red-500 shadow-sm">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="md:hidden flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(product)} className="text-sapphire p-1"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-500 p-1"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <PackageSearch size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium text-gray-500">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
