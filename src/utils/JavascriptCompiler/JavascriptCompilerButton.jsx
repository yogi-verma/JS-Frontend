import React from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../utils/color";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";

const JavascriptCompilerButton = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const background = isDark ? colors.white : colors.blueDark;
  const textColor = isDark ? colors.textDark : colors.textLight;
  const subTextColor = isDark ? "#334155" : "#E2E8F0";

  return (
    <section className="px-4 sm:px-6 my-6 sm:my-8">
      <div
        className="mx-auto max-w-6xl rounded-2xl shadow-lg relative overflow-visible"
        style={{ 
          background,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
        }}
      >
        {/* New Badge */}
        <div 
          className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full shadow-lg animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            zIndex: 10
          }}
        >
          NEW
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: textColor }}
            >
              JavaScript Compiler — Test Your Code Instantly{" "}
            </h2>
            <p
              className="mt-2 text-sm sm:text-base font-normal"
              style={{ color: subTextColor }}
            >
              Write, run, and debug JavaScript code in real-time with our interactive online compiler
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/compiler")}
            className="inline-flex items-center hover:cursor-pointer justify-center rounded-xl px-5 py-3 text-sm sm:text-base font-bold transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
            style={{
              background: isDark
                ? `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`
                : colors.white,
              color: isDark ? '#FFFFFF' : colors.blueDark,
              boxShadow: isDark
                ? '0 4px 12px rgba(59, 130, 246, 0.3)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            Try Compiler
          </button>
        </div>
      </div>
    </section>
  );
};

export default JavascriptCompilerButton;
