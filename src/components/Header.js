'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
// Import the new icons from Heroicons
import { UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

// Placeholder for your brand logo component or image
function BrandLogo() {
    return (
        // TODO: Replace this div with an <Image> component from Next.js with your actual logo
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-500">
            LOGO
        </div>
    );
}

export default function Header() {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    // Do not show the header on pages that have their own custom header, like the Profile page.
    // Add any other paths here as needed.
    const pagesWithoutHeader = ['/profile', '/profile/edit'];
    if (!isAuthenticated || pagesWithoutHeader.includes(pathname)) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
            <div className="flex justify-between items-center max-w-md mx-auto p-4 h-20">
                <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    {/* Replaced FiUser with UserIcon */}
                    <UserIcon className="h-6 w-6 text-gray-700" />
                </Link>

                <Link href="/">
                    <BrandLogo />
                </Link>
                
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    {/* Replaced FiShoppingCart with ShoppingCartIcon */}
                    <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                </button>
            </div>
        </header>
    );
}