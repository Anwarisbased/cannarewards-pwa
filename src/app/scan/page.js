'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../utils/axiosConfig';
import AnimatedPage from '../../components/AnimatedPage';
import PageContainer from '../../components/PageContainer';
import { ArrowPathIcon, QrCodeIcon, CameraIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { showToast } from '../../components/CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function ScanPage() {
    const { login } = useAuth();
    const router = useRouter();
    const { openWelcomeModal, triggerConfetti } = useModal();
    
    const [view, setView] = useState('landing');
    const [scannerError, setScannerError] = useState('');

    const startScanner = () => {
        triggerHapticFeedback();
        setView('scanning');

        setTimeout(() => {
            const scannerRegionEl = document.getElementById("scanner-region");
            if (!scannerRegionEl) {
                console.error("Scanner region element not found.");
                setScannerError("Could not initialize scanner region.");
                return;
            }

            try {
                const scanner = new Html5QrcodeScanner(
                    "scanner-region", 
                    { 
                        fps: 10, 
                        qrbox: { width: 250, height: 250 },
                        showTorchButtonIfSupported: true,
                        showZoomSliderIfSupported: true,
                    },
                    false
                );

                const onScanSuccess = (decodedText) => {
                    if (scanner && scanner.getState() !== 1) {
                        scanner.clear().catch(error => console.error("Scanner failed to clear.", error));
                    }
                    setView('processing');
                    processClaim(decodedText);
                };

                scanner.render(onScanSuccess, () => {});
            } catch (error) {
                console.error("Failed to initialize scanner", error);
                setScannerError("Camera permission may be denied. Please check your browser settings and refresh.");
            }
        }, 100);
    };

    const processClaim = async (urlText) => {
        try {
            const url = new URL(urlText);
            const code = url.searchParams.get('code');
            if (!code) throw new Error("Invalid QR code format.");
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`, { code });
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
            router.push('/');
        }
    };

    return (
        <AnimatedPage>
            <PageContainer>
                {/* 
                  This single parent div now controls the layout for all views.
                  - `flex` and `flex-col` set up the layout direction.
                  - `h-full` makes it take up the full height of the padded PageContainer.
                  - `justify-center` is the key to vertical centering.
                */}
                <div className="flex flex-col justify-center h-full">
                    {view === 'landing' && (
                        <div className="text-center">
                            <h1 className="text-lg font-semibold text-gray-800 mb-4">Authenticate your exclusive product.</h1>
                            
                            <div className="space-y-8 my-10">
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-400 font-bold text-sm mb-2">STEP 1</span>
                                    <QrCodeIcon className="w-16 h-16 text-gray-700" />
                                    <p className="mt-2 font-medium text-gray-700">Scan QR Code</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-400 font-bold text-sm mb-2">STEP 2</span>
                                    <img src="/globe.svg" alt="Rewards icon" className="w-16 h-16 opacity-70" />
                                    <p className="mt-2 font-medium text-gray-700">Get Rewards Instantly</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-400 font-bold text-sm mb-2">STEP 3</span>
                                    <img src="/file.svg" alt="Points icon" className="w-16 h-16 opacity-70" />
                                    <p className="mt-2 font-medium text-gray-700">Collect Points</p>
                                </div>
                            </div>

                            <button
                                onClick={startScanner}
                                className="w-full max-w-xs mx-auto bg-black text-white font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center"
                            >
                                <CameraIcon className="w-6 h-6 mr-2" />
                                SCAN
                            </button>
                        </div>
                    )}

                    {view === 'scanning' && (
                        <div className="w-full text-center">
                            <p className="text-lg font-medium text-gray-800 mb-2">Scan QR Code</p>
                            <p className="text-gray-500 mb-6">Place the QR code inside the frame to scan it.</p>
                            
                            <div 
                                id="scanner-region" 
                                className="w-full max-w-xs mx-auto aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                            >
                              {/* The scanner library will render a square video feed here */}
                            </div>
                            
                            {scannerError && <p className="text-center text-red-500 mt-4">{scannerError}</p>}

                            <button
                                onClick={() => setView('landing')}
                                className="mt-8 text-gray-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    
                    {view === 'processing' && (
                        <div className="text-center">
                            <ArrowPathIcon className="animate-spin text-primary h-12 w-12 mx-auto" />
                            <p className="mt-4 text-lg text-gray-700">Validating your code...</p>
                        </div>
                    )}
                </div>
            </PageContainer>
        </AnimatedPage>
    );
}