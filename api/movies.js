const {
    tmdbFetch,
    tmdbKeywordSearch
} = require("./tmdb");


// ========================================
// HELPER: SCORE CONTENT
// ========================================
function scoreContent(item, signals) {

    const title =
        (
            item.title ||
            item.name ||
            ""
        ).toLowerCase();

    const overview =
        (
            item.overview ||
            ""
        ).toLowerCase();

    const text =
        `${title} ${overview}`;

    let score = 0;


    // ========================================
    // THEME MATCHING
    // ========================================

    const relatedTerms = {

        philosophical: [
            "philosophy",
            "philosophical",
            "existence",
            "meaning of life",
            "purpose",
            "human nature",
            "identity",
            "consciousness"
        ],

        meaningful: [
            "meaning",
            "life",
            "purpose",
            "humanity",
            "human nature",
            "journey",
            "life-changing"
        ],

        life: [
            "life",
            "existence",
            "living",
            "human",
            "humanity"
        ],

        reflective: [
            "reflection",
            "reflective",
            "memories",
            "past",
            "identity",
            "self-discovery"
        ],

        emotional: [
            "emotional",
            "grief",
            "loss",
            "love",
            "family",
            "relationship",
            "heart"
        ],

        psychological: [
            "psychological",
            "mind",
            "mental",
            "memory",
            "trauma",
            "identity"
        ],

        suspense: [
            "suspense",
            "mystery",
            "danger",
            "secret",
            "investigation"
        ],

        dark: [
            "dark",
            "death",
            "murder",
            "violence",
            "evil"
        ],

        humor: [
            "funny",
            "comedy",
            "humor",
            "laugh"
        ],

        fun: [
            "fun",
            "adventure",
            "comedy",
            "friends"
        ],

        love: [
            "love",
            "romance",
            "relationship",
            "couple"
        ],

        relationships: [
            "relationship",
            "family",
            "friendship",
            "couple",
            "love"
        ]
    };


    if (Array.isArray(signals.themes)) {

        signals.themes.forEach(theme => {

            const keyword =
                String(theme)
                    .toLowerCase()
                    .trim();

            if (!keyword) {
                return;
            }


            // Strong title match
            if (title.includes(keyword)) {
                score += 8;
            }


            // Strong overview match
            if (overview.includes(keyword)) {
                score += 5;
            }


            // Related concepts
            const related =
                relatedTerms[keyword] || [];

            related.forEach(term => {

                if (text.includes(term)) {
                    score += 2;
                }

            });

        });

    }


    // ========================================
    // TONE MATCHING
    // ========================================

    const tone =
        String(
            signals.tone || ""
        ).toLowerCase();


    const toneTerms = {

        "thought-provoking": [
            "philosophy",
            "philosophical",
            "meaning",
            "existence",
            "life",
            "human nature",
            "identity",
            "consciousness",
            "purpose"
        ],

        emotional: [
            "emotional",
            "love",
            "family",
            "grief",
            "loss",
            "relationship"
        ],

        dark: [
            "dark",
            "death",
            "murder",
            "violence",
            "psychological",
            "evil"
        ],

        lighthearted: [
            "funny",
            "comedy",
            "humor",
            "friendship",
            "fun"
        ],

        suspenseful: [
            "suspense",
            "mystery",
            "danger",
            "investigation",
            "secret"
        ]

    };


    const matchingToneTerms =
        toneTerms[tone] || [];


    matchingToneTerms.forEach(term => {

        if (text.includes(term)) {
            score += 3;
        }

    });


    // ========================================
    // MOOD MATCHING
    // ========================================

    const mood =
        String(
            signals.mood || ""
        ).toLowerCase();


    const moodTerms = {

        "thrill-seeking": [
            "danger",
            "suspense",
            "murder",
            "survival",
            "chase",
            "crime",
            "fear",
            "terror",
            "killer",
            "investigation"
        ],

        reflective: [
            "meaning",
            "life",
            "existence",
            "identity",
            "memories",
            "journey",
            "self-discovery"
        ],

        "comfort-seeking": [
            "family",
            "friendship",
            "home",
            "warm",
            "comfort",
            "feel-good",
            "love"
        ],

        romantic: [
            "love",
            "romance",
            "relationship",
            "couple",
            "heart"
        ],

        joyful: [
            "funny",
            "comedy",
            "friendship",
            "fun",
            "happy",
            "joy"
        ],

        melancholic: [
            "grief",
            "loss",
            "memories",
            "sad",
            "heartbreak",
            "emotional"
        ]

    };


    const matchingMoodTerms =
        moodTerms[mood] || [];


    matchingMoodTerms.forEach(term => {

        if (text.includes(term)) {
            score += 2.5;
        }

    });


    // ========================================
    // QUALITY SCORE
    // ========================================

    const rating =
        Number(
            item.vote_average || 0
        );

    const popularity =
        Number(
            item.popularity || 0
        );

    const voteCount =
        Number(
            item.vote_count || 0
        );


    // Good content should still matter
    score += rating * 1.5;


    // Avoid recommending obscure content
    // solely because it matches one keyword
    score += Math.min(
        voteCount / 1000,
        5
    );


    // Popularity provides a small discovery boost
    score += Math.min(
        popularity / 100,
        5
    );


    return score;
}


