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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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

    // Auto-advance carousel every 5 seconds
    useEffect(() => {
        if (!isImageModalOpen && lesson?.images && lesson.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => 
                    (prevIndex + 1) % lesson.images.length
                );
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isImageModalOpen, lesson?.images]);

    const nextImage = () => {
        if (lesson?.images) {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % lesson.images.length
            );
        }
    };

    const prevImage = () => {
        if (lesson?.images) {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === 0 ? lesson.images.length - 1 : prevIndex - 1
            );
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

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
        let _codeLanguage = '';

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

    const _difficultyColor = getDifficultyColor(lesson.difficulty);

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
                        {['content', 'resources', 'interview'].map((tab) => (
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
                                {tab === 'resources' && '📚 '}
                                {tab === 'interview' && '💼 '}
                                {tab === 'interview' ? 'Interview Questions' : tab}
                                {tab === 'resources' && lesson.resources && ` (${lesson.resources.length})`}
                                {tab === 'interview' && lesson.interviewQuestions && ` (${lesson.interviewQuestions.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className={`rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                        {/* Content Tab */}
                        {activeTab === 'content' && (
                            <div className="prose max-w-none">
                                {renderContent(lesson.content)}
                                
                                {/* Images Carousel Section */}
                                {lesson.images && lesson.images.length > 0 && (
                                    <div className="mt-8">
                                        <div className="relative max-w-3xl mx-auto">
                                            {/* Carousel Container */}
                                            <div className={`relative overflow-hidden ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                                                {/* Image */}
                                                <div className="relative cursor-pointer" style={{ height: '300px' }} onClick={openImageModal}>
                                                    <img 
                                                        src={lesson.images[currentImageIndex].url} 
                                                        alt={lesson.images[currentImageIndex].alt || lesson.images[currentImageIndex].caption}
                                                        className="w-full h-full object-contain"
                                                    />
                                                    
                                                    {/* Previous Button */}
                                                    {lesson.images.length > 1 && (
                                                        <button
                                                            onClick={prevImage}
                                                            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                                                                isDark 
                                                                    ? 'bg-gray-800/80 hover:bg-gray-800 text-white' 
                                                                    : 'bg-white/80 hover:bg-white text-gray-800'
                                                            } shadow-lg hover:scale-110`}
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    
                                                    {/* Next Button */}
                                                    {lesson.images.length > 1 && (
                                                        <button
                                                            onClick={nextImage}
                                                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                                                                isDark 
                                                                    ? 'bg-gray-800/80 hover:bg-gray-800 text-white' 
                                                                    : 'bg-white/80 hover:bg-white text-gray-800'
                                                            } shadow-lg hover:scale-110`}
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                {/* Caption */}
                                                {lesson.images[currentImageIndex].caption && (
                                                    <p className={`p-4 text-center text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {lesson.images[currentImageIndex].caption}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {/* Indicators */}
                                            {lesson.images.length > 1 && (
                                                <div className="flex justify-center items-center gap-2 mt-4">
                                                    {lesson.images.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => goToImage(index)}
                                                            className={`transition-all duration-300 rounded-full ${
                                                                index === currentImageIndex
                                                                    ? 'w-8 h-2'
                                                                    : 'w-2 h-2'
                                                            }`}
                                                            style={{
                                                                background: index === currentImageIndex
                                                                    ? `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`
                                                                    : isDark ? '#4B5563' : '#D1D5DB'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Image Counter */}
                                            {lesson.images.length > 1 && (
                                                <p className={`text-center mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {currentImageIndex + 1} / {lesson.images.length}
                                                </p>
                                            )}
                                        </div>
                                    </div>
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

                        {/* Interview Questions Tab */}
                        {activeTab === 'interview' && (
                            <div>
                                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    💼 Interview Questions
                                </h2>
                                {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 ? (
                                    <div className="space-y-6">
                                        {lesson.interviewQuestions.map((item, index) => (
                                            <div 
                                                key={index}
                                                className={`p-5 rounded-xl border ${
                                                    isDark 
                                                        ? 'bg-gray-700/30 border-gray-600' 
                                                        : 'bg-gray-50 border-gray-200'
                                                }`}
                                            >
                                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        item.difficulty === 'beginner' 
                                                            ? isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                                            : item.difficulty === 'intermediate'
                                                            ? isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'
                                                            : isDark ? 'bg-rose-900/30 text-rose-400' : 'bg-rose-100 text-rose-700'
                                                    }`}>
                                                        {item.difficulty}
                                                    </span>
                                                    {item.category && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                                    Q{index + 1}. {item.question}
                                                </h3>

                                                <div className={`p-4 rounded-lg ${
                                                    isDark ? 'bg-gray-600/30' : 'bg-white'
                                                }`}>
                                                    <p className={`font-medium mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                                        Answer:
                                                    </p>
                                                    <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No interview questions available for this lesson.</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>

            {/* Image Modal */}
            {isImageModalOpen && lesson.images && lesson.images.length > 0 && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={closeImageModal}
                    style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                >
                    {/* Modal Content */}
                    <div 
                        className="relative max-w-7xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeImageModal}
                            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 hover:scale-110 z-10"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image */}
                        <div className="relative rounded-xl overflow-hidden">
                            <img 
                                src={lesson.images[currentImageIndex].url} 
                                alt={lesson.images[currentImageIndex].alt || lesson.images[currentImageIndex].caption}
                                className="w-full h-auto max-h-[90vh] object-contain mx-auto"
                            />
                        </div>

                        {/* Caption */}
                        {lesson.images[currentImageIndex].caption && (
                            <p className="text-center text-white mt-4 text-base">
                                {lesson.images[currentImageIndex].caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JavascriptLessonsByName;
