'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ImageWithLoader from '@/components/ImageWithLoader';
import { Button } from '@/components/ui/button';
import { triggerHapticFeedback } from '@/utils/haptics';
import { Badge } from '@/components/ui/badge';

export default function NextBestRewardCard({ reward, pointsNeeded }) {
  const imageUrl = reward.images?.[0]?.src || 'https://via.placeholder.com/300';

  return (
    <motion.div
      className="relative flex flex-col justify-between w-full h-full p-8 text-white text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Top Section for motivation */}
      <div className="relative z-10">
        <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-sm">
          You're So Close!
        </Badge>
      </div>

      {/* Middle Section for the Reward */}
      <div className="relative z-10 flex flex-col items-center flex-grow justify-center my-6">
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-lg mb-4">
          <ImageWithLoader src={imageUrl} alt={reward.name} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight">{reward.name}</h2>
        <p className="font-bold text-xl mt-2 text-yellow-300">
          Only {pointsNeeded.toLocaleString()} points away!
        </p>
      </div>

      {/* Bottom Section for the CTA */}
      <div className="relative z-10">
        <Link href={`/catalog/${reward.id}`} onClick={triggerHapticFeedback}>
          <Button size="lg" className="bg-white text-black hover:bg-white/90 h-14 text-lg w-full shadow-lg">
            View Reward
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}