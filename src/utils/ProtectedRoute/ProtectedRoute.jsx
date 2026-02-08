import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../BackendCalls/authService";
import Loader from "../Loader/Loader";
import { useTheme } from "../WhiteDarkMode/useTheme";

/**
 * ProtectedRoute component that wraps routes requiring authentication
 * Redirects to home page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const { isDark } = useTheme();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className={`h-screen flex justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <Loader />
            </div>
        );
    }

    // Not authenticated - redirect to home
    if (!isAuthenticated) {
        // Store the attempted URL for potential redirect after login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Authenticated - render the protected content
    // Pass user data to children if needed
    return children;
};

export default ProtectedRoute;
