import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutDeveloper.css';

/* ── Developer info ── */
const DEV = {
  name:     'Yogesh Verma',
  role:     'Full Stack Developer',
  company:  'Software Engineer @S&P Global',
  bio:      'Built DevCrux — A full-stack learning platform from scratch.',
  image:    '/developer.jpg',
  initials: 'YV',
  social: [
    { name: 'GitHub',    icon: GithubIcon,    url: 'https://github.com/yogi-verma',            color: '#c9d1d9' },
    { name: 'LinkedIn',  icon: LinkedinIcon,  url: 'https://www.linkedin.com/in/pys123',        color: '#0A66C2' },
    { name: 'LeetCode',  icon: LeetcodeIcon,  url: 'https://leetcode.com/u/yogi-verma',         color: '#FFA116' },
    { name: 'Instagram', icon: InstagramIcon, url: 'https://instagram.com/yourusername',         color: '#E1306C' },
  ],
};

/* ─────────────────────────── SVG Icons ─────────────────────────── */
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function LeetcodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

/* ─────────────────────── Matrix Rain Canvas ─────────────────────── */
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const fontSize = 12;
    const chars = 'アイウエオカキ01{}[]<>/\\コ89AB$#';
    let drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.96 ? '#9bffb0' : '#00c832';
        ctx.globalAlpha = Math.random() * 0.5 + 0.15;
        ctx.fillText(ch, i * fontSize, y * fontSize);
        ctx.globalAlpha = 1;
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const id = setInterval(draw, 45);
    return () => { clearInterval(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="adev-matrix" />;
}

/* ─────────────────────── Typing Hook ─────────────────────── */
function useTypingSequence(lines, started) {
  const [rendered, setRendered] = useState([]);
  const [lineIdx, setLineIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (!started) return;
    if (lineIdx >= lines.length) { setDone(true); return; }
    const line = lines[lineIdx];
    if (line.type !== 'cmd') {
      const t = setTimeout(() => {
        setRendered(p => [...p, line]);
        setLineIdx(p => p + 1);
        setCharIdx(0);
      }, line.delay ?? 180);
      return () => clearTimeout(t);
    }
    if (charIdx < line.text.length) {
      const t = setTimeout(() => setCharIdx(p => p + 1), line.speed ?? 50);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setRendered(p => [...p, line]);
      setLineIdx(p => p + 1);
      setCharIdx(0);
    }, 280);
    return () => clearTimeout(t);
  }, [started, lineIdx, charIdx, lines]);

  const active = lineIdx < lines.length ? lines[lineIdx] : null;
  const typing = active?.type === 'cmd' ? active.text.slice(0, charIdx) : '';
  return { rendered, isTyping: active?.type === 'cmd', typing, done };
}

/* ─────────────────────── Main Component ─────────────────────── */
const LINES = [
  { type: 'cmd',     text: 'whoami',                      speed: 75 },
  { type: 'output',  text: 'Yogesh Verma',                 delay: 90 },
  { type: 'cmd',     text: 'cat ./role.txt',               speed: 60 },
  { type: 'output',  text: 'Full Stack Developer',         delay: 90 },
  { type: 'cmd',     text: 'echo $EMPLOYER',               speed: 65 },
  { type: 'success', text: 'S&P Global — Software Eng.',   delay: 100 },
  { type: 'cmd',     text: 'cat ./bio.md',                 speed: 55 },
  { type: 'output',  text: 'Built DevCrux from scratch.',  delay: 110 },
  { type: 'cmd',     text: 'git log --oneline -1',         speed: 48 },
  { type: 'sha',     text: 'f4a9c2e  🚀  DevCrux - Full Stack Solution',   delay: 100 },
];

const BOOT = [
  'Booting  portfolio.sh  v2.0 ...',
  'Mounting  /dev/yogesh  →  OK',
  'ENV loaded.  Ready.',
  '',
];

