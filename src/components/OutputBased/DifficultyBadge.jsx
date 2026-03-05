import React from "react";

const DifficultyBadge = ({ difficulty, isDark }) => {
  const config = {
    Easy: {
      dot: "bg-emerald-500",
      text: isDark ? "text-emerald-400" : "text-emerald-600",
    },
    Medium: {
      dot: "bg-amber-500",
      text: isDark ? "text-amber-400" : "text-amber-600",
    },
    Hard: {
      dot: "bg-red-500",
      text: isDark ? "text-red-400" : "text-red-600",
    },
  };
  const c = config[difficulty] || config.Medium;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;
