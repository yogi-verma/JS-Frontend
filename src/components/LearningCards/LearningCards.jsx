import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { useUser } from "../../utils/UserContext/UserContext";
import colors from "../../utils/color";

const LearningCards = ({ onLoginRequired }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const cards = [
    {
      id: "coding",
      title: "JavaScript Coding Challenges",
      description:
        "45 LeetCode-style problems with built-in compiler and auto test cases.",
      badge: { text: "LeetCode Style", color: "violet", live: true },
      features: [
        "45 Challenges",
        "Built-in Compiler",
        "Auto Test Cases",
        "Progress Tracking",
      ],
      difficulties: [
        { label: "Easy", count: 15, color: "#10B981" },
        { label: "Medium", count: 15, color: "#F59E0B" },
        { label: "Hard", count: 15, color: "#EF4444" },
      ],
      gradient: {
        dark: "linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)",
        light: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 40%, #5B21B6 100%)",
      },
      glow: { primary: "#8B5CF6", secondary: "#06B6D4" },
      buttonGradient: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
      route: "/dashboard/coding-questions",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
          />
        </svg>
      ),
      ctaText: "Start Coding",
    },
    {
      id: "interview",
      title: "JavaScript Interview Questions",
      description:
        "30 curated questions covering core concepts from Easy to Hard.",
      badge: { text: "Live Now", color: "emerald", live: true },
      secondBadge: { text: "New", color: "amber" },
      features: [
        "30 Curated Questions",
        "Real Code Examples",
        "Difficulty Levels",
        "Track Progress",
      ],
      difficulties: [
        { label: "Easy", count: 10, color: "#10B981" },
        { label: "Medium", count: 10, color: "#F59E0B" },
        { label: "Hard", count: 10, color: "#EF4444" },
      ],
      gradient: {
        dark: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        light: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 40%, #2563EB 100%)",
      },
      glow: { primary: "#3B82F6", secondary: "#8B5CF6" },
      buttonGradient: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
      route: "/dashboard/interview-questions",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      ctaText: "Start Practicing",
    },
    {
      id: "output-based",
      title: "Output-Based Questions",
      description:
        "Predict the output! MCQ-style JavaScript & React questions with detailed explanations.",
      badge: { text: "Live Now", color: "violet", live: true },
      secondBadge: { text: "New", color: "amber" },
      features: [
        "JavaScript & React",
        "Predict the Output",
        "MCQ with Explanations",
        "All Difficulty Levels",
      ],
      difficulties: [
        { label: "Easy", count: 45, color: "#10B981" },
        { label: "Medium", count: 37, color: "#F59E0B" },
        { label: "Hard", count: 9, color: "#EF4444" }
      ],
      gradient: {
        dark: "linear-gradient(135deg, #1a0a2e 0%, #0f172a 50%, #164e63 100%)",
        light: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 40%, #0891B2 100%)",
      },
      glow: { primary: "#8B5CF6", secondary: "#06B6D4" },
      buttonGradient: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
      route: "/dashboard/output-based-questions",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      ctaText: "Start Practicing",
    },
    {
      id: "frontend",
      title: "Frontend Interview Bundle",
      description:
        "200+ questions covering HTML, CSS, JS, React & Web Fundamentals.",
      badge: { text: "Live Now", color: "violet", live: true },
      features: [
        "HTML, CSS & JS",
        "React & Fundamentals",
        "200+ Questions",
        "Company Ready",
      ],
      gradient: {
        dark: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        light: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 40%, #2563EB 100%)",
      },
      glow: { primary: "#3B82F6", secondary: "#8B5CF6" },
      buttonGradient: "linear-gradient(135deg, #2563EB, #3B82F6, #60A5FA)",
      route: "/dashboard/frontend-interview-questions",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      ctaText: "Let's Explore",
    },
  ];

  const getBadgeColors = (color) => {
    const colors = {
      emerald: {
        bg: "rgba(16, 185, 129, 0.15)",
        border: "rgba(16, 185, 129, 0.3)",
        text: "#34D399",
        dot: "bg-emerald-400",
      },
      violet: {
        bg: "rgba(139, 92, 246, 0.15)",
        border: "rgba(139, 92, 246, 0.3)",
        text: "#A78BFA",
        dot: "bg-violet-400",
      },
      amber: {
        bg: "rgba(251, 191, 36, 0.12)",
        border: "rgba(251, 191, 36, 0.25)",
        text: "#FCD34D",
        dot: null,
      },
    };
    return colors[color] || colors.violet;
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-8 sm:my-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className={`text-3xl font-bold mb-2 ${colors.blueTextGradient}`}>
            Crack JavaScript & Frontend Interviews
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Practice real coding questions, master core concepts, and prepare
            with hand-picked interview questions designed for modern frontend
            developers.
          </p>
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((card) => {
            const badgeColors = getBadgeColors(card.badge.color);
            const secondBadgeColors = card.secondBadge
              ? getBadgeColors(card.secondBadge.color)
              : null;

            return (
              <div
                key={card.id}
                className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(card.route);
                  } else if (onLoginRequired) {
                    onLoginRequired();
                  }
                }}
                style={{
                  background: isDark ? card.gradient.dark : card.gradient.light,
                }}
              >
                {/* Glassmorphism overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)"
                      : "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
                  }}
                />

                {/* Animated glow effects */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${card.glow.primary}, transparent)`,
                  }}
                />
                <div
                  className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${card.glow.secondary}, transparent)`,
                  }}
                />

                {/* Static subtle glow */}
                <div
                  className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${card.glow.primary}, transparent)`,
                  }}
                />

                {/* Card Content */}
                <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full">
                  {/* Icon & Badges */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      <div className="text-white">{card.icon}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: badgeColors.bg,
                          color: badgeColors.text,
                          border: `1px solid ${badgeColors.border}`,
                        }}
                      >
                        {card.badge.live && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badgeColors.dot} opacity-75`}
                            ></span>
                            <span
                              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${badgeColors.dot.replace("400", "500")}`}
                            ></span>
                          </span>
                        )}
                        {card.badge.text}
                      </span>
                      {card.secondBadge && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
                          style={{
                            background: secondBadgeColors.bg,
                            color: secondBadgeColors.text,
                            border: `1px solid ${secondBadgeColors.border}`,
                          }}
                        >
                          <svg
                            className="w-2.5 h-2.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                          {card.secondBadge.text}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-1.5">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 grow">
                    {card.description}
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {card.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          background: isDark
                            ? "rgba(255, 255, 255, 0.06)"
                            : "rgba(255, 255, 255, 0.15)",
                          color: isDark ? "#CBD5E1" : "#E2E8F0",
                          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.2)"}`,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Difficulty Indicators */}
                  {card.difficulties && (
                    <div className="flex items-center gap-2.5 mb-4">
                      {card.difficulties.map((diff) => (
                        <div
                          key={diff.label}
                          className="flex items-center gap-1"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: diff.color }}
                          />
                          <span className="text-[10px] font-medium text-slate-400">
                            {diff.count} {diff.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                     
                </div>

                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: `1px solid ${card.glow.primary}40`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LearningCards;
