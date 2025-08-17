'use client'; // Add 'use client' because we are using context providers

import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Since we are using client components, metadata should be handled differently if needed,
// but for now we can remove the export to avoid issues.
// export const metadata = { ... }; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* We add a suppressHydrationWarning because the body tag's class might differ
          between server and client render, which is fine. */}
      <body className={`${inter.className} pb-20 bg-gray-50`} suppressHydrationWarning={true}>
        <AuthProvider>
          <ModalProvider>
            <Header />
            <main>
              {children}
            </main>
            <NavBar />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}