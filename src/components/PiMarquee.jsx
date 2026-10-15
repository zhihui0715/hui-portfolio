import { useRef } from 'react';
import { gsap, useGSAP, scrollState, prefersReducedMotion } from '../hooks/scroll';
import { PI_DIGITS } from '../data/pi';

// An endless strip whose speed and direction follow scroll velocity (React Bits' ScrollVelocity, on the GSAP ticker).
export default function PiMarquee({ from = 0, length = 220, reverse = false, text, className = '' }) {
  const root = useRef(null);
  const track = useRef(null);
  const content = text || PI_DIGITS.slice(from, from + length);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      let x = 0;
      let dir = reverse ? 1 : -1;
      const skew = gsap.quickSetter(track.current, 'skewX', 'deg');
      const setX = gsap.quickSetter(track.current, 'x', 'px');
      const tick = (_, dt) => {
        const v = scrollState.velocity;
        if (Math.abs(v) > 0.5) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
        const speed = 40 + Math.min(900, Math.abs(v) * 30);
        x += dir * speed * (dt / 1000);
        const half = track.current.scrollWidth / 2;
        if (half > 0) {
          if (x <= -half) x += half;
          if (x > 0) x -= half;
        }
        setX(x);
        skew(gsap.utils.clamp(-8, 8, -v * 0.25));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root }
  );

  return (
    <div className={`marquee ${className}`} ref={root} aria-hidden="true">
      <div className="marquee__track" ref={track}>
        <span>{content}&nbsp;</span>
        <span>{content}&nbsp;</span>
      </div>
    </div>
  );
}
