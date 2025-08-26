'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AnimatedProgressBar from '@/components/AnimatedProgressBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NextBestRewardCard() {
  const { user } = useAuth();

  if (!user || !user.eligibleRewards) {
    return null;
  }

  const { points, eligibleRewards } = user;

  // Find the next affordable reward
  const sortedRewards = [...eligibleRewards]
    .filter(r => r.isInStock)
    .sort((a, b) => a.points_cost - b.points_cost);
    
  const nextReward = sortedRewards.find(reward => reward.points_cost > points);

  if (!nextReward) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>You can afford all available rewards!</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/catalog" className="text-sm font-medium text-primary hover:underline">
            Browse the catalog now
          </Link>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = (points / nextReward.points_cost) * 100;
  const pointsNeeded = nextReward.points_cost - points;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Reward: {nextReward.name}</CardTitle>
        <CardDescription>{pointsNeeded.toLocaleString()} points to go!</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatedProgressBar progress={progressPercentage} />
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>{points.toLocaleString()}</span>
          <span>{nextReward.points_cost.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}