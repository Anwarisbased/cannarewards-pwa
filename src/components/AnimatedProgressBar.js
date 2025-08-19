'use client';

import { motion } from 'framer-motion';

/**
 * A progress bar that animates its width.
 * @param {object} props
 * @param {number} props.progress - The progress percentage (0 to 100).
 * @param {string} props.barColor - The Tailwind CSS background color class for the bar.
 */
export default function AnimatedProgressBar({ progress, barColor }) {
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
                className={`${barColor} h-2.5 rounded-full`}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
        </div>
    );
}