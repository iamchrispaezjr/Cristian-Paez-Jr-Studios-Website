/* Shared hamburger menu behavior (all pages) */
(function () {
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mobileNav");
  var backdrop = document.getElementById("navBackdrop");
  if (!toggle || !nav || !backdrop) return;

  var year = document.getElementById("year");
  var dropdowns = [
    {
      toggle: document.getElementById("homeDropdownToggle"),
      menu: document.getElementById("homeSubmenu"),
      showLabel: "Show more Home links",
      hideLabel: "Hide more Home links"
    },
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
