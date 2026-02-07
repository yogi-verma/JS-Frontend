import { useTheme } from './useTheme';
import colors from '../color';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-300"
            style={{
                background: isDark ? colors.blueDark : colors.blueLight,
                color: colors.white
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {isDark ? (
                // Sun icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <path d="M12 2v4M12 18v4M6.22 6.22l2.83 2.83M14.95 14.95l2.83 2.83M2 12h4M18 12h4M6.22 17.78l2.83-2.83M14.95 9.05l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
            ) : (
                // Moon icon for dark mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
