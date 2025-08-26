'use client';

import { motion } from 'framer-motion';
import { ShareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showToast } from './CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function NudgeOptionsModal({ options, closeModal }) {
  
  const handleShare = async (text) => {
    triggerHapticFeedback();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Reminder from a Friend',
          text: text,
        });
        showToast('success', 'Shared!', 'Your reminder has been sent.');
      } catch (error) {
        // This can happen if the user closes the share sheet
        console.log('Share cancelled', error);
      }
    } else {
      // Fallback for desktop browsers
      navigator.clipboard.writeText(text);
      showToast('success', 'Copied to Clipboard', 'Message ready to be pasted.');
    }
    closeModal();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Choose a Message</DialogTitle>
        <DialogDescription>
          Select a friendly reminder to send. It will open in your device's share menu.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 pt-4">
        {options.map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => handleShare(text)}
              className="w-full text-left p-4 rounded-lg bg-secondary hover:bg-muted transition-colors text-sm text-secondary-foreground"
            >
              <p>{text}</p>
            </button>
          </motion.div>
        ))}
      </div>
    </DialogContent>
  );
}