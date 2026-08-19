/* Shared hamburger menu behavior (all pages) */
(function () {
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mobileNav");
  var backdrop = document.getElementById("navBackdrop");
  if (!toggle || !nav || !backdrop) return;

  var year = document.getElementById("year");
  var dropdowns = [
    {
      toggle: document.getElementById("projectsDropdownToggle"),
      menu: document.getElementById("projectsSubmenu"),
      showLabel: "Show Web Projects links",
      hideLabel: "Hide Web Projects links"
    }
  ];

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setDropdownOpen(dropdown, open) {
    if (!dropdown.toggle || !dropdown.menu) return;
    dropdown.toggle.setAttribute("aria-expanded", open ? "true" : "false");
    dropdown.toggle.setAttribute(
      "aria-label",
      open ? dropdown.hideLabel : dropdown.showLabel
    );
    dropdown.menu.classList.toggle("is-open", open);
  }

  function closeAllDropdowns() {
    dropdowns.forEach(function (dropdown) {
      setDropdownOpen(dropdown, false);
    });
  }

  function setMenuOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    nav.setAttribute("aria-hidden", open ? "false" : "true");
    backdrop.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("menu-open", open);
    if (!open) {
      closeAllDropdowns();
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  dropdowns.forEach(function (dropdown) {
    if (!dropdown.toggle) return;
    dropdown.toggle.addEventListener("click", function () {
      var isOpen = dropdown.toggle.getAttribute("aria-expanded") === "true";
      setDropdownOpen(dropdown, !isOpen);
    });
  });

  backdrop.addEventListener("click", closeMenu);

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
})();

/* Site chrome light 8am–5pm local time; night 5pm–8am */
(function () {
  var timer = 0;

  function getLocalHourMinute(date) {
    var d = date || new Date();
    return { hour: d.getHours(), minute: d.getMinutes() };
  }

  function isDayMode(date) {
    var hm = getLocalHourMinute(date || new Date());
    return hm.hour >= 8 && hm.hour < 17;
  }

  function msUntilNextSwitch(date) {
    var now = date || new Date();
    var hm = getLocalHourMinute(now);
    var minutesNow = hm.hour * 60 + hm.minute;
    var targetMinutes = isDayMode(now) ? 17 * 60 : 8 * 60;
    var deltaMinutes = targetMinutes - minutesNow;
    if (deltaMinutes <= 0) deltaMinutes += 24 * 60;
    return deltaMinutes * 60 * 1000;
  }

  function applySiteTheme() {
    var night = !isDayMode(new Date());
    var theme = night ? "night" : "day";

    document.querySelectorAll(".site-footer").forEach(function (footer) {
      footer.classList.toggle("footer-night", night);
      footer.setAttribute("data-footer-theme", theme);
    });

    document.querySelectorAll(".site-header").forEach(function (header) {
      header.classList.toggle("header-night", night);
      header.setAttribute("data-header-theme", theme);
    });

    document.querySelectorAll(".mobile-nav").forEach(function (nav) {
      nav.classList.toggle("nav-night", night);
      nav.setAttribute("data-nav-theme", theme);
    });

    document.documentElement.classList.toggle("site-night", night);
    document.documentElement.setAttribute("data-site-theme", theme);
  }

  function scheduleNextSwitch() {
    if (timer) window.clearTimeout(timer);
    var wait = Math.min(msUntilNextSwitch(new Date()), 6 * 60 * 60 * 1000);
    timer = window.setTimeout(function () {
      applySiteTheme();
      scheduleNextSwitch();
    }, wait + 250);
  }

  applySiteTheme();
  scheduleNextSwitch();
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      applySiteTheme();
      scheduleNextSwitch();
    }
  });
})();

/* Header pill: Store at top → Members after scroll */
(function () {
  var btn = document.querySelector(".header-right .store-btn");
  if (!btn) return;

  var STORE_HREF = "https://www.iamchrispaezjrstore.com";
  var STORE_LABEL = "Store";
  var MEMBERS_HREF = "https://www.patreon.com/cw/cristianpaezjr/membership";
  var MEMBERS_LABEL = "Patreon";
  var THRESHOLD = 72;
  var showingMembers = null;

  function setMembersMode(on) {
    if (showingMembers === on) return;
    showingMembers = on;
    if (on) {
      btn.href = MEMBERS_HREF;
      btn.textContent = MEMBERS_LABEL;
      btn.setAttribute("aria-label", "Patreon");
    } else {
      btn.href = STORE_HREF;
      btn.textContent = STORE_LABEL;
      btn.setAttribute("aria-label", "Store");
    }
  }

  function sync() {
    setMembersMode(window.scrollY > THRESHOLD);
  }

  window.addEventListener("scroll", sync, { passive: true });
  sync();
})();

