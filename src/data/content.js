// Every piece of text on the site lives here, so updating the portfolio never means digging through components.
const img = (name) => `${import.meta.env.BASE_URL}images/${name}`;

export const profile = {
  name: 'Zhi Hui',
  fullName: 'Hong Zhi Hui',
  initials: 'ZH',
  age: 18,
  mbti: 'INFJ',
  school: 'Multimedia University (MMU), Malaysia',
  programme: 'Foundation in Computing and Informatics',
  status: 'Semester 2 complete',
  cgpa: '3.86',
  sem1Gpa: '3.86',
  living: 'Off-campus, near MMU',
  location: 'Muar, Johor, Malaysia',
  photo: img('profile-photo.jpg'),
};

export const links = {
  email: 'zhihuihong0715@gmail.com',
  emailHref: 'https://mail.google.com/mail/?view=cm&fs=1&to=zhihuihong0715@gmail.com',
  whatsapp: 'https://wa.me/601130084486',
  instagram: 'https://instagram.com/huiiii0715',
  facebook: 'https://facebook.com/huiiii0715',
  github: 'https://github.com/zhihui0715',
};

export const hero = {
  tagline: 'Learning to notice what everyone else scrolls past.',
  roles: ['Training to become a SOC analyst', 'Reading logs, chasing patterns', 'Writing up CTFs, one flag at a time', 'Exploring where AI meets security', 'Never stuck at one point'],
  intro:
    "I'm a Foundation in Computing and Informatics student at Multimedia University, building toward a career in cybersecurity — and, more and more, the places where it meets AI. The plan is to start as a SOC analyst, get genuinely good at reading systems and traffic, and grow from there into penetration testing. This site is where I'm keeping an honest, running record of that — not a highlight reel, just where things actually stand.",
};

export const piStory = [
  { k: 'formula', text: 'Two arms spin together. One turns once — the other turns π times.' },
  { k: 'close', text: 'Every loop comes so close to where it started. Never quite there.' },
  { k: 'never', text: 'π never ends and never repeats, so this line never meets itself.' },
  { k: 'point', text: 'No single point defines the path. No single result defines you.' },
  { k: 'possible', text: "So keep going. Anything is possible — don't stop at one point." },
];

export const journey = [
  {
    when: 'Semester 1 · done',
    title: 'Enrolled at MMU — GPA 3.86',
    body: 'Started the Foundation in Computing and Informatics programme and finished the semester with a GPA of 3.86. Living off-campus, splitting my time between focused solo study and working through problems with coursemates.',
    state: 'done',
  },
  {
    when: 'Semester 2 · done',
    title: 'Two semesters down, CGPA 3.86',
    body: 'Finished Semester 2 of the Foundation programme with a CGPA of 3.86 — comfortably above the 3.67 line I set for myself to stay in scholarship range.',
    state: 'done',
  },
  {
    when: 'September 2026',
    title: 'First CTF: Cyberspectre (MMU)',
    body: 'Worked through 25 challenges across web, forensics, OSINT, crypto, Linux and misc — and wrote every one up step by step, dead ends included.',
    state: 'done',
  },
  {
    when: 'Ongoing',
    title: 'Building the fundamentals',
    body: "No certifications yet — and I'm okay saying that plainly. There's real work to point to now, but the priority is still understanding the basics well enough that everything after this comes easier.",
    state: 'now',
  },
  {
    when: 'Next milestone',
    title: 'SOC analyst role',
    body: 'The first real target. I want a job where I\'m reading logs, catching alerts, and learning what "normal" looks like closely enough to notice when it isn\'t.',
    state: 'next',
  },
  {
    when: 'Longer term',
    title: 'Penetration testing & AI security',
    body: 'Once the analyst fundamentals are solid, I want to move toward testing systems instead of just watching them — understanding how things break so I can help stop it from happening for real. AI systems are becoming part of what needs protecting, and part of how we protect things, so that path runs alongside.',
    state: 'next',
  },
];

export const facts = [
  {
    title: 'Where I study',
    body: 'Multimedia University (MMU), Malaysia — just finished Semester 2 of the Foundation programme, living off-campus close to school.',
    tag: 'Semester 2 · complete',
  },
  {
    title: 'How my brain works',
    body: "I'm an INFJ. I think best alone first, then stress-test my ideas against coursemates before I trust them.",
    tag: 'MBTI · INFJ',
  },
  {
    title: "What I'm chasing first",
    body: 'A SOC analyst role — the entry point into the kind of security work I actually want to build a career on.',
    tag: 'Goal 1 of 2',
  },
  {
    title: 'Where that leads',
    body: "Penetration testing, once I've earned the fundamentals through real analyst experience rather than skipping ahead.",
    tag: 'Goal 2 of 2',
  },
];

