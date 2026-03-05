import { useState, useEffect, useMemo } from "react";
import {
  FiZap,
  FiAward,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";
import {
  getUserStreak,
  getStreakCalendar,
} from "../../../utils/BackendCalls/authService";

/* ─── Helpers ─── */
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
const getFirstDayOfMonth = (year, month) =>
  new Date(year, month - 1, 1).getDay();

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/* ─── Intensity color ─── */
const getIntensityColor = (count, isDark) => {
  if (!count || count === 0) return isDark ? "#161B22" : "#EBEDF0";
  if (count === 1) return "#0E4429";
  if (count === 2) return "#006D32";
  if (count === 3) return "#26A641";
  return "#39D353"; // 4+
};

/* ─── Stat badge ─── */
// eslint-disable-next-line no-unused-vars
const StatBadge = ({ icon: Icon, label, value, color, isDark }) => (
  <div
    className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
    style={{
      background: isDark ? "#0D1117" : "#F6F8FA",
      border: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}`,
    }}
  >
    <div
      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
      style={{ background: `${color}18` }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color }} />
    </div>
    <div className="min-w-0">
      <p
        className={`text-sm font-bold leading-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}
      >
        {value}
      </p>
      <p
        className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
      >
        {label}
      </p>
    </div>
  </div>
);

/* ─── Mini Month Grid ─── */
const MiniMonth = ({ year, month, activeDays, isDark }) => {
  const today = todayStr();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells = useMemo(() => {
    const result = [];
    // Empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      result.push({ key: `e-${month}-${i}`, empty: true });
    }
    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${pad(month)}-${pad(day)}`;
      const count = activeDays[dateStr] || 0;
      result.push({
        key: dateStr,
        day,
        dateStr,
        count,
        isToday: dateStr === today,
        empty: false,
      });
    }
    return result;
  }, [year, month, daysInMonth, firstDay, activeDays, today]);

  return (
    <div>
      {/* Month label */}
      <h4
        className={`text-[10px] font-semibold mb-1.5 ${isDark ? "text-gray-300" : "text-gray-600"}`}
      >
        {MONTH_NAMES[month - 1]}
      </h4>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-0.75 mb-0.75">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className={`text-center text-[7px] leading-none ${isDark ? "text-gray-600" : "text-gray-400"}`}
          >
            {d.charAt(0)}
          </div>
        ))}
      </div>
      {/* Dots grid */}
      <div className="grid grid-cols-7 gap-0.75">
        {cells.map((cell) =>
          cell.empty ? (
            <div key={cell.key} className="w-2.5 h-2.5" />
          ) : (
            <div key={cell.key} className="relative group">
              <div
                className={`w-2.5 h-2.5 rounded-xs transition-all ${
                  cell.isToday ? "ring-1 ring-offset-1" : ""
                }`}
                style={{
                  background: getIntensityColor(cell.count, isDark),
                  ringColor: cell.isToday
                    ? isDark
                      ? "#58A6FF"
                      : "#2563EB"
                    : undefined,
                  ringOffsetColor: cell.isToday
                    ? isDark
                      ? "#0D1117"
                      : "#F6F8FA"
                    : undefined,
                }}
              />
              {/* Tooltip */}
              <div
                className={`absolute z-30 bottom-full left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-800 text-white"
                }`}
              >
                {cell.count > 0
                  ? `${cell.count} submissions${cell.count > 1 ? "s" : ""}`
                  : "No activity"}
                <span
                  className={`block text-[8px] ${isDark ? "text-gray-400" : "text-gray-300"}`}
                >
                  {cell.dateStr}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */
const Streak = ({ isDark }) => {
  const [streak, setStreak] = useState(null);
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());

  /* Fetch streak summary on mount */
  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await getUserStreak();
        setStreak(
          res?.data || {
            currentStreak: 0,
            longestStreak: 0,
            totalActiveDays: 0,
            isActiveToday: false,
            todaySolveCount: 0,
          },
        );
      } catch {
        setStreak({
          currentStreak: 0,
          longestStreak: 0,
          totalActiveDays: 0,
          isActiveToday: false,
          todaySolveCount: 0,
        });
      }
    };
    fetchStreak();
  }, []);

  /* Fetch full year calendar data */
  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const res = await getStreakCalendar(viewYear);
        setCalendarData(res?.data?.activeDays || {});
      } catch {
        setCalendarData({});
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [viewYear]);

  /* Year navigation */
  const isNextDisabled = viewYear >= now.getFullYear();
  const goToPrevYear = () => setViewYear((y) => y - 1);
  const goToNextYear = () => {
    if (!isNextDisabled) setViewYear((y) => y + 1);
  };

  /* Count active days in viewed year */
  const yearActiveCount = useMemo(() => {
    return Object.keys(calendarData).filter((d) =>
      d.startsWith(String(viewYear)),
    ).length;
  }, [calendarData, viewYear]);

  /* ─── Skeleton Loading ─── */
  if (streak === null) {
    return (
      <div className="space-y-4">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 animate-pulse border ${
                isDark
                  ? "bg-[#0D1117] border-[#21262D]"
                  : "bg-gray-50 border-[#EAEEF2]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-md ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                />
                <div>
                  <div
                    className={`h-4 w-8 rounded mb-1 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                  />
                  <div
                    className={`h-2.5 w-14 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Calendar skeleton */}
        <div
          className={`rounded-lg p-4 border ${isDark ? "bg-[#0D1117] border-[#21262D]" : "bg-gray-50 border-[#EAEEF2]"}`}
        >
          <div
            className={`h-4 w-16 rounded mb-4 mx-auto ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i}>
                <div
                  className={`h-3 w-8 rounded mb-2 ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                />
                <div className="grid grid-cols-7 gap-0.75">
                  {Array.from({ length: 35 }, (_, j) => (
                    <div
                      key={j}
                      className={`w-2.5 h-2.5 rounded-xs ${isDark ? "bg-gray-800" : "bg-gray-200"} animate-pulse`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ─── Streak Stats Row ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBadge
          icon={FiZap}
          label="Current Streak"
          value={`${streak.currentStreak} day${streak.currentStreak !== 1 ? "s" : ""}`}
          color="#F59E0B"
          isDark={isDark}
        />
        <StatBadge
          icon={FiAward}
          label="Longest Streak"
          value={`${streak.longestStreak} day${streak.longestStreak !== 1 ? "s" : ""}`}
          color="#8B5CF6"
          isDark={isDark}
        />
        <StatBadge
          icon={FiCalendar}
          label="Active Days"
          value={streak.totalActiveDays}
          color="#06B6D4"
          isDark={isDark}
        />
        <StatBadge
          icon={FiCheck}
          label="Today"
          value={
            streak.isActiveToday
              ? `${streak.todaySolveCount} submissions`
              : "Not yet"
          }
          color={streak.isActiveToday ? "#10B981" : "#6B7280"}
          isDark={isDark}
        />
      </div>

      {/* ─── Full Year Calendar ─── */}
      <div
        className="rounded-lg p-4 border transition-colors"
        style={{
          background: isDark ? "#0D1117" : "#F6F8FA",
          border: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}`,
        }}
      >
        {/* Year navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevYear}
            className={`p-1 rounded-md transition-colors ${
              isDark
                ? "hover:bg-[#21262D] text-gray-400"
                : "hover:bg-gray-200 text-gray-500"
            }`}
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h3
              className={`text-sm font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}
            >
              {viewYear}
            </h3>
            <p
              className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {yearActiveCount} active day{yearActiveCount !== 1 ? "s" : ""}{" "}
              this year
            </p>
          </div>
          <button
            onClick={goToNextYear}
            disabled={isNextDisabled}
            className={`p-1 rounded-md transition-colors ${
              isNextDisabled
                ? "opacity-30 cursor-not-allowed"
                : isDark
                  ? "hover:bg-[#21262D] text-gray-400"
                  : "hover:bg-gray-200 text-gray-500"
            }`}
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 12 Month grid */}
       {loading ? (
  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: 12 }, (_, i) => (
      <div key={i}>
        <div
          className={`h-3 w-8 rounded mb-2 ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
        />
        <div className="grid grid-cols-7 gap-0.75">
          {Array.from({ length: 35 }, (_, j) => (
            <div
              key={j}
              className={`w-2.5 h-2.5 rounded-xs ${isDark ? "bg-gray-800" : "bg-gray-200"} animate-pulse`}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: 12 }, (_, i) => (
      <MiniMonth
        key={i}
        year={viewYear}
        month={i + 1}
        activeDays={calendarData}
        isDark={isDark}
      />
    ))}
  </div>
)}
      </div>
    </div>
  );
};

export default Streak;
