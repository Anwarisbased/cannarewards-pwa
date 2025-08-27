'use client';

import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import PageContainer from '@/components/PageContainer';
import DynamicHeader from '@/components/DynamicHeader';
import StaggeredList from '@/components/StaggeredList';
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the Badge component to ensure framer-motion is client-side
const Badge = dynamic(() => import('@/components/Badge'), { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-48 rounded-xl" />
});


function BadgesSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="w-full h-48 rounded-xl" />
            <Skeleton className="w-full h-48 rounded-xl" />
            <Skeleton className="w-full h-48 rounded-xl" />
            <Skeleton className="w-full h-48 rounded-xl" />
        </div>
    );
}


export default function BadgesPage() {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
            <PageContainer>
                <DynamicHeader title="Trophy Case" backLink="/profile" />
                <BadgesSkeleton />
            </PageContainer>
        );
    }

    const allAchievements = user.allAchievements ? Object.values(user.allAchievements) : [];
    const unlockedKeys = new Set(user.unlockedAchievementKeys || []);

    // Sort achievements to show unlocked ones first
    const sortedAchievements = [...allAchievements].sort((a, b) => {
        const aUnlocked = unlockedKeys.has(a.achievement_key);
        const bUnlocked = unlockedKeys.has(b.achievement_key);
        if (aUnlocked === bUnlocked) return 0;
        return aUnlocked ? -1 : 1;
    });

    return (
        <PageContainer>
            <DynamicHeader title="Trophy Case" backLink="/profile" />
            
            <p className="text-center text-muted-foreground mb-6">
                Discover and unlock achievements to earn bonus points. Tap any badge to see how to earn it.
            </p>

            {sortedAchievements.length > 0 ? (
                <StaggeredList className="grid grid-cols-2 gap-4">
                    {sortedAchievements.map(ach => (
                        <Badge 
                            key={ach.achievement_key}
                            achievement={ach}
                            isUnlocked={unlockedKeys.has(ach.achievement_key)}
                        />
                    ))}
                </StaggeredList>
            ) : (
                <div className="text-center text-muted-foreground mt-12">
                    <p>No achievements are available at this time. Check back soon!</p>
                </div>
            )}
        </PageContainer>
    );
}