import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Truck, Receipt, Search, Save, AlertCircle } from 'lucide-react';
import { useSettingsStore, type Settings as SettingsType } from '../../store/settingsStore';

type Tab = 'general' | 'shipping' | 'tax' | 'seo';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [form, setForm] = useState<SettingsType>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const handleChange = (field: keyof SettingsType, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 flex items-center gap-2">
            <SettingsIcon className="text-sapphire" /> Platform Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Configure global store settings, shipping, and SEO</p>
        </div>
        <div className="flex items-center gap-4">
          {isSaved && (
            <span className="text-green-600 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-200 animate-pulse">
              ✓ Settings Saved Successfully!
            </span>
          )}
          <button 
            onClick={handleSave}
            className="bg-sapphire text-white px-6 py-2 rounded-lg font-medium hover:bg-deep-navy transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save size={18} /> Save All Changes
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left font-medium transition-colors cursor-pointer ${activeTab === 'general' ? 'bg-blue-50 text-sapphire border-l-4 border-sapphire' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
            >
              <Globe size={18} /> General Setup
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left font-medium transition-colors cursor-pointer ${activeTab === 'shipping' ? 'bg-blue-50 text-sapphire border-l-4 border-sapphire' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
            >
              <Truck size={18} /> Shipping Config
            </button>
            <button 
              onClick={() => setActiveTab('tax')}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left font-medium transition-colors cursor-pointer ${activeTab === 'tax' ? 'bg-blue-50 text-sapphire border-l-4 border-sapphire' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
            >
              <Receipt size={18} /> GST & Tax Rates
            </button>
            <button 
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left font-medium transition-colors cursor-pointer ${activeTab === 'seo' ? 'bg-blue-50 text-sapphire border-l-4 border-sapphire' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
            >
              <Search size={18} /> Global SEO
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-4 mb-6">General Store Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input 
                      type="text" 
                      value={form.storeName}
                      onChange={(e) => handleChange('storeName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                    <input 
                      type="email" 
                      value={form.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone Number</label>
                    <input 
                      type="text" 
                      value={form.supportPhone}
                      onChange={(e) => handleChange('supportPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Currency</label>
                    <select 
                      value={form.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900"
                    >
                      <option value="USD ($)">USD ($)</option>
                      <option value="EUR (€)">EUR (€)</option>
                      <option value="INR (₹)">INR (₹)</option>
                      <option value="GBP (£)">GBP (£)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                  <textarea 
                    rows={3} 
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900"
                  />
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Shipping Configuration</h2>
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    <AlertCircle size={14} /> Note: Advanced shipping requires Carrier API setup
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div>
                      <h4 className="font-medium text-gray-900">Flat Rate Shipping</h4>
                      <p className="text-sm text-gray-500">Apply a fixed shipping cost to all orders.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">$</span>
                      <input 
                        type="number" 
                        value={form.flatShippingRate}
                        onChange={(e) => handleChange('flatShippingRate', parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-sapphire outline-none bg-white text-gray-900" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Free Shipping Threshold</h4>
                      <p className="text-sm text-gray-500">Orders above this amount receive free shipping.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">$</span>
                      <input 
                        type="number" 
                        value={form.freeShippingThreshold}
                        onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-1 border border-gray-300 rounded text-right focus:ring-2 focus:ring-sapphire outline-none bg-white text-gray-900" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tax' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-4 mb-6">GST & Tax Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate (%)</label>
                    <input 
                      type="number" 
                      value={form.defaultTaxRate}
                      onChange={(e) => handleChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
                      step="0.1" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Calculation Logic</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900">
                      <option>Prices entered are exclusive of tax</option>
                      <option>Prices entered are inclusive of tax</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-4 mb-6">Global SEO Default Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Meta Title</label>
                    <input 
                      type="text" 
                      value={form.metaTitle}
                      onChange={(e) => handleChange('metaTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Meta Description</label>
                    <textarea 
                      rows={3} 
                      value={form.metaDescription}
                      onChange={(e) => handleChange('metaDescription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                    <input 
                      type="text" 
                      placeholder="G-XXXXXXXXXX" 
                      value={form.googleAnalyticsId}
                      onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Pixel ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter Meta Pixel ID" 
                      value={form.metaPixelId}
                      onChange={(e) => handleChange('metaPixelId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sapphire focus:border-sapphire outline-none bg-white text-gray-900" 
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
