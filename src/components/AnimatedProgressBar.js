'use client';

import { motion } from 'framer-motion';

/**
 * A progress bar that animates its width using the performant `scaleX` transform.
 * @param {object} props
 * @param {number} props.progress - The progress percentage (0 to 100).
 * @param {string} props.barColor - The Tailwind CSS background color class for the bar.
 */
export default function AnimatedProgressBar({ progress, barColor }) {
    return (
        // The outer container sets the boundary and clips the scaled bar
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <motion.div 
                className={`${barColor} h-2.5 rounded-full w-full`} // --- MODIFIED: Bar is now always w-full ---
                style={{ originX: 0 }} // --- MODIFIED: Ensure scaling happens from the left ---
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }} // --- MODIFIED: Animate scaleX from 0 to 1 ---
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
        </div>
    );
}