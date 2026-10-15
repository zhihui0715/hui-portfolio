import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '../hooks/scroll';
import { useReveal } from '../hooks/useReveal';
import { about, profile } from '../data/content';

// Text set on a circle that orbits the photo (React Bits' CircularText, in SVG).
function OrbitText({ text }) {
  return (
    <svg className="orbit-text" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="orbit-path" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
      </defs>
      <text>
        <textPath href="#orbit-path" textLength="548">
          {text}
        </textPath>
      </text>
    </svg>
  );
}

export default function About() {
  const root = useRef(null);

  useReveal(root, () => {
    if (prefersReducedMotion()) return;
    gsap.to('.orbit-text', { rotate: 360, duration: 30, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    gsap.to('.about__photo img', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: '.about__grid', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const rows = [
    ['Name', profile.fullName],
    ['Age', profile.age],
    ['MBTI', profile.mbti],
    ['Studying', `${profile.programme} — Semester 2 completed`],
    ['CGPA', profile.cgpa],
    ['School', profile.school],
    ['Living', profile.living],
  ];

  return (
    <section className="about" id="about" ref={root} aria-labelledby="about-title">
      <div className="wrap">
        <div className="about__head" data-fade-group>
          <h2 id="about-title" className="h1" data-split>
            A bit more about who I am.
          </h2>
          <p className="lead" data-fade>
            {about.lead}
          </p>
        </div>

        <div className="about__grid">
          <aside className="about__side">
            <div className="about__photo-wrap">
              <OrbitText text="INFJ · SOC analyst in training · MMU · CGPA 3.86 · " />
              <figure className="about__photo" data-wipe>
                <img src={profile.photo} alt={`Portrait of ${profile.fullName}`} loading="lazy" />
              </figure>
            </div>
            <dl className="about__facts" data-fade-group>
              {rows.map(([k, v]) => (
                <div key={k} data-fade>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="about__stories">
            {about.stories.map((s) => (
              <article key={s.title} className="story-block" data-fade-group>
                <h3 className="h3" data-split>
                  {s.title}
                </h3>
                <p data-fade>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
