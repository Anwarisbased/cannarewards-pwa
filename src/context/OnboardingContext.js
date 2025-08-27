'use client';

import { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
    const { user } = useAuth();

    const questLine = [
        {
            step: 1,
            show: true,
            message: "Your journey begins! Scan your first product to earn points and a welcome gift.",
            ctaText: "Go to Scanner",
            ctaLink: "/scan",
        },
        {
            step: 2,
            show: true,
            message: "Great start! Now, redeem your first reward to see how easy it is.",
            ctaText: "Browse Rewards",
            ctaLink: "/catalog",
        },
        {
            step: 3,
            show: true,
            message: "You're a natural! Add your birthday to your profile to get a special gift on your day.",
            ctaText: "Add Birthday",
            ctaLink: "OPEN_EDIT_PROFILE_MODAL", // Special keyword to trigger modal
        },
        {
            step: 4,
            show: false,
            message: "You've completed your onboarding journey!",
            ctaText: "",
            ctaLink: "",
        }
    ];

    const currentQuest = useMemo(() => {
        const userStep = 2; // user?.onboardingQuestStep || 1;
        const quest = questLine.find(q => q.step === userStep) || questLine[questLine.length - 1];
        return quest;
    }, [user]);

    return (
        <OnboardingContext.Provider value={currentQuest}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    return useContext(OnboardingContext);
}