import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Droplet, Sun, Cloud, CloudRain, Flame, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [todayLogs, setTodayLogs] = useState([]);
  const [totalToday, setTotalToday] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const dailyGoal = user?.dailyGoal || 2000;
  const progressPercentage = Math.min((totalToday / dailyGoal) * 100, 100);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/water/today');
      setTodayLogs(data.logs);
      setTotalToday(data.total);

      try {
        const weatherRes = await api.get('/weather?lat=40.7128&lon=-74.0060');
        setWeatherData(weatherRes.data);
      } catch (wErr) {
        console.error("Weather fetch failed", wErr);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const addWater = async (amount) => {
    try {
      await api.post('/water', { amount });
      setTotalToday(prev => prev + amount); // Optimistic UI update
      toast.success(`Added ${amount}ml of water! 💧`);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to add water', error);
      toast.error("Failed to add water");
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear': return <Sun className="w-10 h-10 text-yellow-400 drop-shadow-md" />;
      case 'rain': return <CloudRain className="w-10 h-10 text-blue-400 drop-shadow-md" />;
      case 'clouds': return <Cloud className="w-10 h-10 text-slate-400 drop-shadow-md" />;
      default: return <Sun className="w-10 h-10 text-yellow-400 drop-shadow-md" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-water-200 dark:border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-water-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Loading your insights...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-1">
            Hello, <span className="gradient-text">{user?.username}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Let's crush your hydration goal today!</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Current Streak</p>
          <div className="flex items-center justify-end gap-2 text-3xl font-black text-orange-500 dark:text-orange-400 drop-shadow-sm">
            <Flame className="w-7 h-7 animate-pulse-slow" fill="currentColor" /> {user?.streak || 0}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Card (3D Tilt) */}
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} transitionSpeed={2000} scale={1.02} className="lg:col-span-2">
          <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl h-full border border-white/50 dark:border-white/10">
            {/* Inner Glow Background */}
            <div className="absolute -right-32 -top-32 w-96 h-96 bg-water-400/20 dark:bg-water-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
            <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-teal-400/20 dark:bg-teal-600/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold mb-8 text-slate-700 dark:text-slate-200 z-10 w-full text-left">Daily Progress</h2>
            
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 z-10 drop-shadow-2xl">
              <CircularProgressbar 
                value={progressPercentage} 
                strokeWidth={8}
                styles={buildStyles({
                  pathColor: `url(#gradient)`,
                  trailColor: 'rgba(148, 163, 184, 0.1)',
                  strokeLinecap: 'round',
                })}
              />
              {/* SVG Gradient Definition for CircularProgressbar */}
              <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.p 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="text-5xl sm:text-6xl font-black gradient-text tracking-tighter"
                >
                  {totalToday}
                </motion.p>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-1">/ {dailyGoal} ml</p>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-lg font-semibold px-6 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 z-10"
            >
              {progressPercentage >= 100 ? "Goal Reached! 🎉 Awesome job!" : `${dailyGoal - totalToday} ml left to reach your goal`}
            </motion.div>
          </motion.div>
        </Tilt>

        {/* Right Column: Quick Add & Weather */}
        <div className="flex flex-col gap-8">
          {/* Quick Add Card */}
          <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 shadow-xl flex-1 border border-white/50 dark:border-white/10 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 text-slate-700 dark:text-slate-200 relative z-10">Quick Add</h3>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {[250, 500, 750, 1000].map(amount => (
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  key={amount}
                  onClick={() => addWater(amount)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 hover:border-water-400 dark:hover:border-water-500 shadow-sm hover:shadow-xl hover:shadow-water-500/20 transition-all group overflow-hidden relative"
                >
                  {/* Hover Ripple */}
                  <div className="absolute inset-0 bg-gradient-to-br from-water-400/0 to-teal-400/0 group-hover:from-water-400/10 group-hover:to-teal-400/10 transition-colors"></div>
                  
                  <Droplet className="w-8 h-8 text-water-400 group-hover:text-water-500 mb-2 drop-shadow-sm transition-colors relative z-10" />
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-lg relative z-10">{amount}<span className="text-xs text-slate-500 ml-1">ml</span></span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Weather Card */}
          {weatherData && (
            <motion.div variants={itemVariants} className="rounded-[2rem] p-8 shadow-2xl bg-gradient-to-br from-water-500 to-teal-500 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Smart Insight
                </h3>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  {getWeatherIcon(weatherData.condition)}
                </motion.div>
              </div>
              
              <div className="flex items-end gap-3 mb-3 relative z-10">
                <span className="text-5xl font-black tracking-tighter">{Math.round(weatherData.temperature)}°</span>
                <span className="text-lg font-medium opacity-90 pb-1">{weatherData.condition}</span>
              </div>
              
              <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 relative z-10">
                <p className="text-sm font-medium leading-relaxed">
                  {weatherData.recommendation}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
