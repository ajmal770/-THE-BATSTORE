import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Globe, Users, ShieldCheck, Award, Sparkles,
  Send, Mail, Phone, MapPin, CheckCircle2, ArrowRight,
  Target, Rocket, Heart, TrendingUp, Zap, MessageSquare, Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Happy Customers', value: '10M+', icon: Users, color: 'from-blue-500 to-indigo-600', description: 'Trusted across 150+ countries' },
  { label: 'Products Delivered', value: '25M+', icon: Rocket, color: 'from-emerald-500 to-teal-600', description: 'Fast & trackable shipping' },
  { label: 'Global Offices', value: '12', icon: Building2, color: 'from-purple-500 to-pink-600', description: 'Key tech hubs worldwide' },
  { label: 'Customer Satisfaction', value: '99.8%', icon: Award, color: 'from-amber-500 to-orange-600', description: '24/7 dedicated assistance' },
];

const timeline = [
  {
    year: '2021',
    title: 'The Inception',
    description: 'The BatStore was founded with a mission to simplify cross-border e-commerce and deliver ultra-fast logistics.',
    icon: Sparkles,
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Scaled fulfillment hubs across Europe, Asia, and the Americas, empowering millions of seamless purchases.',
    icon: Globe,
  },
  {
    year: '2024',
    title: 'AI-Powered Shopping',
    description: 'Integrated real-time AI recommendation engines, instant notifications, and multi-currency dynamic checkout.',
    icon: Zap,
  },
  {
    year: '2026',
    title: 'Next-Gen Ecosystem',
    description: 'Pioneered 10+ language native translations, instant tracking, and ultra-secure 256-bit SSL encrypted shopping.',
    icon: Rocket,
  },
];

