import React from "react";
import { FaLightbulb, FaLaptopCode, FaConnectdevelop, FaRocket } from "react-icons/fa";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import colors from "../../utils/color";

const reasons = [
  {
    icon: <FaLightbulb className="text-blue-500 text-xl mb-2 md:text-2xl md:mb-4" />,
    title: "First-Principles Learning",
    description: "Go well beyond tutorials and memorization by mastering core concepts that empower you to solve real, previously unseen problems—like an engineer, not just a coder."
  },
  {
    icon: <FaLaptopCode className="text-indigo-500 text-xl mb-2 md:text-2xl md:mb-4" />,
    title: "Frontend & Backend Mastery",
    description: "Become job-ready by learning both client-side frameworks (like React) and robust backend systems, all deeply integrated with system design."
  },
  {
    icon: <FaConnectdevelop className="text-cyan-500 text-xl mb-2 md:text-2xl md:mb-4" />,
    title: "Collaborative Community",
    description: "Join an active learning community, participate in projects, and get feedback—so you don’t just learn alone, but as part of a passionate developer network."
  },
  {
    icon: <FaRocket className="text-blue-400 text-xl mb-2 md:text-2xl md:mb-4" />,
    title: "Portfolio & Growth",
    description: "Apply your new skills directly as you build real projects for your portfolio. Stand out and fast-track your path to your dream job or promotion."
  }
];

const Reason = () => {
  const { isDark } = useTheme();
  return (
    <section className={`text-center py-4 sm:py-6 px-3 sm:px-4 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <h1
        className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-1 ${colors.blueTextGradient}`}
      >
        Why Learn Full Stack Here?
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 mt-6 sm:mt-8 max-w-6xl mx-auto">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6 flex flex-col items-center hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-lg sm:hover:shadow-xl transition cursor-pointer h-full min-w-0`}
          >
            {reason.icon}
            <h3 className={`text-base sm:text-lg font-bold mb-1 text-center ${isDark ? "text-blue-400" : "text-blue-700"}`}>{reason.title}</h3>
            <p
              className="text-xs sm:text-sm max-w-xs sm:max-w-sm mx-auto text-center leading-relaxed"
              style={{ color: isDark ? colors.textLight : colors.textDark }}
            >
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reason;
