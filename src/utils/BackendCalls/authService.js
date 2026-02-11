// Backend API calls for authentication
const BACKEND_URL = 'https://js-backend-olive.vercel.app'; 

// Backend URL = https://js-backend-olive.vercel.app/

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
    } catch {
        return false;
    }
};


/**
 * Fetch all modules from the backend
 * @returns {Promise<Array>} Array of modules
 */
export const getModules = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/modules`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include if you need cookies/auth
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch modules: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching modules:', err);
        throw err;
    }
};

/**
 * Fetch all lessons for a specific module
 * @param {string} moduleId - The ID of the module
 * @returns {Promise<Object>} Object containing lessons array and pagination
 */
export const getLessonsByModule = async (moduleId) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/lessons/module/${moduleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch lessons: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching lessons:', err);
        throw err;
    }
};

/**
 * Fetch a single lesson by ID
 * @param {string} lessonId - The ID of the lesson
 * @returns {Promise<Object>} Lesson object
 */
export const getLessonById = async (lessonId) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/lessons/${lessonId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch lesson: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching lesson:', err);
        throw err;
    }
};
