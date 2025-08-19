// A reusable component for a single circular reward placeholder
function SkeletonRewardCircle() {
    return (
        <div className="text-center space-y-2">
            <div className="bg-gray-200 rounded-full aspect-square w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
        </div>
    );
}

export default function MyPointsSkeleton() {
    return (
        <div className="p-4 bg-white min-h-screen w-full max-w-md mx-auto animate-pulse">
            {/* --- Member Card Placeholder --- */}
            <div className="bg-gray-200 rounded-xl p-6 mb-6 h-40">
                <div className="flex justify-end h-4 w-1/4 ml-auto bg-gray-300 rounded-md mb-4"></div>
                <div className="h-8 w-1/2 mx-auto bg-gray-300 rounded-md mb-4"></div>
                <div className="flex justify-between items-end">
                    <div className="h-5 w-1/3 bg-gray-300 rounded-md"></div>
                    <div className="text-right space-y-2">
                        <div className="h-6 w-20 ml-auto bg-gray-300 rounded-md"></div>
                        <div className="h-4 w-24 ml-auto bg-gray-300 rounded-md"></div>
                    </div>
                </div>
            </div>

            {/* --- Progress Bar Placeholder --- */}
            <div className="border border-gray-200 rounded-lg p-4 text-center mb-6 space-y-2">
                <div className="h-5 bg-gray-300 rounded-md w-3/4 mx-auto"></div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
            </div>

            {/* --- Referral Banner Placeholder --- */}
            <div className="border border-gray-200 rounded-lg p-3 text-center mb-6 h-12"></div>
            
            {/* --- Points & Button Placeholder --- */}
            <div className="flex justify-between items-center mb-8 px-2 h-12">
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-300 rounded-md"></div>
                    <div className="h-6 w-24 bg-gray-300 rounded-md"></div>
                </div>
                <div className="h-12 w-36 bg-gray-300 rounded-lg"></div>
            </div>

            {/* --- Rewards For You Placeholder --- */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2 px-2 h-6">
                    <div className="h-6 w-1/3 bg-gray-300 rounded-md"></div>
                    <div className="h-5 w-1/4 bg-gray-300 rounded-md"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <SkeletonRewardCircle />
                    <SkeletonRewardCircle />
                    <SkeletonRewardCircle />
                </div>
            </div>
        </div>
    );
}