'use client';

import { motion } from 'framer-motion';

// This component accepts an Icon component, a title, and a message as props.
export default function EmptyState({ Icon, title, message }) {
    return (
        <motion.div 
            className="text-center py-10 px-4 bg-white rounded-lg shadow-md mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-center mb-4">
                {/* We render the passed-in Icon component */}
                <Icon className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500">{message}</p>
        </motion.div>
    );
}