import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function ProductDetailSkeleton() {
    return (
        <div className="p-4 bg-white min-h-screen w-full max-w-md mx-auto animate-pulse">
            {/* --- Skeleton Header --- */}
            <header className="flex items-center mb-4 h-16">
                <div className="p-2 -ml-2 text-gray-300">
                    <ChevronLeftIcon className="h-7 w-7" />
                </div>
            </header>

            <div className="px-4">
                {/* --- Image Placeholder --- */}
                <div className="bg-gray-200 rounded-lg mb-6 w-full aspect-square"></div>

                {/* --- Title Placeholder --- */}
                <div className="h-8 bg-gray-300 rounded-md w-3/4 mb-4"></div>

                {/* --- Points and Button Placeholders --- */}
                <div className="flex justify-between items-center mb-8">
                    <div className="h-10 bg-gray-200 rounded-md w-1/3"></div>
                    <div className="h-12 bg-gray-300 rounded-md w-2/5"></div>
                </div>

                {/* --- Description Placeholder --- */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                    <div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                </div>
            </div>
        </div>
    );
}