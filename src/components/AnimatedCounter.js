'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

export default function AnimatedCounter({ value }) {
    // Initialize motion value. We start it at the provided value to prevent an initial animation from 0 on page load.
    const motionValue = useMotionValue(value); 
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));

    useEffect(() => {
        // This effect triggers ONLY when the 'value' prop changes.
        // It animates the motionValue from its current state to the new value.
        const controls = animate(motionValue, value, { 
            duration: 1, 
            ease: 'easeOut' 
        });

        // Cleanup function to stop the animation if the component unmounts
        return controls.stop;
    }, [value, motionValue]);

    return <motion.span>{rounded}</motion.span>;
}