/* Social row fades: header on desktop, footer on mobile */
(function () {
  var desktopQuery = window.matchMedia("(min-width: 901px)");
  var mobileQuery = window.matchMedia("(max-width: 900px)");

  function syncFade(el, enabled) {
    if (!enabled) {
      el.classList.remove("social-fade-left", "social-fade-right");
      return;
    }

    var maxScroll = el.scrollWidth - el.clientWidth;
    var left = el.scrollLeft;
    var eps = 2;
    var canScroll = maxScroll > eps;

    el.classList.toggle("social-fade-left", canScroll && left > eps);
    el.classList.toggle("social-fade-right", canScroll && left < maxScroll - eps);
  }

  function bindSocialFade(selector, isEnabled) {
    document.querySelectorAll(selector).forEach(function (el) {
      function sync() {
        syncFade(el, isEnabled());
      }

      el.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync);

      if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(sync).observe(el);
      }

      el.querySelectorAll("img").forEach(function (img) {
        if (!img.complete) img.addEventListener("load", sync);
      });

      sync();
    });
  }

  function onBreakpointChange(query, syncAll) {
    if (query.addEventListener) {
      query.addEventListener("change", syncAll);
    } else if (query.addListener) {
      query.addListener(syncAll);
    }
  }

  bindSocialFade(".header-right .social-links", function () {
    return desktopQuery.matches;
  });
  bindSocialFade(".site-footer .social-links", function () {
    return mobileQuery.matches;
  });

  onBreakpointChange(desktopQuery, function () {
    document.querySelectorAll(".header-right .social-links").forEach(function (el) {
      syncFade(el, desktopQuery.matches);
    });
  });
  onBreakpointChange(mobileQuery, function () {
    document.querySelectorAll(".site-footer .social-links").forEach(function (el) {
      syncFade(el, mobileQuery.matches);
    });
  });
})();

/* Night moon: once per local night shift, swims through footer when it comes into view */
(function () {
  var STORAGE_KEY = "cpjr-moon-night";
  var playedThisVisit = false;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getLocalParts(date) {
    var d = date || new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours()
    };
  }

  function isNightTime(date) {
    var hour = getLocalParts(date).hour;
    return hour >= 17 || hour < 8;
  }

  function getNightShiftKey(date) {
    var p = getLocalParts(date || new Date());
    if (!(p.hour >= 17 || p.hour < 8)) return null;

    if (p.hour < 8) {
      var prev = new Date(p.year, p.month - 1, p.day);
      prev.setDate(prev.getDate() - 1);
      return (
        prev.getFullYear() +
        "-" +
        pad(prev.getMonth() + 1) +
        "-" +
        pad(prev.getDate())
      );
    }

    return p.year + "-" + pad(p.month) + "-" + pad(p.day);
  }

  function alreadyPlayedTonight(shiftKey) {
    try {
      return localStorage.getItem(STORAGE_KEY) === shiftKey;
    } catch (err) {
      return false;
    }
  }

  function markPlayed(shiftKey) {
    try {
      localStorage.setItem(STORAGE_KEY, shiftKey);
    } catch (err) {}
  }

  function moonSrc() {
    var script = document.querySelector('script[src*="site-nav.js"]');
    var src = script && script.getAttribute("src");
    if (src) return src.replace(/site-nav\.js.*$/, "") + "icons/moon.png?v=2";
    return "icons/moon.png?v=2";
  }

  function playMoon(footer) {
    if (playedThisVisit || !footer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!isNightTime(new Date())) return;

    var shiftKey = getNightShiftKey(new Date());
    if (!shiftKey || alreadyPlayedTonight(shiftKey)) return;

    playedThisVisit = true;
    markPlayed(shiftKey);

    var sky = document.createElement("div");
    sky.className = "night-sky";
    sky.setAttribute("aria-hidden", "true");
    [1, 2, 3].forEach(function (n) {
      var cloud = document.createElement("span");
      cloud.className = "night-cloud night-cloud--" + n;
      sky.appendChild(cloud);
    });
    footer.appendChild(sky);

    var moon = document.createElement("img");
    moon.className = "night-moon";
    moon.src = moonSrc();
    moon.alt = "";
    moon.setAttribute("aria-hidden", "true");
    moon.decoding = "async";
    footer.appendChild(moon);

    window.requestAnimationFrame(function () {
      sky.classList.add("is-passing");
      moon.classList.add("is-passing");
    });

    moon.addEventListener("animationend", function () {
      moon.remove();
      sky.remove();
    });
  }

  var footer = document.querySelector(".site-footer");
  if (!footer) return;

  if (typeof IntersectionObserver === "undefined") {
    window.addEventListener(
      "scroll",
      function onScroll() {
        var rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          playMoon(footer);
          window.removeEventListener("scroll", onScroll);
        }
      },
      { passive: true }
    );
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        playMoon(footer);
        observer.disconnect();
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  observer.observe(footer);
})();

