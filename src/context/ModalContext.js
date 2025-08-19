'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeModal from '../components/WelcomeModal.js';
import ConfettiBlast from '../components/ConfettiBlast.js';

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [welcomeBonusDetails, setWelcomeBonusDetails] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const openWelcomeModal = (bonusDetails) => {
        setWelcomeBonusDetails(bonusDetails);
    };
    const closeWelcomeModal = () => {
        setWelcomeBonusDetails(null);
    };

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); 
    };

    const value = {
        openWelcomeModal,
        closeWelcomeModal,
        triggerConfetti
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            {showConfetti && <ConfettiBlast />}
            <AnimatePresence>
                {welcomeBonusDetails && (
                    <WelcomeModal 
                        bonusDetails={welcomeBonusDetails} 
                        closeModal={closeWelcomeModal} 
                    />
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}