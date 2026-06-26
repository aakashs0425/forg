import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Droplets, Loader2, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Failed to login');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-water-50 dark:bg-slate-900 p-4 relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-water-300/40 dark:bg-water-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-300/40 dark:bg-teal-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass w-full max-w-md p-8 md:p-10 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-8">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg shadow-water-500/30"
          >
            <Droplets className="text-white w-8 h-8" />
          </motion.div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-slate-800 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8 font-medium">Sign in to track your hydration</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-water-500 focus:border-water-500 transition-all outline-none"
                placeholder="you@example.com"
                required 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-water-500 focus:border-water-500 transition-all outline-none"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>
          <motion.button 
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            disabled={isSubmitting}
            type="submit" 
            className="w-full py-3.5 gradient-bg text-white font-semibold rounded-xl transition shadow-lg shadow-water-500/25 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Don't have an account? <Link to="/register" className="text-water-600 dark:text-water-400 hover:text-water-700 dark:hover:text-water-300 transition-colors ml-1">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
