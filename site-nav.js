/* Shared hamburger menu behavior (all pages) */
(function () {
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mobileNav");
  var backdrop = document.getElementById("navBackdrop");
  if (!toggle || !nav || !backdrop) return;

  var year = document.getElementById("year");
  var dropdowns = [
    {
      toggle: document.getElementById("productionDropdownToggle"),
      menu: document.getElementById("productionSubmenu"),
      showLabel: "Show In Production links",
      hideLabel: "Hide In Production links"
    },
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

/* Footer light 8am–5pm America/New_York; night 5pm–8am */
(function () {
  var TZ = "America/New_York";
  var timer = 0;

  function getNyHourMinute(date) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23"
    }).formatToParts(date);

    var hour = 0;
    var minute = 0;
    parts.forEach(function (part) {
      if (part.type === "hour") hour = parseInt(part.value, 10);
      if (part.type === "minute") minute = parseInt(part.value, 10);
    });
    if (hour === 24) hour = 0;
    return { hour: hour, minute: minute };
  }

  function isFooterDayMode(date) {
    var hm = getNyHourMinute(date || new Date());
    return hm.hour >= 8 && hm.hour < 17;
  }

  function msUntilNextFooterSwitch(date) {
    var now = date || new Date();
    var hm = getNyHourMinute(now);
    var minutesNow = hm.hour * 60 + hm.minute;
    var targetMinutes = isFooterDayMode(now) ? 17 * 60 : 8 * 60;
    var deltaMinutes = targetMinutes - minutesNow;
    if (deltaMinutes <= 0) deltaMinutes += 24 * 60;
    return deltaMinutes * 60 * 1000;
  }

  function applyFooterTheme() {
    var night = !isFooterDayMode(new Date());
    document.querySelectorAll(".site-footer").forEach(function (footer) {
      footer.classList.toggle("footer-night", night);
      footer.setAttribute("data-footer-theme", night ? "night" : "day");
    });
  }

  function scheduleNextSwitch() {
    if (timer) window.clearTimeout(timer);
    var wait = Math.min(msUntilNextFooterSwitch(new Date()), 6 * 60 * 60 * 1000);
    timer = window.setTimeout(function () {
      applyFooterTheme();
      scheduleNextSwitch();
    }, wait + 250);
  }

  applyFooterTheme();
  scheduleNextSwitch();
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      applyFooterTheme();
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
  var MEMBERS_HREF = "https://www.google.com";
  var MEMBERS_LABEL = "Members";
  var THRESHOLD = 72;
  var showingMembers = null;

  function setMembersMode(on) {
    if (showingMembers === on) return;
    showingMembers = on;
    if (on) {
      btn.href = MEMBERS_HREF;
      btn.textContent = MEMBERS_LABEL;
      btn.setAttribute("aria-label", "Members");
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

/* Night moon: once per night shift, swims through footer when it comes into view */
(function () {
  var TZ = "America/New_York";
  var STORAGE_KEY = "cpjr-moon-night";
  var playedThisVisit = false;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function getNyParts(date) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      hourCycle: "h23"
    }).formatToParts(date || new Date());

    var out = { year: 0, month: 0, day: 0, hour: 0 };
    parts.forEach(function (part) {
      if (part.type === "year") out.year = parseInt(part.value, 10);
      if (part.type === "month") out.month = parseInt(part.value, 10);
      if (part.type === "day") out.day = parseInt(part.value, 10);
      if (part.type === "hour") out.hour = parseInt(part.value, 10);
    });
    if (out.hour === 24) out.hour = 0;
    return out;
  }

  function isNightTime(date) {
    var hour = getNyParts(date).hour;
    return hour >= 17 || hour < 8;
  }

  function getNightShiftKey(date) {
    var p = getNyParts(date || new Date());
    if (!(p.hour >= 17 || p.hour < 8)) return null;

    if (p.hour < 8) {
      var prev = new Date(Date.UTC(p.year, p.month - 1, p.day, 12, 0, 0));
      prev.setUTCDate(prev.getUTCDate() - 1);
      return (
        prev.getUTCFullYear() +
        "-" +
        pad(prev.getUTCMonth() + 1) +
        "-" +
        pad(prev.getUTCDate())
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
