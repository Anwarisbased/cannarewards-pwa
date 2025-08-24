'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // CORRECTED PATH
import { useModal } from '@/context/ModalContext'; // CORRECTED PATH
import { getProductById } from '@/services/woocommerceService';
import { redeemReward } from '@/services/rewardsService';
import ProductDetailSkeleton from '@/components/ProductDetailSkeleton'; // CORRECTED PATH
import ImageWithLoader from '@/components/ImageWithLoader'; // CORRECTED PATH
import DynamicHeader from '@/components/DynamicHeader'; // CORRECTED PATH
import ShippingFormModal from '@/components/ShippingFormModal'; // CORRECTED PATH
import SuccessModal from '@/components/SuccessModal'; // CORRECTED PATH
import { showToast } from '@/components/CustomToast'; // CORRECTED PATH
import { triggerHapticFeedback } from '@/utils/haptics'; // CORRECTED PATH

// --- SHADCN IMPORTS ---
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
// --- END IMPORTS ---


export default function ProductDetailPage() {
    const { user, loading: authLoading, updateUserPoints, login } = useAuth();
    const { triggerConfetti } = useModal();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { productId } = params;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFirstScan, setIsFirstScan] = useState(false);
    const [showShippingModal, setShowShippingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [redeemError, setRedeemError] = useState('');
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
        setIsFirstScan(searchParams.get('first_scan') === 'true');
    }, [searchParams]);

    useEffect(() => {
        if (isFirstScan) {
            triggerConfetti();
        }
    }, [isFirstScan, triggerConfetti]);

    useEffect(() => {
        if (productId) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    const productData = await getProductById(productId);
                    const pointsMeta = productData.meta_data.find(meta => meta.key === 'points_cost');
                    const formattedProduct = {
                        id: productData.id,
                        name: productData.name,
                        images: productData.images,
                        description: productData.description,
                        points_cost: pointsMeta ? parseInt(pointsMeta.value, 10) : null,
                    };
                    setProduct(formattedProduct);
                } catch (error) {
                    console.error("Failed to fetch product:", error);
                    setRedeemError("Could not load product details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [productId]);

    const handleRedeem = () => {
        triggerHapticFeedback();
        if (user.points >= product.points_cost) {
            setShowShippingModal(true);
        }
    };

    const handleShippingSubmit = async (shippingDetails) => {
        setIsRedeeming(true);
        setShowShippingModal(false);
        try {
            const result = await redeemReward(product.id, shippingDetails);
            updateUserPoints(result.newBalance);
            setShowSuccessModal(true);
            
            // Also refresh full user data in background after a successful redemption
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) {
                login(currentToken, true); // silent login
            }

        } catch (error) {
            showToast('error', 'Redemption Failed', error.message);
        } finally {
            setIsRedeeming(false);
        }
    };

    if (authLoading || loading) {
        return <ProductDetailSkeleton />;
    }

    if (!product) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">Product Not Found</h1>
                <p>{redeemError || "The reward you are looking for does not exist or is no longer available."}</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }
    
    const canAfford = user && product.points_cost && user.points >= product.points_cost;
    const pointsNeeded = product.points_cost ? product.points_cost - user.points : 0;
    const imageUrl = product.images?.[0]?.src || 'https://via.placeholder.com/300';

    return (
        <>
            <main className="bg-white">
                <div className="w-full max-w-md mx-auto">
                    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
                        <DynamicHeader title="" backLink="/catalog" />
                    </div>
                    
                    <div className="p-4">
                        <Card className="mb-6 overflow-hidden border-none shadow-none">
                            <CardContent className="p-0">
                                <AspectRatio ratio={1 / 1}>
                                    <ImageWithLoader src={imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                </AspectRatio>
                            </CardContent>
                        </Card>

                        {isFirstScan && (
                            <div className="text-center mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                                <h2 className="text-xl font-bold text-yellow-800">Congratulations!</h2>
                                <p className="text-yellow-700">You've unlocked this reward with your first scan!</p>
                            </div>
                        )}
                        
                        <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                        <p className="text-2xl font-semibold text-primary mb-6">{product.points_cost.toLocaleString()} Points</p>

                        <Button 
                            onClick={handleRedeem} 
                            disabled={!canAfford || isRedeeming}
                            size="lg"
                            className="w-full h-14 text-lg"
                        >
                            {isRedeeming ? 'Processing...' : (
                                isFirstScan ? 'Claim Your Welcome Gift!' : (
                                    canAfford ? `Redeem for ${product.points_cost.toLocaleString()} Points` : `Earn ${pointsNeeded.toLocaleString()} more points`
                                )
                            )}
                        </Button>
                        
                        <Separator className="my-8" />

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-foreground">Description</h2>
                            <div 
                                className="prose prose-sm max-w-none text-muted-foreground" 
                                dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available for this reward.</p>" }} 
                            />
                        </div>
                    </div>
                </div>
            </main>
            
            {showShippingModal && (
                <ShippingFormModal 
                    onSubmit={handleShippingSubmit}
                    onCancel={() => setShowShippingModal(false)}
                    currentUser={user}
                />
            )}
            
            {showSuccessModal && (
                <SuccessModal
                    title="Redemption Successful!"
                    message="Your reward is on its way. You can view the order details in your profile."
                    buttonLabel="View My Orders"
                    onButtonClick={() => {
                        setShowSuccessModal(false);
                        router.push('/orders');
                    }}
                />
            )}
        </>
    );
}