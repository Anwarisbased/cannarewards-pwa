'use client';

import React, { createContext, useState, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeModal from '@/components/WelcomeModal';
import ConfettiBlast from '@/components/ConfettiBlast';
import EditProfileModal from '@/components/EditProfileModal';
import ContentModal from '@/components/ContentModal';
import ReportFailedScanModal from '@/components/ReportFailedScanModal';
import RankUpModal from '@/components/RankUpModal';
import AchievementUnlockedModal from '@/components/AchievementUnlockedModal';
import { Dialog } from '@/components/ui/dialog';
import { useAuth } from './AuthContext';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [welcomeBonusDetails, setWelcomeBonusDetails] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [contentModalSlug, setContentModalSlug] = useState(null);
  const [isReportScanOpen, setIsReportScanOpen] = useState(false);
  const [failedScanCode, setFailedScanCode] = useState(null);
  const [rankUpDetails, setRankUpDetails] = useState(null);
  const [achievementDetails, setAchievementDetails] = useState(null);

  const { login } = useAuth();

  const openWelcomeModal = (details) => setWelcomeBonusDetails(details);
  const closeWelcomeModal = () => setWelcomeBonusDetails(null);

  const openEditProfileModal = () => setIsEditProfileOpen(true);
  const closeEditProfileModal = () => setIsEditProfileOpen(false);

  const openContentModal = (slug) => setContentModalSlug(slug);
  const closeContentModal = () => setContentModalSlug(null);

  const openReportScanModal = (code) => {
    setFailedScanCode(code);
    setIsReportScanOpen(true);
  };
  const closeReportScanModal = () => setIsReportScanOpen(false);

  const openRankUpModal = (details) => setRankUpDetails(details);
  const closeRankUpModal = () => setRankUpDetails(null);

  const openAchievementModal = (details) => setAchievementDetails(details);
  const closeAchievementModal = () => setAchievementDetails(null);

  const handleProfileUpdate = () => {
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
      login(currentToken, true);
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const value = {
    triggerConfetti,
    openWelcomeModal,
    closeWelcomeModal,
    openEditProfileModal,
    closeEditProfileModal,
    openContentModal,
    closeContentModal,
    openReportScanModal,
    openRankUpModal,
    openAchievementModal,
    closeAchievementModal,
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
        {rankUpDetails && (
          <RankUpModal details={rankUpDetails} closeModal={closeRankUpModal} />
        )}
      </AnimatePresence>

      {achievementDetails && (
        <AchievementUnlockedModal
          details={achievementDetails}
          closeModal={closeAchievementModal}
        />
      )}

      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        {isEditProfileOpen && (
          <EditProfileModal
            closeModal={closeEditProfileModal}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </Dialog>
      <Dialog
        open={!!contentModalSlug}
        onOpenChange={(isOpen) => !isOpen && closeContentModal()}
      >
        {contentModalSlug && (
          <ContentModal
            pageSlug={contentModalSlug}
            closeModal={closeContentModal}
          />
        )}
      </Dialog>
      <Dialog open={isReportScanOpen} onOpenChange={setIsReportScanOpen}>
        {isReportScanOpen && (
          <ReportFailedScanModal
            failedCode={failedScanCode}
            closeModal={closeReportScanModal}
          />
        )}
      </Dialog>
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
