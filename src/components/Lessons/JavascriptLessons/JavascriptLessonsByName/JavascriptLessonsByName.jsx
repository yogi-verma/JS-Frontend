import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../utils/WhiteDarkMode/useTheme";
import Loader from "../../../../utils/Loader/Loader";
import { getLessonById } from "../../../../utils/BackendCalls/authService";
import Header from "../../../Header/Header";

const JavascriptLessonsByName = () => {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isDark } = useTheme();
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const contentTopRef = useRef(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await getLessonById(lessonId);
                console.log('Lesson Response:', response);
                
                if (response && response.data) {
                    setLesson(response.data);
                } else if (response && !response.data) {
                    setLesson(response);
                }
            } catch (err) {
                console.error('Error fetching lesson:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId]);

    // Scroll to top when concept changes
    useEffect(() => {
        if (contentTopRef.current) {
            contentTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedConceptIndex]);

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

    // Simple markdown-like content renderer
    const renderContent = (content) => {
        if (!content) return null;
        
        const lines = content.split('\n');
        const elements = [];
        let inCodeBlock = false;
        let codeContent = [];
        let _codeLanguage = '';

        lines.forEach((line, index) => {
            // Code block start/end
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    elements.push(
                        <pre key={`code-${index}`} className={`my-3 p-3 rounded-lg overflow-x-auto text-[13px] ${isDark ? 'bg-gray-800' : 'bg-gray-900'}`}>
                            <code className="text-green-400 font-mono">{codeContent.join('\n')}</code>
                        </pre>
                    );
                    codeContent = [];
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                    _codeLanguage = line.trim().slice(3);
                }
                return;
            }

            if (inCodeBlock) {
                codeContent.push(line);
                return;
            }

            // Headers
            if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={index} className={`text-xl font-bold mt-5 mb-2.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {line.slice(2)}
                    </h1>
                );
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={index} className={`text-lg font-semibold mt-4 mb-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {line.slice(3)}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={index} className={`text-base font-semibold mt-3 mb-1.5 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {line.slice(4)}
                    </h3>
                );
            } else if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={index} className={`text-sm font-semibold mt-2.5 mb-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                        {line.slice(5)}
                    </h4>
                );
            }
            // List items
            else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                elements.push(
                    <li key={index} className={`ml-4 mb-0.5 text-[13px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        {line.trim().slice(2)}
                    </li>
                );
            }
            // Numbered list
            else if (/^\d+\.\s/.test(line.trim())) {
                elements.push(
                    <li key={index} className={`ml-4 mb-0.5 list-decimal text-[13px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        {line.trim().replace(/^\d+\.\s/, '')}
                    </li>
                );
            }
            // Regular paragraph
            else if (line.trim()) {
                // Handle inline code
                const parts = line.split(/(`[^`]+`)/g);
                const formattedParts = parts.map((part, i) => {
                    if (part.startsWith('`') && part.endsWith('`')) {
                        return (
                            <code key={i} className={`px-1 py-0.5 rounded text-[11px] font-mono ${isDark ? 'bg-gray-800 text-pink-400' : 'bg-gray-100 text-pink-600'}`}>
                                {part.slice(1, -1)}
                            </code>
                        );
                    }
                    // Handle bold text
                    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
                    return boldParts.map((bp, j) => {
                        if (bp.startsWith('**') && bp.endsWith('**')) {
                            return <strong key={`${i}-${j}`} className="font-semibold">{bp.slice(2, -2)}</strong>;
                        }
                        return bp;
                    });
                });
                
                elements.push(
                    <p key={index} className={`mb-2 leading-relaxed text-[13px] ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        {formattedParts}
                    </p>
                );
            }
        });

        return elements;
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex justify-center items-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <Header />
                <div className="py-12 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div 
                            className={`rounded-lg p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-200'}`}
                        >
                            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                Error Loading Lesson
                            </h3>
                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                {error}
                            </p>
                            <button 
                                onClick={() => navigate(-1)}
                                className={`mt-4 px-4 py-2 rounded text-sm font-medium transition-colors ${
                                    isDark 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                ← Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                <Header />
                <div className="py-12 px-6">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className={`py-12 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                            <span className="text-4xl mb-3 block">📭</span>
                            <p className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Lesson not found
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const difficultyColor = getDifficultyColor(lesson.difficulty);
    const selectedConcept = lesson.concepts?.[selectedConceptIndex];

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Header />
            
            {/* Mobile Header with hamburger */}
            <div className={`lg:hidden sticky top-0 z-40 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between p-4">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <svg className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {lesson.phase}
                    </h1>
                    <button 
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <svg className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar - Left */}
                <div className={`fixed lg:sticky top-0 left-0 h-screen w-72 ${isDark ? 'bg-gray-800 border-r border-gray-700' : 'bg-gray-50 border-r border-gray-200'} overflow-y-auto transition-transform duration-300 z-50 lg:z-30 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                    <div className="p-4">
                        {/* Phase Header */}
                        <div className="mb-4">
                            {/* Mobile close button */}
                            <div className="flex lg:hidden items-center justify-between mb-3">
                                <h1 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {lesson.phase}
                                </h1>
                                <button 
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {/* Desktop close button */}
                            <div className="hidden lg:flex items-center justify-between mb-3">
                                <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {lesson.phase}
                                </h1>
                                
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                                <button 
                                    onClick={() => navigate(-1)}
                                    className={`inline-flex items-center gap-1 py-1 rounded-lg text-xs font-medium ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                                <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                                    isDark ? `${difficultyColor.darkBg} ${difficultyColor.darkText}` : `${difficultyColor.bg} ${difficultyColor.text}`
                                }`}>
                                    {lesson.difficulty}
                                </span>
                                
                            </div>
                            
                            <div className={`h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}></div>
                        </div>

                        {/* Concepts List */}
                        <div>
                            <h2 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>
                                Concepts ({lesson.concepts?.length || 0})
                            </h2>
                            <nav className="space-y-1">
                                {lesson.concepts?.map((concept, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSelectedConceptIndex(index);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                            selectedConceptIndex === index
                                                ? isDark 
                                                    ? 'bg-blue-600 text-white shadow-lg' 
                                                    : 'bg-blue-600 text-white shadow-lg'
                                                : isDark 
                                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                                    : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                                                selectedConceptIndex === index
                                                    ? 'bg-white text-blue-600'
                                                    : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-600'
                                            }`}>
                                                {index + 1}
                                            </span>
                                            <span className="text-[13px] font-medium leading-snug">
                                                {concept.name}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content - Right */}
                <div className="flex-1 min-w-0">
                    <div className="max-w-4xl mx-auto p-6 lg:p-8">
                        {selectedConcept ? (
                            <div>
                                {/* Scroll anchor */}
                                <div ref={contentTopRef} className="scroll-mt-20" />
                                
                                {/* Content Header */}
                                <div className="mb-4">
                                    <h2 className={`text-lg lg:text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedConcept.name}
                                    </h2>
                                    <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Concept {selectedConceptIndex + 1} of {lesson.concepts?.length || 0}
                                    </p>
                                </div>

                                {/* Content */}
                                <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                                    {renderContent(selectedConcept.content)}
                                </div>

                                {/* Navigation Buttons */}
                                <div className={`flex items-center justify-between mt-5 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <button
                                        onClick={() => setSelectedConceptIndex(prev => Math.max(0, prev - 1))}
                                        disabled={selectedConceptIndex === 0}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                                            selectedConceptIndex === 0
                                                ? isDark ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous
                                    </button>
                                    
                                    <button
                                        onClick={() => setSelectedConceptIndex(prev => Math.min((lesson.concepts?.length || 1) - 1, prev + 1))}
                                        disabled={selectedConceptIndex === (lesson.concepts?.length || 1) - 1}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                                            selectedConceptIndex === (lesson.concepts?.length || 1) - 1
                                                ? isDark ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        Next
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Resources Section */}
                                {lesson.resources && lesson.resources.length > 0 && (
                                    <div className={`mt-8 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'}`}>
                                        <div className={`px-5 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <div className="flex items-center gap-2.5">
                                                <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-900/40' : 'bg-indigo-100'}`}>
                                                    <svg className={`w-4.5 h-4.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        Additional Resources
                                                    </h3>
                                                    <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        Deepen your understanding with these curated materials
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 grid gap-3 sm:grid-cols-2">
                                            {lesson.resources.map((resource, idx) => {
                                                const typeConfig = {
                                                    documentation: { 
                                                        icon: (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                            </svg>
                                                        ),
                                                        color: isDark ? 'text-blue-400 bg-blue-900/30 border-blue-800/50' : 'text-blue-600 bg-blue-50 border-blue-200',
                                                        badge: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                                                    },
                                                    article: { 
                                                        icon: (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z" />
                                                            </svg>
                                                        ),
                                                        color: isDark ? 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50' : 'text-emerald-600 bg-emerald-50 border-emerald-200',
                                                        badge: isDark ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                                    },
                                                    video: { 
                                                        icon: (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                                                            </svg>
                                                        ),
                                                        color: isDark ? 'text-red-400 bg-red-900/30 border-red-800/50' : 'text-red-600 bg-red-50 border-red-200',
                                                        badge: isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
                                                    },
                                                    github: { 
                                                        icon: (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                            </svg>
                                                        ),
                                                        color: isDark ? 'text-gray-300 bg-gray-700/50 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-200',
                                                        badge: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                                    }
                                                };

                                                const config = typeConfig[resource.type] || typeConfig.article;

                                                return (
                                                    <a
                                                        key={idx}
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`group flex items-start gap-3 p-3.5 rounded-lg border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${config.color}`}
                                                    >
                                                        <div className={`shrink-0 mt-0.5 p-1.5 rounded-md ${isDark ? 'bg-gray-700/60' : 'bg-white shadow-sm'}`}>
                                                            {config.icon}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <h4 className={`text-[13px] font-semibold truncate group-hover:underline ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                    {resource.title}
                                                                </h4>
                                                                <svg className={`w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                </svg>
                                                            </div>
                                                            <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {resource.description}
                                                            </p>
                                                            <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${config.badge}`}>
                                                                {resource.type}
                                                            </span>
                                                        </div>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`py-12 text-center rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                                <span className="text-4xl mb-3 block">📝</span>
                                <p className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Select a concept from the sidebar to begin
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JavascriptLessonsByName;
