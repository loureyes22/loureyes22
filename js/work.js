
"use strict";

/* ==========================================================
   LOU REYES — INDIVIDUAL WORK PAGE

   01. HELPERS
   02. PROJECT DATA
   03. PRESENTATION HELPERS
   04. EDITORIAL ARTBOOK
   05. PACKAGING GALLERY
   06. WEBSITE PRESENTATION
   07. UI/UX SCREEN GALLERY
   08. DEFAULT GALLERY
   09. PROJECT RENDERER
   10. NEXT PROJECT
   11. IMAGE LIGHTBOX
   12. THEME
   13. NAVIGATION
   14. INITIALIZATION
========================================================== */


/* ==========================================================
   01. HELPERS
========================================================== */

const $ = id => document.getElementById(id);

const pad = number =>
  String(number).padStart(2, "0");

const workState = {
  project: null,
  images: [],
  lightboxIndex: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
  lastFocus: null
};

function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("project");
}

function getCategoryTitle(id) {
  const category = CATEGORIES.find(item => item.id === id);
  return category ? category.title : id;
}

function getImageData(image, index) {

  if (typeof image === "string") {
    return {
      src: image,
      label: `IMAGE ${pad(index + 1)}`,
      description: "",
      credits: [],
      group: "mockup"
    };
  }

  return {
    src: image.src,
    label: image.label || `IMAGE ${pad(index + 1)}`,
    description: image.description || "",
    credits: Array.isArray(image.credits)
      ? image.credits
      : [],
    group: image.group || "mockup"
  };

}

function normalizeImages(images) {
  return (images || [])
    .map(getImageData)
    .filter(image =>
      typeof image.src === "string" && image.src
    );
}

function makeElement(tag, className, text) {

  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;

}


/* ==========================================================
   SHARED GALLERY KEYBOARD CONTROLS
========================================================== */

