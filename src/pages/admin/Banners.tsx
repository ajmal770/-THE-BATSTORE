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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-sapphire/10 text-sapphire rounded-xl flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            Banner Management
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium ml-13">Manage homepage carousel banners, order slides, and promotional graphics.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-gradient-to-r from-sapphire to-blue-600 hover:from-deep-navy hover:to-sapphire shadow-md shadow-sapphire/20 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer border-none flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Banner List */}
        <div className={`bg-white rounded-3xl shadow-sm border border-gray-100 p-6 transition-all duration-300 ${isAddMode ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-sapphire rounded-full"></div>
            {sortedBanners.length} Active Homepage Banners
          </h2>
          
          {sortedBanners.length === 0 ? (
            <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-100 rounded-2xl">
              <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-bold text-gray-900">No banners found</p>
              <p className="text-sm">Click 'Add New Banner' to create your first slide.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedBanners.map((banner, index) => (
                <div key={banner.id} className="group relative bg-white border border-gray-100 hover:border-sapphire/30 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sapphire/5 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col gap-1.5 bg-gray-50/80 p-1.5 rounded-xl border border-gray-100/50 shadow-sm shrink-0">
                    <button 
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0} 
                      className="p-1.5 rounded-lg hover:bg-white hover:text-sapphire hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none cursor-pointer transition-all text-gray-400"
                    >
                      <MoveUp size={16} />
                    </button>
                    <button 
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === sortedBanners.length - 1} 
                      className="p-1.5 rounded-lg hover:bg-white hover:text-sapphire hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none cursor-pointer transition-all text-gray-400"
                    >
                      <MoveDown size={16} />
                    </button>
                  </div>
                  
                  <div className="w-full md:w-64 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200/50 shadow-inner relative">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-1 w-full flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <h3 className="font-bold text-lg text-gray-900 tracking-tight">{banner.title}</h3>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border border-black/5 ${
                        banner.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${banner.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {banner.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Link</span>
                        <span className="text-gray-700 font-medium truncate bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{banner.link || 'None'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-16">Order</span>
                        <span className="text-sapphire font-bold bg-sapphire/10 px-2 py-0.5 rounded">{banner.order}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto md:flex-col justify-end shrink-0">
                    <button 
                      onClick={() => handleEditClick(banner)}
                      className="flex-1 md:flex-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold hover:bg-sapphire hover:text-white hover:border-sapphire flex justify-center items-center gap-1.5 transition-all cursor-pointer text-gray-600 shadow-sm"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white hover:border-rose-500 flex justify-center items-center gap-1.5 transition-all cursor-pointer shadow-sm"
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
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/20 border border-gray-100 overflow-hidden flex flex-col h-fit sticky top-24 lg:col-span-1">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sapphire to-blue-500" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-blue-50 text-sapphire rounded-xl flex items-center justify-center border border-blue-100/35">
                  <ImageIcon size={16} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {editingBanner ? 'Edit Banner' : 'Add Banner'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Configure slide properties</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setIsAddMode(false); setEditingBanner(null); }}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 border border-gray-100 shadow-sm"
              >
                <X size={16} className="stroke-[2.5]" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <TextInput 
                  label="Banner Title" 
                  placeholder="e.g. Summer Tech Sale" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className="font-medium text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-sm"
                />
              </div>
              
              <div>
                <TextInput 
                  label="Image URL" 
                  placeholder="e.g. https://images..." 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)} 
                  className="font-medium text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-sm"
                />
              </div>
              
              <div>
                <TextInput 
                  label="Redirection URL Link" 
                  placeholder="e.g. /products?category=Electronics" 
                  value={link} 
                  onChange={(e) => setLink(e.target.value)} 
                  className="font-medium text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Display Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sapphire/20 transition-all focus:border-sapphire cursor-pointer shadow-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {image && (
                <div className="border border-gray-200 rounded-xl p-2 bg-gray-50/80 shadow-inner">
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <ImageIcon size={12} className="text-gray-400" />
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Live Preview</p>
                  </div>
                  <div className="w-full h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group">
                    <img src={image} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&q=80'; }} />
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsAddMode(false); setEditingBanner(null); }}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors cursor-pointer text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-sapphire to-blue-600 shadow-md shadow-sapphire/20 text-white rounded-xl font-bold hover:from-deep-navy hover:to-sapphire transition-all cursor-pointer border-none text-xs uppercase tracking-wider"
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
