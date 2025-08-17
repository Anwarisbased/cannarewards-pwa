'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedPage from '../../components/AnimatedPage';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

// A flippable RankCard component
function FlippableRankCard({ rankName, pointsRequired, userLifetimePoints, benefits = [], isVip = false }) {
    const [isFlipped, setIsFlipped] = useState(false);
    const isUnlocked = userLifetimePoints >= pointsRequired;
    const progress = pointsRequired > 0 ? Math.min((userLifetimePoints / pointsRequired) * 100, 100) : 100;

    // Dynamic classes for styling
    const frontCardClasses = isUnlocked
        ? 'bg-gradient-to-br from-gray-700 to-black text-white'
        : 'bg-gray-200 text-gray-400';
    const frontTextClasses = isUnlocked ? 'text-yellow-400' : 'text-gray-300';
    
    // The animation variant for the 3D flip
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
                {/* --- FRONT OF THE CARD --- */}
                <div className={`absolute w-full h-full rounded-xl shadow-md p-6 flex flex-col justify-between [backface-visibility:hidden] ${frontCardClasses}`}>
                    <div>
                        <p className={`text-sm uppercase ${frontTextClasses}`}>{isUnlocked ? "UNLOCKED" : "LOCKED"}</p>
                        <h2 className="text-4xl font-bold uppercase tracking-wider">{rankName}</h2>
                        <p className="text-sm">Earn by collecting {pointsRequired.toLocaleString()} points</p>
                    </div>
                    {pointsRequired > 0 && (
                         <div>
                            <div className="w-full bg-gray-500 rounded-full h-2">
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

// Animation variants for staggering the list
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

    // Convert the 'allRanks' object from the API into a sorted array we can map over
    const ranksArray = user.allRanks 
        ? Object.values(user.allRanks).sort((a, b) => b.points - a.points)
        : [];

    return (
        <AnimatedPage>
            <main className="p-4 bg-gray-100 min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <div className="flex items-center mb-6">
                        <Link href="/my-points" className="p-2 -ml-2 hover:bg-gray-200 rounded-full">
                            <ChevronLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-3xl font-bold ml-2">How To Earn</h1>
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