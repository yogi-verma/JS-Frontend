import React from "react";
import { RenderMarkdown } from "./helpers";

const OptionButton = ({
  index,
  text,
  selected,
  correct,
  revealed,
  onSelect,
  isDark,
}) => {
  const letter = ["A", "B", "C", "D"][index];
  const isCorrect = revealed && index === correct;
  const isWrong = revealed && selected === index && index !== correct;
  const isSelected = selected === index && !revealed;

  /* ── dynamic styles ── */
  let wrapCls, radioCls, textCls;

  if (isCorrect) {
    wrapCls = isDark
      ? "border-emerald-500/50 bg-emerald-500/8"
      : "border-emerald-400 bg-emerald-50/80";
    radioCls = "border-emerald-500 bg-emerald-500";
    textCls = isDark ? "text-emerald-300" : "text-emerald-800";
  } else if (isWrong) {
    wrapCls = isDark
      ? "border-red-500/50 bg-red-500/8"
      : "border-red-400 bg-red-50/80";
    radioCls = "border-red-500 bg-red-500";
    textCls = isDark ? "text-red-300" : "text-red-800";
  } else if (isSelected) {
    wrapCls = isDark
      ? "border-violet-500/60 bg-violet-500/8"
      : "border-violet-500 bg-violet-50/60";
    radioCls = "border-violet-500 bg-violet-500";
    textCls = isDark ? "text-gray-100" : "text-gray-900";
  } else {
    wrapCls = isDark
      ? "border-gray-700/50 hover:border-gray-600 hover:bg-gray-700/20"
      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    radioCls = isDark
      ? "border-gray-600 group-hover:border-gray-500"
      : "border-gray-300 group-hover:border-gray-400";
    textCls = isDark ? "text-gray-300" : "text-gray-700";
  }

  return (
    <button
      onClick={() => !revealed && onSelect(index)}
      disabled={revealed}
      className={`output-q-option group w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-all duration-150 ${wrapCls} ${
        revealed ? "cursor-default" : "cursor-pointer active:scale-[0.995]"
      }`}
    >
      {/* Radio indicator */}
      <span
        className={`shrink-0 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${radioCls}`}
      >
        {(isSelected || isCorrect || isWrong) && (
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
        )}
      </span>

      {/* Letter */}
      <span
        className={`shrink-0 text-[10px] font-bold w-4 ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {letter}.
      </span>

      {/* Option text */}
      <span className={`text-[12px] sm:text-[13px] leading-snug font-medium flex-1 ${textCls}`}>
        <RenderMarkdown text={text} isDark={isDark} />
      </span>

      {/* Result icon */}
      {isCorrect && (
        <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
      )}
      {isWrong && (
        <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default OptionButton;
