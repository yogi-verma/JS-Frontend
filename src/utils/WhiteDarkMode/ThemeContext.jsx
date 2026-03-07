import React, { useState, useEffect } from 'react';
import { ThemeContext } from './themeContextStore';

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Check if user has a saved theme preference
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }
        // Default to dark mode
        return true;
    });

    useEffect(() => {
        // Save theme preference to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Apply theme to document
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
