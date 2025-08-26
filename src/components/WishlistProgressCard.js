'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AnimatedProgressBar from '@/components/AnimatedProgressBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function WishlistProgressCard() {
  const { user } = useAuth();

  if (!user || !user.wishlist || user.wishlist.length === 0) {
    return null; // Don't render if there's no wishlist
  }

  const { points, wishlist, eligibleRewards } = user;

  // Find the most expensive item on the wishlist
  const wishlistItems = eligibleRewards.filter(reward => wishlist.includes(reward.id));
  
  if (wishlistItems.length === 0) {
    return null;
  }

  const mostExpensiveItem = wishlistItems.sort((a, b) => b.points_cost - a.points_cost)[0];

  if (points >= mostExpensiveItem.points_cost) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>You can afford an item on your wishlist!</CardTitle>
            </CardHeader>
            <CardContent>
                <Link href="/catalog" className="text-sm font-medium text-primary hover:underline">
                    Go to your wishlist to redeem
                </Link>
            </CardContent>
        </Card>
    );
  }

  const progressPercentage = (points / mostExpensiveItem.points_cost) * 100;
  const pointsNeeded = mostExpensiveItem.points_cost - points;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist Goal: {mostExpensiveItem.name}</CardTitle>
        <CardDescription>{pointsNeeded.toLocaleString()} points to go!</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatedProgressBar progress={progressPercentage} />
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>{points.toLocaleString()}</span>
          <span>{mostExpensiveItem.points_cost.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}