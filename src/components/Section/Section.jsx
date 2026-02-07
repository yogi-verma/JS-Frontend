import React from "react";
import colors from "../../utils/color";
import { Typewriter } from "react-simple-typewriter";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";

const headings = [
  "Master Frontend Fast!",
  "JavaScript Excellence",
  "Become a React Pro",
  "System Design Unlocked",
  "Backend by First Principles"
];

const Section = () => {
  const { isDark } = useTheme();
  return (
    <section className="text-center py-6">
      <h1
        className={
          `text-4xl md:text-4xl font-bold mb-4 ${colors.blueTextGradient}`
        }
      >
        <Typewriter
          words={headings}
          loop={0}
          cursor
          cursorStyle="_"
          typeSpeed={75}
          deleteSpeed={50}
          delaySpeed={1200}
        />
      </h1>
      <p
        className="text-md max-w-2xl mx-auto transition-colors"
        style={{ color: isDark ? colors.textLight : colors.textDark }}
      >
        Join now to master practical frontend (JavaScript, React), system design, and backend engineering—learning from foundational first principles in an interactive, collaborative community.
      </p>
    </section>
  );
};

export default Section;
