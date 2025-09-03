'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { getProductById } from '@/services/woocommerceService';
import { redeemRewardV2 } from '@/services/rewardsService';
import ProductDetailSkeleton from '@/components/ProductDetailSkeleton';
import ImageWithLoader from '@/components/ImageWithLoader';
import DynamicHeader from '@/components/DynamicHeader';
import ShippingFormModal from '@/components/ShippingFormModal';
import SuccessModal from '@/components/SuccessModal';
import { showToast } from '@/components/CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';

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
          const pointsMeta = productData.meta_data.find(
            (meta) => meta.key === 'points_cost'
          );
          const formattedProduct = {
            id: productData.id,
            name: productData.name,
            images: productData.images,
            description: productData.description,
            points_cost: pointsMeta ? parseInt(pointsMeta.value, 10) : null,
          };
          setProduct(formattedProduct);
        } catch (error) {
          showToast('error', 'Error', 'Could not load product details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleRedeem = () => {
    triggerHapticFeedback();
    if (user && user.points_balance >= product.points_cost) {
      setShowShippingModal(true);
    }
  };

  const handleShippingSubmit = async (shippingDetails) => {
    setIsRedeeming(true);
    setShowShippingModal(false);
    try {
      const result = await redeemRewardV2(product.id, shippingDetails);

      // Optimistically update the UI and refresh the full session in the background
      updateUserPoints(result.new_points_balance);
      login(localStorage.getItem('authToken'), true);

      setShowSuccessModal(true);
    } catch (error) {
      showToast('error', 'Redemption Failed', error.message);
    } finally {
      setIsRedeeming(false);
    }
  };

  if (authLoading || loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product || !product.points_cost) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Reward Not Found</h1>
        <p>This item is not available for redemption.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const canAfford =
    user && product.points_cost && user.points_balance >= product.points_cost;
  const pointsNeeded = product.points_cost
    ? product.points_cost - (user?.points_balance || 0)
    : 0;
  const imageUrl =
    product.images?.[0]?.src || 'https://via.placeholder.com/300';

  return (
    <>
      <main className="bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
            <DynamicHeader title="" backLink="/catalog" />
          </div>

          <div className="p-4">
            <Card className="mb-6 overflow-hidden border-none shadow-none">
              <CardContent className="p-0">
                <AspectRatio ratio={1 / 1}>
                  <ImageWithLoader
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </AspectRatio>
              </CardContent>
            </Card>

            {isFirstScan && (
              <div className="mb-4 border-l-4 border-yellow-400 bg-yellow-50 p-4 text-center">
                <h2 className="text-xl font-bold text-yellow-800">
                  Congratulations!
                </h2>
                <p className="text-yellow-700">
                  You've unlocked this reward with your first scan!
                </p>
              </div>
            )}

            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {product.name}
            </h1>
            <p className="mb-6 text-2xl font-semibold text-primary">
              {product.points_cost.toLocaleString()} Points
            </p>

            <Button
              onClick={handleRedeem}
              disabled={!canAfford || isRedeeming}
              size="lg"
              className="h-14 w-full text-lg"
            >
              {isRedeeming
                ? 'Processing...'
                : isFirstScan
                  ? 'Claim Your Welcome Gift!'
                  : canAfford
                    ? `Redeem for ${product.points_cost.toLocaleString()} Points`
                    : `Earn ${pointsNeeded.toLocaleString()} more points`}
            </Button>

            <Separator className="my-8" />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Description
              </h2>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description || '<p>No description available.</p>',
                }}
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
