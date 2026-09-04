console.log("Supabase client:", supabaseClient);

const shows = [];

// =========================
// ELEMENTS
// =========================

const movieGrid =
    document.getElementById("movie-grid");

const moodCards =
    document.querySelectorAll(".mood-card");

const emotionInput =
    document.getElementById("emotion-input");

const characterCount =
    document.getElementById("character-count");

const emotionButton =
    document.getElementById("emotion-button");

const contentFilters =
    document.querySelectorAll(".content-filter");


// =========================
// NAVIGATION
// =========================

const accountNavLink =
    document.getElementById(
        "account-nav-link"
    );

const watchlistNavLink =
    document.getElementById(
        "watchlist-nav-link"
    );

const genresNavLink =
    document.getElementById(
        "genres-nav-link"
    );

const moodNavLink =
    document.getElementById(
        "mood-nav-link"
    );
// ==========================================
// NAVBAR ACTIVE SECTION HIGHLIGHTING
// ==========================================

const navLinks = document.querySelectorAll(".nav-links a");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileNavLinks = document.querySelector(".nav-links");

const sectionsForNavigation = [
    {
        id: "moods",
        link: '.nav-links a[href="#moods"]'
    },
    {
        id: "emotion",
        link: '.nav-links a[href="#emotion"]'
    },
    {
        id: "watchlist",
        link: '.nav-links a[href="#watchlist"]'
    },
    {
        id: "auth",
        link: '.nav-links a[href="#auth"]'
    }
];

function setActiveNavLink(targetLink) {

    navLinks.forEach(link => {
        link.classList.remove("active");
    });

    if (targetLink) {
        targetLink.classList.add("active");
    }
}

const navigationObserver =
    new IntersectionObserver(
        entries => {

            const visibleSections =
                entries
                    .filter(entry => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    );

            if (!visibleSections.length) {
                return;
            }

            const activeSection =
                visibleSections[0];

            const matchingSection =
                sectionsForNavigation.find(
                    section =>
                        section.id ===
                        activeSection.target.id
                );

            if (!matchingSection) {
                return;
            }

            const matchingLink =
                document.querySelector(
                    matchingSection.link
                );

            setActiveNavLink(matchingLink);
        },
        {
            threshold: [0.15, 0.3, 0.5, 0.7],
            rootMargin: "-15% 0px -55% 0px"
        }
    );

sectionsForNavigation.forEach(
    ({ id }) => {

        const section =
            document.getElementById(id);

        if (section) {
            navigationObserver.observe(section);
        }

    }
);



// ==========================================
// HOME ACTIVE STATE
// ==========================================

const homeNavLink =
    document.querySelector(
        '.nav-links a[href="#"]'
    );

function updateHomeNavState() {

    if (window.scrollY < 120) {
        setActiveNavLink(homeNavLink);
    }

}
// MOBILE NAVIGATION
function closeMobileMenu() {
    if (!mobileNavLinks || !mobileMenuToggle) return;

    mobileNavLinks.classList.remove("mobile-open");
    mobileMenuToggle.classList.remove("open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
}

function toggleMobileMenu() {
    if (!mobileNavLinks || !mobileMenuToggle) return;

    const isOpen = mobileNavLinks.classList.toggle("mobile-open");

    mobileMenuToggle.classList.toggle("open", isOpen);
    mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
}

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
}

// Close menu after selecting a navigation link
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        closeMobileMenu();
    });
});

// Close menu when clicking outside the navbar
document.addEventListener("click", event => {
    if (!event.target.closest(".navbar")) {
        closeMobileMenu();
    }
});

// Close menu when pressing Escape
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

// Reset mobile menu when returning to desktop
window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
        closeMobileMenu();
    }
});

window.addEventListener(
    "scroll",
    updateHomeNavState,
    { passive: true }
);

updateHomeNavState();

// =========================
// LOGIN REQUIRED MESSAGE
// =========================

const loginRequiredMessage =
    document.getElementById(
        "login-required-message"
    );


// =========================
// WATCHLIST ELEMENTS
// =========================

const watchlistGrid =
    document.getElementById("watchlist-grid");

const watchlistEmpty =
    document.getElementById("watchlist-empty");


// =========================
// MOVIE DETAILS MODAL
// =========================

const movieModal =
    document.getElementById("movie-modal");

const movieDetails =
    document.getElementById("movie-details");

const closeModal =
    document.getElementById("close-modal");


// =========================
// FILTER STATE
// =========================

let selectedGenre = null;

let selectedType = "all";


// =========================
// AI RECOMMENDATION SIGNALS
// =========================

let recommendationSignals = {
    tone: "",
    mood: "",
    themes: []
};


// =========================
// CURRENT AUTH USER
// =========================

let currentUser = null;


// ========================================================
// LOGIN / SIGNUP ELEMENTS
// ========================================================

const authForm =
    document.getElementById(
        "auth-form"
    );

const loginTab =
    document.getElementById(
        "login-tab"
    );

const signupTab =
    document.getElementById(
        "signup-tab"
    );

const authSubmit =
    document.getElementById(
        "auth-submit"
    );

