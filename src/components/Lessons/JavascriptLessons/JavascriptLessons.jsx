import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../utils/WhiteDarkMode/useTheme";
import Loader from "../../../utils/Loader/Loader";
import colors from "../../../utils/color";
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

    const getTypeColor = (type) => {
        switch (type) {
            case 'theory':
                return { bg: 'bg-blue-100', text: 'text-blue-700', darkBg: 'bg-blue-900/30', darkText: 'text-blue-400' };
            case 'practice':
                return { bg: 'bg-purple-100', text: 'text-purple-700', darkBg: 'bg-purple-900/30', darkText: 'text-purple-400' };
            case 'quiz':
                return { bg: 'bg-orange-100', text: 'text-orange-700', darkBg: 'bg-orange-900/30', darkText: 'text-orange-400' };
            case 'project':
                return { bg: 'bg-green-100', text: 'text-green-700', darkBg: 'bg-green-900/30', darkText: 'text-green-400' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', darkBg: 'bg-gray-700', darkText: 'text-gray-300' };
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen py-12 px-6 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
                <div className="max-w-4xl mx-auto">
                    <div 
                        className="rounded-2xl p-8 border shadow-lg"
                        style={{
                            background: isDark ? '#1F2937' : '#FEF2F2',
                            borderColor: isDark ? '#EF4444' : '#FCA5A5'
                        }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl">⚠️</span>
                            <h3 className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                Error Loading Lessons
                            </h3>
                        </div>
                        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {error}
                        </p>
                        <button 
                            onClick={() => navigate(-1)}
                            className="mt-6 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})` }}
                        >
                            ← Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
            <Header />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <h1 className={`text-3xl sm:text-4xl font-extrabold ${colors.blueTextGradient}`}>
                            JavaScript Lessons
                        </h1>
                    </div>
                    <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Master JavaScript from fundamentals to advanced concepts with our structured learning path
                    </p>
                    <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {lessons.length} Lessons
                        </span>
                        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            {lessons.reduce((acc, l) => acc + (l.estimatedDuration || 0), 0)} minutes
                        </span>
                    </div>
                </div>

                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className={`mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        isDark 
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                    }`}
                >
                    ← Back to Modules
                </button>

                {/* Lessons Grid */}
                {lessons.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <span className="text-6xl mb-4 block">📭</span>
                        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            No lessons available yet.
                        </p>
                        <p className={`mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            Check back soon for new content!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {lessons.map((lesson, index) => {
                            const difficultyColor = getDifficultyColor(lesson.difficulty);
                            const typeColor = getTypeColor(lesson.type);
                            
                            return (
                                <div
                                    key={lesson._id || index}
                                    className={`group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 flex flex-col ${
                                        isDark ? 'hover:shadow-blue-500/20' : 'hover:shadow-blue-500/30'
                                    }`}
                                    style={{
                                        background: isDark 
                                            ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
                                            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                                        border: `1px solid ${isDark ? '#374151' : '#E2E8F0'}`
                                    }}
                                >
                                    {/* Top Gradient Bar */}
                                    <div 
                                        className="h-1.5 w-full"
                                        style={{ background: `linear-gradient(90deg, ${colors.blueLight}, ${colors.blueMid})` }}
                                    />
                                    
                                    <div className="p-4 flex flex-col grow">
                                        {/* Header with Number and Badges */}
                                        <div className="flex items-start justify-between mb-3">
                                            {/* Lesson Number Badge */}
                                            <div 
                                                className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold text-white shadow-md"
                                                style={{ background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})` }}
                                            >
                                                {lesson.order || index + 1}
                                            </div>
                                            
                                            
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                isDark ? `${typeColor.darkBg} ${typeColor.darkText}` : `${typeColor.bg} ${typeColor.text}`
                                            }`}>
                                                {lesson.type || 'theory'}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                                isDark ? `${difficultyColor.darkBg} ${difficultyColor.darkText}` : `${difficultyColor.bg} ${difficultyColor.text}`
                                            }`}>
                                                {lesson.difficulty || 'beginner'}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className={`text-base font-bold mb-2 line-clamp-2 transition-colors duration-300 ${
                                            isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'
                                        }`}>
                                            {lesson.title}
                                        </h3>

                                        {/* Description */}
                                        <p className={`text-xs mb-3 line-clamp-3 grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {lesson.description}
                                        </p>

                                        {/* Start Button */}
                                        <button 
                                            onClick={() => navigate(`/lesson/${lesson._id}`)}
                                            className="w-full py-2 hover:cursor-pointer rounded-lg text-white font-semibold text-xs transition-all duration-300 hover:shadow-md hover:opacity-90 flex items-center justify-center gap-1.5"
                                            style={{ background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})` }}
                                        >
                                            <span>Start Lesson</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom Stats */}
                {lessons.length > 0 && (
                    <div className={`mt-12 p-6 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        <div className="flex flex-wrap justify-center gap-8">
                            <div>
                                <div className={`text-3xl font-bold ${colors.blueTextGradient}`}>
                                    {lessons.length}
                                </div>
                                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Lessons</div>
                            </div>
                            <div>
                                <div className={`text-3xl font-bold ${colors.blueTextGradient}`}>
                                    {lessons.reduce((acc, l) => acc + (l.estimatedDuration || 0), 0)}
                                </div>
                                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Minutes</div>
                            </div>
                            <div>
                                <div className={`text-3xl font-bold ${colors.blueTextGradient}`}>
                                    {lessons.reduce((acc, l) => acc + (l.exercises?.length || 0), 0)}
                                </div>
                                <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Exercises</div>
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
