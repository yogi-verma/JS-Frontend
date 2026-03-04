import { useTheme } from "../WhiteDarkMode/useTheme";

/**
 * Centralized Skeleton Loader component with layout-specific variants.
 *
 * Usage:
 *   <SkeletonLoader variant="dashboard" />
 *
 * Variants:
 *   auth            – simple centred pulse (ProtectedRoute)
 *   dashboard       – header + section + module cards
 *   modules         – "Available Modules" header + 3-col card grid
 *   lessons         – hero header with JS icon + stats + 3-col lesson cards
 *   lesson-detail   – sidebar + content viewer
 *   questions-list  – hero + search/filter + accordion rows  (InterviewQuestions)
 *   coding-table    – hero + search/filter + table rows      (MachineCoding)
 *   coding-workspace– IDE top-bar + split panes             (CodingWorkspace)
 *   frontend-bundle – hero + category dropdown + accordion   (FrontendQuestionBundle)
 */

/* ─── reusable primitives ─── */
const Block = ({ className = "" }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`animate-pulse rounded ${isDark ? "bg-gray-700" : "bg-gray-200"} ${className}`}
    />
  );
};

const Circle = ({ className = "" }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`animate-pulse rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"} ${className}`}
    />
  );
};

/* ─── variant skeletons ─── */

