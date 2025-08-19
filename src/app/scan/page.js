'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext'; // We still need this for the WelcomeModal
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../utils/axiosConfig';
import AnimatedPage from '../../components/AnimatedPage';
import DynamicHeader from '../../components/DynamicHeader';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { triggerHapticFeedback } from '@/utils/haptics';

function ScanProcessor() {
    const { login } = useAuth();
    const router = useRouter();
    const { openWelcomeModal, triggerConfetti } = useModal();
    const [status, setStatus] = useState('initializing'); // initializing | scanning | processing

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "scanner-region", 
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
            },
            false // verbose
        );

        const onScanSuccess = (decodedText, decodedResult) => {
            if (scanner && scanner.getState() !== 1) {
                scanner.clear().catch(error => console.error("Scanner failed to clear.", error));
            }
            setStatus('processing');
            processClaim(decodedText);
        };

        scanner.render(onScanSuccess, (error) => {});
        setStatus('scanning');

        return () => {
            if (scanner && scanner.getState() !== 1) {
                scanner.clear().catch(err => console.error("Failed to clear scanner on unmount", err));
            }
        };
    }, []);

    const processClaim = async (urlText) => {
        try {
            const url = new URL(urlText);
            const code = url.searchParams.get('code');
            if (!code) throw new Error("Invalid QR code format.");

            const response = await api.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`,
                { code: code }
            );
            
            triggerHapticFeedback();
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) login(currentToken);
            
            const bonusDetails = response.data.firstScanBonus;
            if (bonusDetails && bonusDetails.isEligible) {
                // Navigate away first, then show the modal
                router.push('/my-points');
                setTimeout(() => openWelcomeModal(bonusDetails), 500);
            } else {
                triggerConfetti();
                toast.success(response.data.message);
                router.push('/');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to claim code.';
            toast.error(errorMessage);
            triggerHapticFeedback();
            // Reload the page to reset the scanner
            window.location.reload();
        }
    };

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <DynamicHeader title="Scan & Claim" />
                    
                    {/* The library will render its UI inside this div */}
                    <div id="scanner-region" className="w-full"></div>

                    {status === 'processing' && (
                        <div className="flex flex-col items-center justify-center mt-4">
                            <ArrowPathIcon className="animate-spin text-primary h-12 w-12" />
                            <p className="mt-4 text-lg text-gray-700">Validating your code...</p>
                        </div>
                    )}
                </div>
            </main>
        </AnimatedPage>
    );
}


export default function ScanPage() {
    // We keep Suspense because child components might use searchParams in the future
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ScanProcessor />
        </Suspense>
    );
}