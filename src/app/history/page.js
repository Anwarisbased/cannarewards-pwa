'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getPointHistory } from '@/services/rewardsService';
import EmptyState from '../../components/EmptyState';
import DynamicHeader from '../../components/DynamicHeader';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

// --- CORRECTED LIBRARY IMPORT ---
import PullToRefresh from 'react-simple-pull-to-refresh';
// --- END CORRECTED IMPORT ---

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

export default function HistoryPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        try {
            const historyData = await getPointHistory();
            setHistory(historyData);
        } catch (error) { 
            console.error("Failed to fetch history:", error); 
        }
    }, []);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { router.push('/'); return; }
        if (isAuthenticated) { 
            setLoading(true); 
            fetchHistory().finally(() => setLoading(false)); 
        }
    }, [isAuthenticated, authLoading, router, fetchHistory]);

    const handleRefresh = async () => { 
        await fetchHistory(); 
    };

    if (authLoading || loading) { return <div className="text-center p-10 pt-20">Loading history...</div>; }

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <main className="bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <div className="sticky top-0 z-10 bg-white pt-4 px-4 border-b border-gray-200">
                        <DynamicHeader title="Point History" backLink="/profile" />
                    </div>
                    <div className="p-4" style={{ paddingBottom: '5rem' }}>
                        {history.length > 0 ? (
                            <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                                {history.map((item, index) => (
                                    <motion.div key={index} variants={itemVariants}>
                                        <Card>
                                            <CardContent className="p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-card-foreground">{item.description}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(item.log_date.replace(' ', 'T')).toLocaleString()}</p>
                                                </div>
                                                <span className={`font-bold text-lg ${item.points >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {item.points >= 0 ? `+${item.points}` : item.points}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <EmptyState 
                                Icon={ClipboardDocumentListIcon}
                                title="No Points History Yet"
                                message="Start scanning products and redeeming rewards to see your activity here."
                                buttonLabel="Scan a Product"
                                buttonHref="/scan"
                            />
                        )}
                    </div>
                </div>
            </main>
        </PullToRefresh>
    );
}