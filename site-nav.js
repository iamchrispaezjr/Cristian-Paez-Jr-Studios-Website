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
