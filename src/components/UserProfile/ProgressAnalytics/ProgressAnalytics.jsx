import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiLayout, FiCode, FiArrowRight } from "react-icons/fi";
import {
  getInterviewQuestionsStats,
  getUserInterviewProgress,
  getFrontendQuestionsStats,
  getUserFrontendProgress,
  getUserCodingStats,
} from "../../../utils/BackendCalls/authService";

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

/* ─── Main component ─── */
const ProgressAnalytics = ({ isDark }) => {
  const [stats, setStats] = useState({
    interview: { total: 0, completed: 0 },
    frontend: { total: 0, completed: 0 },
    coding: { total: 0, completed: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          interviewStats,
          interviewProgress,
          frontendStats,
          frontendProgress,
          codingStats,
        ] = await Promise.all([
          getInterviewQuestionsStats(),
          getUserInterviewProgress(),
          getFrontendQuestionsStats(),
          getUserFrontendProgress(),
          getUserCodingStats(),
        ]);

        // Backend wraps data in { success, data: { ... } } — extract from .data
        const interviewTotal = interviewStats?.data?.total || 0;
        const interviewCompleted = interviewProgress?.completedCount || 0;

        const frontendTotal = frontendStats?.data?.total || 0;
        const frontendCompleted = frontendProgress?.completedCount || 0;

        const codingTotal = codingStats?.data?.totalQuestions || 0;
        const codingCompleted = codingStats?.data?.solvedCount || 0;

        setStats({
          interview: { total: interviewTotal, completed: interviewCompleted },
          frontend: { total: frontendTotal, completed: frontendCompleted },
          coding: { total: codingTotal, completed: codingCompleted },
        });
      } catch (error) {
        console.error("Failed to fetch progress stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalAll = stats.interview.total + stats.frontend.total + stats.coding.total;
  const completedAll = stats.interview.completed + stats.frontend.completed + stats.coding.completed;
  const overallPercentage = totalAll > 0 ? (completedAll / totalAll) * 100 : 0;

  const getPercentage = (completed, total) => (total > 0 ? (completed / total) * 100 : 0);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            Progress
          </h2>
        </div>
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
      </div>
    );
  }

  return (
    <div>
      {/* Header + overall bar */}
      <div className="flex items-center justify-between mb-1.5">
        <h2 className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          Progress
        </h2>
        <span className={`text-[10px] font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {completedAll} / {totalAll} total
        </span>
      </div>

      {/* Overall progress bar */}
      <div
        className={`w-full h-1.5 rounded-full mb-4 overflow-hidden ${
          isDark ? "bg-gray-700/40" : "bg-gray-200"
        }`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${overallPercentage}%`,
            background: "linear-gradient(90deg, #8B5CF6, #06B6D4, #10B981)",
          }}
        />
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ReportCard
          icon={FiMessageSquare}
          title="Javascript Prep"
          completed={stats.interview.completed}
          total={stats.interview.total}
          percentage={getPercentage(stats.interview.completed, stats.interview.total)}
          color="#8B5CF6"
          link="/dashboard/interview-questions"
          isDark={isDark}
        />
        <ReportCard
          icon={FiLayout}
          title="Frontend Prep"
          completed={stats.frontend.completed}
          total={stats.frontend.total}
          percentage={getPercentage(stats.frontend.completed, stats.frontend.total)}
          color="#06B6D4"
          link="/dashboard/frontend-interview-questions"
          isDark={isDark}
        />
        <ReportCard
          icon={FiCode}
          title="Javascript Coding"
          completed={stats.coding.completed}
          total={stats.coding.total}
          percentage={getPercentage(stats.coding.completed, stats.coding.total)}
          color="#10B981"
          link="/dashboard/coding-questions"
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default ProgressAnalytics;
