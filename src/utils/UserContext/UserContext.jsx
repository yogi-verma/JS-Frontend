import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getCurrentUser, getUserStreak, getModules, getLessonsByModule, getLessonById } from '../BackendCalls/authService';

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
    const [currentStreak, setCurrentStreak] = useState(0);
    const [modules, setModules] = useState([]);
    const [modulesLoading, setModulesLoading] = useState(true);
    const [modulesError, setModulesError] = useState(null);

    // Lessons cache: { [moduleId]: { lessons, loading, error } }
    const [lessonsCache, setLessonsCache] = useState({});
    const lessonsFetchingRef = useRef({});

    // Single lesson cache: { [lessonId]: { lesson, loading, error } }
    const [lessonCache, setLessonCache] = useState({});
    const lessonFetchingRef = useRef({});

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

    const fetchStreak = useCallback(async () => {
        try {
            const res = await getUserStreak();
            setCurrentStreak(res?.data?.currentStreak || 0);
        } catch {
            setCurrentStreak(0);
        }
    }, []);

    const fetchModules = useCallback(async () => {
        setModulesLoading(true);
        setModulesError(null);
        try {
            const response = await getModules();
            let modulesArray = [];
            if (response && response.data && Array.isArray(response.data)) {
                modulesArray = response.data;
            } else if (Array.isArray(response)) {
                modulesArray = response;
            }
            setModules(modulesArray);
        } catch (err) {
            console.error('Error fetching modules:', err);
            setModulesError(err.message);
        } finally {
            setModulesLoading(false);
        }
    }, []);

    const fetchLessonsByModule = useCallback(async (moduleId, force = false) => {
        if (!moduleId) return;
        // Skip if already cached and not forcing refresh
        if (!force && lessonsCache[moduleId]?.lessons) return;
        // Skip if already fetching this module
        if (lessonsFetchingRef.current[moduleId]) return;

        lessonsFetchingRef.current[moduleId] = true;
        setLessonsCache(prev => ({
            ...prev,
            [moduleId]: { lessons: prev[moduleId]?.lessons || [], loading: true, error: null }
        }));

        try {
            const response = await getLessonsByModule(moduleId);
            let lessonsArray = [];
            if (response && response.data && Array.isArray(response.data)) {
                lessonsArray = response.data;
            } else if (Array.isArray(response)) {
                lessonsArray = response;
            }
            setLessonsCache(prev => ({
                ...prev,
                [moduleId]: { lessons: lessonsArray, loading: false, error: null }
            }));
        } catch (err) {
            console.error('Error fetching lessons:', err);
            setLessonsCache(prev => ({
                ...prev,
                [moduleId]: { lessons: [], loading: false, error: err.message }
            }));
        } finally {
            lessonsFetchingRef.current[moduleId] = false;
        }
    }, [lessonsCache]);

    const fetchLesson = useCallback(async (lessonId, force = false) => {
        if (!lessonId) return;
        if (!force && lessonCache[lessonId]?.lesson) return;
        if (lessonFetchingRef.current[lessonId]) return;

        lessonFetchingRef.current[lessonId] = true;
        setLessonCache(prev => ({
            ...prev,
            [lessonId]: { lesson: prev[lessonId]?.lesson || null, loading: true, error: null }
        }));

        try {
            const response = await getLessonById(lessonId);
            let lessonData = null;
            if (response && response.data) {
                lessonData = response.data;
            } else if (response && !response.data) {
                lessonData = response;
            }
            setLessonCache(prev => ({
                ...prev,
                [lessonId]: { lesson: lessonData, loading: false, error: null }
            }));
        } catch (err) {
            console.error('Error fetching lesson:', err);
            setLessonCache(prev => ({
                ...prev,
                [lessonId]: { lesson: null, loading: false, error: err.message }
            }));
        } finally {
            lessonFetchingRef.current[lessonId] = false;
        }
    }, [lessonCache]);

    // Fetch streak once when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchStreak();
        } else {
            setCurrentStreak(0);
        }
    }, [isAuthenticated, fetchStreak]);

    // Fetch modules once on mount (public data, no auth needed)
    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

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
        currentStreak,
        modules,
        modulesLoading,
        modulesError,
        login,
        logout,
        refreshUser: verifyAuth,
        refreshStreak: fetchStreak,
        refreshModules: fetchModules,
        lessonsCache,
        fetchLessonsByModule,
        lessonCache,
        fetchLesson
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
