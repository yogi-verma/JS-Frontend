import { useState, useEffect } from "react";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";

const ScrollToTopButton = () => {
    const { isDark } = useTheme();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`fixed bottom-22 right-6 z-50 flex items-center justify-center w-9 h-9 rounded-full shadow-lg border transition-all duration-400 ease-in-out
                ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}
                ${isDark
                    ? "bg-gray-800 border-gray-600 text-indigo-400 hover:bg-gray-700 hover:text-indigo-300 hover:border-indigo-500"
                    : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400"
                }
                group
            `}
            style={{ boxShadow: isDark ? "0 4px 24px 0 rgba(99,102,241,0.18)" : "0 4px 24px 0 rgba(99,102,241,0.13)" }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 transition-transform duration-200 group-hover:-translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
        </button>
    );
};

export default ScrollToTopButton;
