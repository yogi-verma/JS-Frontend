import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../utils/color";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";

const JavascriptInterviewQuestionsButton = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set launch date to 7 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
        {/* Coming Soon Badge */}
        <div 
          className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full shadow-lg animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`,
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.05em',
            zIndex: 10
          }}
        >
          COMING SOON
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-grow">
            <h2
              className="text-xl sm:text-2xl font-bold tracking-tight"
              style={{ color: textColor }}
            >
              JavaScript Interview Questions — Ace Your Next Interview
            </h2>
            <p
              className="mt-2 text-sm sm:text-base font-normal"
              style={{ color: subTextColor }}
            >
              Master 200+ interview questions with detailed explanations and live coding challenges
            </p>
            
            {/* Countdown Timer */}
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold tracking-wide" style={{ color: subTextColor }}>
                LAUNCHING IN:
              </span>
              <div className="flex gap-2">
                {[
                  { label: "D", value: timeLeft.days },
                  { label: "H", value: timeLeft.hours },
                  { label: "M", value: timeLeft.minutes },
                  { label: "S", value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded px-2 py-1 shadow-sm min-w-[40px] text-center"
                    style={{
                      background: isDark
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(96, 165, 250, 0.2)',
                      border: isDark 
                        ? '1px solid rgba(96, 165, 250, 0.4)' 
                        : '1px solid rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <div
                      className="text-base font-bold"
                      style={{ color: textColor }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[10px]" style={{ color: subTextColor }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard/interview-questions")}
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
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default JavascriptInterviewQuestionsButton;