// ========================================
// DIVERSITY: DETECT RECOMMENDATION STYLE
// ========================================

function getRecommendationStyle(item) {

    const title =
        (
            item.title ||
            item.name ||
            ""
        ).toLowerCase();

    const overview =
        (
            item.overview ||
            ""
        ).toLowerCase();

    const text =
        `${title} ${overview}`;

    const styles = [];


    // ========================================
    // PSYCHOLOGICAL
    // ========================================

    const psychologicalTerms = [
        "psychological",
        "psychology",
        "mind",
        "mental",
        "trauma",
        "paranoia",
        "obsession",
        "hallucination",
        "memory",
        "identity",
        "sanity",
        "insanity",
        "delusion",
        "reality"
    ];

    if (
        psychologicalTerms.some(
            term => text.includes(term)
        )
    ) {

        styles.push("psychological");

    }


    // ========================================
    // SUPERNATURAL
    // ========================================

    const supernaturalTerms = [
        "ghost",
        "haunted",
        "demon",
        "demonic",
        "possession",
        "possessed",
        "supernatural",
        "spirit",
        "curse",
        "witch",
        "witchcraft",
        "occult",
        "paranormal"
    ];

    if (
        supernaturalTerms.some(
            term => text.includes(term)
        )
    ) {

        styles.push("supernatural");

    }


    // ========================================
    // MYSTERY
    // ========================================

    const mysteryTerms = [
        "mystery",
        "mysterious",
        "investigation",
        "detective",
        "detectives",
        "disappearance",
        "missing",
        "clue",
        "clues",
        "secret",
        "unsolved",
        "case"
    ];

    if (
        mysteryTerms.some(
            term => text.includes(term)
        )
    ) {

        styles.push("mystery");

    }


    // ========================================
    // HORROR / THRILLER
    // ========================================

    const thrillerTerms = [
        "suspense",
        "thriller",
        "danger",
        "survival",
        "chase",
        "killer",
        "murder",
        "tension",
        "terror",
        "fear",
        "escape"
    ];

    if (
        thrillerTerms.some(
            term => text.includes(term)
        )
    ) {

        styles.push("horror-thriller");

    }


    // ========================================
    // CREATURE / MONSTER
    // ========================================

    const creatureTerms = [
        "monster",
        "creature",
        "beast",
        "vampire",
        "zombie",
        "werewolf",
        "alien"
    ];

    if (
        creatureTerms.some(
            term => text.includes(term)
        )
    ) {

        styles.push("creature");

    }


    // ========================================
    // DARK / DISTURBING
    // ========================================

    const darkTerms = [
        "dark",
        "disturbing",
        "brutal",
        "violent",
        "death",
        "evil",
        "murder",
        "deadly"
    ];

    if (
        darkTerms.some(
            term => text.includes(term)
        )
    ) {

        styles.push("dark");

    }


    // ========================================
    // FALLBACK
    // ========================================

    if (styles.length === 0) {

        styles.push("general");

    }


    return styles;

}


// ========================================
// DIVERSITY: YEAR BUCKET
// ========================================

function getYearBucket(item) {

    const date =
        item.release_date ||
        item.first_air_date ||
        "";

    if (!date) {
        return "unknown";
    }

    const year =
        Number(
            date.substring(0, 4)
        );

    if (!year) {
        return "unknown";
    }

    if (year < 1990) {
        return "classic";
    }

    if (year < 2000) {
        return "90s";
    }

    if (year < 2010) {
        return "2000s";
    }

    if (year < 2020) {
        return "2010s";
    }

    return "recent";

}