const authMessage =
    document.getElementById(
        "auth-message"
    );

const loggedInUser =
    document.getElementById(
        "logged-in-user"
    );

const userEmail =
    document.getElementById(
        "user-email"
    );

const logoutButton =
    document.getElementById(
        "logout-button"
    );

const authTabs =
    document.querySelector(
        ".auth-tabs"
    );

const authEmail =
    document.getElementById(
        "auth-email"
    );

const authPassword =
    document.getElementById(
        "auth-password"
    );

let authMode = "login";


// ========================================================
// AUTH MESSAGE HELPER
// ========================================================

function showAuthMessage(
    message,
    type = "normal"
) {

    if (!authMessage) {

        return;

    }


    authMessage.textContent =
        message;


    authMessage.dataset.status =
        type;


    if (type === "error") {

        authMessage.setAttribute(
            "role",
            "alert"
        );

    }

    else {

        authMessage.removeAttribute(
            "role"
        );

    }

}


// ========================================================
// FRIENDLY AUTH ERROR
// ========================================================

function getFriendlyAuthError(error) {

    const message =
        error?.message ||
        "";

    const normalizedMessage =
        message.toLowerCase();


    if (
        normalizedMessage.includes(
            "invalid login credentials"
        )
    ) {

        return "Incorrect email or password. Please try again.";

    }


    if (
        normalizedMessage.includes(
            "email not confirmed"
        )
    ) {

        return "Please verify your email before logging in.";

    }


    if (
        normalizedMessage.includes(
            "user already registered"
        )
    ) {

        return "An account with this email already exists. Try logging in instead.";

    }


    if (
        normalizedMessage.includes(
            "password should be at least"
        )
    ) {

        return "Your password must be at least 6 characters long.";

    }


    if (
        normalizedMessage.includes(
            "invalid email"
        )
    ) {

        return "Please enter a valid email address.";

    }


    if (
        normalizedMessage.includes(
            "too many requests"
        )
    ) {

        return "Too many attempts. Please wait a moment and try again.";

    }


    return message ||
        "Something went wrong. Please try again.";

}


// ========================================================
// AUTHENTICATION ACCESS CONTROL
// ========================================================

function updateMoodMatchAccess(user) {

    const protectedSections =
        document.querySelectorAll(
            ".mood-section, .emotion-section, .recommendation-section"
        );


    // =========================
    // USER LOGGED IN
    // =========================

    if (user) {

        protectedSections.forEach(
            section => {

                section.classList.remove(
                    "app-locked"
                );

            }
        );


        if (loginRequiredMessage) {

            loginRequiredMessage.style.display =
                "none";

        }


        console.log(
            "🔓 MoodMatch unlocked."
        );

    }


    // =========================
    // USER LOGGED OUT
    // =========================

    else {

        protectedSections.forEach(
            section => {

                section.classList.add(
                    "app-locked"
                );

            }
        );


        if (loginRequiredMessage) {

            loginRequiredMessage.style.display =
                "block";

        }


        console.log(
            "🔒 MoodMatch locked. Login required."
        );

    }

}


// ========================================================
// PROTECTED NAVIGATION
// ========================================================

function goToAuth(message) {

    document
        .getElementById("auth")
        ?.scrollIntoView({
            behavior: "smooth"
        });


    showAuthMessage(
        message,
        "normal"
    );

}


// =========================
// GENRES NAVIGATION
// =========================

if (genresNavLink) {

    genresNavLink.addEventListener(
        "click",
        event => {

            if (!currentUser) {

                event.preventDefault();

                goToAuth(
                    "Please login to explore genres."
                );

            }

        }
    );

}


// =========================
// MOOD NAVIGATION
// =========================

if (moodNavLink) {

    moodNavLink.addEventListener(
        "click",
        event => {

            if (!currentUser) {

                event.preventDefault();

                goToAuth(
                    "Please login to use AI mood recommendations."
                );

            }

        }
    );

}


// =========================
// WATCHLIST NAVIGATION
// =========================

if (watchlistNavLink) {

    watchlistNavLink.addEventListener(
        "click",
        event => {

            if (!currentUser) {

                event.preventDefault();

                goToAuth(
                    "Please login to view your watchlist."
                );

            }

        }
    );

}


// ========================================================
// DISPLAY SHOWS
// ========================================================

function displayShows(list) {

    movieGrid.innerHTML = "";


    if (!list || list.length === 0) {

        movieGrid.innerHTML = `
                        <div class="no-results recommendation-empty">
    <span class="empty-icon">🎬</span>
    <strong>No matches found</strong>
    <span>Try another mood or content type.</span>
</div>
        `;

        return;

    }


    list.forEach(show => {

        const card =
            document.createElement("div");


        card.classList.add(
            "movie-card"
        );


        card.dataset.id =
            show.id;


        card.dataset.type =
            show.type;


        card.innerHTML = `
            <img
                src="${show.poster}"
                alt="${show.title}"
            >

            <div class="movie-info">

                <h3>
                    ${show.title}
                </h3>

                <div class="movie-meta">

                    <span class="movie-type">
                        ${show.type} • ${show.year}
                    </span>

                    <span class="movie-rating">
                        ⭐ ${show.rating}
                    </span>

                </div>

            </div>
        `;


        card.addEventListener(
            "click",
            () => openMovieDetails(show)
        );


        movieGrid.appendChild(card);

    });

}


