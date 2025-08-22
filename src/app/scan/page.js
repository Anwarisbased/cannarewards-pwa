'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
// The static import of html5-qrcode is no longer needed here
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
    const scannerRef = useRef(null); // Ref to hold the scanner instance

    // --- UPDATED: The function is now async to handle the dynamic import ---
    const startScanner = async () => {
        triggerHapticFeedback();
        setView('scanning');
        setScannerError(''); // Clear previous errors

        try {
            // Dynamically import the library only when needed
            const { Html5QrcodeScanner } = await import('html5-qrcode');
            
            // We still use a timeout to ensure the DOM element is ready for the scanner
            setTimeout(() => {
                const scannerRegionEl = document.getElementById("scanner-region");
                if (!scannerRegionEl) {
                    console.error("Scanner region element not found.");
                    setScannerError("Could not initialize scanner region.");
                    return;
                }

                // Prevents creating multiple scanner instances
                if (scannerRef.current) {
                    return;
                }

                const onScanSuccess = (decodedText) => {
                    processClaim(decodedText);
                };
                
                const onScanFailure = (error) => {
                    // This callback is often noisy, you can use it for debugging if needed
                    // console.warn(`Code scan error = ${error}`);
                };

                const scanner = new Html5QrcodeScanner(
                    "scanner-region", 
                    { 
                        fps: 10, 
                        qrbox: { width: 250, height: 250 },
                        showTorchButtonIfSupported: true,
                        showZoomSliderIfSupported: true,
                        rememberLastUsedCamera: true, // Improves user experience on subsequent scans
                    },
                    false
                );

                scanner.render(onScanSuccess, onScanFailure);
                scannerRef.current = scanner; // Store the instance in the ref

            }, 100);

        } catch (error) {
            console.error("Failed to load or initialize scanner library", error);
            setScannerError("Could not load the scanner. Please check your connection and try again.");
            setView('landing'); // Revert view on failure
        }
    };

    const processClaim = async (urlText) => {
        // Stop the scanner immediately after a successful scan
        if (scannerRef.current) {
            scannerRef.current.clear().catch(error => console.error("Scanner failed to clear.", error));
            scannerRef.current = null;
        }

        setView('processing');

        try {
            const url = new URL(urlText);
            const code = url.searchParams.get('code');
            if (!code) throw new Error("Invalid QR code format.");
            
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`, { code });
            
            triggerHapticFeedback(); // Haptic on success
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) await login(currentToken, true); // silent refresh
            
            const bonusDetails = response.data.firstScanBonus;
            
            if (bonusDetails && bonusDetails.isEligible) {
                router.push('/my-points'); 
                setTimeout(() => openWelcomeModal(bonusDetails), 300);
            } else {
                triggerConfetti();
                toast.success(response.data.message);
                router.push('/');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to claim code.';
            showToast('error', 'Scan Failed', errorMessage);
            triggerHapticFeedback(); // Haptic on error
            router.push('/');
        }
    };

    // --- NEW: Add a cleanup effect ---
    // This ensures that if the user navigates away from the scan page
    // (e.g., using the nav bar), the camera is turned off.
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => console.error("Scanner failed to clear on unmount.", error));
                scannerRef.current = null;
            }
        };
    }, []); // The empty dependency array ensures this runs only on mount and unmount

    return (
        <AnimatedPage>
            <PageContainer>
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
                                onClick={() => router.push('/')} // Go to home to ensure cleanup
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