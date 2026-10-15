import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '../hooks/scroll';
import { useReveal } from '../hooks/useReveal';
import { interests } from '../data/content';

// Tilts toward the pointer with a moving sheen (React Bits' TiltedCard, on GSAP).
function TiltImage({ src, alt }) {
  const ref = useRef(null);
  const move = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 14, rotateX: -y * 12, scale: 1.03, duration: 0.6, ease: 'power3.out' });
    ref.current.style.setProperty('--sx', `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty('--sy', `${(y + 0.5) * 100}%`);
  };
  const leave = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.45)' });
  return (
    <div className="tilt" onPointerMove={move} onPointerLeave={leave} data-cursor="tilt">
      <figure className="tilt__card" ref={ref} data-wipe>
        <img src={src} alt={alt} loading="lazy" />
        <span className="tilt__sheen" aria-hidden="true" />
      </figure>
    </div>
  );
}

export default function Interests() {
  const root = useRef(null);

  useReveal(root, (el) => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray('.sport__name', el).forEach((n) => {
      gsap.fromTo(n, { xPercent: 12 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: n, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  return (
    <section className="interests" id="interests" ref={root} aria-labelledby="interests-title">
      <div className="wrap">
        <div className="interests__head" data-fade-group>
          <h2 id="interests-title" className="h1" data-split>
            What I watch when I'm not studying.
          </h2>
          <p className="lead" data-fade>
            {interests.lead}
          </p>
        </div>

        {interests.items.map((s, i) => (
          <article key={s.sport} className={`sport ${i % 2 ? 'sport--flip' : ''}`} data-fade-group>
            <p className="sport__name" aria-hidden="true">
              {s.player}
            </p>
            <TiltImage src={s.img} alt={`${s.player}`} />
            <div className="sport__text">
              <h3 className="h3" data-split>
                {s.sport}
              </h3>
              <p data-fade>{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
