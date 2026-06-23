import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen dark:bg-slate-900 font-sans transition-colors duration-200">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/log" element={<PrivateRoute><WaterLogPage /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          <Route path="/ai" element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
