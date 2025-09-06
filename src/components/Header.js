'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import AnimatedCounter from './AnimatedCounter'; // We are importing the component we just created

export default function Header() {
    const { user, isAuthenticated } = useAuth();
    const pathname = usePathname();

    // A list of exact paths where the global header should NOT be displayed.
    // These pages typically have their own custom headers or require a full-screen, immersive experience.
    const pagesWithoutHeader = [
        '/',                // The main dashboard is a full-screen welcome page.
        '/claim',           // The claim/register flow is a special layout.
        '/forgot-password',
        '/reset-password',
        '/scan',            // The scanner needs the full screen for the camera view.
    ];

    // The header should be hidden if the user isn't authenticated OR if the current path is in our hide list.
    const shouldHideHeader = !isAuthenticated || pagesWithoutHeader.includes(pathname);

    if (shouldHideHeader) {
        return null; // Don't render anything if the header should be hidden.
    }

    return (
        <header 
            className="fixed top-0 left-0 right-0 bg-white shadow-sm z-20"
            // This ensures content doesn't get stuck under the "notch" on iPhones.
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
            <div className="flex justify-between items-center max-w-md mx-auto p-4 h-20">
                
                {/* A placeholder on the left for proper centering of the logo. Can be used for notifications in the future. */}
                <div className="w-1/4"></div>

                {/* The logo now links to the main "My Points" hub, which is a more useful landing spot than the dashboard. */}
                <div className="w-1/2 flex justify-center">
                    <Link href="/my-points">
                        <Image
                            src="/logo.png" 
                            alt="Brand Logo"
                            width={40}
                            height={40}
                            priority={true}
                            className="object-contain"
                        />
                    </Link>
                </div>
                
                {/* The points counter on the right, which links to the rewards catalog. */}
                <div className="w-1/4 flex justify-end">
                    <Link href="/catalog" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="font-bold text-gray-700 text-sm">
                            {/* --- FIX: Use the correct 'points_balance' key --- */}
                            <AnimatedCounter value={user?.points_balance || 0} />
                        </span>
                        <span className="text-xs text-gray-500">Points</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}