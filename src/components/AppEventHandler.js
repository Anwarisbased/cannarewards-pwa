'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { useConfig } from '@/context/ConfigContext';

/**
 * A global, invisible event handler component that listens for significant
 * user state changes from the AuthContext and triggers corresponding UI events,
 * such as the Rank Up modal.
 */
export default function AppEventHandler() {
  const { user } = useAuth();
  const { openRankUpModal } = useModal();
  const { allRanks, loading: configLoading } = useConfig();

  // Use a ref to track the previous rank key without causing re-renders.
  // We initialize it with the user's rank key when the component first mounts.
  const previousRankKey = useRef(user?.rank?.key);

  useEffect(() => {
    const currentRankKey = user?.rank?.key;

    // Do nothing until all necessary data is loaded.
    if (
      !user ||
      !currentRankKey ||
      configLoading ||
      !allRanks ||
      Object.keys(allRanks).length === 0
    ) {
      return;
    }

    // On the very first render after loading, previousRankKey.current might be undefined.
    // We set it here to establish a baseline for the *next* render.
    if (!previousRankKey.current) {
      previousRankKey.current = currentRankKey;
      return;
    }

    // This is the core logic: check if the rank has changed since the last render.
    if (currentRankKey !== previousRankKey.current) {
      const currentRankData = allRanks[currentRankKey];
      const previousRankData = allRanks[previousRankKey.current];

      // Ensure we have data for both ranks to prevent errors
      if (currentRankData && previousRankData) {
        // A promotion has occurred if the new rank requires more points than the old one.
        if (currentRankData.points > previousRankData.points) {
          openRankUpModal({
            fromRank: previousRankData,
            toRank: currentRankData,
          });
        }
      }
    }

    // After every check, update the ref to the current rank for the next comparison.
    previousRankKey.current = currentRankKey;
  }, [user, allRanks, openRankUpModal, configLoading]);

  // This component renders nothing to the DOM. Its only job is to handle effects.
  return null;
}