export const whySite =
  "Most student portfolios I looked at before building this one were stretched a little thin — projects that were really tutorials, skills listed at a confidence they hadn't earned yet. I didn't want that here. Everything on this site, especially the skills, is meant to reflect where I genuinely am: early, still learning the fundamentals, and completely fine admitting that. I'd rather this site age well as I actually grow into the field than look impressive for one semester and then feel dishonest later.";

export const about = {
  lead: "Beyond the goals and the coursework, here's the rest of the picture — how I think, why I'm drawn to this field, and what's going on outside of school.",
  stories: [
    {
      title: 'How I actually work',
      body: "I'm an INFJ, which shows up in how I approach almost everything I study. I need to sit with a problem alone first — reading around it, taking messy notes, turning it over a few times before it makes sense to me. Only after that do I bring it to my coursemates, partly to check my thinking and partly because talking it through out loud catches gaps that quiet reading doesn't. My days are usually split fairly evenly between long solo study blocks and time spent with classmates, either grinding through assignments together or just decompressing after a heavy one.",
    },
    {
      title: 'SPM: 9A in 10 subjects',
      body: "Before MMU, there was SPM — and I came out of it with 9 A's out of 10 subjects. It's still one of the results I'm quietly proudest of, not because it was flashy, but because of how unglamorous the work behind it actually was. Long stretches of revision on days I didn't feel like opening a book, past papers redone until the mistakes stopped repeating, that kind of thing. The one subject that didn't turn into an A still nags at me a little if I'm honest, but I've stopped reading it as a flaw in the result and started reading it as a reminder that consistency beats any single good week. That result is a big part of why I trust the \"just put the reps in\" approach I'm carrying into university coursework now.",
    },
    {
      title: 'Why cybersecurity, specifically',
      body: 'I like the idea of being the person who notices something is off before it turns into an actual problem. That\'s what pulled me toward a SOC analyst role in particular — it\'s less about breaking things and more about attention, patience, and pattern recognition, which happen to be things I already gravitate toward. I see it as the right place to start a security career: get genuinely comfortable reading systems, logs, and traffic first, and only move into penetration testing once I actually understand what I\'d be trying to break and why. Skipping straight to the exciting part felt like it would leave gaps I\'d regret later.',
    },
  ],
};

export const roadmapIntro =
  "Outside of classes, I've got a rough timeline for where I want this to go — some of it academic, some of it financial. Writing it down here is partly accountability and partly just honesty: this is what I'm actually working toward, not a polished version of it.";

export const roadmap = [
  {
    when: 'Year 1',
    title: 'Keep CGPA above 3.67',
    body: "The first real checkpoint. A CGPA above 3.67 keeps me in range for scholarship consideration, which matters a lot more to me than the number itself — it's the difference between funding the rest of this degree comfortably or not.",
    badge: 'CGPA 3.86 after Semester 2 — on track',
  },
  {
    when: 'Through the degree',
    title: 'Go deeper into cybersecurity and AI',
    body: 'Once the foundation year is done, I am continuing into a degree at MMU and want to specialise properly — in security first, with AI right next to it — building real, provable skills instead of just collecting course credits, so I actually have something to show for it by graduation.',
  },
  {
    when: 'Graduation · around age 21',
    title: 'SOC analyst internship',
    body: "My first real step into the industry. I'm expecting somewhere around RM4,000+ to start — realistic for an entry-level analyst position, and enough to build on.",
  },
  {
    when: 'By 25',
    title: 'RM8,000+, and branching out',
    body: "Once the analyst experience is solid, I want to move into penetration testing or AI security engineering — roles that build directly on the log-reading, pattern-spotting groundwork I'll have put in earlier. RM8,000+ feels like a fair target for that stage.",
  },
  {
    when: 'By 30',
    title: 'RM10,000+',
    body: "The longer-term target. By this point I'd want to be established enough in security — whether that's pentesting, AI security, or something adjacent — that RM10,000+ is a realistic, not aspirational, number.",
  },
  {
    when: 'Someday, if it works out',
    title: 'A Mercedes',
    body: "Not the point of any of this, but I won't pretend it isn't on the list. If the rest of the plan actually happens, this is the reward I'm picturing at the end of it.",
  },
];

