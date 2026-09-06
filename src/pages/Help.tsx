import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, CreditCard, Truck, RefreshCw, AlertTriangle, 
  Search, ChevronDown, CheckCircle2, ShieldCheck, Send, 
  Clock, Lock, DollarSign, Package, MapPin
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type HelpCategory = 'all' | 'payments' | 'shipping' | 'returns' | 'faq' | 'infringement' | 'policy';

const faqItems = [
  {
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major international credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Klarna Pay-in-4 financing.',
  },
  {
    category: 'payments',
    question: 'Is my payment information safe and secure?',
    answer: 'Yes! All transactions are encrypted using enterprise 256-bit SSL encryption. We never store your full credit card credentials on our servers.',
  },
  {
    category: 'shipping',
    question: 'How long does shipping take and how much does it cost?',
    answer: 'Standard Shipping takes 3–5 business days ($4.99 or FREE for orders over $100). Express Shipping takes 1–2 business days ($14.99). International shipping takes 5–8 business days.',
  },
  {
    category: 'shipping',
    question: 'How do I track my order once it has shipped?',
    answer: 'Once your order is dispatched, you will receive an instant email and SMS containing your carrier tracking link. You can also view live tracking inside your Account Profile page.',
  },
  {
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day hassle-free return policy. If you are not 100% satisfied with your item, return it in original condition for a full refund or instant store exchange.',
  },
  {
    category: 'returns',
    question: 'How quickly will I receive my refund?',
    answer: 'Refunds are processed within 24–48 hours after our warehouse receives and inspects your returned package. Funds take 2–5 business days to post to your original payment method.',
  },
];

