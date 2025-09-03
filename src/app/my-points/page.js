'use client';

import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MyPointsSkeleton from '@/components/MyPointsSkeleton';
import AnimatedProgressBar from '@/components/AnimatedProgressBar';
import AnimatedCounter from '@/components/AnimatedCounter';
import PageContainer from '@/components/PageContainer';
import { calculateRankProgress } from '@/utils/rankCalculations';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useEffect, useState } from 'react';
import { getDashboardData } from '@/services/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyPointsPage() {
  // Get data from our global contexts
  const { user, login, isAuthenticated, loading: authLoading } = useAuth();
  const { allRanks, settings, loading: configLoading } = useConfig();
  const router = useRouter();

  // State for data specific to this page, fetched on demand
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // State for rewards which will be loaded separately in a later slice
  const [rewards, setRewards] = useState([]);
  const [rewardsLoading, setRewardsLoading] = useState(true);

  // Fetch dashboard data (like lifetime_points) when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setDashboardLoading(true);
      getDashboardData()
        .then((data) => setDashboardData(data))
        .catch((err) => console.error('Failed to fetch dashboard data:', err))
        .finally(() => setDashboardLoading(false));
    }
  }, [isAuthenticated]);

  // Placeholder for fetching rewards data
  useEffect(() => {
    if (user) {
      setRewardsLoading(true);
      // In a future slice, we'll replace this with a real API call
      setTimeout(() => {
        setRewardsLoading(false);
      }, 1500);
    }
  }, [user]);

  const handleRefresh = async () => {
    // Create promises for all the data we need to refresh
    const sessionPromise = login(localStorage.getItem('authToken'), true);
    const dashboardPromise = getDashboardData();

    // Wait for all refreshes to complete
    const [, dashboardResult] = await Promise.all([
      sessionPromise,
      dashboardPromise,
    ]);

    setDashboardData(dashboardResult);
  };

  // Show skeleton if any of the essential data is loading
  if (authLoading || configLoading || dashboardLoading || !user) {
    return <MyPointsSkeleton />;
  }
  // Redirect if user is not logged in
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  // Assemble the complete user object needed for our calculation utility
  const fullUserForCalc = {
    ...user,
    allRanks,
    lifetimePoints: dashboardData?.lifetime_points ?? 0,
  };
  const { nextRank, progressPercentage, pointsNeeded } =
    calculateRankProgress(fullUserForCalc);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageContainer>
        {/* --- Member Card --- */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold capitalize tracking-tight">
              {user.firstName || 'Member'}
            </CardTitle>
            <CardDescription>
              {user.rank.name} {settings.brand_personality?.rank_name || 'Tier'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-6xl font-bold text-primary">
                <AnimatedCounter value={user.points_balance} />
              </span>
              <p className="text-sm text-muted-foreground">
                {settings.brand_personality?.points_name || 'Points'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* --- Next Rank Progress Card --- */}
        {nextRank ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Next {settings.brand_personality?.rank_name || 'Rank'}:{' '}
                {nextRank.name}
              </CardTitle>
              <CardDescription>
                {pointsNeeded.toLocaleString()}{' '}
                {settings.brand_personality?.points_name || 'Points'} to go!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatedProgressBar
                progress={progressPercentage}
                barColor="bg-primary"
              />
              {nextRank.benefits?.[0] && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Next up: {nextRank.benefits[0]}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Link
                href="/how-to-earn"
                className="w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                View all ranks and benefits
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="mb-6 p-4 text-center">
            <p className="font-bold text-primary">
              🎉 You've reached the highest rank!
            </p>
          </Card>
        )}

        {/* --- Rewards For You Section (Placeholder) --- */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Rewards For You</CardTitle>
            <Link href="/catalog">
              <Button variant="ghost" size="sm">
                View All <ChevronRightIcon className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {rewardsLoading ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 text-center">
                  <Skeleton className="aspect-square rounded-lg bg-gray-100" />
                  <Skeleton className="mx-auto h-4 w-20" />
                </div>
                <div className="space-y-2 text-center">
                  <Skeleton className="aspect-square rounded-lg bg-gray-100" />
                  <Skeleton className="mx-auto h-4 w-20" />
                </div>
                <div className="space-y-2 text-center">
                  <Skeleton className="aspect-square rounded-lg bg-gray-100" />
                  <Skeleton className="mx-auto h-4 w-20" />
                </div>
              </div>
            ) : rewards.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {/* This will be populated once we fetch rewards */}
              </div>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                You have no eligible rewards yet. Keep scanning to earn points!
              </p>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </PullToRefresh>
  );
}
