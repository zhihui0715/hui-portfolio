import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '../hooks/scroll';
import { useReveal } from '../hooks/useReveal';
import { projects } from '../data/content';
import DecryptText from '../components/DecryptText';
import Magnet from '../components/Magnet';

function Terminal() {
  return (
    <div className="term" data-ui aria-label="Example from the Warm Up write-up: decoding Base64 on the command line">
      <div className="term__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>C1 · Warm Up · Misc</em>
      </div>
      <pre className="term__body">
        <code>
          <span className="term__p">$</span> echo &apos;Y3liZXJzcGVjdHJlezMzc3lfcDBpbnRzX3RvX3N0NHJ0fQ==&apos; | base64 -d{'\n'}
          <span className="term__ok">cyberspectre{'{'}33sy_p0ints_to_st4rt{'}'}</span>
          {'\n\n'}
          <span className="term__c"># == padding + [A-Za-z0-9+/] only → Base64, not encryption</span>
          {'\n'}
          <span className="term__p">$</span> <span className="term__cursor" />
        </code>
      </pre>
    </div>
  );
}

function CtfChart({ stats, total }) {
  const max = Math.max(...stats.map((s) => s.n));
  return (
    <ul className="ctf-chart" aria-label={`${total} challenges by category`}>
      {stats.map((s) => (
        <li key={s.label} style={{ '--w': s.n / max }}>
          <span className="ctf-chart__label">{s.label}</span>
          <span className="ctf-chart__bar">
            <span className="ctf-chart__fill" />
          </span>
          <span className="ctf-chart__n">{s.n}</span>
        </li>
      ))}
    </ul>
  );
}

function Shield() {
  return (
    <svg className="shield" viewBox="0 0 200 220" aria-hidden="true">
      <path className="shield__outline" d="M100 10 L180 42 V102 C180 152 146 190 100 210 C54 190 20 152 20 102 V42 Z" />
      <path className="shield__inner" d="M100 34 L158 58 V104 C158 140 134 168 100 184 C66 168 42 140 42 104 V58 Z" />
      <path className="shield__check" d="M68 108 L92 132 L136 86" />
    </svg>
  );
}

export default function Projects() {
  const root = useRef(null);
  const [ctf, scam] = projects;

  useReveal(root, (el) => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray('.project', el).forEach((p) => {
      gsap.from(p, {
        rotateX: 14,
        y: 120,
        transformPerspective: 1400,
        transformOrigin: '50% 0%',
        ease: 'power2.out',
        scrollTrigger: { trigger: p, start: 'top bottom', end: 'top 45%', scrub: 0.8 },
      });
    });
    gsap.from('.ctf-chart__fill', {
      scaleX: 0,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '.ctf-chart', start: 'top 85%', once: true },
    });
    gsap.from('.shield path', {
      drawSVG: '0%',
      duration: 2,
      ease: 'power2.inOut',
      stagger: 0.3,
      scrollTrigger: { trigger: '.shield', start: 'top 80%', once: true },
    });
  });

  return (
    <section className="projects" id="projects" ref={root} aria-labelledby="projects-title">
      <div className="wrap">
        <div className="projects__head" data-fade-group>
          <h2 id="projects-title" className="h1" data-split>
            Work I can point to.
          </h2>
          <p className="lead" data-fade>
            Semester 1 had nothing to show yet. After Semester 2 there's a written-up CTF and a project of my own — small, real, and mine.
          </p>
        </div>

        <article className="project project--ctf" data-fade-group>
          <div className="project__text">
            <p className="project__sub" data-fade>
              {ctf.sub}
            </p>
            <h3 className="project__title" data-fade>
              <DecryptText text={ctf.title} />
            </h3>
            <p data-fade>{ctf.body}</p>
            <div className="project__count" data-fade>
              <span className="project__big">{ctf.total}</span>
              <span>challenges across six categories, each with its own write-up and screenshots.</span>
            </div>
            <div data-fade>
              <Magnet>
                <a className="btn" href={ctf.href} target="_blank" rel="noreferrer" data-cursor="github">
                  Read the write-ups
                </a>
              </Magnet>
            </div>
          </div>
          <div className="project__media" data-fade>
            <Terminal />
            <CtfChart stats={ctf.stats} total={ctf.total} />
          </div>
        </article>

        <article className="project project--scam" data-fade-group>
          <div className="project__media project__media--shield" data-fade>
            <Shield />
          </div>
          <div className="project__text">
            <p className="project__sub" data-fade>
              {scam.sub}
            </p>
            <h3 className="project__title" data-fade>
              <DecryptText text={scam.title} />
            </h3>
            <p data-fade>{scam.body}</p>
            {scam.href && (
            <div data-fade>
              <Magnet>
                <a className="btn btn--ghost" href={scam.href} target="_blank" rel="noreferrer" data-cursor="github">
                  View on GitHub
                </a>
              </Magnet>
            </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
