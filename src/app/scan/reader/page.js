// src/app/scan/reader/page.js
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function ScanReaderPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [scanError, setScanError] = useState('');

    useEffect(() => {
        const onScanSuccess = (decodedText, decodedResult) => {
            scanner.clear().catch(error => console.error("Failed to clear scanner.", error));
            
            try {
                const url = new URL(decodedText);
                const code = url.searchParams.get('code');
                if (code) {
                    processClaim(code);
                } else {
                    handleErrorAndReturn("Invalid QR code format.");
                }
            } catch (e) {
                handleErrorAndReturn("Scanned QR code is not a valid URL.");
            }
        };

        const onScanFailure = (error) => { /* Ignore */ };

        const scanner = new Html5QrcodeScanner("scanner-region", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        scanner.render(onScanSuccess, onScanFailure);

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner on unmount.", error));
        };
    }, []);

    const processClaim = async (code) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`,
                { code: code }
            );

            // Refresh global user state
            const currentToken = localStorage.getItem('authToken');
            if (currentToken) login(currentToken);

            // Redirect back to the scan page with a SUCCESS message
            router.push(`/scan?status=success&message=${encodeURIComponent(response.data.message)}`);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to claim code.';
            handleErrorAndReturn(errorMessage);
        }
    };
    
    const handleErrorAndReturn = (message) => {
        // Redirect back to the scan page with an ERROR message
        router.push(`/scan?status=error&message=${encodeURIComponent(message)}`);
    };

    return (
        <main className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div id="scanner-region" className="w-full aspect-square border-2 border-dashed border-gray-600 rounded-lg overflow-hidden mb-4"></div>
                <p className="text-white mb-4">Place the QR code inside the box</p>
                <Link href="/scan">
                    <button className="py-2 px-6 bg-gray-700 text-white font-semibold rounded-lg">
                        Cancel
                    </button>
                </Link>
            </div>
        </main>
    );
}