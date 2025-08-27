'use client';

import { useOnboarding } from '@/context/OnboardingContext';
import { useModal } from '@/context/ModalContext'; // Import useModal hook
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { triggerHapticFeedback } from '@/utils/haptics';

export default function FloatingOnboardingBanner() {
    const quest = useOnboarding();
    const { openEditProfileModal } = useModal(); // Get the modal function
    const router = useRouter(); // Get the router

    const bannerVariants = {
        hidden: { y: 150, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.5 } },
        exit: { y: 150, opacity: 0, transition: { duration: 0.3 } }
    };

    const handleClick = (e) => {
        triggerHapticFeedback();
        if (quest.ctaLink === 'OPEN_EDIT_PROFILE_MODAL') {
            e.preventDefault(); // Prevent any default link behavior
            openEditProfileModal();
        } else {
            router.push(quest.ctaLink); // Use router for standard navigation
        }
    };

    // The outer element will now be a div that we can attach an onClick to,
    // instead of relying solely on the Link component.
    const BannerContent = () => (
        <div className="flex items-center gap-4 p-4 bg-primary text-primary-foreground rounded-xl shadow-lg border-2 border-white/20">
            <SparklesIcon className="w-8 h-8 text-yellow-300 flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-bold text-sm leading-tight">Next Quest:</p>
                <p className="text-sm leading-tight">{quest.message}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full flex-shrink-0 transition-transform group-hover:scale-110">
                <ArrowRightIcon className="w-6 h-6" />
            </div>
        </div>
    );


    return (
        <AnimatePresence>
            {quest && quest.show && (
                <motion.div
                    key="onboarding-banner"
                    variants={bannerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed bottom-20 left-4 right-4 z-40"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                >
                    <div className="w-full max-w-md mx-auto">
                        <div onClick={handleClick} className="block group cursor-pointer">
                            <BannerContent />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}