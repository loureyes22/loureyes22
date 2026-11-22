
/* ==========================================================
   CHAPTER & COFFEE
   CINEMATIC HOMEPAGE JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const siteHeader = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNavigation = document.getElementById("mobileNavigation");
    const currentYear = document.getElementById("currentYear");

    const mobileLinks = mobileNavigation
        ? mobileNavigation.querySelectorAll("a")
        : [];

    /* ======================================================
       COPYRIGHT
    ====================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* ======================================================
       STICKY HEADER
    ====================================================== */

    function updateHeader() {

        if (!siteHeader) return;

        siteHeader.classList.toggle(
            "scrolled",
            window.scrollY > 80
        );

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

    /* ======================================================
       MOBILE NAVIGATION
    ====================================================== */

    function setMenuState(isOpen) {

        if (!menuToggle || !mobileNavigation) return;

        menuToggle.classList.toggle("active", isOpen);
        mobileNavigation.classList.toggle("open", isOpen);
        document.body.classList.toggle("menu-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        mobileNavigation.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        mobileNavigation.inert = !isOpen;

    }

    if (menuToggle && mobileNavigation) {

        setMenuState(false);

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            setMenuState(!isOpen);

        });

        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {
                setMenuState(false);
            });

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {

                const isOpen =
                    menuToggle.getAttribute("aria-expanded") === "true";

                if (isOpen) {
                    setMenuState(false);
                    menuToggle.focus();
                }

            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 900) {
                setMenuState(false);
            }

        });

    }

    /* ======================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        !prefersReducedMotion &&
        "IntersectionObserver" in window
    ) {

        const observer = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }

    /* ======================================================
       INTERNAL ANCHOR LINKS
    ====================================================== */

    const anchorLinks =
        document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });

            if (
                mobileNavigation &&
                mobileNavigation.classList.contains("open")
            ) {
                setMenuState(false);
            }

        });

    });

});
