'use client';

import Link from 'next/link';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { getAnimationVariants } from '@/utils/animationVariants'; // Import animation utility

export default function FloatingOnboardingBanner() {
  const { currentQuest } = useOnboarding();
  const { animationStyle } = useTheme(); // Get animationStyle from theme context
  const animationVariants = getAnimationVariants(animationStyle); // Get appropriate variants

  if (!currentQuest.show) {
    return null;
  }

  return (
    <motion.div
      {...animationVariants.slideInUp} // Apply slideInUp variant
      className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 z-50 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg max-w-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">New Quest Available!</p>
          <p className="text-sm">{currentQuest.message}</p>
        </div>
        {currentQuest.ctaLink && (
          <Link href={currentQuest.ctaLink} passHref>
            <a className="ml-4 px-4 py-2 bg-primary-foreground text-primary rounded-md text-sm font-semibold whitespace-nowrap hover:bg-opacity-90 transition-colors">
              {currentQuest.ctaText}
            </a>
          </Link>
        )}
      </div>
    </motion.div>
  );
}