'use client';

import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15, // Start 15px down
  },
  in: {
    opacity: 1,
    y: 0, // Animate to its original position
  },
  // --- THIS IS THE NEW PART ---
  exit: {
    opacity: 0,
    y: -15, // Exit by moving 15px up
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

export default function AnimatedPage({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit" // We tell motion to use the new exit variant
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}