// ========================================================
// LOAD WATCHLIST
// ========================================================

async function loadWatchlist() {

    if (
        !watchlistGrid ||
        !watchlistEmpty
    ) {

        return;

    }


    watchlistGrid.innerHTML = `
        <p class="no-results">
            Loading your watchlist...
        </p>
    `;


    watchlistEmpty.style.display =
        "none";


    try {

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (userError) {

            throw userError;

        }


        if (!user) {

            watchlistGrid.innerHTML = `
                <p class="no-results">
                    Login to see your watchlist.
                </p>
            `;

            return;

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .from("watchlist")
                .select("*")
                .eq(
                    "user_id",
                    user.id
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            watchlistGrid.innerHTML = "";

            watchlistEmpty.style.display =
                "block";

            return;

        }


        watchlistEmpty.style.display =
            "none";

        displayWatchlist(data);

    }

    catch (error) {

        console.error(
            "Load Watchlist Error:",
            error
        );


        watchlistGrid.innerHTML = `
            <p class="no-results">
                Sorry, we couldn't load your watchlist.
                Please try again.
            </p>
        `;

    }

}


// ========================================================
// DISPLAY WATCHLIST
// ========================================================

function displayWatchlist(list) {

    watchlistGrid.innerHTML = "";


    list.forEach(item => {

        const card =
            document.createElement("div");


        card.classList.add(
            "movie-card"
        );


        card.dataset.id =
            item.tmdb_id;


        card.dataset.type =
            item.media_type;


        const displayType =
            item.media_type === "movie"
                ? "Movie"
                : "Series";


        card.innerHTML = `

            <img
                src="${
                    item.poster_path ||
                    "https://via.placeholder.com/500x750?text=No+Poster"
                }"
                alt="${item.title}"
            >

            <div class="movie-info">

                <h3>
                    ${item.title}
                </h3>

                <div class="movie-meta">

                    <span class="movie-type">
                        ${displayType}
                    </span>

                    <span class="movie-rating">
                        🔖 Saved
                    </span>

                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            () => {

                const show = {

                    id:
                        item.tmdb_id,

                    title:
                        item.title,

                    type:
                        displayType,

                    poster:
                        item.poster_path

                };


                openMovieDetails(show);

            }
        );


        watchlistGrid.appendChild(
            card
        );

    });

}


// ========================================================
// GENRE MAP
// ========================================================

function convertMoodToKey(mood) {

    const moodMap = {

        "Action": "action",
        "Adventure": "adventure",
        "Comedy": "comedy",
        "Crime": "crime",
        "Drama": "drama",
        "Fantasy": "fantasy",
        "Horror": "horror",
        "Musical": "musical",
        "Mystery": "mystery",
        "Romance": "romance",
        "Science Fiction": "science-fiction",
        "Thriller": "thriller"

    };


    return moodMap[mood];

}


// ========================================================
// FETCH CONTENT
// ========================================================

async function fetchMovies(
    genre,
    type = "movie"
) {

    movieGrid.innerHTML = `
    <div class="movie-skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
    </div>

    <div class="movie-skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
    </div>

    <div class="movie-skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
    </div>

    <div class="movie-skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
    </div>

    <div class="movie-skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
    </div>

    <div class="movie-skeleton">
        <div class="skeleton-poster"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
    </div>
`;


    try {

        const params =
            new URLSearchParams({
                genre: genre,
                type: type
            });


        if (recommendationSignals.tone) {

            params.set(
                "tone",
                recommendationSignals.tone
            );

        }


        if (recommendationSignals.mood) {

            params.set(
                "mood",
                recommendationSignals.mood
            );

        }


        if (
            Array.isArray(
                recommendationSignals.themes
            ) &&
            recommendationSignals.themes.length > 0
        ) {

            params.set(
                "themes",
                JSON.stringify(
                    recommendationSignals.themes
                )
            );

        }


        console.log(
            "Fetching recommendations:",
            params.toString()
        );


        const response =
            await fetch(
                `/api/movies?${params.toString()}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Failed to fetch content"
            );

        }


        shows.length = 0;

        shows.push(...data);

        filterShows();

    }

    catch (error) {

        console.error(
            "Content API Error:",
            error
        );


        movieGrid.innerHTML = `
            <div class="no-results recommendation-error">
    <span class="empty-icon">⚠️</span>
    <strong>Something went wrong</strong>
    <span>We couldn't load your recommendations. Please try again.</span>
</div>
        `;

    }

}


// ========================================================
// ANALYZE MOOD
// ========================================================

