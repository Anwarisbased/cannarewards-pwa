'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { getMyReferrals, sendReferralNudge } from '@/services/rewardsService';
import DynamicHeader from '../../../components/DynamicHeader';
import { ShareIcon, ClipboardDocumentIcon, PaperAirplaneIcon, StarIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../../components/CustomToast';
import { triggerHapticFeedback } from '../../../utils/haptics';

// --- SHADCN IMPORTS & NEW SKELETON IMPORT ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ReferralSkeleton from '@/components/ReferralSkeleton'; // <-- NEW IMPORT
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/skeleton";


const ReferralList = ({ referrals, onNudge, nudgingEmail, successfulReferrals, bonusPoints }) => {
    // If there are no referrals AFTER loading, show the empty state message.
    if (referrals.length === 0) {
        return (
            <div className="text-center bg-secondary p-6 rounded-lg mt-6">
                <p className="text-muted-foreground">You haven't referred any friends yet. Share your link to start earning bonuses!</p>
            </div>
        );
    }
    
    return (
        <>
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="text-lg">Your Impact</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-3xl font-bold text-primary">{successfulReferrals.length}</p>
                            <p className="text-sm text-muted-foreground">Successful Referrals</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">{bonusPoints.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Bonus Points Earned</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="space-y-3 mt-4">
                {referrals.map((ref, index) => (
                    <ReferralListItem key={index} referral={ref} onNudge={onNudge} nudgingEmail={nudgingEmail} isNew={false} />
                ))}
            </div>
        </>
    );
};

const ReferralListItem = ({ referral, onNudge, nudgingEmail, isNew }) => {
    return (
        <Card className={isNew ? 'border-primary border-2 shadow-lg' : ''}>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-card-foreground truncate">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">Joined on {referral.join_date}</p>
                </div>
                <div className="flex items-center ml-4 space-x-2">
                    {isNew && <StarIcon className="h-5 w-5 text-yellow-400" />}
                    <Badge variant={referral.status_key === 'awarded' ? 'default' : 'secondary'}>{referral.status}</Badge>
                    {referral.status_key === 'pending' && (
                        <Button onClick={() => onNudge(referral.email)} disabled={nudgingEmail === referral.email} variant="ghost" size="icon" className="h-8 w-8">
                            {nudgingEmail === referral.email ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <PaperAirplaneIcon className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


export default function ReferPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [referrals, setReferrals] = useState([]);
    const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
    const [nudgingEmail, setNudgingEmail] = useState(null);
    const [newlyAwarded, setNewlyAwarded] = useState([]);
    const [nudgeOptions, setNudgeOptions] = useState([]);
    const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
    
    const [referralLink, setReferralLink] = useState('');
    const [isLinkLoading, setIsLinkLoading] = useState(true);

    useEffect(() => {
      const code = user?.referralCode;
      if (typeof window !== 'undefined' && code) {
        const siteUrl = window.location.origin;
        setReferralLink(`${siteUrl}/claim?ref=${code}`);
        setIsLinkLoading(false);
      }
    }, [user?.referralCode]);

    useEffect(() => {
        if (user) {
            const fetchReferrals = async () => {
                setIsLoadingReferrals(true); // Ensure loading is true at start
                try {
                    const data = await getMyReferrals();
                    setReferrals(data);
                } catch (error) {
                    showToast('error', 'Error', 'Could not load your referral history.');
                } finally {
                    setIsLoadingReferrals(false);
                }
            };
            fetchReferrals();
        }
    }, [user]);
    
    const handleNudge = async (email) => {
        setNudgingEmail(email); // Show loading spinner on the button
        triggerHapticFeedback();
        try {
            const response = await sendReferralNudge(email);
            if (response.success && response.share_options) {
                setNudgeOptions(response.share_options);
                setIsNudgeModalOpen(true);
            }
        } catch (error) {
            showToast('error', 'Error', error.message || 'Could not send nudge.');
        } finally {
            setNudgingEmail(null); // Stop loading spinner
        }
    };

    const handleCopy = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink);
            showToast('success', 'Copied!', 'Referral link copied to clipboard.');
            triggerHapticFeedback('success');
        }
    };
    const handleShare = async () => {
        if (navigator.share && referralLink) {
            try {
                await navigator.share({
                    title: 'Join CannaRewards!',
                    text: 'Hey! I use CannaRewards to get points for my purchases. Sign up with my link and we both get a bonus!',
                    url: referralLink,
                });
                triggerHapticFeedback('success');
            } catch (error) {
                console.error('Error sharing:', error);
                triggerHapticFeedback('error');
            }
        } else {
            handleCopy();
        }
    };

    if (loading || !user) { return <div className="text-center p-10">Loading...</div>; }

    const successfulReferrals = referrals.filter(r => r.status_key === 'awarded');
    const bonusPoints = successfulReferrals.reduce((acc, curr) => acc + (curr.bonus_points || 0), 0);


    return (
        <main className="p-4 bg-gray-50 min-h-screen" style={{ paddingBottom: '5rem' }}>
            <div className="w-full max-w-md mx-auto">
                <DynamicHeader title="Invite & Earn" backLink="/my-points" />
                
                <Card className="mt-4">
                     <CardContent className="p-6 text-center space-y-6">
                         <div className="p-4 bg-white border rounded-lg inline-block">
                             {isLinkLoading ? (
                                <Skeleton className="w-[180px] h-[180px]" />
                             ) : (
                                <QRCodeCanvas value={referralLink} size={180} level={"H"} includeMargin={true} />
                             )}
                         </div>
                         <p className="text-muted-foreground">
                             Share your unique link. When friends sign up and scan their first product, you both earn bonus points!
                         </p>
                         <div className="relative">
                             <Input value={isLinkLoading ? 'Generating your link...' : referralLink} readOnly disabled={isLinkLoading} className="pr-12" />
                             <div className="absolute top-1/2 right-1 -translate-y-1/2">
                                <motion.div whileTap={{ scale: 1.0 }}>
                                    <Button onClick={handleCopy} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={isLinkLoading}>
                                        <ClipboardDocumentIcon className="h-5 w-5" />
                                    </Button>
                                </motion.div>
                             </div>
                         </div>
                         <Button onClick={handleShare} className="w-full text-md h-12" disabled={isLinkLoading}>
                             <ShareIcon className="h-5 w-5 mr-2" />
                             Share My Link
                         </Button>
                     </CardContent>
                </Card>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold text-foreground">My Referrals</h2>
                
                {isLoadingReferrals ? (
                    <div className="space-y-3 mt-4">
                        <ReferralSkeleton />
                        <ReferralSkeleton />
                        <ReferralSkeleton />
                    </div>
                ) : (
                    <ReferralList 
                        referrals={referrals} 
                        onNudge={handleNudge} 
                        nudgingEmail={nudgingEmail}
                        successfulReferrals={successfulReferrals}
                        bonusPoints={bonusPoints}
                    />
                )}
            </div>
        </main>
    );
}