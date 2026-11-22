
"use strict";

/* ==========================================================
   LOU REYES — PERSISTENT HOMEPAGE / FEATURED WORK

   DIRECT HOMEPAGE -> WORK CONNECTION

   - Homepage remains loaded.
   - Work is prepared directly in one iframe.
   - No intermediate Archive or Collection loading.
   - Original animation timing is preserved.
   - Featured artwork remains full quality.
========================================================== */

(() => {

  const gallery = document.getElementById("galleryTrack");

  if (!gallery) return;

  const DURATION = 650;
  const ARRIVAL_DURATION = 350;

  const EASE = "cubic-bezier(.65, 0, .25, 1)";

  const reducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let prepared = null;
  let journey = null;
  let busy = false;

  
  
  /* ========================================================
     01. GEOMETRY HELPERS
  ======================================================== */

  function rect(element) {

    const r = element.getBoundingClientRect();

    return {
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height
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

  function geometry(r) {

    return {
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`
    };

  }

  function nextFrame() {

    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });

  }


  /* ========================================================
     02. TRANSITION ELEMENTS
  ======================================================== */

  function createImage(src, position) {

    const image = document.createElement("img");

    image.className = "home-journey-image";
    image.src = src;
    image.alt = "";
    image.draggable = false;

    Object.assign(
      image.style,
      geometry(position)
    );

    document.body.append(image);

    return image;

  }

  function createCover() {

    const cover = document.createElement("div");

    cover.className = "home-journey-cover";

    document.body.append(cover);

    return cover;

  }


  /* ========================================================
     03. ANIMATION HELPERS
  ======================================================== */

  async function animateRect(image, from, to, duration) {

    Object.assign(image.style, geometry(from));

    if (reducedMotion.matches) {

      Object.assign(image.style, geometry(to));
      return;

    }

    const animation = image.animate(
      [geometry(from), geometry(to)],
      {
        duration,
        easing: EASE,
        fill: "forwards"
      }
    );

    try {

      await animation.finished;

    } finally {

      Object.assign(image.style, geometry(to));
      animation.cancel();

    }

  }

  async function animateOpacity(
    element,
    from,
    to,
    duration
  ) {

    if (reducedMotion.matches) {

      element.style.opacity = String(to);
      return;

    }

    const animation = element.animate(
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

      element.style.opacity = String(to);
      animation.cancel();

    }

  }


  /* ========================================================
     04. WAIT FOR WORK TO BE READY
  ======================================================== */

  async function waitForWork(frame) {

    const doc = frame.contentDocument;

    if (!doc) {
      throw new Error(
        "Work page must use the same origin"
      );
    }

    const start = performance.now();

    while (
      !doc.documentElement.classList.contains("work-ready")
    ) {

      if (!frame.isConnected) {
        throw new Error("Work preparation was cancelled");
      }

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
      throw new Error("Work hero unavailable");
    }

    if (!heroImage.naturalWidth) {
      throw new Error("Work hero image unavailable");
    }

    return {
      frame,
      doc,
      hero,
      heroImage
    };

  }


  /* ========================================================
     05. PREPARE DIRECT WORK DESTINATION
  ======================================================== */

 
  function createPreparation(project) {

    const frame = document.createElement("iframe");

    frame.className = "home-journey-frame";
    frame.title = `${project.title || "Project"} presentation`;

    const destination = new URL(
      "work.html",
      location.href
    );

    destination.searchParams.set("project", project.id);
    destination.searchParams.set("embedded", "1");

    const entry = {
      projectId: project.id,
      frame,
      stale: false,
      promise: null,
      error: null
    };

    // Start the actual Work page immediately.

    document.body.append(frame);
    frame.src = destination.href;

    // Wait for the specific Work hero, not the entire
    // page's load event or all presentation images.

    entry.promise = (async () => {

      const started = performance.now();

      while (true) {

        if (entry.stale || !frame.isConnected) {
          throw new Error("Work preparation cancelled");
        }

        if (performance.now() - started > 15000) {
          throw new Error("Work hero readiness timed out");
        }

        const doc = frame.contentDocument;

        // Ignore the iframe's initial about:blank page.

        if (doc && doc.URL !== "about:blank") {

          const currentURL = new URL(doc.URL);

          const correctProject =
            currentURL.pathname.endsWith("/work.html") &&
            currentURL.searchParams.get("project") === project.id;

          if (
            correctProject &&
            doc.documentElement?.classList.contains("work-ready")
          ) {

            const hero = doc.querySelector(".work-hero");

            const heroImage = doc.getElementById(
              "workHeroImage"
            );

            if (
              hero &&
              heroImage &&
              heroImage.complete &&
              heroImage.naturalWidth > 0
            ) {

              console.log(
                `[FEATURED] ${project.id} hero ready in ` +
                `${Math.round(performance.now() - started)}ms`
              );

              return {
                frame,
                doc,
                hero,
                heroImage
              };

            }

          }

        }

        await nextFrame();

      }

    })().catch(error => {

      entry.error = error;

      if (!entry.stale) {
        console.warn(
          `Featured Work preparation: ${project.id}`,
          error
        );
      }

      if (!journey || journey.entry !== entry) {
        frame.remove();
      }

      if (prepared === entry) {
        prepared = null;
      }

      return null;

    });

    return entry;

  }



  /* ========================================================
     06. PREPARE SELECTED FEATURED PROJECT
  ======================================================== */

  function prepareFeatured(project) {

    if (
      busy ||
      journey ||
      !project?.id
    ) {
      return null;
    }

    if (
      prepared?.projectId === project.id &&
      !prepared.stale &&
      prepared.frame.isConnected
    ) {
      return prepared;
    }

    // Cancel the previous destination if the
    // visitor selected a different project.

    if (prepared) {

      prepared.stale = true;
      prepared.frame.remove();

    }

    prepared = createPreparation(project);

    return prepared;

  }


  /* ========================================================
     07. FEATURED PROJECT LOOKUP
  ======================================================== */

  function getFeaturedProjectForCard(card) {

    const projects =
      typeof PROJECTS !== "undefined"
        ? PROJECTS
        : window.PROJECTS;

    if (!Array.isArray(projects)) return null;

    const cards = [
      ...gallery.querySelectorAll(".gallery-card")
    ];

    const index = cards.indexOf(card);

    if (index < 0) return null;

    const featured = projects.filter(
      project => project.featured
    );

    return featured[index] || null;

  }

  function prepareFromCard(card) {

    // TEMPORARY DIAGNOSTIC:
    // Disable automatic Work iframe preparation.
    // Clicking a project will still load Work normally.

    return;

  }


  /* ========================================================
     08. CLEANUP
  ======================================================== */

  
  function cleanupJourney() {

    if (!journey) return;

    const state = journey;

    // Cancel unfinished transition animations.

    state.image?.getAnimations().forEach(
      animation => animation.cancel()
    );


    state.cover?.getAnimations().forEach(
      animation => animation.cancel()
    );

    // Remove temporary transition elements.

    state.image?.remove();
    state.cover?.remove();

    // Release the selected Work destination.

    state.entry?.frame.remove();

    if (prepared === state.entry) {
      prepared = null;
    }

    // Restore homepage scrolling.

    document.body.classList.remove(
      "home-journey-active"
    );

    journey = null;
    busy = false;

  }



  /* ========================================================
     09. WORK NAVIGATION HANDOFF
  ======================================================== */

  function connectWorkNavigation(frame) {

    const doc = frame.contentDocument;

    if (!doc) return;

    doc.addEventListener("click", event => {

      const link = event.target.closest("a[href]");

      if (!link || event.defaultPrevented) return;

      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      const url = new URL(link.href, location.href);

      if (url.origin !== location.origin) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const isHome =
        url.pathname.endsWith("/index.html") ||
        url.pathname === "/";

      if (isHome) {

        returnHome();
        return;

      }

      // Back to Collection uses Work's existing
      // category-specific destination URL.

      window.location.assign(url.href);

    }, true);

  }


  /* ========================================================
     10. HOMEPAGE -> WORK
  ======================================================== */

  async function openFeatured(project, card) {

    if (busy || journey || !project?.id) return;

    const source = card.querySelector(
      ".gallery-image img"
    );

    if (!source) return;

    const start = rect(source);

    const sourceURL = source.currentSrc || source.src;

    // Reuse the matching Work destination if ready.
    // Otherwise begin loading Work immediately.

    let entry =
      prepared?.projectId === project.id &&
      !prepared.stale &&
      prepared.frame.isConnected
        ? prepared
        : prepareFeatured(project);

    if (!entry) return;

    busy = true;

    
    
    
    journey = {
      projectId: project.id,
      entry,
      source,
      image: createImage(sourceURL, start),
      cover: createCover()
    };




    const state = journey;

    document.body.classList.add(
      "home-journey-active"
    );

    try {

     
      
      // Expand the homepage artwork.
      // Work loads independently at the same time.

      await Promise.all([

        animateRect(
          state.image,
          start,
          viewport(),
          DURATION
        ),

        animateOpacity(
          state.cover,
          0,
          1,
          DURATION
        )

      ]);



      // Work may already be prepared.
      // No Archive or Collection loading occurs.

      let destination = await entry.promise;

      // Recover once if an earlier preparation failed.
      // Keep the fullscreen artwork visible.

      if (!destination) {

        entry.stale = true;
        entry.frame.remove();

        entry = createPreparation(project);
        state.entry = entry;

        prepared = entry;

        destination = await entry.promise;

      }

      if (!destination) {

        console.error(
          `[FEATURED] Destination failed: ${project.id}`,
          {
            reason: entry.error?.message || "Unknown error",
            projectId: project.id,
            iframeConnected: entry.frame.isConnected,
            iframeURL: entry.frame.getAttribute("src")
          }
        );

        throw entry.error || new Error(
          "Featured Work destination unavailable"
        );

      }

      
      const {
        frame,
        hero,
        heroImage,
        doc
      } = destination;


      


      /* ========================================================
        CONTINUE EXISTING WORK ARRIVAL
      ======================================================== */

      const heroContent = doc.querySelector(
        ".work-hero-content"
      );

      heroImage.style.visibility = "hidden";

      if (heroContent) {
        heroContent.style.opacity = "0";
      }

      connectWorkNavigation(frame);

      // Reveal Work underneath the fullscreen image.

      frame.classList.add("is-visible");

      await nextFrame();

      // The Work iframe fills the homepage viewport,
      // so its hero uses the same viewport coordinates.

      const target = rect(hero);

      await Promise.all([

        animateRect(
          state.image,
          viewport(),
          target,
          ARRIVAL_DURATION
        ),

        animateOpacity(
          state.cover,
          1,
          0,
          ARRIVAL_DURATION
        )

      ]);

      heroImage.style.visibility = "";

      if (heroContent) {
        heroContent.style.opacity = "";
      }

      state.image.remove();
      state.image = null;

      state.cover.remove();
      state.cover = null;

      // Homepage remains loaded beneath Work.

    } catch (error) {

      console.error(
        "Homepage Featured Work navigation:",
        error
      );

      cleanupJourney();

      location.assign(
        `work.html?project=${encodeURIComponent(project.id)}`
      );

      return;

    } finally {

      busy = false;

    }

  }


  /* ========================================================
     11. RETURN TO HOMEPAGE
  ======================================================== */

  async function returnHome() {

    if (busy || !journey) return;

    busy = true;

    const frame = journey.entry.frame;

    try {

      if (frame.isConnected) {

        await animateOpacity(
          frame,
          1,
          0,
          ARRIVAL_DURATION
        );

      }

    } catch (error) {

      console.warn(
        "Homepage return transition:",
        error
      );

    } finally {

      cleanupJourney();

    }

  }

  /* ========================================================
    FEATURED WORK — RETURN TO HOMEPAGE
  ======================================================== */

  window.addEventListener(
    "lou:featured-work-home",
    () => {
      returnHome();
    }
  );

  /* ========================================================
     12. PREPARE ON HOVER / FOCUS
  ======================================================== */

  gallery.addEventListener("pointerover", event => {

    const card = event.target.closest(".gallery-card");

    if (!card) return;

    prepareFromCard(card);

  });

  gallery.addEventListener("focusin", event => {

    const card = event.target.closest(".gallery-card");

    if (!card) return;

    prepareFromCard(card);

  });


  
  /* ========================================================
    13. PREPARE ON CAROUSEL SELECTION
  ======================================================== */

  gallery.addEventListener(
    "featured-card-selected",
    event => {

      const card = event.detail?.card;

      if (card) {
        prepareFromCard(card);
      }

    }
  );



  /* ========================================================
     14. PREPARE WHEN FEATURED WORK APPEARS
  ======================================================== */

  const featuredArea = document.getElementById(
    "featured"
  );

  if (featuredArea) {

    const observer = new IntersectionObserver(
      entries => {

        if (!entries.some(entry => entry.isIntersecting)) {
          return;
        }

        const card =
          gallery.querySelector(".gallery-card.selected") ||
          gallery.querySelector(".gallery-card");

        if (card) {
          prepareFromCard(card);
        }

        observer.disconnect();

      },
      { threshold: 0.1 }
    );

    observer.observe(featuredArea);

  }

  
  
  /* ========================================================
    RESTORE HOMEPAGE AFTER BROWSER NAVIGATION
  ======================================================== */

  window.addEventListener("pageshow", event => {

    if (!event.persisted) return;

    if (journey) {
      cleanupJourney();
    }

    document.body.classList.remove(
      "home-journey-active"
    );

    window.dispatchEvent(new Event("scroll"));

  });



  /* ========================================================
     15. PUBLIC ENTRY POINT
  ======================================================== */

  window.openFeaturedProject = function(project, card) {

    openFeatured(project, card);

  };

})();
