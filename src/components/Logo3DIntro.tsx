import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from 'lucide-react';

export const Logo3DIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if intro already shown in this tab session
    const hasSeenIntro = sessionStorage.getItem('hasSeen3DIntro');
    if (hasSeenIntro) {
      setIsVisible(false);
      return;
    }

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('hasSeen3DIntro', 'true');
          }, 350);
          return 100;
        }
        return prev + 5;
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden select-none"
      >
        {/* Subtle Ambient Background Orbs for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-white/[0.02] blur-[130px] rounded-full pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/[0.02] blur-[110px] rounded-full pointer-events-none"></div>

        {/* 3D Wireframe Box Assembly Container */}
        <div className="relative flex flex-col items-center z-10 px-4">
          {/* Animated 3D Isometric Cube Drawing Container */}
          <div className="relative w-48 h-48 flex items-center justify-center perspective-[1000px]">
            <motion.div
              animate={{ 
                rotateX: [20, 32, 20], 
                rotateY: [40, 220, 400],
                scale: [0.85, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
              className="relative w-40 h-40 transform-style-3d flex items-center justify-center"
            >
              {/* Pencil Wireframe 3D SVG Box Path */}
              <svg className="w-full h-full text-white/90 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* 3D Cube Isometric Outer Edges with animated dasharray */}
                <path 
                  d="M50 12 L88 33 L88 77 L50 98 L12 77 L12 33 Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeDasharray="220"
                  strokeDashoffset={220 - (progress * 2.2)}
                  style={{ filter: 'drop-shadow(0px 0px 1px rgba(255,255,255,0.5))' }}
                />
                <path 
                  d="M50 12 L50 98" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeDasharray="100"
                  strokeDashoffset={100 - progress}
                  style={{ filter: 'drop-shadow(0px 0px 1px rgba(255,255,255,0.5))' }}
                />
                <path 
                  d="M88 33 L50 55 L12 33" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeDasharray="150"
                  strokeDashoffset={150 - (progress * 1.5)}
                  style={{ filter: 'drop-shadow(0px 0px 1px rgba(255,255,255,0.5))' }}
                />
              </svg>

              {/* Inner Core Pencil Box Icon */}
              <motion.div 
                animate={{ scale: [0.88, 1.12, 0.88] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute inset-4 border border-white/20 rounded-2xl flex items-center justify-center text-white/80 shadow-inner bg-black/50 backdrop-blur-sm"
              >
                <Box size={44} className="stroke-[1.5] drop-shadow-sm" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            sessionStorage.setItem('hasSeen3DIntro', 'true');
          }}
          className="absolute bottom-8 text-xs font-bold text-white/40 hover:text-white underline tracking-wider cursor-pointer transition-colors"
        >
          Skip Intro →
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
