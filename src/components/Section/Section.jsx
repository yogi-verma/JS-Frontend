import React from "react";
import colors from "../../utils/color";
import { Typewriter } from "react-simple-typewriter";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import sectionImage from "../../assets/img4.png";

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
        <section
            className={`relative overflow-hidden transition-colors duration-300 ${isDark ? "bg-slate-900/40" : "bg-slate-50/80"}`}
        >
            <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14 lg:py-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Text block — left-aligned, wider to reduce paragraph wrapping */}
                    <div className="min-w-0 order-2 lg:order-1 lg:flex-none lg:min-w-[32rem] lg:max-w-[42rem] lg:mr-5">
                        <h1
                            className={`text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-3 sm:mb-4 ${colors.blueTextGradient}`}
                        >
                            <Typewriter
                                words={headings}
                                loop={0}
                                cursor
                                cursorStyle="|"
                                cursorColor={isDark ? "#38bdf8" : "#2563eb"}
                                typeSpeed={75}
                                deleteSpeed={50}
                                delaySpeed={1200}
                            />
                        </h1>
                        <p
                            className="text-base sm:text-lg leading-relaxed max-w-2xl lg:max-w-none transition-colors"
                            style={{ color: isDark ? colors.textLight : colors.textDark }}
                        >
                            Join now to master practical frontend (JavaScript, React), system
                            design, and backend engineering—learning from foundational first
                            principles in an interactive, collaborative community. Build real
                            projects, get feedback from peers, and grow your portfolio with
                            hands-on practice from day one.
                        </p>
                    </div>

                    {/* Image block — right side, aligned with header nav */}
                    <div className="flex-shrink-0 order-1 lg:order-2 w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px] xl:max-w-[360px] mx-auto lg:mx-0">
                        <div
                            className={`relative rounded-2xl overflow-hidden"}`}
                        >
                            <div
                                className={`absolute inset-0 rounded-2xl"}`}
                                aria-hidden
                            />
                            <img
                                src={sectionImage}
                                alt="Learn full stack development"
                                className="relative w-full h-auto object-cover aspect-square rounded-2xl"
                                width={360}
                                height={360}
                                loading="eager"
                                decoding="async"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Section;
