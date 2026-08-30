import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import { useCategoryStore } from '../../store/categoryStore';
import type { Category } from '../../store/categoryStore';
import { useProductStore } from '../../store/productStore';
import { useAuthStore } from '../../store/authStore';
import { TextInput } from '../../components/TextInput';

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

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setParent('-');
    setIsAddMode(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setParent(category.parent);
    setIsAddMode(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will not be deleted, but they won\'t have an active category association.')) {
      deleteCategory(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage storefront classification and hierarchies.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-sapphire text-white px-4 py-2 rounded-lg font-medium hover:bg-deep-navy transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Categories Table */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${isAddMode ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 text-sm">
                  <th className="p-4 font-medium">Category Name</th>
                  <th className="p-4 font-medium">Slug</th>
                  <th className="p-4 font-medium">Parent Category</th>
                  {isSuperAdmin && <th className="p-4 font-medium">Products</th>}
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="p-8 text-center text-gray-400">No categories created yet.</td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                        {category.parent !== '-' && <span className="w-4 h-px bg-gray-300 inline-block"></span>}
                        {category.parent === '-' && <FolderTree size={16} className="text-sapphire" />}
                        {category.name}
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-sm">{category.slug}</td>
                      <td className="p-4 text-gray-600">
                        {category.parent === '-' ? <span className="text-gray-400 italic">None (Top Level)</span> : category.parent}
                      </td>
                      {isSuperAdmin && <td className="p-4 font-medium text-gray-900">{getProductCount(category.name)}</td>}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleEditClick(category)}
                            className="text-gray-400 hover:text-sapphire transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(category.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
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

        {/* Add/Edit Category Form */}
        {isAddMode && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit sticky top-24">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => { setIsAddMode(false); setEditingCategory(null); }} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <TextInput 
                label="Category Name" 
                placeholder="e.g. Laptops" 
                value={name} 
                onChange={(e) => handleNameChange(e.target.value)} 
              />
              <TextInput 
                label="URL Slug" 
                placeholder="e.g. laptops" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select 
                  value={parent} 
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900"
                >
                  <option value="-">None (Top Level)</option>
                  {categories
                    .filter((c) => c.parent === '-' && c.id !== editingCategory?.id)
                    .map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select 'None' to create a main category.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddMode(false); setEditingCategory(null); }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-sapphire text-white rounded-lg font-medium hover:bg-deep-navy transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
