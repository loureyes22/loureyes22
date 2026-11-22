
"use strict";

/* ==========================================================
   LOU REYES — SHARED PAGE TRANSITIONS

   Collection -> Work
   Work -> Collection
========================================================== */

(() => {

  const STORAGE_KEY = "lou-page-transition";

  const DURATION = 520;
  const ARRIVAL_DURATION = 320;

  const EASE = "cubic-bezier(.65, 0, .25, 1)";

  const isCollection =
    window.location.pathname.endsWith("collection.html");

  const isWork =
    window.location.pathname.endsWith("work.html");

  if (!isCollection && !isWork) return;

  let busy = false;

  /* ========================================================
     01. HELPERS
  ======================================================== */

  function reducedMotion() {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }

  function nextFrame() {
    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });
  }

  function rectOf(element) {
    const rect = element.getBoundingClientRect();

    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    };
  }

  function viewportRect() {
    return {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  function keyframe(rect) {
    return {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    };
  }

  function createImage(src, rect) {
    const image = document.createElement("img");

    image.className = "page-transition-image";
    image.src = src;
    image.alt = "";
    image.draggable = false;

    Object.assign(image.style, keyframe(rect));

    document.body.appendChild(image);

    return image;
  }

  function createCover() {
    const cover = document.createElement("div");

    cover.className = "page-transition-cover";
    cover.style.opacity = "0";

    document.body.appendChild(cover);

    return cover;
  }

  async function prepareImage(src) {
    const image = new Image();
    image.src = src;

    try {
      await image.decode();
    } catch (error) {
      // The browser may still display the image.
    }

    return image;
  }

  async function animateRect(element, from, to, duration) {
    const animation = element.animate(
      [keyframe(from), keyframe(to)],
      {
        duration,
        easing: EASE,
        fill: "forwards"
      }
    );

    try {
      await animation.finished;
    } catch (error) {
      // Navigation can interrupt an animation.
    }

    return animation;
  }

  
  
  /* ========================================================
    SMOOTH RETURN — NO IMAGE DISTORTION
    Work -> Collection only
  ======================================================== */

  async function animateReturn(image, targetRect) {
    const startRect = rectOf(image);

    // Position starts fullscreen.
    image.style.left = `${startRect.left}px`;
    image.style.top = `${startRect.top}px`;
    image.style.width = `${startRect.width}px`;
    image.style.height = `${startRect.height}px`;

    image.style.transformOrigin = "top left";

    const dx = targetRect.left - startRect.left;
    const dy = targetRect.top - startRect.top;

    const animation = image.animate(
      [
        {
          transform: "translate3d(0, 0, 0)",
          width: `${startRect.width}px`,
          height: `${startRect.height}px`
        },
        {
          transform: `translate3d(${dx}px, ${dy}px, 0)`,
          width: `${targetRect.width}px`,
          height: `${targetRect.height}px`
        }
      ],
      {
        duration: DURATION,
        easing: EASE,
        fill: "forwards"
      }
    );

    try {
      await animation.finished;
    } catch (error) {
      // Allow interrupted navigation.
    }

    return animation;
  }



  function saveTransition(data) {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      // Continue with normal navigation.
    }
  }

  function takeTransition() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);

      sessionStorage.removeItem(STORAGE_KEY);

      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  
  
  /* ========================================================
    NAVIGATION HANDOFF — EARLY EVENT LISTENER
  ======================================================== */

  const navigationHandoffPromise = new Promise(resolve => {

    let completed = false;

    function finish() {
      if (completed) return;

      completed = true;
      clearTimeout(fallback);
      resolve();
    }

    // Safety fallback, not an animation delay.
    const fallback = setTimeout(finish, 250);

    // Register immediately when this script loads,
    // instead of waiting until arriveWork() or
    // arriveCollection() has already started.
    window.addEventListener("pagereveal", event => {

      if (!event.viewTransition) {
        finish();
        return;
      }

      event.viewTransition.finished.then(
        finish,
        finish
      );

    }, { once: true });

  });

  function waitForNavigationHandoff() {
    return navigationHandoffPromise;
  }

  


  async function waitForPage(className) {
    const start = performance.now();

    while (
      !document.documentElement.classList.contains(className) &&
      performance.now() - start < 3000
    ) {
      await nextFrame();
    }
  }

  
  function finish(image, cover, hiddenElement) {

    // Stop any animations attached to temporary elements.
    if (image) {
      image.getAnimations().forEach(animation => {
        animation.cancel();
      });

      image.remove();
    }

    if (cover) {
      cover.getAnimations().forEach(animation => {
        animation.cancel();
      });

      cover.remove();
    }

    // Restore the underlying original image.
    hiddenElement?.classList.remove(
      "page-transition-source-hidden"
    );

    document.body.classList.remove(
      "page-transition-active"
    );

    busy = false;
  }


  /* ========================================================
     02. COLLECTION -> WORK
  ======================================================== */

  async function leaveCollection(link, sourceImage) {
    if (busy) return;

    busy = true;

    const sourceRect = rectOf(sourceImage);
    const src = sourceImage.currentSrc || sourceImage.src;

    const projectId = new URL(
      link.href,
      window.location.href
    ).searchParams.get("project");

    if (reducedMotion()) {
      window.location.href = link.href;
      return;
    }

    await prepareImage(src);

    const image = createImage(src, sourceRect);
    const cover = createCover();

    document.body.classList.add(
      "page-transition-active"
    );

    sourceImage.classList.add(
      "page-transition-source-hidden"
    );

    const expand = animateRect(
      image,
      sourceRect,
      viewportRect(),
      DURATION
    );

    const fade = cover.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: DURATION,
        fill: "forwards"
      }
    );

    await Promise.all([
      expand,
      fade.finished
    ]);

    saveTransition({
      direction: "forward",
      projectId,
      src,
      scrollY: window.scrollY,
      timestamp: Date.now()
    });

    window.location.href = link.href;
  }

  /* ========================================================
     03. ARRIVE ON WORK
  ======================================================== */

  async function arriveWork(data) {
    if (!data || data.direction !== "forward") return;

    const currentId = new URLSearchParams(
      window.location.search
    ).get("project");

    if (data.projectId !== currentId) return;

    busy = true;

    document.body.classList.add(
      "page-transition-active"
    );

    const image = createImage(
      data.src,
      viewportRect()
    );

    const cover = createCover();
    cover.style.opacity = "1";

    const content = document.querySelector(
      ".work-hero-content"
    );

    content?.classList.add(
      "page-transition-content-hidden"
    );

    await Promise.all([
      waitForPage("work-ready"),
      waitForNavigationHandoff()
    ]);

    const hero = document.querySelector(".work-hero");
    const heroImage = document.getElementById(
      "workHeroImage"
    );

    if (!hero) {
      finish(image, cover);
      return;
    }

    await prepareImage(heroImage?.src || data.src);

    await nextFrame();
    await nextFrame();

    const target = rectOf(hero);

    const settle = animateRect(
      image,
      viewportRect(),
      target,
      ARRIVAL_DURATION
    );

    const fade = cover.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: ARRIVAL_DURATION,
        fill: "forwards"
      }
    );

    await Promise.all([
      settle,
      fade.finished
    ]);

    finish(image, cover);

    content?.classList.remove(
      "page-transition-content-hidden"
    );

    content?.classList.add(
      "page-transition-content-arrive"
    );
  }

  /* ========================================================
     04. WORK -> COLLECTION
  ======================================================== */

  async function leaveWork(link) {
    if (busy) return;

    busy = true;

    if (reducedMotion()) {
      window.location.href = link.href;
      return;
    }

    const hero = document.querySelector(".work-hero");
    const heroImage = document.getElementById(
      "workHeroImage"
    );

    if (!hero || !heroImage) {
      window.location.href = link.href;
      return;
    }

    const projectId = new URLSearchParams(
      window.location.search
    ).get("project");

    const src = heroImage.currentSrc || heroImage.src;

    const sourceRect = rectOf(hero);

    const image = createImage(src, sourceRect);
    const cover = createCover();

    document.body.classList.add(
      "page-transition-active"
    );

    const expand = animateRect(
      image,
      sourceRect,
      viewportRect(),
      DURATION * .65
    );

    const fade = cover.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: DURATION * .65,
        fill: "forwards"
      }
    );

    await Promise.all([
      expand,
      fade.finished
    ]);

    let scrollY = 0;

    try {
      scrollY = Number(
        sessionStorage.getItem(
          `lou-collection-scroll-${projectId}`
        )
      ) || 0;
    } catch (error) {
      scrollY = 0;
    }

    saveTransition({
      direction: "backward",
      projectId,
      src,
      scrollY,
      timestamp: Date.now()
    });

    window.location.href = link.href;
  }

  /* ========================================================
     05. ARRIVE BACK ON COLLECTION
  ======================================================== */

  async function arriveCollection(data) {
    if (!data || data.direction !== "backward") return;

    busy = true;

    document.body.classList.add(
      "page-transition-active"
    );

    const image = createImage(
      data.src,
      viewportRect()
    );

    const cover = createCover();
    cover.style.opacity = "1";

    
  
    /* Let Chrome finish the page snapshot before
      starting the fullscreen-to-thumbnail animation. */

    await waitForNavigationHandoff();


    window.scrollTo({
      top: data.scrollY || 0,
      behavior: "instant"
    });

    await nextFrame();
    await nextFrame();

    const card = [...document.querySelectorAll(
      ".collection-item"
    )].find(item => {
      const url = new URL(item.href);

      return url.searchParams.get("project") ===
        data.projectId;
    });

    const targetImage = card?.querySelector(
      ".collection-item-image img"
    );

    if (!targetImage) {
      finish(image, cover);
      return;
    }

    targetImage.classList.add(
      "page-transition-source-hidden"
    );

    const targetRect = rectOf(targetImage);

    
    const collapse = animateReturn(
      image,
      targetRect
    );

    const fade = cover.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: DURATION,
        fill: "forwards"
      }
    );

    await Promise.all([
      collapse,
      fade.finished
    ]);

    finish(image, cover, targetImage);
  }

  /* ========================================================
     06. CLICK HANDLING
  ======================================================== */

  document.addEventListener("click", event => {

    if (event.defaultPrevented) return;

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (isCollection) {
      const link = event.target.closest(
        ".collection-item"
      );

      if (!link) return;

      const image = link.querySelector(
        ".collection-item-image img"
      );

      if (!image) return;

      event.preventDefault();

      if (busy) return;

      const id = new URL(
        link.href
      ).searchParams.get("project");

      try {
        sessionStorage.setItem(
          `lou-collection-scroll-${id}`,
          String(window.scrollY)
        );
      } catch (error) {
        // Scroll restoration is optional.
      }

      leaveCollection(link, image);
    }

    if (isWork) {
      const link = event.target.closest("#workBack");

      if (!link) return;

      event.preventDefault();

      if (!busy) {
        leaveWork(link);
      }
    }

  });

  /* ========================================================
     07. DESTINATION INITIALIZATION
  ======================================================== */

  const pending = takeTransition();

  if (
    pending &&
    Date.now() - pending.timestamp < 10000 &&
    !reducedMotion()
  ) {
    if (isWork && pending.direction === "forward") {
      arriveWork(pending);
    }

    if (
      isCollection &&
      pending.direction === "backward"
    ) {
      arriveCollection(pending);
    }
  }

})();
