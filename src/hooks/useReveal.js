import { gsap, useGSAP, SplitText, prefersReducedMotion } from './scroll';

/**
 * Section entrance choreography, scoped to one section:
 *  [data-split]  headings rise word by word out of line masks
 *  [data-fade]   text and blocks rise 28px with opacity, staggered by group
 *  [data-wipe]   pictures unveil with a clip-path wipe and settle from a slight zoom
 * Content is visible by default; GSAP only hides it at the moment the tween is created.
 */
export function useReveal(scope, extra) {
  useGSAP(
    (ctx, contextSafe) => {
      const root = scope.current;
      if (!root) return;
      if (!prefersReducedMotion()) {
        root.querySelectorAll('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines,words',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 115,
                rotate: 4,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.045,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          });
        });

        root.querySelectorAll('[data-fade-group]').forEach((group) => {
          const items = group.querySelectorAll('[data-fade]');
          if (!items.length) return;
          gsap.from(items, {
            y: 28,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.075,
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          });
        });

        root.querySelectorAll('[data-wipe]').forEach((el) => {
          const media = el.querySelector('img, canvas, .wipe-inner') || el;
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
            .from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' })
            .from(media, { scale: 1.25, duration: 1.6, ease: 'expo.out' }, 0.1);
        });
      }
      extra?.(root, ctx, contextSafe);
    },
    { scope }
  );
}
