const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ========================================
// FALLBACK MOOD CLASSIFIER
// ========================================

function fallbackMoodClassifier(mood) {

    const text = mood.toLowerCase();

    const patterns = {

        horror: [
            "scary",
            "creepy",
            "ghost",
            "haunted",
            "terrifying",
            "frightening",
            "horror",
            "spooky"
        ],

        comedy: [
            "funny",
            "hilarious",
            "laugh",
            "laughing",
            "comedy",
            "cheer me up",
            "lighthearted"
        ],

        romance: [
            "romantic",
            "romance",
            "love",
            "relationship",
            "couple",
            "dating",
            "falling in love"
        ],

        action: [
            "action",
            "fight",
            "fighting",
            "battle",
            "adrenaline",
            "intense"
        ],

        adventure: [
            "adventure",
            "explore",
            "exploring",
            "journey",
            "quest",
            "discover"
        ],

        mystery: [
            "mystery",
            "mysterious",
            "puzzle",
            "clues",
            "solve",
            "unknown"
        ],

        thriller: [
            "thriller",
            "suspense",
            "suspenseful",
            "tension",
            "danger",
            "psychological"
        ],

        fantasy: [
            "fantasy",
            "magic",
            "magical",
            "wizard",
            "witch",
            "mythical"
        ],

        crime: [
            "crime",
            "criminal",
            "detective",
            "gangster",
            "mafia",
            "heist",
            "police"
        ],

        "science-fiction": [
            "sci-fi",
            "science fiction",
            "space",
            "future",
            "robot",
            "alien",
            "galaxy",
            "technology",
            "time travel"
        ],

        musical: [
            "musical",
            "music",
            "singing",
            "dance",
            "dancing"
        ],

        drama: [
            "sad",
            "emotional",
            "serious",
            "deep",
            "meaningful",
            "heartbreaking",
            "struggle",
            "philosophical",
            "reflective",
            "thought-provoking"
        ]

    };


    let bestGenre = null;
    let bestScore = 0;


    for (
        const [genre, keywords]
        of Object.entries(patterns)
    ) {

        let score = 0;

        for (
            const keyword of keywords
        ) {

            if (text.includes(keyword)) {
                score++;
            }

        }

        if (score > bestScore) {

            bestScore = score;
            bestGenre = genre;

        }

    }


    const genreNames = {

        action: "Action",
        adventure: "Adventure",
        comedy: "Comedy",
        crime: "Crime",
        drama: "Drama",
        fantasy: "Fantasy",
        horror: "Horror",
        musical: "Musical",
        mystery: "Mystery",
        romance: "Romance",
        "science-fiction": "Science Fiction",
        thriller: "Thriller"

    };


    const genre =
        bestGenre
            ? genreNames[bestGenre]
            : "Drama";


    // ========================================
    // ADDITIONAL MOOD SIGNALS
    // ========================================

    let tone = "balanced";
    let moodType = "general";
    let themes = [];


    if (
        text.includes("meaningful") ||
        text.includes("deep") ||
        text.includes("philosophical") ||
        text.includes("thought-provoking")
    ) {

        tone = "thought-provoking";
        moodType = "reflective";

        themes.push(
            "philosophical",
            "meaningful"
        );

    }


    if (
        text.includes("emotional") ||
        text.includes("heartbreaking") ||
        text.includes("sad")
    ) {

        tone = "emotional";
        moodType = "emotional";

        themes.push(
            "emotional",
            "human relationships"
        );

    }


    if (
        text.includes("dark") ||
        text.includes("disturbing")
    ) {

        tone = "dark";

        themes.push(
            "dark"
        );

    }


    if (
        text.includes("funny") ||
        text.includes("hilarious") ||
        text.includes("cheer me up")
    ) {

        tone = "lighthearted";
        moodType = "uplifting";

        themes.push(
            "humor",
            "fun"
        );

    }


    if (
        text.includes("romantic") ||
        text.includes("romance") ||
        text.includes("love")
    ) {

        themes.push(
            "love",
            "relationships"
        );

    }


    return {

        genre: genre,

        tone: tone,

        mood: moodType,

        themes: [
            ...new Set(themes)
        ]

    };

}


// ========================================
// GEMINI MOOD API
// ========================================

