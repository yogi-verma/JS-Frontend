import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import {
  getOutputBasedQuestions,
  getOutputBasedQuestionsStats,
} from "../../utils/BackendCalls/authService";
import SkeletonLoader from "../../utils/SkeletonLoader/SkeletonLoader";
import QuestionCard from "./QuestionCard";
import ScrollToTopButton from "../ScrollToTop/ScrollToTopButton";

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── MAIN PAGE ─────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

const OutputBased = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 12;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [questionsRes, statsRes] = await Promise.all([
          getOutputBasedQuestions(),
          getOutputBasedQuestionsStats(),
        ]);
        if (questionsRes?.data) setQuestions(questionsRes.data);
        if (statsRes?.data) setStats(statsRes.data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeDifficulty, searchQuery]);

  /* ─── Filtered questions ─────────────────────────────────────────────── */
  const filteredQuestions = questions.filter((q) => {
    if (activeCategory !== "all" && q.category !== activeCategory) return false;
    if (activeDifficulty !== "all" && q.difficulty !== activeDifficulty)
      return false;
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      return (
        q.question.toLowerCase().includes(s) ||
        q.explanation.toLowerCase().includes(s) ||
        q.options.some((o) => o.toLowerCase().includes(s))
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const getDifficultyCount = (diff) =>
    questions.filter(
      (q) =>
        q.difficulty === diff &&
        (activeCategory === "all" || q.category === activeCategory)
    ).length;

  const getCategoryCount = (cat) =>
    questions.filter((q) => (cat === "all" ? true : q.category === cat)).length;

  /* ─── Loading / Error states ──────────────────────────────────────────── */
  if (loading) {
    return <SkeletonLoader variant="frontend-bundle" />;
  }

  if (error) {
    return (
      <div
        className={`relative min-h-screen ${isDark ? 'bg-gray-900' : ''}`}
        style={!isDark ? { background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 45%, #EDE9FE 100%)' } : undefined}
      >
        <AnimatedBackground isDark={isDark} />
        <div className="relative z-10">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div
            className={`rounded-xl p-6 border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p
              className={`font-semibold ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              Failed to load questions
            </p>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {error}
            </p>
          </div>
        </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div
      className={`relative min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : ''}`}
      style={!isDark ? { background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 45%, #EDE9FE 100%)' } : undefined}
    >
      <AnimatedBackground isDark={isDark} />
      <div className="relative z-10 flex flex-col flex-1">
      <Header />

      <main className="flex-grow">
        {/* ───────────────────── HERO ───────────────────── */}
        <div
          className={`relative overflow-hidden ${
            isDark
              ? "border-gray-800"
              : "border-gray-200"
          }`}
        >
          {/* Animated gradient bg */}
          <div
            className="absolute inset-0"
          />
          <div
            className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-3xl"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(139,92,246,0.15), transparent)"
                : "radial-gradient(circle, rgba(139,92,246,0.1), transparent)",
            }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl"
            style={{
              background: isDark
                ? "radial-gradient(circle, rgba(6,182,212,0.12), transparent)"
                : "radial-gradient(circle, rgba(6,182,212,0.08), transparent)",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => navigate(-1)}
                    className={`p-2 rounded-lg transition-all duration-200 group ${
                      isDark
                        ? "hover:bg-gray-700/50 text-gray-400 hover:text-gray-200"
                        : "hover:bg-gray-200/70 text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label="Go back"
                  >
                    <svg
                      className="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                      />
                    </svg>
                  </button>
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-violet-900/40" : "bg-violet-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isDark ? "text-violet-400" : "text-violet-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                      />
                    </svg>
                  </div>
                  <h1
                    className={`text-xl sm:text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Output-Based Questions
                  </h1>
                </div>
                <p
                  className={`text-sm max-w-xl ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Can you predict the output? Test your deep JavaScript & React
                  knowledge with tricky code snippets. Select an answer, check
                  it, and learn from detailed explanations.
                </p>
              </div>

              {/* Stats pills */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <div
                  className={`px-2.5 py-1.5 rounded-full text-xs font-bold border ${
                    isDark
                      ? "bg-violet-900/20 text-violet-400 border-violet-800/30"
                      : "bg-violet-50 text-violet-700 border-violet-200"
                  }`}
                >
                  {questions.length} questions
                </div>
                <div
                  className={`px-2.5 py-1.5 rounded-full text-xs font-bold border ${
                    isDark
                      ? "bg-yellow-900/20 text-yellow-400 border-yellow-800/30"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {getCategoryCount("javascript")} JS
                </div>
                <div
                  className={`px-2.5 py-1.5 rounded-full text-xs font-bold border ${
                    isDark
                      ? "bg-cyan-900/20 text-cyan-400 border-cyan-800/30"
                      : "bg-cyan-50 text-cyan-700 border-cyan-200"
                  }`}
                >
                  {getCategoryCount("react")} React
                </div>
              </div>
            </div>

            {/* ───────── FILTERS ROW ───────── */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {/* Category tabs */}
              <div
                className={`inline-flex rounded-lg border p-0.5 ${
                  isDark
                    ? "bg-gray-800/60 border-gray-700/50"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                {[
                  { key: "all", label: "All" },
                  { key: "javascript", label: "JavaScript" },
                  { key: "react", label: "React" },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeCategory === cat.key
                        ? isDark
                          ? "bg-violet-600 text-white shadow-md"
                          : "bg-white text-violet-700 shadow-sm"
                        : isDark
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`ml-1 ${
                        activeCategory === cat.key
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                    >
                      ({getCategoryCount(cat.key)})
                    </span>
                  </button>
                ))}
              </div>

              {/* Difficulty chips */}
              <div
                className={`inline-flex rounded-lg border p-0.5 ${
                  isDark
                    ? "bg-gray-800/60 border-gray-700/50"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                {[
                  { key: "all", label: "All" },
                  { key: "Easy", label: "Easy" },
                  { key: "Medium", label: "Medium" },
                  { key: "Hard", label: "Hard" },
                ].map((d) => (
                  <button
                    key={d.key}
                    onClick={() => setActiveDifficulty(d.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeDifficulty === d.key
                        ? isDark
                          ? "bg-violet-600 text-white shadow-md"
                          : "bg-white text-violet-700 shadow-sm"
                        : isDark
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {d.label}
                    {d.key !== "all" && (
                      <span
                        className={`ml-1 ${
                          activeDifficulty === d.key
                            ? "opacity-100"
                            : "opacity-50"
                        }`}
                      >
                        ({getDifficultyCount(d.key)})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:max-w-xs">
                <svg
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none transition-all ${
                    isDark
                      ? "bg-gray-800/60 border-gray-700/50 text-gray-200 placeholder-gray-500 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                      : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/10"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────── QUESTIONS GRID ───────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {filteredQuestions.length === 0 ? (
            <div
              className={`text-center py-16 rounded-2xl border ${
                isDark
                  ? "bg-gray-800/30 border-gray-700/40"
                  : "bg-white border-gray-200"
              }`}
            >
              <svg
                className={`w-12 h-12 mx-auto mb-3 ${
                  isDark ? "text-gray-600" : "text-gray-300"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No questions match your filters.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveDifficulty("all");
                  setSearchQuery("");
                }}
                className={`mt-3 text-xs font-semibold ${
                  isDark
                    ? "text-violet-400 hover:text-violet-300"
                    : "text-violet-600 hover:text-violet-700"
                }`}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>

              {/* Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {paginatedQuestions.map((q, i) => (
                  <QuestionCard
                    key={q._id}
                    question={q}
                    index={i}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-all ${
                      currentPage === 1
                        ? isDark
                          ? "border-gray-700/40 text-gray-600 cursor-not-allowed"
                          : "border-gray-200 text-gray-300 cursor-not-allowed"
                        : isDark
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .reduce((acc, page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) {
                        acc.push("...");
                      }
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className={`px-1 ${
                            isDark ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setCurrentPage(item)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                            currentPage === item
                              ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md"
                              : isDark
                              ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-all ${
                      currentPage === totalPages
                        ? isDark
                          ? "border-gray-700/40 text-gray-600 cursor-not-allowed"
                          : "border-gray-200 text-gray-300 cursor-not-allowed"
                        : isDark
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* ─── Custom animations ─── */}
      <style>{`
        .output-q-card {
          animation: outputCardFadeIn 0.4s ease-out both;
        }
        .output-q-option {
          animation: outputOptionSlide 0.3s ease-out both;
        }
        @keyframes outputCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes outputOptionSlide {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <ScrollToTopButton />
      </div>    </div>
  );
};

export default OutputBased;
