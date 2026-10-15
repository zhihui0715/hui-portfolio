import { useEffect, useRef } from 'react';
import { gsap } from '../hooks/scroll';

// Pulls its child toward the pointer when it comes near (React Bits' Magnet, rebuilt on gsap.quickTo).
export default function Magnet({ children, strength = 0.35, padding = 60, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding;
      xTo(near ? dx * strength : 0);
      yTo(near ? dy * strength : 0);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [strength, padding]);

  return (
    <span ref={ref} className={`magnet ${className}`}>
      {children}
    </span>
  );
}
