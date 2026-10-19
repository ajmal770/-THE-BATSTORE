import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Truck, Receipt, Search, Save, AlertCircle, Database, Cloud, CheckCircle2 } from 'lucide-react';
import { useSettingsStore, type Settings as SettingsType } from '../../store/settingsStore';
import { isFirebaseConfigured, syncAllProjectDataToFirestore } from '../../services/firestoreService';

type Tab = 'general' | 'shipping' | 'tax' | 'seo' | 'database';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [form, setForm] = useState<SettingsType>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [cloudSyncMsg, setCloudSyncMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    setCloudSyncMsg(null);
    const result = await syncAllProjectDataToFirestore();
    setIsSyncingCloud(false);
    setCloudSyncMsg({ text: result.message, error: !result.success });
  };

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
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-deep-navy to-sapphire flex items-center gap-3">
            <SettingsIcon className="text-sapphire" size={32} /> Platform Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium ml-11">Configure global store settings, shipping, and SEO</p>
        </div>
        <div className="flex items-center gap-4">
          {isSaved && (
            <span className="text-emerald-600 bg-emerald-50/80 backdrop-blur-md px-4 py-2.5 rounded-2xl text-sm font-bold tracking-wide border border-emerald-200/60 animate-pulse flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Settings Saved!
            </span>
          )}
          <button 
            onClick={handleSave}
            className="group relative px-6 py-3 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-2xl font-semibold tracking-wide overflow-hidden shadow-lg shadow-sapphire/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <Save size={20} className="relative z-10" />
            <span className="relative z-10">Save All Changes</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-3 space-y-1">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${activeTab === 'general' ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-sapphire shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
            >
              <Globe size={20} className={activeTab === 'general' ? 'text-sapphire' : 'text-gray-400'} /> General Setup
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${activeTab === 'shipping' ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-sapphire shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
            >
              <Truck size={20} className={activeTab === 'shipping' ? 'text-sapphire' : 'text-gray-400'} /> Shipping Config
            </button>
            <button 
              onClick={() => setActiveTab('tax')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${activeTab === 'tax' ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-sapphire shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
            >
              <Receipt size={20} className={activeTab === 'tax' ? 'text-sapphire' : 'text-gray-400'} /> GST & Tax Rates
            </button>
            <button 
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${activeTab === 'seo' ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-sapphire shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
            >
              <Search size={20} className={activeTab === 'seo' ? 'text-sapphire' : 'text-gray-400'} /> Global SEO
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${activeTab === 'database' ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 text-sapphire shadow-sm border border-blue-100/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
            >
              <Database size={20} className={activeTab === 'database' ? 'text-sapphire' : 'text-gray-400'} /> Cloud Database
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 lg:p-10">
            
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-6 border-b border-gray-100/60">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-sapphire shadow-inner border border-white">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">General Store Details</h2>
                    <p className="text-xs text-gray-500 font-medium">Manage primary store identity and contact information</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Store Name</label>
                    <input 
                      type="text" 
                      value={form.storeName}
                      onChange={(e) => handleChange('storeName', e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Support Email</label>
                    <input 
                      type="email" 
                      value={form.supportEmail}
                      onChange={(e) => handleChange('supportEmail', e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Support Phone</label>
                    <input 
                      type="text" 
                      value={form.supportPhone}
                      onChange={(e) => handleChange('supportPhone', e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Store Currency</label>
                    <div className="relative">
                      <select 
                        value={form.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 appearance-none cursor-pointer"
                      >
                        <option value="USD ($)">USD ($)</option>
                        <option value="EUR (€)">EUR (€)</option>
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="GBP (£)">GBP (£)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Store Address</label>
                  <textarea 
                    rows={3} 
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-sapphire shadow-inner border border-white">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Shipping Configuration</h2>
                      <p className="text-xs text-gray-500 font-medium">Manage delivery costs and thresholds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50/80 border border-amber-200/50 px-3.5 py-2 rounded-xl shadow-sm">
                    <AlertCircle size={16} /> Advanced shipping requires Carrier API setup
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-100 rounded-2xl bg-gradient-to-r from-gray-50/50 to-white hover:border-gray-200 transition-colors shadow-sm">
                    <div className="mb-4 sm:mb-0">
                      <h4 className="font-bold text-gray-900 text-base">Flat Rate Shipping</h4>
                      <p className="text-sm text-gray-500 mt-1">Apply a fixed shipping cost to all orders regardless of size.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-inner">
                      <span className="text-gray-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={form.flatShippingRate}
                        onChange={(e) => handleChange('flatShippingRate', parseFloat(e.target.value) || 0)}
                        className="w-20 text-right font-bold text-gray-900 focus:outline-none bg-transparent" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-100 rounded-2xl bg-gradient-to-r from-gray-50/50 to-white hover:border-gray-200 transition-colors shadow-sm">
                    <div className="mb-4 sm:mb-0">
                      <h4 className="font-bold text-gray-900 text-base">Free Shipping Threshold</h4>
                      <p className="text-sm text-gray-500 mt-1">Orders above this subtotal automatically receive free shipping.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-inner">
                      <span className="text-gray-400 font-bold">$</span>
                      <input 
                        type="number" 
                        value={form.freeShippingThreshold}
                        onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                        className="w-20 text-right font-bold text-gray-900 focus:outline-none bg-transparent" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tax' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-6 border-b border-gray-100/60">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-sapphire shadow-inner border border-white">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">GST & Tax Settings</h2>
                    <p className="text-xs text-gray-500 font-medium">Configure calculation logic and default rates</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Default Tax Rate (%)</label>
                    <input 
                      type="number" 
                      value={form.defaultTaxRate}
                      onChange={(e) => handleChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
                      step="0.1" 
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Tax Calculation Logic</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 appearance-none cursor-pointer">
                        <option>Prices entered are exclusive of tax</option>
                        <option>Prices entered are inclusive of tax</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-6 border-b border-gray-100/60">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-sapphire shadow-inner border border-white">
                    <Search size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Global SEO Settings</h2>
                    <p className="text-xs text-gray-500 font-medium">Manage default metadata and tracking IDs</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Google Analytics ID</label>
                      <input 
                        type="text" 
                        placeholder="G-XXXXXXXXXX" 
                        value={form.googleAnalyticsId}
                        onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Meta Pixel ID</label>
                      <input 
                        type="text" 
                        placeholder="Enter Meta Pixel ID" 
                        value={form.metaPixelId}
                        onChange={(e) => handleChange('metaPixelId', e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-gray-100/60 mt-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mt-6">Default Meta Title</label>
                    <input 
                      type="text" 
                      value={form.metaTitle}
                      onChange={(e) => handleChange('metaTitle', e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Default Meta Description</label>
                    <textarea 
                      rows={4} 
                      value={form.metaDescription}
                      onChange={(e) => handleChange('metaDescription', e.target.value)}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-white/50 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-sapphire/10 transition-all focus:border-sapphire/40 resize-none leading-relaxed" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 pb-6 border-b border-gray-100/60">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-sapphire shadow-inner border border-white">
                    <Database size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Google Cloud Firestore Integration</h2>
                    <p className="text-xs text-gray-500 font-medium">Manage backend persistence, cloud collections, and data synchronization</p>
                  </div>
                </div>

                {/* Firestore Status Card */}
                <div className="bg-gradient-to-r from-deep-navy via-sapphire to-blue-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-sapphire/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 shadow-inner shrink-0">
                      <Database size={26} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-black text-white">Google Cloud Firestore Database</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                          isFirebaseConfigured()
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : 'bg-amber-400/20 text-amber-200 border border-amber-300/40'
                        }`}>
                          {isFirebaseConfigured() ? '🟢 Connected to Cloud' : '🟡 LocalStorage • Cloud Ready'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-1.5 max-w-xl leading-relaxed">
                        {isFirebaseConfigured()
                          ? 'Your platform is live-connected to Google Cloud Firestore. As an administrator, you can synchronize all product catalog, order transactions, customer records, and system settings to Cloud Firestore.'
                          : 'Your platform is currently running on LocalStorage persistence. To connect to Cloud Firestore, add your Firebase keys to your environment configuration (.env) and click Sync Now.'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloudSync}
                    disabled={isSyncingCloud}
                    className="w-full md:w-auto px-6 py-3.5 bg-white text-sapphire hover:bg-blue-50 font-black rounded-2xl transition-all shadow-lg hover:shadow-xl text-sm flex items-center justify-center gap-2.5 shrink-0 cursor-pointer disabled:opacity-75 border-none"
                  >
                    {isSyncingCloud ? (
                      <>
                        <Cloud size={18} className="animate-bounce text-sapphire" />
                        <span>Syncing to Firestore...</span>
                      </>
                    ) : (
                      <>
                        <Cloud size={18} className="text-sapphire" />
                        <span>Sync All Data to Firestore</span>
                      </>
                    )}
                  </button>
                </div>

                {cloudSyncMsg && (
                  <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border ${cloudSyncMsg.error ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    <CheckCircle2 size={16} />
                    <span>{cloudSyncMsg.text}</span>
                  </div>
                )}

                {/* Firestore Collections Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'products', label: 'Products Collection', desc: 'Syncs full catalog & stock' },
                    { name: 'orders', label: 'Orders Collection', desc: 'Syncs invoices & transactions' },
                    { name: 'customers', label: 'Customers Collection', desc: 'Syncs registered customer accounts' },
                    { name: 'settings', label: 'Settings Collection', desc: 'Syncs store & tax configuration' },
                  ].map((col) => (
                    <div key={col.name} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{col.label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{col.desc}</p>
                      </div>
                      <span className="text-[10px] font-mono text-sapphire bg-blue-50 px-2 py-0.5 rounded-md mt-3 w-fit">
                        /{col.name}
                      </span>
                    </div>
                  ))}
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
