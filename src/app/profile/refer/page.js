'use client';

import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
// --- THIS IS THE CORRECTED IMPORT ---
import { QRCodeCanvas } from 'qrcode.react';
import AnimatedPage from '../../../components/AnimatedPage';
import DynamicHeader from '../../../components/DynamicHeader';
import { ShareIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../../components/CustomToast';
import { triggerHapticFeedback } from '../../../utils/haptics';

export default function ReferPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div className="text-center p-10">Loading...</div>;
    }
    if (!user) {
        router.push('/');
        return null;
    }

    const referralLink = process.env.NODE_ENV === 'production' 
        ? `https://cannarewards-pwa.vercel.app/claim?ref=${user.referralCode}`
        : `http://localhost:3000/claim?ref=${user.referralCode}`;


    const handleCopy = () => {
        triggerHapticFeedback();
        navigator.clipboard.writeText(referralLink);
        showToast('success', 'Copied!', 'Referral link copied to clipboard.');
    };
    
    const handleShare = async () => {
        triggerHapticFeedback();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join CannaRewards!',
                    text: 'Hey! Use my referral link to sign up and we both get a bonus.',
                    url: referralLink,
                });
            } catch (error) {
                console.error('Share failed:', error);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <AnimatedPage>
            <main className="p-4 bg-white min-h-screen">
                <div className="w-full max-w-md mx-auto">
                    <DynamicHeader title="Invite a Friend" backLink="/my-points" />
                    
                    <div className="flex flex-col items-center mt-8 space-y-6">
                        <div className="p-4 bg-white border rounded-lg shadow-sm">
                            {/* --- THIS IS THE CORRECTED COMPONENT NAME --- */}
                            <QRCodeCanvas
                                value={referralLink}
                                size={256}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>

                        <div className="flex w-full items-center">
                            <p className="flex-grow p-3 bg-gray-100 text-gray-700 font-mono text-sm rounded-l-md truncate">
                                {user.referralCode}
                            </p>
                            <button 
                                onClick={handleCopy}
                                className="p-3 bg-gray-800 text-white rounded-r-md hover:bg-black"
                            >
                                <ClipboardDocumentIcon className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <button 
                            onClick={handleShare}
                            className="w-full p-4 bg-primary text-white font-bold rounded-lg flex items-center justify-center text-lg"
                        >
                            <ShareIcon className="h-6 w-6 mr-3" />
                            Share Link
                        </button>
                    </div>
                </div>
            </main>
        </AnimatedPage>
    );
}