function workGalleryKeyboardAllowed(event) {

  if (
    event.defaultPrevented ||
    (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.shiftKey
  ) {
    return false;
  }

  if (
    document.querySelector(".work-lightbox.open") ||
    document.body.classList.contains("menu-open")
  ) {
    return false;
  }

  const target = event.target;

  if (
    target instanceof Element &&
    target.closest(
      'input, textarea, select, [contenteditable]:not([contenteditable="false"])'
    )
  ) {
    return false;
  }

  return true;

}

function registerGalleryKeyboard(element, navigate) {

  function handleKeydown(event) {

    if (!workGalleryKeyboardAllowed(event)) {
      return;
    }

    if (!element.isConnected) {
      document.removeEventListener(
        "keydown",
        handleKeydown
      );
      return;
    }

    const direction =
      event.key === "ArrowRight" ? 1 : -1;

    event.preventDefault();
    navigate(direction);

  }

  document.addEventListener(
    "keydown",
    handleKeydown
  );

}


/* ==========================================================
   02. PROJECT DATA
========================================================== */

function findProject() {

  const id = getProjectId();

  return PROJECTS.find(
    project => project.id === id
  ) || null;

}


/* ==========================================================
   03. PRESENTATION HELPERS
========================================================== */

function makeImageButton(image, index, className = "") {

  const button = makeElement(
    "button",
    `work-image-button ${className}`
  );

  button.type = "button";

  button.setAttribute(
    "aria-label",
    `View ${image.label} fullscreen`
  );

  const img = document.createElement("img");

  img.src = image.src;
  img.alt = image.label;
  img.loading = index === 0 ? "eager" : "lazy";
  img.decoding = "async";

  button.appendChild(img);

  button.addEventListener("click", () => {
    openLightbox(index);
  });

  return button;

}


/* ==========================================================
   SHARED GALLERY — STANDARD IMAGE VIEW
========================================================== */

function createStandardGallery(entries, options = {}) {

  const panel = makeElement(
    "div",
    "website-view-panel"
  );

  const gallery = makeElement(
    "div",
    "website-design-gallery"
  );

  const visual = makeElement(
    "div",
    "website-design-visual"
  );

  const imageButton = makeElement(
    "button",
    "work-image-button website-design-image"
  );

  imageButton.type = "button";

  const imageElement = document.createElement("img");
  imageElement.decoding = "async";

  imageButton.appendChild(imageElement);

  const placeholder = makeElement(
    "p",
    "shared-gallery-placeholder",
    "IMAGES COMING SOON"
  );

  visual.append(imageButton, placeholder);

  /* NAVIGATION */

  const controls = makeElement(
    "div",
    "website-design-controls"
  );

  const counter = makeElement(
    "span",
    "micro"
  );

  const instruction = makeElement(
    "span",
    "micro muted",
    options.instruction || "EXPLORE THE IMAGES"
  );

  const arrows = makeElement(
    "div",
    "website-design-arrows"
  );

  const previous = makeElement("button", "", "←");
  const next = makeElement("button", "", "→");

  previous.type = "button";
  next.type = "button";

  previous.setAttribute(
    "aria-label",
    "Previous image"
  );

  next.setAttribute(
    "aria-label",
    "Next image"
  );

  arrows.append(previous, next);
  controls.append(counter, instruction, arrows);

  /* PROGRESS */

  const progress = makeElement(
    "div",
    "website-design-progress"
  );

  const progressFill = makeElement(
    "div",
    "website-design-progress-fill"
  );

  progress.appendChild(progressFill);

  gallery.append(
    visual,
    controls,
    progress
  );

  panel.appendChild(gallery);

  let current = 0;

  function notifyImage(index) {

    window.dispatchEvent(
      new CustomEvent("work:image-change", {
        detail: { index }
      })
    );

  }

  /* IMAGE LOADING */

  imageElement.addEventListener("load", () => {
    visual.classList.remove("is-missing");
  });

  imageElement.addEventListener("error", () => {
    visual.classList.add("is-missing");
  });

  /* ACTIVE IMAGE */

  function showImage(index) {

    if (
      index < 0 ||
      index >= entries.length
    ) {
      return;
    }

    current = index;

    const entry = entries[current];
    const image = entry.image;

    visual.classList.remove("is-missing");

    imageElement.alt = image.label;
    imageElement.src = image.src;

    imageButton.setAttribute(
      "aria-label",
      `View ${image.label} fullscreen`
    );

    imageButton.onclick = () => {
      openLightbox(entry.index);
    };

    counter.textContent =
      `${pad(current + 1)} / ${pad(entries.length)}`;

    progressFill.style.width =
      `${((current + 1) / entries.length) * 100}%`;

    previous.disabled = current === 0;
    next.disabled = current === entries.length - 1;

    notifyImage(entry.index);

  }

  /* PREVIOUS / NEXT */

  previous.addEventListener("click", () => {
    showImage(current - 1);
  });

  next.addEventListener("click", () => {
    showImage(current + 1);
  });

  /* KEYBOARD NAVIGATION */

  registerGalleryKeyboard(
    panel,
    direction => {

      if (
        panel.hidden ||
        (options.isActive && !options.isActive())
      ) return;

      showImage(current + direction);

    }
  );

  /* EMPTY GALLERY */

  if (!entries.length) {

    gallery.replaceChildren(
      makeElement(
        "p",
        "shared-gallery-empty",
        "IMAGES COMING SOON"
      )
    );

  } else {

    showImage(0);

  }

  return {
    panel,
    refresh: () => {
      if (entries.length) {
        showImage(current);
      }
    }
  };

}



/* ==========================================================
   04. EDITORIAL — INTERACTIVE ARTBOOK
========================================================== */

function renderEditorial(images, container) {

  if (!images.length) return;

  /* --------------------------------------------------------
     01. STRUCTURE
  -------------------------------------------------------- */

  const artbook = makeElement(
    "div",
    "work-artbook"
  );

  const stage = makeElement(
    "div",
    "artbook-stage"
  );

  const book = makeElement(
    "div",
    "editorial-book"
  );

  const controls = makeElement(
    "div",
    "artbook-controls"
  );

  const counter = makeElement(
    "span",
    "micro"
  );

  const instruction = makeElement(
    "span",
    "micro muted",
    "TURN THE PAGES"
  );

  const arrows = makeElement(
    "div",
    "artbook-arrows"
  );

  const prev = makeElement("button", "", "←");
  const next = makeElement("button", "", "→");

  prev.type = "button";
  next.type = "button";

  prev.setAttribute(
    "aria-label",
    "Previous publication spread"
  );

  next.setAttribute(
    "aria-label",
    "Next publication spread"
  );

  arrows.append(prev, next);

  controls.append(
    counter,
    instruction,
    arrows
  );

  const progress = makeElement(
    "div",
    "artbook-progress"
  );

  const fill = makeElement(
    "div",
    "artbook-progress-fill"
  );

  progress.appendChild(fill);

  const caption = makeElement(
    "div",
    "artbook-caption micro"
  );

  let current = 0;
  let busy = false;
  let activeAnimation = null;
  let destroyed = false;

  /* --------------------------------------------------------
     02. IMAGE ELEMENTS
  -------------------------------------------------------- */

  function createImage() {

    const img = document.createElement("img");

    img.alt = "";
    img.draggable = false;
    img.decoding = "async";

    return img;

  }

  function createHalf(className) {

    const element = makeElement(
      "div",
      `editorial-half ${className}`
    );

    const image = createImage();

    element.appendChild(image);

    return { element, image };

  }

  const underSpread = makeElement(
    "div",
    "editorial-spread editorial-under"
  );

  const fullSpread = createImage();

  fullSpread.className = "editorial-full-image";

  underSpread.appendChild(fullSpread);

  const staticHalf = createHalf(
    "editorial-static-half"
  );

  const sheet = makeElement(
    "div",
    "editorial-turn-sheet"
  );

  const front = createHalf(
    "editorial-sheet-face editorial-sheet-front"
  );

  const back = createHalf(
    "editorial-sheet-face editorial-sheet-back"
  );

  sheet.append(
    front.element,
    back.element
  );

  book.append(
    underSpread,
    staticHalf.element,
    sheet
  );

  sheet.style.visibility = "hidden";
  staticHalf.element.style.visibility = "hidden";

  /* --------------------------------------------------------
     03. ORIGINAL IMAGE CACHE
  -------------------------------------------------------- */

  const imageCache = new Map();
  const generatedURLs = new Set();

  function loadOriginal(index) {

    return new Promise((resolve, reject) => {

      const image = new Image();

      image.decoding = "async";

      image.onload = async () => {

        try {
          await image.decode();
        } catch (error) {
          // Loaded images may still be displayed.
        }

        resolve(image);

      };

      image.onerror = () => {

        reject(
          new Error(
            `Unable to load editorial image ${index + 1}`
          )
        );

      };

      image.src = images[index].src;

    });

  }

  async function createOptimizedImage(index) {

    await loadOriginal(index);

    // Preserve the original full-quality image.
    return images[index].src;

  }

  function prepareImage(index) {

    if (index < 0 || index >= images.length) {
      return Promise.resolve(null);
    }

    if (imageCache.has(index)) {
      return imageCache.get(index);
    }

    const promise = createOptimizedImage(index)
      .catch(error => {

        console.warn(
          "Editorial image loading fallback:",
          error
        );

        return images[index].src;

      });

    imageCache.set(index, promise);

    return promise;

  }

  /* --------------------------------------------------------
     04. PREPARE NEIGHBOURING SPREADS
  -------------------------------------------------------- */

  let backgroundPreparing = false;

  async function prepareNearby() {

    if (
      backgroundPreparing ||
      busy ||
      destroyed
    ) {
      return;
    }

    backgroundPreparing = true;

    const nearby = [
      current + 1,
      current - 1,
      current + 2,
      current - 2
    ];

    try {

      for (const index of nearby) {

        if (destroyed || busy) break;

        if (
          index < 0 ||
          index >= images.length
        ) {
          continue;
        }

        if (Math.abs(index - current) > 1) {

          await new Promise(resolve => {
            setTimeout(resolve, 80);
          });

        }

        if (destroyed || busy) break;

        await prepareImage(index);

      }

    } finally {

      backgroundPreparing = false;

    }

  }

  /* --------------------------------------------------------
     05. IMAGE HELPERS
  -------------------------------------------------------- */

  async function assignImage(element, src) {

    if (element.getAttribute("src") !== src) {
      element.src = src;
    }

    if (!element.complete) {

      await new Promise(resolve => {

        const done = () => {

          element.removeEventListener(
            "load",
            done
          );

          element.removeEventListener(
            "error",
            done
          );

          resolve();

        };

        element.addEventListener("load", done);
        element.addEventListener("error", done);

      });

    }

    if (element.naturalWidth && element.decode) {

      try {
        await element.decode();
      } catch (error) {
        // Continue with available image.
      }

    }

  }

  function setSide(half, side) {

    half.element.classList.toggle(
      "editorial-left",
      side === "left"
    );

    half.element.classList.toggle(
      "editorial-right",
      side === "right"
    );

  }

  function nextFrame() {

    return new Promise(resolve => {
      requestAnimationFrame(resolve);
    });

  }

  /* --------------------------------------------------------
     06. CONTROLS
  -------------------------------------------------------- */

  function updateControls() {

    counter.textContent =
      `${pad(current + 1)} / ${pad(images.length)}`;

    caption.textContent = images[current].label;

    fill.style.width =
      `${((current + 1) / images.length) * 100}%`;

    prev.disabled =
      busy || current === 0;

    next.disabled =
      busy || current === images.length - 1;

      
    window.dispatchEvent(
      new CustomEvent("work:image-change", {
        detail: { index: current }
      })
    );


  }

  /* --------------------------------------------------------
     07. RESTING SPREAD
  -------------------------------------------------------- */

  async function showSpread(index) {

    const src = await prepareImage(index);

    if (destroyed) return;

    await assignImage(
      fullSpread,
      src || images[index].src
    );

    current = index;

    staticHalf.element.style.visibility = "hidden";
    sheet.style.visibility = "hidden";

    sheet.style.transform = "";

    sheet.classList.remove(
      "turn-forward",
      "turn-backward"
    );

    updateControls();
    prepareNearby();

  }

  /* --------------------------------------------------------
     08. 3D PAGE TURN
  -------------------------------------------------------- */

  async function turnPage(direction) {

    if (busy || destroyed) return;

    const target = current + direction;

    if (
      target < 0 ||
      target >= images.length
    ) {
      return;
    }

    busy = true;
    updateControls();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    try {

      if (reducedMotion) {

        await showSpread(target);
        return;

      }

      const [currentSrc, targetSrc] =
        await Promise.all([
          prepareImage(current),
          prepareImage(target)
        ]);

      if (destroyed) return;

      const forward = direction > 0;

      const stationarySide = forward
        ? "left"
        : "right";

      const turningSide = forward
        ? "right"
        : "left";

      setSide(staticHalf, stationarySide);
      setSide(front, turningSide);
      setSide(back, stationarySide);

      sheet.classList.remove(
        "turn-forward",
        "turn-backward"
      );

      sheet.classList.add(
        forward
          ? "turn-forward"
          : "turn-backward"
      );

      await Promise.all([
        assignImage(staticHalf.image, currentSrc),
        assignImage(front.image, currentSrc),
        assignImage(back.image, targetSrc)
      ]);

      if (destroyed) return;

      sheet.style.transform = "rotateY(0deg)";

      staticHalf.element.style.visibility =
        "visible";

      sheet.style.visibility = "visible";

      await nextFrame();
      await nextFrame();

      if (destroyed) return;

      // Matching page halves hide this update.
      fullSpread.src = targetSrc;

      activeAnimation = sheet.animate(
        [
          {
            transform: "rotateY(0deg)"
          },
          {
            transform: forward
              ? "rotateY(-180deg)"
              : "rotateY(180deg)"
          }
        ],
        {
          duration: 580,
          easing: "cubic-bezier(.42, 0, .2, 1)",
          fill: "forwards"
        }
      );

      try {
        await activeAnimation.finished;
      } catch (error) {
        // Interrupted animation.
      }

      if (destroyed) return;

      sheet.style.visibility = "hidden";

      staticHalf.element.style.visibility =
        "hidden";

      activeAnimation.cancel();
      activeAnimation = null;

      current = target;

      updateControls();
      prepareNearby();

    } catch (error) {

      console.error(
        "Editorial page turn:",
        error
      );

      staticHalf.element.style.visibility =
        "hidden";

      sheet.style.visibility = "hidden";

      if (!destroyed) {
        await showSpread(current);
      }

    } finally {

      busy = false;

      if (!destroyed) {
        updateControls();
        prepareNearby();
      }

    }

  }

  /* --------------------------------------------------------
     09. MOUSE AND KEYBOARD EVENTS
  -------------------------------------------------------- */

  prev.addEventListener("click", () => {
    turnPage(-1);
  });

  next.addEventListener("click", () => {
    turnPage(1);
  });

  registerGalleryKeyboard(
    artbook,
    direction => turnPage(direction)
  );

  book.addEventListener("click", () => {

    if (!busy) {
      openLightbox(current);
    }

  });

  book.style.cursor = "zoom-in";

  /* --------------------------------------------------------
     10. INITIALIZATION
  -------------------------------------------------------- */

  book.setAttribute(
    "aria-label",
    "Interactive editorial publication"
  );

  const referenceImage = new Image();

  referenceImage.onload = () => {

    if (
      referenceImage.naturalWidth &&
      referenceImage.naturalHeight
    ) {

      book.style.aspectRatio =
        `${referenceImage.naturalWidth} / ${referenceImage.naturalHeight}`;

    }

  };

  referenceImage.src = images[0].src;

  stage.appendChild(book);

  artbook.append(
    stage,
    controls,
    progress,
    caption
  );

  container.appendChild(artbook);

  fullSpread.src = images[0].src;

  showSpread(0);

  /* --------------------------------------------------------
     11. CLEANUP
  -------------------------------------------------------- */

  const observer = new MutationObserver(() => {

    if (book.isConnected || destroyed) return;

    destroyed = true;

    if (activeAnimation) {
      activeAnimation.cancel();
    }

    observer.disconnect();

    for (const url of generatedURLs) {
      URL.revokeObjectURL(url);
    }

    generatedURLs.clear();
    imageCache.clear();

  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

}


/* ==========================================================
   05. PACKAGING — MOCKUPS & DIELINES
========================================================== */


/* ==========================================================
   PACKAGING — INTERACTIVE GALLERY
========================================================== */

function renderPackaging(images, container) {

  if (!images.length) return;

  /* --------------------------------------------------------
     01. TAB SWITCHER
  -------------------------------------------------------- */

  const switcher = makeElement(
    "div",
    "website-view-switch"
  );

  switcher.setAttribute("role", "group");
  switcher.setAttribute(
    "aria-label",
    "Packaging presentation mode"
  );

  const mockupButton = makeElement(
    "button",
    "active",
    "MOCKUPS"
  );

  const assetsButton = makeElement(
    "button",
    "",
    "ASSETS"
  );

  mockupButton.type = "button";
  assetsButton.type = "button";

  switcher.append(mockupButton, assetsButton);

  /* --------------------------------------------------------
     02. ORGANIZE IMAGES
  -------------------------------------------------------- */

  const mockupImages = [];
  const assetImages = [];

  images.forEach((image, index) => {

    const entry = { image, index };

    if (image.group === "assets") {
      assetImages.push(entry);
    } else {
      mockupImages.push(entry);
    }

  });

  /* --------------------------------------------------------
     03. CREATE GALLERY
  -------------------------------------------------------- */

  
  function createPackagingGallery(entries, title) {

    return createStandardGallery(entries, {
      instruction: title
    });

  }


  /* --------------------------------------------------------
     04. CREATE BOTH VIEWS
  -------------------------------------------------------- */

  const mockups = createPackagingGallery(
    mockupImages,
    "EXPLORE THE MOCKUPS"
  );

  const assets = createPackagingGallery(
    assetImages,
    "EXPLORE THE ASSETS"
  );

  /* --------------------------------------------------------
     05. TAB SWITCHING
  -------------------------------------------------------- */

  function switchView(mode) {

    const isMockup = mode === "mockup";

    mockups.panel.hidden = !isMockup;
    assets.panel.hidden = isMockup;

    mockupButton.classList.toggle(
      "active",
      isMockup
    );

    assetsButton.classList.toggle(
      "active",
      !isMockup
    );

    mockupButton.setAttribute(
      "aria-pressed",
      String(isMockup)
    );

    assetsButton.setAttribute(
      "aria-pressed",
      String(!isMockup)
    );

    if (isMockup) {
      mockups.refresh();
    } else {
      assets.refresh();
    }

  }

  mockupButton.addEventListener(
    "click",
    () => switchView("mockup")
  );

  assetsButton.addEventListener(
    "click",
    () => switchView("assets")
  );

  /* --------------------------------------------------------
     06. INITIALIZE
  -------------------------------------------------------- */

  container.append(
    switcher,
    mockups.panel,
    assets.panel
  );

  switchView("mockup");

}


/* ==========================================================
   BRAND IDENTITY — SLIDES, MOCKUPS & ASSETS
========================================================== */

function renderIdentity(images, container) {

  if (!images.length) return;

  const identityImages = [];
  const mockupImages = [];
  const assetImages = [];

  images.forEach((image, index) => {

    const entry = { image, index };

    if (image.group === "identity") {
      identityImages.push(entry);
    } else if (image.group === "assets") {
      assetImages.push(entry);
    } else {
      mockupImages.push(entry);
    }

  });

  /* --------------------------------------------------------
     01. TAB SWITCHER
  -------------------------------------------------------- */

  const presentation = makeElement(
    "section",
    "work-identity"
  );

  const switcher = makeElement(
    "div",
    "website-view-switch identity-view-switch"
  );

  switcher.setAttribute("role", "group");
  switcher.setAttribute(
    "aria-label",
    "Brand identity presentation mode"
  );

  const tabs = [
    { id: "identity", label: "BRAND IDENTITY" },
    { id: "mockup", label: "MOCKUPS" },
    { id: "assets", label: "ASSETS" }
  ];

  const buttons = {};
  const panels = {};

  tabs.forEach(tab => {

    const button = makeElement(
      "button",
      "",
      tab.label
    );

    button.type = "button";

    const panel = makeElement(
      "div",
      "website-view-panel identity-view-panel"
    );

    buttons[tab.id] = button;
    panels[tab.id] = panel;

    switcher.appendChild(button);

  });

  /* --------------------------------------------------------
     02. BRAND IDENTITY SLIDESHOW
  -------------------------------------------------------- */

  const slideshow = makeElement(
    "div",
    "identity-slideshow"
  );

  const stage = makeElement(
    "div",
    "identity-slide-stage"
  );

  const slideButton = makeElement(
    "button",
    "work-image-button identity-slide-button"
  );

  slideButton.type = "button";

  const slideImage = document.createElement("img");

  slideImage.alt = "";
  slideImage.decoding = "async";
  slideImage.draggable = false;

  slideButton.appendChild(slideImage);
  stage.appendChild(slideButton);

  const imagePlaceholder = makeElement(
    "p",
    "identity-image-placeholder",
    "IMAGES COMING SOON"
  );

  stage.appendChild(imagePlaceholder);

  slideImage.addEventListener("error", () => {
    stage.classList.add("is-missing");
  });

  slideImage.addEventListener("load", () => {
    stage.classList.remove("is-missing");
  });


  const controls = makeElement(
    "div",
    "identity-slide-controls"
  );

  const counter = makeElement(
    "span",
    "micro"
  );

  const instruction = makeElement(
    "span",
    "micro muted",
    "EXPLORE THE IDENTITY"
  );

  const arrows = makeElement(
    "div",
    "identity-slide-arrows"
  );

  const previous = makeElement(
    "button",
    "",
    "←"
  );

  const next = makeElement(
    "button",
    "",
    "→"
  );

  previous.type = "button";
  next.type = "button";

  previous.setAttribute(
    "aria-label",
    "Previous brand identity slide"
  );

  next.setAttribute(
    "aria-label",
    "Next brand identity slide"
  );

  arrows.append(previous, next);
  controls.append(counter, instruction, arrows);

  const progress = makeElement(
    "div",
    "identity-slide-progress"
  );

  const progressFill = makeElement(
    "div",
    "identity-slide-progress-fill"
  );

  progress.appendChild(progressFill);

  slideshow.append(
    stage,
    controls,
    progress
  );

  if (identityImages.length) {
    panels.identity.appendChild(slideshow);
  } else {
    panels.identity.appendChild(
      makeElement(
        "p",
        "micro muted",
        "IMAGES COMING SOON"
      )
    );
  }

  let current = 0;

  function showSlide(index) {

    if (
      index < 0 ||
      index >= identityImages.length
    ) {
      return;
    }

    current = index;

    const entry = identityImages[current];

    
    stage.classList.remove("is-missing");

    slideImage.src = entry.image.src;

    slideImage.alt = entry.image.label;

    slideButton.setAttribute(
      "aria-label",
      `View ${entry.image.label} fullscreen`
    );

    counter.textContent =
      `${pad(current + 1)} / ${pad(identityImages.length)}`;



    progressFill.style.width =
      `${((current + 1) / identityImages.length) * 100}%`;

    previous.disabled = current === 0;
    next.disabled =
      current === identityImages.length - 1;

    
    window.dispatchEvent(
      new CustomEvent("work:image-change", {
        detail: { index: entry.index }
      })
    );


  }

  previous.addEventListener("click", () => {
    showSlide(current - 1);
  });

  next.addEventListener("click", () => {
    showSlide(current + 1);
  });

  slideButton.addEventListener("click", () => {

    if (!identityImages.length) return;

    openLightbox(identityImages[current].index);

  });


  /* --------------------------------------------------------
    03. MOCKUPS & ASSETS — SHARED GALLERY
  -------------------------------------------------------- */

  const mockupGallery = createStandardGallery(
    mockupImages,
    {
      instruction: "EXPLORE THE MOCKUPS",
      isActive: () => !panels.mockup.hidden
    }
  );

  const assetGallery = createStandardGallery(
    assetImages,
    {
      instruction: "EXPLORE THE ASSETS",
      isActive: () => !panels.assets.hidden
    }
  );

  panels.mockup.appendChild(mockupGallery.panel);
  panels.assets.appendChild(assetGallery.panel);


  /* --------------------------------------------------------
     04. TAB NAVIGATION
  -------------------------------------------------------- */

  let activeTab = "identity";

  function switchView(mode) {

    activeTab = mode;

    tabs.forEach(tab => {

      const active = tab.id === mode;

      panels[tab.id].hidden = !active;

      buttons[tab.id].classList.toggle(
        "active",
        active
      );

      buttons[tab.id].setAttribute(
        "aria-pressed",
        String(active)
      );

    });

    
    if (mode === "mockup") {
      mockupGallery.refresh();
    }

    if (mode === "assets") {
      assetGallery.refresh();
    }

    if (mode === "identity" && identityImages.length) {
      showSlide(current);
    }


  }

  tabs.forEach(tab => {

    buttons[tab.id].addEventListener(
      "click",
      () => switchView(tab.id)
    );

  });

  /* --------------------------------------------------------
     05. KEYBOARD NAVIGATION
  -------------------------------------------------------- */

  registerGalleryKeyboard(
    presentation,
    direction => {

      if (activeTab !== "identity") return;

      showSlide(current + direction);

    }
  );

  /* --------------------------------------------------------
     06. INITIALIZATION
  -------------------------------------------------------- */

  presentation.append(
    switcher,
    panels.identity,
    panels.mockup,
    panels.assets
  );

  container.appendChild(presentation);

  if (identityImages.length) {
    showSlide(0);
  }

  switchView("identity");

}

/* ==========================================================
   06. WEBSITE — INTERACTIVE EXPERIENCE
========================================================== */

function renderWebsite(images, container, project) {

  const presentationHeading =
    document.querySelector(".work-minimal-heading");

  if (presentationHeading) {
    presentationHeading.style.display = "none";
  }

  /* --------------------------------------------------------
     01. MAIN EXPERIENCE
  -------------------------------------------------------- */

  const experience = makeElement(
    "section",
    "website-experience"
  );

  const heading = makeElement(
    "div",
    "website-experience-heading"
  );

  const headingLeft = makeElement("div");

  headingLeft.append(
    makeElement(
      "span",
      "micro",
      "DIGITAL / INTERACTIVE"
    ),
    makeElement(
      "h3",
      "",
      "Explore the website."
    )
  );

  heading.append(
    headingLeft,
    makeElement(
      "span",
      "micro",
      "01 / EXPERIENCE"
    )
  );

  /* --------------------------------------------------------
     02. PRESENTATION TOOLBAR
  -------------------------------------------------------- */

  const toolbar = makeElement(
    "div",
    "website-experience-toolbar"
  );

  const switcher = makeElement(
    "div",
    "website-view-switch packaging-view-switch"
  );

  switcher.setAttribute("role", "group");

  switcher.setAttribute(
    "aria-label",
    "Website presentation mode"
  );

  const interactiveButton = makeElement(
    "button",
    "",
    "LIVE WEBSITE"
  );

  const galleryButton = makeElement(
    "button",
    "",
    "DESIGN GALLERY"
  );

  interactiveButton.type = "button";
  galleryButton.type = "button";

  switcher.append(
    interactiveButton,
    galleryButton
  );

  const deviceControls = makeElement(
    "div",
    "live-preview-actions"
  );

  deviceControls.setAttribute(
    "role",
    "group"
  );

  deviceControls.setAttribute(
    "aria-label",
    "Preview device"
  );

  const desktopButton = makeElement(
    "button",
    "active",
    "DESKTOP"
  );

  const mobileButton = makeElement(
    "button",
    "",
    "MOBILE"
  );

  desktopButton.type = "button";
  mobileButton.type = "button";

  deviceControls.append(
    desktopButton,
    mobileButton
  );

  toolbar.append(
    switcher,
    deviceControls
  );

  /* --------------------------------------------------------
     03. LIVE WEBSITE PANEL
  -------------------------------------------------------- */

  const interactivePanel = makeElement(
    "div",
    "website-view-panel"
  );

  const live = project.livePreview;

  const hasLiveWebsite = Boolean(
    live && live.enabled && live.url
  );

  let stage = null;

  if (hasLiveWebsite) {

    const preview = makeElement(
      "section",
      "live-preview"
    );

    stage = makeElement(
      "div",
      "live-preview-stage"
    );

    const iframe = document.createElement("iframe");

    iframe.src = live.url;
    iframe.title =
      `${project.title} interactive website`;

    iframe.loading = "lazy";

    stage.appendChild(iframe);

    const externalLink = makeElement(
      "a",
      "live-preview-external",
      "OPEN FULL WEBSITE ↗"
    );

    externalLink.href = live.url;
    externalLink.target = "_blank";
    externalLink.rel = "noopener noreferrer";

    preview.append(
      stage,
      externalLink
    );

    interactivePanel.appendChild(preview);

  } else {

    interactivePanel.appendChild(
      makeElement(
        "p",
        "micro muted",
        "INTERACTIVE PREVIEW COMING SOON"
      )
    );

  }

  /* --------------------------------------------------------
     04. DESIGN GALLERY
  -------------------------------------------------------- */

  const galleryPanel = makeElement(
    "div",
    "website-view-panel"
  );

  galleryPanel.hidden = true;


  

  /* --------------------------------------------------------
    DESIGN GALLERY — SHARED IMAGE VIEW
  -------------------------------------------------------- */

  const designEntries = images.map((image, index) => ({
    image,
    index
  }));

  const designGallery = createStandardGallery(
    designEntries,
    {
      instruction: "EXPLORE THE DESIGNS",
      isActive: () => !galleryPanel.hidden
    }
  );

  galleryPanel.appendChild(designGallery.panel);

  const refreshDesignGallery = designGallery.refresh;



  /* --------------------------------------------------------
     05. DEVICE SWITCH
  -------------------------------------------------------- */

  function switchDevice(mode) {

    const isMobile = mode === "mobile";

    if (stage) {
      stage.classList.toggle(
        "mobile",
        isMobile
      );
    }

    desktopButton.classList.toggle(
      "active",
      !isMobile
    );

    mobileButton.classList.toggle(
      "active",
      isMobile
    );

    desktopButton.setAttribute(
      "aria-pressed",
      String(!isMobile)
    );

    mobileButton.setAttribute(
      "aria-pressed",
      String(isMobile)
    );

  }

  desktopButton.addEventListener("click", () => {
    switchDevice("desktop");
  });

  mobileButton.addEventListener("click", () => {
    switchDevice("mobile");
  });

  /* --------------------------------------------------------
     06. LIVE / GALLERY SWITCH
  -------------------------------------------------------- */

  function switchView(mode) {

    const isInteractive = mode === "interactive";

    interactivePanel.hidden = !isInteractive;
    galleryPanel.hidden = isInteractive;

    interactiveButton.classList.toggle(
      "active",
      isInteractive
    );

    galleryButton.classList.toggle(
      "active",
      !isInteractive
    );

    interactiveButton.setAttribute(
      "aria-pressed",
      String(isInteractive)
    );

    galleryButton.setAttribute(
      "aria-pressed",
      String(!isInteractive)
    );

    deviceControls.hidden =
      !isInteractive || !hasLiveWebsite;
    
    const imageInformation = container.querySelector(
      ".work-image-information"
    );

    if (imageInformation) {
      imageInformation.hidden = isInteractive;
    }

    
    if (!isInteractive) {
      refreshDesignGallery();
    }

  }

  interactiveButton.addEventListener(
    "click",
    () => switchView("interactive")
  );

  galleryButton.addEventListener(
    "click",
    () => switchView("gallery")
  );

  /* --------------------------------------------------------
     07. INITIALIZE
  -------------------------------------------------------- */

  switchDevice("desktop");

  switchView(
    hasLiveWebsite ? "interactive" : "gallery"
  );

  experience.append(
    heading,
    toolbar,
    interactivePanel,
    galleryPanel
  );

  container.appendChild(experience);

}


/* ==========================================================
   07. UI/UX — CINEMATIC SCREEN SPOTLIGHT

   Horizontal screen sequence
   Natural-height LUMEN introduction
   Scrollable long screenshots
   Fullscreen image viewing
   Keyboard navigation
========================================================== */

function renderUIUX(images, container) {

  if (!images.length) return;

  const gallery = makeElement(
    "div",
    "work-uiux"
  );

  const stage = makeElement(
    "div",
    "uiux-spotlight"
  );

  const projectId = getProjectId();

  let current = 0;

  
  /* --------------------------------------------------------
     01. HORIZONTAL PREVIEW RAILS
  -------------------------------------------------------- */

  const leftRail = makeElement(
    "div",
    "uiux-preview-rail uiux-preview-rail-left"
  );

  const rightRail = makeElement(
    "div",
    "uiux-preview-rail uiux-preview-rail-right"
  );

  function createRailPreview(image, index) {

    const button = makeElement(
      "button",
      "uiux-preview"
    );

    button.type = "button";

    button.setAttribute(
      "aria-label",
      `Go to screen ${pad(index + 1)}: ${image.label}`
    );

    const img = document.createElement("img");

    img.src = image.src;
    img.alt = image.label;
    img.loading = "lazy";
    img.decoding = "async";
    img.draggable = false;

    button.appendChild(img);

    button.addEventListener("click", () => {
      goTo(index);
    });

    return button;

  }

  function renderPreviewRails() {

    leftRail.replaceChildren();
    rightRail.replaceChildren();

    images.forEach((image, index) => {

      if (index === current) return;

      const preview = createRailPreview(
        image,
        index
      );

      if (index < current) {
        leftRail.appendChild(preview);
      } else {
        rightRail.appendChild(preview);
      }

    });

    leftRail.classList.toggle(
      "is-empty",
      current === 0
    );

    rightRail.classList.toggle(
      "is-empty",
      current === images.length - 1
    );

    // Position the nearest previous screen
    // directly beside the main screen.

    leftRail.scrollLeft =
      leftRail.scrollWidth;

    rightRail.scrollLeft = 0;

  }

  /* --------------------------------------------------------
     03. MAIN SCREEN
  -------------------------------------------------------- */

  const main = makeElement(
    "div",
    "uiux-main"
  );

  const mainVisual = makeElement(
    "div",
    "uiux-main-visual"
  );

  mainVisual.tabIndex = 0;

  mainVisual.setAttribute(
    "role",
    "region"
  );

  mainVisual.setAttribute(
    "aria-label",
    "Application screen preview"
  );

  const mainButton = makeElement(
    "button",
    "work-image-button uiux-main-button"
  );

  mainButton.type = "button";

  const mainImage = document.createElement("img");

  mainImage.alt = "";
  mainImage.draggable = false;
  mainImage.decoding = "async";

  mainButton.appendChild(mainImage);
  mainVisual.appendChild(mainButton);
  main.appendChild(mainVisual);

  stage.append(
    leftRail,
    main,
    rightRail
  );

  /* --------------------------------------------------------
     04. CAPTION AND CONTROLS
  -------------------------------------------------------- */

  const details = makeElement(
    "div",
    "uiux-spotlight-details"
  );

  const copy = makeElement(
    "div",
    "uiux-spotlight-copy"
  );

  const eyebrow = makeElement(
    "span",
    "micro uiux-spotlight-eyebrow"
  );

  const heading = makeElement(
    "h3",
    "uiux-spotlight-title"
  );

  const description = makeElement(
    "p",
    "uiux-spotlight-description"
  );

  copy.append(
    eyebrow,
    heading,
    description
  );

  const controls = makeElement(
    "div",
    "uiux-controls"
  );

  const counter = makeElement(
    "span",
    "micro"
  );

  const instruction = makeElement(
    "span",
    "micro muted",
    "EXPLORE THE INTERFACE"
  );

  const arrows = makeElement(
    "div",
    "uiux-arrows"
  );

  const prev = makeElement(
    "button",
    "",
    "←"
  );

  const next = makeElement(
    "button",
    "",
    "→"
  );

  prev.type = "button";
  next.type = "button";

  prev.setAttribute(
    "aria-label",
    "Previous screen"
  );

  next.setAttribute(
    "aria-label",
    "Next screen"
  );

  arrows.append(prev, next);
  controls.append(counter, instruction, arrows);

  details.append(copy, controls);

  const progress = makeElement(
    "div",
    "uiux-progress"
  );

  const fill = makeElement(
    "div",
    "uiux-progress-fill"
  );

  progress.appendChild(fill);

  gallery.append(
    stage,
    details,
    progress
  );

  container.appendChild(gallery);

  /* --------------------------------------------------------
     05. RENDER ACTIVE SCREEN
  -------------------------------------------------------- */

  function renderScreen() {

    const active = images[current];

    // Preserve the intro-screen behavior.
    // Only LUMEN's first image uses natural height.

    const isIntroScreen =
      projectId === "lumen" &&
      current === 0;

    mainVisual.classList.toggle(
      "is-intro-screen",
      isIntroScreen
    );

    mainVisual.scrollTop = 0;

    mainImage.src = active.src;
    mainImage.alt = active.label;

    mainButton.setAttribute(
      "aria-label",
      `View ${active.label} fullscreen`
    );

    mainButton.onclick = () => {
      openLightbox(current);
    };

    renderPreviewRails();

    const story = active;

    eyebrow.textContent =
      `${pad(current + 1)} / ${pad(images.length)} — THE INTERFACE`;

    heading.textContent =
      story.label;

    description.textContent =
      story.description || "";

    description.hidden =
      !description.textContent;

    counter.textContent =
      `${pad(current + 1)} / ${pad(images.length)}`;

    prev.disabled = current === 0;

    next.disabled =
      current === images.length - 1;

    fill.style.width =
      `${((current + 1) / images.length) * 100}%`;

  }

  /* --------------------------------------------------------
     06. NAVIGATION
  -------------------------------------------------------- */


  function goTo(index) {

    if (
      index < 0 ||
      index >= images.length ||
      index === current
    ) {
      return;
    }

    current = index;

    renderScreen();

    // Synchronize the image information below.

    window.dispatchEvent(
      new CustomEvent("work:image-change", {
        detail: { index: current }
      })
    );

  }


  prev.addEventListener("click", () => {
    goTo(current - 1);
  });

  next.addEventListener("click", () => {
    goTo(current + 1);
  });

  registerGalleryKeyboard(
    gallery,
    direction => goTo(current + direction)
  );

  /* --------------------------------------------------------
     07. INITIAL DISPLAY

     Keep this call: without it, the gallery
     opens as an empty rectangle.
  -------------------------------------------------------- */

  renderScreen();

}


/* ==========================================================
   PHOTOGRAPHY — MINIMAL IMAGE GALLERY
========================================================== */

function renderPhotography(images, container) {

  if (!images.length) return;

  const gallery = makeElement(
    "div",
    "work-photography-grid"
  );

  images.forEach((image, index) => {

    const item = makeElement(
      "figure",
      "work-photography-item"
    );

    const button = makeImageButton(
      image,
      index,
      "work-photography-button"
    );

    item.appendChild(button);

    gallery.appendChild(item);

  });

  container.appendChild(gallery);

}

/* ==========================================================
   POSTERS — CIRCULAR FEATURED GALLERY
========================================================== */

function renderPosters(images, container) {

  if (!images.length) return;

  const gallery = makeElement(
    "section",
    "work-poster-carousel"
  );

  const stage = makeElement(
    "div",
    "poster-carousel-stage"
  );

  const slots = [-1, 0, 1].map(offset => {

    const slot = makeElement(
      "div",
      `poster-carousel-slot ${
        offset === 0 ? "is-center" : "is-side"
      }`
    );

    const button = makeElement(
      "button",
      "poster-carousel-image"
    );

    button.type = "button";

    const image = document.createElement("img");

    image.decoding = "async";
    image.draggable = false;

    button.appendChild(image);
    slot.appendChild(button);
    stage.appendChild(slot);

    return { offset, slot, button, image };

  });

  const details = makeElement(
    "div",
    "poster-carousel-details"
  );

  const caption = makeElement(
    "span",
    "micro"
  );

  const counter = makeElement(
    "span",
    "micro"
  );

  details.append(caption, counter);

  const controls = makeElement(
    "div",
    "poster-carousel-controls"
  );

  const previous = makeElement(
    "button",
    "",
    "←"
  );

  const next = makeElement(
    "button",
    "",
    "→"
  );

  previous.type = "button";
  next.type = "button";

  previous.setAttribute(
    "aria-label",
    "Previous poster"
  );

  next.setAttribute(
    "aria-label",
    "Next poster"
  );

  const instruction = makeElement(
    "span",
    "micro muted",
    "EXPLORE THE POSTERS"
  );

  
  
  const arrows = makeElement(
    "div",
    "poster-carousel-arrows"
  );

  arrows.append(previous, next);

  controls.append(
    counter,
    instruction,
    arrows
  );


  const progress = makeElement(
    "div",
    "poster-carousel-progress"
  );

  const progressFill = makeElement(
    "div",
    "poster-carousel-progress-fill"
  );

  progress.appendChild(progressFill);


  
  gallery.append(
    stage,
    controls,
    progress
  );


  container.appendChild(gallery);

  let current = 0;
  let busy = false;

  function wrap(index) {
    return (
      (index % images.length) + images.length
    ) % images.length;
  }

  function render() {

    slots.forEach(({ offset, slot, button, image }) => {

      const index = wrap(current + offset);
      const poster = images[index];

      // One poster should not appear three times.
      const duplicate =
        images.length === 1 && offset !== 0;

      slot.hidden = duplicate;

      if (duplicate) return;

      image.src = poster.src;
      image.alt = poster.label;

      image.loading =
        offset === 0 ? "eager" : "lazy";

      button.setAttribute(
        "aria-label",
        offset === 0
          ? `View ${poster.label} fullscreen`
          : `Select ${poster.label}`
      );

      button.onclick = () => {

        if (busy) return;

        if (offset === 0) {
          openLightbox(current);
        } else {
          navigate(offset);
        }

      };

    });

    caption.textContent = images[current].label;

    counter.textContent =
      `${pad(current + 1)} / ${pad(images.length)}`;

    // Keep the image information synchronized.
    window.dispatchEvent(
      new CustomEvent("work:image-change", {
        detail: { index: current }
      })
    );

    progressFill.style.width =
      `${((current + 1) / images.length) * 100}%`;


    previous.disabled = images.length < 2;
    next.disabled = images.length < 2;

  }

   /* --------------------------------------------------------
     POSTER CAROUSEL — CONTINUOUS MOVEMENT
  -------------------------------------------------------- */

  async function navigate(direction) {

    if (busy || images.length < 2) return;

    busy = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const nextIndex = wrap(current + direction);

    // Load the upcoming posters before moving anything.
    const upcomingIndexes = [
      nextIndex - 1,
      nextIndex,
      nextIndex + 1
    ];

    await Promise.all(
      upcomingIndexes.map(index => {

        const source = images[wrap(index)].src;
        const preload = new Image();

        preload.src = source;

        return preload.decode().catch(() => {});

      })
    );

    if (reducedMotion) {

      current = nextIndex;
      render();

      busy = false;
      return;

    }

    const duration = 620;
    const easing = "cubic-bezier(.22, 1, .36, 1)";

    const stageRect = stage.getBoundingClientRect();

    const overlay = document.createElement("div");

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "9999",
      pointerEvents: "none",
      overflow: "hidden",

      // Keep moving posters inside the gallery boundaries.
      clipPath: `inset(
        ${Math.max(0, stageRect.top)}px
        ${Math.max(0, window.innerWidth - stageRect.right)}px
        ${Math.max(0, window.innerHeight - stageRect.bottom)}px
        ${Math.max(0, stageRect.left)}px
      )`
    });

    document.body.appendChild(overlay);

    const animations = [];

    // Measure where each image should sit in a given slot.
    function getTargetRect(posterIndex, slotIndex) {

      const slot = slots[slotIndex].slot;
      const slotRect = slot.getBoundingClientRect();

      const referenceImage = slots[slotIndex].image;
      const maxHeightValue =
        getComputedStyle(referenceImage).maxHeight;

      const maxHeight = parseFloat(maxHeightValue);

      const poster = images[wrap(posterIndex)];

      const loaded = new Image();
      loaded.src = poster.src;

      const naturalWidth = loaded.naturalWidth || 1;
      const naturalHeight = loaded.naturalHeight || 1;

      const ratio = naturalWidth / naturalHeight;

      const heightLimit = Number.isFinite(maxHeight)
        ? maxHeight
        : window.innerHeight;

      const width = Math.min(
        naturalWidth,
        slotRect.width,
        heightLimit * ratio
      );

      const height = width / ratio;

      return {
        left: slotRect.left + (slotRect.width - width) / 2,
        top: slotRect.top + (slotRect.height - height) / 2,
        width,
        height
      };

    }

    function animatePoster(
      posterIndex,
      fromRect,
      toRect,
      fromOpacity = 1,
      toOpacity = 1
    ) {

      const poster = images[wrap(posterIndex)];

      const image = document.createElement("img");

      image.src = poster.src;
      image.alt = poster.label || "";

      Object.assign(image.style, {
        position: "fixed",
        left: `${fromRect.left}px`,
        top: `${fromRect.top}px`,
        width: `${fromRect.width}px`,
        height: `${fromRect.height}px`,
        maxWidth: "none",
        maxHeight: "none",
        objectFit: "contain",
        pointerEvents: "none",
        margin: "0",
        opacity: String(fromOpacity)
      });

      overlay.appendChild(image);

      animations.push(
        image.animate(
          [
            {
              left: `${fromRect.left}px`,
              top: `${fromRect.top}px`,
              width: `${fromRect.width}px`,
              height: `${fromRect.height}px`,
              opacity: fromOpacity
            },
            {
              left: `${toRect.left}px`,
              top: `${toRect.top}px`,
              width: `${toRect.width}px`,
              height: `${toRect.height}px`,
              opacity: toOpacity
            }
          ],
          {
            duration,
            easing,
            fill: "forwards"
          }
        )
      );

    }

    const leftImage = slots[0].image;
    const centerImage = slots[1].image;
    const rightImage = slots[2].image;

    const leftRect = leftImage.getBoundingClientRect();
    const centerRect = centerImage.getBoundingClientRect();
    const rightRect = rightImage.getBoundingClientRect();

    try {

      if (direction > 0) {

        // LEFT: Outgoing poster moves beyond the boundary.
        animatePoster(
          current - 1,
          leftRect,
          {
            ...leftRect,
            left: stageRect.left - leftRect.width - 30
          },
          0.4,
          0.4
        );

        // CENTRE → LEFT: Shrinks and darkens.
        animatePoster(
          current,
          centerRect,
          getTargetRect(current, 0),
          1,
          0.4
        );

        // RIGHT → CENTRE: Enlarges and brightens.
        animatePoster(
          current + 1,
          rightRect,
          getTargetRect(current + 1, 1),
          0.4,
          1
        );

        // NEW RIGHT: Enters at the correct side opacity.
        const incoming = getTargetRect(current + 2, 2);

        animatePoster(
          current + 2,
          {
            ...incoming,
            left: stageRect.right + 30
          },
          incoming,
          0.4,
          0.4
        );

      } else {

        // RIGHT: Outgoing poster moves beyond the boundary.
        animatePoster(
          current + 1,
          rightRect,
          {
            ...rightRect,
            left: stageRect.right + 30
          },
          0.4,
          0.4
        );

        // CENTRE → RIGHT: Shrinks and darkens.
        animatePoster(
          current,
          centerRect,
          getTargetRect(current, 2),
          1,
          0.4
        );

        // LEFT → CENTRE: Enlarges and brightens.
        animatePoster(
          current - 1,
          leftRect,
          getTargetRect(current - 1, 1),
          0.4,
          1
        );

        // NEW LEFT: Enters at the correct side opacity.
        const incoming = getTargetRect(current - 2, 0);

        animatePoster(
          current - 2,
          {
            ...incoming,
            left: stageRect.left - incoming.width - 30
          },
          incoming,
          0.4,
          0.4
        );

      }

      // Hide the static images while the four moving images
      // occupy their positions.
      stage.style.visibility = "hidden";

      await Promise.all(
        animations.map(animation =>
          animation.finished.catch(() => {})
        )
      );

    } finally {

      // Update the actual carousel once movement finishes.
      current = nextIndex;
      render();

      // Restore the gallery and remove the moving images.
      stage.style.visibility = "";
      overlay.remove();

      busy = false;

    }

  }

  previous.addEventListener(
    "click",
    () => navigate(-1)
  );

  next.addEventListener(
    "click",
    () => navigate(1)
  );

  registerGalleryKeyboard(
    gallery,
    direction => navigate(direction)
  );

  render();

}

/* ==========================================================
   08. DEFAULT — STANDARD IMAGE GALLERY
========================================================== */

function renderDefault(images, container) {

  const grid = makeElement(
    "div",
    "work-default-grid"
  );

  images.forEach((image, index) => {

    const item = makeElement(
      "div",
      "work-default-item"
    );

    const visual = makeElement(
      "div",
      "work-default-image"
    );

    visual.appendChild(
      makeImageButton(image, index)
    );

    item.append(
      visual,
      makeImageLabel(
        image,
        index,
        images.length
      )
    );

    grid.appendChild(item);

  });

  container.appendChild(grid);

}



/* ==========================================================
   SHARED IMAGE INFORMATION
========================================================== */

function renderImageInformation(images, container) {

  if (!images.length) return;

  const section = makeElement(
    "section",
    "work-image-information"
  );

  const number = makeElement(
    "span",
    "work-image-information-number"
  );

  const title = makeElement(
    "h2",
    "work-image-information-title"
  );

  const description = makeElement(
    "p",
    "work-image-information-description"
  );

  const creditRow = makeElement(
    "div",
    "work-image-information-credit-row"
  );

  const creditLabel = makeElement(
    "span",
    "work-image-information-key",
    "IMAGE CREDITS"
  );

  const creditList = makeElement(
    "div",
    "work-image-information-credits"
  );

  creditRow.append(creditLabel, creditList);

  section.append(
    number,
    title,
    description,
    creditRow
  );

  function updateInformation(index) {

    if (index < 0 || index >= images.length) return;

    const image = images[index];

    number.textContent =
      `${pad(index + 1)} / ${pad(images.length)} — IMAGE INFORMATION`;

    title.textContent =
      image.label || `IMAGE ${pad(index + 1)}`;

    description.textContent =
      image.description || "";

    description.hidden = !image.description;

    creditList.replaceChildren();

    (image.credits || []).forEach(credit => {

      if (typeof credit === "string") {

        creditList.appendChild(
          makeElement("span", "", credit)
        );

        return;
      }

      if (!credit || !credit.name) return;

      const creditText = [
        credit.name,
        credit.source
      ].filter(Boolean).join(" / ");

      const item = makeElement(
        credit.url ? "a" : "span",
        "",
        creditText
      );

      if (credit.url) {
        item.href = credit.url;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      }

      creditList.appendChild(item);

    });

    creditRow.hidden =
      !creditList.childElementCount;

  }

  // Follow the existing gallery's active image.

  window.addEventListener(
    "work:image-change",
    event => {
      updateInformation(event.detail.index);
    }
  );

  // Display the first image when the page loads.

  updateInformation(0);

  container.appendChild(section);

}



/* ==========================================================
   09. PROJECT RENDERER
========================================================== */

function renderWork() {

  const project = findProject();

  if (!project) {

    document.title =
      "Project Not Found — Lou Reyes";

    $("workTitle").textContent =
      "NOT FOUND.";

    $("workHeroDescription").textContent =
      "This project could not be found.";

    $("workPresentation").textContent = "";

    $("workNextTitle").textContent =
      "THE ARCHIVE";

    $("workNext").href =
      "archive.html";

    return;

  }

  workState.project = project;

  workState.images = normalizeImages(
    project.images
  );

  document.body.classList.toggle(
    "work-is-photography",
    project.layout === "photography" ||
    project.category === "photography"
  );

  const category = getCategoryTitle(
    project.category
  );

  /* --------------------------------------------------------
     PRESENTATION LABELS
  -------------------------------------------------------- */

  const presentationLabels = {

    editorial: [
      "THE PUBLICATION",
      "AN INTERACTIVE EDITORIAL ARCHIVE"
    ],

    packaging: [
      "THE PACKAGING",
      "MOCKUPS & DESIGN DETAILS"
    ],

    website: [
      "THE WEBSITE",
      "A DIGITAL EXPERIENCE"
    ],

    uiux: [
      "THE INTERFACE",
      "SCREENS & INTERACTIONS"
    ],

    default: [
      "THE WORK",
      "A VISUAL EXPLORATION"
    ]

  };

  const presentationLabel =
    presentationLabels[project.layout] ||
    presentationLabels.default;

  const labelElement = $(
    "workPresentationLabel"
  );

  const detailElement = $(
    "workPresentationDetail"
  );

  if (labelElement) {

    labelElement.textContent =
      presentationLabel[0];

  }

  if (detailElement) {

    detailElement.textContent =
      presentationLabel[1];

  }

  /* --------------------------------------------------------
     PAGE CONTENT
  -------------------------------------------------------- */

  document.title =
    `${project.title} — Lou Reyes`;

  $("pageDescription").content =
    project.description || "";

  $("workHeroImage").src =
    project.image;

  $("workHeroImage").alt =
    `${project.title} artwork`;

  $("workEyebrow").textContent =
    `${category.toUpperCase()} / ${project.type.toUpperCase()}`;

  $("workTitle").textContent =
    project.title;

  $("workHeroDescription").textContent =
    project.description || project.type;

  $("workHeroYear").textContent =
    project.year || "";

  $("workBack").href =
    `collection.html?category=${encodeURIComponent(project.category)}`;

  /* --------------------------------------------------------
     PROJECT-SPECIFIC PRESENTATION
  -------------------------------------------------------- */

  const container = $("workPresentation");

  container.replaceChildren();

  if (!workState.images.length) {

    container.appendChild(
      makeElement(
        "p",
        "micro muted",
        "IMAGES COMING SOON"
      )
    );

  } else {

    
    switch (project.layout) {

      case "editorial":
        renderEditorial(workState.images, container);
        break;

      case "packaging":
        renderPackaging(workState.images, container);
        break;

      case "identity":
        renderIdentity(workState.images, container);
        break;

      case "website":
        renderWebsite(workState.images, container, project);
        break;

      case "uiux":
        renderUIUX(workState.images, container);
        break;

      case "photography":
        renderPhotography(workState.images, container);
        break;

      case "poster":
      case "posters":
        renderPosters(workState.images, container);
        break;

      default:

        if (project.category === "photography") {

          renderPhotography(workState.images, container);

        } else if (
          ["poster", "posters"].includes(
            String(project.category).toLowerCase()
          ) ||
          ["poster", "posters"].includes(
            String(project.type).toLowerCase()
          )
        ) {

          renderPosters(workState.images, container);

        } else {

          renderDefault(workState.images, container);

        }

        break;

    }


  }

    const isPhotography =
    String(project.layout).toLowerCase() === "photography" ||
    String(project.category).toLowerCase() === "photography";

  if (!isPhotography) {

    renderImageInformation(
      workState.images,
      container
    );

  }

  renderNextProject(project);

}


/* ==========================================================
   10. NEXT PROJECT
========================================================== */

function renderNextProject(project) {

  const sameCategory = PROJECTS.filter(
    item => item.category === project.category
  );

  const index = sameCategory.findIndex(
    item => item.id === project.id
  );

  if (sameCategory.length <= 1) {

    $("workNextTitle").textContent =
      "THE ARCHIVE";

    $("workNextCategory").textContent =
      "EXPLORE ALL COLLECTIONS";

    $("workNext").href =
      "archive.html";

    return;

  }

  const next =
    sameCategory[
      (index + 1) % sameCategory.length
    ];

  $("workNextTitle").textContent =
    next.title;

  $("workNextCategory").textContent =
    getCategoryTitle(
      next.category
    ).toUpperCase();

  $("workNext").href =
    `work.html?project=${encodeURIComponent(next.id)}`;

}


/* ==========================================================
   11. FULLSCREEN IMAGE VIEWER
========================================================== */

function updateLightboxTransform() {

  $("lightboxImage").style.transform =
    `translate(${workState.panX}px, ${workState.panY}px) scale(${workState.zoom})`;

  $("lightboxZoomLevel").textContent =
    `${Math.round(workState.zoom * 100)}%`;

  $("lightboxStage").classList.toggle(
    "zoomed",
    workState.zoom > 1
  );

}

function resetLightboxZoom() {

  workState.zoom = 1;
  workState.panX = 0;
  workState.panY = 0;

  updateLightboxTransform();

}

function showLightboxImage(index) {

  const images = workState.images;

  if (!images.length) return;

  workState.lightboxIndex =
    (index + images.length) % images.length;

  const image =
    images[workState.lightboxIndex];

  $("lightboxImage").src = image.src;
  $("lightboxImage").alt = image.label;

  $("lightboxTitle").textContent =
    `${workState.project.title.toUpperCase()} / ${image.label}`;

  $("lightboxCounter").textContent =
    `${pad(workState.lightboxIndex + 1)} / ${pad(images.length)}`;

  resetLightboxZoom();

}

function openLightbox(index) {

  const lightbox = $("workLightbox");

  workState.lastFocus =
    document.activeElement;

  showLightboxImage(index);

  lightbox.inert = false;

  lightbox.classList.add("open");

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "work-lightbox-open"
  );

  $("lightboxClose").focus();

}

