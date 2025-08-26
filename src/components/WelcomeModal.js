'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GiftIcon } from '@heroicons/react/24/solid';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    // --- MODIFIED: Replaced tween with spring animation ---
    visible: { 
        opacity: 1, 
        scale: 1, 
        transition: { 
            type: 'spring', 
            stiffness: 300, 
            damping: 25 
        } 
    },
    exit: { opacity: 0, scale: 0.9 },
};

export default function WelcomeModal({ bonusDetails, closeModal }) {
    const router = useRouter();

    const handleClaim = () => {
        // Navigate to the product page of the free reward
        router.push(`/catalog/${bonusDetails.rewardProductId}`);
        closeModal();
    };

    if (!bonusDetails || !bonusDetails.isEligible) {
        return null;
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center mb-6">
                    <GiftIcon className="h-12 w-12" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Aboard!</h2>
                <p className="text-gray-600 mb-6">As a thank you for your first scan, you've unlocked a special reward!</p>

                <div className="bg-gray-100 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-500">FREE REWARD</p>
                    <p className="text-lg font-semibold text-gray-900">{bonusDetails.rewardName}</p>
                </div>
                
                <button
                    onClick={handleClaim}
                    className="w-full py-3 px-6 bg-primary text-white font-bold rounded-lg transform hover:scale-105 transition-transform"
                >
                    Claim My Reward
                </button>
            </motion.div>
        </div>
    );
}