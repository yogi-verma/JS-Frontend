import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../BackendCalls/authService';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user from localStorage on mount (instant across tabs)
    useEffect(() => {
        const cachedUser = localStorage.getItem('currentUser');
        const cachedAuth = localStorage.getItem('isAuthenticated');

        if (cachedUser && cachedAuth === 'true') {
            try {
                setUser(JSON.parse(cachedUser));
                setIsAuthenticated(true);
                setLoading(false);
            } catch (err) {
                console.error('Failed to parse cached user:', err);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isAuthenticated');
            }
        }

        // Verify authentication with backend in background
        verifyAuth();

        // Listen for auth changes from other tabs
        const handleStorageChange = (e) => {
            if (e.key === 'currentUser' && e.newValue) {
                try {
                    setUser(JSON.parse(e.newValue));
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Failed to parse user from storage event:', err);
                }
            } else if (e.key === 'isAuthenticated' && e.newValue === 'false') {
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const verifyAuth = async () => {
        try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
                // Update localStorage for other tabs
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                localStorage.setItem('isAuthenticated', 'true');
            } else {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('currentUser');
                localStorage.setItem('isAuthenticated', 'false');
            }
        } catch (err) {
            console.error('Auth verification failed:', err);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('currentUser');
            localStorage.setItem('isAuthenticated', 'false');
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUser');
        localStorage.setItem('isAuthenticated', 'false');
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshUser: verifyAuth
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
