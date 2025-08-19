'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../utils/axiosConfig';
import AnimatedPage from '../../components/AnimatedPage';
import EmptyState from '../../components/EmptyState';
import DynamicHeader from '../../components/DynamicHeader';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import PullToRefresh from 'react-pull-to-refresh';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function HistoryPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/point-history`);
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }
        if (isAuthenticated) {
            setLoading(true);
            fetchHistory().finally(() => setLoading(false));
        }
    }, [isAuthenticated, authLoading, router, fetchHistory]);

    const handleRefresh = async () => {
        await fetchHistory();
        return Promise.resolve();
    };

    if (authLoading || loading) {
        return <div className="text-center p-10">Loading history...</div>;
    }

    return (
        <AnimatedPage>
            <PullToRefresh onRefresh={handleRefresh}>
                <main className="bg-white min-h-screen">
                    <div className="w-full max-w-md mx-auto">
                        {/* --- 1. STICKY HEADER WRAPPER --- */}
                        <div className="sticky top-0 z-10 bg-white pt-4 px-4 border-b border-gray-200">
                            <DynamicHeader title="Point History" />
                        </div>

                        {/* --- 2. SCROLLABLE CONTENT AREA --- */}
                        <div className="p-4">
                            {history.length > 0 ? (
                                <motion.div 
                                    className="space-y-3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {history.map((item, index) => (
                                        <motion.div 
                                            key={index}
                                            className="bg-white p-4 rounded-lg shadow flex justify-between items-center border border-gray-100"
                                            variants={itemVariants}
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-800">{item.description}</p>
                                                <p className="text-sm text-gray-500">{new Date(item.log_date.replace(' ', 'T')).toLocaleString()}</p>
                                            </div>
                                            <span className={`font-bold text-lg ${item.points >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {item.points >= 0 ? `+${item.points}` : item.points}
                                            </span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <EmptyState 
                                    Icon={ClipboardDocumentListIcon}
                                    title="No Points History Yet"
                                    message="Start scanning products and redeeming rewards to see your activity here."
                                />
                            )}
                        </div>
                    </div>
                </main>
            </PullToRefresh>
        </AnimatedPage>
    );
}