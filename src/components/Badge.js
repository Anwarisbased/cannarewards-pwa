'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/components/lib/utils";
import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function Badge({ achievement, isUnlocked }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const rarityStyles = {
        common: { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-300' },
        uncommon: { bg: 'bg-green-200', text: 'text-green-800', border: 'border-green-300' },
        rare: { bg: 'bg-blue-200', text: 'text-blue-800', border: 'border-blue-300' },
        epic: { bg: 'bg-purple-200', text: 'text-purple-800', border: 'border-purple-300' },
        legendary: { bg: 'bg-yellow-200', text: 'text-yellow-800', border: 'border-yellow-300' },
    };

    const style = rarityStyles[achievement.rarity] || rarityStyles.common;

    const flipVariants = {
        front: { rotateY: 0 },
        back: { rotateY: 180 }
    };

    return (
        <div 
            className="w-full h-48 [perspective:1000px] cursor-pointer" 
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700"
                variants={flipVariants}
                initial={false}
                animate={isFlipped ? "back" : "front"}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                {/* Front of the Badge */}
                <div className={cn(
                    "absolute w-full h-full [backface-visibility:hidden] rounded-xl border-2 flex flex-col items-center justify-center p-4 text-center",
                    isUnlocked ? `${style.bg} ${style.border}` : "bg-gray-100 border-gray-200"
                )}>
                    <div className={cn("transition-all duration-500", !isUnlocked && "grayscale opacity-50")}>
                        {achievement.icon_url ? (
                             <img src={achievement.icon_url} alt={achievement.title} className="w-16 h-16 mx-auto mb-2" />
                        ) : (
                            <SparklesIcon className={cn("w-16 h-16 mx-auto mb-2", style.text)} />
                        )}
                        <h3 className={cn("font-bold", style.text)}>{achievement.title}</h3>
                        <p className={cn("text-xs capitalize", style.text, "opacity-70")}>{achievement.rarity}</p>
                    </div>
                     {!isUnlocked && <LockClosedIcon className="w-5 h-5 text-gray-400 absolute top-3 right-3" />}
                </div>

                {/* Back of the Badge */}
                <div className={cn(
                    "absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-xl border-2 flex flex-col justify-center p-4",
                     style.bg, style.border
                )}>
                    <p className={cn("text-sm text-center", style.text)}>{achievement.description}</p>
                </div>
            </motion.div>
        </div>
    );
}