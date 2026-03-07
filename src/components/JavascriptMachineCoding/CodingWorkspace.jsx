import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../utils/WhiteDarkMode/useTheme";
import { getCodingQuestionById, getCodingQuestions, getUserCodingProgress, runCodingTestCases, submitCodingSolution, getUserCodingSubmission, getUserCodingSubmissions, markBadgesAsSeen, getUserBadges } from "../../utils/BackendCalls/authService";
import { useUser } from "../../utils/UserContext/UserContext";
import SkeletonLoader from "../../utils/SkeletonLoader/SkeletonLoader";
import BadgePopup from "../UserProfile/Badges/BadgePopup";
import { FiAward } from "react-icons/fi";

// ─── Syntax Highlighting Engine (reused from JavascriptCompiler) ───
const tokenize = (code) => {
  const tokens = [];
  let i = 0;
  const KEYWORDS = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class',
    'extends', 'super', 'import', 'export', 'default', 'from', 'try', 'catch',
    'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'async', 'await',
    'yield', 'delete', 'void', 'with', 'debugger', 'static', 'get', 'set',
  ]);
  const BUILTINS = new Set([
    'console', 'Math', 'JSON', 'Promise', 'Array', 'Object', 'String',
    'Number', 'Boolean', 'Date', 'RegExp', 'Map', 'Set', 'WeakMap',
    'WeakSet', 'Symbol', 'Error', 'TypeError', 'RangeError', 'SyntaxError',
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'setTimeout', 'setInterval',
    'clearTimeout', 'clearInterval', 'undefined', 'NaN', 'Infinity',
  ]);
  const CONSTANTS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      let comment = '';
      while (i < code.length && code[i] !== '\n') comment += code[i++];
      tokens.push({ type: 'comment', value: comment });
      continue;
    }
    if (code[i] === '/' && code[i + 1] === '*') {
      let comment = '/*';
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) comment += code[i++];
      if (i < code.length) { comment += '*/'; i += 2; }
      tokens.push({ type: 'comment', value: comment });
      continue;
    }
    if (code[i] === '`') {
      let str = '`'; i++;
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') { str += code[i++]; if (i < code.length) str += code[i++]; }
        else str += code[i++];
      }
      if (i < code.length) str += code[i++];
      tokens.push({ type: 'string', value: str });
      continue;
    }
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i]; let str = quote; i++;
      while (i < code.length && code[i] !== quote && code[i] !== '\n') {
        if (code[i] === '\\') { str += code[i++]; if (i < code.length) str += code[i++]; }
        else str += code[i++];
      }
      if (i < code.length && code[i] === quote) str += code[i++];
      tokens.push({ type: 'string', value: str });
      continue;
    }
    if (/\d/.test(code[i]) || (code[i] === '.' && i + 1 < code.length && /\d/.test(code[i + 1]))) {
      let num = '';
      if (code[i] === '0' && (code[i + 1] === 'x' || code[i + 1] === 'X')) {
        num += code[i++] + code[i++];
        while (i < code.length && /[0-9a-fA-F]/.test(code[i])) num += code[i++];
      } else {
        while (i < code.length && /[\d.]/.test(code[i])) num += code[i++];
        if (i < code.length && (code[i] === 'e' || code[i] === 'E')) {
          num += code[i++];
          if (i < code.length && (code[i] === '+' || code[i] === '-')) num += code[i++];
          while (i < code.length && /\d/.test(code[i])) num += code[i++];
        }
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }
    if (/[a-zA-Z_$]/.test(code[i])) {
      let ident = '';
      while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) ident += code[i++];
      if (KEYWORDS.has(ident)) tokens.push({ type: 'keyword', value: ident });
      else if (CONSTANTS.has(ident)) tokens.push({ type: 'constant', value: ident });
      else if (BUILTINS.has(ident)) tokens.push({ type: 'builtin', value: ident });
      else if (i < code.length && code[i] === '(') tokens.push({ type: 'function', value: ident });
      else tokens.push({ type: 'identifier', value: ident });
      continue;
    }
    if ('+-*/%=<>!&|^~?:'.includes(code[i])) {
      let op = code[i++];
      while (i < code.length && '+-*/%=<>!&|^~?'.includes(code[i]) && op.length < 3) op += code[i++];
      tokens.push({ type: 'operator', value: op });
      continue;
    }
    if ('(){}[]'.includes(code[i])) {
      tokens.push({ type: 'bracket', value: code[i++] });
      continue;
    }
    tokens.push({ type: 'plain', value: code[i++] });
  }
  return tokens;
};

const SYNTAX_COLORS = {
  dark: {
    keyword: '#c792ea', string: '#c3e88d', number: '#f78c6c', comment: '#546e7a',
    builtin: '#82aaff', function: '#82aaff', constant: '#f78c6c', operator: '#89ddff',
    bracket: '#ffd700', identifier: '#d6deeb', plain: '#d6deeb',
  },
  light: {
    keyword: '#7c3aed', string: '#16a34a', number: '#ea580c', comment: '#94a3b8',
    builtin: '#2563eb', function: '#2563eb', constant: '#ea580c', operator: '#0891b2',
    bracket: '#b45309', identifier: '#1e293b', plain: '#1e293b',
  },
};

