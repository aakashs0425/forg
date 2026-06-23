import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Droplet, Sun, Cloud, CloudRain, Flame } from 'lucide-react';

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

      // Try to fetch weather for a default/mock location if geolocation isn't available
      // In a real app, you'd use navigator.geolocation
      try {
        const weatherRes = await api.get('/weather?lat=40.7128&lon=-74.0060');
        setWeatherData(weatherRes.data);
      } catch (wErr) {
        console.error("Weather fetch failed", wErr);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
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
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to add water', error);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'clouds': return <Cloud className="w-8 h-8 text-gray-500" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-water-500"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Hello, {user?.username}</h1>
          <p className="text-slate-500 dark:text-slate-400">Let's reach your hydration goal today!</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-500 dark:text-slate-400">Current Streak</p>
          <p className="text-2xl font-bold text-orange-500 flex items-center justify-end gap-1"><Flame className="w-5 h-5"/> {user?.streak || 0} Days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Progress Card */}
        <div className="glass col-span-1 md:col-span-2 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-water-200 dark:bg-water-900 rounded-full mix-blend-multiply opacity-50 blur-3xl"></div>
          
          <h2 className="text-xl font-semibold mb-6 text-slate-700 dark:text-slate-200 z-10">Daily Progress</h2>
          
          {/* Circular Progress (Simplified CSS version) */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-inner z-10 border-4 border-slate-100 dark:border-slate-700">
            {/* The actual progress ring */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#3b82f6 ${progressPercentage}%, transparent ${progressPercentage}%)`,
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 60%, black 61%)',
                maskImage: 'radial-gradient(circle at center, transparent 60%, black 61%)'
              }}
            ></div>
            
            <div className="text-center z-20">
              <p className="text-4xl sm:text-5xl font-extrabold text-water-600 dark:text-water-400">
                {totalToday}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">/ {dailyGoal} ml</p>
            </div>
          </div>
          
          <p className="mt-6 text-lg font-medium text-slate-600 dark:text-slate-300 z-10">
            {progressPercentage >= 100 ? "Goal Reached! 🎉" : `${dailyGoal - totalToday} ml remaining`}
          </p>
        </div>

        {/* Quick Add & Weather */}
        <div className="flex flex-col gap-6">
          {/* Quick Add Card */}
          <div className="glass rounded-3xl p-6 shadow-xl flex-1">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Quick Add</h3>
            <div className="grid grid-cols-2 gap-3">
              {[250, 500, 750, 1000].map(amount => (
                <button
                  key={amount}
                  onClick={() => addWater(amount)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-water-400 dark:hover:border-water-500 hover:shadow-md transition group"
                >
                  <Droplet className="w-6 h-6 text-water-400 group-hover:text-water-500 mb-1" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{amount} ml</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weather Card */}
          {weatherData && (
            <div className="glass rounded-3xl p-6 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Weather Context</h3>
                {getWeatherIcon(weatherData.condition)}
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-800 dark:text-white">{Math.round(weatherData.temperature)}°C</span>
                <span className="text-slate-500 dark:text-slate-400 pb-1">{weatherData.condition}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                {weatherData.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
