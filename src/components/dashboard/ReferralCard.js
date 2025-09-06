'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { UserPlusIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { triggerHapticFeedback } from '@/utils/haptics';
import { useConfig } from '@/context/ConfigContext';

/**
 * A dashboard card that serves as a call-to-action for the referral program.
 */
export default function ReferralCard() {
  const { settings } = useConfig();
  const bannerText = settings.brand_personality?.referral_banner_text || '🎁 Earn More By Inviting Your Friends';

  return (
    <Link href="/profile/refer" onClick={triggerHapticFeedback} className="block group">
      <motion.div
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      >
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex items-center p-4">
            <div className="bg-primary-foreground/20 p-3 rounded-full mr-4">
              <UserPlusIcon className="h-6 w-6" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold">{bannerText}</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 opacity-70 transition-transform group-hover:translate-x-1" />
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}