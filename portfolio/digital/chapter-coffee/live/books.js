
/* ==========================================================
   CHAPTER & COFFEE
   BOOKS PAGE JAVASCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       BOOK COLLECTION DATA
    ====================================================== */

    const books = [
        {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            genre: "classics",
            category: "Classic Fiction",
            year: "1925",
            isbn: "9780743273565",
            synopsis: "Set amid the glamour and excess of the Jazz Age, The Great Gatsby follows the mysterious millionaire Jay Gatsby and his relentless pursuit of a dream embodied by Daisy Buchanan. Through the eyes of Nick Carraway, F. Scott Fitzgerald explores wealth, longing, illusion, and the elusive promise of the American Dream."
        },
        {
            id: 2,
            title: "Pride and Prejudice",
            author: "Jane Austen",
            genre: "romance",
            category: "Romance / Classics",
            year: "1813",
            isbn: "9780141439518",
            synopsis: "Elizabeth Bennet is intelligent, independent, and unwilling to settle for anything less than genuine affection. When she encounters the proud and reserved Mr. Darcy, their first impressions lead to misunderstandings, unexpected revelations, and a timeless exploration of love, class, family, and personal growth."
        },
        {
            id: 3,
            title: "1984",
            author: "George Orwell",
            genre: "classics",
            category: "Dystopian Fiction",
            year: "1949",
            isbn: "9780451524935",
            synopsis: "In a world governed by constant surveillance and absolute political control, Winston Smith quietly begins to question the reality imposed upon him. George Orwell's haunting dystopian novel examines the manipulation of truth, the fragility of freedom, and the power of independent thought."
        },
        {
            id: 4,
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            genre: "literary",
            category: "Literary Fiction",
            year: "1960",
            isbn: "9780061120084",
            synopsis: "Through the perspective of young Scout Finch, Harper Lee tells a powerful story of childhood, prejudice, courage, and moral responsibility in the American South. As Scout's father, Atticus Finch, defends a Black man unjustly accused of a crime, the novel explores the complexities of justice and empathy."
        },
        {
            id: 5,
            title: "The Picture of Dorian Gray",
            author: "Oscar Wilde",
            genre: "classics",
            category: "Gothic Fiction",
            year: "1890",
            isbn: "9780141439570",
            synopsis: "When the beautiful Dorian Gray wishes that a painted portrait might age in his place, his desire becomes a terrible reality. As Dorian pursues pleasure without consequence, Oscar Wilde unfolds a dark and elegant meditation on beauty, vanity, corruption, and the human soul."
        },
        {
            id: 6,
            title: "Jane Eyre",
            author: "Charlotte Brontë",
            genre: "romance",
            category: "Gothic Romance",
            year: "1847",
            isbn: "9780141441146",
            synopsis: "Orphaned and determined to shape her own destiny, Jane Eyre becomes a governess at the mysterious Thornfield Hall. There she encounters the enigmatic Edward Rochester and discovers secrets that challenge her understanding of love, independence, and personal integrity."
        },
        {
            id: 7,
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            genre: "fantasy",
            category: "Fantasy",
            year: "1937",
            isbn: "9780547928227",
            synopsis: "Bilbo Baggins enjoys the comforts of his peaceful home until a wizard and a company of dwarves invite him on an extraordinary adventure. Across mountains, forests, and dangerous lands, Bilbo discovers courage, friendship, and a world far greater than he ever imagined."
        },
        {
            id: 8,
            title: "Dune",
            author: "Frank Herbert",
            genre: "fantasy",
            category: "Science Fiction",
            year: "1965",
            isbn: "9780441172719",
            synopsis: "On the desert planet Arrakis, control of a rare and powerful substance determines the fate of an interstellar empire. Young Paul Atreides becomes entangled in a struggle involving political intrigue, ancient prophecy, ecological survival, and the dangerous weight of destiny."
        },
        {
            id: 9,
            title: "The Silent Patient",
            author: "Alex Michaelides",
            genre: "mystery",
            category: "Psychological Thriller",
            year: "2019",
            isbn: "9781250301697",
            synopsis: "After apparently murdering her husband, celebrated painter Alicia Berenson refuses to speak another word. Psychotherapist Theo Faber becomes determined to uncover the truth behind her silence, leading him into a psychological mystery filled with secrets, obsession, and unexpected revelations."
        },
        {
            id: 10,
            title: "Gone Girl",
            author: "Gillian Flynn",
            genre: "mystery",
            category: "Mystery / Thriller",
            year: "2012",
            isbn: "9780307588371",
            synopsis: "When Amy Dunne disappears on her fifth wedding anniversary, suspicion quickly turns toward her husband, Nick. As the investigation unfolds, carefully constructed appearances begin to crumble in this unsettling exploration of marriage, deception, and the stories people tell about themselves."
        },
        {
            id: 11,
            title: "The Secret History",
            author: "Donna Tartt",
            genre: "literary",
            category: "Literary Mystery",
            year: "1992",
            isbn: "9781400031702",
            synopsis: "At an elite New England college, a group of intellectually ambitious students becomes fascinated with the ancient world and increasingly detached from ordinary morality. Their pursuit of beauty and transcendence leads to devastating consequences in Donna Tartt's atmospheric literary novel."
        },
        {
            id: 12,
            title: "Little Women",
            author: "Louisa May Alcott",
            genre: "classics",
            category: "Classic Fiction",
            year: "1868",
            isbn: "9780147514011",
            synopsis: "Follow sisters Meg, Jo, Beth, and Amy March as they navigate family life, personal ambition, friendship, and the challenges of growing up. Warm, heartfelt, and enduring, Little Women celebrates individuality, resilience, and the bonds that shape a family."
        },
        {
            id: 13,
            title: "The Night Circus",
            author: "Erin Morgenstern",
            genre: "fantasy",
            category: "Fantasy / Romance",
            year: "2011",
            isbn: "9780307744432",
            synopsis: "A mysterious circus appears without warning and opens only after sunset. Behind its extraordinary tents, two young illusionists are bound by a magical competition neither fully understands. As their rivalry turns into love, the fate of the circus and everyone within it hangs in the balance."
        },
        {
            id: 14,
            title: "Rebecca",
            author: "Daphne du Maurier",
            genre: "mystery",
            category: "Gothic Mystery",
            year: "1938",
            isbn: "9780380730407",
            synopsis: "A young woman marries the wealthy widower Maxim de Winter and moves to his grand estate, Manderley. There she finds herself overshadowed by the lingering presence of his first wife, Rebecca, whose memory conceals dark secrets beneath the estate's elegant surface."
        },
        {
            id: 15,
            title: "Normal People",
            author: "Sally Rooney",
            genre: "romance",
            category: "Contemporary Romance",
            year: "2018",
            isbn: "9781984822185",
            synopsis: "Connell and Marianne grow up in the same small Irish town but inhabit very different social worlds. Their evolving relationship follows them through school and university, exploring intimacy, insecurity, class, communication, and the complicated ways people shape one another."
        },
        {
            id: 16,
            title: "The Bell Jar",
            author: "Sylvia Plath",
            genre: "literary",
            category: "Literary Fiction",
            year: "1963",
            isbn: "9780060837020",
            synopsis: "Esther Greenwood appears to have a promising future, but beneath her achievements she experiences a growing sense of alienation and despair. Sylvia Plath's semi-autobiographical novel offers a deeply personal exploration of identity, societal expectations, and psychological distress."
        }
    ];

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const siteHeader = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNavigation = document.getElementById("mobileNavigation");

    const currentYear = document.getElementById("currentYear");

    const libraryGrid = document.getElementById("libraryGrid");
    const bookSearch = document.getElementById("bookSearch");
    const bookSort = document.getElementById("bookSort");
    const genreFilters = document.getElementById("genreFilters");
    const bookCount = document.getElementById("bookCount");

    const collectionEmpty = document.getElementById("collectionEmpty");
    const clearFilters = document.getElementById("clearFilters");

    const bookModal = document.getElementById("bookModal");
    const modalPanel = bookModal?.querySelector(".book-modal-panel");
    const modalClose = document.getElementById("modalClose");

    const mobileLinks = mobileNavigation
        ? mobileNavigation.querySelectorAll("a")
        : [];

    let activeGenre = "all";
    let searchQuery = "";
    let sortOrder = "featured";

    let lastFocusedElement = null;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ======================================================
       COPYRIGHT
    ====================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* ======================================================
       HEADER
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
            link.addEventListener("click", () => setMenuState(false));
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                setMenuState(false);
            }
        });
    }

    /* ======================================================
       BOOK COVER HELPER
    ====================================================== */

    function getBookCover(book) {
        return `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
    }

    /* ======================================================
       RENDER BOOKS
    ====================================================== */

    function renderBooks() {

        if (!libraryGrid) return;

        let filteredBooks = books.filter(book => {

            const matchesGenre =
                activeGenre === "all" ||
                book.genre === activeGenre;

            const searchableText =
                `${book.title} ${book.author} ${book.category}`.toLowerCase();

            const matchesSearch =
                searchableText.includes(searchQuery);

            return matchesGenre && matchesSearch;
        });

        if (sortOrder === "title-asc") {

            filteredBooks.sort((a, b) =>
                a.title.localeCompare(b.title)
            );

        } else if (sortOrder === "title-desc") {

            filteredBooks.sort((a, b) =>
                b.title.localeCompare(a.title)
            );

        } else if (sortOrder === "author") {

            filteredBooks.sort((a, b) =>
                a.author.localeCompare(b.author)
            );
        }

        libraryGrid.innerHTML = "";

        filteredBooks.forEach(book => {

            const article = document.createElement("article");
            article.className = "library-book";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "library-book-button";
            button.setAttribute(
                "aria-label",
                `View details for ${book.title} by ${book.author}`
            );

            const visual = document.createElement("div");
            visual.className = "library-book-visual";

            const image = document.createElement("img");
            image.src = getBookCover(book);
            image.alt = `${book.title} book cover`;
            image.loading = "lazy";

            const overlay = document.createElement("div");
            overlay.className = "library-book-overlay";

            const overlayText = document.createElement("span");
            overlayText.textContent = "Discover This Book";

            overlay.appendChild(overlayText);
            visual.append(image, overlay);

            const category = document.createElement("span");
            category.className = "library-book-category";
            category.textContent = book.category;

            const title = document.createElement("h3");
            title.textContent = book.title;

            const author = document.createElement("p");
            author.className = "library-book-author";
            author.textContent = book.author;

            const detail = document.createElement("span");
            detail.className = "library-book-detail";
            detail.textContent = "View Book Details ↗";

            button.append(
                visual,
                category,
                title,
                author,
                detail
            );

            button.addEventListener("click", () => {
                openBookModal(book);
            });

            article.appendChild(button);
            libraryGrid.appendChild(article);
        });

        if (bookCount) {
            bookCount.textContent =
                `${filteredBooks.length} ${filteredBooks.length === 1 ? "BOOK" : "BOOKS"} FOUND`;
        }

        if (collectionEmpty) {
            collectionEmpty.hidden = filteredBooks.length !== 0;
        }
    }

    /* ======================================================
       SEARCH
    ====================================================== */

    if (bookSearch) {

        bookSearch.addEventListener("input", event => {
            searchQuery = event.target.value.trim().toLowerCase();
            renderBooks();
        });
    }

    /* ======================================================
       SORT
    ====================================================== */

    if (bookSort) {

        bookSort.addEventListener("change", event => {
            sortOrder = event.target.value;
            renderBooks();
        });
    }

    /* ======================================================
       GENRE FILTERS
    ====================================================== */

    if (genreFilters) {

        const genreButtons =
            genreFilters.querySelectorAll(".genre-button");

        genreButtons.forEach(button => {

            button.addEventListener("click", () => {

                activeGenre = button.dataset.genre;

                genreButtons.forEach(item => {
                    const selected = item === button;

                    item.classList.toggle("active", selected);
                    item.setAttribute("aria-pressed", String(selected));
                });

                renderBooks();
            });
        });
    }

    /* ======================================================
       CLEAR FILTERS
    ====================================================== */

    if (clearFilters) {

        clearFilters.addEventListener("click", () => {

            activeGenre = "all";
            searchQuery = "";
            sortOrder = "featured";

            if (bookSearch) bookSearch.value = "";
            if (bookSort) bookSort.value = "featured";

            genreFilters?.querySelectorAll(".genre-button")
                .forEach(button => {

                    const selected = button.dataset.genre === "all";

                    button.classList.toggle("active", selected);
                    button.setAttribute("aria-pressed", String(selected));
                });

            renderBooks();
        });
    }

    /* ======================================================
       BOOK DETAILS MODAL
    ====================================================== */

    function setModalText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function openBookModal(book) {

        if (!bookModal) return;

        lastFocusedElement = document.activeElement;

        setModalText("modalGenre", book.category);
        setModalText("modalTitle", book.title);
        setModalText("modalAuthor", `by ${book.author}`);
        setModalText("modalSynopsis", book.synopsis);
        setModalText("modalYear", book.year);
        setModalText("modalCategory", book.category);

        const modalCover = document.getElementById("modalCover");

        if (modalCover) {
            modalCover.src = getBookCover(book);
            modalCover.alt = `${book.title} book cover`;
        }

        bookModal.classList.add("open");
        bookModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("book-modal-open");

        if (modalPanel) {
            modalPanel.scrollTop = 0;
        }

        modalClose?.focus();
    }

    function closeBookModal() {

        if (!bookModal) return;

        bookModal.classList.remove("open");
        bookModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("book-modal-open");

        if (lastFocusedElement?.isConnected) {
            lastFocusedElement.focus();
        }
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeBookModal);
    }

    bookModal?.querySelectorAll("[data-close-modal]")
        .forEach(element => {
            element.addEventListener("click", closeBookModal);
        });

    /* ======================================================
       KEYBOARD HANDLING
    ====================================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            if (bookModal?.classList.contains("open")) {
                closeBookModal();
                return;
            }

            if (mobileNavigation?.classList.contains("open")) {
                setMenuState(false);
                menuToggle?.focus();
            }
        }

        if (
            event.key === "Tab" &&
            bookModal?.classList.contains("open")
        ) {

            const focusable = Array.from(
                modalPanel.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
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
    });

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

        revealElements.forEach(element => observer.observe(element));

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    /* ======================================================
       INTERNAL ANCHOR LINKS
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
       INITIALIZE COLLECTION
    ====================================================== */

    renderBooks();

});
