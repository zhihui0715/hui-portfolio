import { links, profile, projects } from './content';
import { PI_DIGITS } from './pi';

// ZH-bot is scripted, not an AI model: intents + fuzzy matching + a little memory. It runs entirely in the browser.

const go = (label, id) => ({ type: 'scroll', label, value: id });
const open = (label, href) => ({ type: 'link', label, value: href });

export const STARTERS = ["What's your goal?", 'Show me your projects', 'What are you learning?', 'Why cybersecurity?', 'What does π mean here?', '🎲 Surprise me'];

const INTENTS = [
  {
    id: 'goal',
    keys: ['goal', 'goals', 'aim', 'dream', 'future', 'career', 'want to be', 'become', 'plan', 'ambition', 'target'],
    answer: 'The first target is a SOC analyst role — reading logs, catching alerts, learning what "normal" looks like well enough to notice when it isn\'t. Once those fundamentals are solid, the longer-term move is penetration testing (or AI security engineering).',
    more: 'The rough timeline: keep CGPA above 3.67 in Year 1 (3.86 so far ✓), specialise in cybersecurity and AI through the degree, a SOC analyst internship around graduation (~age 21, RM4,000+), RM8,000+ by 25 while branching into pentesting or AI security, RM10,000+ by 30. And someday, if it all works out — a Mercedes.',
    follow: ['Why cybersecurity?', 'Show me the roadmap', 'What are you learning?'],
    actions: [go('See the roadmap', 'roadmap')],
  },
  {
    id: 'roadmap',
    keys: ['roadmap', 'timeline', 'salary', 'money', 'rm', 'earn', 'by 25', 'by 30', 'income', 'pay'],
    answer: 'Year 1: CGPA above 3.67 (it\'s 3.86 now). Through the degree: go deeper into cybersecurity and AI. Graduation (~21): SOC analyst internship, around RM4,000+. By 25: RM8,000+ and branching into pentesting or AI security. By 30: RM10,000+.',
    more: 'Writing the numbers down publicly is partly accountability and partly honesty — it\'s what Zhi Hui is actually working toward, not a polished version of it.',
    follow: ['And the Mercedes?', 'What is your CGPA?'],
    actions: [go('Open the roadmap', 'roadmap')],
  },
  {
    id: 'mercedes',
    keys: ['mercedes', 'car', 'benz', 'reward'],
    answer: 'Ha — yes, it\'s on the list. Not the point of any of this, but if the rest of the plan actually happens, a Mercedes is the reward pictured at the end of it.',
    follow: ["What's your goal?"],
  },
  {
    id: 'cgpa',
    keys: ['cgpa', 'gpa', 'result', 'results', 'grade', 'grades', 'score', 'scholarship', 'semester 2', 'sem 2', 'exam'],
    answer: () => `Semester 1 GPA: ${profile.sem1Gpa}. After Semester 2 the CGPA is ${profile.cgpa}. The personal line was 3.67 — the cut-off to stay in scholarship range — and it cleared it comfortably. The number matters less than what it funds: the rest of the degree.`,
    more: 'Before MMU there was SPM: 9 A\'s in 10 subjects. The one that didn\'t become an A is a reminder that consistency beats any single good week.',
    follow: ['Tell me about SPM', 'What are you learning?'],
  },
  {
    id: 'spm',
    keys: ['spm', '9a', 'high school', 'secondary', 'school result'],
    answer: '9 A\'s in 10 SPM subjects. Not flashy — just long stretches of revision and past papers redone until the mistakes stopped repeating. That\'s where the "just put the reps in" approach comes from.',
    follow: ['What is your CGPA?', 'How do you study?'],
    actions: [go('Read the full story', 'about')],
  },
  {
    id: 'learning',
    keys: ['learn', 'learning', 'skill', 'skills', 'know', 'studying now', 'tech', 'stack', 'languages', 'coding', 'programming'],
    answer: 'Currently learning: HTML & CSS, computing fundamentals, networking basics, Linux fundamentals, Python & machine-learning basics, and building with AI tools. Practised in CTFs: web challenges, digital forensics, OSINT, crypto basics and the Linux command line. Not started yet: SIEM & log analysis, security certifications, pentesting tools.',
    more: '"Learning" means real material or real code. "Practised" means used to solve actual CTF challenges and written up. "Not started" means a genuine goal that hasn\'t been opened yet. The line is kept clear on purpose.',
    follow: ['Any certifications?', 'Show me your projects'],
    actions: [go('See the skills orbit', 'skills')],
  },
  {
    id: 'certs',
    keys: ['cert', 'certs', 'certification', 'certifications', 'comptia', 'security+', 'ceh', 'oscp'],
    answer: 'No certifications yet — and that\'s said plainly on purpose. They\'re on the roadmap for later in the programme, once the fundamentals underneath them are solid.',
    follow: ['What are you learning?', 'Show me your projects'],
  },
  {
    id: 'projects',
    keys: ['project', 'projects', 'work', 'portfolio', 'built', 'made', 'github', 'repo', 'show me'],
    answer: 'Two things to point to so far: the CTF write-ups from Cyberspectre (MMU), September 2026 — 25 challenges, each documented step by step — and ScamShield MY, a project about helping people in Malaysia spot scams.',
    follow: ['Tell me about the CTF', 'What is ScamShield?'],
    actions: [go('Go to projects', 'projects'), open('GitHub profile', links.github)],
  },
  {
    id: 'ctf',
    keys: ['ctf', 'capture the flag', 'cyberspectre', 'flag', 'writeup', 'write up', 'write-up', 'challenge', 'challenges', 'hack'],
    answer: () => {
      const c = projects[0];
      return `Cyberspectre (MMU), September 2026 — the first CTF. ${c.total} challenges written up: ${c.stats.map((s) => `${s.label} ${s.n}`).join(', ')}. Each write-up covers the recon, the commands, the dead ends and the technique underneath.`;
    },
    more: 'The very first one, "Warm Up", was a Base64 string: only [A-Za-z0-9+/] characters and == padding at the end, so it was an encoding, not encryption. `base64 -d` gave the flag.',
    follow: ['What is ScamShield?', 'What are you learning?'],
    actions: [open('Read the write-ups', projects[0].href)],
  },
  {
    id: 'scamshield',
    keys: ['scamshield', 'scam', 'scams', 'shield', 'fraud', 'phishing'],
    answer: () => `${projects[1].title}: ${projects[1].body}`,
    follow: ['Tell me about the CTF', 'Why cybersecurity?'],
    actions: projects[1].href ? [open('View on GitHub', projects[1].href)] : [go('See it in Work', 'projects')],
  },
  {
    id: 'study',
    keys: ['study', 'school', 'university', 'uni', 'mmu', 'multimedia', 'college', 'foundation', 'course', 'programme', 'program', 'semester', 'where do you study', 'where are you studying'],
    answer: () => `${profile.school}, ${profile.programme}. Semester 2 is complete (CGPA ${profile.cgpa}). Living ${profile.living.toLowerCase()}.`,
    follow: ['What is your CGPA?', 'How do you study?'],
    actions: [go('About Zhi Hui', 'about')],
  },
  {
    id: 'how',
    keys: ['how do you study', 'study habit', 'work style', 'routine', 'how do you work', 'alone', 'coursemates', 'productive'],
    answer: 'Alone first: reading around a problem, messy notes, turning it over until it makes sense. Then into it with coursemates — to check the thinking, and because talking out loud catches gaps quiet reading doesn\'t. Days split fairly evenly between the two.',
    follow: ["What's your MBTI?"],
  },
  {
    id: 'mbti',
    keys: ['mbti', 'infj', 'personality', 'introvert', 'extrovert', 'type'],
    answer: 'INFJ. It shows: think it through alone first, then stress-test the idea against other people before trusting it.',
    follow: ['How do you study?', 'Why cybersecurity?'],
  },
  {
    id: 'why',
    keys: ['why cyber', 'why security', 'ai', 'artificial intelligence', 'machine learning', 'ai security', 'cybersecurity', 'security', 'soc', 'analyst', 'why soc', 'pentest', 'penetration', 'blue team', 'red team'],
    answer: 'Because it\'s about noticing something is off before it becomes a real problem. A SOC analyst role is less about breaking things and more about attention, patience and pattern recognition — things Zhi Hui already gravitates toward.',
    more: 'Pentesting comes later, on purpose: get comfortable reading systems, logs and traffic first, then move into breaking things once it\'s clear what you\'d be breaking and why. Skipping straight to the exciting part would leave gaps.',
    follow: ["What's your goal?", 'What are you learning?'],
  },
  {
    id: 'sports',
    keys: ['sport', 'sports', 'basketball', 'baseball', 'football', 'soccer', 'mlb', 'nba', 'fifa', 'curry', 'judge', 'bellingham', 'hobby', 'hobbies', 'free time', 'interest', 'interests'],
    answer: 'Basketball (Stephen Curry — the thousands of unfilmed reps behind the shot), MLB (Aaron Judge — patience, then one clean swing), and football (Jude Bellingham — getting better often means taking on more responsibility).',
    follow: ['How do you study?'],
    actions: [go('See interests', 'interests')],
  },
  {
    id: 'pi',
    keys: ['pi', 'π', 'infinite', 'infinity', 'meaning', 'curve', 'spiral', 'circle', 'theme', 'so close', 'never ends', 'irrational', 'why pi'],
    answer: 'The curve on this site is z(θ) = e^{iθ} + e^{iπθ}: two arms, one spinning once, the other π times. Because π is irrational, the line comes close to where it started over and over — and never lands on it. It never stops at one point.',
    more: 'That\'s the message: no single result, good or bad, is where the path ends. So close, yet so far — keep going, anything is possible. Try the toy in the π section: pick 5/2 and it closes; pick π and it never does.',
    follow: ['What about the Möbius strip?', 'Give me 100 digits of π'],
    actions: [go('Play with the curve', 'pi')],
  },
  {
    id: 'mobius',
    keys: ['mobius', 'möbius', 'moebius', 'strip', 'band', 'background', '3d', 'loop'],
    answer: 'The shape turning in the background is a Möbius strip — a band with only one side and one edge. The little comet walking it ends up on the "other" face after one lap and back home after two, without ever crossing an edge.',
    more: 'Same idea as π: a path that keeps going. What looks like two sides is really one surface — the setbacks and the wins are on the same road.',
    follow: ['What does π mean here?', 'How was this site built?'],
  },
  {
    id: 'site',
    keys: ['site', 'website', 'built', 'build', 'made this', 'react', 'gsap', 'three', 'threejs', 'animation', 'code', 'tech stack'],
    answer: 'React + Vite, GSAP (ScrollTrigger and SplitText) for the motion, Three.js through react-three-fiber for the Möbius strip and orbits, Lenis for smooth scrolling, and a plain canvas for the π curve. I\'m scripted JavaScript too — no AI, no server.',
    follow: ['What about the Möbius strip?', 'Who are you?'],
  },
  {
    id: 'contact',
    keys: ['contact', 'reach', 'email', 'mail', 'whatsapp', 'phone', 'number', 'instagram', 'ig', 'facebook', 'fb', 'social', 'dm', 'message', 'talk'],
    answer: () => `Email ${links.email}, or WhatsApp, Instagram (@huiiii0715), Facebook (huiiii0715) and GitHub (zhihui0715). Open to internships, entry-level SOC roles, or just talking shop about security.`,
    follow: ['Are you open to internships?'],
    actions: [{ type: 'copy', label: 'Copy email', value: links.email }, open('WhatsApp', links.whatsapp), go('Contact section', 'contact')],
  },
  {
    id: 'hire',
    keys: ['hire', 'internship', 'intern', 'job', 'available', 'opportunity', 'recruit', 'collab', 'collaborate'],
    answer: 'Yes — open to conversations about internships, entry-level SOC roles, or just talking shop with people further along. The honest picture: Foundation student, Semester 2 done, first CTF written up, no certifications yet.',
    follow: ['How do I contact you?'],
    actions: [go('Get in touch', 'contact')],
  },
  {
    id: 'age',
    keys: ['age', 'old', 'how old', 'birthday', 'born'],
    answer: () => `${profile.age}.`,
    follow: ['Where do you study?'],
  },
  {
    id: 'location',
    keys: ['location', 'where are you from', 'where do you live', 'live', 'from', 'johor', 'batu pahat', 'malaysia', 'hometown', 'country'],
    answer: () => `${profile.location}. During semesters, living ${profile.living.toLowerCase()}.`,
    follow: ['What time is it there?'],
  },
  {
    id: 'bot',
    keys: ['who are you', 'are you real', 'bot', 'are you an ai', 'are you ai', 'chatgpt', 'robot', 'human', 'are you zhi hui', 'what are you'],
    answer: 'I\'m ZH-bot — a scripted assistant living in this page, not Zhi Hui in real time and not an AI model. I match what you type to things I know, remember a little of the conversation, and can move you around the site. Type "help" to see everything.',
    follow: ['help', 'How was this site built?'],
  },
];

