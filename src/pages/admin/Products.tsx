import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Zap, ShoppingBag } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import { useCategoryStore } from '../../store/categoryStore';
import { useAuthStore } from '../../store/authStore';
import type { Product } from '../../store/productStore';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const getStatus = (stock: number) => {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 15) return 'Low Stock';
  return 'Active';
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
  images: '' as any, // We will use comma separated string for input
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

const Products: React.FC = () => {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories } = useCategoryStore();
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const location = useLocation();

  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
      // clear router state so it doesn't re-apply on back/forward navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.category.trim()) e.category = 'Category is required';
    
    const parsedPrice = parseFloat(form.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      e.price = 'Price must be greater than 0';
    }
    
    const parsedStock = parseInt(form.stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      e.stock = 'Stock cannot be negative';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => { 
    setForm({ ...emptyForm }); 
    setErrors({}); 
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
      oldPrice: p.oldPrice !== undefined && p.oldPrice !== null ? p.oldPrice.toString() : '', 
      stock: p.stock.toString(), 
      rating: p.rating.toString(), 
      reviews: p.reviews.toString(), 
      image: p.image, 
      images: p.images ? p.images.join(', ') : '',
      colors: p.colors ? p.colors.join(', ') : '',
      sizes: p.sizes ? p.sizes.join(', ') : '',
      tags: p.tags ? p.tags.join(', ') : '',
      description: p.description || '', 
      isFlashSale: p.isFlashSale || false, 
      isFeatured: p.isFeatured || false, 
      isTrending: p.isTrending || false,
      isBestSeller: p.isBestSeller || false,
      isNew: p.isNew || false,
      discount: p.discount !== undefined && p.discount !== null ? p.discount.toString() : ''
    });
    setErrors({});
    setMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const parsedPrice = parseFloat(form.price) || 0;
    const parsedOldPrice = form.oldPrice === '' || form.oldPrice === undefined || form.oldPrice === null ? undefined : parseFloat(form.oldPrice);
    const parsedStock = parseInt(form.stock, 10) || 0;
    const parsedRating = parseFloat(form.rating) || 4.5;
    const parsedReviews = parseInt(form.reviews, 10) || 0;

    // Auto-calculate discount percentage if old price and current price are provided
    let discountVal = form.discount !== '' && form.discount !== undefined && form.discount !== null ? parseInt(form.discount, 10) : undefined;
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
      images: typeof form.images === 'string' && form.images.trim() ? form.images.split(',').map((s: string) => s.trim()) : undefined,
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
    if (window.confirm('Delete this product? This will also remove it from the storefront.')) {
      deleteProduct(id);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const InputField = ({ label, field, type = 'text', placeholder = '' }: { label: string; field: keyof typeof form; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">{label}</label>
      <input
        type={type === 'number' ? 'text' : type}
        inputMode={type === 'number' ? 'decimal' : undefined}
        placeholder={placeholder}
        value={(form[field] !== undefined && form[field] !== null) ? (form[field] as string | number) : ''}
        onChange={(e) => {
          const val = e.target.value;
          if (type === 'number') {
            if (val !== '' && !/^\d*\.?\d*$/.test(val)) {
              return;
            }
          }
          setForm({ 
            ...form, 
            [field]: val 
          });
        }}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/15 ${
          errors[field] ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-sapphire/35'
        }`}
      />
      {errors[field] && <p className="text-red-500 text-xs font-semibold">{errors[field]}</p>}
    </div>
  );

  if (mode !== 'list') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h1>
            <p className="text-xs text-gray-400 font-bold mt-1">
              {mode === 'add' ? 'Publish a new item to the store catalog.' : `Modifying parameters for "${editingProduct?.name}".`}
            </p>
          </div>
          <button 
            onClick={() => setMode('list')} 
            className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 border-none flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Container Grid with Live Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Edit Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/10 space-y-8">
            
            {/* Section 1: General Details */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 tracking-tight pb-2 border-b border-gray-50">General Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <InputField label="Product Name *" field="name" placeholder="e.g. Sony Alpha a7 III Camera" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sapphire/15 transition-all ${
                      errors.category ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-sapphire/35'
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs font-semibold">{errors.category}</p>}
                </div>
                
                <div className="md:col-span-1">
                  <InputField label="Subcategory" field="subcategory" placeholder="e.g. Laptops" />
                </div>
                
                <div className="md:col-span-1">
                  <InputField label="Brand" field="brand" placeholder="e.g. Apple" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 focus:border-sapphire/35 focus:bg-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/15 transition-all placeholder:text-gray-400 font-medium"
                    placeholder="Provide a comprehensive product description..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Stock */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 tracking-tight pb-2 border-b border-gray-50">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <InputField label="Price ($) *" field="price" type="number" placeholder="0.00" />
                <InputField label="Old Price ($)" field="oldPrice" type="number" placeholder="0.00" />
                <InputField label="Stock Quantity *" field="stock" type="number" placeholder="0" />
              </div>
            </div>

            {/* Section 3: Media & Parameters */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 tracking-tight pb-2 border-b border-gray-50">Media & Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="md:col-span-2 lg:col-span-3">
                  <InputField label="Primary Image URL" field="image" placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <InputField label="Additional Images (Comma separated URLs)" field="images" placeholder="URL 1, URL 2..." />
                </div>
                <InputField label="Rating (0-5)" field="rating" type="number" placeholder="4.5" />
                <InputField label="Reviews Count" field="reviews" type="number" placeholder="0" />
                <InputField label="Discount %" field="discount" type="number" placeholder="Optional" />
              </div>
            </div>

            {/* Section 3.5: Variants & Tags */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 tracking-tight pb-2 border-b border-gray-50">Variants & Tags</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputField label="Colors (Comma separated)" field="colors" placeholder="Red, Blue, Green" />
                <InputField label="Sizes (Comma separated)" field="sizes" placeholder="S, M, L, XL" />
                <InputField label="Tags (Comma separated)" field="tags" placeholder="Summer, New, Premium" />
              </div>
            </div>

            {/* Section 4: Visibility & Badges */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 tracking-tight pb-2 border-b border-gray-50">Visibility Settings</h3>
              <div className="flex gap-8 flex-wrap">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => setForm({ ...form, isFlashSale: !form.isFlashSale })} 
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${form.isFlashSale ? 'bg-sapphire' : 'bg-gray-200'}`}
                  >
                    <motion.span 
                      layout 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="bg-white w-4 h-4 rounded-full shadow-sm block" 
                      style={{ originX: 0.5 }}
                      animate={{ x: form.isFlashSale ? 20 : 0 }}
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm flex items-center gap-1 group-hover:text-sapphire transition-colors"><Zap size={14} className="text-yellow-500 fill-yellow-500" /> Flash Sale</p>
                    <p className="text-xs text-gray-500 font-medium">Highlight deal on sale directories</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })} 
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${form.isFeatured ? 'bg-sapphire' : 'bg-gray-200'}`}
                  >
                    <motion.span 
                      layout 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="bg-white w-4 h-4 rounded-full shadow-sm block" 
                      style={{ originX: 0.5 }}
                      animate={{ x: form.isFeatured ? 20 : 0 }}
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm flex items-center gap-1 group-hover:text-sapphire transition-colors">⭐ Featured</p>
                    <p className="text-xs text-gray-500 font-medium">Display on catalog showcase sections</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => setForm({ ...form, isTrending: !form.isTrending })} 
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${form.isTrending ? 'bg-sapphire' : 'bg-gray-200'}`}
                  >
                    <motion.span 
                      layout 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="bg-white w-4 h-4 rounded-full shadow-sm block" 
                      style={{ originX: 0.5 }}
                      animate={{ x: form.isTrending ? 20 : 0 }}
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm flex items-center gap-1 group-hover:text-sapphire transition-colors">🔥 Trending</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => setForm({ ...form, isBestSeller: !form.isBestSeller })} 
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${form.isBestSeller ? 'bg-sapphire' : 'bg-gray-200'}`}
                  >
                    <motion.span 
                      layout 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="bg-white w-4 h-4 rounded-full shadow-sm block" 
                      style={{ originX: 0.5 }}
                      animate={{ x: form.isBestSeller ? 20 : 0 }}
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm flex items-center gap-1 group-hover:text-sapphire transition-colors">🏆 Best Seller</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div 
                    onClick={() => setForm({ ...form, isNew: !form.isNew })} 
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 shrink-0 ${form.isNew ? 'bg-sapphire' : 'bg-gray-200'}`}
                  >
                    <motion.span 
                      layout 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="bg-white w-4 h-4 rounded-full shadow-sm block" 
                      style={{ originX: 0.5 }}
                      animate={{ x: form.isNew ? 20 : 0 }}
                    />
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm flex items-center gap-1 group-hover:text-sapphire transition-colors">✨ New Arrival</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-5 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => setMode('list')} 
                className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl text-xs font-bold transition-all border border-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-8 py-3 bg-sapphire hover:bg-deep-navy text-white rounded-2xl text-xs font-black shadow-lg shadow-sapphire/15 transition-all flex items-center gap-2 cursor-pointer border-none"
              >
                <Check size={16} className="stroke-[2.5]" /> {mode === 'add' ? 'Publish Product' : 'Save Changes'}
              </button>
            </div>
          </form>

          {/* Right Column: Live Product Card Mockup */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl shadow-gray-200/10 space-y-5 lg:sticky lg:top-24">
            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Real-time Mockup</span>
              <span className="px-2.5 py-0.5 bg-blue-50 text-sapphire rounded-md text-[9px] font-black uppercase tracking-wider">Live Preview</span>
            </div>

            <div className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col bg-white relative">
              {/* Flash Sale Badge */}
              {form.isFlashSale && (
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-0.5 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-md">
                  -{form.oldPrice && parseFloat(form.oldPrice) > (parseFloat(form.price) || 0) ? Math.round(((parseFloat(form.oldPrice) - (parseFloat(form.price) || 0)) / parseFloat(form.oldPrice)) * 100) : 10}% Off
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider shadow-sm ${
                  (parseInt(form.stock, 10) || 0) === 0 ? 'bg-rose-50 text-rose-700 border-rose-100' :
                  (parseInt(form.stock, 10) || 0) <= 15 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>
                  {(parseInt(form.stock, 10) || 0) === 0 ? 'Out of Stock' : (parseInt(form.stock, 10) || 0) <= 15 ? 'Low Stock' : 'Active'}
                </span>
              </div>

              {/* Image box */}
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-50 relative group">
                {form.image ? (
                  <img 
                    src={form.image} 
                    alt="preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="text-center p-6 text-gray-300">
                    <ShoppingBag size={40} className="mx-auto mb-2 opacity-30" />
                    <p className="text-[10px] font-black uppercase tracking-wider">Image Preview</p>
                  </div>
                )}
              </div>

              {/* Text Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-gray-100">
                    {form.category || 'Category'}
                  </span>
                  <div className="ml-auto flex items-center gap-0.5 text-xs text-yellow-400">
                    ★ <span className="text-gray-600 font-extrabold text-[10px]">{form.rating || '4.5'} ({form.reviews || '0'})</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-gray-900 text-sm line-clamp-1">{form.name || 'New Product Title'}</h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-lg text-sapphire">${form.price ? (parseFloat(form.price) || 0).toFixed(2) : '0.00'}</span>
                  {form.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">${(parseFloat(form.oldPrice) || 0).toFixed(2)}</span>
                  )}
                </div>

                {form.description && (
                  <p className="text-[10px] text-gray-400 font-medium line-clamp-2 border-t border-gray-50 pt-2">{form.description}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Changes here reflect live on the storefront.</p>
        </div>
        <button 
          onClick={handleAdd} 
          className="flex items-center gap-2 bg-gradient-to-r from-sapphire to-blue-600 text-white px-5 py-3 rounded-2xl text-xs font-black hover:shadow-xl hover:shadow-sapphire/25 transition-all duration-300 border-none cursor-pointer"
        >
          <Plus size={18} className="stroke-[2.5]" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/10 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/20">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sapphire/15 focus:border-sapphire/35 bg-white transition-all"
            />
          </div>
          {isSuperAdmin && (
            <span className="text-xs text-gray-400 font-black uppercase tracking-widest">{filtered.length} products found</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Tags</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => {
                const status = getStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 bg-gray-50 shrink-0 shadow-sm" 
                        />
                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900 text-sm line-clamp-1 max-w-[200px] group-hover:text-sapphire transition-colors">{product.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-yellow-400 text-xs">★</span>
                            <span className="text-[10px] text-gray-400 font-bold">{product.rating} ({product.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider">{product.category}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-gray-900 text-sm">${product.price.toFixed(2)}</p>
                      {product.oldPrice && <p className="text-[10px] text-gray-400 line-through font-semibold">${product.oldPrice.toFixed(2)}</p>}
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-gray-600">{product.stock} units</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {product.isFlashSale && (
                          <span className="text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-0.5">
                            ⚡ Sale
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-0.5">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-lg border font-black uppercase tracking-wider ${
                        status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="p-2 text-gray-400 hover:text-sapphire hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                          title="Edit"
                        >
                          <Edit2 size={14} className="stroke-[2.5]" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                          title="Delete"
                        >
                          <Trash2 size={14} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;
