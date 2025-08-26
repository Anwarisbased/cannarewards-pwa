// src/utils/animationVariants.js

export const defaultVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  },
  // Add more default variants as needed
};

export const subtleVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: 'easeOut' },
  },
  slideInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: 'easeOut' },
  },
  // Add more subtle variants
};

export const playfulVariants = {
  fadeIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', stiffness: 200, damping: 10 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 50, rotate: -10 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    transition: { type: 'spring', stiffness: 150, damping: 8 },
  },
  // Add more playful variants
};

export const getAnimationVariants = (style) => {
  switch (style) {
    case 'subtle':
      return subtleVariants;
    case 'playful':
      return playfulVariants;
    case 'default':
    default:
      return defaultVariants;
  }
};