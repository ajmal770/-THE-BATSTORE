import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, FolderTree, Check, ChevronDown, Tag, Link as LinkIcon, Network } from 'lucide-react';
import { useCategoryStore } from '../../store/categoryStore';
import type { Category } from '../../store/categoryStore';
import { useProductStore } from '../../store/productStore';
import { useAuthStore } from '../../store/authStore';

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
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-10 py-3.5 border rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all cursor-pointer flex items-center bg-white ${
          error ? 'border-red-300 focus:border-red-400 bg-red-50' : 'border-gray-200 hover:border-sapphire/30 focus:border-sapphire'
        } ${isOpen ? 'ring-4 ring-sapphire/10 border-sapphire' : ''}`}
      >
        <span className={value ? "text-gray-900 truncate font-bold" : "text-gray-400 font-bold"}>
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
                    value === opt.value ? 'bg-sapphire text-white font-bold shadow-md shadow-sapphire/20' : 'text-gray-700 hover:bg-gray-50 font-bold'
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

const InputField = ({ label, value, onChange, placeholder, icon: Icon, error }: any) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sapphire transition-colors" size={16} />}
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} 
        className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 border rounded-2xl text-sm text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all ${
          error ? 'border-red-300 focus:border-red-400 bg-red-50' : 'border-gray-200 hover:border-sapphire/30 focus:border-sapphire bg-white'
        }`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1.5 font-bold flex items-center gap-1"><X size={12}/> {error}</p>}
  </div>
);

const Categories: React.FC = () => {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { products } = useProductStore();
  
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parent, setParent] = useState('-');
  const [errors, setErrors] = useState<{name?: string, slug?: string}>({});

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    if (errors.name) setErrors(e => ({ ...e, name: undefined }));
    if (errors.slug) setErrors(e => ({ ...e, slug: undefined }));
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setParent('-');
    setErrors({});
    setIsAddMode(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setParent(category.parent);
    setErrors({});
    setIsAddMode(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category? Products in this category will not be deleted, but they won't have an active category association.")) {
      deleteCategory(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let currentErrors: any = {};
    if (!name.trim()) currentErrors.name = 'Name is required';
    if (!slug.trim()) currentErrors.slug = 'Slug is required';
    
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, { name, slug, parent });
    } else {
      addCategory({ name, slug, parent });
    }

    setIsAddMode(false);
    setEditingCategory(null);
  };

  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase()).length;
  };

  // Generate options for parent category dropdown
  const parentOptions = [
    { value: '-', label: 'None (Top Level Category)' },
    ...categories
      .filter((c) => c.parent === '-' && c.id !== editingCategory?.id)
      .map((c) => ({ value: c.name, label: c.name }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage storefront classification and hierarchies.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-sapphire to-blue-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-sapphire/20 hover:-translate-y-0.5 transition-all cursor-pointer border-none"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Categories Table */}
        <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${isAddMode ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-sm">
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-5 pl-6">Category Details</th>
                  <th className="p-5">URL Slug</th>
                  <th className="p-5">Hierarchy</th>
                  {isSuperAdmin && <th className="p-5 text-center">Items</th>}
                  <th className="p-5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="p-12 text-center text-gray-400">
                      <FolderTree size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-sm font-medium text-gray-500">No categories created yet.</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.parent === '-' ? 'bg-sapphire/10 text-sapphire' : 'bg-gray-100 text-gray-400'}`}>
                              {category.parent === '-' ? <FolderTree size={18} /> : <Network size={18} />}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{category.name}</p>
                              {category.parent !== '-' && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Sub-category</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <LinkIcon size={14} className="opacity-50" />
                            <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{category.slug}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {category.parent === '-' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                              Top Level
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-sapphire/5 text-sapphire border border-sapphire/10">
                              <FolderTree size={12} /> {category.parent}
                            </span>
                          )}
                        </td>
                        {isSuperAdmin && (
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                              {getProductCount(category.name)}
                            </span>
                          </td>
                        )}
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(category)}
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-sapphire hover:text-white text-gray-500 flex items-center justify-center transition-all cursor-pointer border border-gray-200 hover:border-sapphire shadow-sm"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(category.id)}
                              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-500 hover:text-white text-gray-500 flex items-center justify-center transition-all cursor-pointer border border-gray-200 hover:border-red-500 shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="md:hidden flex items-center justify-end gap-2">
                            <button onClick={() => handleEditClick(category)} className="text-sapphire p-1"><Edit2 size={16} /></button>
                            <button onClick={() => handleDeleteClick(category.id)} className="text-red-500 p-1"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Category Form */}
        <AnimatePresence mode="wait">
          {isAddMode && (
            <motion.div 
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-xl shadow-gray-200/20 border border-gray-100 overflow-hidden flex flex-col sticky top-24"
            >
              <div className="bg-gradient-to-r from-gray-900 to-sapphire px-6 py-5 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                    {editingCategory ? <Edit2 size={18} /> : <Plus size={18} />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                    <p className="text-xs font-medium text-white/70">Configure your storefront structure</p>
                  </div>
                </div>
                <button onClick={() => { setIsAddMode(false); setEditingCategory(null); }} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-white/20">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 bg-gray-50/50">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <InputField 
                      label="Category Name" 
                      placeholder="e.g. Smartwatches" 
                      value={name} 
                      onChange={handleNameChange} 
                      icon={Tag}
                      error={errors.name}
                    />
                    
                    <InputField 
                      label="URL Slug" 
                      placeholder="e.g. smartwatches" 
                      value={slug} 
                      onChange={setSlug} 
                      icon={LinkIcon}
                      error={errors.slug}
                    />
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Hierarchy / Parent</label>
                    <CustomSelect 
                      value={parent}
                      onChange={setParent}
                      options={parentOptions}
                      icon={Network}
                    />
                    <div className="mt-3 flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      <FolderTree size={16} className="text-sapphire mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Selecting a parent category will make this a sub-category. To create a main top-level category, select "None".
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => { setIsAddMode(false); setEditingCategory(null); }}
                      className="flex-1 py-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-2xl text-gray-700 font-bold transition-all cursor-pointer shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3.5 bg-gradient-to-r from-sapphire to-blue-600 hover:from-deep-navy hover:to-sapphire text-white rounded-2xl font-bold shadow-lg shadow-sapphire/25 hover:shadow-sapphire/40 transition-all flex items-center justify-center gap-2 cursor-pointer border-none hover:-translate-y-0.5"
                    >
                      <Check size={18} /> {editingCategory ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Categories;
