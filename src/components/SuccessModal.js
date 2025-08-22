'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export default function SuccessModal({ title, message, buttonLabel, onButtonClick }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                    <CheckCircleIcon className="h-12 w-12" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-8">{message}</p>

                <button
                    onClick={onButtonClick}
                    className="w-full py-3 px-6 bg-primary text-white font-bold rounded-lg transform hover:scale-105 transition-transform"
                >
                    {buttonLabel}
                </button>
            </motion.div>
        </div>
    );
}