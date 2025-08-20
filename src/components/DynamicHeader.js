'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function DynamicHeader({ title, backLink }) {
    const router = useRouter();

    // This is the visual part - the icon itself. No padding here.
    const BackIcon = () => (
        <ChevronLeftIcon className="h-7 w-7 text-gray-700" />
    );

    // This is the interactive wrapper. It has the padding and styling.
    const BackButtonWrapper = ({ children }) => {
        if (backLink) {
            return (
                <Link href={backLink} legacyBehavior={false} className="p-2 -ml-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    {children}
                </Link>
            );
        }
        return (
            <button
                type="button"
                onClick={() => router.back()}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                {children}
            </button>
        );
    };

    return (
        // --- MODIFIED: Simplified header structure ---
        <header className="flex items-center h-16">
            <div className="w-1/3"> {/* Left container */}
                <BackButtonWrapper>
                    <BackIcon />
                </BackButtonWrapper>
            </div>
            <div className="w-1/3 text-center"> {/* Center container */}
                <h1 className="text-xl font-semibold truncate">{title}</h1>
            </div>
            <div className="w-1/3"></div> {/* Right container for alignment */}
        </header>
    );
}