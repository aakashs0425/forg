import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-water-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="max-w-4xl text-center px-4">
        <h1 className="text-5xl font-extrabold text-water-600 dark:text-water-400 mb-6 drop-shadow-sm">
          Water Wise
        </h1>
        <p className="text-xl mb-10 text-slate-600 dark:text-slate-300">
          Your AI-powered hydration tracking platform to maintain healthy water consumption habits.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login" className="px-8 py-3 bg-water-600 text-white rounded-full font-semibold hover:bg-water-700 transition shadow-lg hover:shadow-xl">
            Login
          </Link>
          <Link to="/register" className="px-8 py-3 bg-white text-water-600 rounded-full font-semibold hover:bg-water-50 transition shadow border border-water-200 dark:bg-slate-800 dark:text-water-400 dark:border-slate-700 dark:hover:bg-slate-700">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
