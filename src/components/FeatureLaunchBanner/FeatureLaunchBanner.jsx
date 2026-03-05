import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import "./FeatureLaunchBanner.css";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  STORAGE KEY — flip this when you launch a DIFFERENT feature              */
/* ═══════════════════════════════════════════════════════════════════════════ */
const STORAGE_KEY = "flb_outputBased_seen";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  HELPERS                                                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */
const rand = (min, max) => Math.random() * (max - min) + min;

const CONFETTI_COLORS = [
  "#8B5CF6", "#06B6D4", "#F59E0B", "#EF4444",
  "#10B981", "#EC4899", "#3B82F6", "#F97316",
];

const PARTICLE_COLORS = [
  "rgba(139,92,246,0.7)", "rgba(6,182,212,0.7)",
  "rgba(236,72,153,0.5)", "rgba(251,191,36,0.5)",
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PARTICLES                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */
const Particles = React.memo(() => {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: rand(3, 7),
        left: `${rand(5, 95)}%`,
        bottom: `${rand(-5, 10)}%`,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        duration: `${rand(3, 6)}s`,
        delay: `${rand(0, 3)}s`,
      })),
    []
  );

  return particles.map((p) => (
    <div
      key={p.id}
      className="flb-particle"
      style={{
        width: p.size,
        height: p.size,
        left: p.left,
        bottom: p.bottom,
        background: p.color,
        animationDuration: p.duration,
        animationDelay: p.delay,
      }}
    />
  ));
});
Particles.displayName = "Particles";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SPARKLES                                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */
const Sparkles = React.memo(() => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        top: `${rand(10, 90)}%`,
        left: `${rand(5, 95)}%`,
        color: i % 2 === 0 ? "#fde68a" : "#a5f3fc",
        delay: `${rand(0, 3)}s`,
        duration: `${rand(1.5, 3)}s`,
      })),
    []
  );

  return sparkles.map((s) => (
    <div
      key={s.id}
      className="flb-sparkle"
      style={{
        top: s.top,
        left: s.left,
        background: s.color,
        boxShadow: `0 0 6px 2px ${s.color}`,
        animationDelay: s.delay,
        animationDuration: s.duration,
      }}
    />
  ));
});
Sparkles.displayName = "Sparkles";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  CONFETTI BURST                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */
const ConfettiBurst = React.memo(() => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        const shapes = ["flb-confetti-circle", "flb-confetti-square", "flb-confetti-rect"];
        return {
          id: i,
          shape: shapes[i % shapes.length],
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          left: `${rand(10, 90)}%`,
          top: "-5%",
          duration: `${rand(2, 4)}s`,
          delay: `${rand(0.3, 1.5)}s`,
          rotate: `${rand(0, 360)}deg`,
        };
      }),
    []
  );

  return pieces.map((c) => (
    <div
      key={c.id}
      className={`flb-confetti ${c.shape}`}
      style={{
        background: c.color,
        left: c.left,
        top: c.top,
        animationDuration: c.duration,
        animationDelay: c.delay,
        transform: `rotate(${c.rotate})`,
      }}
    />
  ));
});
ConfettiBurst.displayName = "ConfettiBurst";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */
const FeatureLaunchBanner = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  /* show only once per user */
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setVisible(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, "1");
    }, 600);
  }, []);

  const handleExplore = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      navigate("/dashboard/output-based-questions");
    }, 500);
  }, [navigate]);

  /* Prevent background scroll */
  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  /* ─── Theme palette ──────────────────────────────────────────────────── */
  const overlayBg = isDark
    ? "rgba(2, 6, 23, 0.82)"
    : "rgba(15, 23, 42, 0.65)";

  const cardGradient = isDark
    ? "linear-gradient(135deg, #0c0a1d 0%, #0f172a 40%, #0d2137 70%, #131029 100%)"
    : "linear-gradient(135deg, #1e1145 0%, #1a1054 40%, #0c2d4a 70%, #14103a 100%)";

  const cardBorder = isDark
    ? "1px solid rgba(139, 92, 246, 0.2)"
    : "1px solid rgba(139, 92, 246, 0.35)";

  /* ─── Feature chips data ─────────────────────────────────────────────── */
  const chips = [
    { icon: "⚡", label: "JavaScript & React" },
    { icon: "🎯", label: "Predict the Output" },
    { icon: "📖", label: "Detailed Explanations" },
  ];

  return (
    <div
      className={`flb-overlay ${exiting ? "flb-exit" : ""}`}
      style={{ background: overlayBg }}
      onClick={handleDismiss}
    >
      {/* ── Confetti ────────────────────────── */}
      <ConfettiBurst />

      {/* ── Card ────────────────────────────── */}
      <div
        className="flb-card"
        style={{ background: cardGradient, border: cardBorder }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* animated gradient layer */}
        <div
          className="flb-gradient-bg"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, transparent 40%, rgba(6,182,212,0.06) 70%, transparent 100%)",
          }}
        />

        {/* glow blobs */}
        <div
          className="flb-glow-blob"
          style={{
            width: 200,
            height: 200,
            top: "-15%",
            right: "-10%",
            background: "rgba(139, 92, 246, 0.15)",
          }}
        />
        <div
          className="flb-glow-blob"
          style={{
            width: 160,
            height: 160,
            bottom: "-10%",
            left: "-8%",
            background: "rgba(6, 182, 212, 0.12)",
            animationDelay: "2.5s",
          }}
        />

        {/* scan line */}
        <div
          className="flb-scanline"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)",
          }}
        />

        {/* orbit rings */}
        <div
          className="flb-orbit-ring"
          style={{ width: 320, height: 320, top: "-60%", left: "50%", marginLeft: -160 }}
        />
        <div
          className="flb-orbit-ring"
          style={{ width: 260, height: 260, top: "-45%", left: "50%", marginLeft: -130 }}
        />

        {/* particles + sparkles */}
        <Particles />
        <Sparkles />

        {/* close button */}
        <button
          className="flb-close"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "#94a3b8",
          }}
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* ── Content ───────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 py-6 sm:px-8 sm:py-7">
          {/* Icon with pulse */}
          <div className="flb-icon-wrap relative mb-4">
            <div className="flb-pulse-ring" style={{ background: "rgba(139,92,246,0.18)" }} />
            <div className="flb-pulse-ring" style={{ background: "rgba(6,182,212,0.12)", animationDelay: "1s" }} />
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #0891B2 100%)",
                boxShadow: "0 0 30px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
          </div>

          {/* NEW FEATURE badge */}
          <div className="flb-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.08))",
              border: "1px solid rgba(251,191,36,0.3)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-amber-300">
              New Feature Launched
            </span>
            <span className="text-sm">🚀</span>
          </div>

          {/* Title */}
          <h2 className="flb-title text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight mb-1.5">
            Output-Based Questions
          </h2>

          {/* Subtitle */}
          <p className="flb-subtitle text-xs sm:text-sm leading-relaxed text-slate-400 max-w-md mb-4">
            Can you predict the output? Master tricky JavaScript & React concepts
            with MCQ-style challenges — complete with <span className="text-cyan-400 font-semibold">detailed explanations</span>.
          </p>

          {/* Mini code snippet preview */}
          <div
            className="flb-code-typing w-full max-w-xs rounded-xl px-3 py-2.5 mb-4 text-left font-mono text-[11px] sm:text-xs"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <div className="text-slate-500 mb-1">{"// What's the output?"}</div>
            <div>
              <span className="text-violet-400">console</span>
              <span className="text-slate-300">.</span>
              <span className="text-cyan-400">log</span>
              <span className="text-slate-300">(</span>
              <span className="text-amber-300">typeof</span>
              <span className="text-slate-300"> </span>
              <span className="text-emerald-400">null</span>
              <span className="text-slate-300">)</span>
              <span className="flb-cursor" />
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-400 font-semibold">→ "object"</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flb-stats flex items-center justify-center gap-4 sm:gap-6 mb-4" >
            {[
              { value: "100+", label: "Questions", color: "#8B5CF6" },
              { value: "3", label: "Difficulty Levels", color: "#06B6D4" },
              { value: "JS & React", label: "Categories", color: "#F59E0B" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-base sm:text-lg font-extrabold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {chips.map((chip, i) => (
              <div
                key={i}
                className="flb-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#cbd5e1",
                }}
              >
                <span>{chip.icon}</span>
                {chip.label}
              </div>
            ))}
          </div>

          {/* CTA button */}
          <button
            className="flb-cta px-7 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #06B6D4 100%)",
              border: "1px solid rgba(139,92,246,0.4)",
            }}
            onClick={handleExplore}
          >
            Start Practicing Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          {/* Dismiss hint */}
          <button
            className="flb-dismiss mt-4 text-[12px] text-slate-600 hover:text-slate-400 transition-colors bg-transparent border-none cursor-pointer"
            onClick={handleDismiss}
          >
            Maybe later — dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureLaunchBanner;
