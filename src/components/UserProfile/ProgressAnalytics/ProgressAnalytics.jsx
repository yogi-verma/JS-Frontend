import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiLayout, FiCode, FiArrowRight, FiX } from "react-icons/fi";
import {
  getInterviewQuestionsStats,
  getUserInterviewProgress,
  getFrontendQuestionsStats,
  getUserFrontendProgress,
  getUserCodingStats,
  getDailyQuizQuestions,
} from "../../../utils/BackendCalls/authService";
import { useUser } from "../../../utils/UserContext/UserContext";

/* ─── Circular progress ring ─── */
const CircularProgress = ({ percentage, size = 80, strokeWidth = 6, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-700/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
};

/* ─── Report card ─── */
const ReportCard = ({ icon: Icon, title, completed, total, percentage, color, link, isDark }) => (
  <Link
    to={link}
    className={`group rounded-lg p-3.5 transition-all duration-200 border ${
      isDark
        ? "bg-[#0D1117] border-[#21262D] hover:border-[#30363D] hover:bg-[#1C2128]"
        : "bg-gray-50 border-[#EAEEF2] hover:border-gray-300 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-3 h-3" style={{ color }} />
        </div>
        <h3 className={`text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
          {title}
        </h3>
      </div>
      <FiArrowRight
        className={`w-3 h-3 transition-transform group-hover:translate-x-0.5 ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      />
    </div>

    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <CircularProgress percentage={percentage} color={color} size={56} strokeWidth={4} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[10px] font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div>
        <p className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {completed}
          <span className={`text-[10px] font-normal ml-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            / {total}
          </span>
        </p>
        <p className={`text-[10px] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          completed
        </p>
      </div>
    </div>
  </Link>
);

/* ─── Quiz helpers ─── */
const renderText = (text) => {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith("`") ? (
      <code key={i} className="px-1 py-0.5 rounded text-[11px] font-mono bg-gray-700/60 text-amber-300">
        {p.slice(1, -1)}
      </code>
    ) : p
  );
};

const QuizScoreRing = ({ score, total, isDark }) => {
  const pct = total > 0 ? score / total : 0;
  const color = pct >= 0.8 ? "#10b981" : pct >= 0.6 ? "#f59e0b" : "#ef4444";
  const r = 18, circ = 2 * Math.PI * r, dash = circ * pct;
  return (
    <div className="relative shrink-0" style={{ width: 44, height: 44 }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke={isDark ? "#374151" : "#E5E7EB"} strokeWidth="4" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-black leading-none" style={{ color }}>{score}/{total}</span>
      </div>
    </div>
  );
};

const NextQuizIn = ({ isDark }) => {
  const [t, setT] = useState("");
  useEffect(() => {
    const calc = () => {
      const now = new Date(), mid = new Date(now);
      mid.setHours(24, 0, 0, 0);
      const diff = mid - now;
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      setT(`${h}h ${m}m`);
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, []);
  return <span className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{t}</span>;
};

const QuizModal = ({ quizData, quizStatus, isDark, onClose, onTakeQuiz }) => {
  if (quizStatus === "not-attempted") {
    onTakeQuiz();
    onClose();
    return null;
  }

  const { score, totalQuestions, results } = quizData || {};
  const pct = totalQuestions > 0 ? score / totalQuestions : 0;
  const perfLabel = pct === 1 ? "🏆 Perfect!" : pct >= 0.8 ? "🔥 Excellent!" : pct >= 0.6 ? "👍 Good Job!" : pct >= 0.4 ? "📚 Keep Learning!" : "💪 Keep Practicing!";
  const perfColor = pct >= 0.8 ? "#10b981" : pct >= 0.6 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border flex flex-col overflow-hidden max-h-[88vh] ${
          isDark ? "bg-gray-800 border-gray-700/60" : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #8b5cf6, #3b82f6, #10b981)" }} />

        {/* Header */}
        <div className={`flex items-center justify-between px-5 pt-5 pb-3 shrink-0 border-b ${isDark ? "border-gray-700/60" : "border-gray-100"}`}>
          <div>
            <p className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Today's Quiz Results</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: perfColor }}>{perfLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" style={{ width: 56, height: 56 }}>
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke={isDark ? "#374151" : "#E5E7EB"} strokeWidth="5" />
                <circle cx="28" cy="28" r="22" fill="none" stroke={perfColor} strokeWidth="5"
                  strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 22 * pct} ${2 * Math.PI * 22 * (1 - pct)}`}
                  style={{ transition: "stroke-dasharray 0.8s ease-out" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-black leading-none" style={{ color: perfColor }}>{score}</span>
                <span className={`text-[9px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>/{totalQuestions}</span>
              </div>
            </div>
            <button onClick={onClose}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable breakdown */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-2">
          {results?.map((r, i) => (
            <QuizResultItem key={r.questionId || i} result={r} isDark={isDark} />
          ))}
        </div>

        {/* Footer */}
        <div className={`shrink-0 px-5 pb-4 pt-3 border-t ${isDark ? "border-gray-700/60" : "border-gray-100"}`}>
          <p className={`text-[10px] text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Next quiz available in <NextQuizIn isDark={isDark} />
          </p>
        </div>
      </div>
    </div>
  );
};

const QuizResultItem = ({ result, isDark }) => {
  const [open, setOpen] = useState(false);
  const { question, options, correctIndex, selectedIndex, isCorrect, explanation, category, questionType } = result;

  return (
    <div className={`rounded-xl border ${isCorrect
      ? isDark ? "border-emerald-500/25 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/40"
      : isDark ? "border-rose-500/25 bg-rose-500/5" : "border-rose-200 bg-rose-50/40"
    }`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left">
        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
          isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
          {isCorrect ? "✓" : "✗"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
              category === "react" ? isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-600"
              : isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-50 text-yellow-700"}`}>
              {category === "react" ? "⚛️ React" : "⚡ JS"}
            </span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
              questionType === "output" ? isDark ? "bg-purple-500/15 text-purple-400" : "bg-purple-50 text-purple-600"
              : isDark ? "bg-teal-500/15 text-teal-400" : "bg-teal-50 text-teal-600"}`}>
              {questionType === "output" ? "Output" : "Theory"}
            </span>
          </div>
          <p className={`text-xs line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{question}</p>
        </div>
        <span className={`shrink-0 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""} ${isDark ? "text-gray-500" : "text-gray-400"}`}>▼</span>
      </button>

      {open && (
        <div className={`px-3 pb-3 border-t ${isDark ? "border-gray-700/60" : "border-gray-100"}`}>
          <div className={`text-xs mt-2 mb-2 font-medium leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {renderText(question)}
          </div>
          <div className="flex flex-col gap-1 mb-2">
            {options.map((opt, oi) => {
              const isCorrectOpt = oi === correctIndex;
              const isWrong = oi === selectedIndex && !isCorrect;
              return (
                <div key={oi} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] ${
                  isCorrectOpt ? isDark ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : isWrong ? isDark ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : "bg-rose-50 text-rose-700 border border-rose-200"
                  : isDark ? "text-gray-500" : "text-gray-400"}`}>
                  <span className="font-mono font-bold">{["A","B","C","D"][oi]}</span>
                  <span className="flex-1">{renderText(opt)}</span>
                  {isCorrectOpt && <span className="text-emerald-500 text-[9px] font-bold shrink-0">CORRECT</span>}
                  {isWrong && <span className="text-rose-500 text-[9px] font-bold shrink-0">YOUR ANSWER</span>}
                </div>
              );
            })}
          </div>
          <div className={`px-2.5 py-2 rounded-lg text-[11px] leading-relaxed border ${isDark ? "bg-gray-800/80 text-gray-400 border-gray-700/60" : "bg-white/80 text-gray-500 border-gray-200"}`}>
            <span className={`font-semibold mr-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>💡</span>
            {renderText(explanation)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main component ─── */
const ProgressAnalytics = ({ isDark }) => {
  const { setShowDailyQuiz } = useUser();
  const [stats, setStats] = useState({
    interview: { total: 0, completed: 0 },
    frontend: { total: 0, completed: 0 },
    coding: { total: 0, completed: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [quizStatus, setQuizStatus] = useState("loading"); // "loading" | "completed" | "not-attempted"
  const [quizData, setQuizData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          [
            interviewStats,
            interviewProgress,
            frontendStats,
            frontendProgress,
            codingStats,
          ],
          quizRes,
        ] = await Promise.all([
          Promise.all([
            getInterviewQuestionsStats(),
            getUserInterviewProgress(),
            getFrontendQuestionsStats(),
            getUserFrontendProgress(),
            getUserCodingStats(),
          ]),
          getDailyQuizQuestions().catch(err => {
            console.error('Quiz fetch failed:', err);
            return null;
          }),
        ]);

        // Progress stats
        setStats({
          interview: { total: interviewStats?.data?.total || 0, completed: interviewProgress?.completedCount || 0 },
          frontend: { total: frontendStats?.data?.total || 0, completed: frontendProgress?.completedCount || 0 },
          coding: { total: codingStats?.data?.totalQuestions || 0, completed: codingStats?.data?.solvedCount || 0 },
        });

        // Quiz status
        if (!quizRes) {
          setQuizStatus("error");
        } else if (quizRes?.success) {
          if (quizRes.data?.alreadyCompleted) {
            setQuizData(quizRes.data);
            setQuizStatus("completed");
          } else {
            setQuizStatus("not-attempted");
          }
        } else {
          setQuizStatus("error");
        }
      } catch (error) {
        console.error("Failed to fetch progress stats:", error);
        setQuizStatus("error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getPercentage = (completed, total) => (total > 0 ? (completed / total) * 100 : 0);

  const quizPct = quizData?.totalQuestions > 0 ? quizData.score / quizData.totalQuestions : 0;
  const quizPerfLabel = quizPct === 1 ? "Perfect!" : quizPct >= 0.8 ? "Excellent!" : quizPct >= 0.6 ? "Good Job!" : quizPct >= 0.4 ? "Keep Learning!" : quizStatus === "not-attempted" ? "Not attempted" : "Keep Practicing!";
  const quizPerfColor = quizStatus === "not-attempted" ? (isDark ? "#6B7280" : "#9CA3AF") : quizPct >= 0.8 ? "#10b981" : quizPct >= 0.6 ? "#f59e0b" : "#ef4444";

  const handleQuizRowClick = () => {
    if (quizStatus === "not-attempted") {
      setShowDailyQuiz(true);
    } else if (quizStatus === "completed") {
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-lg p-3.5 border animate-pulse ${
                isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"
              }`}
            >
              <div className={`h-3 rounded w-20 mb-3 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                <div>
                  <div className={`h-6 rounded w-12 mb-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                  <div className={`h-2.5 rounded w-16 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Quiz skeleton */}
        <div className={`mt-3 h-14 rounded-lg border animate-pulse ${isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"}`} />
      </div>
    );
  }

  return (
    <div>
      {/* Report cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ReportCard icon={FiMessageSquare} title="Javascript Prep"
          completed={stats.interview.completed} total={stats.interview.total}
          percentage={getPercentage(stats.interview.completed, stats.interview.total)}
          color="#8B5CF6" link="/dashboard/interview-questions" isDark={isDark} />
        <ReportCard icon={FiLayout} title="Frontend Prep"
          completed={stats.frontend.completed} total={stats.frontend.total}
          percentage={getPercentage(stats.frontend.completed, stats.frontend.total)}
          color="#06B6D4" link="/dashboard/frontend-interview-questions" isDark={isDark} />
        <ReportCard icon={FiCode} title="Javascript Coding"
          completed={stats.coding.completed} total={stats.coding.total}
          percentage={getPercentage(stats.coding.completed, stats.coding.total)}
          color="#10B981" link="/dashboard/coding-questions" isDark={isDark} />
      </div>

      {/* ─── Today's Quiz row ─── */}
      {quizStatus !== "error" && (
        <button
          onClick={handleQuizRowClick}
          className={`mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 group text-left ${
            isDark
              ? "bg-[#0D1117] border-[#21262D] hover:border-[#30363D] hover:bg-[#1C2128]"
              : "bg-gray-50 border-[#EAEEF2] hover:border-gray-300 hover:shadow-sm"
          }`}
        >
          {/* Icon */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
            style={{ background: "rgba(139,92,246,0.12)" }}>
            🧠
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              Today's Quiz
            </p>
            <p className="text-[10px] font-semibold mt-0.5" style={{ color: quizPerfColor }}>
              {quizStatus === "completed" ? `${quizData.score}/${quizData.totalQuestions} · ${quizPerfLabel}` : quizPerfLabel}
            </p>
          </div>

          {/* Right side */}
          <div className="shrink-0 text-right">
            {quizStatus === "completed" ? (
              <>
                <QuizScoreRing score={quizData.score} total={quizData.totalQuestions} isDark={isDark} />
                <p className={`text-[9px] mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  Next in <NextQuizIn isDark={isDark} />
                </p>
              </>
            ) : (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg text-white"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                Take Quiz →
              </span>
            )}
          </div>

          <FiArrowRight className={`w-3 h-3 shrink-0 transition-transform group-hover:translate-x-0.5 ${isDark ? "text-gray-600" : "text-gray-400"} ${quizStatus === "completed" ? "" : "hidden"}`} />
        </button>
      )}

      {/* Quiz results modal */}
      {modalOpen && quizStatus === "completed" && (
        <QuizModal
          quizData={quizData}
          quizStatus={quizStatus}
          isDark={isDark}
          onClose={() => setModalOpen(false)}
          onTakeQuiz={() => setShowDailyQuiz(true)}
        />
      )}
    </div>
  );
};

export default ProgressAnalytics;
