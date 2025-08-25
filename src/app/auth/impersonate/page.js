'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/components/CustomToast';

function ImpersonationProcessor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // The token from the URL is a valid JWT, so we can log in directly.
            login(token);
            showToast('info', 'Impersonation Mode', 'You are now browsing as another user. Log out to return to your admin account.');
            router.push('/'); // Redirect to the main dashboard
        } else {
            showToast('error', 'Impersonation Failed', 'No impersonation token was provided.');
            router.push('/');
        }
    }, [searchParams, login, router]);

    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Initiating Impersonation...</h1>
            <p className="text-gray-600">Please wait while we log you in as the selected user.</p>
        </div>
    );
}


export default function ImpersonatePage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
                <ImpersonationProcessor />
            </Suspense>
        </main>
    );
}