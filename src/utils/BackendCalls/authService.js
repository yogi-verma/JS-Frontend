// Backend API calls for authentication
const BACKEND_URL = 'https://js-backend-olive.vercel.app';

/**
 * Fetch the current authenticated user
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
export const getCurrentUser = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/current_user`, {
            credentials: 'include'
        });

        if (res.ok) {
            return await res.json();
        } else if (res.status === 401) {
            return null; // Not authenticated
        }
        throw new Error(`Failed to fetch user: ${res.status}`);
    } catch (err) {
        console.error('Error fetching current user:', err);
        throw err;
    }
};

/**
 * Initiate Google OAuth login
 */
export const initializeGoogleLogin = () => {
    window.open(`${BACKEND_URL}/auth/google`, "_self");
};

/**
 * Logout the user
 */
export const logout = () => {
    window.open(`${BACKEND_URL}/auth/logout`, "_self");
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export const isAuthenticated = async () => {
    try {
        const user = await getCurrentUser();
        return user !== null;
    } catch (err) {
        return false;
    }
};
