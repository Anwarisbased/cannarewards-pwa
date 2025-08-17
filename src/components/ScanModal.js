'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, scale: 0.95 },
};

export default function ScanModal({ closeModal }) {
    const { login } = useAuth();
    // This state machine will control what the modal displays
    const [status, setStatus] = useState('scanning'); // 'scanning', 'processing', 'success', 'error'
    const [message, setMessage] = useState('Point camera at a QR code');

    useEffect(() => {
        // We only want to initialize the scanner if we are in 'scanning' mode.
        if (status !== 'scanning') return;

        // This function is called on successful scan
        const onScanSuccess = (decodedText, decodedResult) => {
            // Stop the scanner immediately to prevent multiple scans
            scanner.clear().catch(error => console.error("Failed to clear scanner on success.", error));
            // Move to the next state
            setStatus('processing');
            setMessage('Validating your code...');
            processClaim(decodedText);
        };

        // This function is called on scan failure (we can ignore it to allow continuous scanning)
        const onScanFailure = (error) => { /* Do nothing on failure */ };
        
        // Create a new scanner instance and render it into the div with id="scanner-region"
        const scanner = new Html5QrcodeScanner( "scanner-region", { fps: 10, qrbox: { width: 250, height: 250 } }, false );
        scanner.render(onScanSuccess, onScanFailure);

        // This is a cleanup function that runs when the component is unmounted (e.g., modal is closed)
        return () => {
            // Check if scanner is still active before trying to clear it
            if (scanner && scanner.getState() === 2) { // 2 is SCANNING state
                 scanner.clear().catch(error => console.error("Failed to clear scanner on unmount.", error));
            }
        };
    }, [status]); // This effect re-runs if the status changes back to 'scanning'

    const processClaim = async (urlText) => {
        try {
            const url = new URL(urlText);
            const code = url.searchParams.get('code');
            if (!code) {
                throw new Error("Invalid QR code format. No code found.");
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`,
                { code: code }
            );

            // On success, show a toast and close the modal after a delay
            toast.success(response.data.message);
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) {
                login(currentToken); // Refresh user data
            }
            setTimeout(() => closeModal(), 1500); // Close after 1.5s

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to claim code.';
            // On error, show a toast and go back to scanning mode
            toast.error(errorMessage);
            setStatus('scanning');
            setMessage('Scan failed. Please try another code.');
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

                {/* This container's height is fixed to prevent layout shifts */}
                <div className="h-[328px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {status === 'scanning' && (
                            <motion.div key="scanner" exit={{ opacity: 0, scale: 0.8 }}>
                                <div id="scanner-region" className="w-full aspect-square border-2 rounded-lg overflow-hidden mb-4 bg-gray-200"></div>
                                <p>{message}</p>
                            </motion.div>
                        )}
                        {status === 'processing' && (
                            <motion.div key="processing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center">
                                <ArrowPathIcon className="animate-spin text-blue-600 h-16 w-16" />
                                <p className="mt-4 text-lg">{message}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* We now use the toast for success/error messages, so we only need a cancel button */}
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