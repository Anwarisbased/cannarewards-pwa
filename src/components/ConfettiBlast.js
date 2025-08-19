'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiBlast() {
    // useRef to ensure confetti only fires once per mount, not on re-renders
    const fired = useRef(false);

    useEffect(() => {
        if (!fired.current) {
            const duration = 3 * 1000; // 3 seconds
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 }; // High zIndex

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            fired.current = true;
        }
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // This component renders nothing itself
    return null;
}