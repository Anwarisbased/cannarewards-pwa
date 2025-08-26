'use client';

import toast from 'react-hot-toast';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { getAnimationVariants } from '@/utils/animationVariants'; // Import animation utility

export default function AchievementUnlockedToast({ achievement }) {
  const { animationStyle } = useTheme(); // Get animationStyle from theme context
  const animationVariants = getAnimationVariants(animationStyle); // Get appropriate variants

  const rarityStyles = {
    Bronze: 'bg-amber-700',
    Silver: 'bg-slate-600',
    Gold: 'bg-yellow-600',
    default: 'bg-gray-700',
  };

  const bgColor = rarityStyles[achievement.rarity] || rarityStyles.default;

  return (
    <motion.div
      {...animationVariants.fadeIn} // Apply fadeIn variant
      className={`flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor}`}
    >
      <div className="relative w-12 h-12 mr-3 flex-shrink-0">
        <Image
          src={achievement.icon_url || '/icons/icon-128x128.png'}
          alt={achievement.title}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div>
        <p className="font-bold text-lg">Achievement Unlocked!</p>
        <p className="text-sm">{achievement.title}</p>
        {achievement.points_reward > 0 && (
          <p className="text-xs mt-1">+{achievement.points_reward} Points</p>
        )}
      </div>
    </motion.div>
  );
}

// Helper function to show the toast
export const showAchievementToast = (achievement) => {
  toast.custom((t) => (
    <AchievementUnlockedToast achievement={achievement} />
  ), {
    duration: 4000,
    position: 'top-center',
  });
};
