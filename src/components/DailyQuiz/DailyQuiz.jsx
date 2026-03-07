import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import { useUser } from '../../utils/UserContext/UserContext';
import { getDailyQuizQuestions, submitDailyQuiz } from '../../utils/BackendCalls/authService';

// LocalStorage key used to suppress the popup for the rest of the day when cancelled
const DISMISS_KEY = 'dailyQuizDismissedDate';

// ─── Tiny inline markdown renderer ──────────────────────────────────────────
const CodeBlock = ({ code, isDark }) => (
    <pre
        className={`text-[11px] mt-1.5 mb-0.5 px-2.5 py-2 rounded-lg overflow-x-auto font-mono leading-relaxed border ${
            isDark
                ? 'bg-gray-950 text-emerald-300 border-gray-700/50'
                : 'bg-gray-900 text-emerald-400 border-gray-700/30'
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
                            className={`px-1 py-px rounded text-[11px] font-mono ${
                                isDark ? 'bg-gray-700/80 text-amber-300' : 'bg-gray-100 text-amber-700'
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

// ─── Compact badge ───────────────────────────────────────────────────────────
const QuizBadge = ({ category, questionType, isDark }) => (
    <div className="flex items-center gap-1">
        <span
            className={`px-1.5 py-px rounded text-[9px] font-bold tracking-wide uppercase ${
                category === 'react'
                    ? isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'
                    : isDark ? 'bg-yellow-500/15 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
            }`}
        >
            {category === 'react' ? 'React' : 'JS'}
        </span>
        <span
            className={`px-1.5 py-px rounded text-[9px] font-bold tracking-wide uppercase ${
                questionType === 'output'
                    ? isDark ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-50 text-purple-600'
                    : isDark ? 'bg-teal-500/15 text-teal-400' : 'bg-teal-50 text-teal-600'
            }`}
        >
            {questionType === 'output' ? 'Output' : 'Theory'}
        </span>
    </div>
);

// ─── Compact option button ───────────────────────────────────────────────────
const OptionButton = ({ index, text, selected, onSelect, isDark }) => {
    const letter = ['A', 'B', 'C', 'D'][index];
    return (
        <button
            onClick={() => onSelect(index)}
            className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-150 group ${
                selected
                    ? isDark
                        ? 'border-blue-500/70 bg-blue-500/10 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]'
                        : 'border-blue-500 bg-blue-50 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
                    : isDark
                        ? 'border-gray-700/60 hover:border-gray-600 bg-gray-800/40 hover:bg-gray-750/60'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/80'
            }`}
            style={{ animation: `quizSlideIn 0.25s ease-out ${0.04 + index * 0.06}s both` }}
        >
            <span
                className={`shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold transition-colors duration-150 ${
                    selected
                        ? 'bg-blue-500 text-white'
                        : isDark
                            ? 'bg-gray-700/80 text-gray-500 group-hover:bg-gray-600 group-hover:text-gray-400'
                            : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500'
                }`}
            >
                {letter}
            </span>
            <span className={`text-[13px] leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {renderText(text, isDark)}
            </span>
        </button>
    );
};

// ─── Compact result card ─────────────────────────────────────────────────────
const ResultCard = ({ result, index, isDark }) => {
    const { question, options, correctIndex, selectedIndex, isCorrect, explanation, category, questionType } = result;
    return (
        <div
            className={`rounded-lg border p-3 transition-all ${
                isCorrect
                    ? isDark ? 'border-emerald-500/25 bg-emerald-500/4' : 'border-emerald-200 bg-emerald-50/40'
                    : isDark ? 'border-rose-500/25 bg-rose-500/4' : 'border-rose-200 bg-rose-50/40'
            }`}
            style={{ animation: `quizSlideIn 0.3s ease-out ${index * 0.06}s both` }}
        >
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
                <span
                    className={`shrink-0 w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold mt-0.5 ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                >
                    {isCorrect ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <QuizBadge category={category} questionType={questionType} isDark={isDark} />
                    </div>
                    <p className={`text-[12px] font-medium leading-snug ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {renderText(question, isDark)}
                    </p>
                </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-px ml-6 mb-2">
                {options.map((opt, oi) => {
                    const isCorrectOpt = oi === correctIndex;
                    const isSelectedWrong = oi === selectedIndex && !isCorrect;
                    return (
                        <div
                            key={oi}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] ${
                                isCorrectOpt
                                    ? isDark ? 'bg-emerald-500/12 text-emerald-400 border border-emerald-500/25' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : isSelectedWrong
                                        ? isDark ? 'bg-rose-500/12 text-rose-400 border border-rose-500/25' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : isDark ? 'text-gray-600 border border-transparent' : 'text-gray-400 border border-transparent'
                            }`}
                        >
                            <span className="font-mono font-bold text-[10px]">{['A', 'B', 'C', 'D'][oi]}</span>
                            <span className="flex-1 truncate">{renderText(opt, isDark)}</span>
                            {isCorrectOpt && <span className="ml-auto text-emerald-500 text-[8px] font-black tracking-wider shrink-0">CORRECT</span>}
                            {isSelectedWrong && <span className="ml-auto text-rose-500 text-[8px] font-black tracking-wider shrink-0">YOURS</span>}
                        </div>
                    );
                })}
            </div>

            {/* Explanation */}
            <div
                className={`ml-6 px-2.5 py-1.5 rounded text-[11px] leading-relaxed ${
                    isDark ? 'bg-gray-800/60 text-gray-500' : 'bg-gray-50 text-gray-500'
                } border ${isDark ? 'border-gray-700/40' : 'border-gray-100'}`}
            >
                <span className={`font-semibold mr-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>💡</span>
                {renderText(explanation, isDark)}
            </div>
        </div>
    );
};

// ─── Compact score ring ──────────────────────────────────────────────────────
const ScoreRing = ({ score, total, isDark }) => {
    const pct = score / total;
    const color = pct >= 0.8 ? '#10b981' : pct >= 0.6 ? '#f59e0b' : '#ef4444';
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const dash = circumference * pct;
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke={isDark ? '#1F2937' : '#F3F4F6'} strokeWidth="6" />
                    <circle
                        cx="50" cy="50" r={radius} fill="none"
                        stroke={color} strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        style={{ transition: 'stroke-dasharray 0.8s ease-out 0.4s' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black leading-none" style={{ color }}>{score}</span>
                    <span className={`text-[9px] font-semibold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>/ {total}</span>
                </div>
            </div>
            <p className="text-xs font-bold" style={{ color }}>
                {pct === 1 ? '🏆 Perfect!' : pct >= 0.8 ? '🔥 Excellent!' : pct >= 0.6 ? '👍 Good Job!' : pct >= 0.4 ? '📚 Keep Learning!' : '💪 Keep Going!'}
            </p>
        </div>
    );
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════

const DailyQuiz = () => {
    const { isDark } = useTheme();
    const { setShowDailyQuiz } = useUser();

    const [stage, setStage] = useState('loading');
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [results, setResults] = useState(null);

    const [mounted, setMounted] = useState(false);
    const [flyingOut, setFlyingOut] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const res = await getDailyQuizQuestions();
                if (res?.success) {
                    if (res.data?.alreadyCompleted) {
                        setShowDailyQuiz(false);
                        return;
                    }
                    setQuestions(res.data?.questions || []);
                    setStage('intro');
                } else {
                    setStage('error');
                }
            } catch {
                setStage('error');
            }
        })();
    }, [setShowDailyQuiz]);

    const dismiss = useCallback(() => {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        localStorage.setItem(DISMISS_KEY, today);
        setMounted(false);
        setTimeout(() => setShowDailyQuiz(false), 250);
    }, [setShowDailyQuiz]);

    const handleDone = useCallback(() => {
        setFlyingOut(true);
    }, []);

    const handleSelect = (qId, idx) =>
        setSelectedAnswers(prev => ({ ...prev, [qId]: idx }));

    const handleNext = () => setCurrentIndex(i => i + 1);

    const handleSubmit = async () => {
        setStage('submitting');
        try {
            const answers = questions.map(q => ({
                questionId: q._id,
                selectedIndex: selectedAnswers[q._id] ?? -1,
            }));
            const res = await submitDailyQuiz(answers);
            if (res?.success) {
                setResults(res.data);
                setStage('results');
            } else {
                setStage('error');
            }
        } catch {
            setStage('error');
        }
    };

    const currentQ = questions[currentIndex];
    const currentSelected = currentQ ? selectedAnswers[currentQ._id] : undefined;
    const isLast = currentIndex === questions.length - 1;

    // ── Shared styles ─────────────────────────────────────────────────────
    const backdrop = `fixed inset-0 z-50 transition-opacity duration-250 ${mounted ? 'opacity-100' : 'opacity-0'}`;
    const backdropBg = { background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' };

    const card = `relative w-full max-w-[420px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden backdrop-blur-md ${
        isDark
            ? 'bg-gray-800/[0.97] border-gray-700/50 shadow-black/40'
            : 'bg-white/[0.98] border-gray-200/80 shadow-gray-300/30'
    }`;

    const scaleIn = { animation: mounted ? 'quizScaleIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none' };

    // ──── LOADING ─────────────────────────────────────────────────────────
    if (stage === 'loading') {
        return (
            <>
                <div className={backdrop} style={backdropBg} />
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className={`flex flex-col items-center gap-2.5 px-6 py-5 rounded-xl backdrop-blur-md border ${
                            isDark ? 'bg-gray-800/95 border-gray-700/50' : 'bg-white/95 border-gray-200/60'
                        }`}
                        style={scaleIn}
                    >
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Loading quiz…</p>
                    </div>
                </div>
            </>
        );
    }

    // ──── ERROR ───────────────────────────────────────────────────────────
    if (stage === 'error') {
        return (
            <>
                <div className={backdrop} style={backdropBg} onClick={dismiss} />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className={`${card} p-6 items-center text-center max-w-xs`} style={scaleIn}>
                        <p className="text-2xl mb-2">😕</p>
                        <p className={`text-sm font-semibold mb-0.5 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                            Couldn&apos;t load quiz
                        </p>
                        <p className={`text-xs mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Please try again later.</p>
                        <button
                            onClick={dismiss}
                            className="px-4 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
                <QuizStyles />
            </>
        );
    }

    // ──── INTRO ───────────────────────────────────────────────────────────
    if (stage === 'intro') {
        return (
            <>
                <div className={backdrop} style={backdropBg} onClick={dismiss} />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <div className={`${card} pointer-events-auto p-5`} style={scaleIn}>
                        {/* Glow bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-0.75 rounded-t-2xl"
                            style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)' }}
                        />

                        {/* Subtle glow ring behind card — CodingWorkspace style */}
                        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                            background: isDark
                                ? 'radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)'
                                : 'radial-gradient(ellipse at center, rgba(99,102,241,0.04) 0%, transparent 70%)',
                            animation: 'quizPulseGlow 3s ease-in-out infinite',
                        }} />

                        {/* Close */}
                        <button
                            onClick={dismiss}
                            className={`absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md text-sm transition-colors z-10 ${
                                isDark ? 'text-gray-600 hover:bg-gray-700 hover:text-gray-400' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                            aria-label="Dismiss quiz"
                        >
                            ×
                        </button>

                        {/* Hero */}
                        <div className="flex flex-col items-center relative z-1">
                            {/* Icon */}
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                                style={{
                                    background: isDark
                                        ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))'
                                        : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                                    animation: 'quizIconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both',
                                }}
                            >
                                <span className="text-xl">🧠</span>
                            </div>

                            <h2
                                className={`text-base font-black tracking-tight mb-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                                style={{ animation: 'quizFadeUp 0.35s ease-out 0.12s both' }}
                            >
                                Daily Quiz
                            </h2>
                            <p
                                className={`text-[11px] mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                                style={{ animation: 'quizFadeUp 0.35s ease-out 0.18s both' }}
                            >
                                Test your knowledge · New questions daily
                            </p>

                            {/* Stats row */}
                            <div
                                className={`flex items-center justify-center gap-4 w-full py-2 px-3 rounded-lg mb-3 ${
                                    isDark ? 'bg-gray-700/40 border border-gray-700/40' : 'bg-gray-50 border border-gray-100'
                                }`}
                                style={{ animation: 'quizFadeUp 0.35s ease-out 0.22s both' }}
                            >
                                {[
                                    { icon: '❓', label: '5 Qs' },
                                    { icon: '⚡', label: 'JS & React' },
                                    { icon: '⏱️', label: '~3 min' },
                                ].map(({ icon, label }) => (
                                    <div key={label} className="flex items-center gap-1">
                                        <span className="text-sm">{icon}</span>
                                        <span className={`text-[10px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Topic pills */}
                            <div
                                className="flex flex-wrap justify-center gap-1 mb-4"
                                style={{ animation: 'quizFadeUp 0.35s ease-out 0.28s both' }}
                            >
                                {['Closures', 'Hooks', 'Async', 'DOM', 'Output', 'Theory'].map(tag => (
                                    <span
                                        key={tag}
                                        className={`px-2 py-px rounded text-[9px] font-semibold ${
                                            isDark ? 'bg-gray-700/60 text-gray-400' : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col gap-1.5 w-full" style={{ animation: 'quizFadeUp 0.35s ease-out 0.34s both' }}>
                                <button
                                    onClick={() => setStage('quiz')}
                                    className="w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wide transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                                >
                                    Start Quiz →
                                </button>
                                <button
                                    onClick={dismiss}
                                    className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
                                        isDark ? 'text-gray-600 hover:bg-gray-700/50 hover:text-gray-400' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-500'
                                    }`}
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <QuizStyles />
            </>
        );
    }

    // ──── QUIZ ────────────────────────────────────────────────────────────
    if (stage === 'quiz' || stage === 'submitting') {
        const progress = ((currentIndex + 1) / questions.length) * 100;

        return (
            <>
                <div className={backdrop} style={backdropBg} />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <div
                        className={`${card} pointer-events-auto max-h-[88vh]`}
                        style={{ animation: 'quizScaleIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                        {/* Top gradient bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-0.75 rounded-t-2xl"
                            style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)' }}
                        />

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Q{currentIndex + 1}
                                    <span className={`font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>/{questions.length}</span>
                                </span>
                                {currentQ && <QuizBadge category={currentQ.category} questionType={currentQ.questionType} isDark={isDark} />}
                            </div>
                            <button
                                onClick={dismiss}
                                className={`w-6 h-6 flex items-center justify-center rounded-md text-sm transition-colors ${
                                    isDark ? 'text-gray-600 hover:bg-gray-700 hover:text-gray-400' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                }`}
                                aria-label="Exit quiz"
                            >
                                ×
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className={`mx-4 mb-3 h-1 rounded-full overflow-hidden shrink-0 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${progress}%`,
                                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                                }}
                            />
                        </div>

                        {/* Scrollable body */}
                        <div className="flex flex-col gap-3 px-4 pb-4 overflow-y-auto min-h-0 flex-1">
                            {currentQ && (
                                <>
                                    <div
                                        key={`q-${currentIndex}`}
                                        className={`text-[13px] font-semibold leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                                        style={{ animation: 'quizFadeUp 0.3s ease-out both' }}
                                    >
                                        {renderText(currentQ.question, isDark)}
                                    </div>

                                    <div key={`opts-${currentIndex}`} className="flex flex-col gap-1.5">
                                        {currentQ.options.map((opt, oi) => (
                                            <OptionButton
                                                key={oi}
                                                index={oi}
                                                text={opt}
                                                selected={currentSelected === oi}
                                                onSelect={(idx) => handleSelect(currentQ._id, idx)}
                                                isDark={isDark}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Navigation */}
                            <div style={{ animation: 'quizFadeUp 0.3s ease-out 0.25s both' }}>
                                {isLast ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={currentSelected === undefined || stage === 'submitting'}
                                        className={`w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wide transition-all duration-150
                                            disabled:opacity-40 disabled:cursor-not-allowed
                                            ${currentSelected !== undefined && stage !== 'submitting' ? 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg' : ''}`}
                                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                                    >
                                        {stage === 'submitting' ? (
                                            <span className="flex items-center justify-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Submitting…
                                            </span>
                                        ) : (
                                            '🎯 Submit Quiz'
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        disabled={currentSelected === undefined}
                                        className={`w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wide transition-all duration-150
                                            disabled:opacity-40 disabled:cursor-not-allowed
                                            ${currentSelected !== undefined ? 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg' : ''}`}
                                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                                    >
                                        Next →
                                    </button>
                                )}
                                {currentSelected === undefined && (
                                    <p className={`text-center text-[10px] mt-1.5 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
                                        Select an option to continue
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <QuizStyles />
            </>
        );
    }

    // ──── RESULTS ─────────────────────────────────────────────────────────
    if (stage === 'results' && results) {
        const { score, totalQuestions, results: questionResults } = results;

        return (
            <>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 z-50 transition-opacity duration-250 ${
                        flyingOut ? 'opacity-0' : mounted ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ ...backdropBg, transitionDuration: flyingOut ? '350ms' : '250ms' }}
                />

                {/* Particles for high scores */}
                {score >= 4 && !flyingOut && (
                    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
                        {[...Array(14)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${30 + Math.random() * 40}%`,
                                    background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'][i % 5],
                                    animation: `quizParticle ${1.2 + Math.random() * 1.5}s ease-out ${Math.random() * 0.3}s forwards`,
                                    opacity: 0,
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <div
                        ref={cardRef}
                        className={`${card} pointer-events-auto max-h-[88vh]`}
                        style={{
                            animation: flyingOut
                                ? 'quizFlyToCorner 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards'
                                : 'quizScaleIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                        onAnimationEnd={() => {
                            if (flyingOut) setShowDailyQuiz(false);
                        }}
                    >
                        {/* Top gradient */}
                        <div
                            className="absolute top-0 left-0 right-0 h-0.75 rounded-t-2xl"
                            style={{ background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)' }}
                        />

                        {/* Scrollable content */}
                        <div className="overflow-y-auto flex-1 px-4 pt-4 pb-4 flex flex-col gap-3 min-h-0">
                            {/* Score */}
                            <div className="flex flex-col items-center gap-1" style={{ animation: 'quizScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s both' }}>
                                <ScoreRing score={score} total={totalQuestions} isDark={isDark} />
                                <p className={`text-[10px] font-medium ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {score} correct · {totalQuestions - score} wrong · Come back tomorrow!
                                </p>
                            </div>

                            {/* Divider */}
                            <div className={`shrink-0 h-px ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`} />

                            {/* Breakdown */}
                            <div className="flex flex-col gap-2">
                                <p className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    Breakdown
                                </p>
                                {questionResults.map((r, i) => (
                                    <ResultCard key={r.questionId} result={r} index={i} isDark={isDark} />
                                ))}
                            </div>
                        </div>

                        {/* Sticky footer */}
                        <div className={`shrink-0 px-4 pb-4 pt-2.5 border-t ${isDark ? 'border-gray-700/40' : 'border-gray-100'}`}>
                            <button
                                onClick={handleDone}
                                disabled={flyingOut}
                                className="w-full py-2.5 rounded-lg text-white font-bold text-xs tracking-wide transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 hover:shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                            >
                                Done 🎓
                            </button>
                        </div>
                    </div>
                </div>
                <QuizStyles />
            </>
        );
    }

    return null;
};

// ─── Keyframe styles (CodingWorkspace-inspired design language) ──────────────
const QuizStyles = () => (
    <style>{`
        @keyframes quizScaleIn {
            0%   { opacity: 0; transform: scale(0.85) translateY(12px); }
            60%  { opacity: 1; transform: scale(1.02) translateY(-2px); }
            100% { transform: scale(1) translateY(0); }
        }
        @keyframes quizFadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes quizSlideIn {
            from { opacity: 0; transform: translateX(-6px); }
            to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes quizIconBounce {
            0%   { opacity: 0; transform: scale(0) rotate(-15deg); }
            50%  { transform: scale(1.2) rotate(3deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes quizPulseGlow {
            0%, 100% { opacity: 0.5; }
            50%      { opacity: 1; }
        }
        @keyframes quizParticle {
            0%   { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-80px) scale(0); }
        }
        @keyframes quizFlyToCorner {
            0%   { opacity: 1;   transform: scale(1)    translate(0, 0);         }
            40%  { opacity: 0.7; transform: scale(0.4)  translate(25%, -10%);    }
            100% { opacity: 0;   transform: scale(0.03) translate(220%, -500%);  }
        }
    `}</style>
);

export default DailyQuiz;
