'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedProgressBar from '../../components/AnimatedProgressBar'; // We'll use this
import DynamicHeader from '../../components/DynamicHeader';
import PageContainer from '../../components/PageContainer'; // Use our standard container
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';

// --- SHADCN IMPORTS ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// --- END IMPORTS ---

// Rank styles remain the same
const rankStyles = {
    member: { cardClasses: 'bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400', textClasses: 'text-gray-800' },
    bronze: { cardClasses: 'bg-gradient-to-br from-amber-700 via-amber-500 to-yellow-300', textClasses: 'text-white' },
    silver: { cardClasses: 'bg-gradient-to-br from-slate-400 via-slate-200 to-slate-400', textClasses: 'text-slate-800' },
    gold: { cardClasses: 'bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500', textClasses: 'text-yellow-900' },
    black: { cardClasses: 'bg-gradient-to-br from-gray-900 via-black to-gray-800', textClasses: 'text-white' },
    default: { cardClasses: 'bg-gradient-to-br from-gray-700 to-black', textClasses: 'text-white' }
};

// --- REFACTORED FLIPPABLE RANK CARD ---
function FlippableRankCard({ rankName, pointsRequired, userLifetimePoints, benefits = [] }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const isUnlocked = userLifetimePoints >= pointsRequired;
    const progress = pointsRequired > 0 ? Math.min((userLifetimePoints / pointsRequired) * 100, 100) : 100;

    const currentStyle = rankStyles[rankName.toLowerCase()] || rankStyles.default;
    const frontCardClasses = isUnlocked ? `${currentStyle.cardClasses} ${currentStyle.textClasses}` : 'bg-muted text-muted-foreground';
    const frontHeaderClasses = isUnlocked ? 'text-yellow-300' : 'text-muted-foreground/50';
    
    const flipVariants = { front: { rotateY: 0 }, back: { rotateY: 180 } };

    return (
        <div className="w-full h-52 [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-full [transform-style:preserve-3d]"
                variants={flipVariants}
                initial={false}
                animate={isFlipped ? "back" : "front"}
                transition={{ duration: 0.6 }}
            >
                {/* --- FRONT OF CARD (Built with Shadcn Card) --- */}
                <div className="absolute w-full h-full [backface-visibility:hidden]">
                    <Card className={`w-full h-full flex flex-col justify-between ${frontCardClasses}`}>
                        <CardHeader>
                            <p className={`text-sm uppercase font-bold ${frontHeaderClasses}`}>{isUnlocked ? "Unlocked" : "Locked"}</p>
                            <CardTitle className="text-4xl font-bold uppercase tracking-wider">{rankName}</CardTitle>
                            <CardDescription className={isUnlocked ? 'text-white/80' : 'text-muted-foreground'}>
                                Reach {pointsRequired.toLocaleString()} lifetime points
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pointsRequired > 0 && (
                                <div className="space-y-1">
                                    <AnimatedProgressBar progress={isUnlocked ? 100 : progress} barColor="bg-green-500" />
                                    <div className="flex justify-between items-center text-xs">
                                        <div className="opacity-60 flex items-center space-x-1">
                                            <span>Tap to flip</span>
                                            <ArrowPathRoundedSquareIcon className="w-4 h-4" />
                                        </div>
                                        <p className="font-bold">{userLifetimePoints.toLocaleString()} / {pointsRequired.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* --- BACK OF CARD (Built with Shadcn Card) --- */}
                <div className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <Card className="w-full h-full bg-card text-card-foreground">
                        <CardHeader>
                            <CardTitle>{rankName} Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {benefits.length > 0 ? (
                                    benefits.map((benefit, index) => <li key={index}>{benefit}</li>)
                                ) : (
                                    <li>No special benefits for this tier.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}

const containerVariants = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };

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
        ? Object.values(user.allRanks).sort((a, b) => a.points - b.points) // Sort ascending to show progress
        : [];

    return (
        <PageContainer>
            <DynamicHeader title="How To Earn" backLink="/my-points" />
            
            <div className="mt-4">
                {ranksArray.length > 0 ? (
                    <motion.div 
                        className="space-y-6"
                        variants={containerVariants} 
                        initial="hidden" 
                        animate="visible"
                    >
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
                    <p className="text-center text-muted-foreground">Rank information is not available yet.</p>
                )}
            </div>
        </PageContainer>
    );
}