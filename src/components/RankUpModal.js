'use client';

import { useEffect } from 'react';
import { useModal } from '@/context/ModalContext';
import { triggerHapticFeedback } from '@/utils/haptics';
import { StarIcon } from '@heroicons/react/24/solid';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Define rank styles for a consistent, themed look
const rankStyles = {
  member: { cardClasses: 'bg-slate-500 text-white' },
  bronze: { cardClasses: 'bg-amber-700 text-white' },
  silver: { cardClasses: 'bg-slate-300 text-slate-800' },
  gold: { cardClasses: 'bg-yellow-400 text-yellow-900' },
  default: { cardClasses: 'bg-gray-800 text-white' },
};

export default function RankUpModal({ details, closeModal }) {
  const { triggerConfetti } = useModal();

  useEffect(() => {
    triggerHapticFeedback();
    triggerConfetti();
  }, [triggerConfetti]);

  if (!details || !details.toRank) {
    return null;
  }

  const { toRank } = details;
  const currentStyle =
    rankStyles[toRank.name.toLowerCase()] || rankStyles.default;

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className="overflow-hidden p-0 text-center sm:max-w-md">
        <div className="p-8">
          <StarIcon className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
          <DialogHeader>
            <DialogTitle className="mb-2 text-3xl font-bold text-foreground">
              You've Leveled Up!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Congratulations! You've reached a new tier.
            </DialogDescription>
          </DialogHeader>

          <Card
            className={`my-6 flex h-52 w-full flex-col justify-between ${currentStyle.cardClasses}`}
          >
            <CardHeader>
              <CardTitle className="text-4xl font-bold uppercase tracking-wider">
                {toRank.name}
              </CardTitle>
              <CardDescription
                className={
                  currentStyle.cardClasses.includes('text-white')
                    ? 'text-white/80'
                    : 'text-muted-foreground'
                }
              >
                Reach {toRank.points.toLocaleString()} lifetime points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">UNLOCKED</p>
            </CardContent>
          </Card>

          <div className="my-6 text-left">
            <h3 className="mb-2 font-semibold text-foreground">
              New Benefits Unlocked:
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {toRank.benefits?.length > 0 ? (
                toRank.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))
              ) : (
                <li>Exclusive access to future rewards.</li>
              )}
            </ul>
          </div>

          <Button onClick={closeModal} className="h-12 w-full text-lg">
            Awesome!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
