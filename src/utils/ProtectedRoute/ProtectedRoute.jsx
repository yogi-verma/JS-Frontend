import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../UserContext/UserContext";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

/**
 * ProtectedRoute component that wraps routes requiring authentication
 * Redirects to home page if user is not authenticated
 * Now uses UserContext for instant authentication checks
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useUser();
    const location = useLocation();

    // Loading state while checking authentication
    if (loading) {
        return <SkeletonLoader variant="auth" />;
    }

    // Not authenticated - redirect to home
    if (!isAuthenticated) {
        // Store the attempted URL for potential redirect after login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Authenticated - render the protected content
    return children;
};

export default ProtectedRoute;
