import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { useUser } from "../../utils/UserContext/UserContext";
import {
  getOutputBasedQuestions,
  getOutputBasedQuestionsStats,
} from "../../utils/BackendCalls/authService";
import SkeletonLoader from "../../utils/SkeletonLoader/SkeletonLoader";

/* ─────────────────────────────────── helpers ──────────────────────────────── */

const CODE_REGEX = /```[\w]*\n?([\s\S]*?)```/g;
const INLINE_REGEX = /`([^`]+)`/g;

const CodeBlock = ({ code, isDark }) => (
  <pre
    className={`text-[11.5px] sm:text-[12.5px] mt-2 mb-1 px-3 py-2.5 rounded-lg overflow-x-auto font-mono leading-relaxed border whitespace-pre-wrap ${
      isDark
        ? "bg-gray-950 text-emerald-300 border-gray-700/50"
        : "bg-gray-900 text-emerald-400 border-gray-200"
    }`}
  >
    {code}
  </pre>
);

const renderMarkdown = (text, isDark) => {
  if (!text) return null;
  const parts = text.split(/(```[\w]*\n?[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
      return <CodeBlock key={i} code={code} isDark={isDark} />;
    }
    const inline = part.split(/(`[^`]+`)/g);
    return (
      <span key={i}>
        {inline.map((ip, j) =>
          ip.startsWith("`") ? (
            <code
              key={j}
              className={`px-1 py-0.5 rounded text-[11px] font-mono ${
                isDark
                  ? "bg-gray-700/80 text-amber-300"
                  : "bg-gray-100 text-amber-700"
              }`}
            >
              {ip.slice(1, -1)}
            </code>
          ) : (
            ip
          )
        )}
      </span>
    );
  });
};

/* Extract code snippet from question text for display */
const extractCode = (text) => {
  const match = text.match(/\n\n([\s\S]+)$/);
  return match ? match[1] : null;
};

const extractTitle = (text) => {
  const match = text.match(/^(.+?)(\n|$)/);
  return match ? match[1] : text;
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── DIFFICULTY BADGE ──────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

const DifficultyBadge = ({ difficulty, isDark }) => {
  const colors = {
    Easy: {
      bg: isDark ? "bg-emerald-900/25" : "bg-emerald-50",
      text: isDark ? "text-emerald-400" : "text-emerald-700",
      border: isDark ? "border-emerald-700/40" : "border-emerald-200",
    },
    Medium: {
      bg: isDark ? "bg-amber-900/25" : "bg-amber-50",
      text: isDark ? "text-amber-400" : "text-amber-700",
      border: isDark ? "border-amber-700/40" : "border-amber-200",
    },
    Hard: {
      bg: isDark ? "bg-red-900/25" : "bg-red-50",
      text: isDark ? "text-red-400" : "text-red-700",
      border: isDark ? "border-red-700/40" : "border-red-200",
    },
  };
  const c = colors[difficulty] || colors.Medium;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}
    >
      {difficulty}
    </span>
  );
};

