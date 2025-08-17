// src/components/DashboardSkeleton.js
export default function DashboardSkeleton() {
    return (
        <div className="w-full max-w-md mx-auto p-4 font-sans animate-pulse">
             {/* Header Skeleton */}
            <header className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </header>

            {/* Member Card Skeleton */}
            <div className="bg-gray-300 rounded-xl p-6 mb-6 h-40"> 
                {/* A simple block to represent the card */}
            </div>
            
            {/* Action Button Skeletons */}
            <div className="bg-gray-300 rounded-lg p-4 mb-6 h-16"></div>

            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-24 bg-gray-300 rounded-lg"></div>
                <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
            </div>

            <div className="mt-8 mx-auto h-10 w-24 bg-gray-300 rounded-lg"></div>
        </div>
    );
}