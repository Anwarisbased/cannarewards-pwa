'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AnimatedPage from '../../../components/AnimatedPage';
import ShippingFormModal from '../../../components/ShippingFormModal';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

// We are removing Suspense entirely and just exporting one component.
export default function ProductDetailPage() {
    const { user, login, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const productId = params ? params.productId : null; // Safely access productId

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
        // Wait until we have a productId to fetch
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
        // This check is still good as a safeguard
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

    if (authLoading || loading || !productId) {
        return <div className="min-h-screen bg-white text-center p-10">Loading Product...</div>;
    }
    if (error) {
        return <div className="min-h-screen bg-white text-center p-10">{error}</div>;
    }
    if (!product) {
        return <div className="min-h-screen bg-white text-center p-10">Product not found.</div>;
    }
    
    const imageUrl = product.images && product.images[0] ? product.images[0].src : 'https://via.placeholder.com/300';

    // --- 1. NEW LOGIC FOR THE BUTTON ---
    const userPoints = user ? user.points : 0;
    const canRedeem = userPoints >= product.points_cost;
    const pointsNeeded = product.points_cost - userPoints;

    let buttonText = '';
    if (isRedeeming) {
        buttonText = 'Processing...';
    } else if (canRedeem) {
        buttonText = `Redeem for ${product.points_cost} Points`;
    } else {
        buttonText = `Earn ${pointsNeeded} more points`;
    }

    const buttonDisabled = isRedeeming || !canRedeem;
    const buttonClassName = `text-white font-semibold py-3 px-8 rounded-md transition-all w-full sm:w-auto text-center ${
        canRedeem && !isRedeeming 
        ? 'bg-primary transform hover:opacity-90' 
        : 'bg-gray-300 cursor-not-allowed'
    }`;
    // --- END OF NEW LOGIC ---

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
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                            <p className="text-3xl font-mono font-bold tracking-tighter text-primary">
                                {product.points_cost.toFixed(0)} <span className="text-base font-sans font-normal text-gray-700">Points</span>
                            </p>
                            {/* --- 2. APPLY THE NEW VARIABLES TO THE BUTTON --- */}
                            <button 
                                onClick={handleInitialRedeem} 
                                disabled={buttonDisabled} 
                                className={buttonClassName}
                            >
                                {buttonText}
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