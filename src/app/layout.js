'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext';
import { ThemeProvider } from '../context/ThemeContext';
// REMOVED: TransitionProvider import
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
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
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <style>{nProgressStyle}</style>
      </head>
      <body 
        className={`${inter.className} pt-20 pb-20 bg-gray-50`} 
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ThemeProvider>
            {/* REMOVED: TransitionProvider wrapper */}
            <ModalProvider>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 4000,
                  style: { background: '#1f2937', color: '#ffffff', borderRadius: '99px', padding: '12px 20px' },
                  success: { iconTheme: { primary: '#22c55e', secondary: '#ffffff' } },
                  error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
                }}
              />
              <Header />
              <main>
                <AnimatePresence mode="wait">
                  <div key={pathname}>
                    {children}
                  </div>
                </AnimatePresence>
              </main>
              <NavBar />
            </ModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}