import { useState, useEffect } from 'react';
import { getDailyQuizQuestions } from '../../../utils/BackendCalls/authService';
import { useUser } from '../../../utils/UserContext/UserContext';

// ─── Tiny markdown renderer (inline code + code blocks) ──────────────────────
const CodeBlock = ({ code, isDark }) => (
    <pre
        className={`text-xs mt-1.5 mb-1 px-3 py-2 rounded-lg overflow-x-auto font-mono leading-relaxed border ${
            isDark
                ? 'bg-gray-950 text-emerald-300 border-gray-700/60'
                : 'bg-gray-900 text-emerald-400 border-gray-700/40'
        }`}
    >
        {code}
    </pre>
);

const renderText = (text, isDark) => {
    if (!text) return null;
    const blockParts = text.split(/(```[\w]*\n[\s\S]*?```)/g);
    return blockParts.map((part, bi) => {
        if (part.startsWith('```')) {
            const code = part.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
            return <CodeBlock key={bi} code={code} isDark={isDark} />;
        }
        const inlineParts = part.split(/(`[^`]+`)/g);
        return (
            <span key={bi}>
                {inlineParts.map((ip, ii) =>
                    ip.startsWith('`') ? (
                        <code
                            key={ii}
                            className={`px-1 py-0.5 rounded text-xs font-mono ${
                                isDark ? 'bg-gray-700 text-amber-300' : 'bg-gray-100 text-amber-700'
                            }`}
                        >
                            {ip.slice(1, -1)}
                        </code>
                    ) : (
                        ip
                    )
                )}
            </span>
        );
    });
};

// ─── Score ring SVG ───────────────────────────────────────────────────────────
const ScoreRing = ({ score, total, isDark, size = 72 }) => {
    const pct = total > 0 ? score / total : 0;
    const color = pct >= 0.8 ? '#10b981' : pct >= 0.6 ? '#f59e0b' : '#ef4444';
    const r = 28;
    const circ = 2 * Math.PI * r;
    const dash = circ * pct;
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r={r} fill="none" stroke={isDark ? '#374151' : '#E5E7EB'} strokeWidth="6" />
                <circle
                    cx="36" cy="36" r={r} fill="none"
                    stroke={color} strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ - dash}`}
                    style={{ transition: 'stroke-dasharray 0.8s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black leading-none" style={{ color }}>{score}</span>
                <span className={`text-[9px] font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/{total}</span>
            </div>
        </div>
    );
};

// ─── Category / type badge ────────────────────────────────────────────────────
const QuizBadge = ({ category, questionType, isDark }) => (
    <div className="flex items-center gap-1">
        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
            category === 'react'
                ? isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'
                : isDark ? 'bg-yellow-500/15 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
        }`}>
            {category === 'react' ? '⚛️ React' : '⚡ JS'}
        </span>
        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
            questionType === 'output'
                ? isDark ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-50 text-purple-600'
                : isDark ? 'bg-teal-500/15 text-teal-400' : 'bg-teal-50 text-teal-600'
        }`}>
            {questionType === 'output' ? 'Output' : 'Theory'}
        </span>
    </div>
);

