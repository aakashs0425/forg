import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { Droplet, Trash2, Clock } from 'lucide-react';

const WaterLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/water/today');
      setLogs(data.logs);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/water/${id}`);
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Failed to delete log', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-water-500"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Water Log</h1>
        <p className="text-slate-500 dark:text-slate-400">Your hydration history for today</p>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 shadow-xl">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplet className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No water logged yet today</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Go to the dashboard to log your first drink!</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8">
            {logs.map((log, index) => (
              <div key={log._id} className="relative pl-8 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute -left-3 top-1 w-6 h-6 bg-white dark:bg-slate-900 border-2 border-water-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-water-500 rounded-full"></div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center group transition hover:shadow-md hover:border-water-200 dark:hover:border-slate-600">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-water-50 dark:bg-water-900/30 rounded-xl flex items-center justify-center">
                      <Droplet className="w-6 h-6 text-water-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{log.amount} <span className="text-sm font-normal text-slate-500">ml</span></p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(log.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(log._id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete log"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterLogPage;
