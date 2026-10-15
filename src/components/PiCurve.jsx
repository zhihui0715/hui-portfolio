import { useEffect, useRef } from 'react';
import { curvePoint } from '../data/pi';
import { prefersReducedMotion } from '../hooks/scroll';

const TAU = Math.PI * 2;

function readColors(el) {
  const cs = getComputedStyle(el);
  return {
    line: cs.getPropertyValue('--curve').trim() || '#e9ecf5',
    accent: cs.getPropertyValue('--accent').trim() || '#ffd27a',
    arm: cs.getPropertyValue('--curve-arm').trim() || 'rgba(255,255,255,.5)',
  };
}

/**
 * Draws z(θ) = e^{iθ} + e^{iωθ} on a canvas.
 * - auto: θ advances with time and a long trail stays on screen (the hero rosette)
 * - progressRef: θ follows an external 0..1 value (scroll scrub)
 * - omegaRef: lets a parent change ω without re-rendering (the live toy)
 */
export default function PiCurve({
  omega = Math.PI,
  omegaRef,
  progressRef,
  auto = false,
  speed = 1.6,
  trailTurns = 70,
  maxTurns = 60,
  arms = true,
  lineWidth = 1.1,
  className = '',
  label = 'The curve z(θ) = e^{iθ} + e^{iπθ}, which never closes because π is irrational',
  onTheta,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    let colors = readColors(canvas);
    let visible = true;
    let raf = 0;
    let theta = auto ? TAU * 6 : 0;
    let last = performance.now();
    const reduced = prefersReducedMotion();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
    };

    const draw = (thNow) => {
      const om = omegaRef ? omegaRef.current : omega;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h / 2;
      const start = auto ? Math.max(0, thNow - TAU * trailTurns) : 0;
      const span = thNow - start;
      if (span <= 0) return;
      const step = 0.045;
      const n = Math.ceil(span / step);
      const chunks = auto ? 14 : 1;
      const per = Math.ceil(n / chunks);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let c = 0; c < chunks; c++) {
        const i0 = c * per;
        const i1 = Math.min(n, i0 + per + 1);
        if (i0 >= n) break;
        const a = auto ? 0.12 + 0.88 * ((c + 1) / chunks) : 1;
        ctx.beginPath();
        for (let i = i0; i <= i1; i++) {
          const t = Math.min(thNow, start + i * step);
          const [x, y] = curvePoint(t, om);
          const px = cx + x * R;
          const py = cy - y * R;
          i === i0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        // soft halo under a crisp core line — the "glow" without shadowBlur cost
        ctx.globalAlpha = a * 0.16;
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = lineWidth * 4.5;
        ctx.stroke();
        ctx.globalAlpha = a * 0.9;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (arms) {
        const j1 = [cx + 0.5 * Math.cos(thNow) * R, cy - 0.5 * Math.sin(thNow) * R];
        const [tx, ty] = curvePoint(thNow, om);
        const tip = [cx + tx * R, cy - ty * R];
        ctx.strokeStyle = colors.arm;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(j1[0], j1[1]);
        ctx.lineTo(tip[0], tip[1]);
        ctx.stroke();
        ctx.fillStyle = colors.arm;
        for (const [x, y, r] of [
          [cx, cy, 2.5],
          [j1[0], j1[1], 2.5],
        ]) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, TAU);
          ctx.fill();
        }
        ctx.fillStyle = colors.accent;
        ctx.globalAlpha = 0.25;
        ctx.beginPath();
        ctx.arc(tip[0], tip[1], 9, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(tip[0], tip[1], 3.2, 0, TAU);
        ctx.fill();
      }
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      if (progressRef) theta = Math.max(0.0001, progressRef.current * TAU * maxTurns);
      else if (auto) theta += dt * speed;
      onTheta?.(theta);
      draw(theta);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(auto ? TAU * trailTurns : TAU * maxTurns);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      colors = readColors(canvas);
      if (reduced) draw(auto ? TAU * trailTurns : TAU * maxTurns);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    resize();
    if (reduced && !omegaRef) draw(auto ? TAU * trailTurns : TAU * maxTurns);
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
    };
  }, [omega, omegaRef, progressRef, auto, speed, trailTurns, maxTurns, arms, lineWidth, onTheta]);

  return <canvas ref={canvasRef} className={`pi-curve ${className}`} role="img" aria-label={label} />;
}
