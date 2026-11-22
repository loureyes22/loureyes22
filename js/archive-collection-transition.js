
"use strict";

/* ==========================================================
   LOU REYES — PERSISTENT ARCHIVE / COLLECTION

   Archive remains loaded at all times.

   Archive -> Collection:
   Card expands to fullscreen.
   Collection loads in a persistent iframe.
   Artwork settles into the Collection hero.

   Collection -> Archive:
   Hero expands to fullscreen.
   Existing Archive is revealed underneath.
   Artwork fades into the active background.

   Collection -> Work remains managed by its
   existing, separate SPA controller.
========================================================== */

(() => {

  const archive = document.getElementById(
    "archiveShowcase"
  );

  const grid = document.getElementById(
    "archiveGrid"
  );

  if (!archive || !grid) return;

  const DURATION = 650;
  const ARRIVAL_DURATION = 350;

  const EASE = "cubic-bezier(.65, 0, .25, 1)";

  const reducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const archiveURL = location.href;
  const archiveTitle = document.title;

  let active = null;
  let busy = false;


  /* ========================================================
     01. HELPERS
  ======================================================== */

  function getCategoryId(url) {
    return new URL(url, archiveURL)
      .searchParams.get("category");
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

  function nextFrame() {

    return new Promise(resolve =>
      requestAnimationFrame(resolve)
    );

  }

  function makeImage(src, position) {

    const image = document.createElement("img");

    image.className = "archive-collection-image";

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

    cover.className = "archive-collection-cover";

    document.body.append(cover);

    return cover;

  }


  /* ========================================================
     02. IMAGE ANIMATION
  ======================================================== */

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


  /* ========================================================
     03. COVER ANIMATION
  ======================================================== */

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


  /* ========================================================
     04. IMAGE FADE
  ======================================================== */

  async function fadeImage(image, from, to, duration) {

    if (reducedMotion.matches) {
      image.style.opacity = String(to);
      return;
    }

    const animation = image.animate(
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

      image.style.opacity = String(to);

      animation.cancel();

    }

  }


  /* ========================================================
     05. LOAD COLLECTION WITHOUT LEAVING ARCHIVE
  ======================================================== */

  function loadCollection(url, state) {

    return new Promise((resolve, reject) => {

      const frame = document.createElement("iframe");

      frame.className = "archive-collection-frame";
      frame.title = "Portfolio collection";

      state.frame = frame;

      const timeout = setTimeout(() => {

        reject(
          new Error("Collection page load timed out")
        );

      }, 15000);

      frame.addEventListener("load", () => {

        clearTimeout(timeout);

        resolve(frame);

      }, { once: true });

      frame.addEventListener("error", () => {

        clearTimeout(timeout);

        reject(
          new Error("Collection page failed to load")
        );

      }, { once: true });

      document.body.append(frame);

      frame.src = url;

    });

  }


  /* ========================================================
     06. WAIT FOR COLLECTION HERO
  ======================================================== */

  async function waitForCollection(frame) {

    const doc = frame.contentDocument;

    if (!doc) {

      throw new Error(
        "Collection must use the same origin as Archive"
      );

    }

    const start = performance.now();

    let hero = null;
    let heroImage = null;

    while (performance.now() - start < 12000) {

      hero =
        doc.querySelector(".collection-hero");

      heroImage =
        doc.getElementById("collectionHeroImage");

      if (hero && heroImage) {
        break;
      }

      await nextFrame();

    }

    if (!hero || !heroImage) {

      throw new Error(
        "Collection hero or hero image not found"
      );

    }

    if (doc.fonts && doc.fonts.ready) {
      await doc.fonts.ready;
    }

    if (heroImage.decode) {

      try {
        await heroImage.decode();
      } catch {
        // The image may already be painted.
      }

    }

    return {
      doc,
      hero,
      heroImage
    };

  }


  /* ========================================================
     07. KEEP COLLECTION NAVIGATION IN SYNC
  ======================================================== */

  function installCollectionNavigation(frame) {

    const doc = frame.contentDocument;

    if (!doc) return;

    doc.addEventListener("click", event => {

      const link = event.target.closest("a[href]");

      if (!link) return;

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (link.target === "_blank") return;

      const destination = new URL(
        link.href,
        archiveURL
      );

      const isArchive =
        destination.origin === location.origin &&
        destination.pathname.endsWith("/archive.html");

      if (!isArchive) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (!busy && active) {
        history.back();
      }

    }, true);

  }


  /* ========================================================
     08. OPEN COLLECTION
  ======================================================== */

  
  async function openCollection(
    link,
    addHistory = true,
    featuredEntry = false
  ) {


    if (busy || active) return;

    const source = link.querySelector(
      ".archive-card-image img"
    );

    if (!source) {

      location.assign(link.href);
      return;

    }

    busy = true;

    const categoryId = getCategoryId(link.href);

    const startRect = getRect(source);

    const sourceURL = source.currentSrc || source.src;

    active = {
      categoryId,
      link,
      source,
      frame: null,
      image: makeImage(sourceURL, startRect),
      cover: makeCover(),
      heroImage: null,
      heroContent: null
    };

    const state = active;

    document.body.classList.add(
      "archive-collection-active"
    );

    state.source.classList.add(
      "archive-collection-source-hidden"
    );

    try {

      // Start loading Collection while the
      // Archive card expands to fullscreen.

      const collectionPromise = loadCollection(
        link.href,
        state
      );

      
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


      // Keep the fullscreen cover visible until
      // the entire Collection hero is ready.

      const frame = await collectionPromise;

      const {
        doc,
        hero,
        heroImage
      } = await waitForCollection(frame);

      state.heroImage = heroImage;

      state.heroContent = doc.querySelector(
        ".collection-hero-content"
      );

      heroImage.style.visibility = "hidden";

      if (state.heroContent) {
        state.heroContent.style.opacity = "0";
      }

      installCollectionNavigation(frame);

      // Collection is now completely prepared
      // behind the moving fullscreen image.

      frame.classList.add("is-visible");

      await nextFrame();

      // Settle the fullscreen image into the hero
      // while the black cover fades away.

      
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
          {
            archiveCollection: categoryId
          },
          "",
          link.href
        );

      }

      document.title = doc.title;

    } catch (error) {

      console.error(
        "Persistent Archive navigation:",
        error
      );

      dispose();

      // A normal Collection URL remains available
      // if the persistent presentation cannot load.

      location.assign(link.href);
      return;

    } finally {

      busy = false;

    }

  }


  /* ========================================================
     09. BACK TO ARCHIVE

     IMPORTANT:
     Archive already exists behind the iframe.

     The image does not shrink into a card.
     It becomes the selected background.
  ======================================================== */

  async function closeCollection() {

    if (busy || !active) return;

    busy = true;

    const state = active;

    const frame = state.frame;

    try {

      const doc = frame?.contentDocument;

      const hero = doc?.querySelector(
        ".collection-hero"
      );

      const heroImage = doc?.getElementById(
        "collectionHeroImage"
      );

      if (!hero || !heroImage) {

        throw new Error(
          "Collection hero is unavailable"
        );

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

      // Expand the Collection hero to fullscreen.

      await Promise.all([

        animateRect(
          image,
          startRect,
          viewport(),
          DURATION
        ),

        animateCover(
          cover,
          0,
          1,
          DURATION
        )

      ]);

      // Prepare the existing Archive while covered.
      // No rebuild, document navigation, or font reload.

      if (
        typeof window.archiveTransitionSelect === "function"
      ) {

        window.archiveTransitionSelect(
          state.categoryId
        );

      }

      // Remove the visible Collection while its
      // fullscreen artwork remains on top.

      frame.classList.remove("is-visible");

      await nextFrame();
      await nextFrame();

      // The existing Archive is already underneath.
      // Let the fullscreen artwork dissolve into
      // its active category background.

      await Promise.all([

        fadeImage(
          image,
          1,
          0,
          ARRIVAL_DURATION
        ),

        animateCover(
          cover,
          1,
          0,
          ARRIVAL_DURATION
        )

      ]);

    } catch (error) {

      console.error(
        "Persistent return to Archive:",
        error
      );

    } finally {

      dispose();

      // Do not immediately reset the category.
      // Wait for deliberate pointer movement.

      window.archiveTransitionArmReset?.();

    }

  }


  /* ========================================================
     10. CLEANUP
  ======================================================== */

  function dispose() {

    if (!active) return;

    const state = active;

    state.image?.getAnimations().forEach(
      animation => animation.cancel()
    );

    state.cover?.getAnimations().forEach(
      animation => animation.cancel()
    );

    state.image?.remove();
    state.cover?.remove();

    state.heroImage?.style.removeProperty(
      "visibility"
    );

    if (state.heroContent) {
      state.heroContent.style.opacity = "";
    }

    state.frame?.remove();

    state.source?.classList.remove(
      "archive-collection-source-hidden"
    );

    document.body.classList.remove(
      "archive-collection-active"
    );

    document.title = archiveTitle;

    active = null;
    busy = false;

  }

  
  /* ========================================================
    FEATURED COLLECTION ENTRY
    Used by the homepage's persistent navigation.
  ======================================================== */

  window.portfolioOpenFeaturedCategory = async function(categoryId) {

    if (busy || active) return null;

    const card = [
      ...grid.querySelectorAll(".archive-card")
    ].find(item =>
      getCategoryId(item.href) === categoryId
    );

    if (!card) {
      throw new Error(
        `Featured category not found in Archive: ${categoryId}`
      );
    }

    // Use the same persistent transition.
    // Do not navigate to another document.

    await openCollection(card, true, true);

    return active?.frame || null;

  };



  /* ========================================================
     11. ARCHIVE CARD CLICKS
  ======================================================== */

  grid.addEventListener("click", event => {

    const link = event.target.closest(
      ".archive-card"
    );

    if (!link) return;

    if (
      event.defaultPrevented ||
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

    openCollection(link);

  });

  /* ========================================================
     12. BROWSER HISTORY
  ======================================================== */

  window.addEventListener("popstate", () => {

    const path = location.pathname;

    if (
      active &&
      path.endsWith("/archive.html")
    ) {

      closeCollection();
      return;

    }

    if (
      !active &&
      path.endsWith("/collection.html")
    ) {

      const categoryId = getCategoryId(
        location.href
      );

      const card = [
        ...grid.querySelectorAll(".archive-card")
      ].find(item =>
        getCategoryId(item.href) === categoryId
      );

      if (card) {

        openCollection(card, false);

      } else {

        location.reload();

      }

    }

  });

})();
