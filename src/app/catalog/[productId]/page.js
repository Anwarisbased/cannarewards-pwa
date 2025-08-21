'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useModal } from '../../../context/ModalContext';
import AnimatedPage from '../../../components/AnimatedPage';
import ShippingFormModal from '../../../components/ShippingFormModal';
import ProductDetailSkeleton from '../../../components/ProductDetailSkeleton';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getProductById } from '@/services/woocommerceService';
import { redeemReward } from '@/services/rewardsService';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { showToast } from '../../../components/CustomToast';

export default function ProductDetailPage() {
    const { user, login, isAuthenticated, loading: authLoading } = useAuth();
    const { triggerConfetti } = useModal();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();

    const productId = params ? params.productId : null;
    const isFirstScan = searchParams.get('first_scan') === 'true';

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
        if (isFirstScan) {
            triggerConfetti();
        }
    }, [isFirstScan, triggerConfetti]);

    useEffect(() => {
        if (isAuthenticated && productId) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const responseData = await getProductById(productId);
                    const pointsMeta = responseData.meta_data.find(meta => meta.key === 'points_cost');
                    setProduct({ 
                        id: responseData.id, 
                        name: responseData.name, 
                        images: responseData.images, 
                        description: responseData.description.replace(/<[^>]*>?/gm, ''), 
                        points_cost: pointsMeta ? parseInt(pointsMeta.value) : null 
                    });
                    setError('');
                } catch (err) { 
                    setError(err.message || 'Could not load product details.'); 
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
            showToast('error', 'Not Enough Points', "You don't have enough points to redeem this reward!");
            return; 
        }
        setShowShippingModal(true);
    };

    const handleFinalRedeem = async (shippingDetails) => {
        setIsRedeeming(true);
        setShowShippingModal(false);
        try {
            await redeemReward(product.id, shippingDetails);
            showToast('success', 'Success!', 'Your reward has been redeemed.');
            
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) login(currentToken, true); // Use silent login to refresh user data
            
            router.push('/orders');
        } catch (err) { 
            showToast('error', 'Redemption Failed', err.message || 'An unknown error occurred.');
        } finally { 
            setIsRedeeming(false); 
        }
    };

    if (authLoading || loading || !productId) {
        return (
            <div className="pt-20">
                <ProductDetailSkeleton />
            </div>
        );
    }
    if (error) { return <div className="min-h-screen bg-white text-center p-10 pt-20">{error}</div>; }
    if (!product) { return <div className="min-h-screen bg-white text-center p-10 pt-20">Product not found.</div>; }
    
    const imageUrl = product.images && product.images[0] ? product.images[0].src : 'https://via.placeholder.com/300';
    const userPoints = user ? user.points : 0;
    const canRedeem = userPoints >= product.points_cost;
    const pointsNeeded = product.points_cost - userPoints;
    
    let buttonText;
    if (isFirstScan) {
        buttonText = isRedeeming ? 'Claiming...' : 'Claim Your Welcome Gift!';
    } else {
        buttonText = isRedeeming ? 'Processing...' : (canRedeem ? `Redeem` : `Earn ${pointsNeeded} more points`);
    }

    const buttonDisabled = isRedeeming || !canRedeem;
    const buttonClassName = `text-white font-semibold py-3 px-6 rounded-md transition-all w-auto text-center text-sm ${canRedeem && !isRedeeming ? 'bg-primary transform hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'}`;

    return (
        <AnimatedPage>
            {showShippingModal && (
                <ShippingFormModal 
                    onCancel={() => setShowShippingModal(false)} 
                    onSubmit={handleFinalRedeem}
                    currentUser={user} 
                />
            )}
            <main className="p-4 bg-white min-h-screen" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
                <div className="w-full max-w-md mx-auto">
                     <header className="flex items-center mb-4 h-16"><button onClick={() => router.back()} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"><ChevronLeftIcon className="h-7 w-7" /></button></header>
                    <div className="px-4">
                        <div className="bg-gray-100 rounded-lg mb-6"><img src={imageUrl} alt={product.name} className="w-full aspect-square object-contain" /></div>
                        
                        {isFirstScan && (
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-primary">Congratulations!</h2>
                                <p className="text-gray-600">Here is your welcome reward, on us.</p>
                            </div>
                        )}

                        <p className="text-xl md:text-2xl font-semibold mb-4">{product.name}</p>
                        <div className="flex justify-between items-center mb-8 gap-4">
                            <p className="text-3xl font-mono font-bold tracking-tighter text-primary">{product.points_cost.toFixed(0)} <span className="text-base font-sans font-normal text-gray-700 ml-1">Points</span></p>
                            <button onClick={handleInitialRedeem} disabled={buttonDisabled} className={buttonClassName}>{buttonText}</button>
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