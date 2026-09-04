/* Floating blob companion — Q&A + project announcements */
(function () {
  if (window.__CPJR_BOT__) return;
  window.__CPJR_BOT__ = true;

  function rootPrefix() {
    var script =
      document.querySelector('script[src*="site-bot.js"]') ||
      document.querySelector('script[src*="site-nav.js"]');
    var src = script && script.getAttribute("src");
    if (!src) return "";
    return src.replace(/site-bot\.js.*$/, "").replace(/site-nav\.js.*$/, "");
  }

  var root = rootPrefix();
  var ANNOUNCE_KEY = "cpjr-bot-announce-state";
  var ANNOUNCE_ID = "loreman-holo-2026-09";
  var ANNOUNCE_DELAY_MS = 2200;
  var ANNOUNCE_RESHOW_MS = 5 * 60 * 60 * 1000;
  var SOUND_COOLDOWN_MS = 10 * 60 * 60 * 1000;

  var PROJECTS = [
    {
      title: "The Loreman",
      blurb: "A living Spellbook — spells, tiers, and foundations.",
      href: "https://theloreman.com",
      external: true
    },
    {
      title: "Disease Imagined",
      blurb: "An interactive disease visualizer on the web.",
      href: "https://diseaseimagined.com",
      external: true
    },
    {
      title: "Noisegoblin",
      blurb: "A clean meme soundboard — Cristian’s first web project.",
      href: "https://www.noisegoblin.com",
      external: true
    },
    {
      title: "This Website",
      blurb: "The custom-coded home base you’re on right now.",
      href: "https://www.iamchrispaezjr.com",
      external: false
    },
    {
      title: "Links",
      blurb: "All socials and projects in one link-in-bio page.",
      href: root + "links/",
      external: false
    }
  ];

  var FEATURED = PROJECTS[0];

  var FAQ = [
    {
      keys: ["widget", "widgets", "elfsight", "adblock", "ad blocker", "ad-blocker", "whitelist"],
      answer:
        "Quick heads-up: some <strong>ad blockers</strong> block Elfsight widgets on this site (feeds, forms, and similar embeds). If something looks missing or blank, please <strong>disable your ad blocker</strong> for this site or <strong>whitelist iamchrispaezjr.com</strong> — then refresh. Thanks for helping the widgets load."
    },
    {
      keys: ["loreman", "spellbook", "spell"],
      answer:
        "The Loreman is Cristian’s newest web project — a living Spellbook. Open it at <a href=\"https://theloreman.com\" target=\"_blank\" rel=\"noopener noreferrer\">theloreman.com</a>."
    },
    {
      keys: ["disease", "visualizer", "imagined"],
      answer:
        "Disease Imagined is an interactive web visualizer. Try it at <a href=\"https://diseaseimagined.com\" target=\"_blank\" rel=\"noopener noreferrer\">diseaseimagined.com</a>."
    },
    {
      keys: ["noise", "goblin", "soundboard", "sounddrop", "sound"],
      answer:
        "Noisegoblin is a clean meme soundboard — Cristian’s first web project. Play around at <a href=\"https://www.noisegoblin.com\" target=\"_blank\" rel=\"noopener noreferrer\">noisegoblin.com</a>."
    },
    {
      keys: ["project", "projects", "latest", "new", "what.*work", "building"],
      answer: function () {
        var p = PROJECTS[0];
        return (
          "Newest drop: <strong>" +
          p.title +
          "</strong> — " +
          p.blurb +
          " See more on <a href=\"" +
          root +
          "projects/\">Latest Projects</a>."
        );
      }
    },
    {
      keys: ["contact", "email", "hire", "collab", "work with", "reach"],
      answer:
        "Want to reach Cristian? Head to <a href=\"" +
        root +
        "contact/\">Contact Me</a> — that’s the best spot."
    },
    {
      keys: ["who are you", "who're you", "who are", "who is bloop", "what are you"],
      answer:
        "I’m BLOOP — Buddy Linking Our Online Projects, Cristian’s site assistant. He’s a creator and builder from Maryland making web projects, stories, and more. Read more on the <a href=\"" +
        root +
        "about/\">About Me</a> page."
    },
    {
      keys: ["who is cristian", "cristian", "about me", "about cristian"],
      answer:
        "Cristian Paez Jr is a creator and builder from Maryland. Explore his work on the <a href=\"https://www.iamchrispaezjr.com\">main site</a>."
    },
    {
      keys: ["store", "merch", "shop", "buy"],
      answer:
        "The store is at <a href=\"https://www.iamchrispaezjrstore.com\" target=\"_blank\" rel=\"noopener noreferrer\">iamchrispaezjrstore.com</a>."
    },
    {
      keys: ["patreon", "support", "donate", "tip"],
      answer:
        "You can support via <a href=\"https://www.patreon.com/cw/cristianpaezjr/membership\" target=\"_blank\" rel=\"noopener noreferrer\">Patreon</a> or <a href=\"https://www.paypal.com/donate/?hosted_button_id=XRLVQFNNNTMAG\" target=\"_blank\" rel=\"noopener noreferrer\">PayPal</a>."
    },
    {
      keys: [
        "find me",
        "where to find",
        "socials",
        "social",
        "platforms",
        "youtube",
        "instagram",
        "threads",
        "tiktok",
        "snapchat",
        "pinterest",
        "twitch",
        "twitter",
        "\\bx\\b"
      ],
      answer:
        "You can find Cristian on YouTube, Instagram, Threads, X, TikTok, Snapchat, Pinterest, Twitch, & more."
    },
    {
      keys: ["link", "links page", "link in bio", "link-in-bio"],
      answer:
        "All the socials and project links live on the <a href=\"" +
        root +
        "links/\">Links</a> page."
    },
    {
      keys: ["update", "blog", "post", "news"],
      answer:
        "Fresh writes are on <a href=\"" +
        root +
        "updates/\">Updates</a> — newest posts first."
    },
    {
      keys: ["media kit", "press", "rate"],
      answer:
        "Press / collab details are in the <a href=\"" +
        root +
        "media-kit/\">Media Kit</a>."
    },
    {
      keys: ["maryland", "where are you", "where.*from", "location", "based"],
      answer: "Cristian is based in the United States, Maryland. 📍"
    },
    {
      keys: ["hello", "hi", "hey", "yo", "sup"],
      answer: "Hey! Ask me about projects, links, contact, or what’s new — I’m here for it."
    },
    {
      keys: ["help", "what can", "commands"],
      answer:
        "Try asking about The Loreman, Disease Imagined, Noisegoblin, contact, socials, widgets / ad blockers, the store, or what’s newest."
    }
  ];

  function defaultAnnounceState() {
    return { id: ANNOUNCE_ID, dismissedAt: 0, soundAt: 0 };
  }

  function readAnnounceState() {
    var state = defaultAnnounceState();
    try {
      var raw = localStorage.getItem(ANNOUNCE_KEY);
      if (!raw) return state;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.id === ANNOUNCE_ID) {
        state.dismissedAt = Number(parsed.dismissedAt) || 0;
        state.soundAt = Number(parsed.soundAt) || 0;
      }
    } catch (err) {}
    return state;
  }

  function writeAnnounceState(state) {
    try {
      localStorage.setItem(
        ANNOUNCE_KEY,
        JSON.stringify({
          id: ANNOUNCE_ID,
          dismissedAt: state.dismissedAt || 0,
          soundAt: state.soundAt || 0
        })
      );
    } catch (err) {}
  }

  function isAnnounceHidden() {
    var state = readAnnounceState();
    if (!state.dismissedAt) return false;
    return Date.now() - state.dismissedAt < ANNOUNCE_RESHOW_MS;
  }

  function canPlayAnnounceSound() {
    var state = readAnnounceState();
    if (!state.soundAt) return true;
    return Date.now() - state.soundAt >= SOUND_COOLDOWN_MS;
  }

  function markAnnounceDismissed() {
    var state = readAnnounceState();
    state.dismissedAt = Date.now();
    writeAnnounceState(state);
  }

  function markAnnounceSoundPlayed() {
    var state = readAnnounceState();
    state.soundAt = Date.now();
    writeAnnounceState(state);
  }

  function playAnnounceSound() {
    if (!canPlayAnnounceSound()) return;
    try {
      var audio = new Audio(root + "sounds/futuristic-announcement-bar-sfx.mp3");
      audio.preload = "auto";
      var playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(function () {
            markAnnounceSoundPlayed();
          })
          .catch(function () {});
      } else {
        markAnnounceSoundPlayed();
      }
    } catch (err) {}
  }

  function answerFor(text) {
    var q = String(text || "")
      .toLowerCase()
      .trim();
    if (!q) return "Ask me anything about the site — projects, contact, links…";

    var i;
    var item;
    var k;
    for (i = 0; i < FAQ.length; i += 1) {
      item = FAQ[i];
      for (k = 0; k < item.keys.length; k += 1) {
        if (new RegExp(item.keys[k], "i").test(q)) {
          return typeof item.answer === "function" ? item.answer() : item.answer;
        }
      }
    }

    return (
      "Signal unclear. Try asking about projects, The Loreman, contact, or the store. Or browse <a href=\"" +
      root +
      "projects/\">Latest Projects</a>."
    );
  }

  function projectLink(p) {
    if (p.external) {
      return (
        '<a href="' +
        p.href +
        '" target="_blank" rel="noopener noreferrer">' +
        p.title +
        "</a>"
      );
    }
    return '<a href="' + p.href + '">' + p.title + "</a>";
  }

  function announceHtml() {
    return (
      "New project online: <strong>" +
      projectLink(FEATURED) +
      "</strong> — " +
      FEATURED.blurb
    );
  }

  function circularWavePath(radius, amplitude, cycles, samples) {
    var d = "";
    var i;
    for (i = 0; i <= samples; i += 1) {
      var t = (i / samples) * Math.PI * 2;
      var r = radius + amplitude * Math.sin(cycles * t);
      var x = 50 + r * Math.cos(t);
      var y = 50 + r * Math.sin(t);
      d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    }
    return d + "Z";
  }

  function spectrumLines(count, innerR, outerBase) {
    var html = "";
    var i;
    for (i = 0; i < count; i += 1) {
      var t = (i / count) * Math.PI * 2;
      var len = outerBase + (i % 5 === 0 ? 5.2 : i % 3 === 0 ? 3.4 : 2.1);
      var x1 = 50 + innerR * Math.cos(t);
      var y1 = 50 + innerR * Math.sin(t);
      var x2 = 50 + (innerR + len) * Math.cos(t);
      var y2 = 50 + (innerR + len) * Math.sin(t);
      html +=
        '<line x1="' +
        x1.toFixed(2) +
        '" y1="' +
        y1.toFixed(2) +
        '" x2="' +
        x2.toFixed(2) +
        '" y2="' +
        y2.toFixed(2) +
        '" />';
    }
    return html;
  }

  var waveHudSvg =
    '<svg class="cpjr-bot-waves" viewBox="0 0 100 100" aria-hidden="true">' +
    '  <g class="cpjr-bot-wave-spin cpjr-bot-wave-spin--outer cpjr-bot-spectrum">' +
    spectrumLines(48, 38, 2.4) +
    "  </g>" +
    '  <g class="cpjr-bot-wave-spin cpjr-bot-wave-spin--mid">' +
    '    <path class="cpjr-bot-wave cpjr-bot-wave--outer" d="' +
    circularWavePath(41.5, 2.8, 14, 180) +
    '" />' +
    "  </g>" +
    '  <g class="cpjr-bot-wave-spin cpjr-bot-wave-spin--mid">' +
    '    <path class="cpjr-bot-wave cpjr-bot-wave--mid" d="' +
    circularWavePath(32.5, 2.2, 10, 160) +
    '" />' +
    "  </g>" +
    '  <g class="cpjr-bot-wave-spin cpjr-bot-wave-spin--inner">' +
    '    <path class="cpjr-bot-wave cpjr-bot-wave--inner" d="' +
    circularWavePath(24.5, 1.7, 8, 140) +
    '" />' +
    "  </g>" +
    "</svg>";

  var wrap = document.createElement("div");
  wrap.className = "cpjr-bot";
  wrap.innerHTML =
    '<div class="cpjr-bot-panel" id="cpjrBotPanel" hidden>' +
    '  <div class="cpjr-bot-panel-head">' +
    "    <div>" +
    "      <strong>BLOOP</strong>" +
    "      <span>Buddy Linking Our Online Projects</span>" +
    "    </div>" +
    '    <button type="button" class="cpjr-bot-close" id="cpjrBotClose" aria-label="Close chat">×</button>' +
    "  </div>" +
    '  <div class="cpjr-bot-log" id="cpjrBotLog" aria-live="polite"></div>' +
    '  <div class="cpjr-bot-suggestions" id="cpjrBotSuggestions"></div>' +
    '  <form class="cpjr-bot-form" id="cpjrBotForm">' +
    '    <label class="visually-hidden" for="cpjrBotInput">Ask BLOOP</label>' +
    '    <input id="cpjrBotInput" type="text" maxlength="200" placeholder="Ask a question…" autocomplete="off" />' +
    '    <button type="submit">Send</button>' +
    "  </form>" +
    "</div>" +
    '<div class="cpjr-bot-dock">' +
    '<aside class="cpjr-bot-bubble" id="cpjrBotBubble" role="complementary" aria-label="BLOOP messages" hidden>' +
    '  <button type="button" class="cpjr-bot-bubble-close" id="cpjrBotBubbleClose" aria-label="Dismiss messages">×</button>' +
    '  <div class="cpjr-bot-holo-msg" id="cpjrBotHoloGreet" data-holo-msg>' +
    "    Hey there — welcome in. I’m BLOOP: Buddy Linking Our Online Projects." +
    "  </div>" +
    '  <div class="cpjr-bot-holo-msg cpjr-bot-holo-msg--project" id="cpjrBotHoloProject" data-holo-msg>' +
    '    <span class="cpjr-bot-holo-label">Incoming update</span>' +
    '    <span class="cpjr-bot-holo-title" id="cpjrBotBubbleTitle"></span>' +
    '    <p class="cpjr-bot-holo-body" id="cpjrBotBubbleDesc"></p>' +
    '    <a class="cpjr-bot-holo-cta" id="cpjrBotBubbleCta" href="#">Open project →</a>' +
    "  </div>" +
    "</aside>" +
    '<button type="button" class="cpjr-bot-launcher" id="cpjrBotLauncher" aria-expanded="false" aria-controls="cpjrBotPanel" aria-label="Open BLOOP — Buddy Linking Our Online Projects">' +
    '  <span class="cpjr-bot-hud" aria-hidden="true">' +
    waveHudSvg +
    '    <span class="cpjr-bot-core"></span>' +
    "  </span>" +
    "</button>" +
    "</div>";

  document.body.appendChild(wrap);

  var panel = document.getElementById("cpjrBotPanel");
  var log = document.getElementById("cpjrBotLog");
  var form = document.getElementById("cpjrBotForm");
  var input = document.getElementById("cpjrBotInput");
  var launcher = document.getElementById("cpjrBotLauncher");
  var closeBtn = document.getElementById("cpjrBotClose");
  var bubble = document.getElementById("cpjrBotBubble");
  var bubbleClose = document.getElementById("cpjrBotBubbleClose");
  var bubbleTitle = document.getElementById("cpjrBotBubbleTitle");
  var bubbleDesc = document.getElementById("cpjrBotBubbleDesc");
  var bubbleCta = document.getElementById("cpjrBotBubbleCta");
  var holoMsgs = wrap.querySelectorAll("[data-holo-msg]");
  var suggestions = document.getElementById("cpjrBotSuggestions");
  var greeted = false;
  var announceShown = false;
  var holoTimers = [];

  bubbleTitle.textContent = FEATURED.title;
  bubbleDesc.textContent = FEATURED.blurb;
  bubbleCta.href = FEATURED.href;
  if (FEATURED.external) {
    bubbleCta.target = "_blank";
    bubbleCta.rel = "noopener noreferrer";
  }

  function clearHoloTimers() {
    holoTimers.forEach(function (id) {
      window.clearTimeout(id);
    });
    holoTimers = [];
  }

  function hideAnnounceBubble(markDismissed) {
    if (!bubble.classList.contains("is-on") && bubble.hidden) return;
    if (markDismissed !== false) markAnnounceDismissed();
    clearHoloTimers();
    holoMsgs.forEach(function (msg) {
      msg.classList.remove("is-in");
    });
    bubble.classList.remove("is-on");
    window.setTimeout(function () {
      bubble.hidden = true;
    }, 320);
  }

  function showAnnounceBubble() {
    if (announceShown || isAnnounceHidden()) return;
    if (wrap.classList.contains("is-open")) return;
    announceShown = true;
    clearHoloTimers();
    holoMsgs.forEach(function (msg) {
      msg.classList.remove("is-in");
    });
    bubble.hidden = false;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        bubble.classList.add("is-on");
        playAnnounceSound();
        holoTimers.push(
          window.setTimeout(function () {
            if (holoMsgs[0]) holoMsgs[0].classList.add("is-in");
          }, 80)
        );
        holoTimers.push(
          window.setTimeout(function () {
            if (holoMsgs[1]) holoMsgs[1].classList.add("is-in");
          }, 720)
        );
      });
    });
  }

  function setOpen(open) {
    wrap.classList.toggle("is-open", open);
    launcher.setAttribute("aria-expanded", open ? "true" : "false");
    panel.hidden = !open;
    if (open) {
      if (bubble.classList.contains("is-on")) {
        hideAnnounceBubble(true);
      }
      if (!greeted) {
        greeted = true;
        addMsg(
          "bot",
          "Systems online. I’m BLOOP — Buddy Linking Our Online Projects. Ask about projects, links, or what’s new."
        );
        addMsg("bot", announceHtml());
      }
      window.setTimeout(function () {
        input.focus();
      }, 50);
    }
  }

  function addMsg(role, html) {
    var el = document.createElement("div");
    el.className = "cpjr-bot-msg cpjr-bot-msg--" + role;
    el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  bubbleClose.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();
    hideAnnounceBubble();
  });

  suggestions.innerHTML = "";
  [
    "What’s new?",
    "The Loreman?",
    "Who are you?",
    "How do I contact you?",
    "Socials?",
    "Widgets?"
  ].forEach(function (label) {
    var chip = document.createElement("button");
    chip.type = "button";
    chip.className = "cpjr-bot-chip";
    chip.textContent = label;
    chip.addEventListener("click", function () {
      setOpen(true);
      addMsg("user", label);
      window.setTimeout(function () {
        addMsg("bot", answerFor(label));
      }, 220);
    });
    suggestions.appendChild(chip);
  });

  launcher.addEventListener("click", function () {
    setOpen(!wrap.classList.contains("is-open"));
  });

  closeBtn.addEventListener("click", function () {
    setOpen(false);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addMsg("user", text.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    input.value = "";
    window.setTimeout(function () {
      addMsg("bot", answerFor(text));
    }, 240);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && wrap.classList.contains("is-open")) {
      setOpen(false);
    }
  });

  /* Visit announce: delay only, then holographic messages + SFX */
  if (!isAnnounceHidden()) {
    window.setTimeout(function () {
      showAnnounceBubble();
    }, ANNOUNCE_DELAY_MS);
  }
})();
