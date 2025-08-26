'use client';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import DefaultDashboardLayout from './DefaultDashboardLayout';
import CompactDashboardLayout from './CompactDashboardLayout';
import GamifiedDashboardLayout from './GamifiedDashboardLayout';

export default function Dashboard() {
  const { user } = useAuth();
  const { dashboardLayout } = useTheme(); // Get dashboardLayout from theme context

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <p className="text-white">Loading...</p>
        </div>
    );
  }

  // Conditionally render layouts based on the theme setting
  switch (dashboardLayout) {
    case 'compact':
      return <CompactDashboardLayout />;
    case 'gamified':
      return <GamifiedDashboardLayout />;
    case 'default':
    default:
      return <DefaultDashboardLayout />;
  }
}