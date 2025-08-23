import PageContainer from './PageContainer';
import { Skeleton } from "@/components/ui/skeleton";

// Reusable component for a single circular reward placeholder
function SkeletonRewardCircle() {
    return (
        <div className="flex flex-col items-center space-y-2">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

export default function MyPointsSkeleton() {
    return (
        <PageContainer>
            {/* --- Member Card Skeleton --- */}
            <div className="space-y-4 mb-6 rounded-xl border bg-card text-card-foreground shadow p-6">
                <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex flex-col items-center space-y-2 pt-4">
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>

            {/* --- Progress Bar Skeleton --- */}
            <div className="space-y-3 mb-6 rounded-xl border bg-card text-card-foreground shadow p-6">
                 <Skeleton className="h-5 w-3/4" />
                 <Skeleton className="h-2.5 w-full" />
            </div>
            
            {/* --- Referral Banner Skeleton --- */}
            <Skeleton className="h-14 w-full mb-6" />

            {/* --- Rewards For You Skeleton --- */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                    <SkeletonRewardCircle />
                    <SkeletonRewardCircle />
                    <SkeletonRewardCircle />
                </div>
            </div>
        </PageContainer>
    );
}