// ========================================
// DIVERSITY: GENRE SIGNATURE
// ========================================

function getGenreSignature(item) {

    if (
        !Array.isArray(
            item.genre_ids
        )
    ) {

        return "unknown";

    }

    return [
        ...item.genre_ids
    ]
        .sort(
            (a, b) => a - b
        )
        .slice(0, 3)
        .join("-") || "unknown";

}


// ========================================
// DIVERSITY: SMART RERANKING
// ========================================

function diversifyResults(
    items,
    signals,
    limit = 20
) {

    if (
        !Array.isArray(items) ||
        items.length <= limit
    ) {

        return items;

    }


    // ========================================
    // FIRST: CALCULATE ORIGINAL SCORE
    // ========================================

    const candidates =
        items.map(
            item => ({

                item,

                score:
                    scoreContent(
                        item,
                        signals
                    )

            })
        );


    // ========================================
    // SORT BY ORIGINAL SCORE
    // ========================================

    candidates.sort(
        (a, b) =>
            b.score - a.score
    );


    // ========================================
    // KEEP A STRONG CANDIDATE POOL
    // ========================================

    const pool =
        candidates.slice(
            0,
            Math.min(
                candidates.length,
                50
            )
        );


    const selected = [];

    const styleCounts =
        new Map();

    const yearCounts =
        new Map();

    const genreCounts =
        new Map();


    // ========================================
    // GREEDY DIVERSITY SELECTION
    // ========================================

    while (
        selected.length < limit &&
        pool.length > 0
    ) {

        let bestIndex = 0;

        let bestAdjustedScore =
            -Infinity;


        pool.forEach(
            (candidate, index) => {

                const item =
                    candidate.item;

                const styles =
                    getRecommendationStyle(
                        item
                    );

                const yearBucket =
                    getYearBucket(
                        item
                    );

                const genreSignature =
                    getGenreSignature(
                        item
                    );


                let penalty = 0;


                // ========================================
                // STYLE REPETITION PENALTY
                // ========================================

                styles.forEach(
                    style => {

                        const count =
                            styleCounts.get(
                                style
                            ) || 0;

                        if (count >= 2) {

                            penalty +=
                                Math.min(
                                    count - 1,
                                    4
                                ) * 3;

                        }

                    }
                );


                // ========================================
                // YEAR REPETITION PENALTY
                // ========================================

                const yearCount =
                    yearCounts.get(
                        yearBucket
                    ) || 0;

                if (yearCount >= 3) {

                    penalty +=
                        Math.min(
                            yearCount - 2,
                            3
                        ) * 1.5;

                }


                // ========================================
                // GENRE COMBINATION PENALTY
                // ========================================

                const genreCount =
                    genreCounts.get(
                        genreSignature
                    ) || 0;

                if (genreCount >= 2) {

                    penalty +=
                        Math.min(
                            genreCount - 1,
                            3
                        ) * 2;

                }


                // ========================================
                // SMALL POPULARITY REPETITION PENALTY
                // ========================================

                const popularity =
                    Number(
                        item.popularity || 0
                    );

                const popularityTier =
                    popularity >= 100
                        ? "very-popular"
                        : popularity >= 40
                            ? "popular"
                            : "discovery";


                const popularityCount =
                    selected.filter(
                        selectedItem => {

                            const selectedPopularity =
                                Number(
                                    selectedItem.popularity ||
                                    0
                                );

                            const selectedTier =
                                selectedPopularity >= 100
                                    ? "very-popular"
                                    : selectedPopularity >= 40
                                        ? "popular"
                                        : "discovery";

                            return (
                                selectedTier ===
                                popularityTier
                            );

                        }
                    ).length;


                if (
                    popularityCount >= 6
                ) {

                    penalty += 1;

                }


                // ========================================
                // FINAL ADJUSTED SCORE
                // ========================================

                const adjustedScore =
                    candidate.score -
                    penalty;


                if (
                    adjustedScore >
                    bestAdjustedScore
                ) {

                    bestAdjustedScore =
                        adjustedScore;

                    bestIndex =
                        index;

                }

            }
        );


        // ========================================
        // SELECT WINNER
        // ========================================

        const winner =
            pool.splice(
                bestIndex,
                1
            )[0];


        const winnerItem =
            winner.item;


        selected.push(
            winnerItem
        );


        // ========================================
        // UPDATE COUNTERS
        // ========================================

        const winnerStyles =
            getRecommendationStyle(
                winnerItem
            );

        winnerStyles.forEach(
            style => {

                styleCounts.set(
                    style,
                    (
                        styleCounts.get(
                            style
                        ) || 0
                    ) + 1
                );

            }
        );


        const winnerYear =
            getYearBucket(
                winnerItem
            );

        yearCounts.set(
            winnerYear,
            (
                yearCounts.get(
                    winnerYear
                ) || 0
            ) + 1
        );


        const winnerGenre =
            getGenreSignature(
                winnerItem
            );

        genreCounts.set(
            winnerGenre,
            (
                genreCounts.get(
                    winnerGenre
                ) || 0
            ) + 1
        );

    }


    return selected;

}


