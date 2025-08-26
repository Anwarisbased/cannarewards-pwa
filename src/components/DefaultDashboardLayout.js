'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { triggerHapticFeedback } from '@/utils/haptics';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { getAnimationVariants } from '@/utils/animationVariants'; // Import animation utility

export default function DefaultDashboardLayout() {
  const { user } = useAuth();
  const { animationStyle } = useTheme(); // Get animationStyle from theme context
  const animationVariants = getAnimationVariants(animationStyle); // Get appropriate variants

  return (
    <motion.div 
      className="relative flex flex-col justify-between min-h-screen w-full text-white p-8"
      style={{ 
        backgroundImage: `url(/dashboard-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      {...animationVariants.fadeIn} // Apply fadeIn to the main container
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center flex-grow">
        <motion.h1 
          className="text-2xl font-light mb-2 tracking-wide"
          {...animationVariants.slideInUp} // Apply slideInUp
          transition={{ ...animationVariants.slideInUp.transition, delay: 0.2 }} // Add delay
        >
          Welcome Back,
        </motion.h1>
        <motion.h2 
          className="text-5xl font-bold capitalize"
          {...animationVariants.slideInUp} // Apply slideInUp
          transition={{ ...animationVariants.slideInUp.transition, delay: 0.4 }} // Add delay
        >
          {user?.firstName || 'Member'}
        </motion.h2>
      </div>

      <motion.div 
        className="relative z-10 w-full"
        {...animationVariants.slideInUp} // Apply slideInUp
        transition={{ ...animationVariants.slideInUp.transition, delay: 0.6 }} // Add delay
      >
        <Link href="/catalog" className="block" onClick={triggerHapticFeedback}>
          <button className="w-full bg-white text-black font-bold py-4 px-6 rounded-lg text-lg transform hover:scale-105 transition-transform">
            Shop Now
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}