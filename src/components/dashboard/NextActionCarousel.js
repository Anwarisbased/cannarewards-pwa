'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import ImageWithLoader from '../ImageWithLoader';
import { ArrowUpRightIcon, GiftIcon, FireIcon } from '@heroicons/react/24/solid';
import { triggerHapticFeedback } from '@/utils/haptics';

/**
 * A horizontal carousel of smart, contextual action cards for the dashboard.
 * @param {object} props
 * @param {object} props.user - The authenticated user object from AuthContext.
 */
export default function NextActionCarousel({ user }) {

  // Calculate the user's next best reward using useMemo for efficiency.
  const nextBestReward = useMemo(() => {
    if (!user || !user.eligibleRewards || user.points === undefined) return null;
    let bestCandidate = null;
    let smallestDifference = Infinity;
    user.eligibleRewards.forEach(reward => {
      if (reward.points_cost > user.points) {
        const difference = reward.points_cost - user.points;
        if (difference < smallestDifference) {
          smallestDifference = difference;
          bestCandidate = reward;
        }
      }
    });
    return bestCandidate ? { ...bestCandidate, pointsNeeded: smallestDifference } : null;
  }, [user]);

  // Build the list of actions to display based on user data.
  const actions = useMemo(() => {
    const availableActions = [];
    
    // Action 1: New Rewards
    if (user.newRewardsCount > 0) {
      availableActions.push({
        type: 'new_rewards',
        title: `${user.newRewardsCount} New Reward${user.newRewardsCount > 1 ? 's' : ''}`,
        subtitle: 'Recently added to the catalog',
        href: '/catalog',
        icon: FireIcon,
      });
    }

    // Action 2: Next Best Reward
    if (nextBestReward) {
      availableActions.push({
        type: 'next_best',
        title: nextBestReward.name,
        subtitle: `Only ${nextBestReward.pointsNeeded.toLocaleString()} points away!`,
        href: `/catalog/${nextBestReward.id}`,
        icon: GiftIcon,
        image: nextBestReward.images?.[0]?.src
      });
    }

    // Action 3: Scan Streak (assuming this will be added to the user object)
    if (user.scan_streak > 1) {
       availableActions.push({
        type: 'streak',
        title: `${user.scan_streak} Scan Streak!`,
        subtitle: `Your next scan gets a bonus`,
        href: '/scan',
        icon: ArrowUpRightIcon,
      });
    }

    return availableActions;
  }, [user, nextBestReward]);


  // If there are no relevant actions, don't render anything.
  if (actions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    >
      <h2 className="text-lg font-semibold text-foreground mb-3 px-1">What's Next?</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mb-4" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
        {actions.map((action, index) => (
          <Link href={action.href} key={index} onClick={triggerHapticFeedback} className="block flex-shrink-0 w-3/4 sm:w-1/2">
            <motion.div whileTap={{ scale: 0.98 }}>
              <Card className="overflow-hidden h-full group transition-shadow hover:shadow-lg">
                <CardContent className="p-4">
                  {action.image ? (
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border">
                            <ImageWithLoader src={action.image} alt={action.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-card-foreground leading-tight">{action.title}</p>
                            <p className="text-sm text-yellow-500 font-bold">{action.subtitle}</p>
                        </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="mr-4"><action.icon className="h-6 w-6 text-primary" /></div>
                      <div>
                        <p className="font-semibold text-card-foreground">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.subtitle}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
        {/* Empty div for scroll spacing */}
        <div className="flex-shrink-0 w-1"></div>
      </div>
    </motion.div>
  );
}