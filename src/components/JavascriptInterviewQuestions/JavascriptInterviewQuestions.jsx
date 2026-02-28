import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { getInterviewQuestions, getUserInterviewProgress, toggleQuestionCompletion } from "../../utils/BackendCalls/authService";
import { useUser } from "../../utils/UserContext/UserContext";
import Loader from "../../utils/Loader/Loader";

const JavascriptInterviewQuestions = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedMap, setCompletedMap] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const contentRefs = useRef({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await getInterviewQuestions();
        if (response?.data) {
          setQuestions(response.data);
        }
        // Fetch completion progress if user is authenticated
        if (isAuthenticated) {
          try {
            const progressRes = await getUserInterviewProgress();
            if (progressRes?.data) {
              setCompletedMap(progressRes.data);
            }
          } catch (err) {
            console.error('Error fetching progress:', err);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [isAuthenticated]);

  const handleToggleCompletion = async (questionId) => {
    if (!isAuthenticated || togglingId) return;
    setTogglingId(questionId);
    try {
      const response = await toggleQuestionCompletion(questionId);
      if (response?.data) {
        setCompletedMap(prev => {
          const newMap = { ...prev };
          if (response.data.isCompleted) {
            newMap[questionId] = {
              isCompleted: true,
              completedAt: response.data.completedAt
            };
          } else {
            delete newMap[questionId];
          }
          return newMap;
        });
      }
    } catch (err) {
      console.error('Error toggling completion:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesDifficulty = activeFilter === 'All' || q.difficulty === activeFilter;
    const matchesSearch = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const stats = {
    total: questions.length,
    Easy: questions.filter(q => q.difficulty === 'Easy').length,
    Medium: questions.filter(q => q.difficulty === 'Medium').length,
    Hard: questions.filter(q => q.difficulty === 'Hard').length,
    completed: Object.keys(completedMap).length,
  };

  const difficultyConfig = {
    Easy: {
      color: isDark ? 'text-emerald-400' : 'text-emerald-600',
      bg: isDark ? 'bg-emerald-900/25' : 'bg-emerald-50',
      border: isDark ? 'border-emerald-800/40' : 'border-emerald-200',
      badge: isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' : 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      ring: isDark ? 'ring-emerald-500/20' : 'ring-emerald-500/10',
    },
    Medium: {
      color: isDark ? 'text-amber-400' : 'text-amber-600',
      bg: isDark ? 'bg-amber-900/25' : 'bg-amber-50',
      border: isDark ? 'border-amber-800/40' : 'border-amber-200',
      badge: isDark ? 'bg-amber-900/40 text-amber-300 border-amber-700/50' : 'bg-amber-100 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      ring: isDark ? 'ring-amber-500/20' : 'ring-amber-500/10',
    },
    Hard: {
      color: isDark ? 'text-rose-400' : 'text-rose-600',
      bg: isDark ? 'bg-rose-900/25' : 'bg-rose-50',
      border: isDark ? 'border-rose-800/40' : 'border-rose-200',
      badge: isDark ? 'bg-rose-900/40 text-rose-300 border-rose-700/50' : 'bg-rose-100 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      ring: isDark ? 'ring-rose-500/20' : 'ring-rose-500/10',
    },
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
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
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className={`rounded-lg p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-200'}`}>
            <p className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>Failed to load questions</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className={`border-b ${isDark ? 'bg-gray-800/50 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                    <svg className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                    </svg>
                  </div>
                  <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    JavaScript Interview Questions
                  </h1>
                </div>
                <p className={`text-sm max-w-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Master the most asked JavaScript interview questions with detailed answers and real coding examples.
                </p>
              </div>

              {/* Stats Pills */}
              <div className="flex items-center gap-2 shrink-0">
                {[
                  { label: 'Easy', count: stats.Easy, color: 'emerald' },
                  { label: 'Medium', count: stats.Medium, color: 'amber' },
                  { label: 'Hard', count: stats.Hard, color: 'rose' },
                ].map(s => (
                  <div
                    key={s.label}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${
                      isDark 
                        ? `bg-${s.color}-900/20 text-${s.color}-400 border-${s.color}-800/30` 
                        : `bg-${s.color}-50 text-${s.color}-700 border-${s.color}-200`
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full bg-${s.color}-500`}></span>
                    {s.count}
                  </div>
                ))}
                <div className={`px-2.5 py-1.5 rounded-full text-xs font-bold border ${
                  isDark ? 'bg-gray-700/50 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {stats.total} total
                </div>
                {isAuthenticated && stats.completed > 0 && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${
                    isDark 
                      ? 'bg-blue-900/20 text-blue-400 border-blue-800/30' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {stats.completed} done
                  </div>
                )}
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search questions, answers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none transition-colors ${
                    isDark 
                      ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Difficulty Tabs */}
              <div className={`flex items-center rounded-lg border p-0.5 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                {['All', 'Easy', 'Medium', 'Hard'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                      activeFilter === filter
                        ? isDark 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white text-gray-900 shadow-sm'
                        : isDark 
                          ? 'text-gray-400 hover:text-gray-200' 
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          {paginatedQuestions.length === 0 ? (
            <div className={`text-center py-16 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-800' : 'bg-white border-gray-200'}`}>
              <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No questions found</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Try a different search or filter</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {paginatedQuestions.map((q) => {
                const config = difficultyConfig[q.difficulty] || difficultyConfig.Easy;
                const isExpanded = expandedId === q._id;
                const isCompleted = !!completedMap[q._id];
                
                return (
                  <div
                    key={q._id}
                    className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                      isExpanded 
                        ? `ring-2 ${config.ring} ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`
                        : isDark ? 'bg-gray-800/60 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleExpand(q._id)}
                      className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 sm:gap-4"
                    >
                      {/* Question Number */}
                      <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isExpanded
                            ? 'bg-blue-600 text-white'
                            : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : q.order}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className={`text-sm sm:text-[15px] font-semibold leading-snug pr-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {q.question}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-medium border ${config.badge}`}>
                              {q.difficulty}
                            </span>
                            <span className={`sm:hidden w-2 h-2 rounded-full ${config.dot}`}></span>
                            <svg
                              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                              fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {q.category && (
                          <span className={`inline-block mt-1.5 text-[11px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {q.category}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <div
                      ref={el => contentRefs.current[q._id] = el}
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: isExpanded ? `${(contentRefs.current[q._id]?.scrollHeight || 0) + 100}px` : '0px',
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <div className={`px-4 sm:px-5 pb-5 pt-1 border-t ${isDark ? 'border-gray-700/60' : 'border-gray-100'}`}>
                        {/* Answer */}
                        <div className={`mt-3 p-3.5 rounded-lg ${isDark ? 'bg-gray-900/60' : 'bg-gray-50'}`}>
                          <div className="flex items-start gap-2.5">
                            <div className={`shrink-0 mt-0.5 p-1 rounded ${isDark ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                              <svg className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                              </svg>
                            </div>
                            <div>
                              <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Answer</p>
                              <p className={`text-[13px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {q.answer}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Coding Examples */}
                        {q.codingExamples && q.codingExamples.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <svg className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                              </svg>
                              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Code Examples ({q.codingExamples.length})
                              </span>
                            </div>

                            {q.codingExamples.map((example, exIdx) => (
                              <div key={exIdx} className={`rounded-lg border overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                {/* Example Title Bar */}
                                {example.title && (
                                  <div className={`px-3.5 py-2 text-xs font-semibold flex items-center gap-2 ${
                                    isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
                                    {example.title}
                                  </div>
                                )}

                                {/* Code Block */}
                                <pre className={`p-3.5 overflow-x-auto text-[12px] leading-relaxed ${isDark ? 'bg-gray-950' : 'bg-gray-900'}`}>
                                  <code className="text-green-400 font-mono whitespace-pre">{example.code}</code>
                                </pre>

                                {/* Explanation */}
                                {example.explanation && (
                                  <div className={`px-3.5 py-2.5 text-[12px] leading-relaxed border-t ${
                                    isDark 
                                      ? 'bg-gray-800/80 border-gray-700 text-gray-400' 
                                      : 'bg-gray-50 border-gray-200 text-gray-600'
                                  }`}>
                                    <span className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Explanation: </span>
                                    {example.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Mark as Completed Button */}
                        {isAuthenticated && (
                          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700/60' : 'border-gray-100'}`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleCompletion(q._id);
                              }}
                              disabled={togglingId === q._id}
                              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                togglingId === q._id 
                                  ? 'opacity-60 cursor-not-allowed' 
                                  : 'cursor-pointer'
                              } ${
                                isCompleted
                                  ? isDark
                                    ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/50'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : isDark
                                    ? 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-gray-800'
                              }`}
                            >
                              {togglingId === q._id ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                              ) : isCompleted ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              {togglingId === q._id 
                                ? 'Saving...' 
                                : isCompleted 
                                  ? 'Completed' 
                                  : 'Mark as Completed'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredQuestions.length > 0 && totalPages > 1 && (
            <div className="mt-6 mb-2 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5">
                {/* Previous */}
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); setExpandedId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:cursor-pointer'} ${
                    isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); setExpandedId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all hover:cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isDark
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); setExpandedId(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:cursor-pointer'} ${
                    isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Results count */}
          {filteredQuestions.length > 0 && (
            <div className={`text-center mt-2 mb-4 text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              Showing {(currentPage - 1) * questionsPerPage + 1}–{Math.min(currentPage * questionsPerPage, filteredQuestions.length)} of {filteredQuestions.length} questions
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JavascriptInterviewQuestions;
