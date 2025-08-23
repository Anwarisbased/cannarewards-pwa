'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { getMyReferrals, sendReferralNudge } from '@/services/rewardsService';
import DynamicHeader from '../../../components/DynamicHeader';
import { ShareIcon, ClipboardDocumentIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../../components/CustomToast';
import { triggerHapticFeedback } from '../../../utils/haptics';

// --- SHADCN IMPORTS & NEW SKELETON IMPORT ---
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ReferralSkeleton from '@/components/ReferralSkeleton'; // <-- NEW IMPORT

const ReferralList = ({ referrals, onNudge, nudgingEmail }) => {
    // If there are no referrals AFTER loading, show the empty state message.
    if (referrals.length === 0) {
        return (
            <div className="text-center bg-secondary p-6 rounded-lg mt-6">
                <p className="text-muted-foreground">You haven't referred any friends yet. Share your link to start earning bonuses!</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-3 mt-4">
            {referrals.map((ref, index) => (
                <Card key={index}>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-card-foreground truncate">{ref.name}</p>
                            <p className="text-sm text-muted-foreground">Joined on {ref.join_date}</p>
                        </div>
                        <div className="flex items-center ml-4 space-x-2">
                            <Badge variant={ref.status_key === 'awarded' ? 'default' : 'secondary'}>{ref.status}</Badge>
                            {ref.status_key === 'pending' && (
                                <Button
                                    onClick={() => onNudge(ref.email)}
                                    disabled={nudgingEmail === ref.email}
                                    variant="ghost" size="icon" className="h-8 w-8">
                                    {nudgingEmail === ref.email 
                                        ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        : <PaperAirplaneIcon className="h-4 w-4" />}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};


export default function ReferPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [referrals, setReferrals] = useState([]);
    const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
    const [nudgingEmail, setNudgingEmail] = useState(null);

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

    // --- All other logic and handlers remain the same ---
    const handleNudge = async (email) => { /* ... existing logic ... */ };
    if (loading || !user) { return <div className="text-center p-10">Loading...</div>; }
    const siteUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const referralLink = `${siteUrl}/claim?ref=${user.referralCode}`;
    const handleCopy = () => { /* ... existing logic ... */ };
    const handleShare = async () => { /* ... existing logic ... */ };

    return (
        <main className="p-4 bg-gray-50 min-h-screen" style={{ paddingBottom: '5rem' }}>
            <div className="w-full max-w-md mx-auto">
                <DynamicHeader title="Invite & Earn" backLink="/my-points" />
                
                <Card className="mt-4">
                    <CardContent className="p-6 text-center space-y-6">
                        <div className="p-4 bg-white border rounded-lg inline-block">
                            <QRCodeCanvas value={referralLink} size={180} level={"H"} includeMargin={true} />
                        </div>
                        <p className="text-muted-foreground">
                            Share your unique link with friends. When they sign up and scan their first product, you both earn bonus points!
                        </p>
                        <div className="relative">
                            <Input value={referralLink} readOnly className="pr-10" />
                            <Button 
                                onClick={handleCopy} 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 text-muted-foreground"
                            >
                                <ClipboardDocumentIcon className="h-5 w-5" />
                                <span className="sr-only">Copy Link</span>
                            </Button>
                        </div>
                        <Button onClick={handleShare} className="w-full text-md h-12">
                            <ShareIcon className="h-5 w-5 mr-2" />
                            Share My Link
                        </Button>
                    </CardContent>
                </Card>

                <Separator className="my-8" />

                <h2 className="text-2xl font-bold text-foreground">My Referrals</h2>
                
                {/* --- THIS IS THE NEW LOGIC BLOCK --- */}
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
                    />
                )}
                {/* --- END NEW LOGIC BLOCK --- */}
            </div>
        </main>
    );
}