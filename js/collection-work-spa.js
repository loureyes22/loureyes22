
"use strict";

/* ==========================================================
   LOU REYES — PERSISTENT COLLECTION / WORK NAVIGATION

   Collection remains loaded.
   Work is loaded only when a project is opened.
========================================================== */

(() => {

  const grid = document.getElementById("collectionGrid");

  if (!grid) return;

  const DURATION = 650;
  const ARRIVAL_DURATION = 350;
  const EASE = "cubic-bezier(.65, 0, .25, 1)";

  const reducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let active = null;
  let busy = false;

  const collectionTitle = document.title;
  const collectionURL = location.href;

  /* ========================================================
     01. HELPERS
  ======================================================== */

  function getProjectId(url) {
    return new URL(url, location.href)
      .searchParams.get("project");
  }

  function findCard(id) {
    return [...grid.querySelectorAll(".collection-item")]
      .find(card => getProjectId(card.href) === id);
  }

  function getRect(element) {
    const rect = element.getBoundingClientRect();

    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };
  }

  function viewport() {
    return {
      left: 0,
      top: 0,
      width: innerWidth,
      height: innerHeight
    };
  }

  function rectangleStyle(rect) {
    return {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    };
  }

  function makeImage(src, position) {
    const image = document.createElement("img");

    image.className = "spa-transition-image";
    image.src = src;
    image.alt = "";
    image.draggable = false;

    Object.assign(
      image.style,
      rectangleStyle(position)
    );

    document.body.append(image);

    return image;
  }

  function makeCover() {
    const cover = document.createElement("div");

    cover.className = "spa-transition-cover";

    document.body.append(cover);

    return cover;
  }

  async function animateRect(image, from, to, duration) {
    Object.assign(
      image.style,
      rectangleStyle(from)
    );

    if (reducedMotion.matches) {
      Object.assign(
        image.style,
        rectangleStyle(to)
      );
      return;
    }

    const animation = image.animate(
      [
        rectangleStyle(from),
        rectangleStyle(to)
      ],
      {
        duration,
        easing: EASE,
        fill: "forwards"
      }
    );

    try {
      await animation.finished;
    } finally {
      Object.assign(
        image.style,
        rectangleStyle(to)
      );

      animation.cancel();
    }
  }

  async function animateCover(cover, from, to, duration) {
    if (reducedMotion.matches) {
      cover.style.opacity = String(to);
      return;
    }

    const animation = cover.animate(
      [
        { opacity: from },
        { opacity: to }
      ],
      {
        duration,
        easing: EASE,
        fill: "forwards"
      }
    );

    try {
      await animation.finished;
    } finally {
      cover.style.opacity = String(to);
      animation.cancel();
    }
  }

  function nextFrame() {
    return new Promise(resolve =>
      requestAnimationFrame(resolve)
    );
  }

  /* ========================================================
     02. LOAD EXISTING WORK PAGE
  ======================================================== */

  function loadWork(url) {
    return new Promise((resolve, reject) => {

      const frame = document.createElement("iframe");

      frame.className = "spa-work-frame";
      frame.title = "Project presentation";

      active.frame = frame;

      const timeout = setTimeout(() => {
        reject(new Error("Work page load timed out"));
      }, 15000);

      frame.addEventListener("load", () => {
        clearTimeout(timeout);
        resolve(frame);
      }, { once: true });

      frame.addEventListener("error", () => {
        clearTimeout(timeout);
        reject(new Error("Work page failed to load"));
      }, { once: true });

      document.body.append(frame);

      const destination = new URL(url, collectionURL);

      destination.searchParams.set("embedded", "1");

      frame.src = destination.href;
    });
  }

  async function waitForWork(frame) {
    const doc = frame.contentDocument;

    if (!doc) {
      throw new Error(
        "Work page must be on the same origin"
      );
    }

    const start = performance.now();

    while (!doc.documentElement.classList.contains("work-ready")) {
      if (performance.now() - start > 12000) {
        throw new Error("Work page did not become ready");
      }

      await nextFrame();
    }

    const hero = doc.querySelector(".work-hero");

    const heroImage = doc.getElementById(
      "workHeroImage"
    );

    if (!hero || !heroImage) {
      throw new Error("Work hero not found");
    }

    return { doc, hero, heroImage };
  }

  /* ========================================================
     03. PROJECT NAVIGATION INSIDE THE FRAME
  ======================================================== */

  function installWorkNavigation(frame) {
    const doc = frame.contentDocument;

    if (!doc) return;

    doc.addEventListener("click", event => {

      const link = event.target.closest("a[href]");

      if (!link) return;

      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (link.id === "workBack") {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (!busy && active) {
          history.back();
        }

        return;
      }

      // Keep navigation to other pages in the main tab.
      // The persistent experience currently covers
      // Collection <-> the selected Work project.
      if (
        link.target !== "_blank" &&
        link.origin === location.origin
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();

        window.location.assign(link.href);
      }

    }, true);
  }

  /* ========================================================
     04. OPEN WORK
  ======================================================== */

  
  async function openWork(
    link,
    addHistory = true,
    featuredEntry = false
  ) {

    if (busy || active) return;

    const source = link.querySelector(
      ".collection-item-image img"
    );

    if (!source) {
      location.assign(link.href);
      return;
    }

    busy = true;

    const projectId = getProjectId(link.href);
    const startRect = getRect(source);
    const sourceURL = source.currentSrc || source.src;

    active = {
      projectId,
      link,
      source,
      frame: null,
      image: makeImage(sourceURL, startRect),
      cover: makeCover(),
      heroImage: null,
      heroContent: null
    };

    const state = active;

    document.body.classList.add("spa-work-active");

    source.classList.add("spa-source-hidden");

    try {

      // Start loading Work immediately, while
      // the cover expansion is happening.
      const workPromise = loadWork(link.href);

      // Keep Collection exactly where it is.
      // Expand the same temporary image to fullscreen.

      
    await Promise.all([

      animateRect(
        state.image,
        startRect,
        viewport(),
        featuredEntry ? 100 : DURATION
      ),

      animateCover(
        state.cover,
        0,
        1,
        featuredEntry ? 100 : DURATION
      )

    ]);


      // Load Work only AFTER expansion.
      // The cover remains visible during loading.

      const frame = await workPromise;

      const { doc, hero, heroImage } =
        await waitForWork(frame);

      state.heroImage = heroImage;
      state.heroContent = doc.querySelector(
        ".work-hero-content"
      );

      heroImage.style.visibility = "hidden";

      if (state.heroContent) {
        state.heroContent.style.opacity = "0";
      }

      installWorkNavigation(frame);

      frame.classList.add("is-visible");

      await nextFrame();

      // Settle cover into the Work hero.
      // No document navigation occurs.

      
    await Promise.all([

      animateRect(
        state.image,
        viewport(),
        getRect(hero),
        featuredEntry ? 60 : ARRIVAL_DURATION
      ),

      animateCover(
        state.cover,
        1,
        0,
        featuredEntry ? 60 : ARRIVAL_DURATION
      )

    ]);


      heroImage.style.visibility = "";

      if (state.heroContent) {
        state.heroContent.style.opacity = "";
      }

      state.image.remove();
      state.image = null;

      state.cover.remove();
      state.cover = null;

      if (addHistory) {
        history.pushState(
          { portfolioProject: projectId },
          "",
          link.href
        );
      }

      document.title = doc.title;

    } catch (error) {
      console.error("Persistent Work navigation:", error);

      dispose();

      // A normal Work URL remains the fallback.
      if (location.pathname.endsWith("/work.html")) {
        location.reload();
      } else {
        location.assign(link.href);
      }

      return;

    } finally {
      busy = false;
    }
  }

  /* ========================================================
     05. BACK TO COLLECTION
  ======================================================== */

  async function closeWork() {
    if (busy || !active) return;

    busy = true;

    const state = active;
    const frame = state.frame;

    try {
      const doc = frame?.contentDocument;

      const hero = doc?.querySelector(".work-hero");
      const heroImage = doc?.getElementById(
        "workHeroImage"
      );

      if (!hero || !heroImage) {
        throw new Error("Work hero unavailable");
      }

      const startRect = getRect(hero);

      const image = makeImage(
        heroImage.currentSrc || heroImage.src,
        startRect
      );

      const cover = makeCover();

      state.image = image;
      state.cover = cover;

      heroImage.style.visibility = "hidden";

      // Expand the Work cover to fullscreen.

      await Promise.all([
        animateRect(
          image,
          startRect,
          viewport(),
          ARRIVAL_DURATION
        ),

        animateCover(
          cover,
          0,
          1,
          ARRIVAL_DURATION
        )
      ]);

      // Collection already exists underneath.
      // No reload, no snapshot, no waiting for cards.

      frame.classList.remove("is-visible");

      await nextFrame();

      // Shrink back to the original thumbnail.

      await Promise.all([
        animateRect(
          image,
          viewport(),
          getRect(state.source),
          DURATION
        ),

        animateCover(
          cover,
          1,
          0,
          DURATION
        )
      ]);

    } catch (error) {
      console.error("Return to Collection:", error);

    } finally {
      dispose();
    }
  }

  /* ========================================================
     06. CLEANUP
  ======================================================== */

  function dispose() {
    if (!active) return;

    active.image?.getAnimations().forEach(
      animation => animation.cancel()
    );

    active.cover?.getAnimations().forEach(
      animation => animation.cancel()
    );

    active.image?.remove();
    active.cover?.remove();

    active.frame?.remove();

    active.source?.classList.remove(
      "spa-source-hidden"
    );

    document.body.classList.remove(
      "spa-work-active"
    );

    document.title = collectionTitle;

    active = null;
    busy = false;
  }

  
  /* ========================================================
    FEATURED WORK ENTRY
    Used by the homepage's persistent navigation.
  ======================================================== */

  window.portfolioOpenFeaturedProject = async function(projectId) {

    if (busy || active) return null;

    const card = findCard(projectId);

    if (!card) {
      throw new Error(
        `Featured project not found in Collection: ${projectId}`
      );
    }

    // Make the destination card visible BEFORE Work opens.
    // This is the position retained when returning from Work.

    card.scrollIntoView({
      behavior: "instant",
      block: "center",
      inline: "nearest"
    });

    await nextFrame();
    await nextFrame();

    // Run the existing, proven persistent Work controller.
    // Keep its usual history handling.

    await openWork(card, true, true);

    return active?.frame || null;

  };


  /* ========================================================
     07. COLLECTION CLICKS
  ======================================================== */

  grid.addEventListener("click", event => {

    const link = event.target.closest(
      ".collection-item"
    );

    if (!link) return;

    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (busy || active) return;

    openWork(link);

  });

  /* ========================================================
     08. BROWSER HISTORY
  ======================================================== */

  window.addEventListener("popstate", () => {

    const path = location.pathname;

    if (active && path.endsWith("/collection.html")) {
      closeWork();
      return;
    }

    if (!active && path.endsWith("/work.html")) {
      const id = getProjectId(location.href);

      const card = findCard(id);

      if (card) {
        openWork(card, false);
      } else {
        location.reload();
      }
    }

  });

})();
