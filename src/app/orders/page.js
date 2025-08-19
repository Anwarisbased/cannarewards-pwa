'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/axiosConfig';
import AnimatedPage from '../../components/AnimatedPage';
import EmptyState from '../../components/EmptyState';
import DynamicHeader from '../../components/DynamicHeader';
import ImageWithLoader from '../../components/ImageWithLoader';
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
    const [activeTab, setActiveTab] = useState(TABS.ONGOING);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/my-orders`);
            setAllOrders(response.data);
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
                {/* 1. Use a standard main tag here, not the one inside the scrollable area */}
                <main className="bg-white min-h-screen">
                    <div className="w-full max-w-md mx-auto">
                        {/* --- 2. STICKY HEADER WRAPPER --- */}
                        <div className="sticky top-0 z-10 bg-white pt-4 px-4 border-b border-gray-200">
                            <DynamicHeader title="My Orders" />
                            <div className="flex justify-between items-center bg-gray-100 rounded-lg p-1 mb-4">
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
                        </div>

                        {/* --- 3. SCROLLABLE CONTENT AREA --- */}
                        <div className="p-4">
                            {filteredOrders.length > 0 ? (
                                <motion.div 
                                    className="space-y-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    key={activeTab} 
                                >
                                    {filteredOrders.map(order => (
                                        <motion.div 
                                            key={order.orderId} 
                                            className="bg-white p-4 rounded-lg shadow border border-gray-100"
                                            variants={itemVariants}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                    <ImageWithLoader
                                                        src={order.imageUrl}
                                                        alt={order.items}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold text-base text-gray-800">{order.items}</p>
                                                            <p className="text-sm text-gray-500">Order #{order.orderId}</p>
                                                        </div>
                                                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1">{order.status}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                                                </div>
                                            </div>
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
                    </div>
                </main>
            </PullToRefresh>
        </AnimatedPage>
    );
}