async function analyzeMood() {

    const mood =
        emotionInput.value.trim();


    if (!mood) {

        alert(
            "Tell us how you're feeling first!"
        );

        return;

    }


    try {

        emotionButton.disabled = true;

        emotionButton.classList.add("loading");


        const originalText =
            emotionButton.textContent;


emotionButton.textContent =
    "Finding your matches...";


        movieGrid.innerHTML = `
    <p class="no-results">
        Finding your matches...
    </p>
`;

        const response =
            await fetch(
                "/api/mood",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            mood: mood
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Failed to analyze mood"
            );

        }


        console.log(
            "AI detected mood:",
            data
        );


        recommendationSignals = {

            tone:
                typeof data.tone === "string"
                    ? data.tone
                    : "",

            mood:
                typeof data.mood === "string"
                    ? data.mood
                    : "",

            themes:
                Array.isArray(data.themes)
                    ? data.themes
                    : []

        };


        console.log(
            "Recommendation signals:",
            recommendationSignals
        );


        selectedGenre =
            convertMoodToKey(
                data.genre
            );


        if (!selectedGenre) {

            throw new Error(
                "AI returned an unknown genre"
            );

        }


        selectedType = "all";


        contentFilters.forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.type === "all"
                );

            }
        );


        await fetchMovies(
            selectedGenre,
            "movie"
        );


        document
            .querySelector(
                "#recommendations"
            )
            ?.scrollIntoView({
                behavior: "smooth"
            });


        emotionButton.textContent =
            originalText;

    }

    catch (error) {

        console.error(
            "Mood API Error:",
            error
        );


        movieGrid.innerHTML = `
            <p class="no-results">
                Sorry, we couldn't understand your mood.
                Please try again.
            </p>
        `;

    }

    finally {

        emotionButton.disabled = false;

        emotionButton.classList.remove("loading");
emotionButton.textContent = "Find My Match →";

    }

}


// ========================================================
// EMOTION BUTTON
// ========================================================

if (emotionButton) {

    emotionButton.addEventListener(
        "click",
        analyzeMood
    );

}


// ========================================================
// FILTER SHOWS
// ========================================================

function filterShows() {

    let filteredShows = shows;


    if (
        selectedType !== "Anime" &&
        selectedGenre
    ) {

        filteredShows =
            filteredShows.filter(
                show =>
                    show.genre ===
                    selectedGenre
            );

    }


    displayShows(
        filteredShows
    );

}


// ========================================================
// MOOD CARD CLICK
// ========================================================

moodCards.forEach(card => {

    card.addEventListener(
        "click",
        async () => {

            const moodElement =
                card.querySelector(
                    ".mood-name"
                );


            if (!moodElement) {

                return;

            }


            const genreName =
                moodElement.textContent.trim();


            selectedGenre =
                convertMoodToKey(
                    genreName
                );


            selectedType = "all";


            recommendationSignals = {

                tone: "",
                mood: "",
                themes: []

            };


            contentFilters.forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );


                    if (
                        button.dataset.type ===
                        "all"
                    ) {

                        button.classList.add(
                            "active"
                        );

                    }

                }
            );


            if (!selectedGenre) {

                console.error(
                    "Unknown genre:",
                    genreName
                );

                return;

            }


            await fetchMovies(
                selectedGenre,
                "movie"
            );


            const recommendationSection =
                document.querySelector(
                    "#recommendations"
                );


            if (recommendationSection) {

                recommendationSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

});


// ========================================================
// CONTENT TYPE FILTER
// ========================================================

