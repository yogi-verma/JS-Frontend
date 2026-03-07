import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiX, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { getQuizCalendar, getQuizByDate } from "../../../utils/BackendCalls/authService";

// ─── Tiny markdown renderer ───────────────────────────────────────────────────
const renderText = (text) => {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith("`") ? (
      <code
        key={i}
        className="px-1 py-0.5 rounded text-[11px] font-mono bg-gray-700/60 text-amber-300"
      >
        {p.slice(1, -1)}
      </code>
    ) : (
      p
    )
  );
};

// ─── Score color helper ───────────────────────────────────────────────────────
const scoreColor = (score, total) => {
  if (!total) return "#6B7280";
  const pct = score / total;
  if (pct >= 0.8) return "#10b981";
  if (pct >= 0.6) return "#f59e0b";
  return "#ef4444";
};

const scorePerfLabel = (score, total) => {
  if (!total) return "—";
  const pct = score / total;
  if (pct === 1) return "🏆 Perfect";
  if (pct >= 0.8) return "🔥 Excellent";
  if (pct >= 0.6) return "👍 Good";
  if (pct >= 0.4) return "📚 Keep Learning";
  return "💪 Keep Practicing";
};

// ─── Score ring SVG ───────────────────────────────────────────────────────────
const ScoreRing = ({ score, total, size = 64 }) => {
  const pct = total > 0 ? score / total : 0;
  const color = scoreColor(score, total);
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#374151" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          style={{ transition: "stroke-dasharray 0.7s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-black leading-none" style={{ color }}>{score}</span>
        <span className="text-[9px] text-gray-500">/{total}</span>
      </div>
    </div>
  );
};

