'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { getWelcomeRewardPreview, getReferralGift, claimRewardCode } from '@/services/rewardsService';
import RegisterForm from '@/components/RegisterForm';
import ImageWithLoader from '@/components/ImageWithLoader';

// Component specifically for referral signups (No changes needed here)
function ReferralWelcome({ gift, onRegister }) {
    return (
        <div className="text-center w-full max-w-sm px-4">
            <div className="mb-6">
                <img src="/logo.png" alt="CannaRewards Logo" width={80} height={80} className="mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">You've Been Invited!</h1>
            <p className="text-gray-600 mb-6">Create an account to join and claim your free welcome gift.</p>
            
            {gift && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <ImageWithLoader src={gift.image} alt={gift.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-gray-500">YOUR WELCOME GIFT</p>
                    <p className="text-xl font-semibold text-gray-900">{gift.name}</p>
                </div>
            )}
            
            <button
                onClick={onRegister}
                className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg text-lg transform hover:scale-105 transition-transform"
            >
                Create Account to Claim
            </button>
        </div>
    );
}


// Component for scan-first signups (No changes needed here)
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


function ClaimProcessor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, loading: authLoading, login } = useAuth();
    const { triggerConfetti } = useModal();

    const [status, setStatus] = useState('initializing');
    const [rewardPreview, setRewardPreview] = useState(null);
    const [referralGift, setReferralGift] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    
    const code = searchParams.get('code');
    const refCode = searchParams.get('ref');

    // --- START: REFACTORED LOGIC ---
    useEffect(() => {
        // This effect runs once to decide the page's purpose based on URL params.
        
        // Persist the referral code if it exists, so it can be used after registration.
        if (refCode) {
            localStorage.setItem('referralCode', refCode);
        }

        if (authLoading) {
            // Wait until we know the user's auth status.
            setStatus('authenticating');
            return;
        }

        // --- Determine the action based on URL ---
        
        // Action 1: Handle a product scan code
        if (code) {
            if (isAuthenticated) {
                setStatus('claiming');
                claimForAuthenticatedUser(code);
            } else {
                setStatus('unauthenticated');
                fetchRewardPreview();
            }
            return;
        }

        // Action 2: Handle a referral link
        if (refCode) {
            if (isAuthenticated) {
                // A logged-in user can't be referred. Redirect them.
                router.push('/');
            } else {
                setStatus('unauthenticated');
                fetchReferralGift();
            }
            return;
        }
        
        // Action 3: No code or ref code provided.
        // If the user is logged in, show the "Invalid Page" message.
        // Otherwise, this is an invalid state, so show a generic error.
        if (isAuthenticated) {
            setStatus('invalid_authenticated');
        } else {
            setStatus('error');
            setErrorMessage('No claim code or referral code was provided.');
        }

    }, [code, refCode, authLoading, isAuthenticated, router]);
    // --- END: REFACTORED LOGIC ---

    const fetchRewardPreview = async () => {
        try {
            const data = await getWelcomeRewardPreview();
            setRewardPreview(data);
        } catch (err) {
            setStatus('error');
            setErrorMessage('This reward is not available. Please contact support.');
        }
    };

    const fetchReferralGift = async () => {
        try {
            const data = await getReferralGift();
            setReferralGift(data);
        } catch (err) {
            console.error("Failed to fetch referral gift:", err);
            // Don't show an error, just proceed without the gift preview.
        }
    };

    const claimForAuthenticatedUser = async (claimCode) => {
        try {
            const responseData = await claimRewardCode(claimCode);
            await login(localStorage.getItem('authToken'), true); // Refresh user data
            setStatus('success');
            
            const bonusDetails = responseData.firstScanBonus;
            if (bonusDetails?.isEligible) {
                triggerConfetti();
                router.push(`/catalog/${bonusDetails.rewardProductId}?first_scan=true`);
            } else {
                router.push('/my-points');
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message || 'Failed to claim this code.');
        }
    };
    
    // --- RENDER LOGIC ---

    if (status === 'invalid_authenticated') {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Invalid Page</h1>
                <p className="text-lg text-gray-700">Please scan a product QR code to claim a reward.</p>
                <button 
                    onClick={() => router.push('/')}
                    className="mt-8 py-2 px-6 bg-primary hover:opacity-90 text-white font-semibold rounded-lg"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }
    
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
        if (refCode && !code) {
            return <ReferralWelcome gift={referralGift} onRegister={() => setStatus('registering')} />;
        }
        return <UnauthenticatedWelcome reward={rewardPreview} onRegister={() => setStatus('registering')} />;
    }

    if (status === 'registering') {
        return (
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <RegisterForm 
                    claimCode={code} 
                    rewardPreview={referralGift || rewardPreview} 
                />
            </div>
        );
    }

    // Default loading/processing states
    if (['initializing', 'authenticating', 'claiming', 'success'].includes(status)) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">Processing...</h1>
                <p className="text-gray-600">Please wait a moment.</p>
            </div>
        );
    }

    return null; 
}

export default function ClaimPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
                <ClaimProcessor />
            </Suspense>
        </main>
    );
}