'use client';

import { motion } from 'framer-motion';
import { useTransitionDirection } from '../context/TransitionContext';

const pageVariants = {
    // For sliding in from the right (forward navigation)
    initialRight: {
        opacity: 0,
        x: '100vw',
    },
    // For sliding in from the left (backward navigation)
    initialLeft: {
        opacity: 0,
        x: '-100vw',
    },
    // The state when the page is fully visible
    in: {
        opacity: 1,
        x: 0,
    },
    // The state when the page is exiting
    exit: {
        opacity: 0,
        x: '-100vw', // Always exit to the left for simplicity
    }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export default function AnimatedPage({ children }) {
    const { direction } = useTransitionDirection();

    const initialVariant = direction === 'right' ? 'initialRight' : 'initialLeft';

    return (
        <motion.div
            initial={initialVariant}
            animate="in"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
        >
            {children}
        </motion.div>
    );
}