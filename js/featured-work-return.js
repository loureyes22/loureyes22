
"use strict";

/* ==========================================================
   LOU REYES — FEATURED WORK RETURN BRIDGE

   Homepage -> Work: existing controller, untouched.
   Work -> Collection: direct persistent return.

   The return bridge only activates for a Work iframe
   opened directly from the homepage.
========================================================== */

(() => {

  const DURATION = 650;
  const ARRIVAL_DURATION = 350;
  const EASE = "cubic-bezier(.65, 0, .25, 1)";

  const reducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const nextFrame = () =>
    new Promise(resolve => requestAnimationFrame(resolve));

  /* ========================================================
     01. WORK IFRAME — REQUEST RETURN
  ======================================================== */

  if (window.frameElement) {

    const frame = window.frameElement;

    if (!frame.classList.contains("home-journey-frame")) {
      return;
    }

    if (!window.parent.document.getElementById("galleryTrack")) {
      return;
    }

    const featuredBack = document.getElementById("workBack");

    if (featuredBack) {
      const label = featuredBack.querySelector("span:last-child");

      if (label) {
        label.textContent = "BACK TO FEATURED WORK";
      }
    }

    window.addEventListener("click", event => {

      const homeLink = event.target.closest(
        "a.archive-brand"
      );

      const backLink = event.target.closest(
        "#workBack"
      );

      const link = homeLink || backLink;

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
      event.stopImmediatePropagation();

      if (homeLink) {
        window.top.location.assign(homeLink.href);
        return;
      }

      

      window.parent.dispatchEvent(
        new CustomEvent("lou:featured-work-home")
      );

    }, true);

    return;

  }


  /* ========================================================
     02. HOMEPAGE RETURN CONTROLLER
  ======================================================== */

  if (!document.getElementById("galleryTrack")) {
    return;
  }

  let returning = false;
  let activeCollection = null;

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

  function styles(r) {

    return {
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`
    };

  }

  async function animate(element, from, to, duration) {

    if (reducedMotion) {

      Object.assign(element.style, to);
      return;

    }

    const animation = element.animate(
      [from, to],
      {
        duration,
        easing: EASE,
        fill: "forwards"
      }
    );

    try {
      await animation.finished;
    } finally {
      Object.assign(element.style, to);
      animation.cancel();
    }

  }


  /* ========================================================
     03. PREPARE COLLECTION AND SELECTED PROJECT
  ======================================================== */

  async function prepareCollection(url, projectId) {

    const frame = document.createElement("iframe");

    frame.className = "home-journey-frame";
    frame.title = "Portfolio collection";

    document.body.append(frame);

    frame.src = url;

    const started = performance.now();

    while (performance.now() - started < 15000) {

      if (!frame.isConnected) {
        throw new Error("Collection frame was removed");
      }

      const doc = frame.contentDocument;

      if (
        doc &&
        doc.URL !== "about:blank" &&
        doc.documentElement?.classList.contains(
          "collection-ready"
        )
      ) {

        const correctCategory = new URL(
          doc.URL
        ).pathname.endsWith("/collection.html");

        if (!correctCategory) {
          await nextFrame();
          continue;
        }

        const card = [
          ...doc.querySelectorAll(".collection-item")
        ].find(item => {

          return new URL(item.href)
            .searchParams.get("project") === projectId;

        });

        if (!card) {

          throw new Error(
            `Collection card not found: ${projectId}`
          );

        }

        // Skip the Collection hero and go directly
        // to the Works section and selected card.

        card.scrollIntoView({
          behavior: "instant",
          block: "center",
          inline: "nearest"
        });

        await nextFrame();
        await nextFrame();

        const image = card.querySelector(
          ".collection-item-image img"
        );

        if (!image) {
          throw new Error(
            "Collection card image unavailable"
          );
        }

        // The card may originally be lazy-loaded.
        // Request its original file before revealing.

        image.loading = "eager";

        try {
          await image.decode();
        } catch (error) {
          // A loaded image can still be displayed.
        }

        return { frame, doc, card, image };

      }

      await nextFrame();

    }

    frame.remove();

    throw new Error("Collection preparation timed out");

  }


  /* ========================================================
     04. WORK -> COLLECTION RETURN ANIMATION
  ======================================================== */

  async function returnToCollection(projectId, collectionURL) {

    if (returning || !projectId || !collectionURL) {
      return;
    }

    const workFrame = [
      ...document.querySelectorAll(
        ".home-journey-frame.is-visible"
      )
    ].find(frame => {

      return new URL(
        frame.src,
        location.href
      ).searchParams.get("project") === projectId;

    });

    if (!workFrame) {

      console.error(
        "[PORTFOLIO] Work frame unavailable for return:",
        projectId
      );

      window.location.assign(collectionURL);
      return;

    }

    const workDoc = workFrame.contentDocument;

    const hero = workDoc?.querySelector(".work-hero");

    const heroImage = workDoc?.getElementById(
      "workHeroImage"
    );

    
  if (!hero || !heroImage) {

    console.warn(
      "[PORTFOLIO] Work hero unavailable during return"
    );

    window.location.assign(collectionURL);
    return;

  }

  if (!heroImage.naturalWidth) {

    await Promise.race([
      heroImage.decode().catch(() => {}),
      new Promise(resolve => setTimeout(resolve, 1200))
    ]);

  }

  if (!heroImage.naturalWidth) {

    window.location.assign(collectionURL);
    return;

  }

  returning = true;


    const source = heroImage.currentSrc || heroImage.src;

    const start = rect(hero);
    const fullscreen = viewport();

    const image = document.createElement("img");

    image.className = "home-journey-image";
    image.src = source;
    image.alt = "";
    image.draggable = false;

    Object.assign(image.style, styles(start));

    const cover = document.createElement("div");

    cover.className = "home-journey-cover";

    document.body.append(cover, image);

    const collection = prepareCollection(
      collectionURL,
      projectId
    );

    try {

      heroImage.style.visibility = "hidden";

      // Work hero expands to fullscreen.
      // Collection prepares simultaneously.

      await Promise.all([

        animate(
          image,
          styles(start),
          styles(fullscreen),
          ARRIVAL_DURATION
        ),

        animate(
          cover,
          { opacity: "0" },
          { opacity: "1" },
          ARRIVAL_DURATION
        )

      ]);

      const destination = await collection;

      // The destination is already positioned
      // at the selected card before being revealed.

      destination.frame.classList.add("is-visible");

      workFrame.classList.remove("is-visible");

      await nextFrame();
      await nextFrame();

      const target = rect(destination.image);

      // Fullscreen image shrinks into Collection card.

      await Promise.all([

        animate(
          image,
          styles(fullscreen),
          styles(target),
          DURATION
        ),

        animate(
          cover,
          { opacity: "1" },
          { opacity: "0" },
          DURATION
        )

      ]);

      image.remove();
      cover.remove();

      // Remove the old Work frame only after
      // Collection is fully visible.

      workFrame.remove();

      // Restore any Featured cover hidden by the
      // homepage-to-Work transition.

      document.querySelectorAll(
        ".living-featured .home-journey-source-hidden"
      ).forEach(source => {

        source.classList.remove(
          "home-journey-source-hidden"
        );

      });

      document.title = destination.doc.title;

      
      // Keep the successful Collection destination.
      // This will be used for Back to Archive.

      activeCollection = {
        frame: destination.frame,
        doc: destination.doc,
        projectId
      };

      
      /* =====================================================
         GLOBAL NAVIGATION — LEAVE COLLECTION IFRAME
      ===================================================== */

      destination.frame.contentWindow.addEventListener(
        "click",
        event => {

          const link = event.target.closest("a[href]");

          if (!link) return;

          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            link.target === "_blank"
          ) {
            return;
          }

          const url = new URL(
            link.href,
            destination.doc.URL
          );

          if (url.origin !== location.origin) return;

          const isGlobalPage =
            url.pathname.endsWith("/index.html") ||
            url.pathname.endsWith("/about.html") ||
            url.pathname.endsWith("/contact.html") ||
            url.pathname === "/";

          if (!isGlobalPage) return;

          event.preventDefault();
          event.stopImmediatePropagation();

          // Navigate the actual browser document,
          // never the Collection iframe.

          window.top.location.assign(url.href);

        },
        true
      );


      // Capture Archive navigation in the Collection
      // iframe without changing the Collection page.

      destination.doc.addEventListener(
        "click",
        event => {

          const link = event.target.closest(
            ".collection-back, .collection-return"
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
          event.stopImmediatePropagation();

          if (returning) return;

          returnToArchive(link.href);

        },
        true
      );


    } catch (error) {

      console.error(
        "Featured Work return to Collection:",
        error
      );

      image.remove();
      cover.remove();

      heroImage.style.visibility = "";

      workFrame.classList.add("is-visible");

      // Keep navigation possible even if the
      // persistent return cannot complete.

      window.location.assign(collectionURL);

    } finally {

      returning = false;

    }

  }

  
  /* ========================================================
    PREPARE ARCHIVE FOR COLLECTION RETURN
  ======================================================== */

  async function prepareArchive(categoryId) {

    const frame = document.createElement("iframe");

    frame.className = "home-journey-frame";
    frame.title = "Portfolio archive";

    document.body.append(frame);

    frame.src = new URL(
      "archive.html",
      location.href
    ).href;

    const started = performance.now();

    try {

      while (performance.now() - started < 15000) {

        if (!frame.isConnected) {
          throw new Error("Archive frame was removed");
        }

        const doc = frame.contentDocument;
        const win = frame.contentWindow;

        const correctPage =
          doc &&
          doc.URL !== "about:blank" &&
          new URL(doc.URL).pathname.endsWith(
            "/archive.html"
          );

        if (
          correctPage &&
          doc.documentElement &&
          doc.readyState === "complete" &&
          doc.querySelector(".archive-card") &&
          typeof win.archiveTransitionSelect === "function"
        ) {

          
          win.archiveTransitionSelect(categoryId);

          // Make global navigation leave the embedded Archive
          // instead of creating another page inside its iframe.

          win.addEventListener("click", event => {

            const link = event.target.closest("a[href]");

            if (!link) return;

            if (
              event.defaultPrevented ||
              event.button !== 0 ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey ||
              event.altKey ||
              link.target === "_blank"
            ) {
              return;
            }

            const destination = new URL(link.href, doc.URL);

            if (destination.origin !== location.origin) return;

            const path = destination.pathname;

            const isGlobalPage =
              path.endsWith("/index.html") ||
              path.endsWith("/about.html") ||
              path.endsWith("/contact.html") ||
              path === "/";

            if (!isGlobalPage) return;

            event.preventDefault();
            event.stopImmediatePropagation();

            // Navigate the real browser, not the iframe.
            // This resets the previous persistent navigation state.

            window.location.assign(destination.href);

          }, true);

          // Allow the Archive to render its background.

          await nextFrame();
          await nextFrame();

          return { frame, doc, win };

        }

        await nextFrame();

      }

      throw new Error(
        "Archive was not ready for the return transition"
      );

    } catch (error) {

      frame.remove();
      throw error;

    }

  }


    
  
  async function returnToArchive(archiveURL) {

    if (returning || !activeCollection) return;

    const state = activeCollection;
    const collectionFrame = state.frame;
    const doc = state.doc;

    const categoryId = new URL(
      doc.URL
    ).searchParams.get("category");

    const hero = doc.querySelector(
      ".collection-hero"
    );

    const heroImage = doc.getElementById(
      "collectionHeroImage"
    );

    if (
      !categoryId ||
      !hero ||
      !heroImage?.naturalWidth
    ) {
      window.location.assign(archiveURL);
      return;
    }

    returning = true;

    let archive = null;
    let image = null;
    let cover = null;

    try {

      // 01. Bring the Collection hero back into view.
      // We cannot expand a hero that is offscreen.

      const collectionWindow = collectionFrame.contentWindow;

      collectionWindow.scrollTo({
        top: 0,
        behavior: reducedMotion ? "instant" : "smooth"
      });

      // Wait for the actual scroll to finish, with
      // a safety limit so navigation cannot hang.

      const scrollStart = performance.now();

      while (
        collectionWindow.scrollY > 2 &&
        performance.now() - scrollStart < 1500
      ) {
        await nextFrame();
      }

      if (collectionWindow.scrollY > 2) {
        collectionWindow.scrollTo(0, 0);
      }

      await nextFrame();
      await nextFrame();

      // 02. Measure the visible Collection hero.

      const start = rect(hero);
      const fullscreen = viewport();

      image = document.createElement("img");

      image.className = "home-journey-image";
      image.src = heroImage.currentSrc || heroImage.src;
      image.alt = "";
      image.draggable = false;

      Object.assign(image.style, styles(start));

      cover = document.createElement("div");

      cover.className = "home-journey-cover";
      cover.style.opacity = "0";

      document.body.append(cover, image);

      // Prepare Archive while the hero expands.

      const archivePromise = prepareArchive(categoryId)
        .catch(error => {
          console.error(
            "Archive preparation:",
            error
          );
          return null;
        });

      // 03. Expand the Collection hero to fullscreen.

      await Promise.all([

        animate(
          image,
          styles(start),
          styles(fullscreen),
          DURATION
        ),

        animate(
          cover,
          { opacity: "0" },
          { opacity: "1" },
          DURATION
        )

      ]);

      // 04. Wait for the correct Archive category.

      archive = await archivePromise;

      if (!archive) {
        throw new Error(
          "Archive destination unavailable"
        );
      }

      // 05. Reveal Archive behind the expanded artwork.

      archive.frame.classList.add("is-visible");

      collectionFrame.classList.remove("is-visible");

      await nextFrame();
      await nextFrame();

      // 06. Dissolve into the Archive background.

      await Promise.all([

        animate(
          image,
          { opacity: "1" },
          { opacity: "0" },
          ARRIVAL_DURATION
        ),

        animate(
          cover,
          { opacity: "1" },
          { opacity: "0" },
          ARRIVAL_DURATION
        )

      ]);

      // 07. Clean up only after the transition ends.

      image.remove();
      cover.remove();

      collectionFrame.remove();
      activeCollection = null;

      document.title = archive.doc.title;

      archive.win.archiveTransitionArmReset?.();

      console.log(
        "[PORTFOLIO] Collection -> Archive complete"
      );

    } catch (error) {

      console.error(
        "Collection -> Archive transition:",
        error
      );

      image?.remove();
      cover?.remove();

      archive?.frame.remove();

      collectionFrame.classList.add("is-visible");

      // If the animation fails, Archive remains
      // accessible through ordinary navigation.

      window.location.assign(archiveURL);

    } finally {

      returning = false;

    }

  }




  /* ========================================================
     05. RECEIVE RETURN REQUEST FROM WORK
  ======================================================== */

  window.addEventListener(
    "lou:featured-work-return",
    event => {

      returnToCollection(
        event.detail?.projectId,
        event.detail?.collectionURL
      );

    }
  );

})();
