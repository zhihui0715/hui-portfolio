import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../hooks/scroll';
import { PI_DIGITS } from '../data/pi';
import PiCurve from './PiCurve';

// π streams in while the curve starts tracing; the counter climbs, then the curtain splits.
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const digitsRef = useRef(null);
  const countRef = useRef(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        onDone();
        setGone(true);
        return;
      }
      const state = { n: 0, d: 2 };
      const tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.from('.pre__curve', { scale: 0.6, opacity: 0, duration: 1.2, ease: 'expo.out' })
        .to(
          state,
          {
            n: 100,
            d: 160,
            duration: 2.1,
            ease: 'power2.inOut',
            onUpdate: () => {
              countRef.current.textContent = String(Math.round(state.n)).padStart(3, '0');
              digitsRef.current.textContent = PI_DIGITS.slice(0, Math.round(state.d));
            },
          },
          0.1
        )
        .to('.pre__line', { yPercent: -110, duration: 0.6, ease: 'power3.in', stagger: 0.05 }, '-=0.2')
        .add(() => onDone(), '-=0.25')
        .to('.pre__panel--top', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '<')
        .to('.pre__panel--bottom', { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<')
        .to('.pre__curve', { scale: 2.4, opacity: 0, duration: 1, ease: 'expo.inOut' }, '<');
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div className="pre" ref={root} role="status" aria-label="Loading">
      <div className="pre__panel pre__panel--top" />
      <div className="pre__panel pre__panel--bottom" />
      <div className="pre__curve">
        <PiCurve auto speed={9} trailTurns={60} arms={false} lineWidth={0.9} label="" />
      </div>
      <div className="pre__meta">
        <div className="pre__mask">
          <p className="pre__line pre__name">Zhi Hui</p>
        </div>
        <div className="pre__mask">
          <p className="pre__line pre__count" ref={countRef}>
            000
          </p>
        </div>
      </div>
      <div className="pre__mask pre__digits-wrap">
        <p className="pre__line pre__digits" ref={digitsRef}>
          3.
        </p>
      </div>
    </div>
  );
}
