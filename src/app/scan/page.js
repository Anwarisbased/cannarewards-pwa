'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { claimCodeV2 } from '@/services/rewardsService';
import { showToast } from '@/components/CustomToast';
import { triggerHapticFeedback } from '@/utils/haptics';
import PageContainer from '@/components/PageContainer';
import {
  ArrowPathIcon,
  QrCodeIcon,
  CameraIcon,
  GiftIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ScanPage() {
  const { login, updateUserPoints } = useAuth();
  const router = useRouter();
  const { openWelcomeModal, openReportScanModal, openAchievementModal } =
    useModal();

  const [view, setView] = useState('landing');
  const [scannerError, setScannerError] = useState('');
  const scannerRef = useRef(null);

  const startScanner = async () => {
    triggerHapticFeedback();
    setView('scanning');
    setScannerError('');

    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');

      setTimeout(() => {
        if (scannerRef.current) return;
        const scannerRegionEl = document.getElementById('scanner-region');
        if (!scannerRegionEl) return;

        const onScanSuccess = (decodedText) => {
          let code = decodedText;
          try {
            const url = new URL(decodedText);
            code = url.searchParams.get('code') || decodedText;
          } catch (e) {
            // Not a valid URL, assume the text is the code
          }

          if (code) {
            processClaim(code);
          } else {
            showToast(
              'error',
              'Invalid QR Code',
              'The scanned code is not a valid CannaRewards code.'
            );
          }
        };
        const onScanFailure = (error) => {
          // This callback can be noisy, so we'll keep it quiet unless we need to debug.
        };

        const scanner = new Html5QrcodeScanner(
          'scanner-region',
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
      }, 100);
    } catch (error) {
      console.error('Failed to load scanner library', error);
      setScannerError(
        'Could not load scanner. Please check your connection and try again.'
      );
      setView('landing');
    }
  };

  const processClaim = async (code) => {
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((error) => console.error('Scanner failed to clear.', error));
      scannerRef.current = null;
    }
    setView('processing');
    triggerHapticFeedback();

    try {
      const response = await claimCodeV2(code);

      // Instantly update the UI with the new point balance.
      updateUserPoints(response.new_points_balance);

      // Refresh the full session in the background for consistency.
      login(localStorage.getItem('authToken'), true);

      // Inspect the rich response from the backend to decide what UI to show.
      const firstScanEvent = response.triggered_events?.find(
        (e) => e.type === 'first_scan_bonus'
      );
      const achievementEvent = response.triggered_events?.find(
        (e) => e.type === 'achievement_unlocked'
      );
      const multiplierEvent = response.triggered_events?.find(
        (e) => e.type === 'temporary_multiplier_applied'
      );

      if (firstScanEvent) {
        // The backend determined this was a first scan. We show the welcome modal.
        openWelcomeModal(firstScanEvent.details);
        router.push('/my-points');
      } else if (achievementEvent) {
        // The backend determined an achievement was unlocked. We show the achievement modal.
        openAchievementModal(achievementEvent.details);
        router.push('/my-points');
      } else if (multiplierEvent) {
        // The backend applied a special multiplier. We show a celebratory toast.
        showToast(
          'success',
          `${multiplierEvent.details.multiplier}x Bonus!`,
          response.message
        );
        router.push('/');
      } else {
        // It was a standard scan. Show a simple success toast.
        showToast('success', 'Points Added!', response.message);
        router.push('/');
      }
    } catch (err) {
      showToast('error', 'Scan Failed', err.message);
      // We can add logic here later to check the error code and open the report modal
      router.push('/');
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          /* Suppress errors on unmount */
        });
      }
    };
  }, []);

  return (
    <PageContainer>
      <div className="flex h-full flex-col items-center justify-center">
        {view === 'landing' && (
          <div className="w-full text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Authenticate Your Product
            </h1>
            <p className="mb-8 text-muted-foreground">
              Scan the QR code to earn points and unlock rewards.
            </p>

            <div className="mb-10 space-y-4">
              <Card>
                <CardContent className="flex items-center p-4">
                  <QrCodeIcon className="mr-4 h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-left font-semibold">
                      Step 1: Scan QR Code
                    </h3>
                    <p className="text-left text-sm text-muted-foreground">
                      Locate and scan the code on your product.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <GiftIcon className="mr-4 h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-left font-semibold">
                      Step 2: Get Rewards
                    </h3>
                    <p className="text-left text-sm text-muted-foreground">
                      Instantly receive points and special offers.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center p-4">
                  <StarIcon className="mr-4 h-8 w-8 text-primary" />
                  <div>
                    <h3 className="text-left font-semibold">
                      Step 3: Collect & Redeem
                    </h3>
                    <p className="text-left text-sm text-muted-foreground">
                      Use your points for exclusive items.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={startScanner}
              size="lg"
              className="h-14 w-full text-lg"
            >
              <CameraIcon className="mr-2 h-6 w-6" />
              Start Scanning
            </Button>
          </div>
        )}

        {view === 'scanning' && (
          <div className="w-full text-center">
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Scan QR Code
            </h2>
            <p className="mb-6 text-muted-foreground">
              Place the QR code inside the frame.
            </p>

            <div
              id="scanner-region"
              className="mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-lg border-2 border-dashed border-muted bg-secondary"
            ></div>

            {scannerError && (
              <p className="mt-4 text-center text-destructive">
                {scannerError}
              </p>
            )}

            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              className="mt-8"
            >
              Cancel
            </Button>
          </div>
        )}

        {view === 'processing' && (
          <div className="text-center">
            <ArrowPathIcon className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">
              Validating your code...
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
