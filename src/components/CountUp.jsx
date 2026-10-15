import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../hooks/scroll';

export default function CountUp({ to, decimals = 0, duration = 2, className = '', suffix = '' }) {
  const ref = useRef(null);
  useGSAP(() => {
    const el = ref.current;
    if (prefersReducedMotion()) return;
    const o = { v: 0 };
    el.textContent = (0).toFixed(decimals) + suffix;
    gsap.to(o, {
      v: to,
      duration,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => (el.textContent = o.v.toFixed(decimals) + suffix),
    });
  });
  return (
    <span ref={ref} className={className}>
      {Number(to).toFixed(decimals)}
      {suffix}
    </span>
  );
}
