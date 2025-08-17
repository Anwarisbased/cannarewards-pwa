// src/app/catalog/[productId]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AnimatedPage from '../../../components/AnimatedPage';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import ShippingFormModal from '../../../components/ShippingFormModal';

export default function ProductDetailPage({ params }) {
    const { user, login, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const { productId } = params;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/');
            return;
        }
        if (isAuthenticated && productId) {
            const fetchProduct = async () => {
                try {
                    const consumerKey = 'process.env.NEXT_PUBLIC_WC_CONSUMER_KEY';
                    const consumerSecret = 'process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET';
                    const apiUrl = `process.env.NEXT_PUBLIC_API_URL/wp-json/wc/v3/products/${productId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
                    const response = await axios.get(apiUrl);
                    
                    const pointsMeta = response.data.meta_data.find(meta => meta.key === 'points_cost');
                    setProduct({
                        id: response.data.id,
                        name: response.data.name,
                        images: response.data.images,
                        description: response.data.description.replace(/<[^>]*>?/gm, ''),
                        points_cost: pointsMeta ? parseInt(pointsMeta.value) : null
                    });
                } catch (err) {
                    setError('Could not load product details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [productId, isAuthenticated, authLoading, router]);

    const handleInitialRedeem = () => {
        if (!user || user.points < product.points_cost) {
            alert("You don't have enough points for this reward!");
            return;
        }
        setShowShippingModal(true);
    };

    const handleFinalRedeem = async (shippingDetails) => {
        setShowShippingModal(false);
        setIsRedeeming(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/redeem`, { productId: product.id, shippingDetails });
            alert(response.data.message);
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) login(currentToken);
            router.push('/orders');
        } catch (err) {
            alert(err.response?.data?.message || 'Redemption failed.');
        } finally {
            setIsRedeeming(false);
        }
    };

    if (authLoading || loading) return <div className="min-h-screen bg-white text-center p-10">Loading...</div>;
    if (error) return <div className="min-h-screen bg-white text-center p-10">{error}</div>;
    if (!product) return <div className="min-h-screen bg-white text-center p-10">Product not found.</div>;

    const imageUrl = product.images && product.images[0] ? product.images[0].src : 'https://via.placeholder.com/400';

    return (
        <AnimatedPage>
            {showShippingModal && <ShippingFormModal onCancel={() => setShowShippingModal(false)} onSubmit={handleFinalRedeem} />}
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    {/* Header to match the screenshot style */}
                    <header className="flex items-center mb-4 h-16">
                        <button onClick={() => router.back()} className="p-2 -ml-2">
                            <ChevronLeftIcon className="h-7 w-7 text-black" />
                        </button>
                    </header>

                    <div className="px-4">
                        <img src={imageUrl} alt={product.name} className="w-full mb-6" />
                        
                        <p className="text-lg mb-4">{product.name}</p>
                        
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-3xl font-mono font-bold tracking-tighter">
                                {product.points_cost.toFixed(2)} <span className="text-base font-sans font-normal">Points</span>
                            </p>
                            <button 
                                onClick={handleInitialRedeem}
                                disabled={isRedeeming}
                                className="bg-black text-white font-semibold py-3 px-8 rounded-md"
                            >
                                {isRedeeming ? "Processing..." : "Add To Cart"}
                            </button>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="font-semibold mb-2 text-sm uppercase tracking-wider">Description</h2>
                            <p className="text-gray-600 text-base leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>
            </main>
        </AnimatedPage>
    );
}