import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, SplitText, scrollToId, prefersReducedMotion } from '../hooks/scroll';
import { hero, profile } from '../data/content';
import PiCurve from '../components/PiCurve';
import Magnet from '../components/Magnet';

// Typewriter that cycles through the roles (React Bits' TextType, trimmed down).
function TypedRoles({ items, run }) {
  const [text, setText] = useState(items[0]);
  useEffect(() => {
    if (!run || prefersReducedMotion()) return;
    let i = 0;
    let c = items[0].length;
    let mode = 'del'; // first word is already shown in full
    let t;
    const step = () => {
      if (mode === 'del') {
        c -= 1;
        if (c <= 0) {
          i = (i + 1) % items.length;
          mode = 'type';
        }
      } else {
        c += 1;
        if (c >= items[i].length) mode = 'del';
      }
      setText(items[i].slice(0, Math.max(0, c)));
      t = setTimeout(step, mode === 'del' && c >= items[i].length ? 2200 : mode === 'del' ? 26 : 55);
    };
    t = setTimeout(step, 3200);
    return () => clearTimeout(t);
  }, [items, run]);
  return (
    <span className="typed" aria-live="off">
      {text}
      <span className="typed__caret" aria-hidden="true" />
    </span>
  );
}

export default function Hero({ ready }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      const split = SplitText.create('.hero__name', { type: 'chars', mask: 'chars' });
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(split.chars, { yPercent: 110, duration: 1.4, stagger: 0.05 })
        .from('.hero__curve', { scale: 0.7, autoAlpha: 0, rotate: -40, duration: 2.2 }, 0)
        .from('.hero [data-in]', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.35);

      // on the way out the rosette spins away and the name drifts up — a scrubbed parallax
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } })
        .to('.hero__curve', { rotate: 50, scale: 1.25, autoAlpha: 0.15, ease: 'none' }, 0)
        .to('.hero__name', { yPercent: -35, ease: 'none' }, 0)
        .to('.hero__top', { y: -80, autoAlpha: 0, ease: 'none' }, 0);
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section className="hero" id="home" ref={root} aria-label="Introduction">
      <div className="hero__curve" aria-hidden={false}>
        <PiCurve auto speed={1.25} trailTurns={80} />
      </div>

      <div className="hero__top">
        <p className="hero__status" data-in>
          <span className="pulse" aria-hidden="true" />
          {profile.status} — MMU · CGPA {profile.cgpa}
        </p>
        <p className="hero__tagline" data-in>
          {hero.tagline}
        </p>
        <button className="hero__scroll" onClick={() => scrollToId('pi')} data-in>
          <span className="hero__scroll-line" aria-hidden="true" />
          Scroll — the line never closes
        </button>
      </div>

      <div className="hero__bottom">
        <h1 className="hero__name" aria-label={profile.fullName}>
          {profile.name}
        </h1>
        <div className="hero__row">
          <p className="hero__role" data-in>
            <TypedRoles items={hero.roles} run={ready} />
          </p>
          <div className="hero__ctas" data-in>
            <Magnet>
              <a
                href="#projects"
                className="btn"
                data-cursor="go"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId('projects');
                }}
              >
                See my work
              </a>
            </Magnet>
            <Magnet>
              <button className="btn btn--ghost" onClick={() => window.dispatchEvent(new CustomEvent('zhbot:open'))} data-cursor="chat">
                Ask ZH-bot
              </button>
            </Magnet>
          </div>
        </div>
      </div>

    </section>
  );
}