contentFilters.forEach(button => {

    button.addEventListener(
        "click",
        async () => {

            selectedType =
                button.dataset.type;


            contentFilters.forEach(
                btn => {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            if (!selectedGenre) {

                return;

            }


            if (
                selectedType === "all"
            ) {

                await fetchMovies(
                    selectedGenre,
                    "movie"
                );

                return;

            }


            if (
                selectedType === "Movie"
            ) {

                await fetchMovies(
                    selectedGenre,
                    "movie"
                );

                return;

            }


            if (
                selectedType === "Series"
            ) {

                await fetchMovies(
                    selectedGenre,
                    "series"
                );

                return;

            }


            if (
                selectedType === "Anime"
            ) {

                await fetchMovies(
                    selectedGenre,
                    "anime"
                );

                return;

            }


            if (
                selectedType === "KDrama"
            ) {

                await fetchMovies(
                    selectedGenre,
                    "kdrama"
                );

                return;

            }

        }
    );

});


// ========================================================
// CHARACTER COUNTER
// ========================================================

if (
    emotionInput &&
    characterCount
) {

    emotionInput.addEventListener("input", () => {
    characterCount.textContent =
        `${emotionInput.value.length} / 500`;
});
        
    

}


// ========================================================
// MOVIE DETAILS
// ========================================================

async function openMovieDetails(show) {

    console.log(
        "OPEN MOVIE DETAILS CALLED:",
        show
    );


    if (
        !show ||
        !show.id
    ) {

        console.error(
            "Movie ID not found:",
            show
        );

        return;

    }


    if (movieModal) {

        movieModal.classList.add(
            "active"
        );

    }


    if (movieDetails) {

        movieDetails.innerHTML = `
            <p class="no-results">
                Loading movie details...
            </p>
        `;

    }


    try {

        const mediaType =
            show.type === "Movie"
                ? "movie"
                : "tv";


        const response =
            await fetch(
                `/api/details?id=${show.id}&type=${mediaType}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Failed to load movie details"
            );

        }


        // =========================
        // GENRES
        // =========================

        const genreHTML =
            Array.isArray(data.genres) &&
            data.genres.length > 0

                ? data.genres
                    .map(
                        genre =>
                            `<span>${genre}</span>`
                    )
                    .join("")

                : "";


        // =========================
        // CAST
        // =========================

        const castHTML =
            Array.isArray(data.cast) &&
            data.cast.length > 0

                ? data.cast
                    .map(person => {

                        const personName =
                            person.name ||
                            "Unknown Actor";


                        const characterName =
                            person.character ||
                            "";


                        const googleSearch =
                            encodeURIComponent(
                                `${personName} actor`
                            );


                        return `

                            <a
                                href="https://www.google.com/search?q=${googleSearch}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="cast-card"
                                title="Search ${personName} on Google"
                            >

                                ${
                                    person.profile
                                        ? `
                                            <img
                                                src="${person.profile}"
                                                alt="${personName}"
                                            >
                                        `
                                        : `
                                            <div class="cast-placeholder">
                                                🎭
                                            </div>
                                        `
                                }


                                <div class="cast-info">

                                    <strong>
                                        ${personName}
                                    </strong>

                                    <span>
                                        ${
                                            characterName ||
                                            "Actor"
                                        }
                                    </span>

                                </div>

                            </a>

                        `;

                    })
                    .join("")

                : `
                    <p class="no-results">
                        Cast information unavailable.
                    </p>
                `;


        // =========================
        // DIRECTOR
        // =========================

        const directorHTML =
            Array.isArray(data.crew) &&
            data.crew.length > 0

                ? data.crew
                    .map(
                        person =>
                            person.name
                    )
                    .join(", ")

                : "N/A";


        // ========================================================
        // WATCH PROVIDERS
        // ========================================================

        const watchProviders =
            data.watchProviders || {};


        const watchLink =
            watchProviders.link ||
            null;


        // ========================================================
        // PROVIDER URL MAPPING
        // ========================================================

        function getProviderURL(
            providerName,
            title
        ) {

            const name =
                providerName
                    .toLowerCase()
                    .trim();


            const encodedTitle =
                encodeURIComponent(title);


            if (
                name.includes("netflix")
            ) {

                return `https://www.netflix.com/search?q=${encodedTitle}`;

            }


            if (
                name.includes("prime video") ||
                name.includes("amazon prime")
            ) {

                return `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`;

            }


            if (
                name.includes("jiohotstar") ||
                name.includes("hotstar")
            ) {

                return `https://www.hotstar.com/in/search?q=${encodedTitle}`;

            }


            if (
                name.includes("sony liv")
            ) {

                return `https://www.sonyliv.com/search?search=${encodedTitle}`;

            }


            if (
                name.includes("zee5")
            ) {

                return `https://www.zee5.com/search?q=${encodedTitle}`;

            }


            if (
                name.includes("crunchyroll")
            ) {

                return `https://www.crunchyroll.com/search?q=${encodedTitle}`;

            }


            if (
                name.includes("apple tv") ||
                name.includes("apple tv plus")
            ) {

                return `https://tv.apple.com/in/search?term=${encodedTitle}`;

            }


            if (
                name.includes("mx player")
            ) {

                return `https://www.mxplayer.in/search?query=${encodedTitle}`;

            }


            if (
                name === "aha"
            ) {

                return `https://www.aha.video/search?search=${encodedTitle}`;

            }


            if (
                name.includes("lionsgate")
            ) {

                return "https://www.lionsgateplay.com/";

            }


            if (
                name.includes("discovery+")
            ) {

                return "https://www.discoveryplus.in/";

            }


            return watchLink || "#";

        }


        // ========================================================
        // PROVIDER CARDS
        // ========================================================

        function createProviderCards(
            providers
        ) {

            if (
                !Array.isArray(providers) ||
                providers.length === 0
            ) {

                return "";

            }


            return providers
                .map(provider => {

                    const providerName =
                        provider.name ||
                        "Streaming Service";


                    const providerLogo =
                        provider.logo ||
                        null;


                    const providerURL =
                        getProviderURL(
                            providerName,
                            data.title
                        );


                    return `

                        <a
                            href="${providerURL}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="watch-provider"
                            title="Search ${data.title} on ${providerName}"
                        >

                            ${
                                providerLogo
                                    ? `
                                        <img
                                            src="${providerLogo}"
                                            alt="${providerName}"
                                        >
                                    `
                                    : ""
                            }


                            <span>
                                ${providerName}
                            </span>

                        </a>

                    `;

                })
                .join("");

        }


        // =========================
        // PROVIDER CATEGORIES
        // =========================

        const streamingHTML =
            createProviderCards(
                watchProviders.streaming
            );


        const freeHTML =
            createProviderCards(
                watchProviders.free
            );


        const rentHTML =
            createProviderCards(
                watchProviders.rent
            );


        const buyHTML =
            createProviderCards(
                watchProviders.buy
            );


        // =========================
        // WATCH PROVIDERS SECTION
        // =========================

        const hasProviders =
            streamingHTML ||
            freeHTML ||
            rentHTML ||
            buyHTML;


        let watchProvidersHTML = "";


        if (hasProviders) {

            watchProvidersHTML = `

                <div class="watch-section">

                    <div class="watch-section-header">

                        <h3>
                            Where to Watch
                        </h3>

                        <span class="watch-country">
                            🇮🇳 India
                        </span>

                    </div>


                    ${
                        streamingHTML
                            ? `
                                <div class="watch-category">

                                    <h4>
                                        Stream
                                    </h4>

                                    <div class="watch-providers">
                                        ${streamingHTML}
                                    </div>

                                </div>
                            `
                            : ""
                    }


                    ${
                        freeHTML
                            ? `
                                <div class="watch-category">

                                    <h4>
                                        Free
                                    </h4>

                                    <div class="watch-providers">
                                        ${freeHTML}
                                    </div>

                                </div>
                            `
                            : ""
                    }


                    ${
                        rentHTML
                            ? `
                                <div class="watch-category">

                                    <h4>
                                        Rent
                                    </h4>

                                    <div class="watch-providers">
                                        ${rentHTML}
                                    </div>

                                </div>
                            `
                            : ""
                    }


                    ${
                        buyHTML
                            ? `
                                <div class="watch-category">

                                    <h4>
                                        Buy
                                    </h4>

                                    <div class="watch-providers">
                                        ${buyHTML}
                                    </div>

                                </div>
                            `
                            : ""
                    }


                    <p class="watch-attribution">
                        Streaming availability provided by JustWatch.
                    </p>

                </div>

            `;

        }

        else {

            watchProvidersHTML = `

                <div class="watch-section">

                    <div class="watch-section-header">

                        <h3>
                            Where to Watch
                        </h3>

                        <span class="watch-country">
                            🇮🇳 India
                        </span>

                    </div>

                    <p class="watch-unavailable">
                        Streaming availability is currently unavailable.
                    </p>

                    <p class="watch-attribution">
                        Streaming availability provided by JustWatch.
                    </p>

                </div>

            `;

        }


        // =========================
        // EXTRA INFORMATION
        // =========================

        let extraInfo = "";


        if (
            data.type === "Movie" &&
            data.runtime
        ) {

            extraInfo = `
                <span>
                    ⏱️ ${data.runtime} min
                </span>
            `;

        }


        if (
            data.type === "Series" &&
            data.seasons
        ) {

            extraInfo = `
                <span>
                    📺 ${data.seasons}
                    season${data.seasons > 1 ? "s" : ""}
                </span>
            `;

        }


        // ========================================================
        // DISPLAY DETAILS
        // ========================================================

        movieDetails.innerHTML = `

            <div class="movie-details">

                <div>

                    <img
                        src="${data.poster}"
                        alt="${data.title}"
                        class="movie-details-poster"
                    >

                </div>


                <div class="movie-details-info">

                    <h2>
                        ${data.title}
                    </h2>


                    <div class="movie-details-meta">

                        <span>
                            ${data.year}
                        </span>

                        <span>
                            ${data.type}
                        </span>

                        <span class="movie-details-rating">
                            ⭐ ${Number(data.rating).toFixed(1)}
                        </span>

                        ${extraInfo}

                    </div>


                    <button
                        id="watchlist-button"
                        class="watchlist-button"
                        type="button"
                    >
                        + Add to Watchlist
                    </button>


                    ${
                        genreHTML
                            ? `
                                <div class="movie-details-genres">
                                    ${genreHTML}
                                </div>
                            `
                            : ""
                    }


                    <p class="movie-details-overview">

                        ${
                            data.overview ||
                            "No description available."
                        }

                    </p>


                    <p class="movie-details-director">

                        <strong>
                            Director:
                        </strong>

                        ${directorHTML}

                    </p>

                </div>

            </div>


            ${watchProvidersHTML}


            <div class="movie-cast-section">

                <h3>
                    Cast
                </h3>

                <div class="cast-grid">

                    ${castHTML}

                </div>

            </div>

        `;


        // ========================================================
        // WATCHLIST BUTTON
        // ========================================================

        const watchlistButton =
            document.getElementById(
                "watchlist-button"
            );


        if (!watchlistButton) {

            console.error(
                "Watchlist button was not found."
            );

            return;

        }


        // ========================================================
        // GET CURRENT USER
        // ========================================================

        const {
            data: {
                user
            },
            error: userError
        } =
            await supabaseClient.auth.getUser();


        if (userError) {

            console.error(
                "Could not get current user:",
                userError
            );

        }


        // ========================================================
        // LOGGED OUT
        // ========================================================

        if (!user) {

            watchlistButton.textContent =
                "Login to Add to Watchlist";


            watchlistButton.addEventListener(
                "click",
                () => {

                    goToAuth(
                        "Please login to add titles to your watchlist."
                    );

                }
            );


            return;

        }


        // ========================================================
        // CHECK WATCHLIST
        // ========================================================

        const {
            data: existingItem,
            error: checkError
        } =
            await supabaseClient
                .from("watchlist")
                .select("id")
                .eq(
                    "user_id",
                    user.id
                )
                .eq(
                    "tmdb_id",
                    data.id
                )
                .eq(
                    "media_type",
                    mediaType
                )
                .maybeSingle();


        if (checkError) {

            console.error(
                "Watchlist check error:",
                checkError
            );


            watchlistButton.textContent =
                "Unable to check Watchlist";

            return;

        }


        // ========================================================
        // INITIAL BUTTON STATE
        // ========================================================

        if (existingItem) {

            watchlistButton.textContent =
                "✓ Remove from Watchlist";


            watchlistButton.classList.add(
                "saved"
            );

        }

        else {

            watchlistButton.textContent =
                "+ Add to Watchlist";


            watchlistButton.classList.remove(
                "saved"
            );

        }


        // ========================================================
        // WATCHLIST CLICK
        // ========================================================

        watchlistButton.addEventListener(
            "click",
            async () => {

                watchlistButton.disabled =
                    true;


                try {

                    const {
                        data: currentItem,
                        error: currentError
                    } =
                        await supabaseClient
                            .from("watchlist")
                            .select("id")
                            .eq(
                                "user_id",
                                user.id
                            )
                            .eq(
                                "tmdb_id",
                                data.id
                            )
                            .eq(
                                "media_type",
                                mediaType
                            )
                            .maybeSingle();


                    if (currentError) {

                        throw currentError;

                    }


                    // =========================
                    // REMOVE
                    // =========================

                    if (currentItem) {

                        const {
                            error: deleteError
                        } =
                            await supabaseClient
                                .from("watchlist")
                                .delete()
                                .eq(
                                    "id",
                                    currentItem.id
                                )
                                .eq(
                                    "user_id",
                                    user.id
                                );


                        if (deleteError) {

                            throw deleteError;

                        }


                        watchlistButton.textContent =
                            "+ Add to Watchlist";


                        watchlistButton.classList.remove(
                            "saved"
                        );


                        await loadWatchlist();

                    }


                    // =========================
                    // ADD
                    // =========================

                    else {

                        const {
                            error: insertError
                        } =
                            await supabaseClient
                                .from("watchlist")
                                .insert({

                                    user_id:
                                        user.id,

                                    tmdb_id:
                                        data.id,

                                    title:
                                        data.title,

                                    media_type:
                                        mediaType,

                                    poster_path:
                                        data.poster ||
                                        null

                                });


                        if (insertError) {

                            throw insertError;

                        }


                        watchlistButton.textContent =
                            "✓ Remove from Watchlist";


                        watchlistButton.classList.add(
                            "saved"
                        );


                        await loadWatchlist();

                    }

                }

                catch (error) {

                    console.error(
                        "Watchlist error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Could not update your watchlist."
                    );

                }

                finally {

                    watchlistButton.disabled =
                        false;

                }

            }
        );

    }


    catch (error) {

        console.error(
            "Movie Details Error:",
            error
        );


        if (movieDetails) {

            movieDetails.innerHTML = `
                <p class="no-results">
                    Sorry, we couldn't load the details
                    for this title.
                </p>
            `;

        }

    }

}


// ========================================================
// CLOSE MODAL
// ========================================================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        () => {

            if (movieModal) {

                movieModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ========================================================
// CLOSE OUTSIDE MODAL
// ========================================================

if (movieModal) {

    movieModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                movieModal
            ) {

                movieModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ========================================================
// ESCAPE KEY
// ========================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            movieModal
        ) {

            movieModal.classList.remove(
                "active"
            );

        }

    }
);


