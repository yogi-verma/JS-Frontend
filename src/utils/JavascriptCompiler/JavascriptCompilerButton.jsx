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
    <section className="px-4 sm:px-6 my-8 sm:my-6">
      <div
        className="mx-auto max-w-6xl rounded-2xl shadow-lg relative overflow-visible"
        style={{ background }}
      >
        {/* New Badge */}
        <div 
          className="absolute -top-3 -right-3 px-3 py-1 rounded-full shadow-lg animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            zIndex: 10
          }}
        >
          NEW
        </div>

        <div className="flex flex-col gap-4 px-6 py-3 sm:px-8 sm:py-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2
              className="text-xl sm:text-2xl font-bold"
              style={{ color: textColor }}
            >
              JavaScript Compiler — Test Your Code Instantly{" "}
            </h2>
            <p
              className="mt-1 text-sm sm:text-base"
              style={{ color: subTextColor }}
            >
              Write, run, and debug JavaScript code in real-time with our interactive online compiler
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/compiler")}
            className="inline-flex items-center hover:cursor-pointer justify-center rounded-lg px-5 py-2.5 text-sm sm:text-base font-semibold transition-transform duration-300 hover:scale-105"
            style={{
              background: isDark
                ? `linear-gradient(90deg, ${colors.blueLight}, ${colors.blueMid})`
                : colors.white,
              color: isDark ? colors.white : colors.blueDark,
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
