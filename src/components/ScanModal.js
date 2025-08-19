'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { triggerHapticFeedback } from '@/utils/haptics';
import { triggerConfetti } from '@/utils/confetti'; // Import our new confetti utility

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.95 },
};

export default function ScanModal({ closeModal }) {
    const { login } = useAuth();
    const { openWelcomeModal } = useModal(); 
    const [status, setStatus] = useState('scanning');
    
    useEffect(() => {
        if (status !== 'scanning') return;

        let scannerInstance = null;
        const scannerRegion = document.getElementById("scanner-region");

        if (scannerRegion) {
            const onScanSuccess = (decodedText, decodedResult) => {
                if (scannerInstance) {
                    scannerInstance.clear().catch(error => console.error("Scanner failed to clear on success.", error));
                }
                setStatus('processing');
                processClaim(decodedText);
            };

            const onScanFailure = (error) => { /* Ignore */ };
            
            scannerInstance = new Html5QrcodeScanner("scanner-region", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
            scannerInstance.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerInstance && typeof scannerInstance.getState === 'function') {
                if (scannerInstance.getState() !== 1) { // 1 is NOT_STARTED
                     scannerInstance.clear().catch(error => console.error("Scanner failed to clear on unmount.", error));
                }
            }
        };
    }, [status]);

    const processClaim = async (urlText) => {
        try {
            const url = new URL(urlText);
            const code = url.searchParams.get('code');
            if (!code) throw new Error("Invalid QR code format.");

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`,
                { code: code }
            );
            
            triggerHapticFeedback();
            
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) login(currentToken);
            
            const bonusDetails = response.data.firstScanBonus;
            if (bonusDetails && bonusDetails.isEligible) {
                closeModal(); 
                openWelcomeModal(bonusDetails);
            } else {
                // Call the confetti utility directly!
                triggerConfetti();
                toast.success(response.data.message);
                setTimeout(() => closeModal(), 1500); 
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to claim code.';
            toast.error(errorMessage);
            triggerHapticFeedback();
            setStatus('scanning');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <motion.div
                className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <h2 className="text-2xl font-bold mb-4">Scan & Claim</h2>
                <div className="h-[328px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {status === 'scanning' && (
                            <motion.div key="scanner" exit={{ opacity: 0, scale: 0.8 }}>
                                <div id="scanner-region" className="w-full aspect-square border-2 rounded-lg overflow-hidden bg-gray-200"></div>
                                <p className="mt-2 text-gray-600">Point camera at a QR code</p>
                            </motion.div>
                        )}
                        {status === 'processing' && (
                            <motion.div key="processing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center">
                                <ArrowPathIcon className="animate-spin text-blue-600 h-16 w-16" />
                                <p className="mt-4 text-lg text-gray-700">Validating your code...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    onClick={closeModal}
                    className="mt-6 w-full py-2 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg"
                >
                    Cancel
                </button>
            </motion.div>
        </div>
    );
}