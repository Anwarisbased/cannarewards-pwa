'use client';

import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading || !user) return;

        // --- START: DYNAMIC THEME APPLICATION ---

        const theme = user?.settings?.theme || {};

        const styleId = 'dynamic-theme-styles';
        
        // Remove old style tag if it exists
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        let cssVariables = '';

        // Loop through the theme object from the API and create CSS variables
        for (const key in theme) {
            if (Object.hasOwnProperty.call(theme, key)) {
                const value = theme[key];
                if (key === 'primaryFont') {
                    // Handle font separately
                    continue;
                }
                // e.g., 'primary-foreground' becomes '--primary-foreground'
                cssVariables += `--${key}: ${value};\n`;
            }
        }

        const css = `
            :root {
                ${cssVariables}
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
        
        // Font loading logic (remains mostly the same but uses the correct key)
        const fontToLoad = theme.primaryFont || 'Inter'; // Default to Inter
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
            // Also update the font-family variable
            document.documentElement.style.setProperty('--primary-font', `"${fontToLoad}", sans-serif`);
        }
        // --- END: DYNAMIC THEME APPLICATION ---

    }, [user, loading]);

    return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}