import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit2, MoveUp, MoveDown, X } from 'lucide-react';
import { useBannerStore } from '../../store/bannerStore';
import type { Banner } from '../../store/bannerStore';
import { TextInput } from '../../components/TextInput';

const Banners: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, reorderBanners } = useBannerStore();
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [link, setLink] = useState('');

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  const handleAddClick = () => {
    setEditingBanner(null);
    setTitle('');
    setImage('');
    setStatus('Active');
    setLink('');
    setIsAddMode(true);
  };

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setImage(banner.image);
    setStatus(banner.status);
    setLink(banner.link);
    setIsAddMode(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this banner? It will disappear from the homepage carousel.')) {
      deleteBanner(id);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sortedBanners.length) return;

    const items = [...sortedBanners];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);

    reorderBanners(items);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) return;

    const bannerData = {
      title: title.trim(),
      image: image.trim(),
      status,
      link: link.trim(),
      order: editingBanner ? editingBanner.order : banners.length + 1,
    };

    if (editingBanner) {
      updateBanner(editingBanner.id, bannerData);
    } else {
      addBanner(bannerData);
    }

    setIsAddMode(false);
    setEditingBanner(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="text-sapphire" /> Banner Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage homepage carousel banners, order slides, and promotional graphics</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-sapphire text-white px-4 py-2 rounded-lg font-medium hover:bg-deep-navy transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Banner List */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${isAddMode ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Active Homepage Banners</h2>
          
          {sortedBanners.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No banners found. Click 'Add New Banner' to create one.</div>
          ) : (
            <div className="space-y-4">
              {sortedBanners.map((banner, index) => (
                <div key={banner.id} className="flex flex-col md:flex-row items-center gap-6 p-4 border border-gray-200 rounded-xl hover:border-sapphire transition-colors group">
                  <div className="flex flex-col gap-2 text-gray-400">
                    <button 
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0} 
                      className="hover:text-sapphire disabled:opacity-30 cursor-pointer"
                    >
                      <MoveUp size={18} />
                    </button>
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === sortedBanners.length - 1} 
                      className="hover:text-sapphire disabled:opacity-30 cursor-pointer"
                    >
                      <MoveDown size={18} />
                    </button>
                  </div>
                  
                  <div className="w-full md:w-64 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{banner.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        banner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {banner.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1"><span className="font-medium text-gray-700">Link URL:</span> {banner.link || 'None'}</p>
                    <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Display Order:</span> {banner.order}</p>
                  </div>

                  <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end">
                    <button 
                      onClick={() => handleEditClick(banner)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-1 transition-colors cursor-pointer text-gray-700"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Banner Editor Form */}
        {isAddMode && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-fit sticky top-24">
            <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={() => { setIsAddMode(false); setEditingBanner(null); }} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <TextInput 
                label="Banner Title" 
                placeholder="e.g. Summer Tech Sale" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
              <TextInput 
                label="Banner Image URL" 
                placeholder="e.g. https://images.unsplash.com/... or relative" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
              />
              <TextInput 
                label="Redirection URL Link" 
                placeholder="e.g. /products?category=Electronics" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-sapphire"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {image && (
                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Live Image Preview</p>
                  <img src={image} alt="Preview" className="w-full h-24 object-cover rounded-md" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80'; }} />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddMode(false); setEditingBanner(null); }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-sapphire text-white rounded-lg font-medium hover:bg-deep-navy transition-colors cursor-pointer"
                >
                  {editingBanner ? 'Save Changes' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;
