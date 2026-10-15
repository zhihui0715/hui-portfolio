import { useEffect, useRef, useState } from 'react';
import { gsap, scrollToId, prefersReducedMotion } from '../hooks/scroll';
import { useReveal } from '../hooks/useReveal';
import { contact, links, profile } from '../data/content';
import Magnet from '../components/Magnet';
import PiCurve from '../components/PiCurve';

const ROWS = [
  { k: 'Email', v: links.email, href: links.emailHref },
  { k: 'WhatsApp', v: '+60 11-3008 4486', href: links.whatsapp },
  { k: 'Instagram', v: '@huiiii0715', href: links.instagram },
  { k: 'Facebook', v: 'huiiii0715', href: links.facebook },
  { k: 'GitHub', v: 'zhihui0715', href: links.github },
];

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur' });
  const h = Number(now.toLocaleString('en-GB', { hour: '2-digit', hour12: false, timeZone: 'Asia/Kuala_Lumpur' }));
  const mood = h >= 23 || h < 7 ? 'probably asleep — replies in the morning' : h < 9 ? 'just waking up' : h < 18 ? 'likely in class or studying' : 'around, open to chat';
  return (
    <p className="contact__time">
      <span className="pulse" aria-hidden="true" /> {time} in Malaysia — {mood}
    </p>
  );
}

export default function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);

  useReveal(root, (el) => {
    if (prefersReducedMotion()) return;
    gsap.from('.contact__row', {
      yPercent: 60,
      autoAlpha: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.07,
      scrollTrigger: { trigger: '.contact__rows', start: 'top 85%', once: true },
    });
    gsap.from('.footer__name', {
      yPercent: 60,
      ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  return (
    <section className="contact" id="contact" ref={root} aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact__top">
          <div data-fade-group>
            <h2 id="contact-title" className="contact__title" data-split>
              Let&apos;s talk.
            </h2>
            <p className="lead" data-fade>
              {contact.lead}
            </p>
            <div data-fade>
              <LocalTime />
            </div>
          </div>
          <div className="contact__curve" aria-hidden="true">
            <PiCurve auto speed={0.9} trailTurns={50} label="" />
          </div>
        </div>

        <ul className="contact__rows">
          {ROWS.map((r) => (
            <li key={r.k} className="contact__row">
              <a href={r.href} target="_blank" rel="noreferrer" data-cursor="open">
                <span className="contact__k">{r.k}</span>
                <span className="contact__v">{r.v}</span>
                <span className="contact__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="contact__actions">
          <Magnet>
            <a className="btn" href={links.emailHref} target="_blank" rel="noreferrer">
              Send an email
            </a>
          </Magnet>
          <Magnet>
            <a className="btn btn--ghost" href={links.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp me
            </a>
          </Magnet>
          <Magnet>
            <button className="btn btn--ghost" onClick={copy}>
              {copied ? 'Copied ✓' : 'Copy email'}
            </button>
          </Magnet>
          <button className="link-btn" onClick={() => scrollToId('home')}>
            Back to home ↑
          </button>
        </div>
        <p className="contact__where">
          {profile.location} · open to chat
        </p>
      </div>

      <footer className="footer">
        <p className="footer__name" aria-hidden="true">
          Zhi Hui
        </p>
        <div className="footer__meta wrap">
          <span>© {new Date().getFullYear()} {profile.fullName}</span>
          <span>Built with React, GSAP &amp; Three.js — orbiting since 3.14159…</span>
        </div>
      </footer>
    </section>
  );
}
