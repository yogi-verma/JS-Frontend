import React from "react";
import colors from "../../utils/color";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { initializeGoogleLogin } from "../../utils/BackendCalls/authService";

const SpecialButton = () => {
  const { isDark } = useTheme();

  const background = isDark ? colors.white : colors.blueDark;
  const textColor = isDark ? colors.textDark : colors.textLight;
  const subTextColor = isDark ? "#334155" : "#E2E8F0";

  return (
    <section className="px-4 sm:px-6">
      <div
        className="mx-auto max-w-6xl rounded-2xl shadow-lg relative overflow-visible"
        style={{ background }}
      >
        {/* New Badge */}
        <div 
          className="absolute -top-3 -right-3 px-3 py-1 rounded-full shadow-lg animate-pulse"
          style={{
            background: isDark 
              ? 'linear-gradient(135deg, #059669, #047857)'
              : 'linear-gradient(135deg, #6ee7b7, #34d399)',
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
              className="text-lg sm:text-xl font-bold"
              style={{ color: textColor }}
            >
              Zero to Full-Stack Engineer — Complete Free Program{" "}
            </h2>
            <p
              className="mt-1 text-sm sm:text-base"
              style={{ color: subTextColor }}
            >
              Master JavaScript, React, Backend (From First Principles) & System Design — All in One Structured Program
            </p>
          </div>

          <button
            onClick={initializeGoogleLogin}
            className="inline-flex items-center hover:cursor-pointer justify-center rounded-lg px-5 py-2.5 text-sm sm:text-base font-semibold transition-transform duration-300 hover:scale-105"
            style={{
              background: isDark
                ? `linear-gradient(90deg, ${colors.blueLight}, ${colors.blueMid})`
                : colors.white,
              color: isDark ? colors.white : colors.blueDark,
            }}
          >
            Get started
          </button>
        </div>
      </div>
    </section>
  );
};

export default SpecialButton;
