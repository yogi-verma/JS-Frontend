import React from "react";

const CategoryBadge = ({ category, isDark }) => {
  const isJS = category === "javascript";
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-px rounded text-[10px] font-semibold ${
        isJS
          ? isDark
            ? "bg-yellow-500/10 text-yellow-400"
            : "bg-yellow-50 text-yellow-700"
          : isDark
          ? "bg-cyan-500/10 text-cyan-400"
          : "bg-cyan-50 text-cyan-700"
      }`}
    >
      {isJS ? "JS" : "React"}
    </span>
  );
};

export default CategoryBadge;
