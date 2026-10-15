import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/scroll';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/{}=+';

// Scrambles then resolves left to right (React Bits' DecryptedText idea). Plays once when visible, again on hover.
export default function DecryptText({ text, speed = 28, className = '', as: Tag = 'span', hover = true }) {
  const [out, setOut] = useState(text);
  const ref = useRef(null);
  const timer = useRef(0);

  const run = () => {
    if (prefersReducedMotion()) return setOut(text);
    clearInterval(timer.current);
    let i = 0;
    timer.current = setInterval(() => {
      i += 0.5;
      setOut(
        text
          .split('')
          .map((c, k) => (c === ' ' || k < i ? c : CHARS[(Math.random() * CHARS.length) | 0]))
          .join('')
      );
      if (i >= text.length) {
        clearInterval(timer.current);
        setOut(text);
      }
    }, speed);
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag ref={ref} className={`decrypt ${className}`} onMouseEnter={hover ? run : undefined} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
