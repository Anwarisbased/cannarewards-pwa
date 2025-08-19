'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../components/AnimatedPage';
import EmptyState from '../../components/EmptyState';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion'; // 1. Ensure motion is imported
import PullToRefresh from 'react-pull-to-refresh';

// 2. Define animation variants (can be copied from HistoryPage)
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


export default function OrdersPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/my-orders`);
            setOrders(response.data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        }
    }, []);

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
                <main className="p-4 bg-gray-100 min-h-screen">
                    <div className="w-full max-w-md mx-auto">
                        <header className="flex items-center mb-6">
                            <Link href="/profile" className="p-2 -ml-2 hover:bg-gray-200 rounded-full"><ChevronLeftIcon className="h-6 w-6" /></Link>
                            <h1 className="text-3xl font-bold ml-2">My Orders</h1>
                        </header>

                        {orders.length > 0 ? (
                             <motion.div 
                                className="space-y-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                             >
                                {orders.map(order => (
                                    <motion.div 
                                        key={order.orderId} 
                                        className="bg-white p-4 rounded-lg shadow"
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
                                title="No Orders Yet"
                                message="Redeem a reward from the catalog to see your order history here."
                            />
                        )}
                    </div>
                </main>
            </PullToRefresh>
        </AnimatedPage>
    );
}