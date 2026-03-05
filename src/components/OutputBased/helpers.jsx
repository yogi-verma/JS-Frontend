import React from "react";

/* ─────────────── Shared rendering components ─────────────── */

export const CodeBlock = ({ code, isDark }) => (
  <pre
    className={`text-[11px] sm:text-[12px] mt-1.5 mb-0.5 px-2.5 py-2 rounded-md overflow-x-auto font-mono leading-[1.6] border whitespace-pre-wrap ${
      isDark
        ? "bg-[#0d1117] text-[#7ee787] border-gray-700/40"
        : "bg-[#1e1e1e] text-[#9cdcfe] border-gray-300/60"
    }`}
  >
    {code}
  </pre>
);

export const RenderMarkdown = ({ text, isDark }) => {
  if (!text) return null;
  const parts = text.split(/(```[\w]*\n?[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const code = part.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
          return <CodeBlock key={i} code={code} isDark={isDark} />;
        }
        const inline = part.split(/(`[^`]+`)/g);
        return (
          <span key={i}>
            {inline.map((ip, j) =>
              ip.startsWith("`") ? (
                <code
                  key={j}
                  className={`px-1 py-px rounded text-[10.5px] font-mono ${
                    isDark
                      ? "bg-gray-700/70 text-orange-300"
                      : "bg-orange-50 text-orange-700 border border-orange-200/60"
                  }`}
                >
                  {ip.slice(1, -1)}
                </code>
              ) : (
                ip
              )
            )}
          </span>
        );
      })}
    </>
  );
};
