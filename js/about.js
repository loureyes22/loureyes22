
/* ==========================================================
   LOU REYES — ABOUT PAGE
========================================================== */

"use strict";

const $ = id => document.getElementById(id);


/* ==========================================================
   01. THEME
========================================================== */

function initializeTheme() {

  const light = $("lightTheme");
  const dark = $("darkTheme");
  const themeColor = $("themeColor");

  function applyTheme(theme) {

    const next = theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme = next;

    localStorage.setItem("lou-reyes-theme", next);

    light.classList.toggle("active", next === "light");
    dark.classList.toggle("active", next === "dark");

    themeColor.content =
      next === "light" ? "#e9e7e1" : "#111111";

  }

  light.addEventListener("click", () => applyTheme("light"));
  dark.addEventListener("click", () => applyTheme("dark"));

  applyTheme(document.documentElement.dataset.theme);

}


/* ==========================================================
   02. FULLSCREEN NAVIGATION
========================================================== */

function initializeMenu() {

  const button = $("menuButton");
  const menu = $("menuScreen");

  function setMenu(open) {

    menu.classList.toggle("open", open);
    button.classList.toggle("active", open);

    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );

    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;

    document.body.classList.toggle("menu-open", open);

  }

  button.addEventListener("click", () => {
    setMenu(!menu.classList.contains("open"));
  });

  document.addEventListener("keydown", event => {

    if (
      event.key === "Escape" &&
      menu.classList.contains("open")
    ) {
      setMenu(false);
      button.focus();
    }

  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

}


/* ==========================================================
   03. INITIALIZATION
========================================================== */

function initializeAboutPage() {

  initializeTheme();
  initializeMenu();

}

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeAboutPage
  );

} else {

  initializeAboutPage();

}