const coreValues = [
  {
    title: 'Customer Centricity',
    description: 'Every feature, product, and delivery route is designed with our shopper delight as top priority.',
    icon: Heart,
    bg: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  {
    title: 'Unwavering Security',
    description: 'Bank-level 256-bit encryption protects every transaction, account detail, and privacy data point.',
    icon: ShieldCheck,
    bg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    title: 'Continuous Innovation',
    description: 'Pushing tech boundaries with AI recommendations, dynamic multi-language systems, and glassmorphic UI.',
    icon: TrendingUp,
    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    title: 'Global Sustainability',
    description: 'Committed to eco-friendly packaging and carbon-neutral logistics across all international shipping nodes.',
    icon: Target,
    bg: 'bg-purple-50 text-purple-600 border-purple-100',
  },
];

const teamMembers = [
  {
    name: 'Alexander Wright',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    bio: '15+ years leading global logistics tech and enterprise commerce platforms.',
  },
  {
    name: 'Sophia Chen',
    role: 'Chief Product Officer',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
    bio: 'Passionate about crafting intuitive user experiences and AI-driven storefronts.',
  },
  {
    name: 'Marcus Vance',
    role: 'Head of AI & Engineering',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: 'Pioneered scalable microservices handling 50,000 requests per second with zero latency.',
  },
  {
    name: 'Elena Rostova',
    role: 'VP of Customer Success',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    bio: 'Ensuring round-the-clock support excellence across 150+ countries worldwide.',
  },
];

const offices = [
  { city: 'Bengaluru', country: 'India', role: 'Global Tech Headquarters', address: 'Tech Village, Outer Ring Road, 560103' },
  { city: 'New York', country: 'United States', role: 'Americas Commerce Hub', address: '5th Avenue, Manhattan, NY 10001' },
  { city: 'London', country: 'United Kingdom', role: 'European Logistics Centre', address: 'Canary Wharf, London E14 5AB' },
  { city: 'Tokyo', country: 'Japan', role: 'Asia-Pacific Innovation Office', address: 'Roppongi Hills Tower, Tokyo 106-6108' },
];

export default function About() {
  const [activeTab, setActiveTab] = useState<'vision' | 'mission' | 'sustainability'>('vision');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-slate-900 via-deep-navy to-slate-900 text-white overflow-hidden border-b border-slate-800">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute -bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-inner backdrop-blur-md"
          >
            <Sparkles size={14} />
            <span>Redefining Global Commerce</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6"
          >
            Empowering the World to <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Shop Without Borders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
          >
            The BatStore is built for modern shoppers. We combine lightning-fast logistics, state-of-the-art AI recommendations, and multi-language support to bring millions of premium products straight to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            <Link
              to="/products"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              Explore Products
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#contact-section"
              className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-bold rounded-2xl backdrop-blur-md transition-all duration-300 cursor-pointer"
            >
              Contact Our Team
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS COUNTER GRID */}
      <section className="relative z-20 -mt-10 sm:-mt-14 mx-4 sm:mx-8 lg:mx-auto lg:max-w-6xl">
        <div className="bg-white/40 sm:bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-slate-200/50 rounded-3xl sm:rounded-[2rem] p-2 sm:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group relative flex flex-col items-center text-center py-5 px-3 sm:p-6 rounded-[1.25rem] sm:rounded-2xl bg-white/70 hover:bg-white transition-all duration-300 hover:shadow-xl shadow-sm hover:-translate-y-1 border border-white/80 hover:border-white overflow-hidden"
                >
                  {/* Subtle shine effect on card */}
                  <div className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 z-0"></div>
                  
                  <div className={`relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 mb-3`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />
                  </div>
                  <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
                    {stat.value}
                  </h3>
                  <p className="relative z-10 text-xs sm:text-sm font-bold text-slate-700 leading-tight">{stat.label}</p>
                  <p className="relative z-10 text-[10px] sm:text-[11px] text-slate-500 mt-1 sm:mt-1.5 opacity-90 max-w-[130px] leading-relaxed">{stat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. OUR PHILOSOPHY & VISION TABS */}
      <section className="py-20 container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-3 border border-blue-100">
              <Building2 size={14} /> Our Core Purpose
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              Building a Transparent, Fast & Delightful E-Commerce Standard
            </h2>

            {/* Interactive Tab Buttons */}
            <div className="flex gap-2 p-1 bg-slate-200/60 rounded-xl mb-6">
              <button
                onClick={() => setActiveTab('vision')}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'vision' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Our Vision
              </button>
              <button
                onClick={() => setActiveTab('mission')}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'mission' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab('sustainability')}
                className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'sustainability' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Sustainability
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'vision' && (
                <motion.div
                  key="vision"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4 text-slate-600 text-sm leading-relaxed"
                >
                  <p>
                    We envision a future where high-quality products are accessible to anyone, anywhere in the world, with zero friction, instant multi-currency transactions, and zero delivery anxiety.
                  </p>
                  <p className="font-semibold text-slate-800">
                    By combining smart AI logistics with ultra-sleek user experience design, we make international shopping feel local.
                  </p>
                </motion.div>
              )}

              {activeTab === 'mission' && (
                <motion.div
                  key="mission"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4 text-slate-600 text-sm leading-relaxed"
                >
                  <p>
                    Our mission is to empower global consumers with verified authentic products, transparent pricing, hassle-free 30-day returns, and 24/7 round-the-clock enterprise customer support.
                  </p>
                  <p className="font-semibold text-slate-800">
                    We constantly innovate to reduce shipping times and deliver peace of mind with every order.
                  </p>
                </motion.div>
              )}

              {activeTab === 'sustainability' && (
                <motion.div
                  key="sustainability"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4 text-slate-600 text-sm leading-relaxed"
                >
                  <p>
                    We are dedicated to minimizing our carbon footprint. 100% of The BatStore packaging is recyclable, and we partner with carbon-offset logistics networks across all major transit hubs.
                  </p>
                  <p className="font-semibold text-slate-800">
                    Shopping with us means supporting responsible, sustainable global commerce.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800">256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800">30-Day Money Back</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Image Card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="The BatStore Team Collaborating"
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Overlay Glass Card */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                    PS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">The BatStore Engineering Hub</h4>
                    <p className="text-xs text-slate-500 font-medium">Powering 25M+ global deliveries yearly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. CORE VALUES SECTION */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-3 border border-blue-100">
              <ShieldCheck size={14} /> Driven By Values
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Principles That Guide Us Everyday
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${value.bg} group-hover:scale-110 transition-transform`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{value.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TIMELINE SECTION */}
      <section className="py-20 container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-3 border border-blue-100">
            <Rocket size={14} /> Our Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How The BatStore Transformed Global Shopping
          </h2>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-32 space-y-12">
          {timeline.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-8 sm:pl-10"
              >
                {/* Year Pill on Left for Desktop */}
                <div className="hidden sm:flex absolute -left-32 top-0.5 w-24 text-right font-black text-blue-600 text-lg">
                  {item.year}
                </div>

                {/* Node Bullet */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center shadow-md">
                  <Icon size={14} />
                </div>

                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <span className="sm:hidden inline-block text-xs font-extrabold text-blue-600 mb-1">{item.year}</span>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. EXECUTIVE LEADERSHIP TEAM */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md mb-3 border border-blue-400/20">
              <Users size={14} /> Executive Leadership
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Meet the Visionaries Behind The BatStore
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden hover:border-blue-500/80 transition-all duration-300 group"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-white mb-0.5">{member.name}</h3>
                  <p className="text-xs font-semibold text-blue-400 mb-3">{member.role}</p>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GLOBAL OFFICES */}
      <section className="py-20 container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-3 border border-blue-100">
            <Globe size={14} /> Global Presence
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our International Innovation Hubs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offices.map((office) => (
            <div key={office.city} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{office.city}</h3>
              <p className="text-xs font-bold text-blue-600 mb-2">{office.country}</p>
              <p className="text-xs text-slate-500 font-semibold mb-2">{office.role}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{office.address}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CONTACT US & SUPPORT FORM */}
      <section id="contact-section" className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Contact Info */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md mb-3 border border-blue-400/20">
                <Headphones size={14} /> Contact Us
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
                Have Questions? Our Support Team is Ready 24/7
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8">
                Whether you have an order inquiry, partnership proposal, or feedback about our platform, send us a message and our team will get back to you within 2 hours.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Email Us Directly</p>
                    <p className="text-sm font-bold text-white">support@thebatstore.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">24/7 Customer Care Hotline</p>
                    <p className="text-sm font-bold text-white">+1 (800) 456-1470</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Live Chat Support</p>
                    <p className="text-sm font-bold text-white">Available on desktop & mobile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form Card */}
            <div className="bg-slate-800/90 border border-slate-700 p-8 rounded-3xl shadow-2xl relative">
              <AnimatePresence>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Thank you for reaching out. A The BatStore support representative has received your request and will reply shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-2">Send an Inquiry</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Order status / General inquiry"
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help you today?"
                        className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send size={15} /> Send Message
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
