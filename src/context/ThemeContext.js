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

        // The CSS is now much cleaner, only defining the variables.
        const css = `
            :root {
                --primary-color: ${theme.primaryColor || defaultTheme.primaryColor};
                --secondary-color: ${theme.secondaryColor || defaultTheme.secondaryColor};
                --primary-font: "${theme.primaryFont || defaultTheme.primaryFont}", sans-serif;
            }
        `;

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