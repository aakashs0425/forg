import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Droplets } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-water-50 dark:bg-slate-900 p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-water-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-water-500 rounded-full flex items-center justify-center shadow-lg">
            <Droplets className="text-white w-8 h-8" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Sign in to track your hydration</p>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-water-500 focus:outline-none transition"
              placeholder="you@example.com"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-water-500 focus:outline-none transition"
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="w-full py-3 bg-water-600 hover:bg-water-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg">
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Don't have an account? <Link to="/register" className="text-water-600 dark:text-water-400 font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
