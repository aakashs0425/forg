import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { Droplet, Trash2, Clock, Edit2, Plus, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const WaterLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Quick Add State
  const [newAmount, setNewAmount] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/water/today');
      setLogs(data.logs);
    } catch (error) {
      console.error('Failed to fetch logs', error);
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newAmount || isNaN(newAmount) || Number(newAmount) <= 0) return;
    try {
      await api.post('/water', { amount: Number(newAmount) });
      toast.success(`Successfully added ${newAmount}ml`);
      setNewAmount('');
      fetchLogs();
    } catch (error) {
      console.error('Failed to add log', error);
      toast.error('Failed to add water log');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/water/${id}`);
      toast.success('Log deleted');
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Failed to delete log', error);
      toast.error('Failed to delete log');
    }
  };

  const startEdit = (log) => {
    setEditingId(log._id);
    setEditAmount(log.amount.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
  };

  const saveEdit = async (id) => {
    if (!editAmount || isNaN(editAmount) || Number(editAmount) <= 0) return;
    try {
      await api.put(`/water/${id}`, { amount: Number(editAmount) });
      toast.success('Log updated');
      setEditingId(null);
      fetchLogs();
    } catch (error) {
      console.error('Failed to update log', error);
      toast.error('Failed to update log');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-water-200 dark:border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-water-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium">Loading history...</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">Water Log</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Your hydration history for today</p>
      </motion.div>

      {/* Quick Add Form */}
      <motion.form 
        variants={itemVariants}
        onSubmit={handleAdd} 
        className="glass rounded-[2rem] p-6 shadow-xl flex gap-4 items-center border border-white/50 dark:border-white/10"
      >
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Droplet className="w-5 h-5 text-water-400" />
          </div>
          <input 
            type="number" 
            placeholder="Amount in ml (e.g. 250)" 
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-water-500 dark:text-white transition-all text-lg"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          disabled={!newAmount}
          className="gradient-bg text-white px-8 py-4 rounded-2xl font-bold transition shadow-lg shadow-water-500/30 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
        >
          <Plus className="w-6 h-6" />
          <span className="hidden sm:inline">Add</span>
        </motion.button>
      </motion.form>

      <motion.div variants={itemVariants} className="glass rounded-[2rem] p-8 md:p-10 shadow-xl border border-white/50 dark:border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-water-400/10 dark:bg-water-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {logs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 relative z-10"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-200 dark:border-slate-600">
              <Droplet className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No water logged yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Every drop counts! Add some water above.</p>
          </motion.div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 z-10">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div 
                  key={log._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="relative pl-8"
                >
                  <div className="absolute -left-[13px] top-4 w-6 h-6 bg-white dark:bg-slate-900 border-4 border-water-500 rounded-full flex items-center justify-center shadow-sm"></div>
                  
                  <motion.div 
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center group transition hover:shadow-xl hover:shadow-water-500/5 hover:border-water-200 dark:hover:border-slate-600"
                  >
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-md shadow-water-500/20">
                        <Droplet className="w-7 h-7 text-white" />
                      </div>
                      {editingId === log._id ? (
                        <div className="flex-1 mr-4">
                          <input 
                            type="number"
                            value={editAmount}
                            onChange={(e) => setEditAmount(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-water-500 dark:text-white font-bold text-lg"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{log.amount} <span className="text-base font-medium text-slate-500">ml</span></p>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            {format(new Date(log.date || log.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {editingId === log._id ? (
                        <>
                          <button onClick={() => saveEdit(log._id)} className="p-3 text-green-500 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition shadow-sm" title="Save">
                            <Check className="w-5 h-5" />
                          </button>
                          <button onClick={cancelEdit} className="p-3 text-slate-500 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition shadow-sm" title="Cancel">
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => startEdit(log)}
                            className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Edit log"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(log._id)}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete log"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WaterLogPage;
