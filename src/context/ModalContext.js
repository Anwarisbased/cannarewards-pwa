'use client';

import React, { createContext, useState, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeModal from '../components/WelcomeModal.js';
import ConfettiBlast from '../components/ConfettiBlast.js';
import EditProfileModal from '@/components/EditProfileModal';
import ContentModal from '@/components/ContentModal';
import ReportFailedScanModal from '@/components/ReportFailedScanModal';
import RankUpModal from '@/components/RankUpModal'; // --- 1. IMPORT NEW MODAL ---
import { Dialog } from '@/components/ui/dialog';
import { useAuth } from './AuthContext.js';

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [welcomeBonusDetails, setWelcomeBonusDetails] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [contentModalSlug, setContentModalSlug] = useState(null);
    const [isReportScanOpen, setIsReportScanOpen] = useState(false);
    const [failedScanCode, setFailedScanCode] = useState(null);
    const [rankUpDetails, setRankUpDetails] = useState(null); // --- 2. ADD STATE FOR RANK UP ---

    const { login } = useAuth();

    const openEditProfileModal = () => setIsEditProfileOpen(true);
    const closeEditProfileModal = () => setIsEditProfileOpen(false);
    
    const openContentModal = (slug) => setContentModalSlug(slug);
    const closeContentModal = () => setContentModalSlug(null);

    const openReportScanModal = (code) => {
        setFailedScanCode(code);
        setIsReportScanOpen(true);
    };
    const closeReportScanModal = () => {
        setIsReportScanOpen(false);
        setFailedScanCode(null);
    };

    // --- 3. ADD HANDLERS FOR RANK UP MODAL ---
    const openRankUpModal = (details) => {
        setRankUpDetails(details);
    };
    const closeRankUpModal = () => {
        setRankUpDetails(null);
    };

    const handleProfileUpdate = () => {
        const currentToken = localStorage.getItem('authToken');
        if (currentToken) {
            login(currentToken, true); // silent login
        }
    };

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
        triggerConfetti,
        openEditProfileModal,
        closeEditProfileModal,
        openContentModal,
        closeContentModal,
        openReportScanModal,
        openRankUpModal, // --- 4. EXPOSE THE NEW FUNCTION ---
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
                {/* --- 5. RENDER THE RANK UP MODAL --- */}
                {rankUpDetails && (
                    <RankUpModal
                        details={rankUpDetails}
                        closeModal={closeRankUpModal}
                    />
                )}
            </AnimatePresence>

            <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                {isEditProfileOpen && (
                    <EditProfileModal 
                        closeModal={closeEditProfileModal}
                        onProfileUpdate={handleProfileUpdate}
                    />
                )}
            </Dialog>

            <Dialog open={!!contentModalSlug} onOpenChange={(isOpen) => !isOpen && closeContentModal()}>
                {contentModalSlug && <ContentModal pageSlug={contentModalSlug} />}
            </Dialog>

            <Dialog open={isReportScanOpen} onOpenChange={setIsReportScanOpen}>
                {isReportScanOpen && <ReportFailedScanModal failedCode={failedScanCode} closeModal={closeReportScanModal} />}
            </Dialog>

        </ModalContext.Provider>
    );
}

export function useModal() {
    return useContext(ModalContext);
}