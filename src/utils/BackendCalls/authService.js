// Backend API calls for authentication
const BACKEND_URL = 'https://js-backend-olive.vercel.app'; // Change to your backend URL in production

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
 * Update user display name
 * @param {string} displayName - The new display name
 * @returns {Promise<Object>} Updated user object
 */
export const updateDisplayName = async (displayName) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-display-name`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ displayName })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update display name: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating display name:', err);
        throw err;
    }
};

/**
 * Update user bio
 * @param {string} bio - The new bio
 * @returns {Promise<Object>} Updated user object
 */
export const updateBio = async (bio) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-bio`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ bio })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update bio: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating bio:', err);
        throw err;
    }
};

/**
 * Delete user account
 * @returns {Promise<Object>} Success message
 */
export const deleteAccount = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/delete-account`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to delete account: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error deleting account:', err);
        throw err;
    }
};

/**
 * Update user photo
 * @param {string} photo - The new photo URL
 * @returns {Promise<Object>} Updated user object
 */
export const updatePhoto = async (photo) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-photo`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ photo })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update photo: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating photo:', err);
        throw err;
    }
};

/**
 * Request email change - sends verification code to new email
 * @param {string} newEmail - The new email address
 * @returns {Promise<Object>} Success message
 */
export const requestEmailChange = async (newEmail) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/request-email-change`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ newEmail })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to request email change: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error requesting email change:', err);
        throw err;
    }
};

/**
 * Verify email change with code
 * @param {string} code - The verification code
 * @returns {Promise<Object>} Updated user object
 */
export const verifyEmailChange = async (code) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/verify-email-change`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ code })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to verify email change: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error verifying email change:', err);
        throw err;
    }
};

/**
 * Update user status
 * @param {string|null} status - The new status (busy, focusing, building, optimistic, or null)
 * @returns {Promise<Object>} Updated user object
 */
export const updateStatus = async (status) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update status: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating status:', err);
        throw err;
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

/**
 * Fetch all interview questions (with optional filters)
 * @param {Object} params - Query params: difficulty, category, page, limit
 * @returns {Promise<Object>} Object containing questions array and pagination
 */
export const getInterviewQuestions = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${BACKEND_URL}/api/interview-questions${query ? `?${query}` : ''}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch interview questions: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching interview questions:', err);
        throw err;
    }
};

/**
 * Fetch interview questions by difficulty
 * @param {string} difficulty - Easy, Medium, or Hard
 * @returns {Promise<Object>} Object containing questions array
 */
export const getInterviewQuestionsByDifficulty = async (difficulty) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/interview-questions/difficulty/${difficulty}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch questions by difficulty: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching questions by difficulty:', err);
        throw err;
    }
};

/**
 * Fetch interview questions stats
 * @returns {Promise<Object>} Stats object with totals by difficulty and category
 */
export const getInterviewQuestionsStats = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/interview-questions/stats`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch interview questions stats: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching interview questions stats:', err);
        throw err;
    }
};

/**
 * Get the logged-in user's interview question completion progress
 * @returns {Promise<Object>} Progress map { questionId: { isCompleted, completedAt } }
 */
export const getUserInterviewProgress = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/interview-progress`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!res.ok) {
            if (res.status === 401) return { success: true, data: {}, completedCount: 0 };
            throw new Error(`Failed to fetch interview progress: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error fetching interview progress:', err);
        throw err;
    }
};

/**
 * Toggle completion status for a specific interview question
 * @param {string} questionId - The ID of the interview question
 * @returns {Promise<Object>} Updated completion status
 */
export const toggleQuestionCompletion = async (questionId) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/interview-progress/${questionId}/toggle`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error(`Failed to toggle completion: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error toggling question completion:', err);
        throw err;
    }
};

/**
 * Update user website
 * @param {string} website - The new website URL
 * @returns {Promise<Object>} Updated user object
 */
export const updateWebsite = async (website) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-website`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ website })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update website: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating website:', err);
        throw err;
    }
};

/**
 * Update user social links
 * @param {Object} socialLinks - Object with github, linkedin, twitter
 * @returns {Promise<Object>} Updated user object
 */
export const updateSocialLinks = async (socialLinks) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-social-links`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(socialLinks)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update social links: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating social links:', err);
        throw err;
    }
};

/**
 * Update user company
 * @param {string} company - The new company name
 * @returns {Promise<Object>} Updated user object
 */
export const updateCompany = async (company) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-company`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ company })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update company: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating company:', err);
        throw err;
    }
};

/**
 * Update user title
 * @param {string} title - The new job title
 * @returns {Promise<Object>} Updated user object
 */
export const updateTitle = async (title) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/user/update-title`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ title })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to update title: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error('Error updating title:', err);
        throw err;
    }
};
