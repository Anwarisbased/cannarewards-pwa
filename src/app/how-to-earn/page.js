'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedPage from '../../components/AnimatedPage';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

// 1. --- DEFINING OUR PREMIUM RANK STYLES ---
// This object maps rank names to their specific Tailwind CSS classes.
const rankStyles = {
    member: {
        cardClasses: 'bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400',
        textClasses: 'text-gray-800',
    },
    bronze: {
        cardClasses: 'bg-gradient-to-br from-amber-700 via-amber-500 to-yellow-300',
        textClasses: 'text-white',
    },
    silver: {
        cardClasses: 'bg-gradient-to-br from-slate-400 via-slate-200 to-slate-400',
        textClasses: 'text-slate-800',
    },
    gold: {
        cardClasses: 'bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500',
        textClasses: 'text-yellow-900',
    },
    black: {
        cardClasses: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
        textClasses: 'text-white',
    },
    // A default style for any other ranks that might be added
    default: {
        cardClasses: 'bg-gradient-to-br from-gray-700 to-black',
        textClasses: 'text-white',
    }
};


// A flippable RankCard component
function FlippableRankCard({ rankName, pointsRequired, userLifetimePoints, benefits = [] }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const isUnlocked = userLifetimePoints >= pointsRequired;
    const progress = pointsRequired > 0 ? Math.min((userLifetimePoints / pointsRequired) * 100, 100) : 100;

    // 2. --- DYNAMICALLY SELECT THE STYLE ---
    const currentStyle = rankStyles[rankName.toLowerCase()] || rankStyles.default;
    const frontCardClasses = isUnlocked
        ? `${currentStyle.cardClasses} ${currentStyle.textClasses}`
        : 'bg-gray-200 text-gray-400';
    const frontHeaderClasses = isUnlocked ? 'text-yellow-300' : 'text-gray-300';
    
    const flipVariants = {
        front: { rotateY: 0 },
        back: { rotateY: 180 },
    };

    return (
        <div className="w-full h-48 [perspective:1000px] mb-4 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-full [transform-style:preserve-3d]"
                variants={flipVariants}
                initial={false}
                animate={isFlipped ? "back" : "front"}
                transition={{ duration: 0.6 }}
            >
                {/* --- 3. APPLY DYNAMIC STYLES TO THE FRONT OF THE CARD --- */}
                <div className={`absolute w-full h-full rounded-xl shadow-md p-6 flex flex-col justify-between [backface-visibility:hidden] ${frontCardClasses}`}>
                    <div>
                        <p className={`text-sm uppercase ${frontHeaderClasses}`}>{isUnlocked ? "UNLOCKED" : "LOCKED"}</p>
                        <h2 className="text-4xl font-bold uppercase tracking-wider">{rankName}</h2>
                        <p className="text-sm">Earn by collecting {pointsRequired.toLocaleString()} points</p>
                    </div>
                    {pointsRequired > 0 && (
                         <div>
                            <div className="w-full bg-black/20 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${isUnlocked ? 100 : progress}%` }}></div>
                            </div>
                            <p className="text-right text-xs mt-1">{userLifetimePoints.toLocaleString()} / {pointsRequired.toLocaleString()}</p>
                        </div>
                    )}
                </div>

                {/* --- BACK OF THE CARD --- */}
                <div className="absolute w-full h-full rounded-xl shadow-md p-6 bg-black text-white [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <h3 className="text-lg font-bold mb-3">{rankName} Benefits</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {benefits.length > 0 ? (
                            benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))
                        ) : (
                            <li>No special benefits for this tier.</li>
                        )}
                    </ul>
                </div>
            </motion.div>
        </div>
    );
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  },
};

export default function HowToEarnPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    if (loading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        router.push('/');
        return null;
    }

    const ranksArray = user.allRanks 
        ? Object.values(user.allRanks).sort((a, b) => b.points - a.points)
        : [];

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <div className="flex items-center mb-6 h-16">
                        <Link href="/my-points" className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                            <ChevronLeftIcon className="h-7 w-7" />
                        </Link>
                        <h1 className="text-xl font-semibold text-center flex-grow -ml-7">How To Earn</h1>
                    </div>
                    
                    {ranksArray.length > 0 ? (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            {ranksArray.map(rank => (
                                <motion.div key={rank.name} variants={itemVariants}>
                                    <FlippableRankCard
                                        rankName={rank.name}
                                        pointsRequired={rank.points}
                                        userLifetimePoints={user.lifetimePoints}
                                        benefits={rank.benefits}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <p className="text-center text-gray-500">Rank information is not available yet.</p>
                    )}
                </div>
            </main>
        </AnimatedPage>
    );
}