export const projects = [
  {
    id: 'ctf',
    title: 'CTF Write-ups',
    sub: 'Cyberspectre (MMU) · September 2026',
    body: 'My first capture-the-flag event, documented challenge by challenge: how I recognised what each one was asking, the commands and tools I used, the dead ends, and the technique underneath. Written so that someone a step behind me could follow it.',
    href: 'https://github.com/zhihui0715/CTF-writeup',
    stats: [
      { label: 'Web', n: 9 },
      { label: 'Forensics', n: 5 },
      { label: 'OSINT', n: 4 },
      { label: 'Misc', n: 3 },
      { label: 'Crypto', n: 2 },
      { label: 'Linux', n: 2 },
    ],
    total: 25,
    sample: "echo 'Y3liZXJzcGVjdHJlezMz...' | base64 -d",
  },
  {
    id: 'scamshield',
    title: 'ScamShield MY',
    sub: 'Scam awareness for Malaysia',
    body: 'A project aimed at helping people in Malaysia spot common scams before they fall for them — turning the "notice what\'s off" instinct I want as an analyst into something ordinary people can use.',
    href: null, // add 'https://github.com/zhihui0715/scamshield-my' back once the repo is public
  },
];

export const skills = {
  intro:
    "I'd rather show you an honest picture than an inflated one. I'm two semesters into a Foundation programme — no certifications yet, but my first CTF is written up and there's a project on GitHub. Here's exactly where things stand, and where they're headed next.",
  groups: [
    {
      key: 'learning',
      label: 'Currently learning',
      state: 'learning',
      items: ['HTML & CSS', 'Computing fundamentals', 'Networking basics', 'Linux fundamentals', 'Python & ML basics', 'Building with AI tools'],
    },
    {
      key: 'ctf',
      label: 'Practised in CTFs',
      state: 'practised',
      items: ['Web challenges', 'Digital forensics', 'OSINT', 'Crypto basics', 'Linux command line'],
    },
    {
      key: 'roadmap',
      label: 'On the roadmap',
      state: 'not started',
      items: ['SIEM & log analysis', 'Security certifications', 'Penetration testing tools'],
    },
  ],
  notes: [
    {
      title: 'Why so little is filled in yet',
      body: "I'm two semesters into a Foundation programme, not partway through a specialised cybersecurity degree. The fundamentals come first, and I'd rather show a handful of things I've genuinely touched than twelve things I've only read about once. This page will fill in gradually, and I'd rather you watch it grow honestly than see it fully stocked on day one.",
    },
    {
      title: 'What the labels actually mean',
      body: '"Learning" means I\'ve written code or worked through real material in that area, even if I\'m still early. "Practised" means I\'ve used it to solve real CTF challenges and written them up. "Not started" means it\'s a genuine goal for later in the programme — something I know is coming, but haven\'t opened yet. I\'m keeping that line clear on purpose.',
    },
  ],
};

export const interests = {
  lead: "Sports take up most of my attention outside of coursework. Here's what's usually on in the background — or, depending on the week, very much in the foreground.",
  items: [
    {
      sport: 'Basketball',
      player: 'Stephen Curry',
      img: img('basketball-player.jpg'),
      body: "My favourite player is Stephen Curry, and it's not really about the highlight-reel threes. What gets me is how repetitive and unglamorous the actual work behind that shot is — thousands of reps that nobody's filming, until it looks effortless on camera. It's a mindset I try to steal for studying: the visible result is just the last five percent of a lot of quiet, boring repetition.",
    },
    {
      sport: 'Baseball — MLB',
      player: 'Aaron Judge',
      img: img('baseball-player.jpg'),
      body: 'I follow the MLB mainly to watch Aaron Judge play. There\'s something satisfying about a sport that rewards patience and precision over constant motion — a lot of waiting for the right pitch, then one clean swing that matters more than the ten before it.',
    },
    {
      sport: 'Football — FIFA',
      player: 'Jude Bellingham',
      img: img('football-player.jpg'),
      body: "On the football side, I keep close track of Jude Bellingham's games. Watching how his role has shifted and expanded over the past couple of seasons has been genuinely interesting to follow — a reminder that getting better at something often means taking on more responsibility, not less.",
    },
  ],
};

export const contact = {
  lead: "I'm open to conversations about internships, entry-level SOC roles, or just talking shop about security with people further along than I am. If any of that sounds like you, reach out — I'd genuinely like to hear from you.",
};

export const nav = [
  { id: 'home', label: 'Home' },
  { id: 'pi', label: 'π' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'interests', label: 'Interests' },
  { id: 'contact', label: 'Contact' },
];
