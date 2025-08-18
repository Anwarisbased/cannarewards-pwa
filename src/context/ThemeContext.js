'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        const defaultTheme = {
            primaryColor: '#2563eb',   // Default Blue
            secondaryColor: '#4f46e5', // Default Indigo
            primaryFont: 'Inter',
        };

        const theme = user?.settings?.theme || defaultTheme;
        
        const styleId = 'dynamic-theme-styles';
        
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        // --- DIRECT CSS OVERRIDE METHOD ---
        const primary = theme.primaryColor || defaultTheme.primaryColor;
        const secondary = theme.secondaryColor || defaultTheme.secondaryColor;

        const css = `
            :root {
                 --primary-font: "${theme.primaryFont || defaultTheme.primaryFont}", sans-serif;
            }
            .bg-primary {
                background-color: ${primary} !important;
            }
            .bg-primary:hover {
                filter: brightness(0.9);
            }
            .text-primary {
                color: ${primary} !important;
            }
            .border-primary {
                border-color: ${primary} !important;
            }
            .from-secondary {
                --tw-gradient-from: ${secondary} var(--tw-gradient-from-position);
                --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
            }
            .to-primary {
                --tw-gradient-to: ${primary} var(--tw-gradient-to-position);
            }
        `;
        // --- END OF DIRECT OVERRIDE METHOD ---

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
        
        // Font loading logic remains the same
        const fontToLoad = theme.primaryFont || defaultTheme.primaryFont;
        if (fontToLoad) {
            const fontName = fontToLoad.replace(/\s/g, '+');
            const fontId = `google-font-${fontName}`;
            if (!document.getElementById(fontId)) {
                const link = document.createElement('link');
                link.id = fontId;
                link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        }
    }, [user, loading]);

    return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}