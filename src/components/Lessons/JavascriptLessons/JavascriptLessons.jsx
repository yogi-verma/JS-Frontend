import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../utils/WhiteDarkMode/useTheme";
import Loader from "../../../utils/Loader/Loader";
import { getLessonsByModule } from "../../../utils/BackendCalls/authService";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";

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

    const getDifficultyConfig = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return {
                    bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',
                    darkBg: 'bg-emerald-500/10', darkText: 'text-emerald-400', darkBorder: 'border-emerald-500/20',
                    dot: 'bg-emerald-500', label: 'Beginner'
                };
            case 'intermediate':
                return {
                    bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200',
                    darkBg: 'bg-amber-500/10', darkText: 'text-amber-400', darkBorder: 'border-amber-500/20',
                    dot: 'bg-amber-500', label: 'Intermediate'
                };
            case 'advanced':
                return {
                    bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200',
                    darkBg: 'bg-rose-500/10', darkText: 'text-rose-400', darkBorder: 'border-rose-500/20',
                    dot: 'bg-rose-500', label: 'Advanced'
                };
            default:
                return {
                    bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200',
                    darkBg: 'bg-gray-500/10', darkText: 'text-gray-400', darkBorder: 'border-gray-500/20',
                    dot: 'bg-gray-500', label: 'Beginner'
                };
        }
    };

    const getPhaseAccent = (index) => {
        const accents = [
            { gradient: 'from-yellow-400 to-orange-500', light: 'text-yellow-600', dark: 'text-yellow-400', bg: 'bg-yellow-500' },
            { gradient: 'from-blue-400 to-indigo-500', light: 'text-blue-600', dark: 'text-blue-400', bg: 'bg-blue-500' },
            { gradient: 'from-emerald-400 to-teal-500', light: 'text-emerald-600', dark: 'text-emerald-400', bg: 'bg-emerald-500' },
            { gradient: 'from-purple-400 to-pink-500', light: 'text-purple-600', dark: 'text-purple-400', bg: 'bg-purple-500' },
            { gradient: 'from-rose-400 to-red-500', light: 'text-rose-600', dark: 'text-rose-400', bg: 'bg-rose-500' },
            { gradient: 'from-cyan-400 to-blue-500', light: 'text-cyan-600', dark: 'text-cyan-400', bg: 'bg-cyan-500' },
        ];
        return accents[index % accents.length];
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen py-12 px-6 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <div className="max-w-4xl mx-auto">
                    <div className={`rounded-2xl p-8 border ${isDark ? 'bg-gray-900 border-red-500/20' : 'bg-white border-red-200'} shadow-lg`}>
                        <div className="flex items-start gap-4">
                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                    Error Loading Lessons
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="mt-4 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalDuration = lessons.reduce((acc, l) => acc + (l.estimatedDuration || 0), 0);
    const totalConcepts = lessons.reduce((acc, l) => acc + (l.concepts?.length || 0), 0);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
            <Header />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Header */}
                    <div className="mb-10">
                        {/* Back Button */}
                        <button 
                            onClick={() => navigate(-1)}
                            className={`group inline-flex items-center gap-2 text-sm font-medium mb-6 px-3 py-1.5 rounded-lg transition-all ${
                                isDark 
                                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Modules
                        </button>

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {/* JS Icon */}
                                <div className="shrink-0 w-14 h-14 rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                    <span className="text-2xl font-black text-black">JS</span>
                                </div>
                                <div>
                                    <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        JavaScript Lessons
                                    </h1>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Master JavaScript from fundamentals to advanced concepts
                                    </p>
                                </div>
                            </div>

                            {/* Stats Pills */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    isDark ? 'bg-gray-800 text-gray-300 border border-gray-700/50' : 'bg-white text-gray-600 border border-gray-200 shadow-sm'
                                }`}>
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                    {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    isDark ? 'bg-gray-800 text-gray-300 border border-gray-700/50' : 'bg-white text-gray-600 border border-gray-200 shadow-sm'
                                }`}>
                                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {totalDuration} min
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                    isDark ? 'bg-gray-800 text-gray-300 border border-gray-700/50' : 'bg-white text-gray-600 border border-gray-200 shadow-sm'
                                }`}>
                                    <svg className="w-3.5 h-3.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1z" />
                                    </svg>
                                    {totalConcepts} Concepts
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lessons Grid */}
                    {lessons.length === 0 ? (
                        <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${
                            isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'
                        }`}>
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                                isDark ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                                <svg className={`w-8 h-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <p className={`text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                No lessons available yet
                            </p>
                            <p className={`mt-1.5 text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                Check back soon for new content!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {lessons.map((lesson, index) => {
                                const difficulty = getDifficultyConfig(lesson.difficulty);
                                const accent = getPhaseAccent(index);
                                const conceptCount = lesson.concepts?.length || 0;
                                
                                return (
                                    <div
                                        key={lesson._id || index}
                                        onClick={() => navigate(`/lesson/${lesson._id}`)}
                                        className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
                                            isDark 
                                                ? 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-2xl hover:shadow-black/20' 
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50'
                                        } hover:-translate-y-1`}
                                    >
                                        {/* Top Gradient Accent Bar */}
                                        <div className={`h-1 w-full bg-linear-to-r ${accent.gradient}`} />

                                        <div className="p-5 flex flex-col flex-1">
                                            {/* Top Row: Order Badge + Difficulty */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold bg-linear-to-br ${accent.gradient} text-white shadow-md`}>
                                                    {String(lesson.order || index + 1).padStart(2, '0')}
                                                </div>
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                                    isDark 
                                                        ? `${difficulty.darkBg} ${difficulty.darkText} ${difficulty.darkBorder}` 
                                                        : `${difficulty.bg} ${difficulty.text} ${difficulty.border}`
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${difficulty.dot}`} />
                                                    {difficulty.label}
                                                </div>
                                            </div>

                                            {/* Phase Title */}
                                            <h3 className={`text-base font-bold mb-2 leading-snug transition-colors ${
                                                isDark 
                                                    ? 'text-white group-hover:text-blue-400' 
                                                    : 'text-gray-900 group-hover:text-blue-600'
                                            }`}>
                                                {lesson.phase}
                                            </h3>

                                            {/* Concept Tags Preview */}
                                            {lesson.concepts && lesson.concepts.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {lesson.concepts.slice(0, 3).map((concept, i) => (
                                                        <span 
                                                            key={i} 
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                                                isDark 
                                                                    ? 'bg-gray-800 text-gray-400 border border-gray-700/50' 
                                                                    : 'bg-gray-100 text-gray-600 border border-gray-200/50'
                                                            }`}
                                                        >
                                                            {concept.name}
                                                        </span>
                                                    ))}
                                                    {lesson.concepts.length > 3 && (
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                                            isDark 
                                                                ? 'bg-gray-800 text-gray-500' 
                                                                : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                            +{lesson.concepts.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Footer Stats */}
                                            <div className={`flex items-center justify-between pt-4 border-t mt-auto ${
                                                isDark ? 'border-gray-800' : 'border-gray-100'
                                            }`}>
                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {lesson.estimatedDuration || 0} min
                                                    </span>
                                                    <span className={`inline-flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                        </svg>
                                                        {conceptCount} {conceptCount === 1 ? 'concept' : 'concepts'}
                                                    </span>
                                                </div>

                                                {/* Arrow indicator */}
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                    isDark 
                                                        ? 'bg-gray-800 group-hover:bg-blue-600 text-gray-500 group-hover:text-white' 
                                                        : 'bg-gray-100 group-hover:bg-blue-600 text-gray-400 group-hover:text-white'
                                                }`}>
                                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JavascriptLessons;
