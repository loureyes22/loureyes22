
/* ==========================================================
   LOU REYES — OFFICIAL PORTFOLIO
   PROJECT DATABASE

   CONTENT DIRECTORY
   ----------------------------------------------------------
   01. COLLECTIONS
   02. EDITORIAL
   03. PACKAGING
   04. POSTERS
   05. DIGITAL
   06. IDENTITY
   07. PHOTOGRAPHY

   ----------------------------------------------------------
   PROJECT PROPERTY GUIDE

   id          Unique project identifier / URL
   title       Project display name
   category    Collection this project belongs to
   layout      Determines the individual Work page design
   type        Project discipline / description
   year        Year of completion
   featured    Display on homepage Featured Work
   image       Project thumbnail / cover
   description Full project description
   images      Project gallery / presentation assets
   livePreview Optional interactive website

   IMAGE PROPERTY GUIDE
   ----------------------------------------------------------
   src         Image file path
   label       Display label
   description Optional image-specific description
   credits     Image source credits
     name      Photographer / creator / rights holder
     source    Platform / website / organization
     url       Original source link
   group       Presentation grouping, where applicable

   ----------------------------------------------------------
   AVAILABLE LAYOUTS

   editorial   Interactive publication / artbook
   packaging   Packaging mockups and dielines
   website     Website presentation and live preview
   uiux        Interactive horizontal screen gallery
   default     Standard image gallery

   ----------------------------------------------------------
   IMPORTANT

   Edit project content, images, and metadata here.

   Keep all rendering, animations, navigation,
   and interaction code in their respective JS files.

   Project IDs and category IDs are used by page URLs.
   Do not rename them without updating their links.

   All local JPG references have been changed to WebP.
   Make sure the corresponding .webp files exist.
========================================================== */


/* ==========================================================
   01. COLLECTIONS
   ARCHIVE CATEGORIES

   Controls the collections displayed in The Archive.
   The order below determines their display order.
========================================================== */

const CATEGORIES = [
  {
    id: "editorial",
    title: "Editorial",
    subtitle: "PUBLICATIONS / LITERATURE",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1400&q=85",
    description: "An exploration of the printed page. Publications, books, catalogues, and visual narratives where typography, imagery, and composition work together to tell a story."
  },
  {
    id: "packaging",
    title: "Packaging",
    subtitle: "PRODUCT / EXPERIENCE",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1400&q=85",
    description: "The meeting point between visual identity and physical experience. Packaging designed to communicate character, materiality, and the personality of a product."
  },
  {
    id: "posters",
    title: "Posters",
    subtitle: "TYPOGRAPHY / EXPERIMENTATION",
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=1400&q=85",
    description: "An experimental space for typography, composition, and visual expression. A collection of poster studies and graphic explorations."
  },
  {
    id: "digital",
    title: "Digital",
    subtitle: "WEB / INTERACTION",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1400&q=85",
    description: "Digital experiences shaped by storytelling, thoughtful interaction, and visual clarity. Websites, interfaces, and interactive concepts."
  },
  {
    id: "identity",
    title: "Identity",
    subtitle: "BRANDING / VISUAL SYSTEMS",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=85",
    description: "The development of recognizable visual languages. From typography and marks to the systems that give a brand its distinct character."
  },
  {
    id: "photography",
    title: "Photography",
    subtitle: "ARCHITECTURE / NATURE",
    image: "portfolio/assets/sunset.webp",
    description: "A personal study of the world through images. Architecture, landscapes, geometry, and quiet moments that reveal themselves through observation."
  }
];


/* ==========================================================
   02. PROJECT CATALOGUE

   Projects are grouped by collection.

   IMPORTANT:
   All projects remain inside the same PROJECTS array.
========================================================== */

