import { useEffect, useRef } from 'react';

/* ─── floating orb canvas ───────────────────────────────────────────────── */
export function OrbCanvas({ isDark = true }) {
    const ref = useRef(null);

    // dark: cool blues/cyans; light: blues/sky-blues only
    const darkHues  = [205, 217, 240, 260];
    const lightHues = [200, 205, 210, 220];

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;

        const hues = isDark ? darkHues : lightHues;

        // Use the parent's bounding rect so absolute-positioned canvas
        // always gets real pixel dimensions, even on first render.
        const resize = () => {
            const parent = canvas.parentElement;
            const w = parent ? parent.getBoundingClientRect().width  : window.innerWidth;
            const h = parent ? parent.getBoundingClientRect().height : window.innerHeight;
            canvas.width  = w || window.innerWidth;
            canvas.height = h || window.innerHeight;
        };
        resize();

        // ResizeObserver keeps canvas in sync when the container resizes
        // (layout shifts, sidebar open/close, orientation change, etc.)
        const ro = new ResizeObserver(resize);
        if (canvas.parentElement) ro.observe(canvas.parentElement);
        window.addEventListener('resize', resize);

        const orbs = Array.from({ length: 18 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 2 + Math.random() * 4,
            dx: (Math.random() - 0.5) * 0.6,
            dy: (Math.random() - 0.5) * 0.6,
            // lighter alpha in light mode so orbs stay subtle
            alpha: isDark
                ? 0.15 + Math.random() * 0.35
                : 0.08 + Math.random() * 0.18,
            hue: hues[Math.floor(Math.random() * hues.length)],
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            orbs.forEach(o => {
                o.x += o.dx;
                o.y += o.dy;
                if (o.x < 0 || o.x > canvas.width) o.dx *= -1;
                if (o.y < 0 || o.y > canvas.height) o.dy *= -1;

                // light mode: higher lightness so orbs blend with white bg
                const lightness = isDark ? 65 : 72;
                const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 8);
                grad.addColorStop(0, `hsla(${o.hue}, 85%, ${lightness}%, ${o.alpha})`);
                grad.addColorStop(1, `hsla(${o.hue}, 85%, ${lightness}%, 0)`);
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.r * 8, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, [isDark]);

    return (
        <canvas
            ref={ref}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden
        />
    );
}

/* ─── grid-dot pattern ──────────────────────────────────────────────────── */
export function GridDots({ isDark }) {
    return (
        <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage: isDark
                    ? 'radial-gradient(circle, rgba(96,165,250,0.12) 1px, transparent 1px)'
                    : 'radial-gradient(circle, rgba(99,102,241,0.30) 1.5px, transparent 1.5px)',
                backgroundSize: '32px 32px',
            }}
        />
    );
}

/* ─── top radial glow ───────────────────────────────────────────────────── */
export function TopGlow({ isDark }) {
    return (
        <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[30vh] min-h-[200px] rounded-full pointer-events-none"
            style={{
                background: isDark
                    ? 'radial-gradient(ellipse at top, rgba(56,189,248,0.18) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse at top, rgba(56,189,248,0.22) 0%, rgba(59,130,246,0.12) 50%, transparent 70%)',
            }}
        />
    );
}

/* ─── convenience wrapper — renders all three layers ───────────────────── */
export default function AnimatedBackground({ isDark }) {
    return (
        <>
            <GridDots isDark={isDark} />
            <OrbCanvas isDark={isDark} />
            <TopGlow isDark={isDark} />
        </>
    );
}