// ========================================================
// UPDATE AUTH UI
// ========================================================

function updateAuthUI(user) {

    // Save current user globally

    currentUser =
        user || null;


    // =========================
    // UPDATE ACCOUNT NAV
    // =========================

    if (accountNavLink) {

        if (user) {

            accountNavLink.textContent =
                "✓ My Account";

        }

        else {

            accountNavLink.textContent =
                "Account";

        }

    }


    // =========================
    // UPDATE MOODMATCH ACCESS
    // =========================

    updateMoodMatchAccess(
        user
    );


    if (
        !authForm ||
        !loginTab ||
        !signupTab ||
        !authSubmit ||
        !authMessage ||
        !loggedInUser ||
        !userEmail ||
        !logoutButton
    ) {

        return;

    }


    // ========================================================
    // USER IS LOGGED IN
    // ========================================================

    if (user) {

        authForm.style.display =
            "none";


        if (authTabs) {

            authTabs.style.display =
                "none";

        }


        loggedInUser.style.display =
            "block";


        userEmail.textContent =
            user.email || "";


        showAuthMessage(
            "You're all set. Enjoy MoodMatch! 🎬",
            "success"
        );


        loadWatchlist();

    }


    // ========================================================
    // USER IS LOGGED OUT
    // ========================================================

    else {

        authForm.style.display =
            "block";


        if (authTabs) {

            authTabs.style.display =
                "grid";

        }


        loggedInUser.style.display =
            "none";


        userEmail.textContent =
            "";


        if (watchlistGrid) {

            watchlistGrid.innerHTML = "";

        }


        if (watchlistEmpty) {

            watchlistEmpty.style.display =
                "none";

        }

    }

}


