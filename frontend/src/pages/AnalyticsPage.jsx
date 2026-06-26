import React, { useState, useEffect, useContext } from 'react';
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
import { Line, Bar } from 'react-chartjs-2';
import api from '../services/api';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { AuthContext } from '../context/AuthContext';

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

        setChartData({
          labels,
          datasets: [
            {
              label: 'Water Intake (ml)',
              data: dataPoints,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: '#3b82f6',
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
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  };

  if (loading || !chartData) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-water-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Review your hydration trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Trend Chart */}
        <div className="glass col-span-1 md:col-span-2 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Weekly Trend</h2>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm outline-none text-slate-700 dark:text-slate-300">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-72">
            <Line data={chartData} options={lineOptions} />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="glass rounded-3xl p-6 shadow-xl flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Highlights</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Daily Average</span>
              <span className="font-bold text-xl text-slate-800 dark:text-white">{stats.dailyAverage.toLocaleString()} ml</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Best Day</span>
              <span className="font-bold text-xl text-slate-800 dark:text-white">{stats.bestDay}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Goal Reached</span>
              <span className={`font-bold text-xl ${stats.daysGoalReached >= 5 ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                {stats.daysGoalReached} / 7 Days
              </span>
            </div>
          </div>
        </div>

        {/* Gamification / Badges */}
        <div className="glass rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Recent Badges</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800 text-center">
                <span className="text-3xl mb-2">🔥</span>
                <span className="font-semibold text-sm text-orange-700 dark:text-orange-400">{user?.streak || 0} Day Streak</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
                <span className="text-3xl mb-2">🌊</span>
                <span className="font-semibold text-sm text-blue-700 dark:text-blue-400">Ocean Saver</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
