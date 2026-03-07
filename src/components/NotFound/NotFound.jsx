import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../utils/WhiteDarkMode/useTheme';
import colors from '../../utils/color';
import AnimatedBackground from '../AnimatedBackground/AnimatedBackground';

/* ─── main component ────────────────────────────────────────────────────── */
export default function NotFound() {
    const { isDark } = useTheme();
    const navigate = useNavigate();

    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
            style={{
                background: isDark
                    ? '#0F172A'
                    : 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 45%, #EDE9FE 100%)',
            }}
        >
            {/* Layered background */}
            <AnimatedBackground isDark={isDark} />

            {/* ── light-mode radial glow orbs ─────────────────────────────── */}
            {!isDark && (
                <>
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute', top: '-8%', left: '-10%',
                            width: 480, height: 480, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
                            pointerEvents: 'none', zIndex: 1,
                        }}
                    />
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute', bottom: '-6%', right: '-8%',
                            width: 420, height: 420, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(56,189,248,0.16) 0%, transparent 70%)',
                            pointerEvents: 'none', zIndex: 1,
                        }}
                    />
                    <div
                        aria-hidden
                        style={{
                            position: 'absolute', top: '40%', right: '5%',
                            width: 220, height: 220, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(129,140,248,0.14) 0%, transparent 70%)',
                            pointerEvents: 'none', zIndex: 1,
                        }}
                    />
                </>
            )}

            {/* Card */}
            <div
                className="relative z-10 flex flex-col items-center text-center px-6 py-6 sm:py-8 max-w-lg w-full mx-4 rounded-3xl"
                style={{
                    background: isDark
                        ? 'rgba(15,23,42,0.75)'
                        : 'rgba(255,255,255,0.82)',
                    border: isDark
                        ? '1px solid rgba(96,165,250,0.18)'
                        : '1px solid rgba(99,102,241,0.28)',
                    boxShadow: isDark
                        ? '0 0 60px rgba(56,189,248,0.10), 0 20px 60px rgba(0,0,0,0.5)'
                        : '0 0 80px rgba(99,102,241,0.18), 0 0 40px rgba(59,130,246,0.14), 0 20px 60px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }}
            >
                {/* 404 glitch number */}
                <div className="relative mb-2" style={{ lineHeight: 1 }}>
                    {/* shadow layers */}
                    <span
                        aria-hidden
                        className="absolute inset-0 font-black text-[5rem] sm:text-[6.5rem]"
                        style={{
                            backgroundImage: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid}, #818CF8)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'blur(18px)',
                            opacity: 0.5,
                            animation: 'nf-pulse 3s ease-in-out infinite',
                        }}
                    >
                        404
                    </span>
                    <span
                        className="relative font-black text-[5rem] sm:text-[6.5rem]"
                        style={{
                            backgroundImage: `linear-gradient(135deg, ${colors.blueLight}, ${colors.blueMid}, #818CF8)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'nf-glitch 5s steps(1) infinite',
                            display: 'inline-block',
                        }}
                    >
                        404
                    </span>
                </div>

                {/* Animated divider */}
                <div className="relative w-24 h-px my-1 overflow-hidden rounded-full">
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${colors.blueLight}, ${colors.blueMid}, #818CF8, transparent)`,
                            animation: 'nf-slide 2s linear infinite',
                        }}
                    />
                </div>

                {/* Label */}
                <p
                    className="mt-2 text-xs font-bold uppercase tracking-[0.3em]"
                    style={{
                        backgroundImage: `linear-gradient(90deg, ${colors.blueLight}, ${colors.blueMid})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Page Not Found
                </p>

                {/* Heading */}
                <h1
                    className={`mt-2 text-xl sm:text-2xl font-bold leading-tight ${isDark ? 'text-gray-100' : 'text-gray-800'}`}
                >
                    Looks like you&rsquo;re lost in&nbsp;the void
                </h1>

                {/* Description */}
                <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                    The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
                    Let&rsquo;s get you back on track.
                </p>

                {/* Buttons */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                        style={{
                            background: `linear-gradient(90deg, ${colors.blueLight}, ${colors.blueMid}, #818CF8)`,
                            boxShadow: `0 4px 24px rgba(59,130,246,0.35)`,
                        }}
                    >
                        <HomeIcon />
                        Go Home
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-pointer ${
                            isDark
                                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                        style={{ boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <BackIcon />
                        Go Back
                    </button>
                </div>

                {/* Status bar */}
                <div
                    className="mt-5 flex items-center gap-2 text-xs rounded-full px-4 py-1.5"
                    style={{
                        background: isDark ? 'rgba(96,165,250,0.08)' : 'rgba(59,130,246,0.06)',
                        border: `1px solid ${isDark ? 'rgba(96,165,250,0.18)' : 'rgba(59,130,246,0.15)'}`,
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            background: '#22D3EE',
                            boxShadow: '0 0 6px #22D3EE',
                            animation: 'nf-blink 1.4s ease-in-out infinite',
                            display: 'inline-block',
                        }}
                    />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        Error&nbsp;code:&nbsp;
                        <span
                            style={{
                                backgroundImage: `linear-gradient(90deg, ${colors.blueLight}, ${colors.cyan})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: 700,
                            }}
                        >
                            HTTP 404
                        </span>
                    </span>
                </div>
            </div>

            {/* bottom brand */}
            <p
                className={`relative z-10 mt-3 text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
            >
                DevCrux &mdash; Full Stack Solution
            </p>

            {/* keyframes injected once */}
            <style>{`
                @keyframes nf-pulse {
                    0%, 100% { opacity: 0.45; transform: scale(1); }
                    50%       { opacity: 0.65; transform: scale(1.04); }
                }
                @keyframes nf-glitch {
                    0%,  90%, 100% { clip-path: none; transform: translate(0,0); }
                    91%            { clip-path: polygon(0 10%, 100% 10%, 100% 30%, 0 30%); transform: translate(-4px, 0); }
                    93%            { clip-path: polygon(0 55%, 100% 55%, 100% 75%, 0 75%); transform: translate(4px, 0); }
                    95%            { clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%); transform: translate(-3px, 0); }
                    97%            { clip-path: none; transform: translate(0,0); }
                }
                @keyframes nf-slide {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes nf-blink {
                    0%, 100% { opacity: 1; }
                    50%      { opacity: 0.3; }
                }
                @keyframes nf-float {
                    0%, 100% { transform: translateY(0px) rotate(-1deg); }
                    50%      { transform: translateY(-8px) rotate(1deg); }
                }
                @keyframes nf-eye-blink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    95%           { transform: scaleY(0.1); }
                }
            `}</style>
        </div>
    );
}

function HomeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function BackIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function BearIllustration({ isDark }) {
    const bodyColor  = isDark ? '#1E3A5F' : '#DBEAFE';
    const bodyStroke = isDark ? '#60A5FA' : '#3B82F6';
    const bellyColor = isDark ? '#172554' : '#EFF6FF';
    const earInner   = isDark ? '#2563EB' : '#93C5FD';
    const eyeColor   = isDark ? '#E0F2FE' : '#1E3A5F';
    const eyeShine   = isDark ? '#60A5FA' : '#BFDBFE';
    const snoutColor = isDark ? '#1D4ED8' : '#BFDBFE';
    const noseColor  = isDark ? '#E0F2FE' : '#1E3A5F';
    const starColor  = isDark ? '#7DD3FC' : '#818CF8';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 110"
            width="110" height="92" aria-hidden="true">
            <defs>
                <linearGradient id="bearScarf" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
            </defs>

            {/* glow shadow */}
            <ellipse cx="65" cy="95" rx="32" ry="6"
                fill={isDark ? 'rgba(56,189,248,0.12)' : 'rgba(99,102,241,0.13)'} />

            {/* tail */}
            <ellipse cx="93" cy="87" rx="7" ry="5.5"
                fill={bodyColor} stroke={bodyStroke} strokeWidth="1.2" />

            {/* body */}
            <ellipse cx="65" cy="82" rx="26" ry="21"
                fill={bodyColor} stroke={bodyStroke} strokeWidth="1.4" />

            {/* belly */}
            <ellipse cx="65" cy="84" rx="14" ry="13"
                fill={bellyColor} stroke={bodyStroke} strokeWidth="0.8" strokeOpacity="0.5" />

            {/* scarf */}
            <rect x="41" y="65" width="48" height="8" rx="4" fill="url(#bearScarf)" />
            <circle cx="65" cy="69" r="4.5" fill="#818CF8" stroke="#3B82F6" strokeWidth="1" />

            {/* left ear */}
            <circle cx="43" cy="36" r="11"
                fill={bodyColor} stroke={bodyStroke} strokeWidth="1.4" />
            <circle cx="43" cy="36" r="6.5" fill={earInner} />

            {/* right ear */}
            <circle cx="87" cy="36" r="11"
                fill={bodyColor} stroke={bodyStroke} strokeWidth="1.4" />
            <circle cx="87" cy="36" r="6.5" fill={earInner} />

            {/* head */}
            <circle cx="65" cy="54" r="23"
                fill={bodyColor} stroke={bodyStroke} strokeWidth="1.4" />

            {/* left arm */}
            <ellipse cx="41" cy="82" rx="8" ry="12" transform="rotate(-20 41 82)"
                fill={bodyColor} stroke={bodyStroke} strokeWidth="1.2" />
            <ellipse cx="35" cy="90" rx="5" ry="4"
                fill={bellyColor} stroke={bodyStroke} strokeWidth="0.8" strokeOpacity="0.5" />

            {/* right arm */}
            <ellipse cx="89" cy="82" rx="8" ry="12" transform="rotate(20 89 82)"
                fill={bodyColor} stroke={bodyStroke} strokeWidth="1.2" />
            <ellipse cx="95" cy="90" rx="5" ry="4"
                fill={bellyColor} stroke={bodyStroke} strokeWidth="0.8" strokeOpacity="0.5" />

            {/* snout */}
            <ellipse cx="65" cy="61" rx="10" ry="7.5"
                fill={snoutColor} stroke={bodyStroke} strokeWidth="0.9" />

            {/* nose */}
            <ellipse cx="65" cy="56" rx="4.5" ry="3" fill={noseColor} />

            {/* mouth */}
            <path d="M59 63 Q65 69 71 63"
                stroke={bodyStroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />

            {/* left eye */}
            <g style={{ transformOrigin: '55px 48px', animation: 'nf-eye-blink 4s ease-in-out infinite' }}>
                <circle cx="55" cy="48" r="5" fill={eyeColor} />
                <circle cx="56.5" cy="46.5" r="1.5" fill={eyeShine} />
            </g>

            {/* right eye */}
            <g style={{ transformOrigin: '75px 48px', animation: 'nf-eye-blink 4s ease-in-out infinite' }}>
                <circle cx="75" cy="48" r="5" fill={eyeColor} />
                <circle cx="76.5" cy="46.5" r="1.5" fill={eyeShine} />
            </g>

            {/* floating stars */}
            <text x="10" y="28" fontSize="10" fill={starColor} opacity="0.85"
                style={{ animation: 'nf-blink 2.1s ease-in-out infinite' }}>✦</text>
            <text x="108" y="22" fontSize="8" fill={starColor} opacity="0.75"
                style={{ animation: 'nf-blink 2.7s ease-in-out infinite' }}>✦</text>
            <text x="100" y="50" fontSize="6" fill={starColor} opacity="0.65"
                style={{ animation: 'nf-blink 3.3s ease-in-out infinite' }}>✶</text>
        </svg>
    );
}
