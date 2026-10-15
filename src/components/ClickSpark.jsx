import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/scroll';

// Page-wide click sparks, after React Bits' ClickSpark: eight rays burst and fade from every click.
export default function ClickSpark({ count = 8, radius = 22, duration = 420 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let raf = 0;
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const loop = (now) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      sparks = sparks.filter((s) => now - s.t < duration);
      const c = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.6;
      for (const s of sparks) {
        const p = (now - s.t) / duration;
        const e = p * (2 - p);
        const d = e * radius;
        const len = 9 * (1 - e);
        ctx.beginPath();
        ctx.moveTo(s.x + d * Math.cos(s.a), s.y + d * Math.sin(s.a));
        ctx.lineTo(s.x + (d + len) * Math.cos(s.a), s.y + (d + len) * Math.sin(s.a));
        ctx.stroke();
      }
      raf = sparks.length ? requestAnimationFrame(loop) : 0;
    };
    const click = (e) => {
      const t = performance.now();
      for (let i = 0; i < count; i++) sparks.push({ x: e.clientX, y: e.clientY, a: (Math.PI * 2 * i) / count, t });
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('click', click);
    window.addEventListener('resize', size);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('click', click);
      window.removeEventListener('resize', size);
    };
  }, [count, radius, duration]);

  return <canvas ref={ref} className="click-spark" aria-hidden="true" />;
}
