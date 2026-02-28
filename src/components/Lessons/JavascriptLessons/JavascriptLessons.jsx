import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../utils/WhiteDarkMode/useTheme";
import Loader from "../../../utils/Loader/Loader";
import { getLessonsByModule } from "../../../utils/BackendCalls/authService";
import Header from "../../Header/Header";

const JavascriptLessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDark } = useTheme();
    const { moduleId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await getLessonsByModule(moduleId);
                console.log('Lessons Response:', response);
                
                let lessonsArray = [];
                if (response && response.data && Array.isArray(response.data)) {
                    lessonsArray = response.data;
                } else if (Array.isArray(response)) {
                    lessonsArray = response;
                }
                
                setLessons(lessonsArray);
            } catch (err) {
                console.error('Error fetching lessons:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (moduleId) {
            fetchLessons();
        }
    }, [moduleId]);

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return { bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'bg-emerald-900/30', darkText: 'text-emerald-400' };
            case 'intermediate':
                return { bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'bg-amber-900/30', darkText: 'text-amber-400' };
            case 'advanced':
                return { bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'bg-rose-900/30', darkText: 'text-rose-400' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', darkBg: 'bg-gray-700', darkText: 'text-gray-300' };
        }
    };

    const _getTypeIcon = (type) => {
        switch (type) {
            case 'theory':
                return '📖';
            case 'practice':
                return '💻';
            case 'quiz':
                return '❓';
            case 'project':
                return '🚀';
            default:
                return '📚';
        }
    };

    // const getTypeColor = (type) => {
    //     switch (type) {
    //         case 'theory':
    //             return { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'bg-blue-900/30', darkText: 'text-blue-400' };
    //         case 'practice':
    //             return { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'bg-purple-900/30', darkText: 'text-purple-400' };
    //         case 'quiz':
    //             return { bg: 'bg-orange-100', text: 'text-orange-700', darkBg: 'bg-orange-900/30', darkText: 'text-orange-400' };
    //         case 'project':
    //             return { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'bg-green-900/30', darkText: 'text-green-400' };
    //         default:
    //             return { bg: 'bg-gray-100', text: 'text-gray-700', darkBg: 'bg-gray-700', darkText: 'text-gray-300' };
    //     }
    // };

    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen py-12 px-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="max-w-4xl mx-auto">
                    <div 
                        className={`rounded-lg p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-200'}`}
                    >
                        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                            Error Loading Lessons
                        </h3>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Header />
            <div className="py-6 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                JavaScript Lessons
                            </h1>
                            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Master JavaScript from fundamentals to advanced concepts
                            </p>
                        </div>
                        <div className={`hidden sm:flex items-center gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                {lessons.length} Lessons
                            </span>
                            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>•</span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                {lessons.reduce((acc, l) => acc + (l.estimatedDuration || 0), 0)} min
                            </span>
                        </div>
                    </div>

                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                            isDark 
                                ? 'text-gray-400 hover:text-white' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Modules
                    </button>
                </div>

                {/* Lessons Grid */}
                {lessons.length === 0 ? (
                    <div className={`text-center py-12 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <span className="text-4xl mb-3 block">📭</span>
                        <p className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            No lessons available yet.
                        </p>
                        <p className={`mt-1 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            Check back soon for new content!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lessons.map((lesson, index) => {
                            const difficultyColor = getDifficultyColor(lesson.difficulty);
                            
                            return (
                                <div
                                    key={lesson._id || index}
                                    className={`group rounded-lg border transition-all duration-200 hover:shadow-md ${
                                        isDark 
                                            ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="p-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span 
                                                    className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${
                                                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {lesson.order || index + 1}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                                                    isDark ? `${difficultyColor.darkBg} ${difficultyColor.darkText}` : `${difficultyColor.bg} ${difficultyColor.text}`
                                                }`}>
                                                    {lesson.difficulty || 'beginner'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Phase Title */}
                                        <h3 className={`text-sm font-semibold mb-2 line-clamp-2 ${
                                            isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                                        } transition-colors`}>
                                            {lesson.phase}
                                        </h3>

                                        {/* Concepts Count */}
                                        <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {lesson.concepts?.length || 0} concepts to learn
                                        </p>

                                        {/* Footer */}
                                        <div className={`flex items-center justify-between pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {lesson.estimatedDuration || 0} min
                                            </span>
                                            <button 
                                                onClick={() => navigate(`/lesson/${lesson._id}`)}
                                                className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                                                    isDark 
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                                            >
                                                Start Learning
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom Stats */}
                {lessons.length > 0 && (
                    <div className={`mt-6 p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex flex-wrap justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{lessons.length}</span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Lessons</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {lessons.reduce((acc, l) => acc + (l.estimatedDuration || 0), 0)}
                                </span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                </svg>
                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {lessons.reduce((acc, l) => acc + (l.concepts?.length || 0), 0)}
                                </span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Concepts</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default JavascriptLessons;
