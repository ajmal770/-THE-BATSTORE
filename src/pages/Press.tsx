import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, Download, Calendar, Mail, 
  Send, CheckCircle2, Sparkles, Globe, FileText, ArrowUpRight
} from 'lucide-react';

const pressArticles = [
  {
    id: 1,
    outlet: 'TechCrunch',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80',
    title: 'PostScout Unveils Next-Gen AI Multi-Language Shopping Ecosystem',
    date: 'July 15, 2026',
    category: 'Technology',
    snippet: 'PostScout is breaking global barriers by introducing instant 10+ native language translation with real-time currency conversion and sub-second inventory sync.',
    link: 'https://techcrunch.com',
  },
  {
    id: 2,
    outlet: 'Forbes',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&q=80',
    title: 'Top 10 E-Commerce Platforms Revolutionizing International Logistics',
    date: 'June 28, 2026',
    category: 'Industry Award',
    snippet: 'Forbes names PostScout among the fastest-growing cross-border commerce networks, citing 99.8% on-time delivery metrics across 150 countries.',
    link: 'https://forbes.com',
  },
  {
    id: 3,
    outlet: 'Bloomberg',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&q=80',
    title: 'PostScout Reaches 25 Million Delivered Orders Benchmark in Q2',
    date: 'May 10, 2026',
    category: 'Financial News',
    snippet: 'With a 140% year-over-year order surge, PostScout continues its aggressive international fulfillment expansion in Europe and APAC.',
    link: 'https://bloomberg.com',
  },
  {
    id: 4,
    outlet: 'Wired',
    logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&q=80',
    title: 'Inside PostScout’s Glassmorphic UI & Ultra-Fast Shopping Engine',
    date: 'April 04, 2026',
    category: 'Design & UX',
    snippet: 'How PostScout combined Tailwind CSS, micro-animations, and instant state management to craft the most responsive storefront of 2026.',
    link: 'https://wired.com',
  },
];

const pressReleases = [
  {
    id: 'PR-2026-04',
    title: 'PostScout Expands Carbon-Neutral Express Shipping to 50 New Cities',
    date: 'July 01, 2026',
    fileSize: '1.4 MB PDF',
  },
  {
    id: 'PR-2026-03',
    title: 'PostScout Reports Record Black Friday & Cyber Week Volume',
    date: 'May 20, 2026',
    fileSize: '2.1 MB PDF',
  },
  {
    id: 'PR-2026-02',
    title: 'Announcing 256-Bit Encrypted One-Click Checkout Upgrade',
    date: 'March 14, 2026',
    fileSize: '980 KB PDF',
  },
];

const mediaKitItems = [
  { title: 'Brand Identity & Logos', description: 'PNG, SVG, and vector EPS logo assets in dark & light themes.', size: '12 MB ZIP' },
  { title: 'Executive Headshots', description: 'High-res leadership team photography for press publication.', size: '45 MB ZIP' },
  { title: 'Product & Store Banners', description: 'Official high-resolution product screenshots and UI mockups.', size: '28 MB ZIP' },
];

export default function Press() {
  const [formData, setFormData] = useState({ name: '', publication: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', publication: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased overflow-hidden">
      
      {/* 1. PRESS HERO BANNER */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900 via-deep-navy to-slate-900 text-white overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-[130px] pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Newspaper size={14} />
            <span>PostScout Press & Media Room</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none mb-6"
          >
            News, Insights & <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Official Announcements</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Stay updated with the latest company news, media coverage, product features, and official brand assets from PostScout Enterprise.
          </motion.p>
        </div>
      </section>

      {/* 2. FEATURED MEDIA COVERAGE */}
      <section className="py-20 container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-3 border border-blue-100">
              <Globe size={14} /> Global Coverage
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">PostScout in the News</h2>
          </div>
          <p className="text-xs text-slate-500 max-w-sm">
            Read what leading tech and business publications are saying about our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pressArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 text-[11px] font-extrabold rounded-md uppercase tracking-wider">
                    {article.outlet}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Calendar size={13} /> {article.date}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                  {article.snippet}
                </p>
              </div>

              <a
                href={article.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                Read Full Article <ArrowUpRight size={14} />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. OFFICIAL PRESS RELEASES & MEDIA KIT */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Press Releases Column */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-3 border border-blue-100">
                <FileText size={14} /> Official Statements
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">Press Releases</h2>

              <div className="space-y-4">
                {pressReleases.map((pr) => (
                  <div key={pr.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:border-blue-300 transition-all">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{pr.id}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{pr.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{pr.date} • {pr.fileSize}</p>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${pr.title} press release package.`)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors shrink-0 cursor-pointer"
                      title="Download Press Release"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Kit Assets Column */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-md mb-3 border border-purple-100">
                <Sparkles size={14} /> Brand Assets
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">Media Kit & Logos</h2>

              <div className="space-y-4">
                {mediaKitItems.map((item) => (
                  <div key={item.title} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4 hover:border-purple-300 transition-all">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">{item.description}</p>
                      <span className="inline-block text-[10px] font-extrabold text-slate-400 uppercase mt-1">{item.size}</span>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${item.title} asset bundle.`)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-purple-600 hover:text-white transition-colors shrink-0 cursor-pointer"
                      title="Download Assets"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MEDIA INQUIRIES FORM */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md mb-3 border border-blue-400/20">
              <Mail size={14} /> Media Contact
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Journalist & PR Inquiries</h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Are you a journalist, editor, or analyst covering e-commerce and AI technology? Get in touch with our communications team directly at <span className="text-blue-400 font-bold">press@postscout.com</span> or use the form below.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl shadow-2xl">
            <AnimatePresence>
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Media Inquiry Received!</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you. Our public relations team will review your inquiry and respond within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Sarah Jenkins"
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Publication / Outlet</label>
                      <input
                        type="text"
                        value={formData.publication}
                        onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
                        placeholder="TechCrunch / Reuters"
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@publication.com"
                      className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Details / Interview Request</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Detail your request, deadline, and topic..."
                      className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={15} /> Submit PR Inquiry
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

    </div>
  );
}
