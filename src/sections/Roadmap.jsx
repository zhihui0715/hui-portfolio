import { useRef } from 'react';
import { gsap } from '../hooks/scroll';
import { useReveal } from '../hooks/useReveal';
import { roadmap, roadmapIntro } from '../data/content';

export default function Roadmap() {
  const root = useRef(null);

  useReveal(root, (el) => {
    const mm = gsap.matchMedia();
    // desktop: the stops ride past horizontally while the section is pinned, like planets along one orbit
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const track = el.querySelector('.road__track');
      const distance = () => track.scrollWidth - window.innerWidth + 64;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.road__pin',
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set('.road__progress-fill', { scaleX: self.progress }),
        },
      });
      gsap.utils.toArray('.road__stop', el).forEach((stop) => {
        gsap.from(stop.querySelectorAll('.road__when, .road__title, .road__body, .road__badge'), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: stop, containerAnimation: tween, start: 'left 85%', toggleActions: 'play none none reverse' },
        });
      });
    });
    mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('.road__stop', el).forEach((stop) =>
        gsap.from(stop, { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: stop, start: 'top 85%', once: true } })
      );
    });
  });

  return (
    <section className="road" id="roadmap" ref={root} aria-labelledby="road-title">
      <div className="road__pin">
        <div className="road__head wrap" data-fade-group>
          <h2 id="road-title" className="h1" data-split>
            Where I want to be
          </h2>
          <p className="lead" data-fade>
            {roadmapIntro}
          </p>
        </div>
        <div className="road__track">
          <span className="road__orbit" aria-hidden="true" />
          <ol className="road__list">
            {roadmap.map((r) => (
              <li key={r.title} className="road__stop">
                <span className="road__planet" aria-hidden="true" />
                <p className="road__when">{r.when}</p>
                <h3 className="road__title">{r.title}</h3>
                <p className="road__body">{r.body}</p>
                {r.badge && <p className="road__badge">{r.badge}</p>}
              </li>
            ))}
          </ol>
        </div>
        <div className="road__progress" aria-hidden="true">
          <span className="road__progress-fill" />
        </div>
      </div>
    </section>
  );
}
