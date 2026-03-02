import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { getCodingQuestions, getUserCodingProgress } from "../../utils/BackendCalls/authService";
import { useUser } from "../../utils/UserContext/UserContext";
import SkeletonLoader from "../../utils/SkeletonLoader/SkeletonLoader";

const JavascriptMachineCoding = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [progressMap, setProgressMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 15;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCodingQuestions({ limit: 100 });
        if (response?.data) {
          setQuestions(response.data);
        }
        if (isAuthenticated) {
          try {
            const progressRes = await getUserCodingProgress();
            if (progressRes?.data) {
              setProgressMap(progressRes.data);
            }
          } catch (err) {
            console.error('Error fetching coding progress:', err);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const filteredQuestions = questions.filter(q => {
    const matchesDifficulty = activeFilter === 'All' || q.difficulty === activeFilter;
    const matchesSearch = !searchQuery ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const stats = {
    total: questions.length,
    Easy: questions.filter(q => q.difficulty === 'Easy').length,
    Medium: questions.filter(q => q.difficulty === 'Medium').length,
    Hard: questions.filter(q => q.difficulty === 'Hard').length,
    solved: questions.filter(q => progressMap[q._id]?.isSolved).length,
  };

  const difficultyConfig = {
    Easy: {
      badge: isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' : 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      text: isDark ? 'text-emerald-400' : 'text-emerald-600',
    },
    Medium: {
      badge: isDark ? 'bg-amber-900/40 text-amber-300 border-amber-700/50' : 'bg-amber-100 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      text: isDark ? 'text-amber-400' : 'text-amber-600',
    },
    Hard: {
      badge: isDark ? 'bg-rose-900/40 text-rose-300 border-rose-700/50' : 'bg-rose-100 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      text: isDark ? 'text-rose-400' : 'text-rose-600',
    },
  };

  if (loading) {
    return <SkeletonLoader variant="coding-table" />;
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
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-violet-900/40' : 'bg-violet-100'}`}>
                    <svg className={`w-5 h-5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  </div>
                  <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    JavaScript Coding Challenges
                  </h1>
                </div>
                <p className={`text-sm max-w-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Solve 45 handpicked JavaScript coding problems. Write code, run test cases, and get instant feedback.
                </p>
              </div>

              {/* Stats Pills */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
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
                {isAuthenticated && stats.solved > 0 && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border ${
                    isDark
                      ? 'bg-blue-900/20 text-blue-400 border-blue-800/30'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {stats.solved} solved
                  </div>
                )}
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search questions or categories..."
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

        {/* Questions Table */}
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
            <>
              {/* Table Header */}
              <div className={`hidden sm:grid grid-cols-[40px_1fr_100px_90px_70px] gap-3 px-4 py-2.5 rounded-t-lg text-[11px] font-semibold uppercase tracking-wider ${
                isDark ? 'bg-gray-800/80 text-gray-500' : 'bg-gray-100 text-gray-500'
              }`}>
                <span>#</span>
                <span>Title</span>
                <span>Category</span>
                <span>Difficulty</span>
                <span className="text-center">Status</span>
              </div>

              {/* Question Rows */}
              <div className={`rounded-b-lg overflow-hidden border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                {paginatedQuestions.map((q, idx) => {
                  const config = difficultyConfig[q.difficulty] || difficultyConfig.Easy;
                  const isSolved = progressMap[q._id]?.isSolved;
                  const isEven = idx % 2 === 0;

                  return (
                    <button
                      key={q._id}
                      onClick={() => navigate(`/dashboard/coding-questions/${q._id}`)}
                      className={`w-full text-left grid grid-cols-1 sm:grid-cols-[40px_1fr_100px_90px_70px] gap-2 sm:gap-3 px-4 py-3.5 sm:py-3 items-center transition-colors cursor-pointer border-b last:border-b-0 ${
                        isDark
                          ? `${isEven ? 'bg-gray-800/40' : 'bg-gray-800/20'} border-gray-800/60 hover:bg-gray-700/50`
                          : `${isEven ? 'bg-white' : 'bg-gray-50/50'} border-gray-100 hover:bg-blue-50/50`
                      }`}
                    >
                      {/* Order Number */}
                      <span className={`hidden sm:block text-sm font-mono font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {q.order}
                      </span>

                      {/* Title */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`sm:hidden shrink-0 text-xs font-mono font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {q.order}.
                        </span>
                        <span className={`text-sm font-medium truncate ${
                          isSolved
                            ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                            : isDark ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {q.title}
                        </span>
                        <span className={`sm:hidden shrink-0 w-2 h-2 rounded-full ${config.dot}`}></span>
                      </div>

                      {/* Category */}
                      <span className={`hidden sm:block text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {q.category}
                      </span>

                      {/* Difficulty Badge */}
                      <span className={`hidden sm:inline-flex w-fit px-2 py-0.5 rounded text-[10px] font-semibold border ${config.badge}`}>
                        {q.difficulty}
                      </span>

                      {/* Status */}
                      <div className="hidden sm:flex justify-center">
                        {isSolved ? (
                          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {filteredQuestions.length > 0 && totalPages > 1 && (
            <div className="mt-6 mb-2 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:cursor-pointer'} ${
                    isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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

                <button
                  onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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

export default JavascriptMachineCoding;
