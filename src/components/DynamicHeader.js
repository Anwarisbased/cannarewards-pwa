'use client';

import { useRouter } from 'next/navigation';
import { useTransitionDirection } from '../context/TransitionContext'; // 1. Import the hook
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

export default function DynamicHeader({ title }) {
    const router = useRouter();
    const { setDirection } = useTransitionDirection(); // 2. Get the function

    const handleBack = () => {
        setDirection('left'); // 3. Set direction to 'left' before navigating
        router.back();
    };

    return (
        <header className="flex items-center mb-8 h-16">
            <button 
                onClick={handleBack} // 4. Use the new handler
                className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-full"
            >
                <ChevronLeftIcon className="h-7 w-7" />
            </button>
            
            <h1 className="text-xl font-semibold text-center flex-grow -ml-9">
                {title}
            </h1>
        </header>
    );
}