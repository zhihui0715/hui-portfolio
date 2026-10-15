import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { startLenis, ScrollTrigger } from './hooks/scroll';
import Preloader from './components/Preloader';
import Nav from './components/Nav';
import Cursor from './components/Cursor';
import ClickSpark from './components/ClickSpark';
import PiMarquee from './components/PiMarquee';
import ZhBot from './components/ZhBot';
import Hero from './sections/Hero';
import PiStory from './sections/PiStory';
import Journey from './sections/Journey';
import About from './sections/About';
import Roadmap from './sections/Roadmap';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Interests from './sections/Interests';
import Contact from './sections/Contact';

// three.js is the heaviest dependency, so the background loads after the page itself
const SpaceScene = lazy(() => import('./components/SpaceScene'));

function readTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export default function App() {
  const [theme, setTheme] = useState(readTheme);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#05060a' : '#eef0f3');
    try {
      localStorage.setItem('zh-theme', theme);
    } catch {
      /* storage blocked — theme just won't persist */
    }
  }, [theme]);

  useEffect(() => {
    startLenis();
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const apply = () => setTheme(next);
    // circular reveal between themes where the View Transitions API exists
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply);
    else apply();
  }, [theme]);

  const onLoaded = useCallback(() => setReady(true), []);

  return (
    <>
      <Preloader onDone={onLoaded} />
      <Suspense fallback={null}>
        <SpaceScene theme={theme} />
      </Suspense>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <ClickSpark />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero ready={ready} />
        <PiMarquee from={0} length={240} />
        <PiStory />
        <Journey />
        <About />
        <Roadmap />
        <PiMarquee text="anything is possible ∞ never stuck at one point ∞ so close, yet so far ∞ keep going ∞ " reverse className="marquee--words" />
        <Projects />
        <Skills />
        <Interests />
        <Contact />
      </main>
      <ZhBot onToggleTheme={toggleTheme} theme={theme} />
    </>
  );
}
