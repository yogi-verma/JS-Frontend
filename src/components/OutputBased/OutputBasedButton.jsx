import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { useUser } from "../../utils/UserContext/UserContext";

const OutputBasedButton = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
      label: "JavaScript & React",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      label: "Predict the Output",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
      label: "With Explanations",
    },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 my-6 sm:my-8">
      <div
        onClick={() => navigate('/dashboard/output-based-questions')}
        className="mx-auto max-w-7xl rounded-2xl relative overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.01] active:scale-[0.995]"
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
        }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1a0a2e 0%, #0f172a 40%, #164e63 100%)"
              : "linear-gradient(135deg, #7C3AED 0%, #6D28D9 40%, #0891B2 100%)",
          }}
        />
        {/* Decorative glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{
            background: isDark
              ? "radial-gradient(circle, #8B5CF6, transparent)"
              : "radial-gradient(circle, #A78BFA, transparent)",
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{
            background: isDark
              ? "radial-gradient(circle, #06B6D4, transparent)"
              : "radial-gradient(circle, #22D3EE, transparent)",
          }}
        />

        <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left content */}
            <div className="min-w-0 flex-1">
              {/* Badge */}
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(6, 182, 212, 0.15)",
                    color: "#67E8F9",
                    border: "1px solid rgba(6, 182, 212, 0.3)",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  Live Now
                </span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: "rgba(251, 191, 36, 0.12)",
                    color: "#FCD34D",
                    border: "1px solid rgba(251, 191, 36, 0.25)",
                  }}
                >
                  New
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-[1.7rem] font-extrabold tracking-tight text-white leading-tight">
                Output-Based Questions
              </h2>
              <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-slate-300 max-w-lg">
                Can you predict the output? Master JavaScript & React tricky concepts with MCQ-style output-based questions — detailed explanations included.
              </p>

              {/* Feature pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium"
                    style={{
                      background: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.12)",
                      color: isDark ? "#CBD5E1" : "#E2E8F0",
                      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.18)"}`,
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
                  background: "linear-gradient(135deg, #7C3AED, #8B5CF6, #06B6D4)",
                  border: "1px solid rgba(139, 92, 246, 0.5)",
                }}
              >
                <span className="text-sm font-bold text-white whitespace-nowrap">
                  {isAuthenticated ? "Start Practicing" : "Start Practicing"}
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

export default OutputBasedButton;
