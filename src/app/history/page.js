'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getPointHistoryV2 } from '@/services/rewardsService';
import EmptyState from '@/components/EmptyState';
import DynamicHeader from '@/components/DynamicHeader';
import StaggeredList from '@/components/StaggeredList';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Skeleton } from '@/components/ui/skeleton';

const HistorySkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
  </div>
);

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) return; // Don't fetch if not authenticated
    setLoading(true);
    try {
      const historyData = await getPointHistoryV2();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      return;
    }
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated, authLoading, router, fetchHistory]);

  const handleRefresh = async () => {
    await fetchHistory();
  };

  const renderContent = () => {
    if (loading || authLoading) {
      return <HistorySkeleton />;
    }
    if (history.length > 0) {
      return (
        <StaggeredList className="space-y-3">
          {history.map((item, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-card-foreground">
                    {item.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.log_date.replace(' ', 'T')).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-lg font-bold ${item.points >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {item.points >= 0 ? `+${item.points}` : item.points}
                </span>
              </CardContent>
            </Card>
          ))}
        </StaggeredList>
      );
    }
    return (
      <EmptyState
        Icon={ClipboardDocumentListIcon}
        title="No Points History Yet"
        message="Start scanning products to see your point activity appear here."
        buttonLabel="Make Your First Scan"
        buttonHref="/scan"
      />
    );
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 pt-4">
            <DynamicHeader title="Point History" backLink="/profile" />
          </div>
          <div className="p-4" style={{ paddingBottom: '5rem' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </PullToRefresh>
  );
}
