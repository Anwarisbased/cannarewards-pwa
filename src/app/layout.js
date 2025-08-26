'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext';
import { ThemeProvider } from '../context/ThemeContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import FloatingOnboardingBanner from '../components/FloatingOnboardingBanner';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { Toaster } from 'react-hot-toast';
import 'nprogress/nprogress.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const nProgressStyle = `
  #nprogress .bar {
    background: var(--primary-color, #2563eb) !important;
    height: 3px !important;
  }
  #nprogress .peg {
    box-shadow: 0 0 10px var(--primary-color, #2563eb), 0 0 5px var(--primary-color, #2563eb) !important;
  }
`;

export default function RootLayout({ children }) {
  const themeColor = '#2563eb'; // Default theme color

  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="CannaRewards" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CannaRewards" />
        <meta name="description" content="Scan products, earn points, and redeem exclusive rewards." />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content={themeColor} />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content={themeColor} />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <style>{nProgressStyle}</style>
      </head>
      <body 
        className={`${inter.className} bg-gray-50`} 
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ThemeProvider>
            <OnboardingProvider>
              <ModalProvider>
                <Toaster />
                <Header />
                <main>
                  {children}
                </main>
                <FloatingOnboardingBanner />
                <NavBar />
              </ModalProvider>
            </OnboardingProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}