'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Badge({ achievement, isUnlocked }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const rarityStyles = {
    Bronze: {
      gradient: 'from-amber-700 to-amber-900',
      shadow: 'shadow-amber-500/50',
      textColor: 'text-amber-100',
    },
    Silver: {
      gradient: 'from-slate-400 to-slate-600',
      shadow: 'shadow-slate-400/50',
      textColor: 'text-slate-100',
    },
    Gold: {
      gradient: 'from-yellow-400 to-yellow-600',
      shadow: 'shadow-yellow-400/50',
      textColor: 'text-yellow-100',
    },
    default: {
      gradient: 'from-gray-600 to-gray-800',
      shadow: 'shadow-gray-500/50',
      textColor: 'text-gray-200',
    },
  };

  const styles = rarityStyles[achievement.rarity] || rarityStyles.default;

  return (
    <div
      className="w-full h-48 perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of the badge */}
        <div className={`absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-4 rounded-lg shadow-lg ${styles.gradient} ${styles.shadow} ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}>
          <div className="relative w-20 h-20">
            <Image
              src={achievement.icon_url || '/icons/icon-128x128.png'} // fallback icon
              alt={achievement.title}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h3 className={`mt-2 text-center font-bold ${styles.textColor}`}>{achievement.title}</h3>
        </div>

        {/* Back of the badge */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg ${styles.gradient} ${styles.shadow}`}>
          <p className={`text-center text-sm ${styles.textColor}`}>{achievement.description}</p>
          {isUnlocked && <p className={`mt-2 text-xs font-bold ${styles.textColor}`}>UNLOCKED</p>}
        </div>
      </motion.div>
    </div>
  );
}