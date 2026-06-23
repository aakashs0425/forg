import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Droplets, Home, List, BarChart2, MessageSquare, LogOut, User } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 w-full md:w-64 md:h-screen md:left-0 md:top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t md:border-r border-slate-200 dark:border-slate-800 z-50 flex md:flex-col justify-around md:justify-start py-3 md:py-8 px-2 md:px-6 shadow-2xl">
      <div className="hidden md:flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-water-500 rounded-xl flex items-center justify-center shadow-lg">
          <Droplets className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-slate-800 dark:text-white">Water Wise</span>
      </div>

      <div className="flex md:flex-col w-full gap-2 md:gap-4 justify-around md:justify-start flex-1">
        <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-water-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-water-600 dark:hover:text-water-400 transition group">
          <Home className="w-6 h-6 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden md:block font-medium">Dashboard</span>
        </Link>
        <Link to="/log" className="flex items-center gap-3 p-3 rounded-xl hover:bg-water-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-water-600 dark:hover:text-water-400 transition group">
          <List className="w-6 h-6 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden md:block font-medium">Water Log</span>
        </Link>
        <Link to="/analytics" className="flex items-center gap-3 p-3 rounded-xl hover:bg-water-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-water-600 dark:hover:text-water-400 transition group">
          <BarChart2 className="w-6 h-6 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden md:block font-medium">Analytics</span>
        </Link>
        <Link to="/ai" className="flex items-center gap-3 p-3 rounded-xl hover:bg-water-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-water-600 dark:hover:text-water-400 transition group">
          <MessageSquare className="w-6 h-6 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
          <span className="hidden md:block font-medium">AI Assistant</span>
        </Link>
      </div>

      <div className="hidden md:block mt-auto border-t border-slate-200 dark:border-slate-800 pt-6">
        <div className="flex items-center gap-3 p-3 mb-2">
          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{user.username}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-32">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition group">
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
