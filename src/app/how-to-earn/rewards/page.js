// src/app/rewards/page.js
'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedPage from '../../components/AnimatedPage';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

// Reusable AnimatedCounter Component
function AnimatedCounter({ value }) {
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    useEffect(() => {
        const controls = animate(motionValue, value, { duration: 1, ease: 'easeOut' });
        return controls.stop;
    }, [value]);
    return <motion.span>{rounded}</motion.span>;
}

export default function RewardsPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    if (loading) return <div className="min-h-screen bg-white"></div>; // Or a skeleton
    if (!isAuthenticated) { router.push('/'); return null; }

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    {/* Member Card */}
                    <motion.div
                        className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-xl shadow-lg p-6 mb-6"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="flex justify-end text-xs uppercase tracking-widest mb-4">
                            <span>{user.rank.name || 'Member'}</span>
                        </div>
                        <div className="text-center text-4xl font-bold tracking-wider mb-4">
                            MEMBER
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="font-light capitalize">{user.firstName || user.email}</span>
                            <div className="text-right">
                                <span className="text-2xl font-bold"><AnimatedCounter value={user.points} /></span>
                                <div className="text-xs uppercase tracking-widest">Total Points</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* "My Points" & "How to Earn" Section */}
                    <div className="flex justify-between items-center mb-8 px-2">
                        <div>
                            <p className="text-gray-500 text-sm">My Points</p>
                            <p className="text-2xl font-bold"><AnimatedCounter value={user.points} /></p>
                        </div>
                        <Link href="/how-to-earn">
                            <button className="bg-black text-white font-bold py-3 px-6 rounded-lg">
                                How to Earn
                            </button>
                        </Link>
                    </div>

                    {/* Referrals Section (Coming Soon) */}
                    <div className="bg-gray-100 rounded-lg shadow-inner p-4 text-center">
                        <p className="font-semibold text-gray-800">🎁 Earn More By Inviting Your Friends</p>
                        <p className="text-xs text-gray-500">(Coming Soon)</p>
                    </div>
                </div>
            </main>
        </AnimatedPage>
    );
}