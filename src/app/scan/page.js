'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AnimatedPage from '../../components/AnimatedPage';
import { useModal } from '../../context/ModalContext'; // Use the new Modal Context
// Import the new icons from Heroicons
import { QrCodeIcon, StarIcon, BanknotesIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// A reusable component for each step in the guide
function ScanStep({ number, Icon, title, description }) {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center mb-4">
                <span className="text-6xl font-thin text-gray-300 mr-4">{number}</span>
                <Icon className="h-12 w-12 text-gray-800" />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-gray-500 text-sm max-w-xs">{description}</p>
        </div>
    );
}

// A component to show the confirmation message from a redirect
function ConfirmationMessage() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const message = searchParams.get('message');

    // Don't show anything if there are no feedback params in the URL
    if (!status || !message) {
        return null;
    }

    const isSuccess = status === 'success';

    return (
        <div className={`p-4 rounded-lg mb-6 text-center ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center justify-center">
                {isSuccess ? <CheckCircleIcon className="h-6 w-6 mr-2" /> : <XCircleIcon className="h-6 w-6 mr-2" />}
                <p className="font-semibold">{message}</p>
            </div>
        </div>
    );
}

// The main content of the page
function ScanPageContent() {
    const { openScanModal } = useModal(); // Get the function to open the scanner
    
    return (
        <AnimatedPage>
            <main className="p-6 bg-white min-h-[90vh] flex flex-col">
                <div className="flex-grow overflow-y-auto">
                    <div className="w-full max-w-md mx-auto text-center">
                        
                        <ConfirmationMessage />
                        
                        <p className="text-gray-600 text-lg my-8">
                            Authenticate your product by scanning the QR code to claim ownership.
                        </p>

                        <div className="space-y-12">
                            <ScanStep 
                                number="1"
                                Icon={QrCodeIcon}
                                title="Scan QR Code"
                                description="Find the unique code on the product packaging."
                            />
                            <ScanStep 
                                number="2"
                                Icon={StarIcon}
                                title="Get Rewards Instantly"
                                description="Points are added to your account right away."
                            />
                            <ScanStep 
                                number="3"
                                Icon={BanknotesIcon}
                                title="Collect Points"
                                description="Save up for exclusive swag and member perks."
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto mt-auto pt-8">
                    <button 
                        onClick={openScanModal}
                        className="bg-black text-white p-5 rounded-xl flex items-center justify-center space-x-3 w-full text-lg font-semibold transform hover:scale-105 active:scale-100 transition-transform"
                    >
                        <QrCodeIcon className="h-6 w-6" />
                        <span>SCAN NOW</span>
                    </button>
                </div>
            </main>
        </AnimatedPage>
    );
}

// The main export must wrap the content in Suspense because ConfirmationMessage uses useSearchParams
export default function ScanLandingPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <ScanPageContent />
        </Suspense>
    );
}