'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MyPointsSkeleton from '../../components/MyPointsSkeleton';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import AnimatedCounter from '../../components/AnimatedCounter';
import PageContainer from '../../components/PageContainer';
import { triggerHapticFeedback } from '@/utils/haptics';
import { calculateRankProgress } from '@/utils/rankCalculations';
import { ChevronRightIcon, GiftIcon } from '@heroicons/react/24/solid';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

// --- CORRECTED LIBRARY IMPORT ---
import PullToRefresh from 'react-simple-pull-to-refresh';
// --- END CORRECTED IMPORT ---

export default function MyPointsPage() {
    const { user, login, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    
    const handleRefresh = async () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) { 
            await login(currentToken, true); 
        }
    };

    if (loading || !user) { return <MyPointsSkeleton />; }
    if (!isAuthenticated) { router.push('/'); return null; }
    
    const { nextRank, progressPercentage, pointsNeeded } = calculateRankProgress(user);

    return (
        <PullToRefresh onRefresh={handleRefresh}>
            <PageContainer>
                {/* --- Member Card --- */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold tracking-tight capitalize">
                            {user.firstName || 'Member'}
                        </CardTitle>
                        <CardDescription>{user.rank.name || 'Member'} Tier</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <span className="text-6xl font-bold text-primary">
                                <AnimatedCounter value={user.points} />
                            </span>
                            <p className="text-sm text-muted-foreground">Total Points</p>
                        </div>
                    </CardContent>
                </Card>
                
                {/* --- Next Rank Progress Card --- */}
                {nextRank ? (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Next Rank: {nextRank.name}</CardTitle>
                            <CardDescription>{pointsNeeded.toLocaleString()} points to go!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnimatedProgressBar progress={progressPercentage} barColor="bg-primary" />
                            {nextRank.benefits?.[0] && (
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    Next up: {nextRank.benefits[0]}
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Link href="/how-to-earn" className="text-sm font-medium text-primary hover:underline underline-offset-4 w-full text-center">
                                View all ranks and benefits
                            </Link>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="mb-6 p-4 text-center">
                        <p className="font-bold text-primary">🎉 You've reached the highest rank!</p>
                    </Card>
                )}

                {/* --- Referral Banner Card --- */}
                {user.settings?.referralBannerText && (
                    <Link href="/profile/refer" onClick={triggerHapticFeedback} className="block mb-6">
                        <Card className="bg-yellow-50 border-yellow-300 hover:bg-yellow-100 transition-colors">
                            <CardContent className="p-4 flex items-center justify-center">
                                <GiftIcon className="w-5 h-5 mr-3 text-yellow-600"/>
                                <p className="font-semibold text-yellow-800">
                                    {user.settings.referralBannerText}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                )}

                {/* --- Rewards For You Section --- */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Rewards For You</CardTitle>
                        <Link href="/catalog">
                            <Button variant="ghost" size="sm">
                                View All <ChevronRightIcon className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {user.eligibleRewards && user.eligibleRewards.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                                {user.eligibleRewards.slice(0, 3).map(reward => (
                                    <Link key={reward.id} href={`/catalog/${reward.id}`}>
                                        <div className="text-center space-y-2">
                                            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center p-2">
                                                <img src={reward.image} alt={reward.name} className="w-full h-full object-contain" />
                                            </div>
                                            <p className="text-xs font-semibold truncate text-foreground">{reward.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground text-sm px-4 py-8">
                                You have no eligible rewards yet. Keep scanning to earn points!
                            </p>
                        )}
                    </CardContent>
                </Card>

            </PageContainer>
        </PullToRefresh>
    );
}