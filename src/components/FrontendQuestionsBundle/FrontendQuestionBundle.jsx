import React, { useState, useEffect, useRef } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { getFrontendQuestionsStats, getFrontendQuestionsByCategory, getUserFrontendProgress, toggleFrontendQuestionCompletion } from "../../utils/BackendCalls/authService";
import { useUser } from "../../utils/UserContext/UserContext";
import Loader from "../../utils/Loader/Loader";

const FrontendQuestionBundle = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();

  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [completedMap, setCompletedMap] = useState({});
  const [togglingId, setTogglingId] = useState(null);
  const [expandedCodeIds, setExpandedCodeIds] = useState({});
  const questionsPerPage = 10;
  const contentRefs = useRef({});
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch stats (categories list) and progress on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getFrontendQuestionsStats();
        if (response?.data) {
          setStats(response.data);
        }
        // Fetch completion progress if user is authenticated
        if (isAuthenticated) {
          try {
            const progressRes = await getUserFrontendProgress();
            if (progressRes?.data) {
              setCompletedMap(progressRes.data);
            }
          } catch (err) {
            console.error('Error fetching frontend progress:', err);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [isAuthenticated]);

  // Fetch questions when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchQuestions = async () => {
      try {
        setQuestionsLoading(true);
        setExpandedId(null);
        setSearchQuery('');
        setCurrentPage(1);
        const response = await getFrontendQuestionsByCategory(selectedCategory);
        if (response?.data) {
          setQuestions(response.data);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setQuestionsLoading(false);
      }
    };
    fetchQuestions();
  }, [selectedCategory]);

  // Reset page on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  const handleToggleCompletion = async (questionId) => {
    if (!isAuthenticated || togglingId) return;
    setTogglingId(questionId);
    try {
      const response = await toggleFrontendQuestionCompletion(questionId);
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

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const toggleCodeExpand = (id) => {
    setExpandedCodeIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter questions by search
  const filteredQuestions = questions.filter(q => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      q.question.toLowerCase().includes(query) ||
      q.answer.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  // Get count for a category from stats
  const getCategoryCount = (cat) => {
    const item = stats?.byCategory?.find(c => c.category === cat);
    return item ? item.count : 0;
  };

  // Category color mapping
  const categoryColors = {
    'HTML & WEB FUNDAMENTALS': { accent: 'orange', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-100', darkBg: 'bg-orange-900/25', border: 'border-orange-500/30' },
    'CSS (ADVANCED)': { accent: 'blue', bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-100', darkBg: 'bg-blue-900/25', border: 'border-blue-500/30' },
    'JAVASCRIPT CORE (DEEP)': { accent: 'yellow', bg: 'bg-yellow-500', text: 'text-yellow-500', light: 'bg-yellow-100', darkBg: 'bg-yellow-900/25', border: 'border-yellow-500/30' },
    'JAVASCRIPT DESIGN PATTERNS & CONCEPTS': { accent: 'amber', bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-100', darkBg: 'bg-amber-900/25', border: 'border-amber-500/30' },
    'TYPESCRIPT (ADVANCED)': { accent: 'sky', bg: 'bg-sky-500', text: 'text-sky-500', light: 'bg-sky-100', darkBg: 'bg-sky-900/25', border: 'border-sky-500/30' },
    'FRONTEND FRAMEWORKS (REACT FOCUSED)': { accent: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-500', light: 'bg-cyan-100', darkBg: 'bg-cyan-900/25', border: 'border-cyan-500/30' },
    'STATE MANAGEMENT': { accent: 'purple', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-100', darkBg: 'bg-purple-900/25', border: 'border-purple-500/30' },
    'PERFORMANCE OPTIMIZATION': { accent: 'green', bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-100', darkBg: 'bg-green-900/25', border: 'border-green-500/30' },
    'BROWSER & WEB APIS': { accent: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-500', light: 'bg-indigo-100', darkBg: 'bg-indigo-900/25', border: 'border-indigo-500/30' },
    'NETWORKING & APIS': { accent: 'teal', bg: 'bg-teal-500', text: 'text-teal-500', light: 'bg-teal-100', darkBg: 'bg-teal-900/25', border: 'border-teal-500/30' },
    'SECURITY': { accent: 'red', bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-100', darkBg: 'bg-red-900/25', border: 'border-red-500/30' },
    'ACCESSIBILITY (A11Y)': { accent: 'violet', bg: 'bg-violet-500', text: 'text-violet-500', light: 'bg-violet-100', darkBg: 'bg-violet-900/25', border: 'border-violet-500/30' },
    'RENDERING STRATEGIES (SSR, SSG, ISR)': { accent: 'fuchsia', bg: 'bg-fuchsia-500', text: 'text-fuchsia-500', light: 'bg-fuchsia-100', darkBg: 'bg-fuchsia-900/25', border: 'border-fuchsia-500/30' },
    'TOOLING & BUILD SYSTEMS': { accent: 'lime', bg: 'bg-lime-500', text: 'text-lime-500', light: 'bg-lime-100', darkBg: 'bg-lime-900/25', border: 'border-lime-500/30' },
    'TESTING': { accent: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-100', darkBg: 'bg-emerald-900/25', border: 'border-emerald-500/30' },
    'ARCHITECTURE & SCALABILITY': { accent: 'rose', bg: 'bg-rose-500', text: 'text-rose-500', light: 'bg-rose-100', darkBg: 'bg-rose-900/25', border: 'border-rose-500/30' },
    'UX & PRODUCT THINKING': { accent: 'pink', bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-100', darkBg: 'bg-pink-900/25', border: 'border-pink-500/30' },
    'DEVOPS & PRODUCTION': { accent: 'slate', bg: 'bg-slate-500', text: 'text-slate-500', light: 'bg-slate-200', darkBg: 'bg-slate-900/25', border: 'border-slate-500/30' },
    'DEBUGGING & TROUBLESHOOTING': { accent: 'zinc', bg: 'bg-zinc-500', text: 'text-zinc-500', light: 'bg-zinc-200', darkBg: 'bg-zinc-900/25', border: 'border-zinc-500/30' },
    'ENGINEERING MATURITY': { accent: 'stone', bg: 'bg-stone-500', text: 'text-stone-500', light: 'bg-stone-200', darkBg: 'bg-stone-900/25', border: 'border-stone-500/30' },
  };

  const getColor = (cat) => categoryColors[cat] || { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-100', darkBg: 'bg-blue-900/25', border: 'border-blue-500/30' };

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
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                    <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Frontend Developer Question Bank
                  </h1>
                </div>
                <p className={`text-sm max-w-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  The ultimate collection of advanced frontend interview questions across 20 categories — from HTML fundamentals to engineering maturity.
                </p>
              </div>

              {/* Stats Pills */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {stats && (
                  <>
                    <div className={`px-2.5 py-1.5 rounded-full text-xs font-bold border ${
                      isDark ? 'bg-purple-900/20 text-purple-400 border-purple-800/30' : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {stats.total} questions
                    </div>
                    <div className={`px-2.5 py-1.5 rounded-full text-xs font-bold border ${
                      isDark ? 'bg-gray-700/50 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {stats.seededCategories}/{stats.totalCategories} categories
                    </div>
                    {isAuthenticated && Object.keys(completedMap).length > 0 && (
                      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${
                        isDark
                          ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800/30'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {Object.keys(completedMap).length} done
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Category Dropdown + Search */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {/* Category Dropdown */}
              <div className="relative sm:w-80" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border outline-none transition-all cursor-pointer ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-white hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                  } ${dropdownOpen ? (isDark ? 'border-purple-500 ring-1 ring-purple-500/20' : 'border-purple-500 ring-1 ring-purple-500/10') : ''}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className={`w-4 h-4 shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                    <span className="truncate">
                      {selectedCategory || 'Select a Category'}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className={`absolute z-50 mt-1.5 w-full max-h-80 overflow-y-auto rounded-xl border shadow-xl ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {stats?.allCategories?.map((cat) => {
                      const count = getCategoryCount(cat);
                      const color = getColor(cat);
                      const isSeeded = count > 0;
                      const isSelected = selectedCategory === cat;

                      return (
                        <button
                          key={cat}
                          onClick={() => isSeeded ? handleSelectCategory(cat) : null}
                          disabled={!isSeeded}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors ${
                            !isSeeded
                              ? isDark ? 'opacity-40 cursor-not-allowed' : 'opacity-40 cursor-not-allowed'
                              : isSelected
                                ? isDark ? 'bg-purple-900/30 text-white' : 'bg-purple-50 text-purple-900'
                                : isDark ? 'text-gray-200 hover:bg-gray-700/60 cursor-pointer' : 'text-gray-800 hover:bg-gray-50 cursor-pointer'
                          } ${isDark ? 'border-b border-gray-700/50' : 'border-b border-gray-100'} last:border-b-0`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${color.bg}`}></span>
                            <span className="truncate font-medium">{cat}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isSeeded ? (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {count} Q
                              </span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                isDark ? 'bg-gray-700/50 text-gray-500' : 'bg-gray-100 text-gray-400'
                              }`}>
                                Coming Soon
                              </span>
                            )}
                            {isSelected && (
                              <svg className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Search */}
              {selectedCategory && questions.length > 0 && (
                <div className="relative flex-1">
                  <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search questions or answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none transition-colors ${
                      isDark
                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500'
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
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">

          {/* No category selected — show category grid */}
          {!selectedCategory && (
            <div>
              <p className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose a category to start exploring questions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stats?.allCategories?.map((cat) => {
                  const count = getCategoryCount(cat);
                  const color = getColor(cat);
                  const isSeeded = count > 0;

                  return (
                    <button
                      key={cat}
                      onClick={() => isSeeded ? handleSelectCategory(cat) : null}
                      disabled={!isSeeded}
                      className={`group flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        isSeeded
                          ? isDark
                            ? 'bg-gray-800/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800 cursor-pointer'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer'
                          : isDark
                            ? 'bg-gray-800/30 border-gray-800/50 opacity-50 cursor-not-allowed'
                            : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full shrink-0 ${color.bg} ${isSeeded ? 'group-hover:scale-110 transition-transform' : ''}`}></span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {isSeeded ? `${count} questions` : 'Coming soon'}
                        </p>
                      </div>
                      {isSeeded && (
                        <svg className={`w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category selected — show questions */}
          {selectedCategory && (
            <>
              {/* Category header bar */}
              <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${getColor(selectedCategory).bg}`}></span>
                  <h2 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedCategory}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
                  </span>
                </div>
                <button
                  onClick={() => { setSelectedCategory(null); setQuestions([]); setSearchQuery(''); setExpandedId(null); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  All Categories
                </button>
              </div>

              {questionsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader />
                </div>
              ) : paginatedQuestions.length === 0 ? (
                <div className={`text-center py-16 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No questions found</p>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Try a different search term</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {paginatedQuestions.map((q) => {
                    const color = getColor(q.category);
                    const isExpanded = expandedId === q._id;
                    const isCompleted = !!completedMap[q._id];

                    return (
                      <div
                        key={q._id}
                        className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                          isExpanded
                            ? `ring-2 ring-purple-500/20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`
                            : isDark ? 'bg-gray-800/60 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Question Header */}
                        <button
                          onClick={() => toggleExpand(q._id)}
                          className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 sm:gap-4 cursor-pointer"
                        >
                          {/* Question Number */}
                          <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : isExpanded
                                ? 'bg-purple-600 text-white'
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
                              <svg
                                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </button>

                        {/* Expanded Content */}
                        <div
                          ref={el => contentRefs.current[q._id] = el}
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            maxHeight: isExpanded
                              ? expandedCodeIds[q._id]
                                ? '10000px'
                                : `${(contentRefs.current[q._id]?.scrollHeight || 0) + 100}px`
                              : '0px',
                            opacity: isExpanded ? 1 : 0,
                          }}
                        >
                          <div className={`px-4 sm:px-5 pb-5 pt-1 border-t ${isDark ? 'border-gray-700/60' : 'border-gray-100'}`}>
                            {/* Answer */}
                            <div className={`mt-3 p-3.5 rounded-lg ${isDark ? 'bg-gray-900/60' : 'bg-gray-50'}`}>
                              <div className="flex items-start gap-2.5">
                                <div className={`shrink-0 mt-0.5 p-1 rounded ${isDark ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                                  <svg className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                  </svg>
                                </div>
                                <div>
                                  <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Answer</p>
                                  <div className={`text-[13px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {q.answer.split('\n').map((line, i) => (
                                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Coding Examples */}
                            {q.codingExamples && q.codingExamples.length > 0 && (
                              <div className="mt-4">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleCodeExpand(q._id); }}
                                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    isDark
                                      ? 'bg-gray-700/40 hover:bg-gray-700/70 text-gray-300'
                                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <svg className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                                    </svg>
                                    <span>Code Examples ({q.codingExamples.length})</span>
                                  </div>
                                  <svg
                                    className={`w-4 h-4 transition-transform duration-300 ${expandedCodeIds[q._id] ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                <div
                                  className={`overflow-hidden transition-all duration-300 ${expandedCodeIds[q._id] ? 'max-h-[5000px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
                                >
                                <div className="space-y-3">
                                {q.codingExamples.map((example, exIdx) => (
                                  <div key={exIdx} className={`rounded-lg border overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                    {/* Example Title Bar */}
                                    {example.title && (
                                      <div className={`px-3.5 py-2 text-xs font-semibold flex items-center gap-2 ${
                                        isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${color.bg}`}></span>
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
                                        {example.explanation.split('\n').map((line, i) => (
                                          <p key={i} className={i > 0 ? 'mt-1' : 'inline'}>{line}</p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                </div>
                                </div>
                              </div>
                            )}

                            {/* Mark as Completed Button */}
                            {isAuthenticated && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleToggleCompletion(q._id); }}
                                disabled={togglingId === q._id}
                                className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                  isCompleted
                                    ? isDark
                                      ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900/60'
                                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : isDark
                                      ? 'bg-purple-900/30 text-purple-400 border border-purple-700/50 hover:bg-purple-900/50'
                                      : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                                } ${togglingId === q._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                              >
                                {togglingId === q._id ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                ) : isCompleted ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {togglingId === q._id ? 'Updating...' : isCompleted ? 'Completed' : 'Mark as Completed'}
                              </button>
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
                            ? 'bg-purple-600 text-white shadow-sm'
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FrontendQuestionBundle;