const CodingWorkspace = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isAuthenticated } = useUser();

  const textareaRef = useRef(null);
  const lineNumberRef = useRef(null);
  const overlayRef = useRef(null);

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState(14);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  // Left panel tabs
  const [leftTab, setLeftTab] = useState('description');

  // Test results
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Mobile panel toggle
  const [activePanel, setActivePanel] = useState('question'); // 'question' | 'editor'

  // Congratulations overlay
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsType, setCongratsType] = useState(null); // 'streak' | 'extra'
  const [streakInfo, setStreakInfo] = useState(null); // { currentStreak, todaySolveCount }
  const [pendingBadges, setPendingBadges] = useState([]); // badges earned from this submission
  const [showBadgePopup, setShowBadgePopup] = useState(null); // currently displayed badge

  // Submissions history
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // All questions list for sidebar & prev/next nav
  const [allQuestions, setAllQuestions] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [badgeCount, setBadgeCount] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Reset result/submission state when switching questions
    setTestResults(null);
    setSubmitResult(null);
    setSubmissions([]);
    setLeftTab('description');

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const res = await getCodingQuestionById(questionId);
        if (res?.data) {
          setQuestion(res.data);
          // Load saved code or use starter code
          if (isAuthenticated) {
            try {
              const subRes = await getUserCodingSubmission(questionId);
              if (subRes?.data?.submittedCode) {
                setCode(subRes.data.submittedCode);
              } else {
                setCode(res.data.starterCode || '');
              }
            } catch {
              setCode(res.data.starterCode || '');
            }
          } else {
            setCode(res.data.starterCode || '');
          }
        }
      } catch (err) {
        console.error('Error fetching question:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId, isAuthenticated]);

  // Fetch all questions for sidebar & prev/next navigation
  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        const res = await getCodingQuestions({ limit: 200 });
        if (res?.data) {
          setAllQuestions(res.data);
        }
        if (isAuthenticated) {
          try {
            const progressRes = await getUserCodingProgress();
            if (progressRes?.data) {
              setProgressMap(progressRes.data);
            }
          } catch (err) {
            console.error('Error fetching coding progress:', err);
          }
          try {
            const badgeRes = await getUserBadges();
            if (badgeRes?.success && badgeRes.data) {
              setBadgeCount(badgeRes.data.totalEarned || 0);
            }
          } catch (err) {
            // Silent fail for badges
          }
        }
      } catch (err) {
        console.error('Error fetching all questions:', err);
      }
    };
    fetchAllQuestions();
  }, [isAuthenticated]);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSidebar]);

  // Compute prev/next question
  const currentIndex = allQuestions.findIndex(q => q._id === questionId);
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null;

  // Sync scroll between textarea, overlay, and line numbers
  const handleScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (overlayRef.current) {
      overlayRef.current.scrollTop = ta.scrollTop;
      overlayRef.current.scrollLeft = ta.scrollLeft;
    }
    if (lineNumberRef.current) {
      lineNumberRef.current.scrollTop = ta.scrollTop;
    }
  }, []);

  const updateCursorPos = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = code.substring(0, pos);
    const line = textBefore.split('\n').length;
    const col = pos - textBefore.lastIndexOf('\n');
    setCursorPos({ line, col });
  }, [code]);

  // Handle Tab key in editor
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
        updateCursorPos();
      });
    }
  };

  const handleRun = useCallback(async () => {
    if (isRunning || !isAuthenticated) return;
    setIsRunning(true);
    setTestResults(null);
    setSubmitResult(null);
    setLeftTab('results');
    try {
      const res = await runCodingTestCases(questionId, code);
      if (res?.success && res?.data) {
        setTestResults(res.data);
      } else {
        setTestResults({ error: res?.message || 'Unexpected response from server' });
      }
    } catch (err) {
      setTestResults({ error: err.message });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, isAuthenticated, questionId, code]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !isAuthenticated) return;
    setIsSubmitting(true);
    setSubmitResult(null);
    setTestResults(null);
    setLeftTab('results');
    try {
      const res = await submitCodingSolution(questionId, code);
      if (res?.success && res?.data) {
        setSubmitResult(res.data);
        if (res.data.accepted) {
          // Capture new badges from the response
          const earnedBadges = res.data.newBadges || [];
          if (earnedBadges.length > 0) {
            setPendingBadges(earnedBadges.map(b => ({ ...b, earned: true })));
          }

          // Determine congrats type from streak data
          const streak = res.data.streak;
          if (streak) {
            setStreakInfo(streak);
            setCongratsType(streak.isFirstOfDay ? 'streak' : 'extra');
          } else {
            setCongratsType('extra');
            setStreakInfo(null);
          }
          setShowCongrats(true);
          // Auto-dismiss streak popup after 4s, then show badge popup if any
          setTimeout(() => {
            setShowCongrats(false);
            // After streak popup closes, show badge popup if earned
            setTimeout(() => {
              if (earnedBadges.length > 0) {
                setShowBadgePopup(earnedBadges.map(b => ({ ...b, earned: true }))[0]);
              }
            }, 400);
          }, 4000);
          // Refresh progress map
          try {
            const progressRes = await getUserCodingProgress();
            if (progressRes?.data) setProgressMap(progressRes.data);
          } catch (e) {
            console.error('Error refreshing progress:', e);
          }
        }
        // Refresh submissions list after each submit
        try {
          const subRes = await getUserCodingSubmissions(questionId);
          if (subRes?.data) setSubmissions(subRes.data);
        } catch (e) {
          console.error('Error refreshing submissions:', e);
        }
      } else {
        setSubmitResult({ error: res?.message || 'Unexpected response from server' });
      }
    } catch (err) {
      setSubmitResult({ error: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isAuthenticated, questionId, code]);

  // Global keyboard shortcuts: Ctrl+' = Run, Ctrl+Enter = Submit
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ctrl + ' (quote) = Run
      if ((e.ctrlKey || e.metaKey) && (e.key === "'" || e.key === "'")) {
        e.preventDefault();
        handleRun();
      }
      // Ctrl + Enter = Submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleRun, handleSubmit]);

  const handleResetCode = () => {
    if (question?.starterCode) {
      setCode(question.starterCode);
      setTestResults(null);
      setSubmitResult(null);
    }
  };

  const lineCount = code.split('\n').length;
  const colors = SYNTAX_COLORS[isDark ? 'dark' : 'light'];

  const renderHighlightedCode = () => {
    const tokens = tokenize(code);
    return tokens.map((token, idx) => (
      <span key={idx} style={{ color: colors[token.type] || colors.plain }}>
        {token.value}
      </span>
    ));
  };

  const difficultyConfig = {
    Easy: { badge: isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' : 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    Medium: { badge: isDark ? 'bg-amber-900/40 text-amber-300 border-amber-700/50' : 'bg-amber-100 text-amber-700 border-amber-200' },
    Hard: { badge: isDark ? 'bg-rose-900/40 text-rose-300 border-rose-700/50' : 'bg-rose-100 text-rose-700 border-rose-200' },
  };

  if (loading) {
    return <SkeletonLoader variant="coding-workspace" />;
  }

  if (error || !question) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className={`rounded-lg p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-200'}`}>
            <p className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>Failed to load question</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error || 'Question not found'}</p>
            <button onClick={() => navigate('/dashboard/coding-questions')} className="mt-3 text-sm text-blue-500 hover:underline">
              ← Back to questions
            </button>
          </div>
        </div>
      </div>
    );
  }

  const config = difficultyConfig[question.difficulty] || difficultyConfig.Easy;

  const formatOutput = (val) => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (typeof val === 'string') return `"${val}"`;
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Congratulations Overlay */}
      {showCongrats && congratsType === 'streak' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" style={{ animation: 'congratsFadeIn 0.4s ease-out' }}>
          {/* Particle effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: ['#F59E0B', '#EF4444', '#F97316', '#FBBF24', '#FCD34D'][i % 5],
                  animation: `congratsParticle ${1.5 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
          <div
            className={`pointer-events-auto relative flex flex-col items-center gap-4 px-10 py-8 rounded-3xl shadow-2xl border backdrop-blur-md ${
              isDark
                ? 'bg-gray-800/95 border-amber-500/30 shadow-amber-500/20'
                : 'bg-white/95 border-amber-300 shadow-amber-200/40'
            }`}
            style={{ animation: 'congratsScaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl" style={{
              background: isDark
                ? 'radial-gradient(ellipse at center, rgba(245,158,11,0.08) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%)',
              animation: 'congratsPulseGlow 2s ease-in-out infinite',
            }} />
            {/* Fire icon */}
            <div
              className="relative flex items-center justify-center w-20 h-20 rounded-full"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.2))'
                  : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.15))',
                animation: 'congratsFirePulse 1.5s ease-in-out infinite',
              }}
            >
              <span className="text-4xl" style={{ animation: 'congratsFireBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both' }}>
                🔥
              </span>
            </div>
            {/* Day count */}
            <div className="text-center relative" style={{ animation: 'congratsFadeUp 0.5s ease-out 0.3s both' }}>
              <div className={`text-3xl font-black tracking-tight ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                Day {streakInfo?.currentStreak || 1}
              </div>
              <div className={`text-sm font-semibold mt-1 ${isDark ? 'text-amber-500/80' : 'text-amber-600/80'}`}
                style={{ animation: 'congratsFadeUp 0.5s ease-out 0.45s both' }}
              >
                {streakInfo?.currentStreak > 1 ? `${streakInfo.currentStreak} day streak!` : 'Streak started!'}
              </div>
            </div>
            {/* Motivational message */}
            <p className={`text-sm font-medium max-w-xs text-center leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              style={{ animation: 'congratsFadeUp 0.5s ease-out 0.55s both' }}
            >
              Consistency is key to success
            </p>
            {/* Progress bar */}
            <div className="w-full max-w-50 relative" style={{ animation: 'congratsFadeUp 0.5s ease-out 0.65s both' }}>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((streakInfo?.currentStreak || 1) / 30 * 100, 100)}%`,
                    background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
                    animation: 'congratsBarFill 1s ease-out 0.8s both',
                  }}
                />
              </div>
              <div className={`flex justify-between mt-1 text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span>Day {streakInfo?.currentStreak || 1}</span>
                <span>30 day goal</span>
              </div>
            </div>
            <button
              onClick={() => setShowCongrats(false)}
              className={`mt-1 text-xs font-medium px-5 py-1.5 rounded-full transition-all duration-200 ${
                isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
              style={{ animation: 'congratsFadeUp 0.5s ease-out 0.75s both' }}
            >
              Keep Going →
            </button>
          </div>
        </div>
      )}

      {/* Extra Solve Congratulations Overlay */}
      {showCongrats && congratsType === 'extra' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" style={{ animation: 'congratsFadeIn 0.3s ease-out' }}>
          <div
            className={`pointer-events-auto flex flex-col items-center gap-3 px-8 py-6 rounded-2xl shadow-2xl border backdrop-blur-sm ${
              isDark
                ? 'bg-gray-800/95 border-emerald-500/30 shadow-emerald-500/10'
                : 'bg-white/95 border-emerald-300 shadow-emerald-200/40'
            }`}
            style={{ animation: 'congratsScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* Checkmark with ripple */}
            <div className="relative">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full ${isDark ? 'bg-emerald-500/15' : 'bg-emerald-100'}`}
                style={{ animation: 'congratsIconSpin 0.6s ease-out' }}
              >
                <svg className="w-9 h-9 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              {/* Ripple rings */}
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" style={{ animation: 'congratsRipple 1.2s ease-out 0.3s both' }} />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" style={{ animation: 'congratsRipple 1.2s ease-out 0.5s both' }} />
            </div>
            <div className="text-center">
              <h2 className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                style={{ animation: 'congratsFadeUp 0.5s ease-out 0.2s both' }}
              >
                Well Done! 🎯
              </h2>
              <p className={`text-sm mt-1 max-w-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                style={{ animation: 'congratsFadeUp 0.5s ease-out 0.35s both' }}
              >
                {streakInfo?.todaySolveCount > 1
                  ? `${streakInfo.todaySolveCount} submissions today! You're on fire!`
                  : 'Great job solving this problem. Keep the momentum going!'}
              </p>
            </div>
            <button
              onClick={() => setShowCongrats(false)}
              className={`mt-1 text-xs font-medium px-5 py-1.5 rounded-full transition-all duration-200 ${
                isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
              style={{ animation: 'congratsFadeUp 0.5s ease-out 0.45s both' }}
            >
              Solve More →
            </button>
          </div>
        </div>
      )}

      {/* Badge Earned Popup */}
      {showBadgePopup && (
        <BadgePopup
          badge={showBadgePopup}
          isDark={isDark}
          onClose={async () => {
            // Mark badge as seen in backend
            try {
              await markBadgesAsSeen([showBadgePopup.badgeId]);
            } catch (e) {
              console.error('Error marking badge as seen:', e);
            }
            // Check if there are more pending badges
            const remaining = pendingBadges.filter(b => b.badgeId !== showBadgePopup.badgeId);
            setPendingBadges(remaining);
            if (remaining.length > 0) {
              setTimeout(() => setShowBadgePopup(remaining[0]), 300);
            } else {
              setShowBadgePopup(null);
            }
          }}
        />
      )}

      <style>{`
        @keyframes congratsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes congratsScaleIn {
          0% { opacity: 0; transform: scale(0.3) translateY(30px); }
          50% { opacity: 1; transform: scale(1.04) translateY(-4px); }
          100% { transform: scale(1) translateY(0); }
        }
        @keyframes congratsIconSpin {
          0% { transform: rotate(-180deg) scale(0); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes congratsFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes congratsFireBounce {
          0% { opacity: 0; transform: scale(0) rotate(-20deg); }
          50% { transform: scale(1.3) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes congratsFirePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245,158,11,0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 5px rgba(245,158,11,0.15); }
        }
        @keyframes congratsPulseGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes congratsBarFill {
          from { width: 0%; }
        }
        @keyframes congratsParticle {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-80px) scale(0); }
        }
        @keyframes congratsRipple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      {/* Top Bar */}
      <div className={`shrink-0 flex items-center justify-between px-3 sm:px-4 py-2 border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate('/dashboard/coding-questions')}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Back to questions"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          {/* Sidebar toggle */}
          <button
            onClick={() => setShowSidebar(s => !s)}
            className={`shrink-0 p-1.5 rounded-lg transition-colors ${
              showSidebar
                ? isDark ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Question list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Divider */}
          <div className={`hidden sm:block w-px h-5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          {/* Prev / Next navigation */}
          <div className="hidden sm:flex items-center gap-0.5">
            <button
              onClick={() => prevQuestion && navigate(`/dashboard/coding-questions/${prevQuestion._id}`)}
              disabled={!prevQuestion}
              className={`p-1.5 rounded-lg transition-colors ${
                !prevQuestion ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              } ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
              title={prevQuestion ? `Previous: ${prevQuestion.title}` : 'No previous question'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => nextQuestion && navigate(`/dashboard/coding-questions/${nextQuestion._id}`)}
              disabled={!nextQuestion}
              className={`p-1.5 rounded-lg transition-colors ${
                !nextQuestion ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              } ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
              title={nextQuestion ? `Next: ${nextQuestion.title}` : 'No next question'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className={`hidden sm:block w-px h-5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          <div className="min-w-0 flex items-center gap-2">
            <span className={`shrink-0 text-xs font-mono leading-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>#{question.order}</span>
            <h1 className={`text-sm font-semibold truncate leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {question.title}
            </h1>
            <span className={`hidden sm:inline-flex shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold leading-none border ${config.badge}`}>
              {question.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge icon */}
          {isAuthenticated && badgeCount > 0 && (
            <button
              onClick={() => navigate('/dashboard/profile', { state: { tab: 'badges' } })}
              className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                isDark
                  ? 'bg-amber-900/20 text-amber-400 border-amber-800/40 hover:bg-amber-900/40'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="View your badges"
            >
              <FiAward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{badgeCount}</span>
            </button>
          )}

          {/* Font size controls */}
          <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setFontSize(s => Math.max(10, s - 1))}
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >A-</button>
            <span className={`text-[10px] font-mono px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{fontSize}</span>
            <button
              onClick={() => setFontSize(s => Math.min(24, s + 1))}
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >A+</button>
          </div>

          {/* Run & Submit */}
          <button
            onClick={handleRun}
            disabled={isRunning || !isAuthenticated}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isRunning 
                ? 'opacity-60 cursor-not-allowed' 
                : 'cursor-pointer'
            } ${isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {isRunning ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
            Run
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !isAuthenticated}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isSubmitting
                ? 'opacity-60 cursor-not-allowed'
                : 'cursor-pointer'
            } bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            {isSubmitting ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
            Submit
          </button>
        </div>
      </div>

      {/* Questions Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-40" style={{ animation: 'fadeIn 0.15s ease-out' }}>
          {/* Backdrop */}
          <div className={`absolute inset-0 ${isDark ? 'bg-black/50' : 'bg-black/30'}`} onClick={() => setShowSidebar(false)} />
          {/* Sidebar panel */}
          <div
            ref={sidebarRef}
            className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] flex flex-col border-r shadow-xl ${
              isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}
            style={{ animation: 'sidebarSlideIn 0.2s ease-out' }}
          >
            {/* Sidebar header */}
            <div className={`shrink-0 flex items-center justify-between px-4 py-3 border-b ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>All Questions</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Sidebar list */}
            <div className="flex-1 overflow-y-auto">
              {allQuestions.length === 0 ? (
                <div className={`p-4 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Loading questions...</div>
              ) : (
                allQuestions.map((q) => {
                  const isCurrent = q._id === questionId;
                  const isSolved = progressMap[q._id]?.isSolved;
                  const diffConfig = difficultyConfig[q.difficulty] || difficultyConfig.Easy;
                  return (
                    <button
                      key={q._id}
                      onClick={() => {
                        navigate(`/dashboard/coding-questions/${q._id}`);
                        setShowSidebar(false);
                      }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2.5 border-b transition-colors ${
                        isCurrent
                          ? isDark ? 'bg-blue-900/30 border-gray-800' : 'bg-blue-50 border-gray-100'
                          : isDark ? 'border-gray-800/60 hover:bg-gray-800/60' : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {/* Solved indicator */}
                      <div className="shrink-0 w-5 flex justify-center">
                        {isSolved ? (
                          <svg className="w-4.5 h-4.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
                        )}
                      </div>
                      {/* Order & title */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-mono shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{q.order}.</span>
                          <span className={`text-xs font-medium truncate ${
                            isCurrent
                              ? isDark ? 'text-blue-400' : 'text-blue-600'
                              : isSolved
                                ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                                : isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>{q.title}</span>
                        </div>
                      </div>
                      {/* Difficulty badge */}
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold border ${diffConfig.badge}`}>
                        {q.difficulty}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sidebarSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      {/* Mobile Panel Toggle */}
      <div className={`sm:hidden flex border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {['question', 'editor'].map(panel => (
          <button
            key={panel}
            onClick={() => setActivePanel(panel)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
              activePanel === panel
                ? isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'
                : isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {panel === 'question' ? 'Problem' : 'Code Editor'}
          </button>
        ))}
      </div>

      {/* Main Split Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Question Panel */}
        <div className={`${activePanel === 'question' ? 'flex' : 'hidden'} sm:flex flex-col w-full sm:w-[45%] lg:w-[40%] border-r overflow-hidden ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Left Tabs */}
          <div className={`shrink-0 flex border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            {[
              { key: 'description', label: 'Description' },
              { key: 'testcases', label: 'Test Cases' },
              { key: 'results', label: 'Results' },
              { key: 'solutions', label: 'Solutions' },
              { key: 'submissions', label: 'Submissions' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setLeftTab(tab.key);
                  // Lazy-load submissions when the tab is first opened
                  if (tab.key === 'submissions' && isAuthenticated && submissions.length === 0 && !loadingSubmissions) {
                    setLoadingSubmissions(true);
                    getUserCodingSubmissions(questionId)
                      .then(res => { if (res?.data) setSubmissions(res.data); })
                      .catch(err => console.error('Error fetching submissions:', err))
                      .finally(() => setLoadingSubmissions(false));
                  }
                }}
                className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
                  leftTab === tab.key
                    ? isDark ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-600'
                    : `border-transparent ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
                }`}
              >
                {tab.label}
                {tab.key === 'results' && (testResults || submitResult) && (
                  <span className={`ml-1.5 w-2 h-2 inline-block rounded-full ${
                    (submitResult?.accepted || testResults?.allPassed) ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}></span>
                )}
              </button>
            ))}
          </div>

          {/* Left Content */}
          <div className={`flex-1 overflow-y-auto p-4 sm:p-5 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            {leftTab === 'description' && (
              <div className="space-y-5">
                {/* Description */}
                <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {question.description.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>

                {/* Examples */}
                {question.examples && question.examples.length > 0 && (
                  <div className="space-y-3">
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Examples
                    </h3>
                    {question.examples.map((ex, i) => (
                      <div key={i} className={`rounded-lg border p-3.5 ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <p className={`text-[11px] font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Example {i + 1}</p>
                        <div className="space-y-1.5">
                          <div className="flex gap-2">
                            <span className={`text-xs font-semibold shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Input:</span>
                            <code className={`text-xs font-mono break-all ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{ex.input}</code>
                          </div>
                          <div className="flex gap-2">
                            <span className={`text-xs font-semibold shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Output:</span>
                            <code className={`text-xs font-mono break-all ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{ex.output}</code>
                          </div>
                          {ex.explanation && (
                            <div className={`mt-2 pt-2 border-t text-xs ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                              <span className="font-semibold">Explanation: </span>{ex.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {question.constraints && question.constraints.length > 0 && (
                  <div>
                    <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Constraints
                    </h3>
                    <ul className="space-y-1">
                      {question.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`}></span>
                          <code className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hints */}
                {question.hints && question.hints.length > 0 && (
                  <HintsSection hints={question.hints} isDark={isDark} />
                )}

                {/* Category & Info */}
                <div className={`flex flex-wrap items-center gap-2 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  {question.category && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>{question.category}</span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${config.badge}`}>
                    {question.difficulty}
                  </span>
                </div>
              </div>
            )}

            {leftTab === 'testcases' && (
              <div className="space-y-3">
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Visible test cases for this question. Hidden test cases are only run on submit.
                </p>
                {question.testCases && question.testCases.length > 0 ? (
                  question.testCases.map((tc, i) => (
                    <div key={i} className={`rounded-lg border p-3 ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Case {i + 1}
                        </span>
                      </div>
                      {tc.description && (
                        <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{tc.description}</p>
                      )}
                      <div className="space-y-1">
                        <div>
                          <span className={`text-[10px] font-semibold uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Input</span>
                          <pre className={`mt-0.5 p-2 rounded text-xs font-mono overflow-x-auto ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            {formatOutput(tc.input)}
                          </pre>
                        </div>
                        <div>
                          <span className={`text-[10px] font-semibold uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Expected Output</span>
                          <pre className={`mt-0.5 p-2 rounded text-xs font-mono overflow-x-auto ${isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            {formatOutput(tc.expectedOutput)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No visible test cases.</p>
                )}
              </div>
            )}

            {leftTab === 'results' && (
              <div className="space-y-4">
                {!testResults && !submitResult && (
                  <div className={`text-center py-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                    <p className="text-sm font-medium">Run or Submit to see results</p>
                    <p className="text-xs mt-1">Ctrl+' to Run • Ctrl+Enter to Submit</p>
                  </div>
                )}

                {/* Run Results */}
                {testResults && !testResults.error && (() => {
                  // Detect error category from results
                  const firstError = testResults.results?.find(r => r.error);
                  const errorType = firstError?.errorType || null;
                  const isCompilationError = errorType === 'compilation_error';
                  const isTLE = errorType === 'time_limit_exceeded';
                  const isRuntimeError = errorType === 'runtime_error' && testResults.results?.every(r => r.error);

                  return (
                    <div>
                      {/* Compilation Error Banner */}
                      {isCompilationError && (
                        <div className={`mb-3 p-3 rounded-lg border ${isDark ? 'bg-orange-900/20 border-orange-800/40' : 'bg-orange-50 border-orange-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <p className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Compilation Error</p>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-orange-300/80' : 'text-orange-600/80'}`}>Your code has a syntax error and could not be compiled.</p>
                          <pre className={`mt-2 p-2.5 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-gray-900 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
                            {firstError?.error}
                          </pre>
                        </div>
                      )}

                      {/* Time Limit Exceeded Banner */}
                      {isTLE && !isCompilationError && (
                        <div className={`mb-3 p-3 rounded-lg border ${isDark ? 'bg-yellow-900/20 border-yellow-800/40' : 'bg-yellow-50 border-yellow-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className={`text-sm font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>Time Limit Exceeded</p>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-yellow-300/80' : 'text-yellow-600/80'}`}>Your solution took too long to execute. Check for infinite loops or optimize your approach.</p>
                          <pre className={`mt-2 p-2.5 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-gray-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
                            {firstError?.error}
                          </pre>
                        </div>
                      )}

                      {/* Runtime Error Banner (when all tests fail with runtime error) */}
                      {isRuntimeError && !isCompilationError && !isTLE && (
                        <div className={`mb-3 p-3 rounded-lg border ${isDark ? 'bg-purple-900/20 border-purple-800/40' : 'bg-purple-50 border-purple-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152-6.44c0-2.166-.283-4.27-.816-6.273A3.743 3.743 0 0014.495 0h-4.99A3.745 3.745 0 005.76 1.477 23.832 23.832 0 004.945 7.75c0 2.236-.395 4.383-1.152 6.44A24.062 24.062 0 0112 12.75z" />
                            </svg>
                            <p className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Runtime Error</p>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-purple-300/80' : 'text-purple-600/80'}`}>Your code encountered an error during execution.</p>
                          <pre className={`mt-2 p-2.5 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-gray-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                            {firstError?.error}
                          </pre>
                        </div>
                      )}

                      {/* Normal pass/fail summary (only when not a global error) */}
                      {!isCompilationError && (
                        <div className={`flex items-center gap-2 mb-3 p-3 rounded-lg ${
                          testResults.allPassed
                            ? isDark ? 'bg-emerald-900/20 border border-emerald-800/40' : 'bg-emerald-50 border border-emerald-200'
                            : isDark ? 'bg-rose-900/20 border border-rose-800/40' : 'bg-rose-50 border border-rose-200'
                        }`}>
                          {testResults.allPassed ? (
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <div>
                            <p className={`text-sm font-bold ${testResults.allPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {testResults.allPassed
                                ? 'All Test Cases Passed!'
                                : isTLE
                                  ? `Time Limit Exceeded on ${testResults.totalTests - testResults.passedTests} test case(s)`
                                  : `${testResults.totalTests - testResults.passedTests} of ${testResults.totalTests} test case(s) failed`
                              }
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {testResults.passedTests}/{testResults.totalTests} passed • {testResults.totalExecutionTime?.toFixed(1)}ms
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Individual test case results (skip for compilation errors - already shown above) */}
                      {!isCompilationError && testResults.results?.map((r, i) => (
                        <div key={i} className={`mb-2 rounded-lg border p-3 ${
                          r.passed
                            ? isDark ? 'bg-gray-800/40 border-emerald-800/30' : 'bg-white border-emerald-200'
                            : isDark ? 'bg-gray-800/40 border-rose-800/30' : 'bg-white border-rose-200'
                        }`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {r.passed ? (
                              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className={`text-xs font-semibold ${r.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                              Test Case {i + 1} {r.passed ? 'Passed' : 'Failed'}
                            </span>
                            {r.errorType && !r.passed && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                r.errorType === 'time_limit_exceeded'
                                  ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  : r.errorType === 'runtime_error'
                                    ? isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                                    : isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {r.errorType === 'time_limit_exceeded' ? 'TLE' : r.errorType === 'runtime_error' ? 'Runtime Error' : 'Compile Error'}
                              </span>
                            )}
                            <span className={`ml-auto text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                              {r.executionTime?.toFixed(1)}ms
                            </span>
                          </div>
                          {!r.passed && (
                            <div className="space-y-1 ml-6">
                              {r.error && (
                                <div className={`text-xs font-mono p-2 rounded mt-1 ${isDark ? 'bg-gray-900 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>{r.error}</div>
                              )}
                              {!r.error && (
                                <>
                                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span className="font-semibold">Expected:</span>{' '}
                                    <code className="font-mono">{formatOutput(r.expectedOutput)}</code>
                                  </div>
                                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span className="font-semibold">Got:</span>{' '}
                                    <code className="font-mono">{formatOutput(r.actualOutput)}</code>
                                  </div>
                                </>
                              )}
                              {r.error && r.expectedOutput !== undefined && r.expectedOutput !== null && (
                                <>
                                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <span className="font-semibold">Expected:</span>{' '}
                                    <code className="font-mono">{formatOutput(r.expectedOutput)}</code>
                                  </div>
                                  {r.actualOutput !== null && r.actualOutput !== undefined && (
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                      <span className="font-semibold">Got:</span>{' '}
                                      <code className="font-mono">{formatOutput(r.actualOutput)}</code>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {testResults?.error && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-rose-900/20 border-rose-800/40' : 'bg-rose-50 border-rose-200'}`}>
                    <p className="text-sm font-semibold text-rose-500 mb-1">Error</p>
                    <p className={`text-xs font-mono ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>{testResults.error}</p>
                  </div>
                )}

                {/* Submit Results */}
                {submitResult && !submitResult.error && (() => {
                  // Detect error category from submit results
                  const firstError = submitResult.results?.find(r => r.error);
                  const errorType = firstError?.errorType || null;
                  const isCompilationError = errorType === 'compilation_error';
                  const isTLE = errorType === 'time_limit_exceeded';
                  const isRuntimeError = errorType === 'runtime_error' && submitResult.results?.every(r => r.error);
                  const failedTests = submitResult.results?.filter(r => !r.passed) || [];
                  const failedHiddenTests = failedTests.filter(r => r.isHidden);
                  const failedVisibleTests = failedTests.filter(r => !r.isHidden);

                  return (
                    <div>
                      {/* Compilation Error Banner for Submit */}
                      {isCompilationError && (
                        <div className={`mb-3 p-3 rounded-lg border ${isDark ? 'bg-orange-900/20 border-orange-800/40' : 'bg-orange-50 border-orange-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <p className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Compilation Error</p>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-orange-300/80' : 'text-orange-600/80'}`}>Your code has a syntax error and could not be compiled.</p>
                          <pre className={`mt-2 p-2.5 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-gray-900 text-orange-300' : 'bg-orange-100 text-orange-700'}`}>
                            {firstError?.error}
                          </pre>
                        </div>
                      )}

                      {/* TLE Banner for Submit */}
                      {isTLE && !isCompilationError && (
                        <div className={`mb-3 p-3 rounded-lg border ${isDark ? 'bg-yellow-900/20 border-yellow-800/40' : 'bg-yellow-50 border-yellow-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className={`text-sm font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>Time Limit Exceeded</p>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-yellow-300/80' : 'text-yellow-600/80'}`}>Your solution took too long to execute. Optimize your approach.</p>
                        </div>
                      )}

                      {/* Runtime Error Banner for Submit */}
                      {isRuntimeError && !isCompilationError && !isTLE && (
                        <div className={`mb-3 p-3 rounded-lg border ${isDark ? 'bg-purple-900/20 border-purple-800/40' : 'bg-purple-50 border-purple-200'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <svg className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75z" />
                            </svg>
                            <p className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Runtime Error</p>
                          </div>
                          <p className={`text-xs ${isDark ? 'text-purple-300/80' : 'text-purple-600/80'}`}>Your code encountered an error during execution.</p>
                          <pre className={`mt-2 p-2.5 rounded text-xs font-mono overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-gray-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                            {firstError?.error}
                          </pre>
                        </div>
                      )}

                      {/* Accept/Reject Summary */}
                      <div className={`flex items-center gap-3 p-4 rounded-lg mb-3 ${
                        submitResult.accepted
                          ? isDark ? 'bg-emerald-900/20 border border-emerald-800/40' : 'bg-emerald-50 border border-emerald-200'
                          : isDark ? 'bg-rose-900/20 border border-rose-800/40' : 'bg-rose-50 border border-rose-200'
                      }`}>
                        {submitResult.accepted ? (
                          <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        ) : (
                          <div className="shrink-0 w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className={`text-base font-bold ${submitResult.accepted ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {submitResult.accepted
                              ? 'Accepted!'
                              : isCompilationError
                                ? 'Compilation Error'
                                : isTLE
                                  ? 'Time Limit Exceeded'
                                  : isRuntimeError
                                    ? 'Runtime Error'
                                    : 'Wrong Answer'
                            }
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {submitResult.passedTests}/{submitResult.totalTests} test cases passed
                            {submitResult.totalExecutionTime ? ` • ${submitResult.totalExecutionTime.toFixed(1)}ms` : ''}
                          </p>
                          {!submitResult.accepted && failedHiddenTests.length > 0 && failedVisibleTests.length === 0 && (
                            <p className={`text-xs mt-1 ${isDark ? 'text-rose-400' : 'text-rose-500'}`}>
                              {failedHiddenTests.length} hidden test case(s) failed
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Individual test results for submit */}
                      {!isCompilationError && submitResult.results?.map((r, i) => (
                        <div key={i} className={`mb-1.5 rounded-lg border px-3 py-2 ${
                          r.passed
                            ? isDark ? 'bg-gray-800/40 border-gray-800/60' : 'bg-gray-50 border-gray-200'
                            : isDark ? 'bg-gray-800/40 border-rose-800/30' : 'bg-white border-rose-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {r.passed ? (
                              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className={`text-xs font-medium ${r.passed ? (isDark ? 'text-gray-400' : 'text-gray-600') : 'text-rose-500'}`}>
                              Test {i + 1}
                              {r.isHidden ? ' (Hidden)' : ''}
                            </span>
                            {!r.passed && r.errorType && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                r.errorType === 'time_limit_exceeded'
                                  ? isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                                  : r.errorType === 'runtime_error'
                                    ? isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                                    : isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {r.errorType === 'time_limit_exceeded' ? 'TLE' : r.errorType === 'runtime_error' ? 'Runtime' : 'Compile'}
                              </span>
                            )}
                            {r.executionTime !== undefined && (
                              <span className={`ml-auto text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                {r.executionTime?.toFixed(1)}ms
                              </span>
                            )}
                          </div>
                          {/* Show details for failed non-hidden tests */}
                          {!r.passed && !r.isHidden && (
                            <div className="mt-2 ml-6 space-y-1">
                              {r.error && (
                                <div className={`text-xs font-mono p-2 rounded ${isDark ? 'bg-gray-900 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>{r.error}</div>
                              )}
                              {r.expectedOutput !== undefined && r.expectedOutput !== null && (
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <span className="font-semibold">Expected:</span>{' '}
                                  <code className="font-mono">{formatOutput(r.expectedOutput)}</code>
                                </div>
                              )}
                              {r.actualOutput !== undefined && r.actualOutput !== null && (
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <span className="font-semibold">Got:</span>{' '}
                                  <code className="font-mono">{formatOutput(r.actualOutput)}</code>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Show full details for failed hidden tests */}
                          {!r.passed && r.isHidden && (
                            <div className="mt-2 ml-6 space-y-1">
                              {r.error && (
                                <div className={`text-xs font-mono p-2 rounded ${isDark ? 'bg-gray-900 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>{r.error}</div>
                              )}
                              {r.input !== undefined && r.input !== null && (
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <span className="font-semibold">Input:</span>{' '}
                                  <code className="font-mono">{formatOutput(r.input)}</code>
                                </div>
                              )}
                              {r.expectedOutput !== undefined && r.expectedOutput !== null && (
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <span className="font-semibold">Expected:</span>{' '}
                                  <code className="font-mono">{formatOutput(r.expectedOutput)}</code>
                                </div>
                              )}
                              {r.actualOutput !== undefined && r.actualOutput !== null && (
                                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <span className="font-semibold">Got:</span>{' '}
                                  <code className="font-mono">{formatOutput(r.actualOutput)}</code>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {submitResult?.error && (
                  <div className={`p-3 rounded-lg border ${isDark ? 'bg-rose-900/20 border-rose-800/40' : 'bg-rose-50 border-rose-200'}`}>
                    <p className="text-sm font-semibold text-rose-500 mb-1">Submission Error</p>
                    <p className={`text-xs font-mono ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>{submitResult.error}</p>
                  </div>
                )}
              </div>
            )}

            {leftTab === 'solutions' && (
              <div className="space-y-4">
                {question.solutions && question.solutions.length > 0 ? (
                  question.solutions.map((sol, i) => (
                    <SolutionCard key={i} solution={sol} index={i} isDark={isDark} />
                  ))
                ) : (
                  <div className={`text-center py-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                    <p className="text-sm font-medium">No solutions available yet</p>
                  </div>
                )}
              </div>
            )}

            {leftTab === 'submissions' && (
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <div className={`text-center py-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <p className="text-sm font-medium">Login to see your submissions</p>
                  </div>
                ) : loadingSubmissions ? (
                  <div className={`text-center py-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    <div className="w-6 h-6 mx-auto mb-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading submissions...</p>
                  </div>
                ) : submissions.length > 0 ? (
                  submissions.map((sub) => (
                    <SubmissionCard
                      key={sub.id}
                      submission={sub}
                      isDark={isDark}
                      onLoadCode={(submittedCode) => setCode(submittedCode)}
                    />
                  ))
                ) : (
                  <div className={`text-center py-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p className="text-sm font-medium">No submissions yet</p>
                    <p className="text-xs mt-1">Submit your solution to see it here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Code Editor Panel */}
        <div className={`${activePanel === 'editor' ? 'flex' : 'hidden'} sm:flex flex-col flex-1 overflow-hidden`}>
          {/* Editor Toolbar */}
          <div className={`shrink-0 flex items-center justify-between px-3 py-1.5 border-b ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                <svg className={`w-3.5 h-3.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                </svg>
                <span className={`text-[11px] font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>JavaScript</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                className={`text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                }`}
              >
                Reset
              </button>
              <span className={`text-[10px] font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Ln {cursorPos.line}, Col {cursorPos.col}
              </span>
            </div>
          </div>

          {/* Code Editor */}
          <div className={`flex-1 flex overflow-hidden ${isDark ? 'bg-[#011627]' : 'bg-white'}`}>
            {/* Line Numbers */}
            <div
              ref={lineNumberRef}
              className="shrink-0 overflow-hidden select-none text-right pr-3 pl-3 pt-3"
              style={{
                fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
                fontSize: `${fontSize}px`,
                lineHeight: '1.6',
                color: isDark ? '#4a5568' : '#cbd5e0',
              }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Syntax Highlight Overlay */}
              <pre
                ref={overlayRef}
                className="absolute inset-0 overflow-auto pointer-events-none p-3 m-0 whitespace-pre-wrap wrap-break-word"
                style={{
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.6',
                  color: 'transparent',
                }}
                aria-hidden="true"
              >
                <code>{renderHighlightedCode()}</code>
              </pre>

              {/* Actual Textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                onKeyUp={updateCursorPos}
                onClick={updateCursorPos}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="absolute inset-0 w-full h-full resize-none p-3 m-0 bg-transparent outline-none caret-current whitespace-pre-wrap wrap-break-word"
                style={{
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.6',
                  color: 'transparent',
                  caretColor: isDark ? '#e2e8f0' : '#1e293b',
                  WebkitTextFillColor: 'transparent',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Submission Card Sub-Component ───
const SubmissionCard = ({ submission, isDark, onLoadCode }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = SYNTAX_COLORS[isDark ? 'dark' : 'light'];

  const timeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`rounded-lg border ${
      submission.accepted
        ? isDark ? 'bg-emerald-900/10 border-emerald-800/30' : 'bg-emerald-50/50 border-emerald-200'
        : isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        {submission.accepted ? (
          <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-rose-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${submission.accepted ? 'text-emerald-500' : 'text-rose-500'}`}>
              {submission.accepted ? 'Accepted' : 'Wrong Answer'}
            </span>
            <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              #{submission.number}
            </span>
          </div>
          <div className={`flex items-center gap-2 mt-0.5 text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span>{submission.passedTests}/{submission.totalTests} passed</span>
            <span>•</span>
            <span>{submission.totalExecutionTime?.toFixed(1)}ms</span>
            <span>•</span>
            <span>{timeAgo(submission.submittedAt)}</span>
          </div>
        </div>
        <svg className={`w-4 h-4 transition-transform shrink-0 ${expanded ? 'rotate-180' : ''} ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Submitted Code</span>
            <button
              onClick={(e) => { e.stopPropagation(); onLoadCode(submission.code); }}
              className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors ${
                isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              Load in Editor
            </button>
          </div>
          <pre className={`p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-64 overflow-y-auto ${isDark ? 'bg-[#011627]' : 'bg-gray-100'}`} style={{ lineHeight: '1.6' }}>
            <code>
              {tokenize(submission.code).map((token, j) => (
                <span key={j} style={{ color: colors[token.type] || colors.plain }}>{token.value}</span>
              ))}
            </code>
          </pre>
          <p className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            {new Date(submission.submittedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Solution Card Sub-Component with reveal toggle ───
const SolutionCard = ({ solution, index, isDark }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const colors = SYNTAX_COLORS[isDark ? 'dark' : 'light'];

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  const approachColors = {
    0: { bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50', border: isDark ? 'border-blue-800/40' : 'border-blue-200', badge: isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700', text: isDark ? 'text-blue-400' : 'text-blue-600' },
    1: { bg: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50', border: isDark ? 'border-emerald-800/40' : 'border-emerald-200', badge: isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-700', text: isDark ? 'text-emerald-400' : 'text-emerald-600' },
  };
  const theme = approachColors[index] || approachColors[0];

  return (
    <div className={`rounded-lg border ${theme.bg} ${theme.border}`}>
      <button
        onClick={() => setRevealed(!revealed)}
        className={`w-full flex items-center justify-between p-3.5 transition-colors`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}>
            {solution.approach || `Approach ${index + 1}`}
          </span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${revealed ? 'rotate-180' : ''} ${theme.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {revealed && (
        <div className="px-3.5 pb-3.5 space-y-3">
          {/* Explanation */}
          {solution.explanation && (
            <div>
              <h4 className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Explanation</h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{solution.explanation}</p>
            </div>
          )}
          {/* Code */}
          {solution.code && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className={`text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Code</h4>
                <button
                  onClick={() => handleCopy(solution.code)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200 ${
                    copied
                      ? (isDark ? 'text-emerald-400 bg-emerald-900/30' : 'text-emerald-600 bg-emerald-50')
                      : (isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/60')
                  }`}
                  title={copied ? 'Copied!' : 'Copy code'}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className={`p-3 rounded-lg text-xs font-mono overflow-x-auto ${isDark ? 'bg-[#011627]' : 'bg-gray-100'}`} style={{ lineHeight: '1.6' }}>
                <code>
                  {tokenize(solution.code).map((token, j) => (
                    <span key={j} style={{ color: colors[token.type] || colors.plain }}>{token.value}</span>
                  ))}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Hints Sub-Component with reveal toggle ───
const HintsSection = ({ hints, isDark }) => {
  const [showHints, setShowHints] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowHints(!showHints)}
        className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
          isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'
        }`}
      >
        <svg className={`w-4 h-4 transition-transform ${showHints ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        {showHints ? 'Hide Hints' : `Show Hints (${hints.length})`}
      </button>
      {showHints && (
        <div className={`mt-2 space-y-1.5 pl-6`}>
          {hints.map((hint, i) => (
            <div key={i} className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <span className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 ${
                isDark ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
              }`}>{i + 1}</span>
              {hint}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodingWorkspace;
