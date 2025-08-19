'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

/**
 * A reusable header component for sub-pages.
 * @param {object} props
 * @param {string} props.title - The title to display in the header.
 */
export default function DynamicHeader({ title }) {
    const router = useRouter();

    return (
        <header className="flex items-center mb-8 h-16">
            {/* The back button */}
            <button 
                onClick={() => router.back()} 
                className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"
            >
                <ChevronLeftIcon className="h-7 w-7" />
            </button>
            
            {/* The title, centered using a flex-grow trick */}
            <h1 className="text-xl font-semibold text-center flex-grow -ml-9">
                {title}
            </h1>
        </header>
    );
}