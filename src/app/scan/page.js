'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { showToast } from '../../components/CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';
import PageContainer from '../../components/PageContainer';
import { ArrowPathIcon, QrCodeIcon, CameraIcon, GiftIcon, StarIcon } from '@heroicons/react/24/outline';

// --- SHADCN IMPORTS ---
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// --- END IMPORTS ---

export default function ScanPage() {
    const { login } = useAuth();
    const router = useRouter();
    const { openWelcomeModal, triggerConfetti, openReportScanModal } = useModal(); // --- 1. GET THE NEW MODAL FUNCTION ---
    
    const [view, setView] = useState('landing');
    const [scannerError, setScannerError] = useState('');
    const scannerRef = useRef(null);

    const startScanner = async () => {
        triggerHapticFeedback();
        setView('scanning');
        setScannerError('');

        try {
            const { Html5QrcodeScanner } = await import('html5-qrcode');
            
            setTimeout(() => {
                const scannerRegionEl = document.getElementById("scanner-region");
                if (!scannerRegionEl || scannerRef.current) return;

                const onScanSuccess = (decodedText) => { processClaim(decodedText); };
                const onScanFailure = (error) => {};

                const scanner = new Html5QrcodeScanner(
                    "scanner-region", 
                    { fps: 10, qrbox: { width: 250, height: 250 }, showTorchButtonIfSupported: true, showZoomSliderIfSupported: true, rememberLastUsedCamera: true },
                    false
                );
                scanner.render(onScanSuccess, onScanFailure);
                scannerRef.current = scanner;
            }, 100);

        } catch (error) {
            console.error("Failed to load or initialize scanner library", error);
            setScannerError("Could not load scanner. Please check your connection and try again.");
            setView('landing');
        }
    };

    const processClaim = async (urlText) => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(error => console.error("Scanner failed to clear.", error));
            scannerRef.current = null;
        }
        setView('processing');

        let code = null;
        try {
            const url = new URL(urlText);
            code = url.searchParams.get('code'); // Get the code early for error reporting
            if (!code) throw new Error("Invalid QR code format.");
            
            const api = (await import('@/utils/axiosConfig')).default;
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`, { code });
            
            triggerHapticFeedback();
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) await login(currentToken, true);
            
            const bonusDetails = response.data.firstScanBonus;
            
            if (bonusDetails?.isEligible) {
                router.push('/my-points'); 
                setTimeout(() => openWelcomeModal(bonusDetails), 300);
            } else {
                triggerConfetti();
                showToast('success', 'Points Added!', response.data.message);
                router.push('/');
            }
        } catch (err) {
            const errorCode = err.response?.data?.code;
            const errorMessage = err.response?.data?.message || 'Failed to claim code.';
            
            // --- 2. IMPLEMENT THE MODAL TRIGGER LOGIC ---
            if (errorCode === 'rest_code_already_used' || errorCode === 'rest_code_invalid') {
                openReportScanModal(code); // Pass the code that failed
                // We don't push to router here, the modal will handle user flow
            } else {
                showToast('error', 'Scan Failed', errorMessage);
                router.push('/');
            }
            triggerHapticFeedback();
        }
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => console.error("Scanner failed to clear on unmount.", error));
                scannerRef.current = null;
            }
        };
    }, []);

    return (
        <PageContainer>
            <div className="flex flex-col justify-center h-full">
                {view === 'landing' && (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground mb-2">Authenticate Your Product</h1>
                        <p className="text-muted-foreground mb-8">Scan the QR code to earn points and unlock rewards.</p>
                        
                        <div className="space-y-4 mb-10">
                            <Card>
                                <CardContent className="p-4 flex items-center">
                                    <QrCodeIcon className="w-8 h-8 mr-4 text-primary" />
                                    <div>
                                        <h3 className="font-semibold text-left">Step 1: Scan QR Code</h3>
                                        <p className="text-sm text-muted-foreground text-left">Locate and scan the code on your product.</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex items-center">
                                    <GiftIcon className="w-8 h-8 mr-4 text-primary" />
                                    <div>
                                        <h3 className="font-semibold text-left">Step 2: Get Rewards</h3>
                                        <p className="text-sm text-muted-foreground text-left">Instantly receive points and special offers.</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex items-center">
                                    <StarIcon className="w-8 h-8 mr-4 text-primary" />
                                    <div>
                                        <h3 className="font-semibold text-left">Step 3: Collect & Redeem</h3>
                                        <p className="text-sm text-muted-foreground text-left">Use your points for exclusive items.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Button onClick={startScanner} size="lg" className="w-full h-14 text-lg">
                            <CameraIcon className="w-6 h-6 mr-2" />
                            Start Scanning
                        </Button>
                    </div>
                )}

                {view === 'scanning' && (
                    <div className="w-full text-center">
                        <h2 className="text-xl font-semibold text-foreground mb-2">Scan QR Code</h2>
                        <p className="text-muted-foreground mb-6">Place the QR code inside the frame.</p>
                        
                        <div id="scanner-region" className="w-full max-w-xs mx-auto aspect-square bg-secondary border-2 border-dashed border-muted rounded-lg overflow-hidden">
                            {/* The scanner library will render a video feed here */}
                        </div>
                        
                        {scannerError && <p className="text-center text-destructive mt-4">{scannerError}</p>}

                        <Button onClick={() => router.push('/')} variant="ghost" className="mt-8">
                            Cancel
                        </Button>
                    </div>
                )}
                
                {view === 'processing' && (
                    <div className="text-center">
                        <ArrowPathIcon className="animate-spin text-primary h-12 w-12 mx-auto" />
                        <p className="mt-4 text-lg text-muted-foreground">Validating your code...</p>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}