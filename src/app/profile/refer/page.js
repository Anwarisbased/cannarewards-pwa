'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';
import { getMyReferrals, getNudgeOptions } from '@/services/referralService';
import DynamicHeader from '@/components/DynamicHeader';
import {
  ShareIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { showToast } from '@/components/CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';
import StaggeredList from '@/components/StaggeredList';
import NudgeOptionsModal from '@/components/NudgeOptionsModal';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog } from '@/components/ui/dialog';
import ReferralSkeleton from '@/components/ReferralSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import PageContainer from '@/components/PageContainer';

const ReferralStats = ({ referrals }) => {
  const successfulReferrals = useMemo(
    () => referrals.filter((r) => r.status_key === 'awarded'),
    [referrals]
  );
  const bonusPoints = useMemo(() => {
    // This should later be pulled from a config setting
    const POINTS_PER_REFERRAL = 200;
    return successfulReferrals.length * POINTS_PER_REFERRAL;
  }, [successfulReferrals]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Your Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">
              {successfulReferrals.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Successful Referrals
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">
              {bonusPoints.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Bonus Points Earned</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ReferralListItem = ({ referral, onNudge, nudgingEmail, isNew }) => {
  return (
    <Card className={isNew ? 'border-2 border-primary shadow-lg' : ''}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-card-foreground">
            {referral.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Joined on {referral.join_date}
          </p>
        </div>
        <div className="ml-4 flex items-center space-x-2">
          {isNew && <StarIcon className="h-5 w-5 text-yellow-400" />}
          <Badge
            variant={
              referral.status_key === 'awarded' ? 'default' : 'secondary'
            }
          >
            {referral.status}
          </Badge>
          {referral.status_key === 'pending' && (
            <Button
              onClick={() => onNudge(referral.email)}
              disabled={nudgingEmail === referral.email}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              {nudgingEmail === referral.email ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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
  const [referralLink, setReferralLink] = useState('');
  const [isLinkLoading, setIsLinkLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.referral_code) {
      const siteUrl = window.location.origin;
      setReferralLink(`${siteUrl}/claim?ref=${user.referral_code}`);
      setIsLinkLoading(false);
    } else if (user && !user.referral_code) {
      setIsLinkLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchReferrals = async () => {
        setIsLoadingReferrals(true);
        try {
          const data = await getMyReferrals();
          setReferrals(data);

          const awardedEmails = data
            .filter((r) => r.status_key === 'awarded')
            .map((r) => r.email);
          const seenAwarded = JSON.parse(
            localStorage.getItem('seenAwardedReferrals') || '[]'
          );
          const newAwards = awardedEmails.filter(
            (email) => !seenAwarded.includes(email)
          );

          if (newAwards.length > 0) {
            setNewlyAwarded(newAwards);
            localStorage.setItem(
              'seenAwardedReferrals',
              JSON.stringify(awardedEmails)
            );
          }
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
    setNudgingEmail(email);
    triggerHapticFeedback();
    try {
      const data = await getNudgeOptions(email);
      if (data.share_options) {
        setNudgeOptions(data.share_options);
        setIsNudgeModalOpen(true);
      }
    } catch (error) {
      showToast('error', 'Error', error.message);
    } finally {
      setNudgingEmail(null);
    }
  };

  const handleCopy = () => {
    if (isLinkLoading || !referralLink) return;
    triggerHapticFeedback();
    navigator.clipboard.writeText(referralLink);
    showToast('success', 'Copied!', 'Referral link copied to clipboard.');
  };

  const handleShare = async () => {
    if (isLinkLoading || !referralLink) return;
    triggerHapticFeedback();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on CannaRewards!',
          text: `Sign up for CannaRewards with my link and get a special welcome gift!`,
          url: referralLink,
        });
      } catch (error) {
        console.log('Share failed', error);
      }
    } else {
      handleCopy();
    }
  };

  if (loading || !user) {
    return (
      <PageContainer>
        <DynamicHeader title="Invite & Earn" backLink="/" />
        <ReferralSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DynamicHeader title="Invite & Earn" backLink="/" />

      <Card className="mt-4">
        <CardContent className="space-y-6 p-6 text-center">
          <div className="inline-block rounded-lg border bg-white p-4">
            {isLinkLoading ? (
              <Skeleton className="h-[180px] w-[180px]" />
            ) : (
              <QRCodeCanvas
                value={referralLink || 'https://cannarewards.app'}
                size={180}
                level={'H'}
                includeMargin={true}
              />
            )}
          </div>
          <p className="text-muted-foreground">
            Share your unique link. When friends sign up and scan their first
            product, you both earn bonus points!
          </p>
          <div className="relative">
            <Input
              value={
                isLinkLoading
                  ? 'Generating your link...'
                  : referralLink || 'No link available'
              }
              readOnly
              disabled={isLinkLoading}
              className="pr-12"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
              <motion.div whileTap={{ scale: 1.0 }}>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  disabled={isLinkLoading || !referralLink}
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </div>
          <Button
            onClick={handleShare}
            className="text-md h-12 w-full"
            disabled={isLinkLoading || !referralLink}
          >
            <ShareIcon className="mr-2 h-5 w-5" />
            Share My Link
          </Button>
        </CardContent>
      </Card>

      {!isLoadingReferrals && <ReferralStats referrals={referrals} />}
      <Separator className="my-8" />
      <h2 className="text-2xl font-bold text-foreground">My Referrals</h2>

      {isLoadingReferrals ? (
        <div className="mt-4 space-y-3">
          <ReferralSkeleton />
          <ReferralSkeleton />
          <ReferralSkeleton />
        </div>
      ) : referrals.length > 0 ? (
        <StaggeredList className="mt-4 space-y-3">
          {referrals.map((ref) => (
            <ReferralListItem
              key={ref.email}
              referral={ref}
              onNudge={handleNudge}
              nudgingEmail={nudgingEmail}
              isNew={newlyAwarded.includes(ref.email)}
            />
          ))}
        </StaggeredList>
      ) : (
        <div className="mt-6 rounded-lg bg-secondary p-6 text-center">
          <p className="text-muted-foreground">
            You haven't referred any friends yet. Share your link to start
            earning!
          </p>
        </div>
      )}

      <Dialog open={isNudgeModalOpen} onOpenChange={setIsNudgeModalOpen}>
        {isNudgeModalOpen && (
          <NudgeOptionsModal
            options={nudgeOptions}
            closeModal={() => setIsNudgeModalOpen(false)}
          />
        )}
      </Dialog>
    </PageContainer>
  );
}
