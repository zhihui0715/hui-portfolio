import { useCallback, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../hooks/scroll';
import { piStory } from '../data/content';
import { closingTurns, PI_DIGITS } from '../data/pi';
import PiCurve from '../components/PiCurve';
import { useReveal } from '../hooks/useReveal';

const TAU = Math.PI * 2;
const STORY_TURNS = 48;

// distance from the start point (1,0) after k whole turns of the first arm
function returnGap(omega, k) {
  const a = TAU * k * omega;
  const x = 0.5 + 0.5 * Math.cos(a);
  const y = 0.5 * Math.sin(a);
  return Math.hypot(x - 1, y);
}

const RATIOS = [
  { label: '2', value: 2, note: 'whole number' },
  { label: '5/2', value: 2.5, note: 'fraction' },
  { label: '7/3', value: 7 / 3, note: 'fraction' },
  { label: 'π', value: Math.PI, note: 'irrational' },
  { label: 'e', value: Math.E, note: 'irrational' },
  { label: 'φ', value: (1 + Math.sqrt(5)) / 2, note: 'irrational' },
  { label: '√2', value: Math.SQRT2, note: 'irrational' },
];

function RatioToy() {
  const omegaRef = useRef(Math.PI);
  const progressRef = useRef(0);
  const tween = useRef(null);
  const [pick, setPick] = useState(RATIOS[3]);
  const q = useMemo(() => closingTurns(pick.value, 64), [pick]);
  const turns = q ?? 40;

  const play = useCallback((r) => {
    omegaRef.current = r.value;
    setPick(r);
    tween.current?.kill();
    progressRef.current = 0;
    const closes = closingTurns(r.value, 64);
    tween.current = gsap.to(progressRef, {
      current: 1,
      duration: prefersReducedMotion() ? 0.01 : closes ? 2.4 + closes * 0.5 : 9,
      ease: closes ? 'power2.inOut' : 'none',
    });
  }, []);

  useGSAP(() => {
    tween.current = gsap.to(progressRef, {
      current: 1,
      duration: 9,
      ease: 'none',
      scrollTrigger: { trigger: '.toy', start: 'top 70%', once: true },
    });
  });

  return (
    <div className="toy" data-fade-group>
      <div className="toy__text">
        <h3 className="toy__title" data-split>
          Try it yourself.
        </h3>
        <p data-fade>
          Change how fast the second arm spins. Give it a ratio you can write as a fraction and the line closes, then repeats the same path forever. Give it an
          irrational number like π and it keeps finding somewhere new to go.
        </p>
        <div className="toy__picks" role="radiogroup" aria-label="Speed ratio of the second arm" data-fade>
          {RATIOS.map((r) => (
            <button
              key={r.label}
              role="radio"
              aria-checked={pick.label === r.label}
              className={`chip ${pick.label === r.label ? 'is-on' : ''}`}
              onClick={() => play(r)}
              data-cursor="draw"
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className={`toy__verdict ${q ? 'is-closed' : 'is-open'}`} aria-live="polite" data-fade>
          {q ? (
            <>
              <strong>ω = {pick.label}</strong> closes after {q} {q === 1 ? 'turn' : 'turns'} — and then it can only repeat itself.
            </>
          ) : (
            <>
              <strong>ω = {pick.label}</strong> never closes. However long you wait, it never lands on the same point twice.
            </>
          )}
        </p>
      </div>
      <div className="toy__stage" data-fade>
        <PiCurve omegaRef={omegaRef} progressRef={progressRef} maxTurns={turns} label={`The curve with ratio ${pick.label}`} />
      </div>
    </div>
  );
}

export default function PiStory() {
  const root = useRef(null);
  const progressRef = useRef(0);
  const thetaEl = useRef(null);
  const gapEl = useRef(null);
  const turnEl = useRef(null);

  // best (smallest) return gap after each whole turn, so the readout can say "closest yet"
  const minGaps = useMemo(() => {
    const out = [Infinity];
    let m = Infinity;
    for (let k = 1; k <= STORY_TURNS + 1; k++) {
      m = Math.min(m, returnGap(Math.PI, k));
      out.push(m);
    }
    return out;
  }, []);

  const onTheta = useCallback(
    (th) => {
      if (!thetaEl.current) return;
      const k = Math.floor(th / TAU);
      thetaEl.current.textContent = th.toFixed(2);
      turnEl.current.textContent = k;
      gapEl.current.textContent = k >= 1 ? minGaps[Math.min(k, minGaps.length - 1)].toFixed(5) : '—';
    },
    [minGaps]
  );

  useReveal(root, (el) => {
    const mm = gsap.matchMedia();
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
      ({ conditions }) => {
        if (conditions.reduce) {
          progressRef.current = 1;
          return;
        }
        const steps = gsap.utils.toArray('.story__step', el);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.story__pin',
            start: 'top top',
            end: `+=${steps.length * 85}%`,
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => (progressRef.current = self.progress),
          },
        });
        gsap.set(steps.slice(1), { autoAlpha: 0, yPercent: 30 });
        steps.forEach((s, i) => {
          if (i === 0) return;
          tl.to(steps[i - 1], { autoAlpha: 0, yPercent: -30, duration: 0.5 }, i)
            .to(s, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, i + 0.15)
            .to('.story__bar-fill', { scaleX: (i + 1) / steps.length, duration: 0.5, ease: 'none' }, i);
        });
        tl.to({}, { duration: 0.6 });
      }
    );
  });

  return (
    <section className="story" id="pi" ref={root} aria-labelledby="pi-title">
      <div className="story__pin">
        <div className="story__text">
          <h2 id="pi-title" className="story__formula">
            <span className="sr-only">z of theta equals e to the i theta plus e to the i pi theta</span>
            <span aria-hidden="true">
              z(θ) = e<sup>iθ</sup> + e<sup>iπθ</sup>
            </span>
          </h2>
          <div className="story__steps">
            {piStory.map((s) => (
              <p key={s.k} className="story__step">
                {s.text}
              </p>
            ))}
          </div>
          <div className="story__bar" aria-hidden="true">
            <span className="story__bar-fill" />
          </div>
          <dl className="story__readout">
            <div>
              <dt>θ</dt>
              <dd ref={thetaEl}>0.00</dd>
            </div>
            <div>
              <dt>turns</dt>
              <dd ref={turnEl}>0</dd>
            </div>
            <div>
              <dt>closest return</dt>
              <dd ref={gapEl}>—</dd>
            </div>
          </dl>
        </div>
        <div className="story__stage">
          <PiCurve progressRef={progressRef} maxTurns={STORY_TURNS} onTheta={onTheta} />
        </div>
      </div>

      <RatioToy />

      <p className="story__digits" aria-label="The first 300 digits of pi">
        {PI_DIGITS.slice(0, 302)}…
      </p>
    </section>
  );
}
