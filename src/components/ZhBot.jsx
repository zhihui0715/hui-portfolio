import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, scrollToId, prefersReducedMotion } from '../hooks/scroll';
import { reply, welcome, STARTERS } from '../data/botBrain';

const STORE = 'zh-bot-v2';

function load() {
  try {
    const s = JSON.parse(sessionStorage.getItem(STORE));
    if (s && Array.isArray(s.msgs)) return s;
  } catch {
    /* private mode or corrupted — start fresh */
  }
  return null;
}

let uid = 0;
const id = () => `${Date.now()}-${uid++}`;

export default function ZhBot({ onToggleTheme }) {
  const saved = useRef(load());
  const mem = useRef(saved.current?.mem || {});
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(() => saved.current?.msgs || [{ id: id(), from: 'bot', ...welcome(mem.current), done: true }]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [unread, setUnread] = useState(!saved.current);
  const listRef = useRef(null);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const busy = useRef(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ msgs: msgs.slice(-40).map((m) => ({ ...m, done: true })), mem: mem.current }));
    } catch {
      /* ignore */
    }
  }, [msgs]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('zhbot:open', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('zhbot:open', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setUnread(false);
    if (!prefersReducedMotion())
      gsap.fromTo(panelRef.current, { autoAlpha: 0, y: 30, scale: 0.94, transformOrigin: '100% 100%' }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'expo.out' });
    setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [msgs, typing]);

  const runEffect = useCallback(
    (effect) => {
      if (effect === 'theme') onToggleTheme();
      if (effect?.scroll) {
        setTimeout(() => {
          if (window.innerWidth < 700) setOpen(false);
          scrollToId(effect.scroll);
        }, 500);
      }
    },
    [onToggleTheme]
  );

  const send = useCallback(
    (text) => {
      const q = text.trim();
      if (!q || busy.current) return;
      busy.current = true;
      setInput('');
      setMsgs((m) => [...m, { id: id(), from: 'me', text: q, done: true }]);
      const r = reply(q, mem.current);
      if (r.effect === 'clear') {
        mem.current = { name: mem.current.name };
        setMsgs([{ id: id(), from: 'bot', ...welcome(mem.current), done: true }]);
        busy.current = false;
        return;
      }
      setTyping(true);
      // "thinking" time scales with answer length, capped so it never feels slow
      const delay = prefersReducedMotion() ? 0 : Math.min(1100, 380 + r.text.length * 4);
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { id: id(), from: 'bot', text: r.text, follow: r.follow, actions: r.actions, done: false }]);
        runEffect(r.effect);
        busy.current = false;
      }, delay);
    },
    [runEffect]
  );

  const doAction = async (a) => {
    if (a.type === 'scroll') runEffect({ scroll: a.value });
    if (a.type === 'link') window.open(a.value, '_blank', 'noopener');
    if (a.type === 'copy') {
      try {
        await navigator.clipboard.writeText(a.value);
        setMsgs((m) => [...m, { id: id(), from: 'bot', text: `Copied ${a.value} to your clipboard ✓`, done: true }]);
      } catch {
        window.location.href = `mailto:${a.value}`;
      }
    }
  };

  const last = msgs[msgs.length - 1];
  const chips = (last?.from === 'bot' && last.follow) || STARTERS.slice(0, 3);

  return (
    <>
      <button
        className={`bot-launch ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="zh-bot"
        aria-label={open ? 'Close ZH-bot' : 'Open ZH-bot chat'}
        data-cursor="chat"
      >
        <span className="bot-launch__orbit" aria-hidden="true" />
        <span className="bot-launch__face" aria-hidden="true">
          {open ? '×' : 'ZH'}
        </span>
        {unread && !open && <span className="bot-launch__badge" aria-hidden="true" />}
      </button>

      {open && (
        <section className="bot" id="zh-bot" ref={panelRef} role="dialog" aria-label="ZH-bot chat">
          <header className="bot__head">
            <span className="bot__avatar" aria-hidden="true">
              ZH
            </span>
            <div>
              <p className="bot__name">ZH-bot</p>
              <p className="bot__state">
                <span className="pulse" aria-hidden="true" /> online · scripted, not live
              </p>
            </div>
            <button className="bot__close" onClick={() => send('clear')} title="Clear chat" aria-label="Clear chat">
              ↺
            </button>
            <button className="bot__close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>

          <div className="bot__list" ref={listRef} data-lenis-prevent aria-live="polite">
            {msgs.map((m) => (
              <Message key={m.id} m={m} onAction={doAction} onDone={() => setMsgs((all) => all.map((x) => (x.id === m.id ? { ...x, done: true } : x)))} />
            ))}
            {typing && (
              <div className="msg msg--bot">
                <span className="dots" aria-label="ZH-bot is typing">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
          </div>

          <div className="bot__chips" data-lenis-prevent>
            {chips.map((c) => (
              <button key={c} className="chip chip--small" onClick={() => send(c)}>
                {c}
              </button>
            ))}
          </div>

          <form
            className="bot__form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mem.current.name ? `Ask me anything, ${mem.current.name}…` : 'Ask anything… (try "help")'}
              aria-label="Message ZH-bot"
              maxLength={240}
            />
            <button type="submit" aria-label="Send" disabled={!input.trim()}>
              ↑
            </button>
          </form>
        </section>
      )}
    </>
  );
}

// Bot messages stream in word by word; actions appear once the text has finished.
function Message({ m, onAction, onDone }) {
  const [shown, setShown] = useState(m.done || m.from === 'me' ? m.text : '');
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = gsap.fromTo(ref.current, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
    return () => t.progress(1).kill();
  }, []);

  useEffect(() => {
    if (m.done || m.from === 'me') return;
    if (prefersReducedMotion()) {
      setShown(m.text);
      onDone();
      return;
    }
    const words = m.text.split(/(\s+)/);
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setShown(words.slice(0, i).join(''));
      if (i >= words.length) {
        clearInterval(t);
        onDone();
      }
    }, 28);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`msg msg--${m.from}`} ref={ref}>
      <p className="msg__text">{shown}</p>
      {m.done && m.actions?.length > 0 && (
        <div className="msg__actions">
          {m.actions.map((a) => (
            <button key={a.label} className="msg__action" onClick={() => onAction(a)}>
              {a.label} {a.type === 'link' ? '↗' : a.type === 'scroll' ? '↓' : '⧉'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
