'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { triggerHapticFeedback } from '@/utils/haptics'; // 1. Import haptics

export default function MenuItem({ href, label, isDestructive = false }) {
    const textColor = isDestructive ? 'text-red-500 font-medium' : 'text-gray-800';
    
    const MotionWrapper = motion.div;

    return (
        // 2. Add onClick to the Link
        <Link href={href} className="block group" onClick={triggerHapticFeedback}>
            <MotionWrapper 
                className="bg-white p-4 flex justify-between items-center border-b border-gray-200 cursor-pointer last:border-b-0 group-hover:bg-gray-50 transition-colors"
                whileTap={{ scale: 0.98, backgroundColor: '#f9fafb' }}
            >
                <span className={textColor}>{label}</span>
                <ChevronRightIcon className={`h-5 w-5 ${isDestructive ? 'text-red-400' : 'text-gray-400'}`} />
            </MotionWrapper>
        </Link>
    );
}