// ========================================================
// SWITCH LOGIN / SIGN UP
// ========================================================

if (
    loginTab &&
    signupTab &&
    authSubmit &&
    authMessage
) {

    loginTab.addEventListener(
        "click",
        () => {

            authMode =
                "login";


            loginTab.classList.add(
                "active"
            );


            signupTab.classList.remove(
                "active"
            );


            authSubmit.textContent =
                "Login";


            if (authPassword) {

                authPassword.autocomplete =
                    "current-password";

            }


            showAuthMessage(
                "",
                "normal"
            );

        }
    );


    signupTab.addEventListener(
        "click",
        () => {

            authMode =
                "signup";


            signupTab.classList.add(
                "active"
            );


            loginTab.classList.remove(
                "active"
            );


            authSubmit.textContent =
                "Create Account";


            if (authPassword) {

                authPassword.autocomplete =
                    "new-password";

            }


            showAuthMessage(
                "",
                "normal"
            );

        }
    );

}


// ========================================================
// LOGIN / SIGN UP
// ========================================================

if (
    authForm &&
    authSubmit &&
    authMessage
) {

    authForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                authEmail
                    ? authEmail.value.trim()
                    : "";


            const password =
                authPassword
                    ? authPassword.value
                    : "";


            // =========================
            // VALIDATION
            // =========================

            if (!email) {

                showAuthMessage(
                    "Please enter your email address.",
                    "error"
                );

                return;

            }


            if (!password) {

                showAuthMessage(
                    "Please enter your password.",
                    "error"
                );

                return;

            }


            if (password.length < 6) {

                showAuthMessage(
                    "Your password must be at least 6 characters long.",
                    "error"
                );

                return;

            }


            // =========================
            // LOADING
            // =========================

            authSubmit.disabled =
                true;


            if (
                authMode === "signup"
            ) {

                authSubmit.textContent =
                    "Creating account...";

            }

            else {

                authSubmit.textContent =
                    "Signing in...";

            }


            showAuthMessage(
                "",
                "normal"
            );


            try {

                let result;


                // ========================================================
                // SIGN UP
                // ========================================================

                if (
                    authMode === "signup"
                ) {

                    result =
                        await supabaseClient.auth.signUp({
                            email,
                            password
                        });


                    if (result.error) {

                        throw result.error;

                    }


                    if (result.data?.session) {

                        showAuthMessage(
                            "Account created successfully! Welcome to MoodMatch 🎬",
                            "success"
                        );


                        authForm.reset();

                    }

                    else {

                        showAuthMessage(
                            "Account created! Please check your email to verify your account.",
                            "success"
                        );

                    }

                }


                // ========================================================
                // LOGIN
                // ========================================================

                else {

                    result =
                        await supabaseClient.auth.signInWithPassword({
                            email,
                            password
                        });


                    if (result.error) {

                        throw result.error;

                    }


                    showAuthMessage(
                        "Login successful! Welcome back to MoodMatch 🎬",
                        "success"
                    );


                    authForm.reset();

                }

            }

            catch (error) {

                console.error(
                    "Authentication error:",
                    error
                );


                showAuthMessage(
                    getFriendlyAuthError(error),
                    "error"
                );

            }

            finally {

                authSubmit.disabled =
                    false;


                authSubmit.textContent =
                    authMode === "login"
                        ? "Login"
                        : "Create Account";

            }

        }
    );

}


