'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation';
import { UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
    const { user, isAuthenticated } = useAuth();
    const pathname = usePathname();

    // --- MODIFIED: Create a list of paths where the global header should be hidden ---
    const pagesWithoutHeader = [
        '/profile',
        '/profile/edit',
        '/support',
        '/terms',
        '/how-to-earn', // This page has its own header
        '/orders', // This page has its own header
        '/history', // This page has its own header
    ];

    // --- MODIFIED: Check if the current pathname starts with any of the paths in the list ---
    const shouldHideHeader = pagesWithoutHeader.some(path => pathname.startsWith(path));

    if (!isAuthenticated || shouldHideHeader) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10 h-20">
            <div className="flex justify-between items-center max-w-md mx-auto p-4 h-full">
                <Link href="/profile" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <UserIcon className="h-7 w-7 text-gray-700" />
                </Link>

                <Link href="/">
                    <Image
                        src="/logo.png" 
                        alt="Brand Logo"
                        width={40}
                        height={40}
                        priority={true}
                        className="object-contain"
                    />
                </Link>
                
                <Link href="/orders" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <span className="font-bold text-gray-700 text-sm">{user?.points || 0}</span>
                    <ShoppingCartIcon className="h-7 w-7 text-gray-700" />
                </Link>
            </div>
        </header>
    );
}