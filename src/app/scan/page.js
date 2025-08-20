'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../utils/axiosConfig';
import AnimatedPage from '../../components/AnimatedPage';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { showToast } from '../../components/CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';
import PageContainer from '../../components/PageContainer'; // --- 1. Import PageContainer ---

export default function ScanPage() {
    const { login } = useAuth();
    const router = useRouter();
    const { openWelcomeModal, triggerConfetti } = useModal();
    const [status, setStatus] = useState('initializing');

    useEffect(() => {
        const scannerRegionEl = document.getElementById("scanner-region");
        if (!scannerRegionEl) {
            console.error("Scanner region element not found.");
            return;
        }

        let scanner = null;
        
        try {
            scanner = new Html5QrcodeScanner(
                "scanner-region", 
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    showTorchButtonIfSupported: true,
                    showZoomSliderIfSupported: true,
                },
                false
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
        } catch (error) {
            console.error("Failed to initialize scanner", error);
            setStatus('error');
        }

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
                router.push('/my-points');
                setTimeout(() => openWelcomeModal(bonusDetails), 500);
            } else {
                triggerConfetti();
                toast.success(response.data.message);
                router.push('/');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to claim code.';
            showToast('error', 'Scan Failed', errorMessage);
            triggerHapticFeedback();
            window.location.reload();
        }
    };

    return (
        <AnimatedPage>
            {/* --- 2. Replace <main> with <PageContainer> --- */}
            <PageContainer>
                {/* Note: The DynamicHeader was removed as the global header is now always visible here */}
                <div id="scanner-region" className="w-full"></div>

                {status === 'processing' && (
                    <div className="flex flex-col items-center justify-center mt-4">
                        <ArrowPathIcon className="animate-spin text-primary h-12 w-12" />
                        <p className="mt-4 text-lg text-gray-700">Validating your code...</p>
                    </div>
                )}
                {status === 'error' && (
                    <div className="text-center text-red-500 mt-4">
                        <p>Could not start the scanner. Please check your camera permissions and refresh the page.</p>
                    </div>
                )}
            </PageContainer>
        </AnimatedPage>
    );
}