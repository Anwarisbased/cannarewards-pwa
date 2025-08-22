'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { getMyReferrals, sendReferralNudge } from '@/services/rewardsService';
import AnimatedPage from '../../../components/AnimatedPage';
import DynamicHeader from '../../../components/DynamicHeader';
import { ShareIcon, ClipboardDocumentIcon, ClockIcon, CheckCircleIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../../components/CustomToast';
import { triggerHapticFeedback } from '../../../utils/haptics';
import { motion } from 'framer-motion';

const ReferralList = ({ referrals, onNudge, nudgingEmail }) => {
    if (referrals.length === 0) {
        return (
            <div className="text-center bg-gray-50 p-6 rounded-lg mt-8">
                <p className="text-gray-600">You haven't referred any friends yet. Share your link to start earning bonuses!</p>
            </div>
        );
    }
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            className="space-y-3 mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {referrals.map((ref, index) => (
                <motion.div 
                    key={index} 
                    className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200"
                    variants={itemVariants}
                >
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{ref.name}</p>
                        <p className="text-sm text-gray-500">Joined on {ref.join_date}</p>
                    </div>
                    <div className="flex items-center ml-4">
                        <div className={`flex items-center text-sm font-medium px-2.5 py-1 rounded-full ${
                            ref.status_key === 'awarded' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {ref.status_key === 'awarded' 
                                ? <CheckCircleIcon className="h-4 w-4 mr-1.5" /> 
                                : <ClockIcon className="h-4 w-4 mr-1.5" />}
                            {ref.status}
                        </div>
                        
                        {/* --- THE NEW NUDGE BUTTON --- */}
                        {ref.status_key === 'pending' && (
                            <button
                                onClick={() => onNudge(ref.email)}
                                disabled={nudgingEmail === ref.email}
                                className="ml-3 p-2 text-sm font-medium text-white bg-primary rounded-full hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                title="Send a reminder"
                            >
                                {nudgingEmail === ref.email 
                                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    : <PaperAirplaneIcon className="h-4 w-4" />}
                            </button>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};


export default function ReferPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    const [referrals, setReferrals] = useState([]);
    const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
    const [nudgingEmail, setNudgingEmail] = useState(null); // State for loading spinner

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const data = await getMyReferrals();
                setReferrals(data);
            } catch (error) {
                showToast('error', 'Error', 'Could not load your referral history.');
            } finally {
                setIsLoadingReferrals(false);
            }
        };

        if (user) {
            fetchReferrals();
        }
    }, [user]);

    const handleNudge = async (email) => {
        setNudgingEmail(email);
        triggerHapticFeedback();
        try {
            const response = await sendReferralNudge(email);

            if (navigator.share) {
                await navigator.share({
                    title: 'CannaRewards Reminder',
                    text: response.share_text,
                });
                showToast('success', 'Nudge Sent!', 'Your reminder has been shared.');
            } else {
                // Fallback for desktops: copy the message to clipboard
                navigator.clipboard.writeText(response.share_text);
                showToast('success', 'Message Copied', 'Reminder message copied. You can now paste it to your friend.');
            }

        } catch (error) {
            showToast('error', 'Could Not Nudge', error.message);
        } finally {
            setNudgingEmail(null);
        }
    };

    if (loading || !user) {
        return <div className="text-center p-10">Loading...</div>;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const referralLink = `${siteUrl}/claim?ref=${user.referralCode}`;

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
                    text: "Hey! Use my referral link to sign up for CannaRewards and we'll both get a bonus when you make your first scan.",
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
            <main className="p-4 bg-gray-50 min-h-screen" style={{ paddingBottom: '5rem' }}>
                <div className="w-full max-w-md mx-auto">
                    <DynamicHeader title="Invite & Earn" backLink="/my-points" />
                    
                    <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="p-4 bg-white border rounded-lg">
                                <QRCodeCanvas
                                    value={referralLink}
                                    size={200}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>

                            <p className="text-center text-gray-600">Share your unique link with friends. When they sign up and scan their first product, you both earn bonus points!</p>
                            
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
                                Share My Link
                            </button>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mt-8 text-gray-800">My Referrals</h2>
                    {isLoadingReferrals ? (
                        <p className="text-center mt-4">Loading referrals...</p>
                    ) : (
                        <ReferralList 
                            referrals={referrals} 
                            onNudge={handleNudge} 
                            nudgingEmail={nudgingEmail} 
                        />
                    )}
                </div>
            </main>
        </AnimatedPage>
    );
}