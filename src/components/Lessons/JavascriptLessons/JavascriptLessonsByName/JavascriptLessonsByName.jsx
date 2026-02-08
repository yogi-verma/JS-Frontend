import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../utils/WhiteDarkMode/useTheme";
import Loader from "../../../../utils/Loader/Loader";
import colors from "../../../../utils/color";
import { getLessonById } from "../../../../utils/BackendCalls/authService";
import Header from "../../../Header/Header";

const JavascriptLessonsByName = () => {
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const { isDark } = useTheme();
    const { lessonId } = useParams();
    const navigate = useNavigate();

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

    const getTypeIcon = (type) => {
        switch (type) {
            case 'theory': return '📖';
            case 'practice': return '💻';
            case 'quiz': return '❓';
            case 'project': return '🚀';
            default: return '📚';
        }
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'video': return '🎬';
            case 'article': return '📄';
            case 'documentation': return '📚';
            case 'github': return '💻';
            case 'external': return '🔗';
            default: return '📎';
        }
    };

    // Simple markdown-like content renderer
    const renderContent = (content) => {
        if (!content) return null;
        
        const lines = content.split('\n');
        const elements = [];
        let inCodeBlock = false;
        let codeContent = [];
        let codeLanguage = '';

        lines.forEach((line, index) => {
            // Code block start/end
            if (line.trim().startsWith('```')) {
                if (inCodeBlock) {
                    elements.push(
                        <pre key={`code-${index}`} className={`my-4 p-4 rounded-xl overflow-x-auto text-sm ${isDark ? 'bg-gray-800' : 'bg-gray-900'}`}>
                            <code className="text-green-400">{codeContent.join('\n')}</code>
                        </pre>
                    );
                    codeContent = [];
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                    codeLanguage = line.trim().slice(3);
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
                    <h1 key={index} className={`text-3xl font-bold mt-8 mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {line.slice(2)}
                    </h1>
                );
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={index} className={`text-2xl font-bold mt-6 mb-3 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                        {line.slice(3)}
                    </h2>
                );
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={index} className={`text-xl font-semibold mt-5 mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {line.slice(4)}
                    </h3>
                );
            } else if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={index} className={`text-lg font-semibold mt-4 mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {line.slice(5)}
                    </h4>
                );
            }
            // List items
            else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                elements.push(
                    <li key={index} className={`ml-6 mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {line.trim().slice(2)}
                    </li>
                );
            }
            // Numbered list
            else if (/^\d+\.\s/.test(line.trim())) {
                elements.push(
                    <li key={index} className={`ml-6 mb-1 list-decimal ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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
                            <code key={i} className={`px-1.5 py-0.5 rounded text-sm ${isDark ? 'bg-gray-700 text-pink-400' : 'bg-gray-100 text-pink-600'}`}>
                                {part.slice(1, -1)}
                            </code>
                        );
                    }
                    // Handle bold text
                    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
                    return boldParts.map((bp, j) => {
                        if (bp.startsWith('**') && bp.endsWith('**')) {
                            return <strong key={`${i}-${j}`}>{bp.slice(2, -2)}</strong>;
                        }
                        return bp;
                    });
                });
                
                elements.push(
                    <p key={index} className={`mb-3 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {formattedParts}
                    </p>
                );
            }
        });

        return elements;
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
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
                <Header />
                <div className="py-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div 
                            className="rounded-2xl p-8 border shadow-lg"
                            style={{
                                background: isDark ? '#1F2937' : '#FEF2F2',
                                borderColor: isDark ? '#EF4444' : '#FCA5A5'
                            }}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-4xl">⚠️</span>
                                <h3 className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                    Error Loading Lesson
                                </h3>
                            </div>
                            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
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
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
                <Header />
                <div className="py-12 px-6 text-center">
                    <span className="text-6xl mb-4 block">📭</span>
                    <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Lesson not found</p>
                </div>
            </div>
        );
    }

    const difficultyColor = getDifficultyColor(lesson.difficulty);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
            <Header />
            
            <div className="pb-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Lesson Header - Title (Left) & Back Button (Right) */}
                    <div className={`rounded-2xl p-4 sm:p-6 mb-6`}>
                        <div className="flex items-center justify-between gap-4">
                            {/* Title */}
                            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {lesson.title}
                            </h1>
                            
                            {/* Back Button */}
                            <button 
                                onClick={() => navigate(-1)}
                                className={`flex-shrink-0 inline-flex hover:cursor-pointer hover:scale-105 items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                                    isDark 
                                        ? ' text-gray-300' 
                                        : ' text-gray-600'
                                }`}
                            >
                                <span className="hidden sm:inline">Back to Lessons</span>
                                <span className="sm:hidden">Back</span>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className={`flex flex-wrap gap-2 mb-6 p-2 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                        {['content', 'objectives', 'resources', 'exercises'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 ${
                                    activeTab === tab
                                        ? 'text-white shadow-md'
                                        : isDark 
                                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                                style={activeTab === tab ? { background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})` } : {}}
                            >
                                {tab === 'content' && '📖 '}
                                {tab === 'objectives' && '🎯 '}
                                {tab === 'resources' && '📚 '}
                                {tab === 'exercises' && '✏️ '}
                                {tab}
                                {tab === 'objectives' && lesson.objectives && ` (${lesson.objectives.length})`}
                                {tab === 'resources' && lesson.resources && ` (${lesson.resources.length})`}
                                {tab === 'exercises' && lesson.exercises && ` (${lesson.exercises.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className={`rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        {/* Content Tab */}
                        {activeTab === 'content' && (
                            <div className="prose max-w-none">
                                {renderContent(lesson.content)}
                            </div>
                        )}

                        {/* Objectives Tab */}
                        {activeTab === 'objectives' && (
                            <div>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    🎯 Learning Objectives
                                </h2>
                                {lesson.objectives && lesson.objectives.length > 0 ? (
                                    <div className="space-y-4">
                                        {lesson.objectives.map((objective, index) => (
                                            <div 
                                                key={index}
                                                className={`flex items-start gap-4 p-4 rounded-xl ${
                                                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                                                }`}
                                            >
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                                    style={{ background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})` }}
                                                >
                                                    {index + 1}
                                                </div>
                                                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {objective}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No objectives defined for this lesson.</p>
                                )}
                            </div>
                        )}

                        {/* Resources Tab */}
                        {activeTab === 'resources' && (
                            <div>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    📚 Resources
                                </h2>
                                {lesson.resources && lesson.resources.length > 0 ? (
                                    <div className="grid gap-4">
                                        {lesson.resources.map((resource, index) => (
                                            <a
                                                key={index}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md ${
                                                    isDark 
                                                        ? 'bg-gray-700/50 hover:bg-gray-700' 
                                                        : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                            >
                                                <span className="text-3xl">{getResourceIcon(resource.type)}</span>
                                                <div className="flex-grow">
                                                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                                        {resource.title}
                                                    </h3>
                                                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {resource.description}
                                                    </p>
                                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                                        isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                        {resource.type}
                                                    </span>
                                                </div>
                                                <svg className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No resources available for this lesson.</p>
                                )}
                            </div>
                        )}

                        {/* Exercises Tab */}
                        {activeTab === 'exercises' && (
                            <div>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    ✏️ Exercises
                                </h2>
                                {lesson.exercises && lesson.exercises.length > 0 ? (
                                    <div className="space-y-6">
                                        {lesson.exercises.map((exercise, index) => (
                                            <div 
                                                key={index}
                                                className={`p-5 rounded-xl border ${
                                                    isDark 
                                                        ? 'bg-gray-700/30 border-gray-600' 
                                                        : 'bg-gray-50 border-gray-200'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        exercise.type === 'multiple-choice' 
                                                            ? isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                                                            : exercise.type === 'true-false'
                                                            ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                                            : isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {exercise.type}
                                                    </span>
                                                    <span className={`text-sm font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                                                        {exercise.points} pts
                                                    </span>
                                                </div>

                                                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                                    Q{index + 1}. {exercise.question}
                                                </h3>

                                                {exercise.options && exercise.options.length > 0 && (
                                                    <div className="space-y-2 mb-4">
                                                        {exercise.options.map((option, optIndex) => (
                                                            <div 
                                                                key={optIndex}
                                                                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                                                    isDark 
                                                                        ? 'bg-gray-600/50 hover:bg-gray-600' 
                                                                        : 'bg-white hover:bg-gray-100 border border-gray-200'
                                                                }`}
                                                            >
                                                                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                                                    {String.fromCharCode(65 + optIndex)}. {option}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {exercise.type === 'code' && (
                                                    <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-900'}`}>
                                                        <p className="text-gray-400 text-sm mb-2">Write your code here:</p>
                                                        <textarea 
                                                            className={`w-full h-24 bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none`}
                                                            placeholder="// Your code..."
                                                        />
                                                    </div>
                                                )}

                                                <button 
                                                    className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-all duration-300 hover:shadow-md"
                                                    style={{ background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})` }}
                                                >
                                                    Check Answer
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No exercises available for this lesson.</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default JavascriptLessonsByName;
