import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import { useCouponStore } from '../../store/couponStore';
import type { Coupon } from '../../store/couponStore';
import { TextInput } from '../../components/TextInput';
import { motion, AnimatePresence } from 'framer-motion';

const Coupons: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed Amount' | 'Free Shipping'>('Percentage');
  const [value, setValue] = useState(0);
  const [minOrder, setMinOrder] = useState(0);
  const [expiry, setExpiry] = useState('');
  const [status, setStatus] = useState<'Active' | 'Expired'>('Active');

  const handleAddClick = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('Percentage');
    setValue(0);
    setMinOrder(0);
    setExpiry('');
    setStatus('Active');
    setIsAddMode(true);
  };

  const handleEditClick = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.type);
    setValue(coupon.value);
    setMinOrder(coupon.minOrder);
    setExpiry(coupon.expiry === 'Never' ? '' : coupon.expiry);
    setStatus(coupon.status);
    setIsAddMode(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this coupon? This will deactivate it for all checkouts.')) {
      deleteCoupon(id);
    }
  };

  const handleToggleStatus = (coupon: Coupon) => {
    const nextStatus = coupon.status === 'Active' ? 'Expired' : 'Active';
    updateCoupon(coupon.id, { status: nextStatus });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const couponData = {
      code: code.trim().toUpperCase(),
      type: discountType,
      value: discountType === 'Free Shipping' ? 0 : value,
      minOrder,
      expiry: expiry || 'Never',
      status,
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
    } else {
      addCoupon(couponData);
    }

    setIsAddMode(false);
    setEditingCoupon(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons & Discounts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage promotional offers, discounts, and order thresholds.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-sapphire text-white px-4 py-2 rounded-lg font-medium hover:bg-deep-navy transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/10 border border-gray-100 overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider font-black">
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Min Order</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Expiry</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60 text-sm">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 font-semibold">No coupons active.</td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-black text-sapphire flex items-center gap-2">
                      <Tag size={15} className="text-sapphire" /> {coupon.code}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{coupon.type}</td>
                    <td className="px-6 py-4 text-gray-900 font-extrabold">
                      {coupon.type === 'Percentage' ? `${coupon.value}%` : 
                       coupon.type === 'Fixed Amount' ? `$${coupon.value.toFixed(2)}` : 'Free Shipping'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-semibold">${coupon.minOrder.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-550 font-medium">{coupon.usage} {coupon.usage === 1 ? 'time' : 'times'}</td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">{coupon.expiry}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(coupon)}
                        className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider cursor-pointer transition-colors border-none ${
                          coupon.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/60' 
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100/60'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${coupon.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {coupon.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleEditClick(coupon)}
                          className="p-1.5 text-gray-400 hover:text-sapphire hover:bg-blue-50/50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon.id)}
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

      {/* Add/Edit Coupon Modal */}
      <AnimatePresence>
        {isAddMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddMode(false); setEditingCoupon(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 z-10"
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
                      {editingCoupon ? 'Modify Coupon' : 'Create Coupon'}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">Define codes, percentages & limitations</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsAddMode(false); setEditingCoupon(null); }}
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600 border border-gray-100 flex items-center justify-center shadow-sm"
                >
                  <X size={16} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 bg-white text-xs">
                
                {/* Coupon Code Input */}
                <div>
                  <TextInput 
                    label="Coupon Code" 
                    placeholder="e.g. EXTRA25" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    className="uppercase font-bold tracking-widest text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-xs" 
                  />
                </div>

                {/* Discount Type Selector Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Discount Mode</label>
                  <div className="flex gap-2">
                    {(['Percentage', 'Fixed Amount', 'Free Shipping'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDiscountType(t)}
                        className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider border rounded-xl transition-all cursor-pointer ${
                          discountType === t 
                            ? 'border-sapphire bg-blue-50/50 text-sapphire shadow-sm shadow-sapphire/5' 
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Value */}
                {discountType !== 'Free Shipping' && (
                  <div>
                    <TextInput 
                      label={`Discount Amount (${discountType === 'Percentage' ? '%' : '$'})`} 
                      type="number" 
                      value={value}
                      onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                      placeholder={discountType === 'Percentage' ? '20' : '50.00'} 
                      className="font-bold text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-xs"
                    />
                  </div>
                )}
                
                {/* Minimum order requirement */}
                <div>
                  <TextInput 
                    label="Minimum Order Subtotal Limit ($)" 
                    type="number" 
                    value={minOrder}
                    onChange={(e) => setMinOrder(parseFloat(e.target.value) || 0)}
                    placeholder="0" 
                    className="font-bold text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-xs"
                  />
                </div>
                
                {/* Expiry Date */}
                <div>
                  <TextInput 
                    label="Expiry Date Limit" 
                    type="date" 
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="font-bold text-gray-900 border-gray-200 focus:ring-sapphire/15 rounded-xl py-2.5 text-xs"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Active Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Expired')}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-sapphire/15 transition-all focus:border-sapphire/35 cursor-pointer text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-4 flex gap-3.5">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddMode(false); setEditingCoupon(null); }}
                    className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-black uppercase tracking-wider hover:bg-gray-50 transition-colors cursor-pointer text-[10px]"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-sapphire to-blue-600 text-white rounded-xl font-black uppercase tracking-wider hover:shadow-lg hover:shadow-sapphire/20 transition-all cursor-pointer border-none text-[10px]"
                  >
                    {editingCoupon ? 'Save Changes' : 'Create Coupon'}
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

export default Coupons;
