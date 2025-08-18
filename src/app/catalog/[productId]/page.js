'use client';

import { useEffect, useState, Suspense } from 'react';
// --- CORRECTED PATHS ---
import { useAuth } from '../../../context/AuthContext';
import AnimatedPage from '../../../components/AnimatedPage';
import ShippingFormModal from '../../../components/ShippingFormModal';
// --- END CORRECTION ---
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

function ProductDetailProcessor() {
    const { user, login, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const productId = params.productId;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
        if (isAuthenticated && productId) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
                    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
                    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/wp-json/wc/v3/products/${productId}?consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
                    const response = await axios.get(apiUrl);
                    const pointsMeta = response.data.meta_data.find(meta => meta.key === 'points_cost');
                    setProduct({
                        id: response.data.id,
                        name: response.data.name,
                        images: response.data.images,
                        description: response.data.description.replace(/<[^>]*>?/gm, ''),
                        points_cost: pointsMeta ? parseInt(pointsMeta.value) : null
                    });
                    setError('');
                } catch (err) {
                    setError('Could not load product details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        } else if (!authLoading && !isAuthenticated) {
            router.push('/');
        }
    }, [productId, isAuthenticated, authLoading, router]);

    const handleInitialRedeem = () => {
        if (!user || user.points < product.points_cost) {
            toast.error("You don't have enough points!");
            return;
        }
        setShowShippingModal(true);
    };

    const handleFinalRedeem = async (shippingDetails) => {
        setIsRedeeming(true);
        setShowShippingModal(false);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/redeem`, { productId: product.id, shippingDetails });
            toast.success("Reward redeemed successfully!");
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) login(currentToken);
            router.push('/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Redemption failed.');
        } finally {
            setIsRedeeming(false);
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-screen bg-white text-center p-10">Loading Product...</div>;
    }
    if (error) {
        return <div className="min-h-screen bg-white text-center p-10">{error}</div>;
    }
    if (!product) {
        return <div className="min-h-screen bg-white text-center p-10">Product not found.</div>;
    }
    
    const imageUrl = product.images && product.images[0] ? product.images[0].src : 'https://via.placeholder.com/300';

    return (
        <AnimatedPage>
            {showShippingModal && <ShippingFormModal onCancel={() => setShowShippingModal(false)} onSubmit={handleFinalRedeem} />}
            <main className="p-4 bg-white min-h-screen text-gray-800">
                <div className="w-full max-w-md mx-auto">
                     <header className="flex items-center mb-4 h-16">
                        <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full">
                            <ChevronLeftIcon className="h-7 w-7" />
                        </button>
                    </header>
                    <div className="px-4">
                        <div className="bg-gray-100 rounded-lg mb-6">
                            <img src={imageUrl} alt={product.name} className="w-full aspect-square object-contain" />
                        </div>
                        <p className="text-xl md:text-2xl font-semibold mb-4">{product.name}</p>
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-3xl font-mono font-bold tracking-tighter text-primary">
                                {product.points_cost.toFixed(0)} <span className="text-base font-sans font-normal text-gray-700">Points</span>
                            </p>
                            <button onClick={handleInitialRedeem} disabled={isRedeeming} className="bg-primary text-white font-semibold py-3 px-8 rounded-md transform hover:opacity-90 transition-opacity disabled:bg-gray-400">
                                {isRedeeming ? "Processing..." : "Add To Cart"}
                            </button>
                        </div>
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="font-semibold mb-2 text-sm uppercase tracking-wider text-gray-600">Description</h2>
                            <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>
            </main>
        </AnimatedPage>
    );
}

export default function ProductDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white text-center p-10">Initializing...</div>}>
            <ProductDetailProcessor />
        </Suspense>
    );
}