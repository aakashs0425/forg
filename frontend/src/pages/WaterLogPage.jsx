import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import { Droplet, Trash2, Clock, Edit2, Plus, Check, X } from 'lucide-react';

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
      setNewAmount('');
      fetchLogs();
    } catch (error) {
      console.error('Failed to add log', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/water/${id}`);
      fetchLogs(); // Refresh logs
    } catch (error) {
      console.error('Failed to delete log', error);
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
      setEditingId(null);
      fetchLogs();
    } catch (error) {
      console.error('Failed to update log', error);
    }
  };

  if (loading && logs.length === 0) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-water-500"></div></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Water Log</h1>
        <p className="text-slate-500 dark:text-slate-400">Your hydration history for today</p>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleAdd} className="glass rounded-3xl p-6 shadow-xl flex gap-4 items-center">
        <div className="flex-1">
          <input 
            type="number" 
            placeholder="Amount in ml (e.g. 250)" 
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-water-500 dark:text-white transition"
          />
        </div>
        <button 
          type="submit" 
          disabled={!newAmount}
          className="bg-water-500 hover:bg-water-600 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          <span>Add</span>
        </button>
      </form>

      <div className="glass rounded-3xl p-6 md:p-8 shadow-xl">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Droplet className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No water logged yet today</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Add some water above to get started!</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8">
            {logs.map((log, index) => (
              <div key={log._id} className="relative pl-8 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="absolute -left-3 top-1 w-6 h-6 bg-white dark:bg-slate-900 border-2 border-water-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-water-500 rounded-full"></div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center group transition hover:shadow-md hover:border-water-200 dark:hover:border-slate-600">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-water-50 dark:bg-water-900/30 rounded-xl flex items-center justify-center">
                      <Droplet className="w-6 h-6 text-water-500" />
                    </div>
                    {editingId === log._id ? (
                      <div className="flex-1 mr-4">
                        <input 
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-water-500 dark:text-white"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{log.amount} <span className="text-sm font-normal text-slate-500">ml</span></p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(log.date || log.timestamp), 'h:mm a')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {editingId === log._id ? (
                      <>
                        <button onClick={() => saveEdit(log._id)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition" title="Save">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEdit} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition" title="Cancel">
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(log)}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Edit log"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(log._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete log"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
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
