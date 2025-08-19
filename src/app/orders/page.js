'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/axiosConfig';
import AnimatedPage from '../../components/AnimatedPage';
import EmptyState from '../../components/EmptyState';
import DynamicHeader from '../../components/DynamicHeader';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import PullToRefresh from 'react-pull-to-refresh';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
        type: 'spring',
        stiffness: 100
    }
  }
};

// --- 1. DEFINE OUR TABS AND STATUS MAPPING ---
const TABS = {
    ONGOING: 'Ongoing',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
};

const STATUS_MAP = {
    [TABS.ONGOING]: ['Processing'],
    [TABS.COMPLETED]: ['Completed'],
    [TABS.CANCELLED]: ['Cancelled', 'Failed', 'Refunded'],
};


export default function OrdersPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(TABS.ONGOING); // 2. Add state for active tab

    const fetchOrders = useCallback(async () => {
        try {
            const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/my-orders`);
            setAllOrders(response.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    }, []);

    // 3. New effect to filter orders whenever the activeTab or allOrders change
    useEffect(() => {
        const statusesToShow = STATUS_MAP[activeTab];
        const filtered = allOrders.filter(order => statusesToShow.includes(order.status));
        setFilteredOrders(filtered);
    }, [activeTab, allOrders]);


    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }
        if (isAuthenticated) {
            setLoading(true);
            fetchOrders().finally(() => setLoading(false));
        }
    }, [isAuthenticated, authLoading, router, fetchOrders]);

    const handleRefresh = async () => {
        await fetchOrders();
        return Promise.resolve();
    };

    if (authLoading || loading) {
        return <div className="text-center p-10">Loading your orders...</div>;
    }

    return (
        <AnimatedPage>
            <PullToRefresh onRefresh={handleRefresh}>
                <main className="p-4 bg-white min-h-screen">
                    <div className="w-full max-w-md mx-auto">
                        <DynamicHeader title="My Orders" />

                        {/* --- 4. TABS UI --- */}
                        <div className="flex justify-between items-center bg-gray-100 rounded-lg p-1 mb-6">
                            {Object.values(TABS).map(tabName => (
                                <button
                                    key={tabName}
                                    onClick={() => setActiveTab(tabName)}
                                    className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${
                                        activeTab === tabName
                                            ? 'bg-white text-gray-800 shadow'
                                            : 'bg-transparent text-gray-500 hover:bg-gray-200'
                                    }`}
                                >
                                    {tabName}
                                </button>
                            ))}
                        </div>

                        {/* --- 5. RENDER FILTERED ORDERS --- */}
                        {filteredOrders.length > 0 ? (
                             <motion.div 
                                className="space-y-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                // Add a key to force re-animation when the tab changes
                                key={activeTab} 
                             >
                                {filteredOrders.map(order => (
                                    <motion.div 
                                        key={order.orderId} 
                                        className="bg-white p-4 rounded-lg shadow border border-gray-100"
                                        variants={itemVariants}
                                    >
                                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                                            <div>
                                                <p className="font-bold text-lg text-gray-800">Order #{order.orderId}</p>
                                                <p className="text-sm text-gray-600">{order.date}</p>
                                            </div>
                                            <span className="text-sm font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">{order.status}</span>
                                        </div>
                                        <p className="mt-2 font-semibold text-gray-700">{order.items}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                             <EmptyState 
                                Icon={ShoppingCartIcon}
                                title={`No ${activeTab.toLowerCase()} orders`}
                                message="Your orders will appear here once their status changes."
                            />
                        )}
                    </div>
                </main>
            </PullToRefresh>
        </AnimatedPage>
    );
}