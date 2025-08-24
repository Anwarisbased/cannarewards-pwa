'use client';

import React, { createContext, useState, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeModal from '../components/WelcomeModal.js';
import ConfettiBlast from '../components/ConfettiBlast.js';
import EditProfileModal from '@/components/EditProfileModal';
import ContentModal from '@/components/ContentModal';
import ReportFailedScanModal from '@/components/ReportFailedScanModal'; // --- 1. IMPORT NEW MODAL ---
import { Dialog } from '@/components/ui/dialog';
import { useAuth } from './AuthContext.js';


const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [welcomeBonusDetails, setWelcomeBonusDetails] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    
    // State for Edit Profile Modal
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    
    // State for Content Modal (stores the page slug to fetch)
    const [contentModalSlug, setContentModalSlug] = useState(null);

    // --- 2. ADD STATE FOR FAILED SCAN MODAL ---
    const [isReportScanOpen, setIsReportScanOpen] = useState(false);
    const [failedScanCode, setFailedScanCode] = useState(null);

    const { login } = useAuth();

    // Edit Profile Modal Functions
    const openEditProfileModal = () => setIsEditProfileOpen(true);
    const closeEditProfileModal = () => setIsEditProfileOpen(false);
    
    // Content Modal Functions
    const openContentModal = (slug) => setContentModalSlug(slug);
    const closeContentModal = () => setContentModalSlug(null);

    // --- 3. ADD HANDLERS FOR FAILED SCAN MODAL ---
    const openReportScanModal = (code) => {
        setFailedScanCode(code);
        setIsReportScanOpen(true);
    };
    const closeReportScanModal = () => {
        setIsReportScanOpen(false);
        setFailedScanCode(null);
    };

    const handleProfileUpdate = () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            login(currentToken, true); // silent login
        }
    };

    // Welcome Modal Functions
    const openWelcomeModal = (bonusDetails) => {
        setWelcomeBonusDetails(bonusDetails);
    };
    const closeWelcomeModal = () => {
        setWelcomeBonusDetails(null);
    };

    // Confetti Function
    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); 
    };

    const value = {
        openWelcomeModal,
        closeWelcomeModal,
        triggerConfetti,
        openEditProfileModal,
        closeEditProfileModal,
        openContentModal,
        closeContentModal,
        openReportScanModal, // Expose the new function
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

            {/* Dialog for Edit Profile */}
            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                {isEditProfileOpen && (
                    <EditProfileModal 
                        closeModal={closeEditProfileModal}
                        onProfileUpdate={handleProfileUpdate}
                    />
                )}
            </Dialog>

            {/* Dialog for Dynamic Page Content */}
            <Dialog open={!!contentModalSlug} onOpenChange={(isOpen) => !isOpen && closeContentModal()}>
                {contentModalSlug && <ContentModal pageSlug={contentModalSlug} />}
            </Dialog>

            {/* --- 4. ADD DIALOG FOR FAILED SCAN REPORT --- */}
            <Dialog open={isReportScanOpen} onOpenChange={setIsReportScanOpen}>
                {isReportScanOpen && <ReportFailedScanModal failedCode={failedScanCode} closeModal={closeReportScanModal} />}
            </Dialog>

        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}