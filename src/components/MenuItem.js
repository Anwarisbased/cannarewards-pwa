'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
// Import the new icon from Heroicons
import { ChevronRightIcon } from '@heroicons/react/24/solid';

export default function MenuItem({ href, label, isDestructive = false }) {
    const textColor = isDestructive ? 'text-red-500 font-medium' : 'text-gray-800';
    
    // Using a simple div for the motion component to avoid nesting interactive elements (Link > button)
    const MotionWrapper = motion.div;

    return (
        <Link href={href} className="block group">
            <MotionWrapper 
                className="bg-white p-4 flex justify-between items-center border-b border-gray-200 cursor-pointer last:border-b-0 group-hover:bg-gray-50 transition-colors"
                whileTap={{ scale: 0.98, backgroundColor: '#f9fafb' }} // A subtle tap effect
            >
                <span className={textColor}>{label}</span>
                {/* Replaced FiChevronRight with ChevronRightIcon */}
                <ChevronRightIcon className={`h-5 w-5 ${isDestructive ? 'text-red-400' : 'text-gray-400'}`} />
            </MotionWrapper>
        </Link>
    );
}