import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { useUser } from "../../utils/UserContext/UserContext";

const FrontendQuestionBundleButton = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      label: "HTML, CSS & JS",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      label: "React & Web Fundamentals",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      label: "200+ Questions",
    },
  ];

  return (
    <section className="px-4 sm:px-6 my-6 sm:my-8">
      <div
        onClick={() => navigate('/dashboard/frontend-interview-questions')}
        className="mx-auto max-w-6xl rounded-2xl relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.995]"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
        }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)"
              : "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 40%, #2563EB 100%)",
          }}
        />
        {/* Decorative glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{
            background: isDark
              ? "radial-gradient(circle, #3B82F6, transparent)"
              : "radial-gradient(circle, #60A5FA, transparent)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{
            background: isDark
              ? "radial-gradient(circle, #8B5CF6, transparent)"
              : "radial-gradient(circle, #A78BFA, transparent)",
          }}
        />

        <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left content */}
            <div className="min-w-0 flex-1">
              {/* Coming Soon badge */}
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(139, 92, 246, 0.15)",
                    color: "#A78BFA",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  Live Now
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold tracking-tight text-white leading-tight">
                Frontend Interview Questions Bundle
              </h2>
              <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-slate-300 max-w-lg">
                If you want to crack top product-based companies as a frontend developer, these are the topics you must know. Level: Intermediate.
              </p>

              {/* Feature pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium"
                    style={{
                      background: isDark
                        ? "rgba(255, 255, 255, 0.06)"
                        : "rgba(255, 255, 255, 0.12)",
                      color: isDark ? "#CBD5E1" : "#E2E8F0",
                      border: `1px solid ${
                        isDark
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(255, 255, 255, 0.18)"
                      }`,
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {f.icon}
                    {f.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — CTA button */}
            <div className="flex items-center shrink-0">
              <div
                className="px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #3B82F6, #60A5FA)",
                  border: "1px solid rgba(59, 130, 246, 0.5)",
                }}
              >
                <span className="text-sm font-bold text-white whitespace-nowrap">
                  {isAuthenticated ? "Let's Explore" : "Login to Explore"}
                </span>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrontendQuestionBundleButton;
