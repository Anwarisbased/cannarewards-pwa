'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Defines the animation for the container. It's mainly used for the staggerChildren property.
const containerVariants = {
  hidden: { opacity: 1 }, // The container itself doesn't fade, just its children.
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // The delay between each child's animation.
    },
  },
};

// Defines the animation for each individual child item in the list.
const itemVariants = {
  hidden: { y: 20, opacity: 0 }, // Starts 20px down and invisible.
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring', // A spring animation for a more natural feel.
      stiffness: 100,
    },
  },
};

/**
 * A reusable component that animates its children with a staggered effect.
 * It automatically wraps each child in a motion.div for animation.
 * @param {object} props
 * @param {React.ReactNode} props.children - The list items to animate.
 * @param {string} [props.className] - Optional classes for the container.
 */
export default function StaggeredList({ children, className, ...props }) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props} // Pass through any other props, like `key`.
    >
      {/* 
        We use React.Children.map to iterate over the children.
        This is more robust than a simple array map.
        Each child is wrapped in its own motion.div with the item variants.
      */}
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}