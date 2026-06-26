import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';
import { AuthContext } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import WaterLogPage from './pages/WaterLogPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIAssistantPage from './pages/AIAssistantPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-water-500"></div></div>;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/log" element={<PrivateRoute><WaterLogPage /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
        <Route path="/ai" element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen dark:bg-slate-900 font-sans transition-colors duration-300 overflow-x-hidden relative">
        <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white glass-card', duration: 4000 }} />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
