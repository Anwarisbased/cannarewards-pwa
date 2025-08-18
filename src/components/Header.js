'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import { UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
    const { user, isAuthenticated } = useAuth();
    const pathname = usePathname();

    // Define pages where the main header should not be displayed
    const pagesWithoutHeader = ['/profile', '/profile/edit', '/support', '/terms', '/how-to-earn', '/ranks']; // Added ranks/how-to-earn
    if (!isAuthenticated || pagesWithoutHeader.includes(pathname)) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
            <div className="flex justify-between items-center max-w-md mx-auto p-4 h-20">
                {/* Profile Icon Link - now points to the main profile menu */}
                <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <UserIcon className="h-7 w-7 text-gray-700" />
                </Link>

                {/* Brand Logo Link - points to the main dashboard */}
                <Link href="/">
                    <Image
                        src="/logo.png" // Assumes your logo is named logo.png in the /public folder
                        alt="Brand Logo"
                        width={40}
                        height={40}
                        priority={true} // Prioritize loading the logo as it's above the fold
                        className="object-contain"
                    />
                </Link>
                
                {/* Points & Cart Icon Link - points to the orders page */}
                <Link href="/orders" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <span className="font-bold text-gray-700 text-sm">{user?.points || 0}</span>
                    <ShoppingCartIcon className="h-7 w-7 text-gray-700" />
                </Link>
            </div>
        </header>
    );
}