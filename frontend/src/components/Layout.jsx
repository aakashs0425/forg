import React from 'react';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-water-50 dark:bg-slate-900 transition-colors duration-200">
      <Navigation />
      <main className="flex-1 w-full md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
