import { ChevronLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// This is a reusable component for a single shimmering card
function SkeletonProductCard() {
    return (
        <div className="bg-gray-200 rounded-lg overflow-hidden">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-3 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    );
}


export default function CatalogSkeleton() {
    return (
        <div className="p-4 bg-white min-h-screen w-full max-w-md mx-auto animate-pulse">
            {/* --- Skeleton Header --- */}
            <header className="flex items-center mb-4 h-16">
                <div className="p-2 -ml-2">
                    <ChevronLeftIcon className="h-6 w-6 text-gray-300" />
                </div>
                <div className="h-6 w-24 bg-gray-300 rounded-md mx-auto"></div>
                <div className="w-6 h-6"></div>
            </header>

            {/* --- Skeleton Search Bar --- */}
            <div className="relative mb-6">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <div className="w-full bg-gray-200 border-none rounded-lg h-12"></div>
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
        </div>
    );
}