const CategoryBadge = ({ category, isDark }) => {
  const isJS = category === "javascript";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
        isJS
          ? isDark
            ? "bg-yellow-900/25 text-yellow-400 border-yellow-700/40"
            : "bg-yellow-50 text-yellow-700 border-yellow-200"
          : isDark
          ? "bg-cyan-900/25 text-cyan-400 border-cyan-700/40"
          : "bg-cyan-50 text-cyan-700 border-cyan-200"
      }`}
    >
      {isJS ? "JavaScript" : "React"}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── OPTION BUTTON ─────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

const OptionButton = ({
  index,
  text,
  selected,
  correct,
  revealed,
  onSelect,
  isDark,
}) => {
  const letter = ["A", "B", "C", "D"][index];
  const isCorrect = revealed && index === correct;
  const isWrong = revealed && selected === index && index !== correct;
  const isNeutral = revealed && !isCorrect && !isWrong;

  let borderClasses, bgClasses, letterBg, letterText;

  if (isCorrect) {
    borderClasses = isDark
      ? "border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
      : "border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.1)]";
    bgClasses = isDark ? "bg-emerald-500/10" : "bg-emerald-50";
    letterBg = "bg-emerald-500";
    letterText = "text-white";
  } else if (isWrong) {
    borderClasses = isDark
      ? "border-red-500/70 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
      : "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.1)]";
    bgClasses = isDark ? "bg-red-500/10" : "bg-red-50";
    letterBg = "bg-red-500";
    letterText = "text-white";
  } else if (selected === index && !revealed) {
    borderClasses = isDark
      ? "border-violet-500/70 shadow-[0_0_8px_rgba(139,92,246,0.2)]"
      : "border-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.1)]";
    bgClasses = isDark ? "bg-violet-500/10" : "bg-violet-50";
    letterBg = "bg-violet-500";
    letterText = "text-white";
  } else {
    borderClasses = isDark
      ? "border-gray-700/60 hover:border-gray-600"
      : "border-gray-200 hover:border-gray-300";
    bgClasses = isDark
      ? "bg-gray-800/40 hover:bg-gray-750/60"
      : "bg-white hover:bg-gray-50/80";
    letterBg = isDark
      ? "bg-gray-700/80 group-hover:bg-gray-600"
      : "bg-gray-100 group-hover:bg-gray-200";
    letterText = isDark
      ? "text-gray-400 group-hover:text-gray-300"
      : "text-gray-500 group-hover:text-gray-600";
  }

  return (
    <button
      onClick={() => !revealed && onSelect(index)}
      disabled={revealed}
      className={`output-q-option w-full text-left flex items-start gap-3 px-3.5 py-3 rounded-xl border transition-all duration-200 group ${borderClasses} ${bgClasses} ${
        revealed ? "cursor-default" : "cursor-pointer"
      }`}
      style={{
        animationDelay: `${0.05 + index * 0.07}s`,
      }}
    >
      <span
        className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors duration-200 ${letterBg} ${letterText}`}
      >
        {letter}
      </span>
      <span
        className={`text-[13px] sm:text-sm leading-relaxed font-medium pt-0.5 ${
          isCorrect
            ? isDark
              ? "text-emerald-300"
              : "text-emerald-800"
            : isWrong
            ? isDark
              ? "text-red-300"
              : "text-red-800"
            : isDark
            ? "text-gray-200"
            : "text-gray-800"
        }`}
      >
        {renderMarkdown(text, isDark)}
      </span>
      {isCorrect && (
        <svg
          className="w-5 h-5 shrink-0 ml-auto text-emerald-500 mt-0.5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )}
      {isWrong && (
        <svg
          className="w-5 h-5 shrink-0 ml-auto text-red-500 mt-0.5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
        </svg>
      )}
    </button>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── QUESTION CARD ─────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

const QuestionCard = ({ question, index, isDark }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (optionIndex) => {
    if (revealed) return;
    setSelected(optionIndex);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  const isCorrect = revealed && selected === question.correctIndex;
  const title = extractTitle(question.question);
  const code = extractCode(question.question);

  return (
    <div
      className={`output-q-card rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDark
          ? "bg-gray-800/60 border-gray-700/50 hover:border-gray-600/60"
          : "bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
      }`}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Card header */}
      <div
        className={`px-4 sm:px-5 pt-4 sm:pt-5 pb-3`}
      >
        {/* Badges & number */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold ${
                isDark
                  ? "bg-violet-500/15 text-violet-400"
                  : "bg-violet-100 text-violet-700"
              }`}
            >
              {index + 1}
            </span>
            <CategoryBadge category={question.category} isDark={isDark} />
            <DifficultyBadge difficulty={question.difficulty} isDark={isDark} />
          </div>

          {revealed && (
            <button
              onClick={handleReset}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Retry
            </button>
          )}
        </div>

        {/* Question title */}
        <h3
          className={`text-[14px] sm:text-[15px] font-semibold leading-snug mb-2 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {title}
        </h3>

        {/* Code block */}
        {code && <CodeBlock code={code} isDark={isDark} />}
      </div>

      {/* Options */}
      <div className="px-4 sm:px-5 pb-2 space-y-2">
        {question.options.map((option, i) => (
          <OptionButton
            key={i}
            index={i}
            text={option}
            selected={selected}
            correct={question.correctIndex}
            revealed={revealed}
            onSelect={handleSelect}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Submit / Result section */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={selected === null}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              selected !== null
                ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.99]"
                : isDark
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selected !== null ? "Check Answer" : "Select an option first"}
          </button>
        ) : (
          <div
            className={`rounded-xl p-3.5 border transition-all duration-300 ${
              isCorrect
                ? isDark
                  ? "bg-emerald-900/15 border-emerald-700/30"
                  : "bg-emerald-50 border-emerald-200"
                : isDark
                ? "bg-red-900/15 border-red-700/30"
                : "bg-red-50 border-red-200"
            }`}
          >
            {/* Result header */}
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <span className="text-lg">🎉</span>
                  <span
                    className={`text-[13px] font-bold ${
                      isDark ? "text-emerald-400" : "text-emerald-700"
                    }`}
                  >
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg">💡</span>
                  <span
                    className={`text-[13px] font-bold ${
                      isDark ? "text-red-400" : "text-red-700"
                    }`}
                  >
                    Not quite — here's why:
                  </span>
                </>
              )}
            </div>
            {/* Explanation */}
            <p
              className={`text-[12.5px] sm:text-[13px] leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {renderMarkdown(question.explanation, isDark)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ─── MAIN PAGE ─────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════════ */

const OutputBased = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeDifficulty, setActiveDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 8;

  // Score tracking
  const [scoreMap, setScoreMap] = useState({});

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
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-white"}`}>
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
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header />

      <main className="flex-grow">
        {/* ───────────────────── HERO ───────────────────── */}
        <div
          className={`relative overflow-hidden border-b ${
            isDark
              ? "border-gray-800"
              : "border-gray-200"
          }`}
        >
          {/* Animated gradient bg */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #0f0a1e 0%, #0f172a 50%, #0a1628 100%)"
                : "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #ede9fe 100%)",
            }}
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
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p
                  className={`text-xs font-medium ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Showing {(currentPage - 1) * questionsPerPage + 1}–
                  {Math.min(
                    currentPage * questionsPerPage,
                    filteredQuestions.length
                  )}{" "}
                  of {filteredQuestions.length}
                </p>
              </div>

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
    </div>
  );
};

export default OutputBased;
