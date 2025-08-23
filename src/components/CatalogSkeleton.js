import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import PageContainer from './PageContainer';

// --- SHADCN IMPORT ---
import { Skeleton } from "@/components/ui/skeleton";

// Reusable component for a single shimmering card
function SkeletonProductCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[150px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[80px]" />
            </div>
        </div>
    );
}

export default function CatalogSkeleton() {
    return (
        <PageContainer>
            {/* --- Skeleton Search Bar --- */}
            <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            
            {/* --- Skeleton Grid --- */}
            <div className="grid grid-cols-2 gap-4">
                <SkeletonProductCard />
                <SkeletonProductCard />
                <SkeletonProductCard />
                <SkeletonProductCard />
                <SkeletonProductCard />
                <SkeletonProductCard />
            </div>
        </PageContainer>
    );
}