// ─── Quiz result item (expandable) ───────────────────────────────────────────
const ResultItem = ({ result, isDark }) => {
  const [open, setOpen] = useState(false);
  const { question, options, correctIndex, selectedIndex, isCorrect, explanation, category, questionType } = result;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isCorrect
          ? isDark ? "border-emerald-500/20 bg-emerald-500/5" : "border-emerald-200 bg-emerald-50/40"
          : isDark ? "border-rose-500/20 bg-rose-500/5" : "border-rose-200 bg-rose-50/40"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
      >
        <span
          className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
          }`}
        >
          {isCorrect ? "✓" : "✗"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                category === "react"
                  ? isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-600"
                  : isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {category === "react" ? "⚛️ React" : "⚡ JS"}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                questionType === "output"
                  ? isDark ? "bg-purple-500/15 text-purple-400" : "bg-purple-50 text-purple-600"
                  : isDark ? "bg-teal-500/15 text-teal-400" : "bg-teal-50 text-teal-600"
              }`}
            >
              {questionType === "output" ? "Output" : "Theory"}
            </span>
          </div>
          <p className={`text-xs line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {question}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs transition-transform duration-200 ${open ? "rotate-180" : ""} ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className={`px-3 pb-3 border-t ${isDark ? "border-gray-700/50" : "border-gray-100"}`}>
          <p className={`text-xs font-medium leading-relaxed mt-2 mb-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {renderText(question)}
          </p>
          <div className="flex flex-col gap-1 mb-2">
            {options.map((opt, oi) => {
              const isCorrectOpt = oi === correctIndex;
              const isWrong = oi === selectedIndex && !isCorrect;
              return (
                <div
                  key={oi}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] ${
                    isCorrectOpt
                      ? isDark ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isWrong
                      ? isDark ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : "bg-rose-50 text-rose-700 border border-rose-200"
                      : isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <span className="font-mono font-bold">{["A", "B", "C", "D"][oi]}</span>
                  <span className="flex-1">{renderText(opt)}</span>
                  {isCorrectOpt && <span className="text-emerald-500 text-[9px] font-bold shrink-0">CORRECT</span>}
                  {isWrong && <span className="text-rose-500 text-[9px] font-bold shrink-0">YOUR ANSWER</span>}
                </div>
              );
            })}
          </div>
          <div
            className={`px-2.5 py-2 rounded-lg text-[11px] leading-relaxed border ${
              isDark ? "bg-gray-800/80 text-gray-400 border-gray-700/60" : "bg-white/80 text-gray-500 border-gray-200"
            }`}
          >
            <span className={`font-semibold mr-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>💡</span>
            {renderText(explanation)}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Month calendar ───────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MonthCalendar = ({ year, month, calendarData, selectedDate, onSelectDate, isDark }) => {
  // month is 0-indexed here
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Use IST so the calendar highlights the correct "today" for Indian users
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const cells = [];
  // Leading empty cells
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className={`text-center text-[9px] font-bold uppercase tracking-wider pb-1 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const mm = String(month + 1).padStart(2, "0");
          const dd = String(day).padStart(2, "0");
          const dateStr = `${year}-${mm}-${dd}`;

          const entry = calendarData[dateStr];
          const isAttempted = !!entry;
          const isToday = dateStr === todayStr;
          const isFuture = dateStr > todayStr;
          const isSelected = dateStr === selectedDate;

          const dotColor = isAttempted ? scoreColor(entry.score, entry.totalQuestions) : null;

          return (
            <div key={dateStr} className="flex justify-center">
              <button
                onClick={() => !isFuture && onSelectDate(dateStr)}
                disabled={isFuture}
                className={`relative w-8 h-8 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center transition-all duration-150 ${
                  isSelected
                    ? "ring-2 ring-offset-1 ring-blue-500 scale-105"
                    : ""
                } ${
                  isToday && !isSelected
                    ? isDark
                      ? "ring-1 ring-blue-500/60"
                      : "ring-1 ring-blue-400/60"
                    : ""
                } ${
                  isFuture
                    ? isDark ? "text-gray-700 cursor-not-allowed" : "text-gray-300 cursor-not-allowed"
                    : isAttempted
                    ? isDark ? "text-gray-200 hover:bg-gray-700/60 cursor-pointer" : "text-gray-800 hover:bg-gray-100 cursor-pointer"
                    : isDark ? "text-gray-500 hover:bg-gray-700/40 cursor-pointer" : "text-gray-400 hover:bg-gray-100 cursor-pointer"
                } ${
                  isSelected
                    ? isDark ? "bg-blue-500/20" : "bg-blue-50"
                    : ""
                }`}
                style={
                  isSelected
                    ? { boxShadow: "none", ringOffsetColor: isDark ? "#161B22" : "#fff" }
                    : {}
                }
              >
                <span className="leading-none">{day}</span>
                {isAttempted && (
                  <span
                    className="absolute bottom-0.5 w-1 h-1 rounded-full"
                    style={{ background: dotColor }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const DailyQuizHistory = ({ isDark }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  // calendarData: { "YYYY-MM-DD": { score, totalQuestions, completedAt } }
  const [calendarData, setCalendarData] = useState({});
  const [calLoading, setCalLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [detailData, setDetailData] = useState(null); // null | { loading } | { attempted, ... }
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch calendar for current viewYear+viewMonth
  useEffect(() => {
    let cancelled = false;
    setCalLoading(true);
    getQuizCalendar(viewYear, viewMonth + 1)
      .then((res) => {
        if (!cancelled && res?.success) setCalendarData(res.data || {});
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setCalLoading(false); });
    return () => { cancelled = true; };
  }, [viewYear, viewMonth]);

  // Fetch detail when a date is selected
  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setDetailLoading(true);
    setDetailData(null);
    getQuizByDate(selectedDate)
      .then((res) => {
        if (!cancelled && res?.success) setDetailData(res.data);
      })
      .catch(() => { if (!cancelled) setDetailData({ attempted: false, error: true }); })
      .finally(() => { if (!cancelled) setDetailLoading(false); });
    return () => { cancelled = true; };
  }, [selectedDate]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    const now = new Date();
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return; // don't go into future
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const isNextDisabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
  };

  // Legend dot
  const Dot = ({ color, label }) => (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className={`text-[9px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-0">
      {/* ── Top row: calendar + detail panel ── */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* ── Calendar panel ── */}
        <div
          className={`rounded-xl p-4 shrink-0 w-full md:w-[280px] border ${
            isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"
          }`}
        >
          {/* Month/Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-500"
              }`}
            >
              <FiChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="text-center">
              <p className={`text-xs font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                {MONTH_NAMES[viewMonth]}
              </p>
              {/* Year selector */}
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <button
                  onClick={() => { setViewYear((y) => y - 1); setSelectedDate(null); }}
                  className={`text-[9px] px-1 rounded transition-colors ${
                    isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  ‹
                </button>
                <span className={`text-[10px] font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {viewYear}
                </span>
                <button
                  onClick={() => {
                    if (viewYear < today.getFullYear()) {
                      setViewYear((y) => y + 1);
                      setSelectedDate(null);
                    }
                  }}
                  disabled={viewYear >= today.getFullYear()}
                  className={`text-[9px] px-1 rounded transition-colors ${
                    viewYear >= today.getFullYear()
                      ? isDark ? "text-gray-700" : "text-gray-300"
                      : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  ›
                </button>
              </div>
            </div>

            <button
              onClick={nextMonth}
              disabled={isNextDisabled}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isNextDisabled
                  ? isDark ? "text-gray-700 cursor-not-allowed" : "text-gray-300 cursor-not-allowed"
                  : isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-500"
              }`}
            >
              <FiChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Calendar grid */}
          {calLoading ? (
            <div className="flex items-center justify-center h-36">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <MonthCalendar
              year={viewYear}
              month={viewMonth}
              calendarData={calendarData}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              isDark={isDark}
            />
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pt-3 border-t border-gray-700/30">
            <Dot color="#10b981" label="≥80%" />
            <Dot color="#f59e0b" label="≥60%" />
            <Dot color="#ef4444" label="<60%" />
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full shrink-0 border ${isDark ? "border-gray-600 bg-transparent" : "border-gray-300 bg-transparent"}`} />
              <span className={`text-[9px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>No attempt</span>
            </div>
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div className="flex-1 min-w-0">
          {!selectedDate ? (
            // Empty state
            <div
              className={`rounded-xl border h-full min-h-[250px] flex flex-col items-center justify-center gap-2 ${
                isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"
              }`}
            >
              <span className="text-3xl opacity-30">📅</span>
              <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Select a date to view quiz details
              </p>
            </div>
          ) : detailLoading ? (
            <div
              className={`rounded-xl border h-full min-h-[250px] flex items-center justify-center ${
                isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"
              }`}
            >
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : detailData?.attempted ? (
            // ─── Results view ───
            <div
              className={`rounded-xl border flex flex-col overflow-hidden ${
                isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"
              }`}
            >
              {/* Header */}
              <div
                className={`flex items-center gap-3 px-4 py-3 border-b ${
                  isDark ? "border-[#21262D]" : "border-[#EAEEF2]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                    {formatDate(selectedDate)}
                  </p>
                  <p
                    className="text-[10px] font-semibold mt-0.5"
                    style={{ color: scoreColor(detailData.score, detailData.totalQuestions) }}
                  >
                    {scorePerfLabel(detailData.score, detailData.totalQuestions)} ·{" "}
                    {new Date(detailData.completedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <ScoreRing score={detailData.score} total={detailData.totalQuestions} />
                <button
                  onClick={() => setSelectedDate(null)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isDark ? "hover:bg-gray-700 text-gray-500" : "hover:bg-gray-200 text-gray-400"
                  }`}
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>

              {/* Summary bar */}
              <div className={`flex items-center gap-4 px-4 py-2 border-b text-[10px] ${
                isDark ? "border-[#21262D] bg-[#0D1117]" : "border-[#EAEEF2] bg-white/50"
              }`}>
                <div className="flex items-center gap-1 text-emerald-500">
                  <FiCheckCircle className="w-3 h-3" />
                  <span className="font-semibold">
                    {detailData.results?.filter((r) => r.isCorrect).length ?? 0} Correct
                  </span>
                </div>
                <div className="flex items-center gap-1 text-rose-500">
                  <FiXCircle className="w-3 h-3" />
                  <span className="font-semibold">
                    {detailData.results?.filter((r) => !r.isCorrect).length ?? 0} Wrong
                  </span>
                </div>
                <div className={`ml-auto ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  {detailData.totalQuestions} questions total
                </div>
              </div>

              {/* Question list */}
              <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-2 max-h-[380px]">
                {(detailData.results || []).map((r, i) => (
                  <ResultItem key={r.questionId || i} result={r} index={i} isDark={isDark} />
                ))}
              </div>
            </div>
          ) : (
            // ─── Not attempted view ───
            <div
              className={`rounded-xl border h-full min-h-[250px] flex flex-col items-center justify-center gap-2 ${
                isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"
              }`}
            >
              <span className="text-3xl opacity-40">🚫</span>
              <p className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                No quiz attempt
              </p>
              <p className={`text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                {formatDate(selectedDate)}
              </p>
              <button
                onClick={() => setSelectedDate(null)}
                className={`mt-1 text-[10px] px-3 py-1 rounded-lg transition-colors ${
                  isDark ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyQuizHistory;
