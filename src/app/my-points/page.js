'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedPage from '../../components/AnimatedPage';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import PullToRefresh from 'react-pull-to-refresh';

// Reusable AnimatedCounter Component
function AnimatedCounter({ value }) {
    const motionValue = useMotionValue(value);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    useEffect(() => {
        const controls = animate(motionValue, value, { duration: 1, ease: 'easeOut' });
        return controls.stop;
    }, [value]);
    return <motion.span>{rounded}</motion.span>;
}

export default function MyPointsPage() {
    const { user, login, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    const handleRefresh = async () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            // Call the login function with the refresh flag to silently refetch data
            await login(currentToken, true); 
        }
        // The return is needed for the library to know the refresh is done.
        return Promise.resolve();
    };

    if (loading || !user) {
        // We can add a skeleton loader here later
        return <div className="min-h-screen bg-white"></div>;
    }
    if (!isAuthenticated) {
        router.push('/');
        return null;
    }

    return (
        <AnimatedPage>
            <PullToRefresh onRefresh={handleRefresh}>
                <main className="p-4 bg-white min-h-screen">
                    <div className="w-full max-w-md mx-auto">
                        {/* Member Card */}
                        <motion.div
                            className="text-white rounded-xl shadow-lg p-6 mb-6 bg-gradient-to-br from-secondary to-primary"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="flex justify-end text-xs uppercase tracking-widest mb-4"><span>{user.rank.name || 'Member'}</span></div>
                            <div className="text-center text-4xl font-bold tracking-wider mb-4">MEMBER</div>
                            <div className="flex justify-between items-end">
                                <span className="font-light capitalize">{user.firstName || user.email}</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold"><AnimatedCounter value={user.points} /></span>
                                    <div className="text-xs uppercase tracking-widest">Total Points</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Referrals Banner */}
                        <div className="border border-gray-200 rounded-lg p-3 text-center mb-6">
                            <p className="font-semibold text-gray-800">{user.settings?.referralBannerText || 'Earn More!'}</p>
                        </div>

                        {/* "My Points" & "How to Earn" Section */}
                        <div className="flex justify-between items-center mb-8 px-2">
                            <div>
                                <p className="text-gray-500 text-sm">My Points</p>
                                <p className="text-2xl font-bold flex items-center">
                                    <span className="w-6 h-6 bg-gray-300 rounded-full mr-2"></span>
                                    <AnimatedCounter value={user.points} />
                                </p>
                            </div>
                            <Link href="/how-to-earn">
                                <button className="bg-black text-white font-bold py-3 px-6 rounded-lg">
                                    How to Earn
                                </button>
                            </Link>
                        </div>

                        {/* "Rewards For You" Section */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2 px-2">
                                <h2 className="font-bold text-lg">Rewards For You</h2>
                                <Link href="/catalog" className="text-sm font-medium text-gray-500 flex items-center">
                                    VIEW ALL <ChevronRightIcon className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {user.eligibleRewards && user.eligibleRewards.slice(0, 3).map(reward => (
                                    <Link key={reward.id} href={`/catalog/${reward.id}`}>
                                        <div className="text-center">
                                            <div className="bg-gray-100 rounded-full aspect-square flex items-center justify-center p-2 mb-2">
                                                <img src={reward.image} alt={reward.name} className="w-full h-full object-contain" />
                                            </div>
                                            <p className="text-xs font-semibold truncate">{reward.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {user.eligibleRewards && user.eligibleRewards.length === 0 && (
                                <p className="text-center text-gray-500 text-sm mt-4">You have no eligible rewards yet. Keep scanning!</p>
                            )}
                        </div>
                    </div>
                </main>
            </PullToRefresh>
        </AnimatedPage>
    );
}