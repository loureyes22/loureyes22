
/* ==========================================================
   CHAPTER & COFFEE
   READING CLUB JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const siteHeader =
        document.getElementById("siteHeader");

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileNavigation =
        document.getElementById("mobileNavigation");

    const currentYear =
        document.getElementById("currentYear");

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    /* ======================================================
       COPYRIGHT YEAR
    ====================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* ======================================================
       HEADER SCROLL STATE
    ====================================================== */

    function updateHeader() {

        if (!siteHeader) return;

        siteHeader.classList.toggle(
            "scrolled",
            window.scrollY > 80
        );
    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();

    /* ======================================================
       MOBILE NAVIGATION
    ====================================================== */

    function setMenuState(isOpen) {

        if (!menuToggle || !mobileNavigation) return;

        menuToggle.classList.toggle(
            "active",
            isOpen
        );

        mobileNavigation.classList.toggle(
            "open",
            isOpen
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
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

        mobileNavigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => setMenuState(false)
                );

            });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 900) {
                setMenuState(false);
            }

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                setMenuState(false);
            }

        });
    }

    /* ======================================================
       LOYALTY POINTS CALCULATOR
    ====================================================== */

    const coffeeSpend =
        document.getElementById("coffeeSpend");

    const monthlyVisits =
        document.getElementById("monthlyVisits");

    const monthlyRentals =
        document.getElementById("monthlyRentals");

    const coffeeSpendValue =
        document.getElementById("coffeeSpendValue");

    const monthlyVisitsValue =
        document.getElementById("monthlyVisitsValue");

    const monthlyRentalsValue =
        document.getElementById("monthlyRentalsValue");

    const estimatedPoints =
        document.getElementById("estimatedPoints");

    const POINTS_PER_DOLLAR = 10;
    const POINTS_PER_RENTAL = 25;

    function updateCalculator() {

        if (
            !coffeeSpend ||
            !monthlyVisits ||
            !monthlyRentals ||
            !estimatedPoints
        ) return;

        const spend = Number(coffeeSpend.value);
        const visits = Number(monthlyVisits.value);
        const rentals = Number(monthlyRentals.value);

        const cafePoints =
            spend * visits * POINTS_PER_DOLLAR;

        const rentalPoints =
            rentals * POINTS_PER_RENTAL;

        const totalPoints =
            cafePoints + rentalPoints;

        coffeeSpendValue.textContent =
            `$${spend}`;

        monthlyVisitsValue.textContent =
            `${visits} ${visits === 1 ? "visit" : "visits"}`;

        monthlyRentalsValue.textContent =
            `${rentals} ${rentals === 1 ? "rental" : "rentals"}`;

        estimatedPoints.textContent =
            totalPoints.toLocaleString("en-CA");
    }

    [coffeeSpend, monthlyVisits, monthlyRentals]
        .forEach(input => {

            if (!input) return;

            input.addEventListener(
                "input",
                updateCalculator
            );
        });

    updateCalculator();

    /* ======================================================
       MEMBERSHIP PREVIEW FORM
    ====================================================== */

    const membershipForm =
        document.getElementById("membershipForm");

    const membershipFormStatus =
        document.getElementById("membershipFormStatus");

    if (membershipForm && membershipFormStatus) {

        membershipForm.addEventListener("submit", event => {

            event.preventDefault();

            membershipFormStatus.textContent = "";
            membershipFormStatus.classList.remove("error");

            const firstName =
                document.getElementById("memberFirstName");

            const lastName =
                document.getElementById("memberLastName");

            const email =
                document.getElementById("memberEmail");

            const consent =
                document.getElementById("memberConsent");

            if (
                !firstName.value.trim() ||
                !lastName.value.trim() ||
                !email.validity.valid ||
                !consent.checked
            ) {

                membershipFormStatus.textContent =
                    "Please complete all fields with a valid email address and confirm the demonstration notice.";

                membershipFormStatus.classList.add("error");

                return;
            }

            const displayName = firstName.value.trim();

            membershipFormStatus.textContent =
                `Welcome to the Reading Club preview, ${displayName}! This is a design demonstration; no account has been created and no information has been submitted.`;

            membershipForm.reset();
        });
    }

    /* ======================================================
       FAQ ACCORDION
    ====================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        item.addEventListener("toggle", () => {

            if (!item.open) return;

            faqItems.forEach(otherItem => {

                if (otherItem !== item) {
                    otherItem.open = false;
                }

            });
        });
    });

    /* ======================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

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
       SMOOTH INTERNAL ANCHORS
    ====================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (!targetId || targetId === "#") return;

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth",
                    block: "start"
                });

            });

        });

});