// ─── Expandable result card for one question ──────────────────────────────────
const QuestionBreakdown = ({ result, isDark }) => {
    const [open, setOpen] = useState(false);
    const { question, options, correctIndex, selectedIndex, isCorrect, explanation, category, questionType } = result;

    return (
        <div
            className={`rounded-xl border transition-all duration-200 ${
                isCorrect
                    ? isDark ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/40'
                    : isDark ? 'border-rose-500/25 bg-rose-500/5' : 'border-rose-200 bg-rose-50/40'
            }`}
        >
            {/* Header row — click to expand */}
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
            >
                <span
                    className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                >
                    {isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                    <QuizBadge category={category} questionType={questionType} isDark={isDark} />
                    <p className={`text-xs mt-1 line-clamp-2 text-left ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {question}
                    </p>
                </div>
                <span className={`shrink-0 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>▼</span>
            </button>

            {/* Expanded content */}
            {open && (
                <div className={`px-3 pb-3 border-t ${isDark ? 'border-gray-700/60' : 'border-gray-100'}`}>
                    {/* Rendered question (supports code) */}
                    <div className={`text-xs mt-2.5 mb-2 font-medium leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {renderText(question, isDark)}
                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-1 mb-2.5">
                        {options.map((opt, oi) => {
                            const isCorrectOpt = oi === correctIndex;
                            const isSelectedWrong = oi === selectedIndex && !isCorrect;
                            return (
                                <div
                                    key={oi}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] ${
                                        isCorrectOpt
                                            ? isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : isSelectedWrong
                                                ? isDark ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                : isDark ? 'text-gray-500' : 'text-gray-400'
                                    }`}
                                >
                                    <span className="font-mono font-bold">{['A', 'B', 'C', 'D'][oi]}</span>
                                    <span className="flex-1">{renderText(opt, isDark)}</span>
                                    {isCorrectOpt && <span className="text-emerald-500 text-[9px] font-bold shrink-0">CORRECT</span>}
                                    {isSelectedWrong && <span className="text-rose-500 text-[9px] font-bold shrink-0">YOUR ANSWER</span>}
                                </div>
                            );
                        })}
                    </div>

                    {/* Explanation */}
                    <div className={`px-2.5 py-2 rounded-lg text-[11px] leading-relaxed ${isDark ? 'bg-gray-800/80 text-gray-400 border border-gray-700/60' : 'bg-white/80 text-gray-500 border border-gray-200'}`}>
                        <span className={`font-semibold mr-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>💡</span>
                        {renderText(explanation, isDark)}
                    </div>
                </div>
            )}
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const DailyQuizCard = ({ isDark }) => {
    const { setShowDailyQuiz } = useUser();
    const [status, setStatus] = useState('loading'); // 'loading' | 'completed' | 'not-attempted' | 'error'
    const [data, setData] = useState(null); // { score, totalQuestions, results: [...] }

    useEffect(() => {
        (async () => {
            try {
                const res = await getDailyQuizQuestions();
                if (res?.success) {
                    if (res.data?.alreadyCompleted) {
                        setData(res.data);
                        setStatus('completed');
                    } else {
                        setStatus('not-attempted');
                    }
                } else {
                    setStatus('error');
                }
            } catch {
                setStatus('error');
            }
        })();
    }, []);

    // ── Loading ──
    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center py-8 gap-2">
                <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${isDark ? 'border-blue-400' : 'border-blue-500'}`} />
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Loading quiz data…</span>
            </div>
        );
    }

    // ── Error ──
    if (status === 'error') {
        return (
            <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-2xl">😕</span>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Couldn't load quiz data.</p>
            </div>
        );
    }

    // ── Not yet attempted today ──
    if (status === 'not-attempted') {
        return (
            <div className="flex flex-col items-center gap-4 py-8 px-4">
                {/* Icon + illustration */}
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)' }}
                >
                    🧠
                </div>
                <div className="text-center">
                    <p className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        Daily Quiz Awaits!
                    </p>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        You haven't taken today's quiz yet.<br />
                        5 questions · JavaScript &amp; React · ~3 min
                    </p>
                </div>
                <button
                    onClick={() => setShowDailyQuiz(true)}
                    className="px-6 py-2 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/20"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                >
                    Take Today's Quiz →
                </button>
            </div>
        );
    }

    // ── Completed ──
    const { score, totalQuestions, results: questionResults } = data;
    const pct = totalQuestions > 0 ? score / totalQuestions : 0;
    const label = pct === 1 ? '🏆 Perfect!' : pct >= 0.8 ? '🔥 Excellent!' : pct >= 0.6 ? '👍 Good Job!' : pct >= 0.4 ? '📚 Keep Learning!' : '💪 Keep Practicing!';
    const labelColor = pct >= 0.8 ? '#10b981' : pct >= 0.6 ? '#f59e0b' : '#ef4444';

    return (
        <div className="flex flex-col gap-4">
            {/* Score summary row */}
            <div className={`flex items-center gap-4 px-4 py-4 rounded-xl ${isDark ? 'bg-gray-900/60' : 'bg-gray-50'}`}>
                <ScoreRing score={score} total={totalQuestions} isDark={isDark} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black" style={{ color: labelColor }}>{label}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {score}/{totalQuestions} correct · {totalQuestions - score} incorrect
                    </p>
                    <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        Today's quiz completed ✓ · Next quiz in{' '}
                        <NextQuizCountdown isDark={isDark} />
                    </p>
                </div>
            </div>

            {/* Per-question breakdown */}
            {questionResults && questionResults.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className={`text-[10px] font-bold tracking-widest uppercase px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Question Breakdown
                    </p>
                    {questionResults.map((r, i) => (
                        <QuestionBreakdown key={r.questionId || i} result={r} isDark={isDark} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Countdown to midnight ────────────────────────────────────────────────────
const NextQuizCountdown = ({ isDark }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calc = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            setTimeLeft(`${h}h ${m}m`);
        };
        calc();
        const id = setInterval(calc, 60000);
        return () => clearInterval(id);
    }, []);

    return <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{timeLeft}</span>;
};

export default DailyQuizCard;
