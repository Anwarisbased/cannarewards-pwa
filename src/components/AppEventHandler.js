'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';

/**
 * A global event handler component that listens for significant user state changes
 * and triggers corresponding UI events, like modals.
 */
export default function AppEventHandler() {
  const { user } = useAuth();
  const { openRankUpModal } = useModal();
  
  // Use a ref to track the previous rank without causing re-renders.
  const previousRankKey = useRef(user?.rank?.key);

  useEffect(() => {
    // Ensure we have a user and all the necessary data to perform a check.
    if (user && user.rank && user.allRanks && previousRankKey.current) {
      const currentRankKey = user.rank.key;
      const allRanks = user.allRanks;

      // Check if the rank has actually changed since the last time we checked.
      if (currentRankKey !== previousRankKey.current) {
        const currentRankPoints = allRanks[currentRankKey]?.points ?? 0;
        const previousRankPoints = allRanks[previousRankKey.current]?.points ?? 0;

        // If the new rank has more points, it's a promotion!
        if (currentRankPoints > previousRankPoints) {
          openRankUpModal({
            fromRank: allRanks[previousRankKey.current],
            toRank: allRanks[currentRankKey],
          });
        }
      }
    }

    // After the check, update the ref to the current rank for the next comparison.
    if (user && user.rank) {
      previousRankKey.current = user.rank.key;
    }
  }, [user, openRankUpModal]);

  // This component renders nothing to the DOM.
  return null;
}