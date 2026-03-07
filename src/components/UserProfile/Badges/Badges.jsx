import { useState, useEffect } from "react";
import { FiAward, FiLock, FiZap, FiTarget } from "react-icons/fi";
import { getUserBadges } from "../../../utils/BackendCalls/authService";
import BadgePopup from "./BadgePopup";

/* ─── Tier accent colors ─── */
const TIER_COLORS = {
  bronze:   { bg: "#CD7F32", glow: "#CD7F3240", ring: "#CD7F3260", text: "#CD7F32" },
  silver:   { bg: "#C0C0C0", glow: "#C0C0C040", ring: "#C0C0C060", text: "#A8A8A8" },
  gold:     { bg: "#FFD700", glow: "#FFD70040", ring: "#FFD70060", text: "#DAA520" },
  platinum: { bg: "#E5E4E2", glow: "#B0AEAB40", ring: "#B0AEAB60", text: "#8B8986" },
};

/* ─── Single badge card ─── */
const BadgeCard = ({ badge, isDark, onClick }) => {
  const tier = TIER_COLORS[badge.tier] || TIER_COLORS.bronze;
  const earned = badge.earned;

  return (
    <button
      onClick={() => onClick(badge)}
      className="group relative flex flex-col items-center text-center rounded-xl p-3 transition-all duration-200 cursor-pointer hover:scale-[1.03]"
      style={{
        background: earned
          ? isDark ? "#161B22" : "#FFFFFF"
          : isDark ? "#0D1117" : "#F6F8FA",
        border: `1.5px solid ${
          earned ? tier.ring : isDark ? "#21262D" : "#E5E7EB"
        }`,
        opacity: earned ? 1 : 0.75,
        boxShadow: earned ? `0 0 16px ${tier.glow}` : "none",
      }}
    >
      {/* Glow ring */}
      {earned && (
        <div
          className="absolute -inset-px rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${tier.bg}10, transparent 60%)`,
          }}
        />
      )}

      {/* Icon */}
      <div
        className="relative w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110"
        style={{
          background: earned
            ? `linear-gradient(135deg, ${tier.bg}30, ${tier.bg}10)`
            : isDark ? "#161B22" : "#E5E7EB",
          border: `2px solid ${earned ? tier.bg : isDark ? "#30363D" : "#D1D5DB"}`,
        }}
      >
        {earned ? (
          <span className="text-xl leading-none">{badge.icon}</span>
        ) : (
          <FiLock
            className="w-4 h-4"
            style={{ color: isDark ? "#484F58" : "#9CA3AF" }}
          />
        )}
      </div>

      {/* Name */}
      <p
        className="text-[11px] font-semibold leading-tight"
        style={{
          color: earned
            ? tier.text
            : isDark ? "#8B949E" : "#6B7280",
        }}
      >
        {badge.name}
      </p>

      {/* Milestone tag */}
      <span
        className="mt-1 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{
          background: earned ? `${tier.bg}20` : isDark ? "#21262D" : "#E5E7EB",
          color: earned ? tier.text : isDark ? "#8B949E" : "#6B7280",
        }}
      >
        {badge.milestone} days
      </span>

      {/* Earned date */}
      {earned && badge.earnedAt && (
        <p
          className="mt-1 text-[8px]"
          style={{ color: isDark ? "#484F58" : "#9CA3AF" }}
        >
          {new Date(badge.earnedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      )}
    </button>
  );
};

/* ─── Motivational banner when no badges earned ─── */
const NoBadgesBanner = ({ isDark, nextMilestone }) => (
  <div
    className="rounded-xl p-4 mb-4 flex items-start gap-3"
    style={{
      background: isDark
        ? "linear-gradient(135deg, #1A1F2B 0%, #161B22 100%)"
        : "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
      border: `1px solid ${isDark ? "#30363D" : "#FDE68A"}`,
    }}
  >
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
      style={{
        background: isDark ? "#F59E0B18" : "#F59E0B15",
        border: `1.5px solid ${isDark ? "#F59E0B40" : "#F59E0B30"}`,
      }}
    >
      <FiTarget className="w-5 h-5" style={{ color: "#F59E0B" }} />
    </div>
    <div className="min-w-0">
      <h4
        className="text-sm font-bold mb-0.5"
        style={{ color: isDark ? "#E6EDF3" : "#1F2937" }}
      >
        Start your badge journey! 🚀
      </h4>
      <p
        className="text-[11px] leading-relaxed"
        style={{ color: isDark ? "#8B949E" : "#6B7280" }}
      >
        Solve a coding question every day to build your streak.
        {nextMilestone && (
          <span style={{ color: "#F59E0B", fontWeight: 600 }}>
            {" "}Reach a {nextMilestone}-day streak to earn your first badge!
          </span>
        )}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <FiZap className="w-3 h-3" style={{ color: "#F59E0B" }} />
        <span
          className="text-[10px] font-medium"
          style={{ color: isDark ? "#8B949E" : "#6B7280" }}
        >
          Tip: Consistency is key — even 1 problem a day counts!
        </span>
      </div>
    </div>
  </div>
);

/* ─── Main Badges component ─── */
const Badges = ({ isDark }) => {
  const [badges, setBadges] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await getUserBadges();
        if (res?.success && res.data) {
          setBadges(res.data.badges || []);
          setTotalEarned(res.data.totalEarned || 0);
          setTotalAvailable(res.data.totalAvailable || 0);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div
          className="w-5 h-5 border-2 rounded-full animate-spin"
          style={{
            borderColor: isDark ? "#30363D" : "#D0D7DE",
            borderTopColor: isDark ? "#58A6FF" : "#2563EB",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Motivational banner when no badges earned yet */}
      {totalEarned === 0 && badges.length > 0 && (
        <NoBadgesBanner
          isDark={isDark}
          nextMilestone={badges.find(b => !b.earned)?.milestone}
        />
      )}

      {/* Summary header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiAward
            className="w-4 h-4"
            style={{ color: isDark ? "#F59E0B" : "#D97706" }}
          />
          <span
            className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {totalEarned} of {totalAvailable} badges earned
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-24 h-1.5 rounded-full overflow-hidden"
          style={{ background: isDark ? "#21262D" : "#E5E7EB" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${totalAvailable > 0 ? (totalEarned / totalAvailable) * 100 : 0}%`,
              background: "linear-gradient(90deg, #F59E0B, #EF4444)",
            }}
          />
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {badges.map((badge) => (
          <BadgeCard
            key={badge.badgeId}
            badge={badge}
            isDark={isDark}
            onClick={setSelectedBadge}
          />
        ))}
      </div>

      {/* No badges fallback */}
      {badges.length === 0 && (
        <div className="text-center py-8">
          <FiAward
            className="w-8 h-8 mx-auto mb-2"
            style={{ color: isDark ? "#30363D" : "#D0D7DE" }}
          />
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            No badges available yet. Keep coding!
          </p>
        </div>
      )}

      {/* Popup on click */}
      {selectedBadge && (
        <BadgePopup
          badge={selectedBadge}
          isDark={isDark}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
};

export default Badges;
