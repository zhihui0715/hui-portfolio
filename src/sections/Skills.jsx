import { useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../hooks/scroll';
import { useReveal } from '../hooks/useReveal';
import { skills } from '../data/content';

const RING = { learning: 0.42, ctf: 0.68, roadmap: 0.94 };
const DUR = { learning: 38, ctf: 60, roadmap: 90 };

export default function Skills() {
  const root = useRef(null);
  const [focus, setFocus] = useState(null);

  useReveal(root, () => {
    if (prefersReducedMotion()) return;
    gsap
      .timeline({ scrollTrigger: { trigger: '.orbits', start: 'top 75%', once: true } })
      .from('.orbits__ring', { scale: 0, autoAlpha: 0, duration: 1.6, ease: 'expo.out', stagger: 0.15 })
      .from('.orbits__core', { scale: 0, duration: 1.2, ease: 'back.out(2)' }, 0.1)
      .fromTo('.planet__dot, .planet__label', { scale: 0 }, { scale: 1, duration: 0.8, ease: 'back.out(3)', stagger: 0.04 }, 0.5);
  });

  return (
    <section className="skills" id="skills" ref={root} aria-labelledby="skills-title">
      <div className="wrap">
        <div className="skills__head" data-fade-group>
          <h2 id="skills-title" className="h1" data-split>
            What I actually know, right now.
          </h2>
          <p className="lead" data-fade>
            {skills.intro}
          </p>
        </div>

        <div className="skills__grid">
          <div className="orbits" aria-hidden="true">
            <div className="orbits__core">
              <span>ZH</span>
            </div>
            {skills.groups.map((g) => (
              <div
                key={g.key}
                className={`orbits__ring orbits__ring--${g.key}`}
                style={{ '--size': RING[g.key], '--dur': `${DUR[g.key]}s` }}
              >
                {g.items.map((it, i) => (
                  <div key={it} className="planet" style={{ '--a': `${(360 / g.items.length) * i + ({ learning: 0, ctf: 36, roadmap: 75 })[g.key]}deg` }}>
                    <div className={`planet__body ${focus === it ? 'is-focus' : ''}`}>
                      <span className="planet__dot" />
                      <span className="planet__label">{it}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="skills__lists">
            {skills.groups.map((g) => (
              <div key={g.key} className={`skill-group skill-group--${g.key}`} data-fade-group>
                <h3 className="skill-group__label" data-fade>
                  {g.label}
                </h3>
                <ul>
                  {g.items.map((it) => (
                    <li
                      key={it}
                      data-fade
                      onPointerEnter={() => setFocus(it)}
                      onPointerLeave={() => setFocus(null)}
                      onFocus={() => setFocus(it)}
                      onBlur={() => setFocus(null)}
                      tabIndex={0}
                    >
                      <span>{it}</span>
                      <span className={`state state--${g.state.replace(' ', '-')}`}>{g.state}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="skills__notes">
          {skills.notes.map((n) => (
            <article key={n.title} data-fade-group>
              <h3 className="h3" data-split>
                {n.title}
              </h3>
              <p data-fade>{n.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