/* Bottom-right announcement toast: after scroll + 3s */
(function () {
  var STORAGE_KEY = "cpjr-announce-state";
  var LEGACY_KEY = "cpjr-announce-dismissed";
  var ANNOUNCE_ID = "sounddrop-2026";
  var DELAY_MS = 3000;
  var SCROLL_PX = 120;
  var RESHOW_MS = 5 * 60 * 60 * 1000;
  var SOUND_COOLDOWN_MS = 10 * 60 * 60 * 1000;

  var announcement = {
    id: ANNOUNCE_ID,
    href: "https://iamchrispaezjr.github.io/SoundDrop/",
    eyebrow: "🚨 New Project!",
    title: "SoundDrop",
    description: "A clean soundboard for memes and iconic effects — try it out.",
    cta: "Open project →",
    image: "soundrop-screenshot.jpg",
    imageAlt: "SoundDrop project screenshot"
  };

  function defaultState() {
    return { id: announcement.id, dismissedAt: 0, soundAt: 0 };
  }

  function readState() {
    var state = defaultState();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.id === announcement.id) {
          state.dismissedAt = Number(parsed.dismissedAt) || 0;
          state.soundAt = Number(parsed.soundAt) || 0;
        }
      } else if (localStorage.getItem(LEGACY_KEY) === announcement.id) {
        state.dismissedAt = Date.now();
        writeState(state);
        localStorage.removeItem(LEGACY_KEY);
      }
    } catch (err) {}
    return state;
  }

  function writeState(state) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          id: announcement.id,
          dismissedAt: state.dismissedAt || 0,
          soundAt: state.soundAt || 0
        })
      );
    } catch (err) {}
  }

  function isHidden() {
    var state = readState();
    if (!state.dismissedAt) return false;
    return Date.now() - state.dismissedAt < RESHOW_MS;
  }

  function canPlaySound() {
    var state = readState();
    if (!state.soundAt) return true;
    return Date.now() - state.soundAt >= SOUND_COOLDOWN_MS;
  }

  function markDismissed() {
    var state = readState();
    state.dismissedAt = Date.now();
    writeState(state);
  }

  function markSoundPlayed() {
    var state = readState();
    state.soundAt = Date.now();
    writeState(state);
  }

  function assetBase() {
    var script = document.querySelector('script[src*="site-nav.js"]');
    var src = script && script.getAttribute("src");
    if (src) return src.replace(/site-nav\.js.*$/, "");
    return "";
  }

  if (isHidden()) return;

  var hasScrolled = window.scrollY > SCROLL_PX;
  var hasWaited = false;
  var shown = false;
  var toast = null;

  function playAnnounceSound() {
    if (!canPlaySound()) return;
    try {
      var audio = new Audio(assetBase() + "sounds/peter-griffin-laugh.mp3");
      audio.preload = "auto";
      var playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(function () {
            markSoundPlayed();
          })
          .catch(function () {});
      } else {
        markSoundPlayed();
      }
    } catch (err) {}
  }

  function showToast() {
    if (shown || !hasScrolled || !hasWaited || isHidden()) return;
    shown = true;
    if (!toast) toast = buildToast();
    document.body.appendChild(toast);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        toast.classList.add("is-visible");
        playAnnounceSound();
      });
    });
  }

  function hideToast() {
    if (!toast) return;
    markDismissed();
    toast.classList.remove("is-visible");
    window.setTimeout(function () {
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 480);
  }

  function buildToast() {
    var el = document.createElement("aside");
    el.className = "announce-toast";
    el.setAttribute("role", "complementary");
    el.setAttribute("aria-label", "Project announcement");

    var close = document.createElement("button");
    close.type = "button";
    close.className = "announce-toast-close";
    close.setAttribute("aria-label", "Dismiss announcement");
    close.innerHTML = "&times;";
    close.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      hideToast();
    });

    var link = document.createElement("a");
    link.className = "announce-toast-link";
    link.href = announcement.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    var media = document.createElement("div");
    media.className = "announce-toast-media";
    var img = document.createElement("img");
    img.src = assetBase() + announcement.image;
    img.alt = announcement.imageAlt;
    img.width = 184;
    img.height = 184;
    img.loading = "lazy";
    img.decoding = "async";
    media.appendChild(img);

    var copy = document.createElement("div");
    copy.className = "announce-toast-copy";

    var eyebrow = document.createElement("p");
    eyebrow.className = "announce-toast-eyebrow";
    eyebrow.textContent = announcement.eyebrow;

    var title = document.createElement("p");
    title.className = "announce-toast-title";
    title.textContent = announcement.title;

    var desc = document.createElement("p");
    desc.className = "announce-toast-desc";
    desc.textContent = announcement.description;

    var cta = document.createElement("p");
    cta.className = "announce-toast-cta";
    cta.textContent = announcement.cta;

    copy.appendChild(eyebrow);
    copy.appendChild(title);
    copy.appendChild(desc);
    copy.appendChild(cta);

    link.appendChild(media);
    link.appendChild(copy);
    var rays = document.createElement("div");
    rays.className = "announce-toast-rays";
    rays.setAttribute("aria-hidden", "true");

    var flash = document.createElement("div");
    flash.className = "announce-toast-flash";
    flash.setAttribute("aria-hidden", "true");

    el.appendChild(rays);
    el.appendChild(close);
    el.appendChild(link);
    el.appendChild(flash);
    return el;
  }

  function onScroll() {
    if (window.scrollY > SCROLL_PX) {
      hasScrolled = true;
      showToast();
      window.removeEventListener("scroll", onScroll);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  window.setTimeout(function () {
    hasWaited = true;
    showToast();
  }, DELAY_MS);
})();
