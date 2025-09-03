'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { triggerHapticFeedback } from '@/utils/haptics';
import { useEffect } from 'react';
import { useModal } from '@/context/ModalContext';

export default function AchievementUnlockedModal({ details, closeModal }) {
  const router = useRouter();
  const { triggerConfetti } = useModal();

  // Trigger effects when the modal appears
  useEffect(() => {
    triggerHapticFeedback();
    triggerConfetti();
  }, [triggerConfetti]);

  if (!details || !details.key) {
    return null;
  }

  const handleViewBadges = () => {
    closeModal();
    router.push('/profile/badges');
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-500">
            <SparklesIcon className="h-12 w-12" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Achievement Unlocked!
          </DialogTitle>
          <DialogDescription className="pt-2 text-lg font-semibold text-foreground">
            {details.name}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-muted-foreground">
            You've earned {details.points_reward} bonus points! You can view all
            your unlocked badges in your Trophy Case.
          </p>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={closeModal} variant="secondary" className="w-full">
            Continue
          </Button>
          <Button onClick={handleViewBadges} className="w-full">
            View Trophy Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
