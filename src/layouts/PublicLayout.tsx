import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { Footer } from '../components/public/Footer';
import { SEO } from '../components/SEO';

export const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen pb-16 sm:pb-0">
      <SEO title="Home" description="Premium destination for high-quality electronics, modern furniture, and everyday essentials." />
      <PublicNavbar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};