function closeLightbox() {

  const lightbox = $("workLightbox");

  if (!lightbox.classList.contains("open")) {
    return;
  }

  lightbox.classList.remove("open");

  lightbox.inert = true;

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "work-lightbox-open"
  );

  resetLightboxZoom();

  if (
    workState.lastFocus &&
    workState.lastFocus.isConnected
  ) {

    workState.lastFocus.focus();

  }

}

function changeLightboxZoom(amount) {

  workState.zoom = Math.max(
    1,
    Math.min(
      4,
      workState.zoom + amount
    )
  );

  if (workState.zoom === 1) {

    workState.panX = 0;
    workState.panY = 0;

  }

  updateLightboxTransform();

}

function initializeLightbox() {

  $("lightboxClose").addEventListener(
    "click",
    closeLightbox
  );

  $("lightboxPrev").addEventListener(
    "click",
    () => {
      showLightboxImage(
        workState.lightboxIndex - 1
      );
    }
  );

  $("lightboxNext").addEventListener(
    "click",
    () => {
      showLightboxImage(
        workState.lightboxIndex + 1
      );
    }
  );

  $("lightboxZoomIn").addEventListener(
    "click",
    () => changeLightboxZoom(.25)
  );

  $("lightboxZoomOut").addEventListener(
    "click",
    () => changeLightboxZoom(-.25)
  );

  $("lightboxZoomReset").addEventListener(
    "click",
    resetLightboxZoom
  );

  /* --------------------------------------------------------
     LIGHTBOX KEYBOARD
  -------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    event => {

      if (
        !$("workLightbox").classList.contains("open")
      ) {
        return;
      }

      if (event.key === "Escape") {

        event.preventDefault();
        closeLightbox();

      }

      if (event.key === "ArrowLeft") {

        event.preventDefault();

        showLightboxImage(
          workState.lightboxIndex - 1
        );

      }

      if (event.key === "ArrowRight") {

        event.preventDefault();

        showLightboxImage(
          workState.lightboxIndex + 1
        );

      }

      if (
        event.key === "+" ||
        event.key === "="
      ) {

        event.preventDefault();
        changeLightboxZoom(.25);

      }

      if (event.key === "-") {

        event.preventDefault();
        changeLightboxZoom(-.25);

      }

      if (event.key === "Tab") {

        const focusable = [
          ...$("workLightbox").querySelectorAll(
            "button"
          )
        ].filter(button => !button.disabled);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[
          focusable.length - 1
        ];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {

          event.preventDefault();
          last.focus();

        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {

          event.preventDefault();
          first.focus();

        }

      }

    }
  );

  /* --------------------------------------------------------
     LIGHTBOX DRAGGING
  -------------------------------------------------------- */

  const stage = $("lightboxStage");

  let drag = null;

  stage.addEventListener(
    "pointerdown",
    event => {

      if (workState.zoom <= 1) return;

      drag = {
        x: event.clientX,
        y: event.clientY,
        panX: workState.panX,
        panY: workState.panY
      };

      stage.setPointerCapture(
        event.pointerId
      );

      stage.classList.add("dragging");

    }
  );

  stage.addEventListener(
    "pointermove",
    event => {

      if (!drag) return;

      workState.panX =
        drag.panX + event.clientX - drag.x;

      workState.panY =
        drag.panY + event.clientY - drag.y;

      updateLightboxTransform();

    }
  );

  function stopDrag() {

    drag = null;

    stage.classList.remove(
      "dragging"
    );

  }

  stage.addEventListener(
    "pointerup",
    stopDrag
  );

  stage.addEventListener(
    "pointercancel",
    stopDrag
  );

  /* --------------------------------------------------------
     LIGHTBOX WHEEL ZOOM
  -------------------------------------------------------- */

  stage.addEventListener(
    "wheel",
    event => {

      if (
        !$("workLightbox").classList.contains("open")
      ) {
        return;
      }

      event.preventDefault();

      changeLightboxZoom(
        event.deltaY < 0 ? .25 : -.25
      );

    },
    { passive: false }
  );

}


