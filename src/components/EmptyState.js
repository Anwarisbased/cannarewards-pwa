'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

// Now accepts buttonLabel and buttonHref as optional props
export default function EmptyState({ Icon, title, message, buttonLabel, buttonHref }) {
    return (
        <motion.div 
            className="text-center py-10 px-4 bg-white rounded-lg shadow-md mt-6 border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-center mb-4">
                <Icon className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6">{message}</p>
            
            {/* --- NEW BUTTON LOGIC --- */}
            {buttonLabel && buttonHref && (
                <Link href={buttonHref}>
                    <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg transform hover:scale-105 transition-transform">
                        {buttonLabel}
                    </button>
                </Link>
            )}
        </motion.div>
    );
}