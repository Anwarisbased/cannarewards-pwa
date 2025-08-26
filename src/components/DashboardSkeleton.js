import PageContainer from './PageContainer';
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <PageContainer>
            <div className="space-y-6">
                {/* StatusCard Skeleton */}
                <Skeleton className="h-56 w-full rounded-xl" />

                {/* ActionCard Skeleton */}
                <Skeleton className="h-32 w-full rounded-xl" />
                
                {/* Carousel Skeleton */}
                <div className="space-y-3">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex gap-4">
                        <Skeleton className="h-24 w-3/4 rounded-xl" />
                        <Skeleton className="h-24 w-3/4 rounded-xl" />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}