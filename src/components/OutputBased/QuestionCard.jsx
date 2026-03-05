import React, { useState } from "react";
import { CodeBlock, RenderMarkdown } from "./helpers";
import { extractCode, extractTitle } from "./utils";
import DifficultyBadge from "./DifficultyBadge";
import CategoryBadge from "./CategoryBadge";
import OptionButton from "./OptionButton";

const QuestionCard = ({ question, index, isDark }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [codeExpanded, setCodeExpanded] = useState(true);

  const handleSelect = (optionIndex) => {
    if (revealed) return;
    setSelected(optionIndex);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  const isCorrect = revealed && selected === question.correctIndex;
  const title = extractTitle(question.question);
  const code = extractCode(question.question);

  return (
    <div
      className={`output-q-card rounded-xl border transition-all duration-200 ${
        isDark
          ? "bg-gray-800/50 border-gray-700/40 hover:border-gray-600/50"
          : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
      }`}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* ── Header row: number + title + badges ── */}
      <div className="px-3.5 sm:px-4 pt-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <span
              className={`shrink-0 mt-0.5 text-[11px] font-bold tabular-nums ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              #{index + 1}
            </span>
            <h3
              className={`text-[13px] sm:text-[13.5px] font-semibold leading-snug ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <CategoryBadge category={question.category} isDark={isDark} />
            <DifficultyBadge difficulty={question.difficulty} isDark={isDark} />
          </div>
        </div>

        {/* ── Collapsible code block ── */}
        {code && (
          <div className="mt-1.5">
            <button
              onClick={() => setCodeExpanded(!codeExpanded)}
              className={`inline-flex items-center gap-1 text-[10px] font-semibold mb-1 transition-colors ${
                isDark
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
                  codeExpanded ? "rotate-90" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
              Code
            </button>
            {codeExpanded && <CodeBlock code={code} isDark={isDark} />}
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div
        className={`mx-3.5 sm:mx-4 border-t ${
          isDark ? "border-gray-700/30" : "border-gray-100"
        }`}
      />

      {/* ── Options ── */}
      <div className="px-3.5 sm:px-4 py-2 space-y-1.5">
        {question.options.map((option, i) => (
          <OptionButton
            key={i}
            index={i}
            text={option}
            selected={selected}
            correct={question.correctIndex}
            revealed={revealed}
            onSelect={handleSelect}
            isDark={isDark}
          />
        ))}
      </div>

      {/* ── Action bar ── */}
      <div className="px-3.5 sm:px-4 pb-3 pt-1 flex items-center gap-2">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={selected === null}
            className={`flex-1 py-2 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all duration-150 ${
              selected !== null
                ? "bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]"
                : isDark
                ? "bg-gray-700/40 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {selected !== null ? "Check Answer" : "Pick an option"}
          </button>
        ) : (
          <>
            {/* Result banner */}
            <div
              className={`flex-1 rounded-lg px-3 py-2 border ${
                isCorrect
                  ? isDark
                    ? "bg-emerald-500/8 border-emerald-700/25"
                    : "bg-emerald-50 border-emerald-200/70"
                  : isDark
                  ? "bg-red-500/8 border-red-700/25"
                  : "bg-red-50 border-red-200/70"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {isCorrect ? (
                  <span
                    className={`text-[12px] font-bold ${
                      isDark ? "text-emerald-400" : "text-emerald-700"
                    }`}
                  >
                    Correct!
                  </span>
                ) : (
                  <span
                    className={`text-[12px] font-bold ${
                      isDark ? "text-red-400" : "text-red-700"
                    }`}
                  >
                    Incorrect
                  </span>
                )}
              </div>
              <p
                className={`text-[11.5px] sm:text-[12px] leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <RenderMarkdown text={question.explanation} isDark={isDark} />
              </p>
            </div>
            {/* Retry */}
            <button
              onClick={handleReset}
              title="Try again"
              className={`shrink-0 p-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-500 hover:text-gray-300 hover:bg-gray-700/40"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
