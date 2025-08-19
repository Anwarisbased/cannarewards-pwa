'use client';

import { createContext, useState, useContext } from 'react';

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
    const [direction, setDirection] = useState('right'); // Default to 'right' for initial load

    const handleSetDirection = (newDirection) => {
        setDirection(newDirection);
    };

    const value = {
        direction,
        setDirection: handleSetDirection,
    };

    return (
        <TransitionContext.Provider value={value}>
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransitionDirection() {
    return useContext(TransitionContext);
}