'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../components/AnimatedPage';

export default function HistoryPage() {
    const { isAuthenticated } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/point-history`)
                .then(response => {
                    setHistory(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch history:", error);
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
                        <h1 className="text-3xl font-bold">Point History</h1>
                    </div>

                    {loading ? <p>Loading history...</p> : (
                        history.length > 0 ? (
                            <div className="space-y-4">
                                {history.map((item, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{item.description}</p>
                                            <p className="text-sm text-gray-500">{new Date(item.log_date).toLocaleString()}</p>
                                        </div>
                                        <span className={`font-bold text-lg ${item.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.points > 0 ? `+${item.points}` : item.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <p className="text-gray-500">You haven't earned or spent any points yet.</p>
                            </div>
                        )
                    )}
                </div>
            </main>
        </AnimatedPage>
    );
}