'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getMyOrdersV2 } from '@/services/rewardsService';
import EmptyState from '@/components/EmptyState';
import DynamicHeader from '@/components/DynamicHeader';
import ImageWithLoader from '@/components/ImageWithLoader';
import StaggeredList from '@/components/StaggeredList';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Skeleton } from '@/components/ui/skeleton';

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

const OrderSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-24 w-full rounded-lg" />
    <Skeleton className="h-24 w-full rounded-lg" />
    <Skeleton className="h-24 w-full rounded-lg" />
  </div>
);

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS.ONGOING);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const orderData = await getMyOrdersV2();
      setAllOrders(orderData);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const statusesToShow = STATUS_MAP[activeTab];
    const filtered = allOrders.filter((order) =>
      statusesToShow.includes(order.status)
    );
    setFilteredOrders(filtered);
  }, [activeTab, allOrders]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      return;
    }
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, router, fetchOrders]);

  const handleRefresh = async () => {
    await fetchOrders();
  };

  const renderContent = () => {
    if (loading || authLoading) {
      return <OrderSkeleton />;
    }
    if (filteredOrders.length > 0) {
      return (
        <StaggeredList className="space-y-4" key={activeTab}>
          {filteredOrders.map((order) => (
            <Card key={order.orderId}>
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  <ImageWithLoader
                    src={order.imageUrl}
                    alt={order.items}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-base font-bold leading-tight text-card-foreground">
                        {order.items}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.orderId}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === 'Completed' ? 'default' : 'secondary'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {order.date}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </StaggeredList>
      );
    }
    return (
      <EmptyState
        Icon={ShoppingCartIcon}
        title={`No ${activeTab.toLowerCase()} orders`}
        message="Your redeemed rewards will appear here after you claim them from the catalog."
        buttonLabel="Redeem Your First Reward"
        buttonHref="/catalog"
      />
    );
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 pt-4">
            <DynamicHeader title="My Orders" backLink="/profile" />
            <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-100 p-1">
              {Object.values(TABS).map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setActiveTab(tabName)}
                  className={`w-full rounded-md py-2 text-sm font-semibold transition-colors ${activeTab === tabName ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-gray-500 hover:bg-gray-200'}`}
                >
                  {tabName}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4" style={{ paddingBottom: '5rem' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}
