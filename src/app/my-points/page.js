'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedPage from '../../components/AnimatedPage';
import MyPointsSkeleton from '../../components/MyPointsSkeleton';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { ChevronRightIcon, GiftIcon } from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';
import PageContainer from '../../components/PageContainer';
import { triggerHapticFeedback } from '@/utils/haptics';
import { calculateRankProgress } from '@/utils/rankCalculations'; // --- 1. IMPORT THE NEW UTILITY ---

function AnimatedCounter({ value }) {
    const motionValue = useMotionValue(value);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    useEffect(() => {
        const controls = animate(motionValue, value, { duration: 1, ease: 'easeOut' });
        return controls.stop;
    }, [value]);
    return <motion.span>{rounded}</motion.span>;
}

const PullToRefresh = dynamic(() => import('react-pull-to-refresh'), {
  ssr: false
});

export default function MyPointsPage() {
    const { user, login, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    
    const handleRefresh = async () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) { await login(currentToken, true); }
        return Promise.resolve();
    };

    if (loading || !user) { return <MyPointsSkeleton />; }
    if (!isAuthenticated) { router.push('/'); return null; }
    
    // --- 2. REMOVE THE OLD LOGIC BLOCK ---
    // The entire block of code that calculated sortedRanks, nextRank, etc., is now gone.

    // --- 3. REPLACE IT WITH A SINGLE CALL TO OUR NEW FUNCTION ---
    const { nextRank, progressPercentage, pointsNeeded } = calculateRankProgress(user);

    return (
        <AnimatedPage>
            <PullToRefresh onRefresh={handleRefresh}>
                <PageContainer>
                    {/* Member Card */}
                    <motion.div 
                      className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200" 
                      initial={{ scale: 0.95, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-end text-xs uppercase tracking-widest mb-4 text-gray-500"><span>{user.rank.name || 'Member'}</span></div>
                        <div className="text-center text-4xl font-bold tracking-wider mb-4 text-gray-800">MEMBER</div>
                        <div className="flex justify-between items-end">
                            <span className="font-light capitalize text-gray-700">{user.firstName || user.email}</span>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900"><AnimatedCounter value={user.points} /></span>
                                <div className="text-xs uppercase tracking-widest text-gray-500">Total Points</div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* This JSX now uses the variables from our new utility function */}
                    {nextRank ? (
                        <motion.div 
                          className="bg-gradient-to-tr from-gray-900 to-gray-700 text-white rounded-xl shadow-lg p-5 mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium">Next Rank: <span className="font-bold">{nextRank.name}</span></p>
                            <p className="text-sm font-bold">{pointsNeeded.toLocaleString()} pts to go</p>
                          </div>
                          <AnimatedProgressBar progress={progressPercentage} barColor="bg-primary" />
                          {nextRank.benefits && nextRank.benefits[0] && (
                            <p className="text-xs text-gray-300 mt-2 text-center">
                              Next up: {nextRank.benefits[0]}
                            </p>
                          )}
                        </motion.div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-4 text-center mb-6"><p className="font-bold text-primary">🎉 You've reached the highest rank!</p></div>
                      )}

                    {/* Referral Banner */}
                    {user.settings?.referralBannerText && (
                        <Link href="/profile/refer" onClick={triggerHapticFeedback} className="block mb-6">
                            <div className="border border-yellow-300 rounded-lg p-3 text-center bg-yellow-50 hover:bg-yellow-100 transition-colors flex items-center justify-center">
                                <GiftIcon className="w-5 h-5 mr-3 text-yellow-600"/>
                                <p className="font-semibold text-yellow-800">
                                    {user.settings.referralBannerText}
                                </p>
                            </div>
                        </Link>
                    )}

                    {/* Rewards Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <h2 className="font-bold text-lg text-gray-900">Rewards For You</h2>
                            <Link href="/catalog" className="text-sm font-medium text-gray-500 flex items-center">VIEW ALL <ChevronRightIcon className="h-4 w-4 ml-1" /></Link>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {user.eligibleRewards && user.eligibleRewards.slice(0, 3).map(reward => (
                                <Link key={reward.id} href={`/catalog/${reward.id}`}>
                                    <div className="text-center">
                                        <div className="bg-gray-100 rounded-full aspect-square flex items-center justify-center p-2 mb-2"><img src={reward.image} alt={reward.name} className="w-full h-full object-contain" /></div>
                                        <p className="text-xs font-semibold truncate text-gray-800">{reward.name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {(!user.eligibleRewards || user.eligibleRewards.length === 0) && (<p className="text-center text-gray-500 text-sm mt-4 px-4">You have no eligible rewards yet. Keep scanning to earn points!</p>)}
                    </div>

                    {/* How to Earn Link */}
                    <div className="text-center">
                         <Link href="/how-to-earn" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                           View all ranks and benefits
                         </Link>
                    </div>

                </PageContainer>
            </PullToRefresh>
        </AnimatedPage>
    );
}