module.exports = async (req, res) => {

    try {

        if (req.method !== "POST") {
            return res.status(405).json({
                error: "Method not allowed"
            });
        }

        const { mood } = req.body || {};

        if (
            !mood ||
            typeof mood !== "string" ||
            !mood.trim()
        ) {
            return res.status(400).json({
                error: "Mood text is required"
            });
        }

        console.log(
            "Mood received:",
            mood
        );


        // ========================================
        // GEMINI PROMPT
        // ========================================

        const prompt = `
You are the mood-understanding engine for a movie recommendation application.

Analyze ONLY the user's mood/request.

Do NOT recommend movies.
Do NOT use movie databases.
Do NOT provide explanations.

Convert the user's natural-language request into structured recommendation signals.

Allowed genres:
Action
Adventure
Comedy
Crime
Drama
Fantasy
Horror
Musical
Mystery
Romance
Science Fiction
Thriller

Return ONLY valid JSON in exactly this format:

{
  "genre": "one allowed genre",
  "tone": "short description of the desired tone",
  "mood": "short description of the user's emotional state",
  "themes": ["theme1", "theme2"]
}

The genre must be exactly one of the allowed genres.

The tone, mood and themes should reflect what the user is looking for.

Example:

User:
"I want something philosophical and meaningful that makes me think about life."

Return:

{
  "genre": "Drama",
  "tone": "thought-provoking",
  "mood": "reflective",
  "themes": ["philosophical", "meaningful", "life"]
}

User:
"I want something funny and light that will cheer me up."

Return:

{
  "genre": "Comedy",
  "tone": "lighthearted",
  "mood": "uplifting",
  "themes": ["humor", "fun"]
}

User:
"I want a dark psychological story with lots of suspense."

Return:

{
  "genre": "Thriller",
  "tone": "dark and suspenseful",
  "mood": "tense",
  "themes": ["psychological", "suspense", "dark"]
}

User request:
${mood}
`;


        let response;

        let attempts = 0;
        const maxAttempts = 3;


        // ========================================
        // GEMINI REQUEST
        // ========================================

        while (
            attempts < maxAttempts
        ) {

            attempts++;


            try {

                console.log(
                    `Sending request to Gemini... Attempt ${attempts}/${maxAttempts}`
                );


                response =
                    await ai.models.generateContent({

                        model: "gemini-3.6-flash",

                        contents: prompt

                    });


                console.log(
                    "Gemini response received."
                );


                break;

            }

            catch (error) {

                console.error(
                    `Gemini attempt ${attempts} failed:`,
                    error.status ||
                    error.message
                );


                // ========================================
                // GEMINI QUOTA EXCEEDED
                // ========================================

                if (
                    error.status === 429 &&
                    (
                        error.message?.includes(
                            "exceeded your current quota"
                        ) ||
                        error.message?.includes(
                            "generate_content_free_tier_requests"
                        )
                    )
                ) {

                    console.log(
                        "Gemini quota reached. Using fallback."
                    );


                    return res.status(200).json({

                        ...fallbackMoodClassifier(
                            mood
                        ),

                        source: "fallback"

                    });

                }


                // ========================================
                // NON-RETRYABLE ERROR
                // ========================================

                if (
                    error.status !== 503 &&
                    error.status !== 429
                ) {

                    throw error;

                }


                // ========================================
                // RETRIES EXHAUSTED
                // ========================================

                if (
                    attempts >= maxAttempts
                ) {

                    console.log(
                        "Gemini unavailable. Using fallback."
                    );


                    return res.status(200).json({

                        ...fallbackMoodClassifier(
                            mood
                        ),

                        source: "fallback"

                    });

                }


                console.log(
                    "Temporary Gemini error. Retrying..."
                );


                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            1500
                        )
                );

            }

        }


        // ========================================
        // PARSE GEMINI RESPONSE
        // ========================================

        let rawText =
            response.text.trim();


        // Remove accidental markdown code fences

        rawText =
            rawText
                .replace(
                    /^```json\s*/i,
                    ""
                )
                .replace(
                    /^```\s*/i,
                    ""
                )
                .replace(
                    /\s*```$/i,
                    ""
                )
                .trim();


        let result;


        try {

            result =
                JSON.parse(
                    rawText
                );

        }

        catch (error) {

            console.log(
                "Invalid Gemini JSON. Using fallback."
            );


            return res.status(200).json({

                ...fallbackMoodClassifier(
                    mood
                ),

                source: "fallback"

            });

        }


        // ========================================
        // VALIDATE GENRE
        // ========================================

        const allowedGenres = [

            "Action",
            "Adventure",
            "Comedy",
            "Crime",
            "Drama",
            "Fantasy",
            "Horror",
            "Musical",
            "Mystery",
            "Romance",
            "Science Fiction",
            "Thriller"

        ];


        if (
            !allowedGenres.includes(
                result.genre
            )
        ) {

            console.log(
                "Invalid Gemini genre. Using fallback."
            );


            return res.status(200).json({

                ...fallbackMoodClassifier(
                    mood
                ),

                source: "fallback"

            });

        }


        // ========================================
        // NORMALIZE RESULT
        // ========================================

        const finalResult = {

            genre:
                result.genre,

            tone:
                typeof result.tone === "string"
                    ? result.tone
                    : "balanced",

            mood:
                typeof result.mood === "string"
                    ? result.mood
                    : "general",

            themes:
                Array.isArray(result.themes)
                    ? result.themes.slice(0, 5)
                    : [],

            source:
                "gemini"

        };


        console.log(
            "Detected mood:",
            finalResult
        );


        return res.status(200).json(
            finalResult
        );


    }

    catch (error) {

        console.error(
            "Gemini Mood Error:",
            error
        );


        // ========================================
        // FINAL FALLBACK
        // ========================================

        try {

            const fallback =
                fallbackMoodClassifier(
                    req.body?.mood || ""
                );


            return res.status(200).json({

                ...fallback,

                source: "fallback"

            });

        }

        catch {

            return res.status(500).json({

                error:
                    "Failed to analyze mood"

            });

        }

    }

};