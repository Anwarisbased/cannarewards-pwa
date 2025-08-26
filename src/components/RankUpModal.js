'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModal } from '@/context/ModalContext';
import { triggerHapticFeedback } from '@/utils/haptics';
import { StarIcon } from '@heroicons/react/24/solid';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const rankStyles = {
    member: { cardClasses: 'bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400', textClasses: 'text-gray-800' },
    bronze: { cardClasses: 'bg-gradient-to-br from-amber-700 via-amber-500 to-yellow-300', textClasses: 'text-white' },
    silver: { cardClasses: 'bg-gradient-to-br from-slate-400 via-slate-200 to-slate-400', textClasses: 'text-slate-800' },
    gold: { cardClasses: 'bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-500', textClasses: 'text-yellow-900' },
    black: { cardClasses: 'bg-gradient-to-br from-gray-900 via-black to-gray-800', textClasses: 'text-white' },
    default: { cardClasses: 'bg-gradient-to-br from-gray-700 to-black', textClasses: 'text-white' }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function RankUpModal({ details, closeModal }) {
    const { triggerConfetti } = useModal();

    useEffect(() => {
        triggerHapticFeedback();
        triggerConfetti();
    }, [triggerConfetti]);

    if (!details || !details.toRank) {
        return null;
    }

    const { toRank } = details;
    const currentStyle = rankStyles[toRank.name.toLowerCase()] || rankStyles.default;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
                className="bg-background rounded-2xl shadow-xl w-full max-w-sm"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="p-8 text-center">
                    <StarIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-foreground mb-2">You've Leveled Up!</h2>
                    <p className="text-muted-foreground mb-6">
                        Congratulations! You've reached a new tier.
                    </p>

                    <Card className={`w-full h-52 flex flex-col justify-between ${currentStyle.cardClasses} ${currentStyle.textClasses}`}>
                        <CardHeader>
                            <CardTitle className="text-4xl font-bold uppercase tracking-wider">{toRank.name}</CardTitle>
                            <CardDescription className={currentStyle.textClasses === 'text-white' ? 'text-white/80' : 'text-muted-foreground'}>
                                Reach {toRank.points.toLocaleString()} lifetime points
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="font-bold text-lg">UNLOCKED</p>
                        </CardContent>
                    </Card>

                    <div className="text-left my-6">
                        <h3 className="font-semibold text-foreground mb-2">New Benefits Unlocked:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {toRank.benefits?.length > 0 ? (
                                toRank.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)
                            ) : (
                                <li>Exclusive access to future rewards.</li>
                            )}
                        </ul>
                    </div>

                    <Button onClick={closeModal} className="w-full h-12 text-lg">
                        Awesome!
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}