export default function AboutDeveloper() {
  const bodyRef = useRef(null);
  const navigate = useNavigate();
  const [imgErr, setImgErr]         = useState(false);
  const [booted, setBooted]         = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [bootLines, setBootLines]   = useState([]);
  const [hovered, setHovered]       = useState(null);

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i < BOOT.length) {
        setBootLines(p => [...p, BOOT[i++]]);
        setTimeout(tick, i === BOOT.length ? 500 : 220);
      } else {
        setTimeout(() => { setBooted(true); setShowTerminal(true); }, 300);
      }
    };
    setTimeout(tick, 250);
  }, []);

  const { rendered, isTyping, typing, done } = useTypingSequence(LINES, showTerminal);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [rendered, typing]);

  return (
    <section className="adev-section">
      <MatrixRain />
      <div className="adev-orb adev-orb1" />
      <div className="adev-orb adev-orb2" />

      <button
        onClick={() => navigate('/dashboard')}
        className="adev-back-btn"
        aria-label="Back to dashboard"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M5 12l7 7M5 12l7-7" />
        </svg>
        <span>cd&nbsp;..</span>
      </button>

      <div className="adev-layout">

        {/* ══ LEFT — Identity card ══ */}
        <div className="adev-card">
          <span className="adev-corner adev-c-tl" />
          <span className="adev-corner adev-c-tr" />
          <span className="adev-corner adev-c-bl" />
          <span className="adev-corner adev-c-br" />

          <div className="adev-avatar-wrap">
            <div className="adev-avatar-inner">
              {!imgErr
                ? <img src={DEV.image} alt={DEV.name} className="adev-avatar-img" onError={() => setImgErr(true)} />
                : <div className="adev-avatar-fb"><span>{DEV.initials}</span></div>
              }
            </div>
            <svg className="adev-ring-svg" viewBox="0 0 110 110">
              <circle className="adev-ring-track" cx="55" cy="55" r="50" />
              <circle className="adev-ring-spin"  cx="55" cy="55" r="50" />
            </svg>
          </div>

          <div className="adev-card-info">
            <h2 className="adev-name">
              {DEV.name.split('').map((ch, i) => (
                <span key={i} className="adev-name-ch" style={{ animationDelay: `${0.6 + i * 0.04}s` }}>
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </h2>

            <div className="adev-role-tag">
              <span className="adev-role-bracket">{'</'}</span>
              <span className="adev-role-text">{DEV.role}</span>
              <span className="adev-role-bracket">{'>'}</span>
            </div>

            <div className="adev-status-pill">
              <span className="adev-pulse-dot" />
              <span className="adev-status-text">ONLINE</span>
              <span className="adev-status-sep">·</span>
              <span className="adev-status-co">S&amp;P Global</span>
            </div>
          </div>

          <div className="adev-divider" />

          <div className="adev-socials">
            {DEV.social.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="adev-social-btn"
                  style={{ '--sc': s.color }}
                  onMouseEnter={() => setHovered(s.name)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Icon />
                  <span className={`adev-tooltip ${hovered === s.name ? 'adev-tooltip-show' : ''}`}>
                    {s.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* ══ RIGHT — Terminal ══ */}
        <div className="adev-terminal">
          <div className="adev-titlebar">
            <div className="adev-dots">
              <span className="adev-dot adev-dot-r" />
              <span className="adev-dot adev-dot-y" />
              <span className="adev-dot adev-dot-g" />
            </div>
            <span className="adev-title-str">
              <span className="adev-t-user">yogesh</span>
              <span className="adev-t-sym">@</span>
              <span className="adev-t-host">devcrux</span>
              <span className="adev-t-sym">:</span>
              <span className="adev-t-path">~/portfolio</span>
              <span className="adev-t-sym2"> — zsh</span>
            </span>
            <span className="adev-tb-blinker" />
          </div>

          <div className="adev-body" ref={bodyRef}>
            <div className="adev-scanlines" />

            {!booted && (
              <div className="adev-boot">
                {bootLines.map((line, i) => (
                  <div key={i} className="adev-boot-line">
                    {line && <><span className="adev-boot-ok">[  OK  ]</span>{' '}</>}
                    <span className="adev-boot-msg">{line}</span>
                  </div>
                ))}
                {bootLines.length < BOOT.length && <span className="adev-cursor">█</span>}
              </div>
            )}

            {showTerminal && (
              <div className={`adev-lines ${booted ? 'adev-fadein' : ''}`}>
                {rendered.map((line, i) => (
                  <div key={i} className={`adev-line adev-line-${line.type} adev-line-enter`}
                       style={{ animationDelay: `${i * 0.02}s` }}>
                    {line.type === 'cmd'     && <Prompt />}
                    {line.type === 'output'  && <span className="adev-sym adev-sym-out">▸&nbsp;</span>}
                    {line.type === 'success' && <span className="adev-sym adev-sym-ok">✔&nbsp;</span>}
                    {line.type === 'sha'     && <span className="adev-sym adev-sym-sha">◆&nbsp;</span>}
                    <span className={`adev-ltext adev-ltext-${line.type}`}>{line.text}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="adev-line adev-line-cmd">
                    <Prompt />
                    <span className="adev-ltext adev-ltext-cmd">{typing}</span>
                    <span className="adev-cursor">█</span>
                  </div>
                )}

                {done && (
                  <div className="adev-line adev-line-cmd">
                    <Prompt />
                    <span className="adev-cursor">█</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="adev-term-footer">
            <span className="adev-tf-item adev-tf-branch">⎇&nbsp; main</span>
            <span className="adev-tf-sep">│</span>
            <span className="adev-tf-item">node v20</span>
            <span className="adev-tf-sep">│</span>
            <span className="adev-tf-item adev-tf-time" id="adev-clock">--:--:--</span>
            <span className="adev-tf-right">
              <span className="adev-tf-ok">● UTF-8</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

function Prompt() {
  return (
    <span className="adev-prompt">
      <span className="adev-p-usr">yogesh</span>
      <span className="adev-p-sym">@</span>
      <span className="adev-p-hst">devcrux</span>
      <span className="adev-p-sym">:</span>
      <span className="adev-p-pth">~</span>
      <span className="adev-p-dlr"> $&nbsp;</span>
    </span>
  );
}

/* Live clock */
(function startClock() {
  if (typeof window === 'undefined') return;
  const tick = () => {
    const el = document.getElementById('adev-clock');
    if (el) el.textContent = new Date().toLocaleTimeString('en-GB');
    setTimeout(tick, 1000);
  };
  setTimeout(tick, 600);
})();
