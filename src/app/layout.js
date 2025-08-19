'use client';

import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation'; // 1. Import usePathname
import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext';
import { ThemeProvider } from '../context/ThemeContext';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion'; // 2. Import AnimatePresence
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // 3. Get the current path to use as a key

  return (
    <html lang="en">
      <body 
        className={`${inter.className} pt-20 pb-20 bg-gray-50`} 
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ThemeProvider>
            <ModalProvider>
              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1f2937',
                    color: '#ffffff',
                    borderRadius: '99px',
                    padding: '12px 20px',
                  },
                  success: {
                    iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
                  },
                }}
              />

              <Header />

              <main>
                {/* --- 4. WRAP CHILDREN WITH ANIMATEPRESENCE --- */}
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