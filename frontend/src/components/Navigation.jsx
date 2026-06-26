import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Droplets, Home, List, BarChart2, MessageSquare, LogOut, User, Moon, Sun, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/log', icon: List, label: 'Water Log' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/ai', icon: MessageSquare, label: 'AI Assistant' },
  ];

  return (
    <motion.nav 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-0 w-full md:w-64 md:h-screen md:left-0 md:top-0 glass z-50 flex md:flex-col justify-around md:justify-start py-3 md:py-8 px-2 md:px-6 md:border-r-0 md:shadow-2xl"
    >
      <div className="hidden md:flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg shadow-water-500/30">
          <Droplets className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-water-600 to-teal-500 dark:from-water-400 dark:to-teal-300">Water Wise</span>
      </div>

      <div className="flex md:flex-col w-full gap-2 md:gap-4 justify-around md:justify-start flex-1 relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={clsx(
                "relative flex items-center gap-3 p-3 rounded-xl transition-all group overflow-hidden",
                isActive 
                  ? "text-water-600 dark:text-water-300 font-semibold" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-water-100 dark:bg-water-900/30 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={clsx("w-6 h-6 md:w-5 md:h-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="hidden md:flex flex-col gap-4 mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
        <button 
          onClick={toggleTheme} 
          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center justify-between p-3 rounded-xl w-full text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-water-500 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate w-24">{user.username}</p>
              </div>
            </div>
            <ChevronRight className={clsx("w-4 h-4 text-slate-400 transition-transform", isProfileOpen && "rotate-90")} />
          </button>
          
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 w-full mb-2 glass rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700"
              >
                <div className="p-3 border-b border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 p-3 w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium text-sm">Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
