'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../components/AnimatedPage';

export default function OrdersPage() {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/my-orders`)
                .then(response => {
                    setOrders(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch orders:", error);
                    setLoading(false);
                });
        }
    }, [isAuthenticated]);

    return (
        <AnimatedPage>
            <main className="p-4 bg-gray-100 min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <div className="flex items-center mb-6">
                        <Link href="/" className="text-2xl mr-4 p-2">←</Link>
                        <h1 className="text-3xl font-bold">My Orders</h1>
                    </div>

                    {loading ? <p>Loading orders...</p> : (
                        orders.length > 0 ? (
                             <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.orderId} className="bg-white p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold">Order #{order.orderId}</p>
                                            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{order.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{order.date}</p>
                                        <p className="mt-2 font-semibold">{order.items}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-10 bg-white rounded-lg shadow">
                                <p className="text-gray-500">You haven't redeemed any rewards yet.</p>
                            </div>
                        )
                    )}
                </div>
            </main>
        </AnimatedPage>
    );
}