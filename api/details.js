const { tmdbFetch } = require("./tmdb");

module.exports = async (req, res) => {

    try {

        // =========================
        // GET REQUEST PARAMETERS
        // =========================

        const id = req.query.id;

        const type =
            req.query.type || "movie";


        // =========================
        // VALIDATE ID
        // =========================

        if (!id) {

            return res.status(400).json({

                error:
                    "Content ID is required"

            });

        }


        // =========================
        // VALIDATE TYPE
        // =========================

        if (
            type !== "movie" &&
            type !== "tv"
        ) {

            return res.status(400).json({

                error:
                    "Invalid content type"

            });

        }


        // =========================
        // FETCH DETAILS + CREDITS
        // =========================

        const data =
            await tmdbFetch(
                `/${type}/${id}`,
                {

                    language:
                        "en-US",

                    append_to_response:
                        "credits"

                }
            );


        // =========================
        // FETCH WATCH PROVIDERS
        // INDIA = IN
        // =========================

        const providerData =
            await tmdbFetch(
                `/${type}/${id}/watch/providers`
            );


        // =========================
        // GET INDIA PROVIDERS
        // =========================

        const indiaProviders =
            providerData.results &&
            providerData.results.IN
                ? providerData.results.IN
                : {};


        // =========================
        // STREAMING PROVIDERS
        // =========================

        const streaming =
            Array.isArray(
                indiaProviders.flatrate
            )
                ? indiaProviders.flatrate.map(
                    provider => ({

                        name:
                            provider.provider_name,

                        logo:
                            provider.logo_path
                                ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
                                : null,

                        providerId:
                            provider.provider_id

                    })
                )
                : [];


        // =========================
        // FREE PROVIDERS
        // =========================

        const free =
            Array.isArray(
                indiaProviders.free
            )
                ? indiaProviders.free.map(
                    provider => ({

                        name:
                            provider.provider_name,

                        logo:
                            provider.logo_path
                                ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
                                : null,

                        providerId:
                            provider.provider_id

                    })
                )
                : [];


        // =========================
        // RENT PROVIDERS
        // =========================

        const rent =
            Array.isArray(
                indiaProviders.rent
            )
                ? indiaProviders.rent.map(
                    provider => ({

                        name:
                            provider.provider_name,

                        logo:
                            provider.logo_path
                                ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
                                : null,

                        providerId:
                            provider.provider_id

                    })
                )
                : [];


        // =========================
        // BUY PROVIDERS
        // =========================

        const buy =
            Array.isArray(
                indiaProviders.buy
            )
                ? indiaProviders.buy.map(
                    provider => ({

                        name:
                            provider.provider_name,

                        logo:
                            provider.logo_path
                                ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
                                : null,

                        providerId:
                            provider.provider_id

                    })
                )
                : [];


        // =========================
        // TITLE
        // =========================

        const title =
            type === "movie"
                ? data.title
                : data.name;


        // =========================
        // RELEASE DATE
        // =========================

        const releaseDate =
            type === "movie"
                ? data.release_date
                : data.first_air_date;


        // =========================
        // YEAR
        // =========================

        const year =
            releaseDate
                ? releaseDate.substring(0, 4)
                : "N/A";


        // =========================
        // GENRES
        // =========================

        const genres =
            Array.isArray(data.genres)
                ? data.genres.map(
                    genre =>
                        genre.name
                )
                : [];


        // =========================
        // POSTER
        // =========================

        const poster =
            data.poster_path
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                : null;


        // =========================
        // BACKDROP
        // =========================

        const backdrop =
            data.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
                : null;


        // =========================
        // CAST
        // =========================

        const cast =
            data.credits &&
            Array.isArray(
                data.credits.cast
            )

                ? data.credits.cast
                    .slice(0, 8)
                    .map(person => ({

                        name:
                            person.name,

                        character:
                            person.character,

                        profile:
                            person.profile_path
                                ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                : null

                    }))

                : [];


        // =========================
        // DIRECTOR
        // =========================

        const crew =
            data.credits &&
            Array.isArray(
                data.credits.crew
            )

                ? data.credits.crew
                    .filter(
                        person =>
                            person.job ===
                            "Director"
                    )
                    .slice(0, 3)
                    .map(person => ({

                        name:
                            person.name,

                        job:
                            person.job

                    }))

                : [];


        // =========================
        // SEND RESPONSE
        // =========================

        return res.status(200).json({

            // =====================
            // BASIC INFORMATION
            // =====================

            id:
                data.id,

            title:
                title || "Unknown",

            type:
                type === "movie"
                    ? "Movie"
                    : "Series",

            year:
                year,

            rating:
                data.vote_average || 0,

            overview:
                data.overview ||
                "No description available.",


            // =====================
            // VISUAL INFORMATION
            // =====================

            poster:
                poster,

            backdrop:
                backdrop,


            // =====================
            // GENRES
            // =====================

            genres:
                genres,


            // =====================
            // MOVIE / SERIES INFO
            // =====================

            runtime:
                data.runtime || null,

            seasons:
                data.number_of_seasons ||
                null,

            episodes:
                data.number_of_episodes ||
                null,


            // =====================
            // CAST & CREW
            // =====================

            cast:
                cast,

            crew:
                crew,


            // =====================
            // WATCH PROVIDERS
            // INDIA
            // =====================

            watchProviders: {

                country:
                    "IN",

                link:
                    indiaProviders.link ||
                    null,

                streaming:
                    streaming,

                free:
                    free,

                rent:
                    rent,

                buy:
                    buy

            }

        });

    }


    catch (error) {

        console.error(
            "TMDB Details Error:",
            error
        );


        return res.status(500).json({

            error:
                "Failed to fetch content details from TMDB"

        });

    }

};