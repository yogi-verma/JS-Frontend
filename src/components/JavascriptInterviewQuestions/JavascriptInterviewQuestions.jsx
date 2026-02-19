import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import colors from "../../utils/color";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { FaLightbulb, FaCode, FaRocket } from "react-icons/fa";

const JavascriptInterviewQuestions = () => {
  const { isDark } = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    // Launch date: February 25, 2026 at 00:00:00
    const launchDate = new Date('2026-02-25T00:00:00');

    const updateTimer = () => {
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
      }
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Coming Soon Banner */}
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-lg shadow-md relative overflow-visible p-6 sm:p-8"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #1F2937, #111827)'
                : 'linear-gradient(135deg, #F8FAFC, #FFFFFF)'
            }}
          >
            {/* Coming Soon Badge */}
            <div 
              className="absolute -top-3 -right-3 px-3 py-1 rounded-full shadow-lg animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid})`,
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.05em',
                zIndex: 10
              }}
            >
              COMING SOON
            </div>

            <div className="text-center">
              <div className="mb-6">
                <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${colors.blueTextGradient}`}>
                  JavaScript Interview Questions
                </h1>
                <p className={`text-sm sm:text-base max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Master JavaScript interviews with our comprehensive collection of real-world questions, detailed explanations, and hands-on coding challenges
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="mb-8">
                <p className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  LAUNCHING IN
                </p>
                <div className="flex justify-center gap-3 sm:gap-4">
                  {[
                    { label: "Days", value: timeLeft.days },
                    { label: "Hours", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Seconds", value: timeLeft.seconds },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm min-w-[60px] sm:min-w-[70px]"
                      style={{
                        background: isDark
                          ? 'rgba(59, 130, 246, 0.1)'
                          : 'rgba(96, 165, 250, 0.1)',
                        border: isDark 
                          ? '1px solid rgba(96, 165, 250, 0.3)' 
                          : '1px solid rgba(59, 130, 246, 0.2)'
                      }}
                    >
                      <div
                        className={`text-2xl sm:text-3xl font-bold ${colors.blueTextGradient}`}
                      >
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div 
                  className="p-4 rounded-lg" 
                  style={{ 
                    background: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(0, 0, 0, 0.05)' 
                  }}
                >
                  <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    200+ Questions
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    From basics to advanced concepts
                  </p>
                </div>

                <div 
                  className="p-4 rounded-lg" 
                  style={{ 
                    background: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(0, 0, 0, 0.05)' 
                  }}
                >
                  <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    Live Coding
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Practice with built-in compiler
                  </p>
                </div>

                <div 
                  className="p-4 rounded-lg" 
                  style={{ 
                    background: isDark ? 'rgba(31, 41, 55, 0.5)' : 'rgba(0, 0, 0, 0.05)' 
                  }}
                >
                  <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    Detailed Solutions
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Step-by-step explanations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JavascriptInterviewQuestions;
