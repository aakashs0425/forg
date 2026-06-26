import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Droplets, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

const LandingPage = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    fpsLimit: 60,
    particles: {
      color: { value: ["#60a5fa", "#3b82f6", "#2dd4bf"] },
      links: { enable: false },
      move: {
        enable: true,
        direction: "top",
        outModes: { default: "out" },
        random: true,
        speed: 1.5,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 40 },
      opacity: {
        value: 0.3,
        animation: { enable: true, speed: 1, minimumValue: 0.1 }
      },
      shape: { type: "circle" },
      size: {
        value: { min: 2, max: 8 },
        animation: { enable: true, speed: 2, minimumValue: 1 }
      },
    },
    detectRetina: true,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-water-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
      <Particles id="tsparticles" init={particlesInit} options={particlesConfig} className="absolute inset-0 z-0" />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-water-300/30 dark:bg-water-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-300/30 dark:bg-teal-600/20 rounded-full blur-3xl animate-pulse-slow"></div>

      <nav className="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
            <Droplets className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold gradient-text">Water Wise</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-4"
        >
          <Link to="/login" className="glass-button text-slate-700 dark:text-white px-6">Login</Link>
        </motion.div>
      </nav>

      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm font-medium text-water-600 dark:text-water-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-water-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-water-500"></span>
            </span>
            AI-Powered Hydration Tracking
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight leading-tight">
            Drink smarter, <br className="hidden md:block"/>
            <span className="gradient-text">live better.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-12 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Maintain healthy hydration habits with personalized AI insights, modern tracking, and seamless analytics.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 gradient-bg rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-water-500/25 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="glass-card flex flex-col items-center text-center">
               <div className="w-14 h-14 rounded-2xl bg-water-100 dark:bg-water-900/50 flex items-center justify-center mb-4 text-water-600 dark:text-water-400">
                 <Activity className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Smart Analytics</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Track your daily, weekly, and monthly hydration trends with interactive charts.</p>
             </div>
             <div className="glass-card flex flex-col items-center text-center relative md:-translate-y-6">
               <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                 <Zap className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">AI Assistant</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Get personalized hydration advice and health tips powered by AI.</p>
             </div>
             <div className="glass-card flex flex-col items-center text-center">
               <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Secure Sync</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Your data is safely stored in the cloud, always accessible across devices.</p>
             </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
