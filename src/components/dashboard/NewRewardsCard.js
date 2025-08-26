'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GiftIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function NewRewardsCard({ count, allRewardIds }) {
  // This effect runs when the component mounts, "clearing" the notification
  // by updating the list of seen rewards in local storage.
  useEffect(() => {
    localStorage.setItem('seenRewardIds', JSON.stringify(allRewardIds));
  }, [allRewardIds]);

  return (
    <motion.div
      className="relative flex flex-col justify-center items-center text-center w-full h-full p-8 text-white"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative z-10">
        <div className="mb-6">
          <GiftIcon className="w-16 h-16 mx-auto text-yellow-300" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Fresh Drops!</h1>
        <p className="text-lg text-white/80 mb-8">
          {count} new reward{count > 1 ? 's are' : ' is'} waiting for you in the catalog.
        </p>
        <Link href="/catalog" onClick={triggerHapticFeedback}>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 h-14 text-lg w-full">
            Check Them Out
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}