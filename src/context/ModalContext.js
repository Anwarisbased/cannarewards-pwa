'use client';

import { createContext, useState, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScanModal from '../components/ScanModal.js';
import WelcomeModal from '../components/WelcomeModal.js';

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [isScanModalOpen, setScanModalOpen] = useState(false);
    const [welcomeBonusDetails, setWelcomeBonusDetails] = useState(null);

    const openScanModal = () => setScanModalOpen(true);
    const closeScanModal = () => setScanModalOpen(false);
    
    const openWelcomeModal = (bonusDetails) => {
        setWelcomeBonusDetails(bonusDetails);
    };
    const closeWelcomeModal = () => {
        setWelcomeBonusDetails(null);
    };

    const value = {
        openScanModal,
        closeScanModal,
        openWelcomeModal,
        closeWelcomeModal
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            <AnimatePresence>
                {isScanModalOpen && <ScanModal closeModal={closeScanModal} />}
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