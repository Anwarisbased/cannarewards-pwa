'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();

  // Show a loading/fallback state if the user object isn't available yet
  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            {/* You could replace this with a more branded loading spinner later */}
            <p className="text-white">Loading...</p>
        </div>
    );
  }

  return (
    <motion.div 
      className="relative flex flex-col justify-between min-h-screen w-full text-white p-8"
      // Apply the background image using inline styles
      style={{ 
        backgroundImage: `url(/dashboard-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* 1. Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0"></div>

      {/* 2. Main Content Wrapper - using z-10 to be above the overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-grow">
        <motion.h1 
          className="text-2xl font-light mb-2 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome Back,
        </motion.h1>
        <motion.h2 
          className="text-5xl font-bold capitalize"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {user.firstName || 'Member'}
        </motion.h2>
      </div>

      {/* 3. Call-to-Action Button Wrapper - also needs z-10 */}
      <motion.div 
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link href="/catalog" className="block">
          <button className="w-full bg-white text-black font-bold py-4 px-6 rounded-lg text-lg transform hover:scale-105 transition-transform">
            Shop Now
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}