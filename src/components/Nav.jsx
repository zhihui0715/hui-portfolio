import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, scrollToId, lockScroll, prefersReducedMotion } from '../hooks/scroll';
import { nav } from '../data/content';

export default function Nav({ theme, onToggleTheme }) {
  const bar = useRef(null);
  const progress = useRef(null);
  const menu = useRef(null);
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const triggers = nav.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(id),
      })
    );
    // hide the bar while reading downward, bring it back on any upward scroll
    let shown = true;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.set(progress.current, { scaleX: self.progress });
        const show = self.direction < 0 || self.scroll() < 120;
        if (show !== shown) {
          shown = show;
          gsap.to(bar.current, { yPercent: show ? 0 : -120, duration: 0.5, ease: 'power3.out' });
        }
      },
    });
    return () => {
      triggers.forEach((t) => t.kill());
      st.kill();
    };
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!menu.current || prefersReducedMotion()) return;
    if (open) {
      gsap.fromTo(menu.current, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: 'expo.inOut' });
      gsap.fromTo(menu.current.querySelectorAll('.menu__link'), { yPercent: 120 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.3 });
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <>
      <header className="nav" ref={bar}>
        <a href="#home" className="nav__mark" onClick={go('home')} data-cursor="home">
          <span className="nav__mark-pi">π</span>
          <span>Zhi Hui</span>
        </a>
        <nav className="nav__links" aria-label="Sections">
          {nav.slice(1).map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)} className={active === n.id ? 'is-active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} data-cursor={theme === 'dark' ? 'day' : 'night'}>
            <span className="theme-toggle__orb" />
          </button>
          <a href="#contact" className="btn btn--small nav__cta" onClick={go('contact')}>
            Say hi
          </a>
          <button className="nav__burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            <span />
            <span />
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
        <div className="nav__progress" ref={progress} />
      </header>

      {open && (
        <div className="menu" id="menu" ref={menu} role="dialog" aria-modal="true" aria-label="Menu">
          <ul>
            {nav.map((n) => (
              <li key={n.id} className="menu__mask">
                <a className="menu__link" href={`#${n.id}`} onClick={go(n.id)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="menu__foot">3.14159… and counting</p>
        </div>
      )}
    </>
  );
}
