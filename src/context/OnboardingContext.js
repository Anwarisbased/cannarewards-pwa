'use client';

import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const { user } = useAuth();

  const onboardingQuestStep = user?.onboardingQuestStep || 0;

  const questSteps = {
    0: { message: '', show: false }, // Not started
    1: { message: '', show: false }, // Technically not possible to be in this state on frontend
    2: { message: 'Quest: Add your birthday to your profile for a special surprise!', ctaLink: '/profile', ctaText: 'Update Profile', show: true },
    3: { message: 'Quest: Add your first item to your wishlist!', ctaLink: '/rewards', ctaText: 'Browse Rewards', show: true },
    // Add more steps here as the quest grows
  };

  const currentQuest = questSteps[onboardingQuestStep] || { show: false };

  const value = {
    onboardingQuestStep,
    currentQuest,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}