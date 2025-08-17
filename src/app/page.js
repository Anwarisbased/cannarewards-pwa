'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import RegisterForm from '../components/RegisterForm';
import DashboardSkeleton from '../components/DashboardSkeleton'; // Import the new skeleton component
import { motion, AnimatePresence } from 'framer-motion';

// Define the animation for our forms
const formVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'circOut',
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.3,
      ease: 'circIn',
    },
  },
};

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  // If the app is in the initial loading state, show the skeleton.
  // This happens on the first page load while the AuthContext checks for a token.
  if (loading) {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <DashboardSkeleton />
        </main>
    );
  }

  // This variable holds the content for unauthenticated users (login/register forms)
  const authContent = (
    <div className="text-center w-full max-w-sm">
      <motion.h1 
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        CannaRewards
      </motion.h1>
      <AnimatePresence mode="wait">
        <motion.div
          key={showLogin ? 'login' : 'register'}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {showLogin ? (
            <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // The main return decides whether to show the authenticated content (Dashboard)
  // or the unauthenticated content (authContent).
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {isAuthenticated ? <Dashboard /> : authContent}
    </main>
  );
}