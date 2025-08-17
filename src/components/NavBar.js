'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Import from both of our context files
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
// Import the icons
import { HomeIcon, CircleStackIcon, QrCodeIcon, TrophyIcon, UserIcon } from '@heroicons/react/24/outline';

export default function NavBar() {
    // Get the authentication status from the Auth context
    const { isAuthenticated } = useAuth();
    // Get the modal control function from the Modal context
    const { openScanModal } = useModal();
    
    const pathname = usePathname();

    // Don't render the nav bar if the user is not authenticated.
    if (!isAuthenticated) {
        return null;
    }
    
    // Helper function to dynamically set styles for active/inactive links
    const getLinkClass = (path) => {
        const baseContainerClass = "flex flex-col items-center justify-center flex-1 py-3 transition-colors duration-200";
        if (pathname === path) {
            // Style for the active link
            return `${baseContainerClass} text-blue-600`;
        } else {
            // Style for inactive links
            return `${baseContainerClass} text-gray-500 hover:bg-gray-100`;
        }
    };
    
    // The "Scan" button is now a real button, not a Link component.
    const getScanButtonClass = () => {
        const baseContainerClass = "flex flex-col items-center justify-center flex-1 py-3 transition-colors duration-200";
        // Make it look different for emphasis
        return `${baseContainerClass} text-blue-600 font-bold`;
    };

    const navItems = [
        { href: "/", label: "Home", icon: HomeIcon },
        { href: "/catalog", label: "Catalog", icon: CircleStackIcon },
        // The "Scan" item is now handled separately below
        { href: "/my-points", label: "My Points", icon: TrophyIcon },
        { href: "/profile", label: "Profile", icon: UserIcon }, // Assuming we add a profile link too
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10">
            <div className="flex justify-around max-w-md mx-auto">
                <Link href="/" className={getLinkClass('/')}>
                    <HomeIcon className="h-6 w-6" />
                    <span className="text-xs mt-1">Home</span>
                </Link>
                <Link href="/catalog" className={getLinkClass('/catalog')}>
                    <CircleStackIcon className="h-6 w-6" />
                    <span className="text-xs mt-1">Catalog</span>
                </Link>
                
                {/* The Scan button is special and just opens the modal */}
                <button onClick={openScanModal} className={getScanButtonClass()}>
                    <QrCodeIcon className="h-6 w-6" />
                    <span className="text-xs mt-1">Scan</span>
                </button>
                
                <Link href="/my-points" className={getLinkClass('/my-points')}>
                    <TrophyIcon className="h-6 w-6" />
                    <span className="text-xs mt-1">My Points</span>
                </Link>
                <Link href="/profile" className={getLinkClass('/profile')}>
                    <UserIcon className="h-6 w-6" />
                    <span className="text-xs mt-1">Profile</span>
                </Link>
            </div>
        </nav>
    );
}