// ========================================
// SEARCH TMDB KEYWORD
// ========================================

async function searchKeywordId(keyword) {

    try {

        const data =
            await tmdbKeywordSearch(
                keyword
            );

        return data;

    }

    catch (error) {

        console.error(
            `Keyword search failed for "${keyword}":`,
            error.message
        );

        return null;

    }

}


// ========================================
// MOVIES API
// ========================================

module.exports = async (req, res) => {

    try {

        const genre =
            req.query.genre;

        const type =
            req.query.type || "movie";


        if (!genre) {

            return res.status(400).json({

                error:
                    "Genre is required"

            });

        }


        // ========================================
        // READ AI SIGNALS
        // ========================================

        const tone =
            req.query.tone || "";

        const mood =
            req.query.mood || "";


        let themes = [];


        if (
            req.query.themes
        ) {

            try {

                themes =
                    JSON.parse(
                        req.query.themes
                    );

            }

            catch {

                themes =
                    req.query.themes
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        );

            }

        }


        const signals = {

            tone,
            mood,
            themes

        };


        console.log(
            "Recommendation signals:",
            signals
        );


        // ========================================
        // GENRE MAPS
        // ========================================

        const genreMap = {

            action: 28,
            adventure: 12,
            comedy: 35,
            crime: 80,
            drama: 18,
            fantasy: 14,
            horror: 27,
            musical: 10402,
            mystery: 9648,
            romance: 10749,
            "science-fiction": 878,
            thriller: 53

        };


        const tvGenreMap = {

            action: 10759,
            adventure: 10759,
            comedy: 35,
            crime: 80,
            drama: 18,
            fantasy: 10765,
            horror: 10765,
            mystery: 9648,
            romance: 10749,
            "science-fiction": 10765,
            thriller: 9648

        };


        // ========================================
        // ANIME
        // ========================================

        if (
            type === "anime"
        ) {

            const animeGenreMap = {

                action: 10759,
                adventure: 10759,
                comedy: 35,
                crime: 80,
                drama: 18,
                fantasy: 10765,
                mystery: 9648,
                romance: 10749,
                "science-fiction": 10765

            };


            const animeKeywordMap = {

                horror: "horror",
                thriller: "thriller",
                musical: "music"

            };


            const animeGenreId =
                animeGenreMap[genre];


            const keywordName =
                animeKeywordMap[genre];


            const animeParams = {

                with_genres: "16",

                with_original_language:
                    "ja",

                sort_by:
                    "popularity.desc",

                language:
                    "en-US",

                page:
                    1

            };


            if (
                animeGenreId
            ) {

                animeParams.with_genres =
                    `16,${animeGenreId}`;

            }


            if (
                keywordName
            ) {

                const keywordId =
                    await searchKeywordId(
                        keywordName
                    );


                if (
                    keywordId
                ) {

                    animeParams.with_keywords =
                        keywordId;

                }

            }


            const data =
                await tmdbFetch(
                    "/discover/tv",
                    animeParams
                );


            const results =
                data.results || [];


            // Rank anime too
            results.sort(
                (a, b) =>
                    scoreContent(
                        b,
                        signals
                    ) -
                    scoreContent(
                        a,
                        signals
                    )
            );


            return res.status(200).json(

                results.map(item => ({

                    id:
        item.id,

                    title:
                        item.name,

                    type:
                        "Anime",

                    genre:
                        "anime",

                    year:
                        item.first_air_date
                            ? item.first_air_date
                                .substring(0, 4)
                            : "N/A",

                    rating:
                        item.vote_average,

                    poster:
                        item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : null

                }))

            );

        }


        // ========================================
        // K-DRAMA
        // ========================================

        if (
            type === "kdrama"
        ) {

            const kdramaGenreId =
                tvGenreMap[genre];


            if (!kdramaGenreId) {

                return res.status(400).json({

                    error:
                        "K-Drama recommendations are not available for this genre"

                });

            }


            const kdramaResults = [];


            for (
                let page = 1;
                page <= 3;
                page++
            ) {

                const data =
                    await tmdbFetch(
                        "/discover/tv",
                        {

                            with_genres:
                                kdramaGenreId,

                            with_origin_country:
                                "KR",

                            with_original_language:
                                "ko",

                            sort_by:
                                "popularity.desc",

                            language:
                                "en-US",

                            page:
                                page

                        }
                    );


                kdramaResults.push(
                    ...(data.results || [])
                );

            }


            // ========================================
            // REMOVE DUPLICATES
            // ========================================

            const uniqueKDramaResults =
                Array.from(

                    new Map(

                        kdramaResults.map(
                            item => [
                                item.id,
                                item
                            ]
                        )

                    ).values()

                );


            // ========================================
            // SMART RANKING + DIVERSITY
            // ========================================

            const diversifiedKDramaResults =
                diversifyResults(
                    uniqueKDramaResults,
                    signals,
                    20
                );


            // ========================================
            // TOP K-DRAMA RESULTS
            // ========================================

            const results =
                diversifiedKDramaResults
                    .map(item => ({

                        id:
                item.id,

                        title:
                            item.name,

                        type:
                            "K-Drama",

                        genre:
                            genre,

                        year:
                            item.first_air_date
                                ? item.first_air_date
                                    .substring(0, 4)
                                : "N/A",

                        rating:
                            item.vote_average,

                        poster:
                            item.poster_path
                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                : null

                    }));


            return res.status(200).json(
                results
            );

        }


        // ========================================
        // MOVIE / SERIES
        // ========================================

        let endpoint;

        let genreId;


        if (
            type === "movie"
        ) {

            endpoint =
                "/discover/movie";

            genreId =
                genreMap[genre];

        }

        else if (
            type === "series"
        ) {

            endpoint =
                "/discover/tv";

            genreId =
                tvGenreMap[genre];

        }

        else {

            return res.status(400).json({

                error:
                    "Invalid content type"

            });

        }


        if (!genreId) {

            return res.status(400).json({

                error:
                    "Invalid genre"

            });

        }


        // ========================================
        // FETCH MULTIPLE PAGES
        // ========================================

        let allResults = [];


        for (
            let page = 1;
            page <= 3;
            page++
        ) {

            const data =
                await tmdbFetch(
                    endpoint,
                    {

                        with_genres:
                            genreId,

                        sort_by:
                            "popularity.desc",

                        language:
                            "en-US",

                        page:
                            page

                    }
                );


            allResults.push(
                ...(data.results || [])
            );

        }


        // ========================================
        // REMOVE DUPLICATES
        // ========================================

        const uniqueResults =
            Array.from(

                new Map(

                    allResults.map(
                        item => [
                            item.id,
                            item
                        ]
                    )

                ).values()

            );


        // ========================================
        // SMART RANKING + DIVERSITY
        // ========================================

        const diversifiedResults =
            diversifyResults(
                uniqueResults,
                signals,
                20
            );


        // ========================================
        // TOP RESULTS
        // ========================================

        const results =
            diversifiedResults
                .map(item => ({

                    id:
                item.id,

                    title:
                        type === "movie"
                            ? item.title
                            : item.name,

                    type:
                        type === "movie"
                            ? "Movie"
                            : "Series",

                    genre:
                        genre,

                    year:
                        type === "movie"
                            ? (
                                item.release_date
                                    ? item.release_date
                                        .substring(0, 4)
                                    : "N/A"
                            )
                            : (
                                item.first_air_date
                                    ? item.first_air_date
                                        .substring(0, 4)
                                    : "N/A"
                            ),

                    rating:
                        item.vote_average,

                    poster:
                        item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : null

                }));


        return res.status(200).json(
            results
        );


    }

    catch (error) {

        console.error(
            "TMDB Error:",
            error
        );


        return res.status(500).json({

            error:
                "Failed to fetch content from TMDB"

        });

    }

};