const paymentMethods = [
  { name: 'Credit & Debit Cards', desc: 'Visa, Mastercard, Amex, Discover', icon: CreditCard, color: 'text-blue-500 bg-blue-50 border-blue-100' },
  { name: 'Digital Wallets', desc: 'Apple Pay, Google Pay, PayPal', icon: Lock, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
  { name: 'Buy Now, Pay Later', desc: 'Klarna, Afterpay (4 Interest-Free Installments)', icon: DollarSign, color: 'text-purple-500 bg-purple-50 border-purple-100' },
];

const shippingTiers = [
  { name: 'Standard Shipping', time: '3 - 5 Business Days', cost: 'Free over $100 (else $4.99)', icon: Package },
  { name: 'Express Overnight', time: '1 - 2 Business Days', cost: '$14.99 Flat Rate', icon: Truck },
  { name: 'International Express', time: '5 - 8 Business Days', cost: 'Calculated at Checkout', icon: Clock },
];

export default function Help() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<HelpCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Shipping Calculator State
  const [shippingZip, setShippingZip] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingResult, setShippingResult] = useState<{ date: string, region: string } | null>(null);

  // Security Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(false);

  const runSecurityScan = () => {
    setIsScanning(true);
    setScanResult(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(true);
      setTimeout(() => setScanResult(false), 5000);
    }, 2000);
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingZip) return;
    setIsCalculatingShipping(true);
    setShippingResult(null);
    setTimeout(() => {
      setIsCalculatingShipping(false);
      setShippingResult({
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        region: 'Standard Delivery'
      });
    }, 1500);
  };

  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (['payments', 'shipping', 'returns', 'faq', 'infringement', 'policy'].includes(path)) {
      setActiveCategory(path as HelpCategory);
    }
  }, [location.pathname]);

  // Infringement Form State
  const [infringementForm, setInfringementForm] = useState({
    reporterName: '',
    reporterEmail: '',
    rightsHolder: '',
    infringementType: 'Trademark',
    productUrl: '',
    description: '',
  });
  const [isInfringementSubmitted, setIsInfringementSubmitted] = useState(false);

  // Modal State for Policies
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'epr' | 'sitemap' | null>(null);

  const handleInfringementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infringementForm.reporterName || !infringementForm.reporterEmail || !infringementForm.productUrl) return;
    setIsInfringementSubmitted(true);
    setTimeout(() => {
      setIsInfringementSubmitted(false);
      setInfringementForm({
        reporterName: '',
        reporterEmail: '',
        rightsHolder: '',
        infringementType: 'Trademark',
        productUrl: '',
        description: '',
      });
    }, 4500);
  };

  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || activeCategory === 'faq' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased overflow-hidden">
      
      {/* 1. HELP CENTER HERO */}
      <section className="relative py-20 bg-gradient-to-b from-slate-900 via-deep-navy to-slate-900 text-white border-b border-slate-800">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-5"
          >
            <HelpCircle size={14} />
            <span>The BatStore Support Centre</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            How Can We <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Help You Today?</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mb-8">
            Search our knowledge base for instant answers regarding payments, shipping, returns, or report copyright infringement.
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shipping, payment methods, returns..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 shadow-xl transition-all"
            />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS BAR */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl flex md:justify-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Topics', icon: HelpCircle, activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-600/20' },
            { id: 'payments', label: 'Payments', icon: CreditCard, activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-600/20' },
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck, activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' },
            { id: 'returns', label: 'Cancellation & Returns', icon: RefreshCw, activeClass: 'bg-purple-600 text-white shadow-md shadow-purple-600/20' },
            { id: 'faq', label: 'FAQ', icon: HelpCircle, activeClass: 'bg-amber-500 text-white shadow-md shadow-amber-500/20' },
            { id: 'infringement', label: 'Report Infringement', icon: AlertTriangle, activeClass: 'bg-red-500 text-white shadow-md shadow-red-500/20' },
            { id: 'policy', label: 'Consumer Policy', icon: ShieldCheck, activeClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as HelpCategory)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? tab.activeClass 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl py-16 space-y-16">

        {/* SECTION 1: PAYMENTS */}
        {(activeCategory === 'all' || activeCategory === 'payments') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Payments & Checkout Security</h2>
                <p className="text-xs text-slate-500">Secure, encrypted international payment options</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {paymentMethods.map((pm) => {
                const Icon = pm.icon;
                return (
                  <div key={pm.name} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 transition-colors ${pm.color} group-hover:shadow-sm`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{pm.name}</h3>
                    <p className="text-xs text-slate-500 font-normal">{pm.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Security Verification Tool */}
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 relative overflow-hidden mt-2">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
               <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60 shadow-sm">
                   <ShieldCheck size={24} />
                 </div>
                 <div className="flex-1">
                   <h4 className="text-base font-bold text-slate-900">256-Bit SSL Enterprise Protection</h4>
                   <p className="text-[13px] text-slate-600 leading-relaxed mt-1 mb-5 max-w-2xl">
                     All credit card information is encrypted at rest and in transit. The BatStore conforms to strict PCI-DSS Level 1 compliance standards so your personal financial details remain 100% safe.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                     <button 
                       onClick={runSecurityScan}
                       disabled={isScanning}
                       className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                     >
                       {isScanning ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
                       {isScanning ? 'Running Security Diagnostic...' : 'Verify Connection Security'}
                     </button>

                     <AnimatePresence>
                       {scanResult && (
                         <motion.div 
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -10 }}
                           className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold"
                         >
                           <CheckCircle2 size={14} />
                           Connection is Secure & Encrypted
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 </div>
               </div>
            </div>
          </motion.section>
        )}

        {/* SECTION 2: SHIPPING & DELIVERY */}
        {(activeCategory === 'all' || activeCategory === 'shipping') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Shipping & Delivery Rates</h2>
                <p className="text-xs text-slate-500">Fast, door-to-door trackable shipping options</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {shippingTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div key={tier.name} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-200/60 transition-colors">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{tier.name}</h3>
                    <p className="text-xs font-bold text-emerald-600 mb-2">{tier.time}</p>
                    <p className="text-xs text-slate-500">{tier.cost}</p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Shipping Calculator */}
            <div className="mb-8 p-6 rounded-2xl bg-white border border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex items-start gap-4 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Estimate Delivery Date</h3>
                  <p className="text-xs text-slate-500 mt-1">Enter your ZIP or Postal Code to see when your order will arrive.</p>
                </div>
              </div>

              <form onSubmit={handleCalculateShipping} className="flex flex-col sm:flex-row gap-3 relative z-10">
                <div className="relative flex-1">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    placeholder="Enter ZIP code (e.g. 10001)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    maxLength={10}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isCalculatingShipping || !shippingZip}
                  className="px-6 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {isCalculatingShipping ? <RefreshCw size={16} className="animate-spin" /> : 'Calculate Delivery'}
                </button>
              </form>

              <AnimatePresence>
                {shippingResult && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-200/50 text-emerald-700 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] text-slate-700">Estimated delivery to <strong>{shippingZip}</strong> ({shippingResult.region}):</p>
                        <p className="text-base font-extrabold text-emerald-700 mt-0.5">{shippingResult.date}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Need real-time order tracking?</h4>
                <p className="text-xs text-slate-500">Enter your order ID in your profile or check your confirmation email.</p>
              </div>
              <Link to="/profile" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shrink-0">
                Track Order
              </Link>
            </div>
          </motion.section>
        )}

        {/* SECTION 3: CANCELLATION & RETURNS */}
        {(activeCategory === 'all' || activeCategory === 'returns') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <RefreshCw size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Cancellation & Returns Policy</h2>
                <p className="text-xs text-slate-500">Hassle-free 30-day money back guarantee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
              {[
                { step: '01', title: 'Request Return', desc: 'Submit return request via Account Orders' },
                { step: '02', title: 'Print Label', desc: 'Get free prepaid return shipping label' },
                { step: '03', title: 'Drop Off Item', desc: 'Drop item at any postal pickup location' },
                { step: '04', title: 'Instant Refund', desc: 'Receive refund within 24-48 hours' },
              ].map((s) => (
                <div key={s.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                  <span className="text-xs font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{s.step}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQ) */}
        {(activeCategory === 'all' || activeCategory === 'faq') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HelpCircle size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-500">Quick answers to common inquiries</p>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 bg-slate-50/70 hover:bg-slate-100/80 transition-colors font-bold text-slate-900 text-sm cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pb-5 pt-2 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* SECTION 5: REPORT INFRINGEMENT (IP & TRADEMARK) */}
        {(activeCategory === 'all' || activeCategory === 'infringement') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">Report Intellectual Property Infringement</h2>
                <p className="text-xs text-slate-400">Notice of Copyright or Trademark Infringement Notice</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              The BatStore respects intellectual property rights. If you believe your trademark, copyright, or brand asset is being infringed by any product listed on The BatStore, please submit a formal report below.
            </p>

            <AnimatePresence>
              {isInfringementSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-10 space-y-3 bg-slate-800/80 rounded-2xl border border-slate-700"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Infringement Notice Submitted!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you. Our Legal & Compliance Team has logged your claim under reference ID <span className="text-blue-400 font-bold">#IP-{Math.floor(100000 + Math.random() * 900000)}</span> and will investigate within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleInfringementSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name / Legal Agent</label>
                      <input
                        type="text"
                        required
                        value={infringementForm.reporterName}
                        onChange={(e) => setInfringementForm({ ...infringementForm, reporterName: e.target.value })}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                      <input
                        type="email"
                        required
                        value={infringementForm.reporterEmail}
                        onChange={(e) => setInfringementForm({ ...infringementForm, reporterEmail: e.target.value })}
                        placeholder="legal@brand.com"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Brand / Rights Holder Name</label>
                      <input
                        type="text"
                        required
                        value={infringementForm.rightsHolder}
                        onChange={(e) => setInfringementForm({ ...infringementForm, rightsHolder: e.target.value })}
                        placeholder="Acme Brand Corporation"
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Infringement Type</label>
                      <select
                        value={infringementForm.infringementType}
                        onChange={(e) => setInfringementForm({ ...infringementForm, infringementType: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                      >
                        <option value="Trademark">Trademark Infringement</option>
                        <option value="Copyright">Copyright Infringement</option>
                        <option value="Patent">Patent Infringement</option>
                        <option value="Counterfeit">Counterfeit / Fake Product</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Infringing Product URL / ID</label>
                    <input
                      type="text"
                      required
                      value={infringementForm.productUrl}
                      onChange={(e) => setInfringementForm({ ...infringementForm, productUrl: e.target.value })}
                      placeholder="https://thebatstore.com/products/123"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description of Infringement</label>
                    <textarea
                      required
                      rows={3}
                      value={infringementForm.description}
                      onChange={(e) => setInfringementForm({ ...infringementForm, description: e.target.value })}
                      placeholder="Provide registration numbers, exact copyright material, or infringement proof..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-red-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={15} /> Submit Infringement Claim
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {/* SECTION 6: CONSUMER POLICY */}
        {(activeCategory === 'all' || activeCategory === 'policy') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Consumer Policy & Legal</h2>
                <p className="text-xs text-slate-500">Privacy, Terms, Sitemap, and Compliance Information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
               {/* Privacy */}
               <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                 <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                   <Lock size={16} className="text-indigo-500" /> Privacy Policy
                 </h3>
                 <p className="text-xs text-slate-500 mb-4 leading-relaxed">Read about how we protect and manage your personal data across our services in accordance with global privacy laws.</p>
                 <button onClick={() => setActivePolicyModal('privacy')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Read Full Policy &rarr;</button>
               </div>
               
               {/* EPR Compliance */}
               <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                 <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                   <CheckCircle2 size={16} className="text-emerald-500" /> EPR Compliance
                 </h3>
                 <p className="text-xs text-slate-500 mb-4 leading-relaxed">We are fully compliant with Extended Producer Responsibility (EPR) regulations for sustainable waste management.</p>
                 <button onClick={() => setActivePolicyModal('epr')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">View Certificate &rarr;</button>
               </div>

               {/* Sitemap */}
               <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                 <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                   <MapPin size={16} className="text-amber-500" /> Sitemap
                 </h3>
                 <p className="text-xs text-slate-500 mb-4 leading-relaxed">Navigate easily through our extensive catalog of products, collections, services, and corporate pages.</p>
                 <button onClick={() => setActivePolicyModal('sitemap')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">View Sitemap &rarr;</button>
               </div>
            </div>
          </motion.section>
        )}

      </div>

      {/* POLICY MODALS */}
      <AnimatePresence>
        {activePolicyModal === 'privacy' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActivePolicyModal(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/50">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Privacy Policy</h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-1">Last updated: July 2026</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActivePolicyModal(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-3 text-indigo-600">1. Information We Collect</h4>
                    <p className="text-slate-600 text-sm leading-loose">
                      We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, and other information you choose to provide.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-3 text-indigo-600">2. How We Use Information</h4>
                    <p className="text-slate-600 text-sm leading-loose">
                      We use the information we collect to provide, maintain, and improve our services. This includes using the information to process payments, provide customer support, send updates and administrative messages, and communicate with you about products, services, offers, and events offered by The BatStore.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-3 text-indigo-600">3. Data Sharing and Disclosure</h4>
                    <p className="text-slate-600 text-sm leading-loose">
                      We may share the information we collect about you as described in this privacy policy or as described at the time of collection or sharing, including as follows: With third party service providers who need access to such information to carry out work on our behalf; In response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-3 text-indigo-600">4. Your Data Rights</h4>
                    <p className="text-slate-600 text-sm leading-loose">
                      Depending on your location, you may have the right to request access to, correct, or delete your personal data. You may also have the right to restrict or object to certain processing of your data. To exercise these rights, please contact our Data Protection Officer through the Help Center.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button 
                  onClick={() => setActivePolicyModal(null)}
                  className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activePolicyModal === 'epr' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActivePolicyModal(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/50">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">EPR Compliance Certificate</h3>
                    <p className="text-xs font-semibold text-emerald-600 mt-1">Valid through: Dec 2026</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActivePolicyModal(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-slate-50/50">
                <div className="w-32 h-32 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle2 size={64} className="text-emerald-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Verified Sustainable Enterprise</h4>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
                  The BatStore is officially certified for Extended Producer Responsibility (EPR), guaranteeing that our packaging and electronics waste are responsibly recycled in accordance with local and international environmental laws.
                </p>
                <div className="bg-white border border-slate-200 rounded-xl p-4 w-full max-w-md flex justify-between items-center text-left">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Registration ID</p>
                    <p className="text-sm font-bold text-slate-800 font-mono mt-0.5">EPR-POST-84291-XX</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <ShieldCheck size={16} className="text-emerald-600" />
                  </div>
                </div>
              </div>
              
              <div className="p-5 sm:p-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
                <button 
                  onClick={() => setActivePolicyModal(null)}
                  className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Close Certificate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activePolicyModal === 'sitemap' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setActivePolicyModal(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/50">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">Website Sitemap</h3>
                    <p className="text-xs font-semibold text-amber-600 mt-1">Full Directory</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActivePolicyModal(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Shop</h4>
                    <ul className="space-y-3">
                      <li><Link to="/products" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">All Products</Link></li>
                      <li><Link to="/categories" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Categories</Link></li>
                      <li><Link to="/sale" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Sale & Clearance</Link></li>
                      <li><Link to="/cart" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Shopping Cart</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Account</h4>
                    <ul className="space-y-3">
                      <li><Link to="/login" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Sign In / Register</Link></li>
                      <li><Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">My Profile</Link></li>
                      <li><Link to="/wishlist" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Wishlist</Link></li>
                      <li><Link to="/notifications" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Alerts</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Corporate</h4>
                    <ul className="space-y-3">
                      <li><Link to="/about" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">About Us</Link></li>
                      <li><Link to="/careers" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Careers</Link></li>
                      <li><Link to="/press" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Press & News</Link></li>
                      <li><Link to="/help" className="text-sm font-medium text-slate-600 hover:text-amber-600 block transition-colors">Help Center</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                <button 
                  onClick={() => setActivePolicyModal(null)}
                  className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Close Sitemap
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
