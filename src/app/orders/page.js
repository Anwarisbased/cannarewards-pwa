'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { getMyOrders } from '@/services/rewardsService';
import EmptyState from '../../components/EmptyState';
import DynamicHeader from '../../components/DynamicHeader';
import ImageWithLoader from '../../components/ImageWithLoader';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- CORRECTED LIBRARY IMPORT ---
import PullToRefresh from 'react-simple-pull-to-refresh';
// --- END CORRECTED IMPORT ---

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };
const TABS = { ONGOING: 'Ongoing', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
const STATUS_MAP = { [TABS.ONGOING]: ['Processing'], [TABS.COMPLETED]: ['Completed'], [TABS.CANCELLED]: ['Cancelled', 'Failed', 'Refunded'] };

export default function OrdersPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(TABS.ONGOING);

    const fetchOrders = useCallback(async () => {
        try {
            const orderData = await getMyOrders();
            setAllOrders(orderData);
        } catch (err) { 
            console.error("Failed to fetch orders:", err); 
        }
    }, []);

    useEffect(() => {
        const statusesToShow = STATUS_MAP[activeTab];
        const filtered = allOrders.filter(order => statusesToShow.includes(order.status));
        setFilteredOrders(filtered);
    }, [activeTab, allOrders]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) { router.push('/'); return; }
        if (isAuthenticated) { setLoading(true); fetchOrders().finally(() => setLoading(false)); }
    }, [isAuthenticated, authLoading, router, fetchOrders]);

    const handleRefresh = async () => { 
        await fetchOrders(); 
    };

    if (authLoading || loading) { return <div className="text-center p-10 pt-20">Loading your orders...</div>; }

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <main className="bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <div className="sticky top-0 z-10 bg-white pt-4 px-4 border-b border-gray-200">
                        <DynamicHeader title="My Orders" backLink="/profile" />
                        <div className="flex justify-between items-center bg-gray-100 rounded-lg p-1 mb-4">
                            {Object.values(TABS).map(tabName => (
                                <button
                                    key={tabName}
                                    onClick={() => setActiveTab(tabName)}
                                    className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabName ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}
                                >{tabName}</button>
                            ))}
                        </div>
                    </div>
                    <div className="p-4" style={{ paddingBottom: '5rem' }}>
                        {filteredOrders.length > 0 ? (
                            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible" key={activeTab}>
                                {filteredOrders.map(order => (
                                    <motion.div key={order.orderId} variants={itemVariants}>
                                        <Card>
                                            <CardContent className="p-4 flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-20 h-20 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                                                    <ImageWithLoader src={order.imageUrl} alt={order.items} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold text-base text-card-foreground leading-tight">{order.items}</p>
                                                            <p className="text-sm text-muted-foreground">Order #{order.orderId}</p>
                                                        </div>
                                                        <Badge variant={order.status === 'Completed' ? 'default' : 'secondary'}>{order.status}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2">{order.date}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <EmptyState 
                                Icon={ShoppingCartIcon}
                                title={`No ${activeTab.toLowerCase()} orders`}
                                message="Your orders will appear here once their status changes."
                                buttonLabel="Browse Rewards"
                                buttonHref="/catalog"
                            />
                        )}
                    </div>
                </div>
            </main>
        </PullToRefresh>
    );
}