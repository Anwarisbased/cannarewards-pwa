'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../components/AnimatedPage';
import EmptyState from '../../components/EmptyState';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import PullToRefresh from 'react-pull-to-refresh';

export default function HistoryPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/point-history`);
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
                <main className="p-4 bg-gray-100 min-h-screen">
                    <div className="w-full max-w-md mx-auto">
                        <header className="flex items-center mb-6">
                            <Link href="/profile" className="p-2 -ml-2 hover:bg-gray-200 rounded-full"><ChevronLeftIcon className="h-6 w-6" /></Link>
                            <h1 className="text-3xl font-bold ml-2">Point History</h1>
                        </header>

                        {history.length > 0 ? (
                            <div className="space-y-3">
                                {history.map((item, index) => (
                                    <motion.div 
                                        key={index}
                                        className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
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
                            </div>
                        ) : (
                            <EmptyState 
                                Icon={ClipboardDocumentListIcon}
                                title="No Points History Yet"
                                message="Start scanning products and redeeming rewards to see your activity here."
                            />
                        )}
                    </div>
                </main>
            </PullToRefresh>
        </AnimatedPage>
    );
}