'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ModalProvider } from '../context/ModalContext';
import { ThemeProvider } from '../context/ThemeContext';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import { Toaster } from 'react-hot-toast';
import './globals.css';

// Initialize the Inter font for optimized performance
const inter = Inter({ subsets: ['latin'] });

// Since this is a client component ('use client'), we don't export static metadata here.
// Page titles and metadata can be managed within individual pages or with the useEffect hook if needed.

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} pt-20 pb-20 bg-gray-50`} 
        suppressHydrationWarning={true}
      >
        {/*
          AuthProvider is the outermost provider as other contexts
          and components depend on the authentication state it provides.
        */}
        <AuthProvider>
          {/*
            ThemeProvider needs to be inside AuthProvider because it
            reads theme settings from the user object.
          */}
          <ThemeProvider>
            {/*
              ModalProvider manages global modals and can live inside the other two.
            */}
            <ModalProvider>
              {/* The Toaster component renders all toast notifications */}
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

              {/* The Header appears at the top of most pages */}
              <Header />

              <main>
                {/* 'children' is where the content of the current page will be rendered */}
                {children}
              </main>
              
              {/* The NavBar appears at the bottom of most pages */}
              <NavBar />
            </ModalProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}