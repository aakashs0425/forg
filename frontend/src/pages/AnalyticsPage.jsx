import React, { useState, useEffect } from 'react';
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

  // Mock data for analytics (In a real app, you would fetch this from your backend)
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: [1500, 2200, 1800, 2400, 2000, 2500, 2100],
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
  };

  const lineOptions = {
    responsive: true,
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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
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
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-72">
            <Line data={weeklyData} options={lineOptions} />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="glass rounded-3xl p-6 shadow-xl flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Highlights</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Daily Average</span>
              <span className="font-bold text-xl text-slate-800 dark:text-white">2,071 ml</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Best Day</span>
              <span className="font-bold text-xl text-slate-800 dark:text-white">Saturday</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">Goal Reached</span>
              <span className="font-bold text-xl text-green-500">5 / 7 Days</span>
            </div>
          </div>
        </div>

        {/* Gamification / Badges */}
        <div className="glass rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Recent Badges</h2>
          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800 text-center">
                <span className="text-3xl mb-2">🔥</span>
                <span className="font-semibold text-sm text-orange-700 dark:text-orange-400">7 Day Streak</span>
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
