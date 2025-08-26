'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { QrCodeIcon, CircleStackIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { triggerHapticFeedback } from '@/utils/haptics';

/**
 * A dashboard card that provides clear, large-format buttons for the app's primary actions.
 */
export default function ActionCard() {

  // A reusable sub-component for each action item to keep the code DRY.
  const ActionButton = ({ href, icon: Icon, title, description }) => (
    <Link href={href} onClick={triggerHapticFeedback} className="block group">
      <motion.div whileTap={{ scale: 0.98, backgroundColor: 'hsl(var(--muted))' }}>
        <div className="flex items-center p-4 rounded-lg transition-colors group-hover:bg-muted">
          <div className="bg-secondary p-3 rounded-full mr-4">
            <Icon className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-card-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRightIcon className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
    </Link>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Apply a slight delay so it animates in after the StatusCard
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
    >
      <Card>
        <CardContent className="p-2 space-y-1">
          <ActionButton
            href="/scan"
            icon={QrCodeIcon}
            title="Scan Product"
            description="Earn points by scanning new items."
          />
          <ActionButton
            href="/catalog"
            icon={CircleStackIcon}
            title="Browse Rewards"
            description="See all the rewards you can redeem."
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}