/* Auth — simple centred pulse for ProtectedRoute */
const AuthSkeleton = ({ isDark }) => (
  <div className={`h-screen flex flex-col justify-center items-center gap-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
    <Circle className="w-14 h-14" />
    <Block className="h-4 w-48" />
    <Block className="h-3 w-32" />
  </div>
);

/* Dashboard — header + section hero + module cards */
const DashboardSkeleton = ({ isDark }) => (
  <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
    {/* Header skeleton */}
    <div className={`h-16 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Block className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Block className="h-8 w-20 rounded-lg" />
          <Circle className="w-8 h-8" />
        </div>
      </div>
    </div>

    {/* Section hero skeleton */}
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <Block className="h-8 w-72 mx-auto mb-3" />
        <Block className="h-4 w-96 max-w-full mx-auto" />
      </div>

      {/* Feature buttons skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`rounded-xl p-5 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <Circle className="w-10 h-10 mb-3" />
            <Block className="h-5 w-3/4 mb-2" />
            <Block className="h-3 w-full" />
            <Block className="h-3 w-2/3 mt-1" />
          </div>
        ))}
      </div>

      {/* Module cards skeleton */}
      <div className="text-center mb-5">
        <Block className="h-7 w-52 mx-auto mb-2" />
        <Block className="h-3 w-64 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`rounded-lg p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <Block className="h-5 w-3/4 mb-3" />
            <Block className="h-3 w-full mb-1" />
            <Block className="h-3 w-5/6 mb-4" />
            <div className="flex gap-1.5 mb-4">
              {[1, 2, 3].map(j => <Block key={j} className="h-5 w-14 rounded" />)}
            </div>
            <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <Block className="h-5 w-20 rounded" />
              <Block className="h-5 w-5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* Modules — section title + 3-col card grid */
const ModulesSkeleton = ({ isDark }) => (
  <div className={`py-6 px-4 sm:px-6 lg:px-8 ${isDark ? "bg-gray-900" : "bg-white"}`}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-5">
        <Block className="h-8 w-52 mx-auto mb-2" />
        <Block className="h-4 w-64 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className={`rounded-lg border p-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <Block className="h-5 w-3/4 mb-3" />
            <Block className="h-3 w-full mb-1" />
            <Block className="h-3 w-5/6 mb-4" />
            <div className="flex gap-1.5 mb-4">
              {[1, 2, 3].map(j => <Block key={j} className="h-5 w-14 rounded" />)}
            </div>
            <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <Block className="h-5 w-20 rounded" />
                <Block className="h-3 w-16" />
              </div>
              <Block className="h-5 w-5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* Lessons — header + back + hero JS icon + stats pills + 3-col lesson cards */
const LessonsSkeleton = ({ isDark }) => (
  <div className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
    {/* Header */}
    <div className={`h-16 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Block className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Block className="h-8 w-20 rounded-lg" />
          <Circle className="w-8 h-8" />
        </div>
      </div>
    </div>

    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Block className="h-8 w-36 rounded-lg mb-6" />

        {/* Hero */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Block className="shrink-0 w-14 h-14 rounded-2xl" />
            <div>
              <Block className="h-8 w-56 mb-2" />
              <Block className="h-4 w-80 max-w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3].map(i => <Block key={i} className="h-8 w-24 rounded-full" />)}
          </div>
        </div>

        {/* Lesson cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`rounded-2xl border overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
              <div className={`h-1 w-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <Block className="w-9 h-9 rounded-xl" />
                  <Block className="h-6 w-20 rounded-full" />
                </div>
                <Block className="h-5 w-3/4 mb-2" />
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[1, 2, 3].map(j => <Block key={j} className="h-5 w-16 rounded-md" />)}
                </div>
                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                  <div className="flex items-center gap-3">
                    <Block className="h-3 w-16" />
                    <Block className="h-3 w-20" />
                  </div>
                  <Block className="w-8 h-8 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* Lesson Detail — sidebar + content area */
const LessonDetailSkeleton = ({ isDark }) => (
  <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-white"}`}>
    {/* Header */}
    <div className={`h-16 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Block className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Block className="h-8 w-20 rounded-lg" />
          <Circle className="w-8 h-8" />
        </div>
      </div>
    </div>

    <div className="flex">
      {/* Sidebar */}
      <div className={`hidden lg:block w-72 h-[calc(100vh-64px)] border-r p-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
        <Block className="h-6 w-3/4 mb-3" />
        <div className="flex items-center justify-between mb-3">
          <Block className="h-6 w-16 rounded-lg" />
          <Block className="h-5 w-20 rounded" />
        </div>
        <Block className={`h-px w-full mb-4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <Block className="h-3 w-20 mb-3" />
        <div className="space-y-1">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className={`flex items-start gap-2 px-3 py-2.5 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-100/50"}`}>
              <Circle className="w-5 h-5 shrink-0 mt-0.5" />
              <Block className="h-3 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">
          <Block className="h-6 w-2/3 mb-1" />
          <Block className="h-3 w-32 mb-6" />
          {/* Content lines */}
          <div className="space-y-3">
            <Block className="h-4 w-40 mb-4" />
            <Block className="h-3 w-full" />
            <Block className="h-3 w-full" />
            <Block className="h-3 w-5/6" />
            <Block className="h-3 w-full" />
            <Block className="h-3 w-3/4" />
            {/* Code block placeholder */}
            <div className={`rounded-lg p-4 my-4 ${isDark ? "bg-gray-800" : "bg-gray-900"}`}>
              <Block className="h-3 w-3/4 mb-2 bg-gray-600" />
              <Block className="h-3 w-full mb-2 bg-gray-600" />
              <Block className="h-3 w-5/6 mb-2 bg-gray-600" />
              <Block className="h-3 w-1/2 bg-gray-600" />
            </div>
            <Block className="h-3 w-full" />
            <Block className="h-3 w-full" />
            <Block className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* Hero + pills helper used by several variants */
const HeroSkeleton = ({ isDark, pillCount = 4 }) => (
  <div className={`border-b ${isDark ? "bg-gray-800/50 border-gray-800" : "bg-white border-gray-200"}`}>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Block className="w-9 h-9 rounded-lg" />
            <Block className="h-7 w-64" />
          </div>
          <Block className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {Array.from({ length: pillCount }, (_, i) => (
            <Block key={i} className="h-8 w-14 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* Questions List — hero + search/filter + accordion rows (InterviewQuestions) */
const QuestionsListSkeleton = ({ isDark }) => (
  <div className={`min-h-screen flex flex-col ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
    {/* Header */}
    <div className={`h-16 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Block className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Block className="h-8 w-20 rounded-lg" />
          <Circle className="w-8 h-8" />
        </div>
      </div>
    </div>

    <main className="grow">
      <HeroSkeleton isDark={isDark} pillCount={4} />

      {/* Search & Filter */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-5 flex flex-col sm:flex-row gap-3 mb-5">
          <Block className="flex-1 h-10 rounded-lg" />
          <Block className="h-10 w-56 rounded-lg" />
        </div>
      </div>

      {/* Accordion rows */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 ${isDark ? "bg-gray-800/60 border-gray-800" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Block className="h-6 w-8 shrink-0 rounded" />
                  <Block className="h-4 flex-1" style={{ maxWidth: `${55 + Math.random() * 35}%` }} />
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Block className="h-5 w-14 rounded-full" />
                  <Circle className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

/* Coding Table — hero + search/filter + table (MachineCoding) */
const CodingTableSkeleton = ({ isDark }) => (
  <div className={`min-h-screen flex flex-col ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
    {/* Header */}
    <div className={`h-16 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Block className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Block className="h-8 w-20 rounded-lg" />
          <Circle className="w-8 h-8" />
        </div>
      </div>
    </div>

    <main className="grow">
      <HeroSkeleton isDark={isDark} pillCount={4} />

      {/* Search & Filter */}
      <div className={`border-b ${isDark ? "bg-gray-800/50 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row gap-3">
            <Block className="flex-1 h-10 rounded-lg" />
            <Block className="h-10 w-56 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Table Header */}
        <div className={`hidden sm:grid grid-cols-[40px_1fr_100px_90px_70px] gap-3 px-4 py-2.5 rounded-t-lg ${isDark ? "bg-gray-800/80" : "bg-gray-100"}`}>
          {[24, 48, 64, 56, 40].map((w, i) => (
            <Block key={i} className="h-3" style={{ width: `${w}px` }} />
          ))}
        </div>
        {/* Rows */}
        <div className={`rounded-b-lg overflow-hidden border ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          {Array.from({ length: 10 }, (_, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 sm:grid-cols-[40px_1fr_100px_90px_70px] gap-2 sm:gap-3 px-4 py-3.5 sm:py-3 items-center border-b last:border-b-0 ${
                isDark
                  ? `${idx % 2 === 0 ? "bg-gray-800/40" : "bg-gray-800/20"} border-gray-800/60`
                  : `${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-gray-100`
              }`}
            >
              <Block className="hidden sm:block h-4 w-6" />
              <Block className="h-4" style={{ width: `${50 + Math.random() * 40}%` }} />
              <Block className="hidden sm:block h-3 w-16" />
              <Block className="hidden sm:block h-5 w-14" />
              <div className="hidden sm:flex justify-center">
                <Circle className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

/* Coding Workspace — IDE-like layout */
const CodingWorkspaceSkeleton = ({ isDark }) => (
  <div className={`h-screen flex flex-col ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
    {/* Top bar */}
    <div className={`shrink-0 flex items-center justify-between px-3 sm:px-4 py-2 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="flex items-center gap-2">
        <Block className="h-7 w-7 rounded-lg" />
        <Block className="h-7 w-7 rounded-lg" />
        <Block className={`hidden sm:block w-px h-5 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <Block className="hidden sm:block h-6 w-6 rounded-lg" />
        <Block className="hidden sm:block h-6 w-6 rounded-lg" />
      </div>
      <div className="flex items-center gap-1.5">
        <Block className="h-5 w-40 rounded" />
        <Block className="h-5 w-14 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Block className="h-8 w-16 rounded-lg" />
        <Block className="h-8 w-20 rounded-lg" />
      </div>
    </div>

    {/* Split panels */}
    <div className="flex-1 flex overflow-hidden">
      {/* Left panel – question description */}
      <div className={`w-1/2 border-r overflow-hidden ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
        {/* Tabs */}
        <div className={`flex items-center gap-1 px-3 py-2 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <Block className="h-7 w-24 rounded" />
          <Block className="h-7 w-20 rounded" />
          <Block className="h-7 w-24 rounded" />
        </div>
        <div className="p-5 space-y-3">
          <Block className="h-6 w-3/4 mb-1" />
          <Block className="h-5 w-16 rounded-full" />
          <Block className="h-3 w-full mt-4" />
          <Block className="h-3 w-full" />
          <Block className="h-3 w-5/6" />
          <Block className="h-3 w-full" />
          <Block className="h-3 w-2/3" />
          {/* Example boxes */}
          <div className={`rounded-lg p-3 mt-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <Block className="h-3 w-20 mb-2" />
            <Block className="h-3 w-full" />
            <Block className="h-3 w-3/4" />
          </div>
          <div className={`rounded-lg p-3 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <Block className="h-3 w-20 mb-2" />
            <Block className="h-3 w-full" />
            <Block className="h-3 w-1/2" />
          </div>
        </div>
      </div>

      {/* Right panel – code editor */}
      <div className={`w-1/2 flex flex-col ${isDark ? "bg-[#1e1e2e]" : "bg-gray-50"}`}>
        {/* Editor toolbar */}
        <div className={`flex items-center justify-between px-3 py-2 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <Block className="h-4 w-20" />
          <div className="flex gap-2">
            <Block className="h-6 w-6 rounded" />
            <Block className="h-6 w-6 rounded" />
          </div>
        </div>
        {/* Code lines */}
        <div className="flex-1 p-4 space-y-2">
          {Array.from({ length: 18 }, (_, i) => (
            <div key={i} className="flex gap-3">
              <Block className="h-3 w-6 shrink-0 opacity-40" />
              <Block className="h-3" style={{ width: `${20 + Math.random() * 60}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* Frontend Bundle — hero + category dropdown + accordion rows */
const FrontendBundleSkeleton = ({ isDark }) => (
  <div className={`min-h-screen flex flex-col ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
    {/* Header */}
    <div className={`h-16 border-b ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Block className="h-7 w-32" />
        <div className="flex items-center gap-3">
          <Block className="h-8 w-20 rounded-lg" />
          <Circle className="w-8 h-8" />
        </div>
      </div>
    </div>

    <main className="grow">
      {/* Hero */}
      <div className={`border-b ${isDark ? "bg-gray-800/50 border-gray-800" : "bg-white border-gray-200"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Block className="w-9 h-9 rounded-lg" />
                <Block className="h-7 w-64" />
              </div>
              <Block className="h-4 w-96 max-w-full" />
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Block className="h-8 w-20 rounded-full" />
              <Block className="h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Category dropdown + search */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <Block className="h-10 w-64 rounded-lg" />
          <Block className="flex-1 h-10 rounded-lg" />
        </div>

        {/* Accordion rows */}
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, idx) => (
            <div
              key={idx}
              className={`rounded-lg border p-4 ${isDark ? "bg-gray-800/60 border-gray-800" : "bg-white border-gray-200"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Block className="h-6 w-8 shrink-0 rounded" />
                  <Block className="h-4 flex-1" style={{ maxWidth: `${55 + Math.random() * 35}%` }} />
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Circle className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

/* ─── Map variants ─── */
const VARIANTS = {
  auth: AuthSkeleton,
  dashboard: DashboardSkeleton,
  modules: ModulesSkeleton,
  lessons: LessonsSkeleton,
  "lesson-detail": LessonDetailSkeleton,
  "questions-list": QuestionsListSkeleton,
  "coding-table": CodingTableSkeleton,
  "coding-workspace": CodingWorkspaceSkeleton,
  "frontend-bundle": FrontendBundleSkeleton,
};

const SkeletonLoader = ({ variant = "auth" }) => {
  const { isDark } = useTheme();
  const Skeleton = VARIANTS[variant] || VARIANTS.auth;
  return <Skeleton isDark={isDark} />;
};

export default SkeletonLoader;
