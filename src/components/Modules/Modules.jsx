import { useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { useUser } from "../../utils/UserContext/UserContext";
import SkeletonLoader from "../../utils/SkeletonLoader/SkeletonLoader";
import colors from "../../utils/color";

const difficultyMap = {
    beginner:     { label: "Beginner",     dot: "#10B981" },
    intermediate: { label: "Intermediate", dot: "#F59E0B" },
    advanced:     { label: "Advanced",     dot: "#EF4444" },
};

const Modules = () => {
    const { modules, modulesLoading: loading, modulesError: error } = useUser();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    /* ── shared style tokens ── */
    const surface   = isDark ? "#111827" : "#FFFFFF";
    const surfaceHover = isDark ? "#1F2937" : "#F9FAFB";
    const border    = isDark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)";
    const borderHov = isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.14)";
    const textPrimary   = isDark ? "#F3F4F6" : "#111827";
    const textSecondary = isDark ? "#9CA3AF" : "#6B7280";
    const textTertiary  = isDark ? "#6B7280" : "#9CA3AF";

    if (loading) return <SkeletonLoader variant="modules" />;

    if (error) {
        return (
            <div className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="rounded-xl p-5"
                        style={{
                            background: isDark ? "#1C1917" : "#FEF2F2",
                            border: `1px solid ${isDark ? "#7F1D1D" : "#FECACA"}`,
                        }}
                    >
                        <p className="text-sm font-medium" style={{ color: isDark ? "#FCA5A5" : "#DC2626" }}>
                            Failed to load modules
                        </p>
                        <p className="text-xs mt-1" style={{ color: textSecondary }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${colors.blueTextGradient}`}>
                        Modules
                    </h2>
                    <p className="text-sm mt-1" style={{ color: textSecondary }}>
                        Choose a learning path to get started.
                    </p>
                </div>

                {/* Empty state */}
                {modules.length === 0 ? (
                    <div
                        className="rounded-xl py-14 text-center"
                        style={{ background: surfaceHover, border: `1px solid ${border}` }}
                    >
                        <p className="text-sm" style={{ color: textSecondary }}>No modules available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.map((module, index) => {
                            const diff = difficultyMap[module.difficulty] || difficultyMap.beginner;

                            return (
                                <div
                                    key={module._id || index}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => navigate(`/lessons/module/${module._id}`)}
                                    onKeyDown={(e) => e.key === "Enter" && navigate(`/lessons/module/${module._id}`)}
                                    className="group relative flex flex-col rounded-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                    style={{
                                        background: surface,
                                        border: `1px solid ${border}`,
                                        transition: "border-color .2s, box-shadow .2s, transform .2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = borderHov;
                                        e.currentTarget.style.boxShadow = isDark
                                            ? "0 4px 24px rgba(0,0,0,.35)"
                                            : "0 4px 24px rgba(0,0,0,.07)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = border;
                                        e.currentTarget.style.boxShadow = "none";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <div className="p-4 flex flex-col flex-1">
                                        {/* Top row: number + difficulty */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span
                                                className="text-[11px] font-semibold tracking-wide uppercase"
                                                style={{ color: textTertiary }}
                                            >
                                                Module {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ backgroundColor: diff.dot }}
                                                />
                                                <span
                                                    className="text-[11px] font-medium capitalize"
                                                    style={{ color: textTertiary }}
                                                >
                                                    {diff.label}
                                                </span>
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="text-[15px] font-semibold leading-snug mb-1.5"
                                            style={{ color: textPrimary }}
                                        >
                                            {module.title || module.name || `Untitled Module`}
                                        </h3>

                                        {/* Description */}
                                        <p
                                            className="text-[13px] leading-relaxed line-clamp-2 mb-3"
                                            style={{ color: textSecondary }}
                                        >
                                            {module.description || "No description available."}
                                        </p>

                                        {/* Tags */}
                                        {module.tags && module.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {module.tags.slice(0, 3).map((tag, ti) => (
                                                    <span
                                                        key={ti}
                                                        className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                                                        style={{
                                                            background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)",
                                                            color: textSecondary,
                                                        }}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {module.tags.length > 3 && (
                                                    <span
                                                        className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                                                        style={{
                                                            background: isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)",
                                                            color: textTertiary,
                                                        }}
                                                    >
                                                        +{module.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Spacer */}
                                        <div className="flex-1" />

                                        {/* Footer */}
                                        <div
                                            className="flex items-center justify-between pt-3 mt-1"
                                            style={{ borderTop: `1px solid ${border}` }}
                                        >
                                            <span className="text-[12px] font-medium" style={{ color: textTertiary }}>
                                                {module.estimatedDuration ? `${module.estimatedDuration} hrs` : "Self-paced"}
                                            </span>

                                            <span
                                                className="inline-flex items-center gap-1 text-[12px] font-semibold transition-all duration-200"
                                                style={{ color: isDark ? "#60A5FA" : "#2563EB" }}
                                            >
                                                Start
                                                <svg
                                                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2.2}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6-6m6 6l-6 6" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modules;