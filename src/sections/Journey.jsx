import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '../hooks/scroll';
import { useReveal } from '../hooks/useReveal';
import { hero, journey, facts, whySite } from '../data/content';
import CountUp from '../components/CountUp';

function FactCard({ f }) {
  const ref = useRef(null);
  const spins = useRef(0);
  const spin = () => {
    if (prefersReducedMotion()) return;
    spins.current += 1;
    gsap.to(ref.current, { rotateY: spins.current * 360, duration: 1.2, ease: 'back.out(1.4)' });
  };
  const tilt = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current.parentNode, { rotateX: -y * 10, rotateY: x * 12, duration: 0.5, ease: 'power3.out' });
    ref.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };
  const reset = () => gsap.to(ref.current.parentNode, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });

  return (
    <li className="fact" data-fade onPointerMove={tilt} onPointerLeave={reset}>
      <button ref={ref} className="fact__card" onClick={spin} data-cursor="spin">
        <span className="fact__title">{f.title}</span>
        <span className="fact__body">{f.body}</span>
        <span className="fact__tag">{f.tag}</span>
      </button>
    </li>
  );
}

export default function Journey() {
  const root = useRef(null);

  useReveal(root, (el) => {
    if (prefersReducedMotion()) return;
    // the orbit line fills as you read, and each stop lights up as the line reaches it
    gsap.fromTo(
      '.timeline__fill',
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 60%', end: 'bottom 60%', scrub: 0.5 } }
    );
    gsap.utils.toArray('.timeline__item', el).forEach((item) => {
      gsap.from(item.querySelectorAll('.timeline__when, .timeline__title, .timeline__body'), {
        x: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: item, start: 'top 75%', once: true, onEnter: () => item.classList.add('is-lit') },
      });
    });
  });

  return (
    <section className="journey" id="journey" ref={root} aria-labelledby="journey-title">
      <div className="intro wrap" data-fade-group>
        <p className="intro__statement" data-fade>
          {hero.intro}
        </p>
        <ul className="stats" aria-label="Numbers so far">
          <li data-fade>
            <CountUp to={3.86} decimals={2} className="stats__n" />
            <span className="stats__l">CGPA after Semester 2</span>
          </li>
          <li data-fade>
            <CountUp to={25} className="stats__n" />
            <span className="stats__l">CTF challenges written up</span>
          </li>
          <li data-fade>
            <span className="stats__n">
              <CountUp to={9} />A
            </span>
            <span className="stats__l">in 10 SPM subjects</span>
          </li>
          <li data-fade>
            <CountUp to={2} className="stats__n" />
            <span className="stats__l">semesters done at MMU</span>
          </li>
        </ul>
      </div>

      <div className="wrap">
        <h2 id="journey-title" className="h2" data-split>
          My journey so far
        </h2>
        <div className="timeline">
          <span className="timeline__line" aria-hidden="true">
            <span className="timeline__fill" />
          </span>
          <ol>
          {journey.map((j) => (
            <li key={j.title} className={`timeline__item timeline__item--${j.state}`}>
              <span className="timeline__node" aria-hidden="true" />
              <p className="timeline__when">{j.when}</p>
              <div>
                <h3 className="timeline__title">{j.title}</h3>
                <p className="timeline__body">{j.body}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>

      <div className="wrap facts-wrap">
        <div className="facts-head">
          <h2 className="h2" data-split>
            A few quick facts
          </h2>
          <p className="muted">Click any card — it does a full spin.</p>
        </div>
        <ul className="facts" data-fade-group>
          {facts.map((f) => (
            <FactCard key={f.title} f={f} />
          ))}
        </ul>
      </div>

      <div className="why wrap" data-fade-group>
        <h2 className="h2" data-split>
          Why this site exists
        </h2>
        <p className="why__body" data-fade>
          {whySite}
        </p>
      </div>
    </section>
  );
}
