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

const Section = ({ showLoginButton = false, onLoginClick }) => {
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
                            className={`text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-3 sm:mb-4 ${colors.blueTextGradient}`}
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
                            className={`text-sm sm:text-base leading-relaxed max-w-2xl lg:max-w-none transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                            Join now to master practical frontend (JavaScript, React), system
                            design, and backend engineering—learning from foundational first
                            principles in an interactive, collaborative community. Build real
                            projects, get feedback from peers, and grow your portfolio with
                            hands-on practice from day one.
                        </p>
                        {showLoginButton ? (
                            <button
                                onClick={onLoginClick}
                                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:cursor-pointer hover:scale-105 shadow-md"
                                style={{
                                    background: `linear-gradient(90deg, ${colors.blueLight}, ${colors.blueMid})`
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                >
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Login with Google
                            </button>
                        ) : null}
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
