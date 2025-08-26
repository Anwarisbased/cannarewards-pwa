'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import MyPointsSkeleton from '../../components/MyPointsSkeleton';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import AnimatedCounter from '../../components/AnimatedCounter';
import PageContainer from '../../components/PageContainer';
import { calculateRankProgress } from '@/utils/rankCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import PullToRefresh from 'react-simple-pull-to-refresh';
import NextBestRewardCard from '@/components/NextBestRewardCard';
import WishlistProgressCard from '@/components/WishlistProgressCard';
import ActiveQuestsCard from '@/components/ActiveQuestsCard';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext'; // Import useTheme
import { mediumImpact } from '@/utils/haptics'; // Import mediumImpact

export default function MyPointsPage() {
    const { user, login, isAuthenticated, loading } = useAuth();
    const { pointsName, rankName } = useTheme(); // Use theme context
    const router = useRouter();
    
    const handleRefresh = async () => {
        mediumImpact(); // Add haptic feedback
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
                <div className="space-y-6">
                    {/* --- Member Card --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tight capitalize">
                                {user.firstName || 'Member'}
                            </CardTitle>
                            <CardDescription>{user?.rank?.name || 'Member'} {rankName} Tier</CardDescription> {/* Use rankName */}
                        </CardHeader>
                        <CardContent>
                            <div className="text-center">
                                <span className="text-6xl font-bold text-primary">
                                    <AnimatedCounter value={user.points} />
                                </span>
                                <p className="text-sm text-muted-foreground">Total {pointsName}</p> {/* Use pointsName */}
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Mission Control Hub --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ActiveQuestsCard />
                        <NextBestRewardCard />
                        <WishlistProgressCard />
                        
                        {/* --- Next Rank Progress Card --- */}
                        {nextRank ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Next {rankName}: {nextRank.name}</CardTitle> {/* Use rankName */}
                                    <CardDescription>{pointsNeeded.toLocaleString()} {pointsName} to go!</CardDescription> {/* Use pointsName */}
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
                                        View all {rankName}s and benefits
                                    </Link>
                                </CardFooter>
                            </Card>
                        ) : (
                            <Card className="p-4 text-center">
                                <p className="font-bold text-primary">🎉 You've reached the highest {rankName}!</p> {/* Use rankName */}
                            </Card>
                        )}
                    </div>
                </div>
            </PageContainer>
        </PullToRefresh>
    );
}