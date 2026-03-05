import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import "./OutputBasedPromoStrip.css";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PERSISTENT PROMO STRIP — sticks on Dashboard after modal is dismissed    */
/* ═══════════════════════════════════════════════════════════════════════════ */

const OutputBasedPromoStrip = ({ onLoginRequired }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (onLoginRequired) {
      onLoginRequired();
    } else {
      navigate("/dashboard/output-based-questions");
    }
  }, [navigate, onLoginRequired]);

  /* Sparkle positions — stable across renders */
  const sparkles = useMemo(
    () => [
      { top: "20%", left: "8%", color: "#fde68a", delay: "0s" },
      { top: "70%", left: "25%", color: "#a5f3fc", delay: "1s" },
      { top: "15%", left: "55%", color: "#fde68a", delay: "1.5s" },
      { top: "75%", left: "78%", color: "#a5f3fc", delay: "0.5s" },
      { top: "40%", left: "92%", color: "#c4b5fd", delay: "2s" },
    ],
    []
  );

  const gradient = isDark
    ? "linear-gradient(135deg, #1a0a2e 0%, #0f172a 40%, #0d2a3a 70%, #130f29 100%)"
    : "linear-gradient(135deg, #7C3AED 0%, #6D28D9 35%, #4338CA 60%, #0891B2 100%)";

  const borderColor = isDark
    ? "rgba(139, 92, 246, 0.2)"
    : "rgba(139, 92, 246, 0.35)";

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-3 mb-1">
      <div
        className="ops-wrap ops-gradient mx-auto max-w-7xl rounded-2xl relative overflow-hidden cursor-pointer"
        style={{
          background: gradient,
          border: `1px solid ${borderColor}`,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
        }}
        onClick={handleClick}
      >
        {/* Shimmer sweep */}
        <div className="ops-shimmer" />

        {/* Sparkle dots */}
        {sparkles.map((s, i) => (
          <div
            key={i}
            className="ops-sparkle"
            style={{
              top: s.top,
              left: s.left,
              background: s.color,
              boxShadow: `0 0 4px ${s.color}`,
              animationDelay: s.delay,
            }}
          />
        ))}

        {/* Decorative glow blobs */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
          {/* Icon */}
          <div
            className="ops-icon-glow shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
            }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-[15px] font-bold text-white truncate">
                Output-Based Questions
              </span>
              {/* NEW badge */}
              <span
                className="ops-new-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider"
                style={{
                  background: "rgba(251, 191, 36, 0.15)",
                  color: "#FCD34D",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                </span>
                New
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              Predict the output — JS & React MCQs with explanations
            </p>
          </div>

          {/* CTA */}
          <div
            className="ops-cta shrink-0 hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #8B5CF6, #06B6D4)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
            }}
          >
            Try Now
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>

          {/* Mobile arrow */}
          <div className="sm:hidden shrink-0">
            <svg
              className="w-5 h-5 text-slate-400"
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutputBasedPromoStrip;
