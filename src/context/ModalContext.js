'use client';

import { createContext, useState, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import ScanModal from '../components/ScanModal.js'; // Note the relative path

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [isScanModalOpen, setScanModalOpen] = useState(false);

    const openScanModal = () => setScanModalOpen(true);
    const closeScanModal = () => setScanModalOpen(false);

    const value = {
        openScanModal,
        closeScanModal
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            <AnimatePresence>
                {isScanModalOpen && <ScanModal closeModal={closeScanModal} />}
            </AnimatePresence>
        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}