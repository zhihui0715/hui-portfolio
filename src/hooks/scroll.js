import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// One Lenis instance for the whole page, driven by GSAP's ticker so ScrollTrigger and Lenis share a clock.
let lenis = null;
export const scrollState = { progress: 0, velocity: 0 };

export function startLenis() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
  lenis.on('scroll', (e) => {
    scrollState.progress = e.progress || 0;
    scrollState.velocity = e.velocity || 0;
    ScrollTrigger.update();
  });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.classList.toggle('is-locked', locked);
}

// Native fallback so the 3D scene still reacts when Lenis is off (reduced motion).
if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      if (lenis) return;
      const max = document.documentElement.scrollHeight - innerHeight;
      scrollState.progress = max > 0 ? scrollY / max : 0;
    },
    { passive: true }
  );
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
