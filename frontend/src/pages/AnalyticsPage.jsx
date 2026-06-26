import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Flame } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({
    dailyAverage: 0,
    bestDay: '-',
    daysGoalReached: 0
  });
  
  const { user } = useContext(AuthContext);
  const dailyGoal = user?.dailyGoal || 2000;
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/water'); // Fetches all logs
        
        // Calculate last 7 days
        const last7Days = Array.from({ length: 7 }).map((_, i) => startOfDay(subDays(new Date(), 6 - i)));
        const labels = last7Days.map(date => format(date, 'EEE'));
        const dataPoints = last7Days.map(date => {
          return data
            .filter(log => isSameDay(new Date(log.date || log.timestamp), date))
            .reduce((sum, log) => sum + log.amount, 0);
        });

        const ctx = document.createElement('canvas').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // blue-500
        gradient.addColorStop(1, 'rgba(20, 184, 166, 0.0)'); // teal-500

        setChartData({
          labels,
          datasets: [
            {
              label: 'Water Intake (ml)',
              data: dataPoints,
              borderColor: '#3b82f6',
              backgroundColor: gradient,
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#3b82f6',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#14b8a6',
              pointHoverBorderWidth: 3,
            },
          ],
        });

        // Calculate Stats
        const totalAmount = dataPoints.reduce((sum, val) => sum + val, 0);
        const dailyAverage = Math.round(totalAmount / 7);
        
        let maxVal = 0;
        let bestDayIndex = -1;
        dataPoints.forEach((val, idx) => {
          if (val > maxVal) {
            maxVal = val;
            bestDayIndex = idx;
          }
        });
        const bestDay = bestDayIndex >= 0 ? labels[bestDayIndex] : '-';
        
        const daysGoalReached = dataPoints.filter(val => val >= dailyGoal).length;

        setStats({
          dailyAverage,
          bestDay,
          daysGoalReached
        });

      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dailyGoal]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      y: {
        duration: 2000,
        easing: 'easeOutQuart',
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} ml`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: { family: "'Inter', sans-serif" }
        }
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#94a3b8',
          font: { family: "'Inter', sans-serif" }
        }
      }
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading || !chartData) {
    return (
      <div className="space-y-6">
        <div className="w-48 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="w-72 h-6 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass col-span-1 md:col-span-2 rounded-[2rem] h-96 animate-pulse border border-white/50 dark:border-white/10"></div>
          <div className="glass rounded-[2rem] h-64 animate-pulse border border-white/50 dark:border-white/10"></div>
          <div className="glass rounded-[2rem] h-64 animate-pulse border border-white/50 dark:border-white/10"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Review your hydration trends</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly Trend Chart */}
        <motion.div variants={itemVariants} className="glass col-span-1 md:col-span-2 rounded-[2rem] p-6 md:p-8 shadow-xl border border-white/50 dark:border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-water-400/10 dark:bg-water-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-water-500" />
              Weekly Trend
            </h2>
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-inner">
              Last 7 Days
            </div>
          </div>
          <div className="h-72 relative z-10">
            <Line ref={chartRef} data={chartData} options={lineOptions} />
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 shadow-xl flex flex-col justify-center border border-white/50 dark:border-white/10 relative overflow-hidden">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-teal-500" />
            Highlights
          </h2>
          <div className="space-y-4 relative z-10">
            <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 transition-transform">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Daily Average</span>
              <span className="font-black text-xl gradient-text">{stats.dailyAverage.toLocaleString()} ml</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 transition-transform">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Best Day</span>
              <span className="font-black text-xl text-slate-800 dark:text-white">{stats.bestDay}</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 transition-transform">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Goal Reached</span>
              <span className={`font-black text-xl ${stats.daysGoalReached >= 5 ? 'text-teal-500' : 'text-water-500'}`}>
                {stats.daysGoalReached} / 7 Days
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Gamification / Badges */}
        <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 shadow-xl border border-white/50 dark:border-white/10 relative overflow-hidden">
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-orange-500" />
            Recent Badges
          </h2>
          <div className="grid grid-cols-2 gap-4 relative z-10">
             <motion.div 
               whileHover={{ y: -5, rotate: 2 }}
               className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-3xl border border-orange-200/50 dark:border-orange-800/50 text-center shadow-inner hover:shadow-lg transition-all"
             >
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-40 animate-pulse"></div>
                  <Flame className="w-10 h-10 text-orange-500 relative z-10 mb-3" fill="currentColor" />
                </div>
                <span className="font-bold text-orange-800 dark:text-orange-200">{user?.streak || 0} Day Streak</span>
             </motion.div>
             <motion.div 
               whileHover={{ y: -5, rotate: -2 }}
               className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/40 dark:to-teal-900/40 rounded-3xl border border-blue-200/50 dark:border-blue-800/50 text-center shadow-inner hover:shadow-lg transition-all"
             >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-40 animate-pulse"></div>
                  <span className="text-4xl relative z-10 mb-3 block">🌊</span>
                </div>
                <span className="font-bold text-blue-800 dark:text-blue-200">Ocean Saver</span>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