const JOKES = [
  'Why did the SOC analyst break up with the firewall? Too many trust issues — it kept blocking every connection.',
  'There are 10 kinds of people: those who understand binary and those who don\'t.',
  'I\'d tell you a UDP joke, but you might not get it.',
  'A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?"',
  'My password is the last 8 digits of π. Good luck — they don\'t exist.',
];

const SURPRISES = [
  'Fun fact: Zhi Hui trusts the "just put the reps in" approach because of SPM — 9 A\'s out of 10.',
  'Fun fact: the curve behind the hero has been drawing since you arrived, and it will never repeat a single point.',
  'Fun fact: Zhi Hui\'s favourite player is Stephen Curry — for the unfilmed reps, not the highlight threes.',
  'Fun fact: the first CTF flag was hidden in plain Base64. Two equals signs gave it away.',
  'Fun fact: this site loads π by computing it — 1,000 digits with BigInt, every visit.',
  'Fun fact: a Möbius strip has one side. Cut it down the middle and you get one longer loop, not two.',
  'Fun fact: the CGPA goal was 3.67. The CGPA after two semesters is 3.86 — well over the line.',
  'Fun fact: the whole site, me included, runs without a server.',
];

const SECTIONS = {
  home: ['home', 'top', 'start', 'hero'],
  pi: ['pi', 'π', 'curve', 'story'],
  about: ['about', 'bio', 'who'],
  journey: ['journey', 'timeline', 'facts'],
  roadmap: ['roadmap', 'plan', 'future'],
  projects: ['projects', 'work', 'ctf'],
  skills: ['skills', 'skill'],
  interests: ['interests', 'sports', 'hobbies'],
  contact: ['contact', 'email', 'socials'],
};