// ========================================================
// CHECK CURRENT SESSION
// ========================================================

async function checkAuthSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session error:",
                error.message
            );

            return;

        }


        updateAuthUI(
            data.session?.user ||
            null
        );

    }

    catch (error) {

        console.error(
            "Session check error:",
            error
        );

    }

}


// ========================================================
// LISTEN FOR AUTH CHANGES
// ========================================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "Auth state changed:",
            event
        );


        updateAuthUI(
            session?.user ||
            null
        );

    }
);


// ========================================================
// LOGOUT
// ========================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            logoutButton.disabled =
                true;


            logoutButton.textContent =
                "Logging out...";


            const {
                error
            } =
                await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error.message
                );


                showAuthMessage(
                    getFriendlyAuthError(error),
                    "error"
                );


                logoutButton.disabled =
                    false;


                logoutButton.textContent =
                    "Logout";


                return;

            }


            showAuthMessage(
                "You have been logged out successfully.",
                "success"
            );


            logoutButton.disabled =
                false;


            logoutButton.textContent =
                "Logout";

        }
    );

}


// ========================================================
// INITIAL SESSION CHECK
// ========================================================

checkAuthSession();


// ========================================================
// INITIAL WATCHLIST LOAD
// ========================================================

loadWatchlist();
// REGISTER PWA SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then(registration => {
                console.log(
                    "MoodMatch service worker registered:",
                    registration.scope
                );
            })
            .catch(error => {
                console.error(
                    "Service worker registration failed:",
                    error
                );
            });
    });
}