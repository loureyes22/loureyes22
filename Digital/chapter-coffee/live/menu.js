
/* ==========================================================
   CHAPTER & COFFEE
   CAFÉ MENU JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       MENU DATA
    ====================================================== */

    const menuData = {

        hot: {
            eyebrow: "THE EVERYDAY RITUAL",
            title: "Hot Coffee",
            description:
                "From bold espresso to velvety milk-based favorites, every cup is a reason to slow down.",

            image:
                "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=1200&q=85",

            imageAlt: "Fresh cappuccino with latte art",

            note:
                "Milk alternatives and additional espresso shots may be available upon request.",

            items: [
                {
                    name: "Espresso",
                    description: "A rich, concentrated shot of freshly brewed espresso.",
                    price: "$3.25"
                },
                {
                    name: "Americano",
                    description: "Smooth espresso gently lengthened with hot water.",
                    price: "$3.75"
                },
                {
                    name: "Cappuccino",
                    description: "Bold espresso, steamed milk, and a delicate layer of foam.",
                    price: "$4.75"
                },
                {
                    name: "Caffè Latte",
                    description: "Espresso balanced with silky steamed milk.",
                    price: "$4.95"
                },
                {
                    name: "Flat White",
                    description: "Double espresso with finely textured microfoam.",
                    price: "$4.95"
                },
                {
                    name: "Caffè Mocha",
                    description: "Espresso, chocolate, and steamed milk.",
                    price: "$5.45"
                }
            ]
        },

        iced: {
            eyebrow: "A COOLER KIND OF COMFORT",
            title: "Iced Coffee",
            description:
                "Refreshingly smooth coffee creations, perfect for slow afternoons and sunny reading corners.",

            image:
                "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=85",

            imageAlt: "Refreshing chilled specialty coffee",

            note:
                "Sweetness levels and milk preferences can be adjusted upon request.",

            items: [
                {
                    name: "Iced Americano",
                    description: "Bold espresso poured over chilled water and ice.",
                    price: "$4.25"
                },
                {
                    name: "Iced Latte",
                    description: "Espresso, cold milk, and ice.",
                    price: "$5.25"
                },
                {
                    name: "Iced Vanilla Latte",
                    description: "Chilled espresso and milk with a gentle touch of vanilla.",
                    price: "$5.75"
                },
                {
                    name: "Iced Caramel Macchiato",
                    description: "Layers of espresso, milk, vanilla, and caramel.",
                    price: "$5.95"
                },
                {
                    name: "Cold Brew",
                    description: "Slow-steeped coffee with a smooth, naturally rich finish.",
                    price: "$4.95"
                },
                {
                    name: "Iced Mocha",
                    description: "A refreshing combination of espresso, milk, and chocolate.",
                    price: "$5.95"
                }
            ]
        },

        tea: {
            eyebrow: "A QUIETER MOMENT",
            title: "Tea & Infusions",
            description:
                "Thoughtful blends and soothing infusions for moments that call for something gentler.",

            image:
                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=85",

            imageAlt: "Freshly brewed tea served in a cup",

            note:
                "Ask our team about caffeine-free selections and available milk options.",

            items: [
                {
                    name: "English Breakfast",
                    description: "A rich, full-bodied black tea with a classic finish.",
                    price: "$3.75"
                },
                {
                    name: "Earl Grey",
                    description: "Fragrant black tea delicately infused with bergamot.",
                    price: "$3.75"
                },
                {
                    name: "Jasmine Green Tea",
                    description: "Light green tea with delicate floral notes.",
                    price: "$3.95"
                },
                {
                    name: "Chamomile",
                    description: "A soothing herbal infusion with gentle floral character.",
                    price: "$3.75"
                },
                {
                    name: "Peppermint",
                    description: "A naturally refreshing, caffeine-free herbal tea.",
                    price: "$3.75"
                },
                {
                    name: "Chai Latte",
                    description: "Aromatic spiced tea blended with warm, creamy milk.",
                    price: "$5.25"
                }
            ]
        },

        noncoffee: {
            eyebrow: "SOMETHING FOR EVERYONE",
            title: "Beyond Coffee",
            description:
                "Comforting, colorful, and delicious drinks for every mood, with or without caffeine.",

            image:
                "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=1200&q=85",

            imageAlt: "Beautifully prepared café beverage",

            note:
                "Selected drinks can be served hot or iced.",

            items: [
                {
                    name: "Classic Hot Chocolate",
                    description: "Rich chocolate blended with warm, creamy milk.",
                    price: "$4.75"
                },
                {
                    name: "Matcha Latte",
                    description: "Smooth matcha whisked with your choice of milk.",
                    price: "$5.45"
                },
                {
                    name: "Iced Matcha Latte",
                    description: "Vibrant matcha, chilled milk, and ice.",
                    price: "$5.75"
                },
                {
                    name: "London Fog",
                    description: "Earl Grey tea, steamed milk, and delicate vanilla.",
                    price: "$5.25"
                },
                {
                    name: "Steamed Vanilla Milk",
                    description: "Warm, silky milk lightly sweetened with vanilla.",
                    price: "$3.95"
                },
                {
                    name: "Fresh Lemonade",
                    description: "A refreshing balance of citrus and sweetness.",
                    price: "$4.25"
                }
            ]
        },

        food: {
            eyebrow: "A LITTLE SOMETHING TO EAT",
            title: "Food & Pastries",
            description:
                "Fresh, comforting café favorites made for light lunches, coffee breaks, and everything in between.",

            image:
                "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=85",

            imageAlt: "Freshly baked golden pastries",

            note:
                "Please speak with our team about ingredients, allergens, and dietary preferences.",

            items: [
                {
                    name: "Butter Croissant",
                    description: "Golden, flaky, and wonderfully buttery.",
                    price: "$4.25"
                },
                {
                    name: "Chocolate Croissant",
                    description: "Delicate pastry with a rich chocolate center.",
                    price: "$4.75"
                },
                {
                    name: "Blueberry Muffin",
                    description: "Soft, golden muffin filled with blueberries.",
                    price: "$3.95"
                },
                {
                    name: "Grilled Cheese",
                    description: "Melted cheese between slices of toasted artisan bread.",
                    price: "$7.95"
                },
                {
                    name: "Chicken & Pesto Sandwich",
                    description: "Tender chicken, basil pesto, and fresh greens on artisan bread.",
                    price: "$9.95"
                },
                {
                    name: "Classic BLT",
                    description: "Crisp bacon, lettuce, and tomato on toasted bread.",
                    price: "$8.95"
                }
            ]
        }
    };

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const siteHeader = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNavigation = document.getElementById("mobileNavigation");
    const currentYear = document.getElementById("currentYear");

    const menuCategories = document.getElementById("menuCategories");
    const categoryImage = document.getElementById("categoryImage");
    const categoryEyebrow = document.getElementById("categoryEyebrow");
    const categoryTitle = document.getElementById("categoryTitle");
    const categoryDescription = document.getElementById("categoryDescription");
    const menuItemsList = document.getElementById("menuItemsList");
    const categoryNote = document.getElementById("categoryNote");

    const prefersReducedMotion = window.matchMedia(
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

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

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

        mobileNavigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => setMenuState(false));
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                setMenuState(false);
            }
        });
    }

    /* ======================================================
       MENU CATEGORY RENDERING
    ====================================================== */

    function renderMenu(categoryKey) {

        const category = menuData[categoryKey];

        if (!category || !menuItemsList) return;

        categoryEyebrow.textContent = category.eyebrow;
        categoryTitle.textContent = category.title;
        categoryDescription.textContent = category.description;
        categoryNote.textContent = category.note;

        if (categoryImage) {
            categoryImage.src = category.image;
            categoryImage.alt = category.imageAlt;
        }

        menuItemsList.replaceChildren();

        category.items.forEach(item => {

            const article = document.createElement("article");
            article.className = "cafe-menu-item";

            const details = document.createElement("div");

            const name = document.createElement("h4");
            name.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const price = document.createElement("strong");
            price.textContent = item.price;

            details.append(name, description);
            article.append(details, price);

            menuItemsList.appendChild(article);
        });
    }

    /* ======================================================
       CATEGORY INTERACTION
    ====================================================== */

    if (menuCategories) {

        const buttons =
            menuCategories.querySelectorAll(".menu-category-button");

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                const categoryKey = button.dataset.category;

                buttons.forEach(item => {

                    const isActive = item === button;

                    item.classList.toggle("active", isActive);
                    item.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });

                renderMenu(categoryKey);
            });
        });
    }

    /* ======================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements = document.querySelectorAll(".reveal");

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

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* ======================================================
       INITIALIZATION
    ====================================================== */

    renderMenu("hot");

});
