import React from "react";
import {
  FaLightbulb,
  FaLaptopCode,
  FaConnectdevelop,
  FaRocket,
} from "react-icons/fa";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import colors from "../../utils/color";

const reasons = [
  {
    icon: (
      <FaLightbulb className="text-blue-500 text-xl mb-2 md:text-2xl md:mb-4" />
    ),
    title: "First-Principles Learning",
    description:
      "Go well beyond tutorials and memorization by mastering core concepts that empower you to solve real, previously unseen problems—like an engineer, not just a coder.",
  },
  {
    icon: (
      <FaLaptopCode className="text-indigo-500 text-xl mb-2 md:text-2xl md:mb-4" />
    ),
    title: "Frontend & Backend Mastery",
    description:
      "Become job-ready by learning both client-side frameworks (like React) and robust backend systems, all deeply integrated with system design.",
  },
  {
    icon: (
      <FaConnectdevelop className="text-cyan-500 text-xl mb-2 md:text-2xl md:mb-4" />
    ),
    title: "Collaborative Community",
    description:
      "Join an active learning community, participate in projects, and get feedback—so you don’t just learn alone, but as part of a passionate developer network.",
  },
  {
    icon: (
      <FaRocket className="text-blue-400 text-xl mb-2 md:text-2xl md:mb-4" />
    ),
    title: "Portfolio & Growth",
    description:
      "Apply your new skills directly as you build real projects for your portfolio. Stand out and fast-track your path to your dream job or promotion.",
  },
];

const Reason = () => {
  const { isDark } = useTheme();
  return (
    <section
      className={`text-center py-6 sm:py-7 md:py-8 lg:py-10 px-4 sm:px-6 md:px-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <h2 className={`text-3xl font-bold mb-3 ${colors.blueTextGradient}`}>
        Why learn FullStack here?
      </h2>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        Real skills, real projects, real community. We go beyond the basics to make you a confident, job-ready developer.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-5 sm:mt-6 max-w-6xl mx-auto">
        {reasons.map((reason, idx) => (
          <div
            key={idx}
            className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 md:p-5 flex flex-col items-center hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-md sm:hover:shadow-lg transition cursor-pointer h-full min-w-0`}
          >
            {reason.icon}
            <h3
              className={`text-sm sm:text-base font-bold mb-1 text-center ${colors.blueTextGradient}`}
            >
              {reason.title}
            </h3>
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
