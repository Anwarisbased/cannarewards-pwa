'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import LoginForm from '../components/LoginForm';
import Dashboard from '../components/Dashboard';
import RegisterForm from '../components/RegisterForm';
import DashboardSkeleton from '../components/DashboardSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (loading) {
    return (
        // --- MODIFIED: Removed the <main> tag here ---
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <DashboardSkeleton />
        </div>
    );
  }

  const authContent = (
    <div className="text-center w-full max-w-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Image
          src="/logo.png"
          alt="CannaRewards Logo"
          width={80}
          height={80}
          className="mx-auto mb-8"
        />
      </motion.div>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
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
    </div>
  );

  return (
    // --- MODIFIED: Removed the <main> tag here ---
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      {isAuthenticated ? <Dashboard /> : authContent}
    </div>
  );
}