/* ==========================================================
   12. THEME
========================================================== */

function initializeTheme() {

  const light = $("lightTheme");
  const dark = $("darkTheme");

  function applyTheme(theme) {

    const next =
      theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme =
      next;

    localStorage.setItem(
      "lou-reyes-theme",
      next
    );

    light.classList.toggle(
      "active",
      next === "light"
    );

    dark.classList.toggle(
      "active",
      next === "dark"
    );

    $("themeColor").content =
      next === "light"
        ? "#e9e7e1"
        : "#111111";

  }

  light.addEventListener(
    "click",
    () => applyTheme("light")
  );

  dark.addEventListener(
    "click",
    () => applyTheme("dark")
  );

  applyTheme(
    document.documentElement.dataset.theme
  );

}


/* ==========================================================
   13. FULLSCREEN NAVIGATION
========================================================== */

function initializeMenu() {

  const button = $("menuButton");
  const menu = $("menuScreen");
  const label = $("menuLabel");

  function setMenu(open) {

    menu.classList.toggle(
      "open",
      open
    );

    button.classList.toggle(
      "active",
      open
    );

    button.setAttribute(
      "aria-expanded",
      String(open)
    );

    button.setAttribute(
      "aria-label",
      open
        ? "Close navigation"
        : "Open navigation"
    );

    menu.setAttribute(
      "aria-hidden",
      String(!open)
    );

    menu.inert = !open;

    if (label) {

      label.textContent =
        open ? "CLOSE" : "MENU";

    }

    document.body.classList.toggle(
      "menu-open",
      open
    );

  }

  button.addEventListener(
    "click",
    () => {
      setMenu(
        !menu.classList.contains("open")
      );
    }
  );

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        menu.classList.contains("open")
      ) {

        setMenu(false);
        button.focus();

      }

    }
  );

  menu.querySelectorAll("a").forEach(link => {

    link.addEventListener(
      "click",
      () => setMenu(false)
    );

  });

}


/* ==========================================================
   14. INITIALIZATION
========================================================== */

function initializeWorkPage() {

  initializeTheme();
  initializeMenu();
  initializeLightbox();

  if (
    typeof PROJECTS === "undefined" ||
    typeof CATEGORIES === "undefined"
  ) {

    console.error(
      "Portfolio data could not be loaded."
    );

    $("workTitle").textContent =
      "DATA UNAVAILABLE.";

    document.documentElement.classList.add(
      "work-ready"
    );

    return;

  }

  renderWork();

  const heroImage = $("workHeroImage");

  function revealWorkPage() {

    document.documentElement.classList.add(
      "work-ready"
    );

  }

  if (
    !heroImage ||
    !heroImage.getAttribute("src")
  ) {

    revealWorkPage();
    return;

  }

  if (heroImage.complete) {

    revealWorkPage();

  } else {

    heroImage.addEventListener(
      "load",
      revealWorkPage,
      { once: true }
    );

    heroImage.addEventListener(
      "error",
      revealWorkPage,
      { once: true }
    );

  }

}

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initializeWorkPage
  );

} else {

  initializeWorkPage();

}
