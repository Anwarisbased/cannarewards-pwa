'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext';
import { ThemeProvider } from '../context/ThemeContext';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { Toaster } from 'react-hot-toast'; // Toaster is still the container
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
            <ModalProvider>
              {/* REMOVED: All the custom toastOptions are gone, we use the default container */}
              <Toaster />
              <Header />
              <main>
                {children}
              </main>
              <NavBar />
            </ModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}