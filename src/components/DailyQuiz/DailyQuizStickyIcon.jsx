import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import { useUser } from '../../utils/UserContext/UserContext';
import { checkDailyQuizEligibility } from '../../utils/BackendCalls/authService';

const DISMISS_KEY = 'dailyQuizDismissedDate';

const DailyQuizStickyIcon = () => {
    const { isDark } = useTheme();
    const { isAuthenticated, showDailyQuiz, setShowDailyQuiz } = useUser();

    const [quizStatus, setQuizStatus] = useState(null); // null | { completed, score, totalQuestions }
    const [showTooltip, setShowTooltip] = useState(false);
    const [pulse, setPulse] = useState(false);
    const tooltipRef = useRef(null);
    const iconRef = useRef(null);

    // Fetch quiz status on mount and when quiz closes
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchStatus = async () => {
            try {
                const res = await checkDailyQuizEligibility();
                if (res?.success && res.data) {
                    setQuizStatus(res.data);
                }
            } catch {
                // Silently ignore
            }
        };

        fetchStatus();
    }, [isAuthenticated, showDailyQuiz]);

    // Pulse animation when quiz is not attempted
    useEffect(() => {
        if (quizStatus && !quizStatus.completed) {
            setPulse(true);
        } else {
            setPulse(false);
        }
    }, [quizStatus]);

    // Close tooltip on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                tooltipRef.current && !tooltipRef.current.contains(e.target) &&
                iconRef.current && !iconRef.current.contains(e.target)
            ) {
                setShowTooltip(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Don't show if not authenticated or status not loaded
    if (!isAuthenticated || !quizStatus) return null;

    // Don't show icon if quiz modal is already open
    if (showDailyQuiz) return null;

    const isCompleted = quizStatus.completed;
    const score = quizStatus.score ?? 0;
    const total = quizStatus.totalQuestions ?? 5;
    const pct = total > 0 ? score / total : 0;

    const scoreColor = pct >= 0.8 ? 'text-emerald-400' : pct >= 0.5 ? 'text-amber-400' : 'text-red-400';
    const scoreBg = pct >= 0.8 ? 'bg-emerald-500/20' : pct >= 0.5 ? 'bg-amber-500/20' : 'bg-red-500/20';

    const handleClick = () => {
        if (isCompleted) {
            setShowTooltip(prev => !prev);
        } else {
            // Clear the dismiss key so quiz opens
            localStorage.removeItem(DISMISS_KEY);
            setShowDailyQuiz(true);
            setShowTooltip(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
            {/* Score tooltip (shown when quiz is completed) */}
            {showTooltip && isCompleted && (
                <div
                    ref={tooltipRef}
                    className={`mb-2 rounded-2xl shadow-2xl border px-5 py-4 min-w-[220px] animate-in fade-in slide-in-from-bottom-2 transition-all duration-300
                        ${isDark
                            ? 'bg-gray-800 border-gray-700 shadow-black/40'
                            : 'bg-white border-gray-200 shadow-gray-300/40'
                        }`}
                    style={{ animation: 'tooltipIn 0.25s ease-out' }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🏆</span>
                        <span className={`text-sm font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                            Today's Quiz Result
                        </span>
                    </div>

                    <div className={`flex items-center justify-center gap-3 rounded-xl py-3 px-4 ${scoreBg}`}>
                        {/* Score ring */}
                        <svg width="52" height="52" viewBox="0 0 52 52">
                            <circle
                                cx="26" cy="26" r="22"
                                fill="none"
                                stroke={isDark ? '#374151' : '#e5e7eb'}
                                strokeWidth="5"
                            />
                            <circle
                                cx="26" cy="26" r="22"
                                fill="none"
                                stroke={pct >= 0.8 ? '#10b981' : pct >= 0.5 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={`${pct * 138.23} 138.23`}
                                transform="rotate(-90 26 26)"
                                style={{ transition: 'stroke-dasharray 0.6s ease' }}
                            />
                            <text
                                x="26" y="28"
                                textAnchor="middle"
                                className={`text-sm font-black ${scoreColor}`}
                                fill={pct >= 0.8 ? '#10b981' : pct >= 0.5 ? '#f59e0b' : '#ef4444'}
                            >
                                {score}/{total}
                            </text>
                        </svg>

                        <div className="flex flex-col">
                            <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                Score
                            </span>
                            <span className={`text-xl font-black ${scoreColor}`}>
                                {Math.round(pct * 100)}%
                            </span>
                            <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {pct >= 0.8 ? 'Excellent! 🎉' : pct >= 0.5 ? 'Good effort! 💪' : 'Keep practicing! 📚'}
                            </span>
                        </div>
                    </div>

                    {/* Completed label */}
                    <div className={`mt-2 text-center text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        ✅ Completed today
                    </div>
                </div>
            )}

            {/* Sticky Icon Button */}
            <button
                ref={iconRef}
                onClick={handleClick}
                className={`group relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer
                    ${isCompleted
                        ? isDark
                            ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-emerald-900/40 hover:shadow-emerald-500/30'
                            : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-400/30 hover:shadow-emerald-500/40'
                        : isDark
                            ? 'bg-gradient-to-br from-violet-600 to-indigo-800 shadow-indigo-900/40 hover:shadow-indigo-500/30'
                            : 'bg-gradient-to-br from-violet-500 to-indigo-700 shadow-indigo-400/30 hover:shadow-indigo-500/40'
                    }
                `}
                title={isCompleted ? 'View quiz score' : 'Take daily quiz'}
            >
                {/* Pulse ring for not-attempted */}
                {pulse && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-violet-400 pointer-events-none" />
                )}

                {/* Icon */}
                {isCompleted ? (
                    // Trophy icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                ) : (
                    // Quiz clipboard icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white drop-shadow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" />
                        <path d="M9 2v2h6V2" />
                        <path d="M9 12h1" />
                        <path d="M14 12h1" />
                        <path d="M9 16h6" />
                        <path d="M12 7v0" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M12 9.5v2" />
                    </svg>
                )}

                {/* Score badge overlay for completed */}
                {isCompleted && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 
                        ${pct >= 0.8
                            ? 'bg-emerald-500 border-emerald-300 text-white'
                            : pct >= 0.5
                                ? 'bg-amber-500 border-amber-300 text-white'
                                : 'bg-red-500 border-red-300 text-white'
                        }`}>
                        {score}
                    </span>
                )}

                {/* Notification dot for not-attempted */}
                {!isCompleted && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">!</span>
                    </span>
                )}
            </button>

            {/* CSS for tooltip animation */}
            <style>{`
                @keyframes tooltipIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default DailyQuizStickyIcon;
