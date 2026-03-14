import React from 'react';
import { Outlet, useLocation } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function RootLayout() {
  const location = useLocation();
  
  // Hide navbar and footer on login page and admin pages
  const hideLayout = location.pathname === '/login' || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {!hideLayout && <Navbar />}
      <main>
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}
