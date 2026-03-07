import { useEffect, useRef } from "react";
import { FiX, FiCalendar } from "react-icons/fi";

/* ─── Tier styling ─── */
const TIER_CONFIG = {
  bronze: {
    gradient: "linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)",
    glow: "#CD7F3250",
    accent: "#CD7F32",
    label: "Bronze",
    particles: ["#CD7F32", "#D4A574", "#B8860B"],
  },
  silver: {
    gradient: "linear-gradient(135deg, #C0C0C0 0%, #808080 100%)",
    glow: "#C0C0C050",
    accent: "#A8A8A8",
    label: "Silver",
    particles: ["#C0C0C0", "#D3D3D3", "#A9A9A9"],
  },
  gold: {
    gradient: "linear-gradient(135deg, #FFD700 0%, #DAA520 100%)",
    glow: "#FFD70050",
    accent: "#DAA520",
    label: "Gold",
    particles: ["#FFD700", "#FFC125", "#FFBF00"],
  },
  platinum: {
    gradient: "linear-gradient(135deg, #E5E4E2 0%, #8B8986 100%)",
    glow: "#B0AEAB50",
    accent: "#8B8986",
    label: "Platinum",
    particles: ["#E5E4E2", "#D4D4D2", "#C0BFBC"],
  },
};

const BadgePopup = ({ badge, isDark, onClose }) => {
  const overlayRef = useRef(null);
  const tier = TIER_CONFIG[badge.tier] || TIER_CONFIG.bronze;

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  /* Close on overlay click */
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const earnedDate = badge.earnedAt
    ? new Date(badge.earnedAt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-xs rounded-2xl overflow-hidden animate-[popIn_0.3s_ease-out]"
        style={{
          background: isDark ? "#161B22" : "#FFFFFF",
          border: `1.5px solid ${isDark ? "#30363D" : "#E5E7EB"}`,
          boxShadow: `0 0 40px ${tier.glow}, 0 20px 60px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Top accent bar */}
        <div className="h-1" style={{ background: tier.gradient }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors z-10"
          style={{
            background: isDark ? "#21262D" : "#F3F4F6",
            color: isDark ? "#8B949E" : "#6B7280",
          }}
        >
          <FiX className="w-3 h-3" />
        </button>

        {/* Content */}
        <div className="px-5 pt-5 pb-4 text-center">
          {/* Floating particles (CSS-only sparkle) */}
          <div className="relative mx-auto w-20 h-20 mb-3">
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `radial-gradient(circle, ${tier.glow} 0%, transparent 70%)`,
                transform: "scale(1.5)",
              }}
            />
            {/* Badge circle */}
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: badge.earned
                  ? tier.gradient
                  : isDark ? "#21262D" : "#E5E7EB",
                boxShadow: badge.earned
                  ? `0 4px 20px ${tier.glow}`
                  : "none",
              }}
            >
              <span className="text-3xl leading-none drop-shadow-lg">
                {badge.icon}
              </span>
            </div>

            {/* Sparkle dots */}
            {badge.earned && (
              <>
                {tier.particles.map((color, i) => (
                  <span
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background: color,
                      top: `${10 + i * 20}%`,
                      left: i % 2 === 0 ? "-8px" : "calc(100% + 4px)",
                      animation: `sparkle ${1.5 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Tier label */}
          <span
            className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full mb-2"
            style={{
              background: `${tier.accent}20`,
              color: tier.accent,
            }}
          >
            {tier.label} Tier
          </span>

          {/* Badge name */}
          <h3
            className="text-base font-bold mb-1"
            style={{ color: isDark ? "#E6EDF3" : "#1F2937" }}
          >
            {badge.name}
          </h3>

          {/* Description */}
          <p
            className="text-[11px] leading-relaxed mb-3"
            style={{ color: isDark ? "#8B949E" : "#6B7280" }}
          >
            {badge.description}
          </p>

          {/* Milestone */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold"
            style={{
              background: isDark ? "#0D1117" : "#F6F8FA",
              border: `1px solid ${isDark ? "#21262D" : "#E5E7EB"}`,
              color: isDark ? "#C9D1D9" : "#374151",
            }}
          >
            🔥 {badge.milestone}-Day Streak Milestone
          </div>

          {/* Earned date */}
          {badge.earned && earnedDate && (
            <div className="flex items-center justify-center gap-1 mt-3">
              <FiCalendar
                className="w-3 h-3"
                style={{ color: isDark ? "#484F58" : "#9CA3AF" }}
              />
              <span
                className="text-[10px]"
                style={{ color: isDark ? "#484F58" : "#9CA3AF" }}
              >
                Earned on {earnedDate}
              </span>
            </div>
          )}

          {/* Locked message */}
          {!badge.earned && (
            <div className="mt-3">
              <p
                className="text-[10px] font-medium"
                style={{ color: isDark ? "#484F58" : "#9CA3AF" }}
              >
                🔒 Maintain a {badge.milestone}-day streak to unlock
              </p>
            </div>
          )}
        </div>

        {/* Bottom action */}
        <div
          className="px-5 py-3"
          style={{ borderTop: `1px solid ${isDark ? "#21262D" : "#EAEEF2"}` }}
        >
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              background: badge.earned ? tier.gradient : isDark ? "#21262D" : "#E5E7EB",
              color: badge.earned ? "#FFFFFF" : isDark ? "#8B949E" : "#6B7280",
              boxShadow: badge.earned ? `0 2px 10px ${tier.glow}` : "none",
            }}
          >
            {badge.earned ? "Awesome! 🎉" : "Keep Going! 💪"}
          </button>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default BadgePopup;
