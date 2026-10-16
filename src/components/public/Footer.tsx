import React, { useState, useEffect, useRef } from 'react';
import { Globe, Truck, ShieldCheck, Clock, CreditCard, ChevronDown, Check, MapPin, Building2, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGES } from '../../contexts/LanguageContext';

const COUNTRIES = [
  { code: 'US', name: 'USA' },
  { code: 'IN', name: 'IND' },
  { code: 'GB', name: 'UK' },
  { code: 'CA', name: 'CAN' },
  { code: 'AU', name: 'AUS' },
  { code: 'DE', name: 'GER' },
  { code: 'FR', name: 'FRA' },
  { code: 'JP', name: 'JPN' },
  { code: 'BR', name: 'BRA' },
  { code: 'ZA', name: 'RSA' }
];

export const Footer: React.FC = () => {
  const location = useLocation();
  const { activeLang, setLanguage, t } = useLanguage();
  const [activeCountry, setActiveCountry] = useState(COUNTRIES[1]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  
  const langRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Why Choose Us Features Section (Pre-Footer - Only on Home Page) */}
      {location.pathname === '/' && (
        <>
          {/* DESKTOP VIEW */}
          <section className="hidden md:block py-1 sm:py-1.5 bg-white border-t border-gray-100 relative z-10">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
                <Link to="/shipping" className="block outline-none h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 py-1 px-2.5 rounded-lg bg-white border border-gray-100/80 shadow-xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group h-full"
                  >
                    <div className="w-7 h-7 shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 text-sapphire rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <Truck size={14} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">{t('feature.shipping.title')}</h3>
                      <p className="text-gray-500 text-[10px] hidden sm:block leading-tight">{t('feature.shipping.desc')}</p>
                    </div>
                  </motion.div>
                </Link>

                <Link to="/payments" className="block outline-none h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 py-1 px-2.5 rounded-lg bg-white border border-gray-100/80 shadow-xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group h-full"
                  >
                    <div className="w-7 h-7 shrink-0 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <ShieldCheck size={14} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">{t('feature.security.title')}</h3>
                      <p className="text-gray-500 text-[10px] hidden sm:block leading-tight">{t('feature.security.desc')}</p>
                    </div>
                  </motion.div>
                </Link>

                <Link to="/faq" className="block outline-none h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 py-1 px-2.5 rounded-lg bg-white border border-gray-100/80 shadow-xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group h-full"
                  >
                    <div className="w-7 h-7 shrink-0 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <Clock size={14} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">{t('feature.support.title')}</h3>
                      <p className="text-gray-500 text-[10px] hidden sm:block leading-tight">{t('feature.support.desc')}</p>
                    </div>
                  </motion.div>
                </Link>

                <Link to="/returns" className="block outline-none h-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 py-1 px-2.5 rounded-lg bg-white border border-gray-100/80 shadow-xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group h-full"
                  >
                    <div className="w-7 h-7 shrink-0 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500 rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <CreditCard size={14} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">{t('feature.returns.title')}</h3>
                      <p className="text-gray-500 text-[10px] hidden sm:block leading-tight">{t('feature.returns.desc')}</p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
          </section>

          {/* MOBILE VIEW REDESIGN */}
          <section className="md:hidden py-2 bg-slate-50 border-t border-gray-100 relative z-10">
            <div className="px-3">
              <div className="grid grid-cols-2 gap-1.5">
                {/* Free Shipping */}
                <Link to="/shipping" className="bg-white rounded-lg p-2 flex items-center gap-2 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-300 cursor-pointer block h-full outline-none">
                  <div className="w-7 h-7 bg-[#eef4ff] text-[#0057ff] rounded-full flex items-center justify-center shrink-0">
                    <Truck size={14} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-black text-[#0b1021] leading-tight truncate">Free Shipping</h3>
                    <p className="text-slate-500 text-[9px] leading-tight truncate">Over $50 orders</p>
                  </div>
                </Link>

                {/* Secure Payments */}
                <Link to="/payments" className="bg-white rounded-lg p-2 flex items-center gap-2 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-300 cursor-pointer block h-full outline-none">
                  <div className="w-7 h-7 bg-[#e6fbf2] text-[#00b67a] rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={14} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-black text-[#0b1021] leading-tight truncate">Secure Payments</h3>
                    <p className="text-slate-500 text-[9px] leading-tight truncate">100% encrypted</p>
                  </div>
                </Link>

                {/* 24/7 Support */}
                <Link to="/faq" className="bg-white rounded-lg p-2 flex items-center gap-2 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-300 cursor-pointer block h-full outline-none">
                  <div className="w-7 h-7 bg-[#f4eefe] text-[#8b5cf6] rounded-full flex items-center justify-center shrink-0">
                    <Clock size={14} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-black text-[#0b1021] leading-tight truncate">24/7 Support</h3>
                    <p className="text-slate-500 text-[9px] leading-tight truncate">Anytime assistance</p>
                  </div>
                </Link>

                {/* Easy Returns */}
                <Link to="/returns" className="bg-white rounded-lg p-2 flex items-center gap-2 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-300 cursor-pointer block h-full outline-none">
                  <div className="w-7 h-7 bg-[#fff1e6] text-[#f97316] rounded-full flex items-center justify-center shrink-0">
                    <Package size={14} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-black text-[#0b1021] leading-tight truncate">Easy Returns</h3>
                    <p className="text-slate-500 text-[9px] leading-tight truncate">30-day hassle-free</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="bg-gradient-to-b from-slate-900 to-black text-white pt-4 pb-3 sm:pt-5 sm:pb-3.5 border-t border-gray-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-80 h-36 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-36 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-3 lg:gap-4 mb-3">
            
            {/* ABOUT */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-white mb-1.5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></span>
                {t('footer.about')}
              </h3>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-1 gap-x-2 text-[11px] leading-snug text-gray-400 font-medium">
                <li><Link to="/about" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-blue-500 group-hover:w-2 transition-all duration-200 ease-out"></span>{t('nav.contact')}</Link></li>
                <li><Link to="/about" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-blue-500 group-hover:w-2 transition-all duration-200 ease-out"></span>{t('nav.about')}</Link></li>
                <li><Link to="/careers" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-blue-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Careers</Link></li>
                <li><Link to="/press" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-blue-500 group-hover:w-2 transition-all duration-200 ease-out"></span>The BatStore Stories</Link></li>
                <li><Link to="/press" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-blue-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Press</Link></li>
                <li><Link to="/corporate" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-blue-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Corporate Information</Link></li>
              </ul>
            </div>

            {/* HELP */}
            <div className="col-span-1">
              <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-white mb-1.5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
                {t('footer.help')}
              </h3>
              <ul className="space-y-1 text-[11px] leading-snug text-gray-400 font-medium">
                <li><Link to="/payments" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-emerald-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Payments</Link></li>
                <li><Link to="/shipping" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-emerald-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Shipping</Link></li>
                <li><Link to="/returns" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-emerald-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Cancellation & Returns</Link></li>
                <li><Link to="/faq" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-emerald-500 group-hover:w-2 transition-all duration-200 ease-out"></span>FAQ</Link></li>
                <li><Link to="/infringement" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-emerald-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Report Infringement</Link></li>
              </ul>
            </div>

            {/* CONSUMER POLICY */}
            <div className="col-span-1">
              <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-white mb-1.5 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]"></span>
                {t('footer.policy')}
              </h3>
              <ul className="space-y-1 text-[11px] leading-snug text-gray-400 font-medium">
                <li><Link to="/returns" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-purple-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Cancellation & Returns</Link></li>
                <li><Link to="/policy" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-purple-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Terms Of Use</Link></li>
                <li><Link to="/payments" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-purple-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Security</Link></li>
                <li><Link to="/policy" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-purple-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Privacy</Link></li>
                <li><Link to="/policy" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-purple-500 group-hover:w-2 transition-all duration-200 ease-out"></span>Sitemap</Link></li>
                <li><Link to="/policy" className="group flex items-center gap-1.5 hover:text-white transition-colors duration-200 w-fit"><span className="h-px w-0 bg-purple-500 group-hover:w-2 transition-all duration-200 ease-out"></span>EPR Compliance</Link></li>
              </ul>
            </div>

            {/* Mail Us */}
            <div className="col-span-2 md:col-span-1 lg:col-span-1 border-t md:border-t-0 lg:border-l border-gray-800/80 pt-2.5 md:pt-0 lg:pl-5">
              <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-white mb-1.5 uppercase tracking-wider">
                <div className="w-4 h-4 rounded bg-gray-800/80 flex items-center justify-center border border-gray-700/50">
                  <MapPin size={10} className="text-blue-400" />
                </div>
                {t('footer.mail')}
              </h3>
              <div className="text-[11px] text-gray-400 leading-snug space-y-1">
                <p className="font-semibold text-gray-300">The BatStore Private Limited,</p>
                <p>Buildings Alyssa, Begonia & Clove,</p>
                <p>Embassy Tech Village, Outer Ring Road,</p>
                <p>Bengaluru, 560103, Karnataka, India</p>
              </div>
            </div>

            {/* Registered Office Address */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1 border-t md:border-t-0 border-gray-800/80 pt-2.5 md:pt-0">
              <h3 className="flex items-center gap-1.5 text-[10px] font-bold text-white mb-1.5 uppercase tracking-wider">
                <div className="w-4 h-4 rounded bg-gray-800/80 flex items-center justify-center border border-gray-700/50">
                  <Building2 size={10} className="text-emerald-400" />
                </div>
                Registered Office Address
              </h3>
              <div className="text-[11px] text-gray-400 leading-snug space-y-1">
                <p className="font-semibold text-gray-300">The BatStore Private Limited,</p>
                <p>Embassy Tech Village, Outer Ring Road,</p>
                <p>Bengaluru, 560103, Karnataka, India</p>
                <p className="text-gray-400 text-[10px] pt-0.5">CIN: U51109KA2012PTC066107</p>
                <p className="text-gray-400 text-[10px]">Tel: <a href="tel:044-45614700" className="text-blue-400 hover:text-blue-300 transition-colors">044-45614700</a></p>
              </div>
            </div>
          </div>

          {/* Top border of bottom section */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-2.5"></div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-2.5 sm:gap-0">
            {/* Language & Country Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Language Selector */}
              <div className="relative" ref={langRef}>
                <motion.button 
                  dir="ltr"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsLangOpen(!isLangOpen);
                    if (isCountryOpen) setIsCountryOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-slate-700/80 rounded-md bg-slate-900/90 shadow-xs text-slate-200 hover:text-white hover:border-slate-500/80 hover:bg-slate-800 transition-colors text-[11px] font-sans font-medium cursor-pointer"
                >
                  <Globe size={12} className="text-blue-400 shrink-0" />
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeLang.flag}
                      initial={{ scale: 0.3, opacity: 0, rotate: -25 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.3, opacity: 0, rotate: 25 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      src={`https://flagcdn.com/w20/${activeLang.flag.toLowerCase()}.png`} 
                      width="14" 
                      alt={activeLang.name} 
                      className="rounded-[2px] opacity-90 shadow-sm shrink-0" 
                    />
                  </AnimatePresence>
                  <span className="tracking-wide">{activeLang.name}</span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      dir="ltr"
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      className="absolute bottom-[calc(100%+4px)] left-0 rtl:left-0 rtl:right-auto w-36 bg-slate-900/98 backdrop-blur-md border border-slate-700/90 rounded-lg shadow-xl overflow-hidden z-50 font-sans"
                    >
                      <div className="px-2 py-1 text-[9px] font-semibold tracking-wider text-slate-400 uppercase border-b border-slate-800 bg-slate-950/60 text-left">
                        Select Language
                      </div>
                      <div className="max-h-36 overflow-y-auto p-1 space-y-0.5">
                        {LANGUAGES.map((lang, index) => {
                          const isSelected = activeLang.name === lang.name;
                          return (
                            <motion.button
                              key={lang.name}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.015 }}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                              className={`w-full flex items-center gap-1.5 px-2 py-1 text-[11px] rounded-md transition-colors duration-150 font-medium ${
                                isSelected 
                                  ? 'bg-blue-600/25 text-blue-300 font-semibold' 
                                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                              }`}
                            >
                              <div className="w-3.5 flex justify-center shrink-0">
                                <img src={`https://flagcdn.com/w20/${lang.flag.toLowerCase()}.png`} width="13" alt={lang.name} className="rounded-[2px] opacity-90 shadow-sm" />
                              </div>
                              <span className="truncate flex-1 text-left">{lang.name}</span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                >
                                  <Check size={11} className="text-blue-400 shrink-0" strokeWidth={2.5} />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Country Selector */}
              <div className="relative" ref={countryRef}>
                <motion.button 
                  dir="ltr"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsCountryOpen(!isCountryOpen);
                    if (isLangOpen) setIsLangOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 border border-slate-700/80 rounded-md bg-slate-900/90 shadow-xs text-slate-200 hover:text-white hover:border-slate-500/80 hover:bg-slate-800 transition-colors text-[11px] font-sans font-medium cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeCountry.code}
                      initial={{ scale: 0.3, opacity: 0, rotate: -25 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.3, opacity: 0, rotate: 25 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                      src={`https://flagcdn.com/w20/${activeCountry.code.toLowerCase()}.png`} 
                      width="14" 
                      alt={activeCountry.code} 
                      className="rounded-[2px] opacity-90 shadow-sm shrink-0" 
                    />
                  </AnimatePresence>
                  <span className="tracking-wide">{activeCountry.name}</span>
                  <ChevronDown size={12} className={`text-slate-400 transition-transform duration-300 ${isCountryOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isCountryOpen && (
                    <motion.div
                      dir="ltr"
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      className="absolute bottom-[calc(100%+4px)] left-0 rtl:left-0 rtl:right-auto w-24 bg-slate-900/98 backdrop-blur-md border border-slate-700/90 rounded-lg shadow-xl overflow-hidden z-50 font-sans"
                    >
                      <div className="px-1.5 py-0.5 text-[8.5px] font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800 bg-slate-950/60 text-center">
                        Region
                      </div>
                      <div className="max-h-36 overflow-y-auto p-1 space-y-0.5">
                        {COUNTRIES.map((country, index) => {
                          const isSelected = activeCountry.code === country.code;
                          return (
                            <motion.button
                              key={country.code}
                              initial={{ opacity: 0, x: -3 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.015 }}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => { setActiveCountry(country); setIsCountryOpen(false); }}
                              className={`w-full flex items-center gap-1.5 px-1.5 py-1 text-[11px] rounded-md transition-colors duration-150 font-semibold ${
                                isSelected 
                                  ? 'bg-blue-600/25 text-blue-300' 
                                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                              }`}
                            >
                              <div className="w-3.5 flex justify-center shrink-0">
                                <img src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`} width="13" alt={country.code} className="rounded-[2px] opacity-90 shadow-sm" />
                              </div>
                              <span className="flex-1 text-left">{country.name}</span>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                                >
                                  <Check size={10} className="text-blue-400 shrink-0" strokeWidth={2.5} />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
            
            {/* Social Icons & Copyright */}
            <div className="flex flex-col items-center md:items-end gap-1" dir="ltr">
              {/* Social Media Buttons Row */}
              <div className="flex items-center gap-1.5">
                {/* Facebook */}
                <motion.a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-6.5 h-6.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-sm transition-all duration-200"
                  aria-label="Facebook"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>

                {/* Twitter / X */}
                <motion.a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-6.5 h-6.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-slate-400 flex items-center justify-center hover:bg-slate-800 hover:text-white hover:border-slate-400 hover:shadow-sm transition-all duration-200"
                  aria-label="Twitter X"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </motion.a>

                {/* Instagram */}
                <motion.a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-6.5 h-6.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-slate-400 flex items-center justify-center hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-pink-500 hover:shadow-sm transition-all duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>

                {/* YouTube */}
                <motion.a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-6.5 h-6.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-slate-400 flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-sm transition-all duration-200"
                  aria-label="YouTube"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>

                {/* LinkedIn */}
                <motion.a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -1, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-6.5 h-6.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-slate-400 flex items-center justify-center hover:bg-sky-600 hover:text-white hover:border-sky-500 hover:shadow-sm transition-all duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </motion.a>
              </div>

              {/* Copyright Text */}
              <p className="text-[10px] text-slate-400 tracking-wide font-sans font-medium">
                &copy; {new Date().getFullYear()} <span className="font-extrabold text-slate-200 inline-flex items-center gap-1 uppercase tracking-tighter mx-1">THE <img src="/logo.svg" alt="Bat Logo" className="h-3 w-auto object-contain brightness-0 invert" /> STORE</span> Enterprise. {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
