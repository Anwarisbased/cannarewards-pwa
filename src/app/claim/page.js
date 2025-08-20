// src/app/claim/page.js

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import api from '@/utils/axiosConfig';
import RegisterForm from '@/components/RegisterForm'; // This component is now ready
import ImageWithLoader from '@/components/ImageWithLoader';

// This component is unchanged
function UnauthenticatedWelcome({ reward, onRegister }) {
    if (!reward) {
        return (
            <div className="w-full max-w-sm text-center animate-pulse">
                <div className="bg-gray-200 rounded-lg w-full aspect-square mb-6"></div>
                <div className="h-8 bg-gray-300 rounded-md w-3/4 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="text-center w-full max-w-sm px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">You've Unlocked a Reward!</h1>
            <p className="text-gray-600 mb-6">Create an account to claim your reward and start earning.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <ImageWithLoader src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xl font-semibold text-gray-900">{reward.name}</p>
            </div>

            <button
                onClick={onRegister}
                className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg text-lg transform hover:scale-105 transition-transform"
            >
                Create Account to Claim
            </button>
        </div>
    );
}


// This is the main logic handler for the page
function ClaimProcessor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, loading: authLoading, login } = useAuth();
    const { triggerCelebration } = useModal();

    const [status, setStatus] = useState('initializing');
    const [rewardPreview, setRewardPreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    
    const code = searchParams.get('code');

    useEffect(() => {
        if (!code) {
            setStatus('error');
            setErrorMessage('No claim code provided in the URL.');
            return;
        }

        if (authLoading) {
            setStatus('authenticating');
            return;
        }

        if (isAuthenticated) {
            setStatus('claiming');
            claimForAuthenticatedUser(code);
        } else {
            setStatus('unauthenticated');
            fetchRewardPreview();
        }

    }, [code, authLoading, isAuthenticated]);

    const fetchRewardPreview = async () => {
        try {
            const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/preview-reward`);
            setRewardPreview(response.data);
        } catch (err) {
            console.error("Failed to fetch reward preview:", err);
            setStatus('error');
            setErrorMessage('This reward is not available. Please contact support.');
        }
    };

    const claimForAuthenticatedUser = async (claimCode) => {
        try {
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/wp-json/rewards/v1/claim`, { code: claimCode });
            await login(localStorage.getItem('authToken'), true);
            setStatus('success');
            triggerCelebration();
            router.push('/my-points');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.response?.data?.message || 'Failed to claim this code.');
        }
    };
    
    if (status === 'error') {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-red-600">Claim Failed</h1>
                <p className="text-lg text-gray-700">{errorMessage}</p>
                <button 
                    onClick={() => router.push('/')}
                    className="mt-8 py-2 px-6 bg-primary hover:opacity-90 text-white font-semibold rounded-lg"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }
    
    if (status === 'unauthenticated') {
        // We pass the onRegister function to switch the status to 'registering'
        return <UnauthenticatedWelcome reward={rewardPreview} onRegister={() => setStatus('registering')} />;
    }

    if (status === 'registering') {
        // --- THIS IS THE KEY CHANGE ---
        // Replace the placeholder with our enhanced RegisterForm, passing the necessary props.
        return (
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <RegisterForm 
                    claimCode={code} 
                    rewardPreview={rewardPreview} 
                />
            </div>
        );
    }

    // Default loading/processing state
    return (
        <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Processing Your Reward...</h1>
            <p className="text-gray-600">Please wait a moment.</p>
        </div>
    );
}

// The main export is unchanged
export default function ClaimPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                <ClaimProcessor />
            </Suspense>
        </main>
    );
}