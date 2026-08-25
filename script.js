/* ============================================
   Zhi Hui — Portfolio
   Vanilla JS, no dependencies. Everything here
   degrades gracefully: if JS fails to load, the
   .reveal CSS class still shows content (see the
   .no-js fallback rule in style.css), the theme
   just stays dark, and the nav still works via
   plain #anchor links.
   ============================================ */

(function () {
  "use strict";

  /* ---------------------------------------------
     0. Safe localStorage helpers (private browsing
        / sandboxed environments can throw)
     --------------------------------------------- */
  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------
     1. Theme toggle (light / dark)
     --------------------------------------------- */
  function initTheme() {
    var root = document.documentElement;
    var toggle = document.getElementById("theme-toggle");
    var stored = safeGet("zh-theme");

    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      root.setAttribute("data-theme", "light");
    }

    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      safeSet("zh-theme", next);
    });
  }

  /* ---------------------------------------------
     2. Scroll progress bar (top of page)
     --------------------------------------------- */
  function initScrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar) return;

    function update() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------------------------------------------
     2b. Custom cursor (dot + trailing ring).
     Skipped automatically on touch devices via the
     (hover: hover) and (pointer: fine) CSS guard —
     this JS just mirrors that same check.
     --------------------------------------------- */
  function initCustomCursor() {
    var dot = document.getElementById("cursor-dot");
    var ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    var supportsFinePointer = window.matchMedia &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsFinePointer) return;

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var hasMoved = false;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        ringX = mouseX;
        ringY = mouseY;
        hasMoved = true;
      }
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    var hoverTargets = document.querySelectorAll(
      "a, button, .btn, label, input, .theme-toggle, .card, .frame, .nav-toggle-label"
    );
    hoverTargets.forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        dot.classList.add("is-hover");
        ring.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function () {
        dot.classList.remove("is-hover");
        ring.classList.remove("is-hover");
      });
    });

    document.addEventListener("mouseleave", function () {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  }

  /* ---------------------------------------------
     4. Scroll-triggered reveal animations
     --------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------
     5. Animated skill meters (fill on scroll-in)
     --------------------------------------------- */
  function initMeters() {
    var meters = document.querySelectorAll(".meter__fill[data-percent]");
    if (!meters.length) return;

    if (!("IntersectionObserver" in window)) {
      meters.forEach(function (el) { el.style.width = el.dataset.percent + "%"; });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            // rAF so the browser registers the 0% start before animating
            requestAnimationFrame(function () {
              el.style.width = el.dataset.percent + "%";
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    meters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------
     6. Rotating "training to become…" role text
     --------------------------------------------- */
  function initRoleRotator() {
    var el = document.getElementById("role-rotator");
    if (!el) return;

    var roles = [
      "a SOC analyst",
      "a penetration tester",
      "genuinely good at reading logs",
      "someone worth hiring"
    ];

    var i = 0;
    var typingSpeed = 45;
    var deletingSpeed = 28;
    var holdTime = 1600;

    function type(text, cb) {
      var pos = 0;
      (function step() {
        el.textContent = text.slice(0, pos);
        pos++;
        if (pos <= text.length) {
          setTimeout(step, typingSpeed);
        } else {
          setTimeout(cb, holdTime);
        }
      })();
    }

    function erase(text, cb) {
      var pos = text.length;
      (function step() {
        el.textContent = text.slice(0, pos);
        pos--;
        if (pos >= 0) {
          setTimeout(step, deletingSpeed);
        } else {
          cb();
        }
      })();
    }

    function cycle() {
      var current = roles[i % roles.length];
      type(current, function () {
        erase(current, function () {
          i++;
          cycle();
        });
      });
    }

    cycle();
  }

  /* ---------------------------------------------
     7. Back-to-top button
     --------------------------------------------- */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;

    var ticking = false;
    function update() {
      if (window.scrollY > 500) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });

    update();
  }

  /* ---------------------------------------------
     8. Confetti burst (fires once, on the email
        button — a small "thanks for reaching out"
        surprise, not a nag that repeats)
     --------------------------------------------- */
  function launchConfetti(originEl) {
    var layer = document.getElementById("confetti-layer");
    if (!layer) return;

    var colors = ["#7c5cff", "#00e5c7", "#ff5ca8", "#ffb020"];
    var rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, width: 0, top: window.innerHeight / 2 };
    var originX = rect.left + rect.width / 2;

    for (var n = 0; n < 40; n++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = (originX + (Math.random() * 240 - 120)) + "px";
      piece.style.top = "-20px";
      piece.style.background = colors[n % colors.length];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      var duration = 2.2 + Math.random() * 1.6;
      piece.style.animationDuration = duration + "s";
      piece.style.animationDelay = (Math.random() * 0.4) + "s";
      layer.appendChild(piece);
      (function (el, life) {
        setTimeout(function () { el.remove(); }, life * 1000 + 500);
      })(piece, duration + 0.4);
    }
  }

  function initConfettiTrigger() {
    var emailBtn = document.querySelector('a[href^="mailto:"].btn');
    if (!emailBtn) return;
    emailBtn.addEventListener("click", function () {
      launchConfetti(emailBtn);
    });
  }

  /* ---------------------------------------------
     9. Chatbox — small scripted conversation.
        No network calls, everything is a local
        lookup table. Honest about being scripted.
     --------------------------------------------- */
  function initChatbox() {
    var chatbox = document.getElementById("chatbox");
    var toggleBtn = document.getElementById("chat-toggle");
    var closeBtn = document.getElementById("chat-close");
    var panel = document.getElementById("chat-panel");
    var body = document.getElementById("chat-body");
    var quickReplies = document.getElementById("chat-quickreplies");
    var suggestWrap = document.getElementById("chat-quickreplies-wrap");
    var suggestToggle = document.getElementById("chat-suggest-toggle");
    var form = document.getElementById("chat-form");
    var input = document.getElementById("chat-input");

    if (!chatbox || !toggleBtn || !panel) return;

    function setSuggestOpen(open) {
      if (!suggestWrap || !suggestToggle) return;
      suggestWrap.classList.toggle("is-open", open);
      suggestToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (suggestToggle) {
      suggestToggle.addEventListener("click", function () {
        setSuggestOpen(!suggestWrap.classList.contains("is-open"));
      });
    }

    var answers = {
      goal: "Short-term, a SOC analyst role — reading logs and alerts, learning what \"normal\" looks like. Long-term, penetration testing, once the fundamentals are solid.",
      learning: "Right now: HTML/CSS, general computing fundamentals, networking basics, and Linux fundamentals. No certifications yet — check the Skills section for the honest breakdown.",
      study: "Multimedia University (MMU) in Malaysia — Foundation in Computing and Informatics, currently semester 1, living off-campus nearby.",
      mbti: "INFJ. Best thinking happens alone first — reading, taking notes, working a problem quietly — then it gets stress-tested against coursemates before it's trusted.",
      why: "Attention and pattern recognition are already natural fits, so a SOC role — noticing what's off before it's a real problem — felt like the right entry point. Penetration testing comes after, once the fundamentals are earned rather than skipped.",
      sports: "Basketball (Stephen Curry), MLB (Aaron Judge), and football/FIFA (Jude Bellingham). The Interests section has the full breakdown, including why each one actually matters.",
      built: "Plain HTML and CSS for structure and almost all the animation, plus a bit of vanilla JavaScript for things like this chat, the light/dark toggle, and the scroll reveals. No frameworks, no backend, no external libraries.",
      contact: "Head to the Contact section below, or just click the email button there — it opens your mail app directly.",
      fun: "Favourite basketball player is Stephen Curry, and this whole site's background is an aurora because \"finding a signal in the noise\" felt like a good visual metaphor for cybersecurity. Also: I'm scripted, so I can't actually take credit for that idea — Zhi Hui can.",
      default: "I'm just a small scripted bot with a handful of canned answers — try one of the buttons above, or ask about goals, skills, school, or contact info."
    };

    var trivia = [
      "This site's moving background is literally named \"aurora\" in the code — three blurred color blobs drifting on a slow loop.",
      "The click-to-spin cards use a hidden checkbox and a label — a full 360° rotation with zero JavaScript involved in that particular trick.",
      "The \"targetPulse\" glow you see after jumping to a section only lasts 1.6 seconds. Blink and you'll miss it.",
      "This chat is entirely scripted client-side — no API calls, no server. Every reply comes from a small local lookup table, including this one.",
      "The Skills page deliberately shows things at 0% and \"not started\" instead of rounding up. Honesty over an impressive-looking bar chart.",
      "The button you're about to hover over breathes — a slow 4-second scale pulse — until you actually touch it, then it stops to respond to you instead."
    ];
    var triviaIndex = -1;

    function nextTrivia() {
      var idx;
      do { idx = Math.floor(Math.random() * trivia.length); } while (idx === triviaIndex && trivia.length > 1);
      triviaIndex = idx;
      return trivia[idx];
    }

    var keywordMap = [
      [/goal|career|plan|future|dream/i, "goal"],
      [/learn|skill|study progress|know\b/i, "learning"],
      [/study|school|university|mmu|campus|where.*(live|study)/i, "study"],
      [/mbti|infj|personality|introvert/i, "mbti"],
      [/why.*(cyber|security|soc)|why did|reason/i, "why"],
      [/sport|basketball|curry|baseball|judge|football|fifa|bellingham|hobby/i, "sports"],
      [/built|code|javascript|css|html|framework|tech stack|how.*(made|made this)/i, "built"],
      [/contact|email|reach|talk|message/i, "contact"],
      [/fun|joke/i, "fun"],
      [/surprise|random|trivia/i, "surprise"],
      [/hi|hello|hey/i, null] // handled specially below
    ];

    function appendMessage(text, who) {
      var msg = document.createElement("div");
      msg.className = "chat-msg chat-msg--" + who;
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
      return msg;
    }

    function showTyping(cb) {
      var typing = document.createElement("div");
      typing.className = "chat-msg chat-msg--bot chat-msg--typing";
      typing.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(typing);
      body.scrollTop = body.scrollHeight;
      setTimeout(function () {
        typing.remove();
        cb();
      }, 500 + Math.random() * 400);
    }

    function respond(key) {
      showTyping(function () {
        var text = key === "surprise" ? nextTrivia() : (answers[key] || answers.default);
        appendMessage(text, "bot");
      });
    }

    function openChat() {
      chatbox.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      var ping = toggleBtn.querySelector(".chat-toggle__ping");
      if (ping) ping.style.display = "none";
      input && input.focus();
    }

    function closeChat() {
      chatbox.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    }

    toggleBtn.addEventListener("click", function () {
      chatbox.classList.contains("is-open") ? closeChat() : openChat();
    });
    closeBtn && closeBtn.addEventListener("click", closeChat);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && chatbox.classList.contains("is-open")) closeChat();
    });

    var hasInteracted = false;
    function collapseSuggestionsOnce() {
      if (hasInteracted) return;
      hasInteracted = true;
      setSuggestOpen(false);
    }

    if (quickReplies) {
      quickReplies.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (!btn) return;
        var q = btn.dataset.q;
        appendMessage(btn.textContent, "user");
        respond(q);
        collapseSuggestionsOnce();
      });
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = (input.value || "").trim();
        if (!text) return;
        appendMessage(text, "user");
        input.value = "";
        collapseSuggestionsOnce();

        if (/^(hi|hello|hey)\b/i.test(text)) {
          showTyping(function () { appendMessage("Hey! Try one of the quick questions above, or ask about goals, skills, or contact info.", "bot"); });
          return;
        }

        var matched = "default";
        for (var i = 0; i < keywordMap.length; i++) {
          if (keywordMap[i][1] && keywordMap[i][0].test(text)) {
            matched = keywordMap[i][1];
            break;
          }
        }
        respond(matched);
      });
    }
  }

  /* ---------------------------------------------
     boot
     --------------------------------------------- */
  document.documentElement.classList.remove("no-js");

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initScrollProgress();
    initCustomCursor();
    initReveal();
    initMeters();
    initRoleRotator();
    initBackToTop();
    initConfettiTrigger();
    initChatbox();
  });
})();
