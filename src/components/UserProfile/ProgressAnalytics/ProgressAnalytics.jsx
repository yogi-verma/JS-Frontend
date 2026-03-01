import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../../utils/color";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Circular progress ring component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 10, isDark, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={isDark ? "#374151" : "#E5E7EB"}
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
      />
    </svg>
  );
};

// Single report card
const ReportCard = ({ title, icon, completed, total, isDark, accentColor, link }) => {
  const navigate = useNavigate();
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      className="rounded-xl p-5 shadow-md"
      style={{
        background: isDark ? "#1F2937" : colors.white,
        border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
      }}
    >
      {/* Card Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3
          className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
        >
          {title}
        </h3>
      </div>

      {/* Progress Ring + Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Ring */}
        <div
          className="relative flex-shrink-0 cursor-pointer group"
          onClick={() => navigate(link)}
          title={`Go to ${title}`}
        >
          <CircularProgress
            percentage={percentage}
            isDark={isDark}
            color={accentColor}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform group-hover:scale-110">
            <span
              className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              {percentage}%
            </span>
            <span
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Complete
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 w-full space-y-3">
          {/* Completed / Total */}
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Questions Completed
            </span>
            <span className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {completed} / {total}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="w-full h-2.5 rounded-full overflow-hidden"
            style={{ background: isDark ? "#374151" : "#E5E7EB" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${percentage}%`,
                background: accentColor,
                transition: "width 1s ease-in-out",
              }}
            />
          </div>

          {/* Remaining */}
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Remaining
            </span>
            <span className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              {total - completed}
            </span>
          </div>


        </div>
      </div>
    </div>
  );
};

const ProgressAnalytics = ({ isDark }) => {
  const [interviewStats, setInterviewStats] = useState({ total: 0, completed: 0, breakdown: [] });
  const [frontendStats, setFrontendStats] = useState({ total: 0, completed: 0, breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [interviewStatsRes, interviewProgressRes, frontendStatsRes, frontendProgressRes] =
        await Promise.all([
          fetch(`${BACKEND_URL}/api/interview-questions/stats`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/interview-progress`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/frontend-questions/stats`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/api/frontend-progress`, { credentials: "include" }),
        ]);

      const [interviewStatsData, interviewProgressData, frontendStatsData, frontendProgressData] =
        await Promise.all([
          interviewStatsRes.json(),
          interviewProgressRes.json(),
          frontendStatsRes.json(),
          frontendProgressRes.json(),
        ]);

      // Interview stats
      if (interviewStatsData.success) {
        const difficultyBreakdown = interviewStatsData.data.byDifficulty
          ? Object.entries(interviewStatsData.data.byDifficulty).map(([label, count]) => ({ label, count }))
          : [];

        setInterviewStats({
          total: interviewStatsData.data.total || 0,
          completed: interviewProgressData.completedCount || 0,
          breakdown: difficultyBreakdown,
        });
      }

      // Frontend stats
      if (frontendStatsData.success) {
        const categoryBreakdown = (frontendStatsData.data.byCategory || []).map((item) => ({
          label: item.category,
          count: item.count,
        }));

        setFrontendStats({
          total: frontendStatsData.data.total || 0,
          completed: frontendProgressData.completedCount || 0,
          breakdown: categoryBreakdown,
        });
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Progress Analytics
        </h2>
        <div
          className="rounded-xl p-8 shadow-md flex items-center justify-center"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${colors.blueMid} transparent ${colors.blueMid} ${colors.blueMid}` }} />
            <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Loading analytics...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Progress Analytics
        </h2>
        <div
          className="rounded-xl p-5 shadow-md"
          style={{
            background: isDark ? "#1F2937" : colors.white,
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          }}
        >
          <p className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-2 text-sm px-3 py-1 rounded-lg font-medium transition hover:opacity-80"
            style={{
              background: isDark ? colors.blueDark : colors.blueLight,
              color: colors.textLight,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalCompleted = interviewStats.completed + frontendStats.completed;
  const totalQuestions = interviewStats.total + frontendStats.total;
  const overallPercentage = totalQuestions > 0 ? Math.round((totalCompleted / totalQuestions) * 100) : 0;

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
        Progress Analytics
      </h2>

      {/* Overall Summary Bar */}
      <div
        className="rounded-xl p-4 shadow-md mb-3"
        style={{
          background: isDark ? "#1F2937" : colors.white,
          border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Overall Progress
          </span>
          <span className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
            {totalCompleted} / {totalQuestions} questions ({overallPercentage}%)
          </span>
        </div>
        <div
          className="w-full h-3 rounded-full overflow-hidden"
          style={{ background: isDark ? "#374151" : "#E5E7EB" }}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
            style={{
              width: `${overallPercentage}%`,
              transition: "width 1s ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Two Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ReportCard
          title="Interview Progress"
          icon="🎯"
          completed={interviewStats.completed}
          total={interviewStats.total}
          isDark={isDark}
          accentColor="#8B5CF6"
          link="/dashboard/interview-questions"
        />
        <ReportCard
          title="Frontend Topics"
          icon="💻"
          completed={frontendStats.completed}
          total={frontendStats.total}
          isDark={isDark}
          accentColor="#06B6D4"
          link="/dashboard/frontend-interview-questions"
        />
      </div>
    </div>
  );
};

export default ProgressAnalytics;
