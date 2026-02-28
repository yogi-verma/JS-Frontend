import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { useUser } from "../../utils/UserContext/UserContext";

const JavascriptInterviewQuestionsButton = ({ onLearnMoreClick }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  const features = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      label: "30 Curated Questions",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
      label: "Real Code Examples",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      label: "Easy → Medium → Hard",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Track Your Progress",
    },
  ];

  return (
    <section className="px-4 sm:px-6 my-6 sm:my-8">
      <div
        className="mx-auto max-w-6xl rounded-2xl relative overflow-hidden"
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
              {/* Live badge */}
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "#34D399",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live Now
                </span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold"
                  style={{
                    background: "rgba(251, 191, 36, 0.12)",
                    color: "#FCD34D",
                    border: "1px solid rgba(251, 191, 36, 0.25)",
                  }}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  New
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold tracking-tight text-white leading-tight">
                JavaScript Interview Questions
              </h2>
              

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

              {/* Difficulty breakdown */}
              <div className="mt-4 flex items-center gap-3">
                {[
                  { label: "Easy", count: 10, color: "#10B981" },
                  { label: "Medium", count: 10, color: "#F59E0B" },
                  { label: "Hard", count: 10, color: "#EF4444" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: d.color }}
                    ></span>
                    <span className="text-[12px] font-semibold text-slate-400">
                      {d.count} {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right CTA */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard/interview-questions")}
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-[15px] font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    color: "#FFFFFF",
                    boxShadow:
                      "0 4px 15px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Start Practicing
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => onLearnMoreClick && onLearnMoreClick()}
                  className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm sm:text-[15px] font-bold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] hover:cursor-pointer"
                  style={{
                    background: "rgba(255, 255, 255, 0.12)",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Sign in to Start
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JavascriptInterviewQuestionsButton;
