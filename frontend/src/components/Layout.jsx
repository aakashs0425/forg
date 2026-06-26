import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen relative overflow-hidden transition-colors duration-300">
      {/* Animated Bubbles Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-to-tr from-water-300/30 to-teal-300/30 blur-xl animate-float"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <Navigation />
      
      <main className="flex-1 w-full md:ml-64 p-4 md:p-8 pb-24 md:pb-8 relative z-10">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