const PROJECTS = [

  /* ========================================================
     A. EDITORIAL
     CATEGORY: editorial
     LAYOUT: editorial

     01. VIRTÙ
     02. Nippon Bites
     03. Helvetica Type
     04. Crime & Punishment
     05. Organica1
  ======================================================== */


  /* VIRTÙ — ART CATALOGUE */
  {
    id: "virtu",
    title: "VIRTÙ",
    category: "editorial",
    layout: "editorial",
    type: "Art Catalogue / Editorial Design",
    year: "2025",
    featured: true,

    image: "portfolio/editorial/virtu/thumbnail.webp",

    description:
      "VIRTÙ is a Renaissance-inspired art catalogue developed around a conceptual art rental service. Featuring artworks sourced from The Metropolitan Museum of Art's Open Access collection, the project combines classical visual influences with contemporary editorial design. Through refined typography, considered layouts, and curated imagery, the catalogue presents Renaissance art in a modern, accessible format.",

    images: [
      {
        src: "portfolio/editorial/virtu/cover.webp",
        label: "Front & Back Cover",
        description: "",
        credits: [
          {
            name: "Giovanni Francesco Barbieri",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/436603"
          }
        ]
      },
      {
        src: "portfolio/editorial/virtu/spread-01.webp",
        label: "Editorial Spread 01",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/virtu/spread-02.webp",
        label: "Editorial Spread 02",
        description: "",
        credits: [
          {
            name: "Martin Olsson",
            source: "Unsplash",
            url: "https://unsplash.com/photos/white-and-brown-concrete-building-Mfb4TEExET4"
          }
        ]
      },
      {
        src: "portfolio/editorial/virtu/spread-03.webp",
        label: "Editorial Spread 03",
        description: "",
        credits: [
          {
            name: "Dosso Dossi",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/436208"
          },

          {
            name: "Francesco d'Ubertino Verdi",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/435594"
          }
        ]
      },
      {
        src: "portfolio/editorial/virtu/spread-04.webp",
        label: "Editorial Spread 04",
        description: "",
        credits: [
          {
            name: "Moretto da Brescia",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/437156"
          },

          {
            name: "Francesco Francia",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/436335"
          },

          {
            name: "Luca Signorelli",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/437673"
          }

        ]
      },
      {
        src: "portfolio/editorial/virtu/spread-05.webp",
        label: "Editorial Spread 05",
        description: "",
        credits: [
          {
            name: "Paris Bordon",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/435722"
          }
        ]
      },
      {
        src: "portfolio/editorial/virtu/spread-06.webp",
        label: "Editorial Spread 06",
        description: "",
        credits: [
          {
            name: "Paolo Veronese",
            source: "The Met Museum Collection",
            url: "https://www.metmuseum.org/art/collection/search/437891"
          }
        ]
      }
    ],

    livePreview: null
  },


  /* NIPPON BITES — COOKBOOK */
  {
    id: "nippon-bites",
    title: "Nippon Bites",
    category: "editorial",
    layout: "editorial",
    type: "Cookbook / Editorial Design",
    year: "2025",
    featured: false,

    image: "portfolio/editorial/nippon-bites/thumbnail.webp",

    description:
      "Nippon Bites is a Japanese cookbook that celebrates the visual appeal and culinary traditions of Japanese cuisine. Combining expressive food photography with clean typography and thoughtful editorial layouts, the publication balances visual storytelling with practical readability. The design offers a contemporary approach to presenting traditional Japanese dishes, creating an inviting and cohesive culinary experience.",

    images: [
      {
        src: "portfolio/editorial/nippon-bites/cover.webp",
        label: "Front & Back Cover",
        description: "",
        credits: [
          {
            name: "jirayu koontholjinda",
            source: "Unsplash",
            url: "https://unsplash.com/photos/stainless-steel-fork-on-white-ceramic-plate-G675o-lxbnQ"
          }
        ]
      },
      {
        src: "portfolio/editorial/nippon-bites/spread-01.webp",
        label: "Editorial Spread 01",
        description: "",
        credits: [
          {
            name: "Audrey Mari",
            source: "Unsplash",
            url: "https://unsplash.com/photos/selective-focus-photography-of-red-and-black-chinese-lanterns-HvhinFxq4_s"
          }
        ]
      },
      {
        src: "portfolio/editorial/nippon-bites/spread-02.webp",
        label: "Editorial Spread 02",
        description: "",
        credits: [
          {
            name: "Monika Borys",
            source: "Unsplash",
            url: "https://unsplash.com/photos/a-plate-of-food-with-chopsticks-and-a-bowl-of-rice-dOFxWZw_GyQ"
          }
        ]
      },
      {
        src: "portfolio/editorial/nippon-bites/spread-03.webp",
        label: "Table of Contents",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/nippon-bites/spread-04.webp",
        label: "Recipe Page 01",
        description: "",
        credits: [
          {
            name: "Nasik Lababan",
            source: "Unsplash",
            url: "https://unsplash.com/photos/a-plate-of-food-on-a-wooden-table-Mbu4XIn6ZsI"
          }
        ]
      },
      {
        src: "portfolio/editorial/nippon-bites/spread-05.webp",
        label: "Recipe Page 02",
        description: "",
        credits: [
          {
            name: "Maryam Sicard",
            source: "Unsplash",
            url: "https://unsplash.com/photos/two-pieces-of-sushi-on-a-white-plate-sstgHyZkstE"
          }
        ]
      },
      {
        src: "portfolio/editorial/nippon-bites/spread-06.webp",
        label: "Editorial Spread 06",
        description: "",
        credits: [
          {
            name: "Yuya Yoshioka",
            source: "Unsplash",
            url: "https://unsplash.com/photos/people-standing-in-front-of-store-during-night-time-0IvwihAQy5s"
          }
        ]
      }
    ],

    livePreview: null
  },


  /* HELVETICA TYPE SPECIMEN */
  {
    id: "helvetica",
    title: "Helvetica Type",
    category: "editorial",
    layout: "editorial",
    type: "Type Specimen / Editorial Design",
    year: "2026",
    featured: false,

    image: "portfolio/editorial/helvetica/thumbnail.webp",

    description:
      "A typographic specimen dedicated to Helvetica, exploring the typeface's timeless simplicity, clarity, and versatility. Through carefully structured layouts, variations in scale, and considered typographic hierarchy, the publication highlights Helvetica's distinctive characteristics and its enduring influence on modern graphic design.",

    images: [
      {
        src: "portfolio/editorial/helvetica/cover.webp",
        label: "Front & Back Cover",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/helvetica/spread-01.webp",
        label: "Editorial Spread 01",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/helvetica/spread-02.webp",
        label: "Editorial Spread 02",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/helvetica/spread-03.webp",
        label: "Editorial Spread 03",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/helvetica/spread-04.webp",
        label: "Editorial Spread 04",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/helvetica/spread-05.webp",
        label: "Editorial Spread 05",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/helvetica/spread-06.webp",
        label: "Editorial Spread 06",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/helvetica/spread-07.webp",
        label: "Editorial Spread 07",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      }
    ],

    livePreview: null
  },


  /* CRIME & PUNISHMENT */
  {
    id: "crime-punishment",
    title: "Crime & Punishment",
    category: "editorial",
    layout: "editorial",
    type: "Book Cover / Literary Design",
    year: "2026",
    featured: true,

    image: "portfolio/editorial/crime-punishment/thumbnail.webp",

    description:
      "A visual reinterpretation of Fyodor Dostoevsky's Crime and Punishment, explored through three distinct book cover concepts. Photography, ornamental patterns, and typography are used to investigate different approaches to expressing the novel's psychological tension, atmosphere, and themes.",

    images: [
      {
        src: "portfolio/editorial/crime-punishment/cover-1.webp",
        label: "Photographic Concept",
        description: "",
        credits: [
          {
            name: "naffnaff",
            source: "iStock",
            url: "https://www.istockphoto.com/photo/man-in-a-suit-walking-down-a-hallway-in-black-and-white-gm115700108-14193553"
          }
        ]
      },
      {
        src: "portfolio/editorial/crime-punishment/cover-2.webp",
        label: "Pattern-Based Concept",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/crime-punishment/cover-3.webp",
        label: "Typographic Concept",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      }
    ],

    livePreview: null
  },


  /* ORGANICA1 */
  {
    id: "organica",
    title: "Organica1",
    category: "editorial",
    layout: "editorial",
    type: "Editorial Brochure /  Exhibition Brochure",
    year: "2026",
    featured: true,

    image: "portfolio/editorial/organica/thumbnail.webp",

    description:
      "Organica1 is an editorial brochure developed for a conceptual contemporary art exhibition exploring the relationship between art and the natural world. Inspired by organic forms, textures, and botanical imagery, the design combines expressive typography, a muted colour palette, and carefully structured layouts. The brochure balances artistic expression with practical exhibition information, creating a cohesive visual identity that reflects the exhibition's connection to nature.",

    images: [
      {
        src: "portfolio/editorial/organica/01.webp",
        label: "Cover",
        description: "",
        credits: [
          {
            name: "Cover Unavailable",
            source: "Unsplash",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/editorial/organica/02.webp",
        label: "Inside Spread",
        description: "",
        credits: [
          {
            name: "Andrej Lišakov",
            source: "Unsplash",
            url: "https://unsplash.com/photos/a-room-with-a-skylight-and-a-white-ceiling-4Y_za30lAwE"
          },

          {
            name: "Pablo Merchán Montes",
            source: "Unsplash",
            url: "https://unsplash.com/photos/a-chair-and-a-lamp-in-a-room-Z0195gVWsp8"
          },

          {
            name: "Jeff Ackley",
            source: "Unsplash",
            url: "https://unsplash.com/photos/topless-man-and-woman-statue-45LMmJ9wq6M"
          },

          {
            name: "Europeana",
            source: "Unsplash",
            url: "https://unsplash.com/photos/horse-drawn-cart-on-river-path-8E31onOcVXg"
          },
        ]
      }
    ],

    livePreview: null
  },


  /* ========================================================
     B. PACKAGING
     CATEGORY: packaging
     LAYOUT: packaging

     01. Atelier Thé
     02. Duinkerken
  ======================================================== */


  /* ATELIER THÉ */
  {
    id: "atelier-the",
    title: "Atelier Thé",
    category: "packaging",
    layout: "packaging",
    type: "Tea Packaging / Product Design",
    year: "2026",
    featured: true,

    image: "portfolio/packaging/atelier-the/thumbnail.webp",

    description:
      "Atelier Thé is a French-inspired tea brand concept that explores elegance, craftsmanship, and contemporary packaging design. Developed through a refined visual identity, the project combines sophisticated typography, a considered colour palette, and minimalist composition to create a distinctive packaging experience. The design reflects the artisanal character of the brand while establishing a sense of understated luxury.",

    images: [
      {
        src: "portfolio/packaging/atelier-the/mockup.webp",
        label: "Packaging Mockup",
        description: "",
        credits: [
          {
            name: "Tea Bag sachet with box",
            source: "Pixpine",
            url: "https://pixpine.com/free-tea-bag-sachet-with-box-mockup/"
          }
        ],
        group: "mockup"
      },
      {
        src: "portfolio/packaging/atelier-the/dieline.webp",
        label: "Packaging Dieline",
        description: "",
        credits: [
          {
            name: "Vector Artwork Unavailable",
            source: "Vector Stock",
            url: ""
          }
        ],
        group: "assets"
      }
    ],

    livePreview: null
  },


  /* DUINKERKEN */
  {
    id: "duinkerken",
    title: "Duinkerken",
    category: "packaging",
    layout: "packaging",
    type: "Food Packaging / Packaging Redesign",
    year: "2026",
    featured: false,

    image: "portfolio/packaging/duinkerken/thumbnail.webp",

    description:
      "A packaging redesign for Duinkerken Pancake Mix, exploring a refreshed visual identity through contemporary typography, refined composition, and thoughtful product presentation. The redesign focuses on improving visual hierarchy and shelf appeal while maintaining a clear connection to the product's identity, creating a cohesive and approachable packaging experience.",

    images: [
      {
        src: "portfolio/packaging/duinkerken/mockup-01.webp",
        label: "Packaging Mockup 01",
        description: "",
        credits: [
          {
            name: "Box mockup",
            source: "Mockups-Design",
            url: "https://mockups-design.com/free-software-box-mockup/"
          }
        ],
        group: "mockup"
      },
      {
        src: "portfolio/packaging/duinkerken/mockup-02.webp",
        label: "Packaging Mockup 02",
        description: "",
        credits: [
          {
            name: "Box mockup",
            source: "Mockups-Design",
            url: "https://mockups-design.com/free-software-box-mockup/"
          }
        ],
        group: "mockup"
      },
      {
        src: "portfolio/packaging/duinkerken/dieline.webp",
        label: "Packaging Dieline",
        description: "",
        credits: [
          {
            name: "Duinkerken Logo",
            source: "Duinkerken Foods",
            url: "https://www.duinkerkenfoods.com"
          },

          {
            name: "Fernando Andrade - Cover",
            source: "Unsplash",
            url: "https://unsplash.com/photos/pancake-with-honey-and-honey-dipper-ZQKY56UdcSQ"
          },

          {
            name: "Fernando Andrade - Pizza",
            source: "Unsplash",
            url: "https://unsplash.com/photos/pizza-with-pepperoni-and-ham-_P76trHTWDE"
          },

          {
            name: "Anton - Cupcake",
            source: "Unsplash",
            url: "https://unsplash.com/photos/pizza-with-pepperoni-and-ham-_P76trHTWDE"
          },

          {
            name: "Vicky G - Bread",
            source: "Unsplash",
            url: "https://unsplash.com/photos/bread-on-brown-wooden-table-yL9qjDDmmMU"
          },
          
        ],
        group: "assets"
      }
    ],

    livePreview: null
  },


  /* ========================================================
     C. POSTERS
     CATEGORY: posters
     LAYOUT: posters

     01. Movie Posters
     02. Game Posters
  ======================================================== */


  /* MOVIE POSTERS */
  {
    id: "movie-posters",
    title: "Movie Posters",
    category: "posters",
    layout: "posters",
    type: "Movie Posters",
    year: "2025",
    featured: null,

    image: "portfolio/posters/movie-posters/thumbnail.webp",

    description:
      "A collection of experimental movie posters exploring visual storytelling through typography, imagery, and composition. Each design reinterprets cinematic themes and atmosphere through a distinct visual approach, translating familiar films into expressive graphic compositions.",
    images: [
      {
        src: "portfolio/posters/movie-posters/american-psycho.webp",
        label: "American Psycho — Movie Poster",
        description: "Unofficial fan-made poster created as a academic design exercise. American Psycho and its associated imagery belong to their respective copyright holders. This project is not affiliated with or endorsed by the film's rights holders.",
        credits: [
          {
            name: "American Psycho (2000) — Film Imagery",
            source: "Lionsgate",
            url: ""
          }
        ]
      }
    ],

    livePreview: null
  },


  /* GAME POSTERS */
  {
    id: "game-posters",
    title: "Game Posters",
    category: "posters",
    layout: "posters",
    type: "Game Posters",
    year: "2026",
    featured: null,

    image: "portfolio/posters/game-posters/thumbnail.webp",

    description:
      "A series of unofficial video game posters exploring character-driven compositions, typography, and visual identity. Drawing inspiration from established game franchises, each poster experiments with colour, imagery, and layout to capture the personality and atmosphere of its subject.",

    images: [
      {
        src: "portfolio/posters/game-posters/leon.webp",
        label: "Leon - Resident Evil 2 Poster",
        description: "An unofficial fan-made poster created as a personal graphic design project. Resident Evil and its associated characters and assets are the intellectual property of Capcom. This project is not affiliated with or endorsed by Capcom.",
        credits: [
          {
            name: "Capcom",
            source: "Resident Evil 2 - Character Imagery",
            url: "https://www.reddit.com/r/residentevil/comments/grsaup/transparent_leon_png_i_just_cut_out_in_case/"
          }
        ]
      },
      {
        src: "portfolio/posters/game-posters/claire.webp",
        label: "Claire - Resident Evil 2 Poster",
        description: "An unofficial fan-made poster created as a personal graphic design project. Resident Evil and its associated characters and assets are the intellectual property of Capcom. This project is not affiliated with or endorsed by Capcom.",
        credits: [
          {
            name: "Capcom",
            source: "Resident Evil 2 - Character Imagery",
            url: "https://www.reddit.com/r/residentevil/comments/11xd55i/claire_redfield_original_vs_remake_which_one_do/#lightbox"
          }
        ]
      },
      
      {
        src: "portfolio/posters/game-posters/cloud.webp",
        label: "Cloud - Final Fantasy VII Poster",
        description: "An unofficial fan-made poster created as a personal graphic design project. Final Fantasy VII and its associated characters and assets are the intellectual property of Square Enix. This project is not affiliated with or endorsed by Square Enix.",
        credits: [
          {
            name: "Square Enix",
            source: "Square Enix - Character Imagery",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/posters/game-posters/sepiroth.webp",
        label: "Sepiroth - Final Fantasy VII Poster",
        description: "An unofficial fan-made poster created as a personal graphic design project. Final Fantasy VII and its associated characters and assets are the intellectual property of Square Enix. This project is not affiliated with or endorsed by Square Enix.",
        credits: [
          {
            name: "Square Enix",
            source: "Square Enix - Character Imagery",
            url: ""
          }
        ]
      }
    ],

    livePreview: null
  },


  /* ========================================================
     D. DIGITAL
     CATEGORY: digital

     01. Chapter & Coffee — website
     02. Lumen — uiux
     03. PLATE — uiux
  ======================================================== */


  /* CHAPTER & COFFEE */
  {
    id: "chapter-coffee",
    title: "Chapter & Coffee",
    category: "digital",
    layout: "website",
    type: "Website / Café & Bookstore Website",
    year: "2026",
    featured: true,

    image: "portfolio/digital/chapter-coffee/thumbnail.webp",

    description:
      "Chapter & Coffee is a café and bookstore concept that brings together the pleasures of reading and coffee in a welcoming, thoughtfully designed space. Visitors can explore a curated selection of books, enjoy reading on-site, or rent titles to take home. The website combines warm imagery, refined typography, and intuitive navigation to create an inviting digital experience that reflects the café's literary atmosphere.",

    images: [
      {
        src: "portfolio/digital/chapter-coffee/homepage.webp",
        label: "Homepage",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/digital/chapter-coffee/book.webp",
        label: "Book Page",
        description: "Book cover imagery sourced from Open Library. All cover artwork and associated rights belong to their respective copyright holders.",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      }
    ],

    livePreview: {
      enabled: true,
      url: "portfolio/digital/chapter-coffee/live/index.html"
    }
  },


  /* LUMEN */
  {
    id: "lumen",
    title: "Lumen",
    category: "digital",
    layout: "uiux",
    type: "UI/UX Design / Personal Memory Archive",
    year: "2026",
    featured: true,

    image: "portfolio/digital/lumen/thumbnail.webp",

    description:
      "LUMEN is a private, emotion-driven memory archive designed to preserve meaningful moments and personal experiences. Offering an intimate alternative to social media, the application allows users to organize photographs, revisit memories, and reflect on the emotions connected to them. Built around simplicity, privacy, and thoughtful interaction, LUMEN celebrates the quiet significance of everyday life.",

    images: [
      {
        src: "portfolio/digital/lumen/launch.webp",
        label: "Launch Screen",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/digital/lumen/home.webp",
        label: "Homepage",
        description: "",
        credits: [
          {
            name: "Photography Courtesy of a Personal Friend",
            source: "Used with Permission",
            url: ""
          },

          {
            name: "Lou Reyes",
            source: "Personal Photography",
            url: ""
          },


        ]
      },
      {
        src: "portfolio/digital/lumen/add.webp",
        label: "Add Memory",
        description: "",
        credits: [
          {
            name: "Photography Courtesy of a Personal Friend",
            source: "Used with permission",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/digital/lumen/archive.webp",
        label: "Archive",
        description: "",
        credits: [
          {
            name: "Photography Courtesy of a Personal Friend",
            source: "Used with Permission",
            url: ""
          },

          {
            name: "Lou Reyes",
            source: "Personal Photography",
            url: ""
          },

        ]
      },
      {
        src: "portfolio/digital/lumen/gallery.webp",
        label: "Gallery",
        description: "",
        credits: [
          {
            name: "Photography Courtesy of a Personal Friend",
            source: "Used with Permission",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/digital/lumen/view.webp",
        label: "View Memory",
        description: "",
        credits: [
          {
            name: "Photography Courtesy of a Personal Friend",
            source: "Used with Permission",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/digital/lumen/settings.webp",
        label: "Settings",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      }
    ],

    livePreview: null
  },

  /* ========================================================
     E. IDENTITY
     CATEGORY: identity
     LAYOUT: default

     01. EVERBLU_
     02. EZNEROL
  ======================================================== */


  /* EVERBLU_ */
  {
    id: "everblu",
    title: "EVERBLU_",
    category: "identity",
    layout: "identity",
    type: "Visual Identity",
    year: "2025",
    featured: false,

    image: "portfolio/identity/everblu/thumbnail.webp",

    description:
      "EVERBLU_ is a sustainable clothing brand concept focused on everyday essentials designed to last. Built around a refined typographic identity, a nature-inspired colour palette, and the principle of longevity, the visual system balances simplicity with a contemporary, understated aesthetic.",

    images: [
      {
        src: "portfolio/identity/everblu/brand/cover.webp",
        label: "Cover",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },
      {
        src: "portfolio/identity/everblu/brand/color.webp",
        label: "Color Palette",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/everblu/brand/type.webp",
        label: "Typography",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

       {
        src: "portfolio/identity/everblu/applications/website.webp",
        label: "Website Mockup",
        description: "",
        credits: [
          {
            name: "T-shirt",
            source: "Sene Studio",
            url: "https://senestudio.com/products/mens-pima-reserve-crew-t-shirt?srsltid=AYCX9vJJoJpg4ZIk8CHwVm-GTgRrZsyF4CPjCYkw-uFWzulAQrmaMlA4&variant=46271035048133"
          }
        ],
        group: "mockup"
      },
      
      {
        src: "portfolio/identity/everblu/assets/primary.webp",
        label: "Primary Logo",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
      },

      {
        src: "portfolio/identity/everblu/assets/secondary.webp",
        label: "Primary Logo - Secondary Color",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
      },

    ],

    livePreview: null
  },

    /* EZNEROL */
  {
    id: "eznerol",
    title: "EZNEROL",
    category: "identity",
    layout: "identity",
    type: "Brand Identity",
    year: "2026",
    featured: false,

    image: "portfolio/identity/eznerol/thumbnail.webp",

    description:
      "A typographic visual identity developed for a gaming content creator, including a logo, banners, streaming graphics, and a compact brand style system.",

    images: [
      {
        src: "portfolio/identity/eznerol/brand/cover.webp",
        label: "Cover",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },
      {
        src: "portfolio/identity/eznerol/brand/overview.webp",
        label: "Project Overview",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/logo.webp",
        label: "Logo",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/guidelines.webp",
        label: "Logo Guidelines",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/variations.webp",
        label: "Logo Variations",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/usage-correct.webp",
        label: "Correct Logo Usage",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/usage-wrong.webp",
        label: "Wrong Logo Usage",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/banner.webp",
        label: "YouTube / Twitch Channel Banner",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/panels.webp",
        label: "Twitch Channel Panels",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/brand/brand.webp",
        label: "Brand Style Guide",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "identity"
      },

      {
        src: "portfolio/identity/eznerol/applications/youtube-profile.webp",
        label: "Youtube Profile",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "mockup"
      },

      {
        src: "portfolio/identity/eznerol/applications/twitch.webp",
        label: "Twitch Channel Profile",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "mockup"
      },
      {
        src: "portfolio/identity/eznerol/assets/logo.webp",
        label: "Logo",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
      },

      {
        src: "portfolio/identity/eznerol/assets/banner.webp",
        label: "Youtube / Twitch Channel Banner",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
      },

      {
        src: "portfolio/identity/eznerol/assets/about.webp",
        label: "About Me Panel",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
      },

      {
        src: "portfolio/identity/eznerol/assets/youtube.webp",
        label: "YouTube Panel",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"

      },

      {
        src: "portfolio/identity/eznerol/assets/twitter.webp",
        label: "Twitter Panel",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
        
      },

      {
        src: "portfolio/identity/eznerol/assets/instagram.webp",
        label: "Instagram Panel",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
        
      },
      
     {
        src: "portfolio/identity/eznerol/assets/specs.webp",
        label: "Specs Panel",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ],
        group: "assets"
        
      },

    ],

    livePreview: null
  },

  /* ========================================================
     F. PHOTOGRAPHY
     CATEGORY: photography
     LAYOUT: default

     01. Observations
  ======================================================== */


  /* OBSERVATIONS */
  {
    id: "lithuania",
    title: "Lithuania",
    category: "photography",
    layout: "default",
    type: "Architecture / Nature Photography",
    year: "2025",
    featured: false,

    image: "portfolio/assets/lt.webp",

    description:
      "A personal photographic exploration of architecture, nature, geometry, and atmosphere. A study of ordinary moments revealed through careful observation.",

    images: [
      {
        src: "portfolio/photography/01.webp",
        label: "IMAGE 01",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/photography/02.webp",
        label: "IMAGE 02",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/photography/03.webp",
        label: "IMAGE 03",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/photography/04.webp",
        label: "IMAGE 04",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/photography/05.webp",
        label: "IMAGE 05",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/photography/06.webp",
        label: "IMAGE 06",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/photography/07.webp",
        label: "IMAGE 07",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      {
        src: "portfolio/photography/08.webp",
        label: "IMAGE 08",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },
      
      {
        src: "portfolio/photography/09.webp",
        label: "IMAGE 09",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },


      {
        src: "portfolio/photography/10.webp",
        label: "IMAGE 10",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },

          {
        src: "portfolio/photography/11.webp",
        label: "IMAGE 11",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },

          {
        src: "portfolio/photography/12.webp",
        label: "IMAGE 12",
        description: "",
        credits: [
          {
            name: "",
            source: "",
            url: ""
          }
        ]
      },

      
    ],

    livePreview: null
  }

];
