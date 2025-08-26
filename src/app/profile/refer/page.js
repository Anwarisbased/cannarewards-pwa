'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { getMyReferrals, sendReferralNudge } from '@/services/rewardsService';
import DynamicHeader from '../../../components/DynamicHeader';
import { ShareIcon, ClipboardDocumentIcon, PaperAirplaneIcon, StarIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../../components/CustomToast';
import { triggerHapticFeedback } from '../../../utils/haptics';
import StaggeredList from '@/components/StaggeredList';
import NudgeOptionsModal from '@/components/NudgeOptionsModal';
import { motion } from 'framer-motion';

// --- SHADCN IMPORTS ---
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog } from '@/components/ui/dialog';
import ReferralSkeleton from '@/components/ReferralSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

// (ReferralStats and ReferralListItem components are unchanged)
const ReferralStats = ({ referrals }) => {
    const successfulReferrals = useMemo(() => referrals.filter(r => r.status_key === 'awarded'), [referrals]);
    const bonusPoints = useMemo(() => {
        const POINTS_PER_REFERRAL = 200; 
        return successfulReferrals.length * POINTS_PER_REFERRAL;
    }, [successfulReferrals]);

    return (
        <Card className="mt-4"><CardHeader><CardTitle className="text-lg">Your Impact</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4 text-center"><div><p className="text-3xl font-bold text-primary">{successfulReferrals.length}</p><p className="text-sm text-muted-foreground">Successful Referrals</p></div><div><p className="text-3xl font-bold text-primary">{bonusPoints.toLocaleString()}</p><p className="text-sm text-muted-foreground">Bonus Points Earned</p></div></div></CardContent></Card>
    );
};

const ReferralListItem = ({ referral, onNudge, nudgingEmail, isNew }) => {
    return (
        <Card className={isNew ? 'border-primary border-2 shadow-lg' : ''}><CardContent className="p-4 flex items-center justify-between"><div className="flex-1 min-w-0"><p className="font-semibold text-card-foreground truncate">{referral.name}</p><p className="text-sm text-muted-foreground">Joined on {referral.join_date}</p></div><div className="flex items-center ml-4 space-x-2">{isNew && <StarIcon className="h-5 w-5 text-yellow-400" />}<Badge variant={referral.status_key === 'awarded' ? 'default' : 'secondary'}>{referral.status}</Badge>{referral.status_key === 'pending' && (<Button onClick={() => onNudge(referral.email)} disabled={nudgingEmail === referral.email} variant="ghost" size="icon" className="h-8 w-8">{nudgingEmail === referral.email ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <PaperAirplaneIcon className="h-4 w-4" />}</Button>)}</div></CardContent></Card>
    );
};


export default function ReferPage() {
    const { user, loading } = useAuth();
    const [referrals, setReferrals] = useState([]);
    const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
    const [nudgingEmail, setNudgingEmail] = useState(null);
    const [newlyAwarded, setNewlyAwarded] = useState([]);
    const [nudgeOptions, setNudgeOptions] = useState([]);
    const [isNudgeModalOpen, setIsNudgeModalOpen] = useState(false);
    
    // --- FIX #1: Dedicated state for link generation ---
    const [referralLink, setReferralLink] = useState('');
    const [isLinkLoading, setIsLinkLoading] = useState(true);

    useEffect(() => {
      // This effect ensures window.location.origin is only accessed on the client-side.
      if (typeof window !== 'undefined' && user?.referralCode) {
        const siteUrl = window.location.origin;
        setReferralLink(`${siteUrl}/claim?ref=${user.referralCode}`);
        setIsLinkLoading(false); // Link is ready
      }
    }, [user]);


    useEffect(() => {
        if (user) {
            const fetchReferrals = async () => {
                setIsLoadingReferrals(true);
                try {
                    const data = await getMyReferrals(); setReferrals(data);
                    const awardedEmails = data.filter(r => r.status_key === 'awarded').map(r => r.email);
                    const seenAwarded = JSON.parse(localStorage.getItem('seenAwardedReferrals') || '[]');
                    const newAwards = awardedEmails.filter(email => !seenAwarded.includes(email));
                    if (newAwards.length > 0) {
                        setNewlyAwarded(newAwards);
                        localStorage.setItem('seenAwardedReferrals', JSON.stringify(awardedEmails));
                    }
                } catch (error) { showToast('error', 'Error', 'Could not load your referral history.');
                } finally { setIsLoadingReferrals(false); }
            };
            fetchReferrals();
        }
    }, [user]);
    
    const handleNudge = async (email) => { /* ... unchanged ... */ };

    if (loading || !user) { return <div className="text-center p-10">Loading...</div>; }

    const handleCopy = () => { 
        if (isLinkLoading) return;
        triggerHapticFeedback();
        navigator.clipboard.writeText(referralLink);
        showToast('success', 'Copied!', 'Referral link copied to clipboard.');
     };
    const handleShare = async () => { 
        if (isLinkLoading) return;
        triggerHapticFeedback();
        if(navigator.share) {
            try { await navigator.share({ title: 'Join me on CannaRewards!', text: `Sign up for CannaRewards with my link and get a special welcome gift!`, url: referralLink });
            } catch (error) { console.log('Share failed', error); }
        } else { handleCopy(); }
     };

    return (
        <main className="p-4 bg-gray-50 min-h-screen" style={{ paddingBottom: '5rem' }}>
            <div className="w-full max-w-md mx-auto">
                <DynamicHeader title="Invite & Earn" backLink="/" />
                
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
                             {/* --- FIX #2: Corrected structure for the copy button --- */}
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

                {!isLoadingReferrals && <ReferralStats referrals={referrals} />}
                <Separator className="my-8" />
                <h2 className="text-2xl font-bold text-foreground">My Referrals</h2>
                
                {isLoadingReferrals ? (
                    <div className="space-y-3 mt-4"><ReferralSkeleton /><ReferralSkeleton /><ReferralSkeleton /></div>
                ) : referrals.length > 0 ? (
                    <StaggeredList className="space-y-3 mt-4">
                        {referrals.map((ref) => ( <ReferralListItem key={ref.email} referral={ref} onNudge={handleNudge} nudgingEmail={nudgingEmail} isNew={newlyAwarded.includes(ref.email)} /> ))}
                    </StaggeredList>
                ) : (
                    <div className="text-center bg-secondary p-6 rounded-lg mt-6"><p className="text-muted-foreground">You haven't referred any friends yet. Share your link to start earning!</p></div>
                )}

                <Dialog open={isNudgeModalOpen} onOpenChange={setIsNudgeModalOpen}>
                    {isNudgeModalOpen && <NudgeOptionsModal options={nudgeOptions} closeModal={() => setIsNudgeModalOpen(false)} />}
                </Dialog>
            </div>
        </main>
    );
}