function norm(s) {
  return s
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\p{L}\p{N}π+\-*/().' ]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function score(text, tokens, intent) {
  let s = 0;
  for (const k of intent.keys) {
    if (k.includes(' ')) {
      if (text.includes(k)) s += 3 + k.length / 10;
    } else if (tokens.includes(k)) s += 2;
    else if (k.length >= 5 && tokens.some((t) => t.length >= 4 && lev(t, k) <= 1)) s += 1.2; // typo tolerance
  }
  return s;
}

const resolve = (a, mem) => (typeof a === 'function' ? a(mem) : a);

function malaysiaTime() {
  return new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kuala_Lumpur' });
}

function greetingByTime() {
  const h = Number(new Date().toLocaleString('en-GB', { hour: '2-digit', hour12: false }));
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export function welcome(mem) {
  return {
    text: `${greetingByTime()}${mem.name ? `, ${mem.name}` : ''}! I'm ZH-bot — a scripted guide to this site, not Zhi Hui in real time. Ask me anything in your own words, or tap a question below.`,
    follow: STARTERS,
  };
}

/** Returns { text, follow?, actions?, effect? } and mutates mem (name, last intent, counters). */
export function reply(input, mem) {
  const raw = input.trim();
  const text = norm(raw);
  const tokens = text.split(' ');
  mem.turns = (mem.turns || 0) + 1;

  if (!text) return { text: 'Say something and I\'ll do my best. Or type "help".' };

  // commands
  if (/^(help|\/help|what can you do|commands?)$/.test(text))
    return {
      text: 'I can answer questions about Zhi Hui (goals, CGPA, skills, CTF, ScamShield, sports, MBTI, contact), explain the π curve and the Möbius strip, take you to any section ("take me to projects"), switch the theme ("dark mode"), copy the email, tell the Malaysia time, do quick maths ("12*7"), print digits of π ("50 digits of pi"), tell a joke, or say "tell me more" after any answer. "clear" wipes the chat.',
      follow: ['Take me to projects', 'Give me 50 digits of π', 'Tell me a joke', 'Switch theme'],
    };
  if (/^(clear|reset|\/clear|start over)$/.test(text)) return { text: '', effect: 'clear' };

  // name memory
  const nameMatch = raw.match(/\b(?:my name is|call me|i am|i'm|im)\s+([A-Za-z][A-Za-z-]{1,20})\s*[.!]?$/i);
  const notNames = ['a', 'an', 'the', 'not', 'just', 'here', 'fine', 'good', 'ok', 'okay', 'curious', 'interested', 'hiring', 'student', 'looking', 'bored', 'back', 'new'];
  if (nameMatch && !notNames.includes(nameMatch[1].toLowerCase()) && tokens.length <= 5) {
    mem.name = nameMatch[1][0].toUpperCase() + nameMatch[1].slice(1);
    return { text: `Nice to meet you, ${mem.name}. I'll remember that while you're here. What would you like to know?`, follow: STARTERS.slice(0, 4) };
  }
  if (/what('s| is) my name|do you remember me/.test(text))
    return { text: mem.name ? `You're ${mem.name}. I've got a good memory — for this tab, anyway.` : 'You haven\'t told me yet. Say "my name is …".' };

  // greetings, three languages
  if (/^(hi|hello|hey|yo|hiya|sup|morning|evening|good (morning|afternoon|evening))\b/.test(text))
    return { text: `${greetingByTime()}${mem.name ? `, ${mem.name}` : ''}! What would you like to know about Zhi Hui?`, follow: STARTERS.slice(0, 4) };
  if (/\b(hai|helo|apa khabar|selamat (pagi|petang|malam)|terima kasih)\b/.test(text))
    return {
      text: /terima kasih/.test(text)
        ? 'Sama-sama! Anything else? (I answer best in English.)'
        : 'Hai! Khabar baik 😊 Saya ZH-bot. I answer best in English — try "what is your goal?"',
      follow: STARTERS.slice(0, 3),
    };
  if (/你好|您好|嗨|哈喽/.test(raw)) return { text: '你好！我是 ZH-bot 😊 I answer best in English — try asking "what are you learning?"', follow: STARTERS.slice(0, 3) };
  if (/^(thanks|thank you|thx|ty|cheers|appreciate)/.test(text)) return { text: `Anytime${mem.name ? `, ${mem.name}` : ''}. Anything else you\'re curious about?`, follow: ['🎲 Surprise me', 'How do I contact you?'] };
  if (/^(bye|goodbye|see ya|cya|later)\b/.test(text)) return { text: 'See you! The curve will keep drawing while you\'re away — it never finishes. 👋' };

  // follow-up on the previous answer
  if (/^(tell me more|more|and\??|go on|continue|elaborate|explain more|details?|why\??)$/.test(text)) {
    const last = INTENTS.find((i) => i.id === mem.last);
    if (last?.more) {
      mem.last = null;
      return { text: resolve(last.more, mem), follow: last.follow, actions: last.actions };
    }
    return { text: 'That\'s everything I have on that one. Try another question?', follow: STARTERS.slice(0, 4) };
  }

  // theme
  if (/(dark|light|night|day) ?mode|(switch|toggle|change) (the )?theme/.test(text)) {
    return { text: 'Switching the theme — the orbit looks different in daylight.', effect: 'theme' };
  }

  // navigation
  const navMatch = text.match(/(?:take me to|go to|scroll to|jump to|navigate to|bring me to)\s+(?:the\s+|your\s+)?(\w+)/);
  if (navMatch) {
    const target = Object.entries(SECTIONS).find(([, words]) => words.includes(navMatch[1]));
    if (target) return { text: `Taking you to ${target[0]} ↓`, effect: { scroll: target[0] } };
  }

  // π digits
  const digits = text.match(/(\d{1,4})\s*(?:digits?|decimals?)(?: of)? ?(?:pi|π)?/) || (/(digits of (pi|π)|pi digits|π digits)/.test(text) ? [0, '50'] : null);
  if (digits) {
    const n = Math.min(500, Math.max(1, Number(digits[1])));
    return { text: `π to ${n} decimal places (computed in your browser just now):\n${PI_DIGITS.slice(0, n + 2)}${n >= 500 ? '…\nI stopped at 500 — it doesn\'t.' : ''}`, follow: ['What does π mean here?'] };
  }

  // arithmetic
  const expr = raw.replace(/^(what('s| is)|calculate|calc|compute)\s+/i, '').replace(/[=?]\s*$/, '').replace(/×/g, '*').replace(/÷/g, '/');
  if (/^[\d\s+\-*/().^%]+$/.test(expr) && /\d\s*[+\-*/^%]\s*[\d(]/.test(expr)) {
    try {
      const val = Function(`"use strict"; return (${expr.replace(/\^/g, '**')})`)();
      if (Number.isFinite(val)) return { text: `${expr.trim()} = ${Math.round(val * 1e10) / 1e10}` };
    } catch {
      /* not maths after all */
    }
  }

  // time
  if (/what time|time is it|time there|local time|current time|time in malaysia/.test(text))
    return { text: `It's ${malaysiaTime()} in Malaysia right now.` };

  if (/joke|funny|make me laugh/.test(text)) {
    mem.joke = ((mem.joke ?? -1) + 1) % JOKES.length;
    return { text: JOKES[mem.joke], follow: ['Another joke', '🎲 Surprise me'] };
  }
  if (/surprise|random|fun fact|🎲/.test(text) || /^another( one)?$/.test(text)) {
    let i;
    do i = Math.floor(Math.random() * SURPRISES.length);
    while (i === mem.surprise && SURPRISES.length > 1);
    mem.surprise = i;
    return { text: SURPRISES[i], follow: ['🎲 Surprise me', 'What does π mean here?'] };
  }

  // intents
  const ranked = INTENTS.map((it) => ({ it, s: score(text, tokens, it) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);
  if (ranked.length && ranked[0].s >= 1.2) {
    const { it } = ranked[0];
    mem.last = it.id;
    const tail = it.more ? ' (Say "tell me more" for the rest.)' : '';
    return { text: resolve(it.answer, mem) + tail, follow: it.follow, actions: it.actions };
  }

  mem.misses = (mem.misses || 0) + 1;
  return {
    text:
      mem.misses > 2
        ? 'I\'m still a small scripted bot, so that one\'s beyond me. For anything I can\'t answer, the real Zhi Hui reads email.'
        : 'Hmm, I don\'t have an answer for that. I know about goals, CGPA, skills, the CTF, ScamShield, sports, π and how this site works — or type "help".',
    follow: ['help', 'How do I contact you?', '🎲 Surprise me'],
    actions: mem.misses > 2 ? [{ type: 'copy', label: 'Copy email', value: links.email }] : undefined,
  };
}
