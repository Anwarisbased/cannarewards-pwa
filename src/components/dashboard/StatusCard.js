'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import AnimatedCounter from '../AnimatedCounter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from '@heroicons/react/24/solid';

/**
 * The primary "hero" card for the dashboard.
 * Displays the user's name, rank, and animated points total.
 * @param {object} props
 * @param {object} props.user - The authenticated user object from AuthContext.
 */
export default function StatusCard({ user }) {
  if (!user) {
    // Render a skeleton or null if user data isn't ready
    return (
        <Card className="animate-pulse">
            <CardHeader><div className="h-8 bg-muted rounded w-3/4"></div><div className="h-4 bg-muted rounded w-1/2"></div></CardHeader>
            <CardContent><div className="h-16 bg-muted rounded w-1/2 mx-auto"></div></CardContent>
            <CardFooter><div className="h-6 bg-muted rounded w-1/4 ml-auto"></div></CardFooter>
        </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight capitalize">
            Welcome, {user.firstName || 'Member'}
          </CardTitle>
          <CardDescription>{user.rank.name || 'Member'} Tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <span className="text-6xl font-bold text-primary tracking-tighter">
              {/* --- FIX: Use the correct 'points_balance' key --- */}
              <AnimatedCounter value={user.points_balance || 0} />
            </span>
            <p className="text-sm text-muted-foreground mt-1">Total Points</p>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary/50 p-3">
          <Link href="/how-to-earn" className="w-full">
            <Button variant="link" size="sm" className="w-full text-secondary-foreground/80">
              View All Ranks & Benefits
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}